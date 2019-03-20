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

需要有 debug symbol

```c
(gdb) info macro ISDIGIT // 這個 macro 的定義
#define ISDIGIT(Ch) __isdigit_l (Ch, loc)
(gdb) macro expand ISDIGIT ((UCHAR_T) *f) // 遞迴展開所有 macro
expands to: ({ int __c = ((unsigned char) *f); __c >= '0' && __c <= '9'; })
```

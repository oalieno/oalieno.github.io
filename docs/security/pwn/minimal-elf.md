如何製造出最小的可執行 ELF 64-bit executable

## 原始碼

```asm linenums="1"
org 0x0000555555554000

ehdr:
db    0x7f, "ELF", 2, 1, 1, 0    ; e_ident
dq    0
dw    2                          ; e_type (EXEC)
dw    0x3e                       ; e_machine (x86_64)
dd    1                          ; e_version
dq    _start                     ; e_entry
dq    phdr - $$                  ; e_phoff
dq    0                          ; e_shoff
dd    0                          ; e_flags
dw    ehdrsize                   ; e_ehsize
dw    phdrsize                   ; e_phentsize
dw    1                          ; e_phnum
dw    0                          ; e_shentsize
dw    0                          ; e_shnum
dw    0                          ; e_shstrndx

ehdrsize equ $ - ehdr

phdr:
dd    1                          ; p_type (PT_LOAD)
dd    5                          ; p_flags
dq    0                          ; p_offset
dq    $$                         ; p_vaddr
dq    $$                         ; p_paddr
dq    filesize                   ; p_filesz
dq    filesize                   ; p_memsz
dq    0x1000                     ; p_align

phdrsize equ $ - phdr

_start:
mov al, 60
syscall

filesize equ $ - $$
```

??? info "$ 和 $$ 是什麼?[^1]"
    `$`  代表目前的位址

    `$$` 代表目前 section 開頭的位址 ( 在這個例子是 0x0000555555554000 )

## 編譯

```
nasm tiny.asm
```

## 解釋

### ELF structure

[wikipedia](https://en.wikipedia.org/wiki/Executable_and_Linkable_Format) 寫得很清楚

也可以看這個線上 glibc 的原始碼 [glibc/elf/elf.h](https://code.woboq.org/userspace/glibc/elf/elf.h.html)

或是 man page 也有

```bash
man elf
```

### 第一部分 : ELF header

```asm linenums="1"
org 0x0000555555554000
```

沒有開 ASLR 的時候，一般的 ELF 都會從 `0x0000555555554000` 這個位址開始，所以我們也從這個位址開始

```asm linenums="4"
db    0x7f, "ELF", 2, 1, 1, 0    ; e_ident
dq    0
```

比較重要的就是那個 `2` 代表 64-bit
剩下的就不太重要了，可以忽略不看  
其實也就是編一個正常的 ELF 64-bit executable 參考一下

```asm linenums="9"
dq    _start                     ; e_entry
```

這裡要填的是程式的入口點，也就是我們定義的 `_start`

```asm linenums="10"
dq    phdr - $$                  ; e_phoff
dq    0                          ; e_shoff
```

因為 secion header table 在執行的時候不會用到，所以我們只要構造 program header table  
所以 section header table 的 offset 就填 0 就好

### 第二部分 : program header table

```asm linenums="24"
dd    5                          ; p_flags
```

這裡填 `5` 代表這個段可讀可執行，這樣我們的下面的 `_start` 才可以執行

```asm linenums="25"
dq    0                          ; p_offset
dq    $$                         ; p_vaddr
dq    $$                         ; p_paddr
```

因為總共就只有一個段，包含了整個檔案連同前面的 ELF header 和後面的 `_start` 一起，所以段的開頭在 ELF header 的開頭  
`p_offset` 是指這個段在檔案中的偏移，所以是 0  
`p_vaddr` 是指這個段在記憶體中的位址，所以是 `$$`  
`p_paddr` 基本上跟 `p_vaddr` 一樣

### 第三部分 : assembly code

```asm linenums="34"
_start:
mov al, 60
syscall
```

這裡就是叫 `sys_exit` 讓程式正常結束  
一般不會特別需要在程式結束的時候寫 `sys_exit` 是因為 glibc 幫你做好這些事了

### gdb

我們可以用 gdb 把程式跑起來看看  
用 `starti` 停在程式入口點  
看起來好舒爽

<img style="width: 600px" src="https://i.imgur.com/8TxothG.png">

## 總結

最後我們的 ELF 64-bit executable 共 **124 bytes**  
已經很短了但還可以更短  
比如說把一些結構重疊在一起進而減少空間  
不過這只是個小小練習就不再花時間了

[^1]:
    https://www.nasm.us/doc/nasmdoc3.html#section-3.5
[^2]:
    https://www.muppetlabs.com/~breadbox/software/tiny/teensy.html

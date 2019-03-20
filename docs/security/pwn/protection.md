# 保護機制

使用 checksec 來查看保護機制

## RELRO

Partial RELRO: GOT writable

Full RELRO: GOT read only, no `link_map` and `dl_resolver` pointer

```
No RELRO : gcc -Wl,-z,norelro code.c
Partial RELRO : GCC COMPILE DEFAULT
Full RELRO : gcc -Wl,-z,relro,-z,now code.c
```
 
## CANARY

[stack overflow - gcc generate canary or not](https://stackoverflow.com/questions/24465014/gcc-generate-canary-or-not)

當 buffer 夠大時，gcc 會自動加 canary

```
Enable: GCC COMPILE DEFAULT (when buffer large enough)
Disable : gcc -fno-stack-protector code.c
```

## NX (No-Execute) / DEP (Data Execution Prevention)

可以寫的地方不能執行

```
Enable : GCC COMPILE DEFAULT
Enable : execstack -s code
Disable : gcc -z execstack code.c
Disable : execstack -c code
```

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

位置隨機化

```
Enable : gcc -fpie -pie code.c
Disable : GCC COMPILE DEFAULT
```

## FRAME POINTER

不知道算不算保護 O_O ?

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

```
Enable GCC COMPILE DEFAULT
Disable : gcc -fomit-frame-pointer code.c
```

## Signal

一支程式接到 signal 後  
1. kernel 會幫你把上下文 ( 各種暫存器 ) 保留到 stack 上，叫做 Signal Frame  
2. 跳回 user mode，讓 signal handler 處理  
3. signal handler 處理完會 return 回 `__restore_rt`，這個 function 裡面就是 `mov rax, 0xf; syscall`，去呼叫 `sys_rt_sigreturn` syscall，把上下文恢復 Signal Frame

## SigReturn ROP

在做 ROP 的時候需要設定許多暫存器的值  
這時候就可以用 SROP 的技巧  
自己在 stack 上擺好 Signal Frame，然後呼叫 `sys_rt_sigreturn` syscall  
就可以一次設定好所有的暫存器  
缺點是需要夠大的空間塞下整個 Signal Frame

## CTF 題目

[pwnable.kr - unexploitable](http://pwnable.kr)

[^1]:
    http://weaponx.site/2017/02/28/unexploitable-Writeup-pwnable-kr/

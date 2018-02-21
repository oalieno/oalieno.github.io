# 費馬小定理

$a$ 是一個整數，$p$ 是一個質數

$a^p \equiv a \pmod{p}$

當 $gcd(a, p) = 1$

$a^{p-1} \equiv 1 \pmod{p}$

the converse of **fermat's little theorem** is not generally true, as it fails for Carmichael numbers

### 歐拉定理 ( Euler's Theorem )

兩個整數 $a$ 和 $n$ 滿足 $gcd(a,n) = 1$

$a^{\varphi(n)} \equiv 1 \pmod{n}$

費馬小定理是歐拉定理的一個特例 ( 當 $n$ 是質數，$\varphi(n) = n - 1$ )

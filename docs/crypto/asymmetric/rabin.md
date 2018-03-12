# Rabin

Rabin 是 RSA 在 $e = 2$ 的特例

我們可以發現當 RSA 的 $e = 2$，我們可以正常加密，但沒辦法正常解密

因為 $(p-1)(q-1)$ 會是偶數，而 $gcd(e, (p-1)(q-1)) \ne 1$，無法計算模反元素 $d$

所以必須另外想方法解密，而這個特例就是 Rabin

### 產生密鑰

選兩個質數 $p$ and $q$ ( $p \ne q$ )

$N = p \times q$

公鑰是 $N$，私鑰是 $(p, q)$

### 加密

明文 $m$，密文 $c$

$m^2 \equiv c \pmod{N}$

### 解密

$\sqrt{c} \equiv \pm m_p \pmod{p}$

$\sqrt{c} \equiv \pm m_q \pmod{q}$

使用中國剩餘定理計算在模 $N = pq$ 下的解

有四組解

$+ m_p \cdot q \cdot y_q + m_q \cdot p \cdot y_p \mod N$

$+ m_p \cdot q \cdot y_q - m_q \cdot p \cdot y_p \mod N$

$- m_p \cdot q \cdot y_q + m_q \cdot p \cdot y_p \mod N$

$- m_p \cdot q \cdot y_q - m_q \cdot p \cdot y_p \mod N$

### 模開方根

當 $p \equiv q \equiv 3 \pmod{4}$

$m_p \equiv c^{\frac{1}{4}(p+1)} \pmod{p}$

$m_q \equiv c^{\frac{1}{4}(q+1)} \pmod{q}$

而一般情況下，則使用 Tonelli-Shanks Algorithm ( 看看這個 [blog](https://eli.thegreenplace.net/2009/03/07/computing-modular-square-roots-in-python) 或這篇 [Square Roots from 1;24,51,10 to Dan Shanks](http://www.math.vt.edu/people/brown/doc/sqrts.pdf) )

### CTF 題目

[HITCON CTF 2015 Quals - Rsabin](https://ctftime.org/task/1753)

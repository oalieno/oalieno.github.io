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

計算 $m_p, m_q$

$m_p = \sqrt{c} \pmod{p}$

$m_q = \sqrt{c} \pmod{q}$

使用擴展歐基里得計算 $y_p, y_q$

$y_p \cdot p + y_q \cdot q = 1$

解出四組明文 $r, -r, s, -s$

$r \equiv (y_p \cdot p \cdot m_q + y_q \cdot q \cdot m_p) \pmod{N}$

$-r \equiv N - r \pmod{N}$

$s \equiv (y_p \cdot p \cdot m_q - y_q \cdot q \cdot m_p) \pmod{N}$

$-s \equiv N - s \pmod{N}$

其中一組是明文

### 模開方根

當 $p \equiv q \equiv 3 \pmod{4}$

$m_p \equiv c^{\frac{1}{4}(p+1)} \pmod{p}$

$m_q \equiv c^{\frac{1}{4}(q+1)} \pmod{q}$

而一般情況下，則使用 Tonelli-Shanks Algorithm ( 看看這個 [blog](https://eli.thegreenplace.net/2009/03/07/computing-modular-square-roots-in-python) 或這篇 [Square Roots from 1;24,51,10 to Dan Shanks](http://www.math.vt.edu/people/brown/doc/sqrts.pdf) )

### CTF 題目

[HITCON CTF 2015 Quals - Rsabin](https://ctftime.org/task/1753)

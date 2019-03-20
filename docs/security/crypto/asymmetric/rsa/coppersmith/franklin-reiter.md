# Franklin-Reiter Related Message Attack

假設我們有公鑰 $(n, e)$

使用公鑰加密兩個明文 $m_1, m_2$ 為 $c_1, c_2$，且兩個明文滿足 $m_1 = f(m_2)$，$f$ 是在模 $n$ 下的多項式

$m_1^e \equiv c_1 \pmod{n}$，那麼 $m_2$ 是 $g_1(x) = f(x)^e - c_1 \in \mathbb{Z}_{n}[x]$ 的根

$m_2^e \equiv c_2 \pmod{n}$，那麼 $m_2$ 是 $g_2(x) = x^e - c_2 \in \mathbb{Z}_{n}[x]$ 的根

所以 $x - m_2$ 可以整除 $g_1, g_2$

我們只要計算 $gcd(g_1, g_2)$ 就可以解出 $m_2$

**注意到上面的計算包括多項式都是在模 $n$ 下計算**

而當 $e = 3$ 且 $f(x) = ax + b$ 時

$$
m_2 = \frac{b}{a}\frac{c_1 + 2a^3c_2 - b^3}{c_1 - a^3c_2 + 2b^3}
$$

### CTF 題目

[HITCON CTF QUALS 2014 - rsaha](https://github.com/ctfs/write-ups-2014/tree/master/hitcon-ctf-2014/rsaha)

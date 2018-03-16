# Coppersmith Attack

### Håstad's Broadcast Attack

假設某人將同一個訊息 $m$ 使用不同的 $N_1, N_2, \cdots N_k$ 相同的 $e = 3$ 加密成 $c_1, c_2, \cdots c_k$ 送給 $k$ 個人

只要 $k \ge e = 3$，我們就可以解出 $m$

$$
m^3 \equiv c_1 \pmod{N_1} \\
m^3 \equiv c_2 \pmod{N_2} \\
m^3 \equiv c_3 \pmod{N_3}
$$

根據中國剩餘定理，$m^3$ 在模 $N_1N_2N_3$ 下有一個唯一解 $c$

也就是 $m^3 \equiv c \pmod{N_1N_2N_3}$

而因為 $m \lt N_i\ \forall 1 \le i \le 3$，所以 $m^3 \lt N_1N_2N_3$，所以 $m^3 = c$

那我們用求出 $c$ 後就可以解出 $m = \sqrt[3]{c}$

### Franklin-Reiter Related Message Attack

假設我們有公鑰 $(N, e)$

使用公鑰加密兩個明文 $m_1, m_2$ 為 $c_1, c_2$，且兩個明文滿足 $m_1 = f(m_2)$，$f$ 是在模 $N$ 下的多項式

$m_1^e \equiv c_1 \pmod{N}$，那麼 $m_2$ 是 $g_1(x) = f(x)^e - c_1 \in \mathbb{Z}_{N}[x]$ 的根

$m_2^e \equiv c_2 \pmod{N}$，那麼 $m_2$ 是 $g_2(x) = x^e - c_2 \in \mathbb{Z}_{N}[x]$ 的根

所以 $x - m_2$ 可以整除 $g_1, g_2$

我們只要計算 $gcd(g_1, g_2)$ 就可以解出 $m_2$

**注意到上面的計算包括多項式都是在模 $N$ 下計算**

而當 $e = 3$ 且 $f(x) = ax + b$ 時

$$
m_2 = \frac{b}{a}\frac{c_1 + 2a^3c_2 - b^3}{c_1 - a^3c_2 + 2b^3}
$$

[HITCON CTF 2014 - rsaha](https://github.com/ctfs/write-ups-2014/tree/master/hitcon-ctf-2014/rsaha)

### Coppersmith’s Short-Pad Attack

### 相關資源

[A New Related Message Attack on RSA](https://www.iacr.org/archive/pkc2005/33860001/33860001.pdf)

[Low-Exponent RSA with Related Messages](https://www.cs.unc.edu/~reiter/papers/1996/Eurocrypt.pdf)

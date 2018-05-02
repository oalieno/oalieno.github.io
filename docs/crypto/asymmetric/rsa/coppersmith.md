# Coppersmith Attack

### Coppersmith Method

給整數 $n$，$f \in \mathbb{Z}[x]$ 是一個 degree $d$ 的 monic polynomial

用 coppersmith method 可以找到所有 $x_0 < n^{\frac{1}{d} - \epsilon}, \frac{1}{d} > \epsilon > 0$ 使得 $f(x_0) = 0$ 

在 sage 中的實作叫做 `small_root`

### Håstad's Broadcast Attack

假設某人將同一個訊息 $m$ 使用不同的 $n_1, n_2, \cdots n_k$ 相同的 $e = 3$ 加密成 $c_1, c_2, \cdots c_k$ 送給 $k$ 個人

只要 $k \ge e = 3$，我們就可以解出 $m$

$$
m^3 \equiv c_1 \pmod{n_1} \\
m^3 \equiv c_2 \pmod{n_2} \\
m^3 \equiv c_3 \pmod{n_3}
$$

根據中國剩餘定理，$m^3$ 在模 $n_1n_2n_3$ 下有一個唯一解 $c$

也就是 $m^3 \equiv c \pmod{n_1n_2n_3}$

而因為 $m \lt n_i\ \forall 1 \le i \le 3$，所以 $m^3 \lt n_1n_2n_3$，所以 $m^3 = c$

那我們用求出 $c$ 後就可以解出 $m = \sqrt[3]{c}$

### Franklin-Reiter Related Message Attack

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

[HITCON CTF 2014 - rsaha](https://github.com/ctfs/write-ups-2014/tree/master/hitcon-ctf-2014/rsaha)

### Coppersmith’s Short-Pad Attack

假設我們有公鑰 $(n, e)$

使用公鑰加密兩個明文 $m_1, m_2$ 為 $c_1, c_2$，其中 $m_1 = 2^m M + r_1, m_2 = 2^m M + r_2$

$r_1, r_2$ 為未知 padding，$M$ 為真正的明文

設 $g_1(x, y) = x ^ e - C_1, g_2(x, y) = (x + y) ^ e - C_2$

當 $y = r_2 - r_1$，$g_1, g_2$ 有 common root $x = m_1$

設 $h(y) = res_x(g_1, g_2)$

我們知道 resultant 有一個特性是，$g_1, g_2$ 有 common root 若且唯若 $res(g_1, g_2) = 0$

所以我們就用 coppersmith method 求 $h(y)$ 的 root 

求得 root 後我們就知道 $y$，接下來就套用 Franklin-Reiter Related Message Attack 即可

[CONFidence CTF 2015 – RSA1](http://mslc.ctf.su/wp/confidence-ctf-2015-rsa1-crypto-400/)

### Boneh and Durfee Attack

當 $d < n ^ 0.292$ 我們可以分解 $n$

可以使用 [RSA-and-LLL-attacks](https://github.com/mimoo/RSA-and-LLL-attacks) 這個工具

### 相關資源

[A New Related Message Attack on RSA](https://www.iacr.org/archive/pkc2005/33860001/33860001.pdf)

[Low-Exponent RSA with Related Messages](https://www.cs.unc.edu/~reiter/papers/1996/Eurocrypt.pdf)

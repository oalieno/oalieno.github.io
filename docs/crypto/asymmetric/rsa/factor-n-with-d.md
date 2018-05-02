# factor n with d

有 d 我們可以很有效率的分解 n

$ed - 1 = k\varphi(n)$

我們知道 $\varphi(n) = (p - 1) (q - 1)$ 是偶數

$k\varphi(n) = 2^tr$ for some $t, r$

選一個 $g = \{2, ..., n - 1\}$

考慮以下序列 $x = g^{2^{t-1}r}, g^{2^{t-2}r}, ... g^{2^{r}} \mod n$

計算 $gcd(x - 1, n)$，當 gcd 不等於 1 我們就找到 $n$ 的因數

### 為什麼考慮該序列?

$g^{ed - 1} \equiv g^{k\varphi(n)} \equiv g^{2^tr} \equiv 1 \pmod{n}$

$g^{2^{t-1}r} \mod{n}$ 為 1 在模 n 下的模開方根，可能是四組解 $\pm 1, \pm x$ 的其中一種

當他等於 $\pm x$ 時，$x \equiv 1 \pmod{p}, x \equiv -1 \pmod{q}$ 或者 $x \equiv -1 \pmod{p}, x \equiv 1 \pmod{q}$

都會得到 $gcd(x - 1, n) \ne 1$

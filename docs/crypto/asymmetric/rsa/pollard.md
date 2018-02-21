# Pollard's p-1 Algorithm

有一個合數 $N$ 有一個質因數 $p$

根據費馬小定理，當 $a$ 不是 $p$ 的倍數，$a^{p-1} \equiv 1 \pmod{p} \to a^{k(p-1)} \equiv 1 \pmod{p} \to a^{k(p-1)} - 1 \equiv 0 \pmod{p}$ for some $k$

所以 $gcd(a^{k(p-1)} - 1, N)$ 一定會是 $p$ 的倍數

Pollard's p-1 algorithm 就是嘗試去構造出 $k(p-1)$ ，並且令 $a = 2$ ( 只要 $p \ne 2$ 上面的推論就是對的 )

也就是測試 $gcd(2^{1} - 1, N), gcd(2^{1 \times 2} - 1, N), gcd(2^{1 \times 2 \times 3} - 1, N), ...$

只要有一個的 gcd 不是 1，我們就成功分解 $N$

### 限制

當 $p-1$ 最大的質因數越小，$1 \times 2 \times 3 ...$ 能越快成為 $p - 1$ 的倍數，Pollard's p-1 algorithm 能越快的分解 $N$

### 程式碼 ( python )

```python
import math

def pollard(n):
    a = 2
    b = 2
    while True:
        a = pow(a, b, n)
        d = math.gcd(a - 1, n)
        if 1 < d < n: return d
        b += 1
```

### CTF 題目

[SECCON 2017 Online CTF](https://ctftime.org/task/5056)


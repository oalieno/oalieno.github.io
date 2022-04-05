---
title: "【CTF Writeups】TSG CTF 2019 - OPQRX"
date: 2019-05-06
categories:
- [資安, writeups]
tags:
- security
- ctf
- writeups
- crypto
- rsa
---

> Can you decrypt RSA? I'll give a hint value, XOR.
> ここにRSAの暗号文がありますが、XORをあげるので、代わりに平文をください。

| 分數 | 解題人數 |
| :-: | :-: |
| 497 | 10 |

---

## Writeups

題目很簡單，RSA 加密，多給了 $p \oplus q$ 的值 

$$
\begin{align}
&p \oplus q = x \\\\
&p \times q = n \\\\
\end{align}
$$

已知 $x, n$ 求 $p, q$  

假設 $x$ 的第一個 bit 是 0，那麼 $p, q$ 的第一個 bit 只有 $(0, 0)$ 或 $(1, 1)$ 兩種可能  
假設 $x$ 的第一個 bit 是 1，那麼 $p, q$ 的第一個 bit 只有 $(0, 1)$ 或 $(1, 0)$ 兩種可能

所以就直接爆搜加剪枝就過了，驚不驚喜，意不意外

## Final Exploit

```python
#!/usr/bin/env python3
from Crypto.Util.number import *
from tqdm import tqdm

class Solver:
	def __init__(self, x, n):
		self.x = x
		self.n = n
		self.pq = [(0, 0)]

	def add(self, b, p, q):
		if p * q <= n and (p | (b - 1)) * (q | (b - 1)) >= n:
			self.pq.append((p, q))

	def solve(self):
		for shift in tqdm(range(4095, -1, -1)):
			b = 1 << shift
			pq, self.pq = self.pq, []
			for p, q in pq:
				if self.x & b:
					self.add(b, p | b, q)
					self.add(b, p, q | b)
				else:
					self.add(b, p, q)
					self.add(b, p | b, q | b)
		return self.pq[0]

exec(open('flag.enc').read().lower())
solver = Solver(x, n)
p, q = solver.solve()
r = (p - 1) * (q - 1)
d = inverse(e, r)
m = pow(c, d, n)
print(long_to_bytes(m))
```

## Flag

```
TSGCTF{Absolutely, X should be 'S' in 'OPQRX'.}
```

---

1. https://furutsuki.hatenablog.com/entry/2019/05/05/163313#Crypto-497pts-10-Solves-OPQRX

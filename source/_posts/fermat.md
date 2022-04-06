---
title: "【演算法筆記】Fermat's Factorization Method"
date: 2018-02-22
categories:
- 演算法
tags:
- algorithm
---

有一個奇合數 $n$ ，是兩個奇質數的乘積 $n = pq$
令 $a = \frac{p + q}{2}, b = \frac{p - q}{2}$  那麼 $n = (a + b)(a - b) = a^2 - b^2$
但是今天我們不知道 $p, q$ ，而我們想要分解 $n$
那我們就猜 $a = \lceil \sqrt{n} \rceil$ ，測試 $a^2 - n$ 是不是完全平方數
猜到的話可以從 $a, b$ 反推回 $p, q$
沒猜到就把 $a$ 加一繼續猜

### 使用條件

當 $|p-q|$ 很小，可以有效的分解合數 $n$

### 程式碼 ( python )

```python
import math
import gmpy2

def fermat(n):
    a = math.ceil(math.sqrt(n))
    b2 = a * a - n
    while not gmpy2.iroot(b2, 2)[1]:
        a = a + 1
        b2 = a * a - n
    b = math.sqrt(b2)
    return [a + b, a - b]
```

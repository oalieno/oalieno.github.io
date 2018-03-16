# Fermat's Factorization Method

有一個奇合數 $N$ ，是兩個奇質數的乘積 $N = pq$

令 $a = \frac{p + q}{2}, b = \frac{p - q}{2}$  那麼 $N = (a + b)(a - b) = a^2 - b^2$

但是今天我們不知道 $p, q$ ，而我們想要分解 $N$

那我們就猜 $a = \lceil \sqrt{N} \rceil$ ，測試 $a^2 - N$ 是不是完全平方數

猜到的話可以從 $a, b$ 反推回 $p, q$

沒猜到就把 $a$ 加一繼續猜

### 使用條件

$|p-q|$ 很小

### 程式碼 ( python )

```python
import math
import gmpy2

ceil = math.ceil
sqrt = math.sqrt

def fermat(n):
    a = ceil(sqrt(n))
    b2 = a * a - n
    while not gmpy2.iroot(b2, 2)[1]:
        a = a + 1
        b2 = a * a - n
    b = sqrt(b2)
    return [a + b, a - b]
```

### CTF 題目

[Codegate CTF 2018 Preliminary - Miro](https://ctftime.org/task/5246)


# Fermat's Factorization Method

有一個奇合數 $N$ ，是兩個奇質數的乘積 $N = pq$

令 $a = \frac{p + q}{2}, b = \frac{p - q}{2}$  那麼 $N = (a + b)(a - b) = a^2 - b^2$

但是今天我們不知道 $p, q$ ，而我們想要分解 $N$ ，那我們就猜 $a = \lceil \sqrt{N} \rceil$ ，沒猜到就把 $a$ 加一繼續猜

### 限制

當 $p$ 和 $q$ 離 $\sqrt{N}$ 越近，Fermat's factorization method 能越快找到解

### 程式碼 ( python )

請自行實做 `is_square` ( 就是判斷數字是不是完全平方數 )

```python
import math

ceil = math.ceil
sqrt = math.sqrt

def fermat(n):
    a = ceil(sqrt(n))
    b2 = a * a - n
    while not is_square(b2):
        a = a + 1
        b2 = a * a - n
    b = sqrt(b2)
    return [a + b, a - b]
```

### CTF 題目

[Codegate CTF 2018 Preliminary - Miro](https://ctftime.org/task/5246)


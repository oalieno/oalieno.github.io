# 擴展歐基里得演算法

[各種實做](https://en.wikibooks.org/wiki/Algorithm_Implementation/Mathematics/Extended_Euclidean_algorithm)

### 貝祖定理

對任意整數 $a, b$，未知數 $x, y$

$$
ax + by = m
$$

有整數解 若且唯若 $gcd(a, b) | m$，也就是 $m$ 是 $gcd(a, b)$ 的倍數

### 程式碼 ( python )

```python
def exgcd(a, b):
    if a == 0:
        return (b, 0, 1)
    else:
        g, x, y = exgcd(b % a, a)
        return (g, y - (b // a) * x, x)
```

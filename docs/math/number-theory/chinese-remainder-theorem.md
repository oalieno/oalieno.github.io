# 中國剩餘定理

令 $m_1, m_2, ..., m_n$ 為兩兩互質的正整數，而 $a_1, a_2, ..., a_n$ 為任意整數，則

$\begin{aligned} x \equiv a_1 &\pmod{m_1} \\ x \equiv a_2 &\pmod{m_2} \\ &. \\ &. \\ &. \\ x \equiv a_n &\pmod{m_n} \end{aligned}$

在模數 $m = m_1m_2...m_n$ 下有唯一解

## Gauss Algorithm

Gauss Algorithm 給出該唯一解的值 $x = a_1M_1y_1 + a_2M_2y_2 + ... + a_nM_ny_n$

其中 $M_i = m / m_i$ 且 $M_iy_i \equiv 1 \pmod{m_i}$

### 程式碼 ( python )

```python
import functools
from Crypto.Util.number import inverse

def chinese_remainder(a, m):
    sum = 0
    prod = functools.reduce(lambda x, y: x * y, m)
    for ai, mi in zip(a, m):
        Mi = prod // mi
        sum += ai * Mi * inverse(Mi, mi)
    return sum % prod
```

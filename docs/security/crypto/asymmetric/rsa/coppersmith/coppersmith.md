# Coppersmith Method

給整數 $n$，$f \in \mathbb{Z}[x]$ 是一個 degree $d$ 的 monic polynomial

用 coppersmith method 可以找到所有 $x_0 < n^{\frac{1}{d} - \epsilon}, \frac{1}{d} > \epsilon > 0$ 使得 $f(x_0) = 0$ 

在 sage 中的實作叫做 `small_root`

### 相關資源

[A New Related Message Attack on RSA](https://www.iacr.org/archive/pkc2005/33860001/33860001.pdf)

[Low-Exponent RSA with Related Messages](https://www.cs.unc.edu/~reiter/papers/1996/Eurocrypt.pdf)

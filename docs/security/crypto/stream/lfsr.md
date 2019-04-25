LFSR of degree $m$ 的初始狀態為 $s_0, s_1, \cdots, s_{m-1}$

$s_n = s_{n-1}p_{m-1} + \cdots + s_{n-m+2}p_1 + s_{n-m+1}p_0$

![](https://i.imgur.com/7jCWURK.png)

可以用一個 polynomial 來表示 LFSR

$P(x) = x_m + p_{m−1} x_{m−1} + \cdots + p_1 x + p_0$

## Theorem 1

LFSR 能產生不重複的最長長度是 $2^m - 1$ ( 除了全部都零的其他所有狀態 )

長度為 $2^m - 1$ 的 LSFR 是一個 primitive polynomials

## Known Plaintext Attack

只要知道 2m 個 state 就可以解 LFSR

### 解方程組

$$
\begin{aligned}
&s_m = p_{m−1}s_{m−1} +...+ p_1s_1 + p_0s_0 \\
&s_{m+1} = p_{m−1}s_m +...+ p_1s_2 + p_0s_1 \\
&\cdots \\
&s_{2m-1} = p_{m−1}s_{2m−2} +...+ p_1s_m + p_0s_{m-1}
\end{aligned}
$$

已知 $s_0, s_1, \cdots, s_{2m-1}$  
未知 $p_0, p_1, \cdots, p_{m-1}$  
$m$ 個未知數 $m$ 個方程式，使用高斯消去法解出 $p_0, p_1, \cdots, p_{m-1}$

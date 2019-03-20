# Linear Feedback Shift Register

LFSR of degree $m$ has initial state $s_0, s_1, \cdots, s_{m-1}$

$s_n = s_{n-1}p_{m-1} + \cdots + s_{n-m+2}p_1 + s_{n-m+1}p_0$

![](https://i.imgur.com/7jCWURK.png)

可以用一個 polynomial 來表示 LFSR

$P(x) = x_m + p_m−1x_m−1 + \cdots + p_1x+ p_0$

## Theorem 1

LFSR 能產生不重複的最長長度是 $2^m - 1$ ( 除了全部都零的其他所有狀態 )

maximum-length LSFR 是一個 primitive polynomials

## Known Plaintext Attack

知道 $s_0, s_1, \cdots, s_{2m-1}$

$$
\begin{aligned}
&i = 0, s_m = p_{m−1}s_{m−1} +...+ p_1s_1 + p_0s_0 \\
&i = 1, s_{m+1} = p_{m−1}s_m +...+ p_1s_2 + p_0s_1 \\
&\cdots \\
&i = m-1, s_{2m-1} = p_{m−1}s_{2m−2} +...+ p_1s_m + p_0s_{m-1}
\end{aligned}
$$

$m$ 個未知數 $m$ 個方程式，使用高斯消去法解出 $p_0, p_1, \cdots, p_{m-1}$

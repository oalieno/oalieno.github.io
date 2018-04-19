# Carmichael Function

定義 : $\lambda(n)$ 是最小的正整數 $m$ 滿足 $\forall a = 1, 2, \cdots n,\ a ^ m \equiv 1 \pmod{n}$

the exponent of the multiplicative group of integers modulo $n$ is $\lambda(n)$

## 性質

$n = p_1^{r_1} p_2^{r_2} \cdots p_k^{r_k}$

$\lambda(n) = lcm(\lambda(p_1^{r_1}),\lambda(p_2^{r_2}), \cdots, \lambda(p_k^{r_k}))$

當 $p$ 是質數，$\lambda(p^k) = {\begin{cases}\frac{\varphi(p^k)}{2}& p = 2, k > 2\\\varphi(p^k)& else \end{cases}}$，$\varphi$ 是 [Euler's Totient Function](/math/number-theory/euler-totient/)

# Euler's Totient Function

也叫做 Euler's Phi Function

複雜定義 : $\varphi(n) = |\{ x \mid gcd(x, n) = 1, 1 \le x \le n \}|$

白話定義 : $\varphi(n)$ 是 $1, 2, \cdots n$ 裡面跟 $n$ 互質的個數

the order of the multiplicative group of integers modulo $n$ is $\varphi(n)$

## 性質

當 $gcd(m, n) = 1$，$\varphi(mn) = \varphi(m) \varphi(n)$

當 $p$ 是質數，$\varphi(p) = p - 1$

當 $p$ 是質數，$\varphi(p^k) = p ^ {k - 1}(p - 1) = p ^ k (1 - \frac{1}{p})$

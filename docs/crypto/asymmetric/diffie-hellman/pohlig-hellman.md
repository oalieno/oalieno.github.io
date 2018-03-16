# Pohlig Hellman Algorithm

用來解 [Discrete Logarithm Problem](/crypto/asymmetric/diffie-hellman/introduction/#discrete-logarithm-problem)

$p-1 = p_1^{e_1} \cdot p_2^{e_2} \cdots p_r^{e_r}$

先求 $x_i = x \mod p_i^{e_i}$，再用中國剩餘定理組回 $x$

怎麼求 $x_i$ ?

設 $q = p_i, e = e_i$

將 $x_i$ 表示成 $q$ 進位 $x_i = a_0 + a_1 q + \cdots + a_{e - 1} q^{e - 1}$

設 $\beta_j = \beta\alpha^{-(a_0 + a_1q + \cdots + a_{j-1}q^{j-1})}$

$$
\begin{align}
(\beta_j)^{\frac{p - 1}{q^{j+1}}} &\equiv (\alpha^{x-(a_0 + a_1 q + \cdots + a_{j-1} q^{j-1})})^{\frac{p - 1}{q^{j+1}}} \pmod{p} \\
&\equiv (\alpha^{a_j q^j + \cdots + a_{e - 1} q^{e - 1} + s q^{e}})^{\frac{p - 1}{q^{j+1}}} \pmod{p} \text{ for some } s \\
&\equiv (\alpha^{a_j q^j + K_j q^{j+1}})^{\frac{p - 1}{q^{j+1}}} \pmod{p} \text{ for some } K_j \\
&\equiv \alpha^{\frac{a_j(p-1)}{q}}\alpha^{K(p-1)} \pmod{p} \\
&\equiv \alpha^{\frac{a_j(p-1)}{q}} \pmod{p}
\end{align}
$$

$(\beta_j)^{\frac{p - 1}{q^{j+1}}} \equiv \alpha^{\frac{a_j(p-1)}{q}} \pmod{p}$，除了 $a_j$ 之外我們都知道

假設 $A = \alpha^{\frac{p-1}{q}}, B = (\beta_j)^{\frac{p - 2}{q^{j+1}}}$

那麼 $B = A^{a_j} \pmod{p}$，已知 $A, B$，且 $0 \le a_j \le q$，當 $q$ 很小我們可以輕鬆解出 $a_j$

解出所有的 $a_j$ 就解出 $x_i$

解出所有的 $x_i$ 就用中國剩餘定理解出 $x$

## 使用條件

$p-1$ 是 smooth number ( 很 smooth 的那種 )

## 相關資源

[cryptologie blog](https://www.cryptologie.net/article/196/pohlig-hellman-algorithm/)

[The Pohlig-Hellman Algorithm](http://anh.cs.luc.edu/331/notes/PohligHellmanp_k2p.pdf)

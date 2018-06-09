# 性質和定理

### Equivalent Bases

Q : 我們怎麼知道兩個 basis $\mathbf{B}, \mathbf{B'}$ 是不是產生同樣的 lattice ?

A : 檢查 $\mathbf{B'B^{-1}}$ 是不是 unimodular matrix

#### 小定理

下面兩個敘述是等價的

* $L(\mathbf{B}) = L(\mathbf{B'})$
* $\exists$ unimodular matrix $\mathbf{U}$ such that $\mathbf{B'} = \mathbf{BU}$

### 某定理

Let $\mathbf{b_1}, \cdots \mathbf{b_n} \in \mathbb{R}^n$ denote linear independent vectors in $L$ ( full-rank n-dimensional lattice )

$\mathbf{b_1}, \cdots \mathbf{b_n}$ form a basis of $L$ $\Leftrightarrow$ $P(\mathbf{b_1}, \cdots, \mathbf{b_n}) \cap L = \{\mathbf{0}\}$

### Minkowski Theorem

Any convex, centrally symmetric body $S$

$$
\text{vol}(S) > 2^n\text{det}(L)
$$

#### convex set ( convex body )

A set $S$

滿足 $x, y \in S \Rightarrow \alpha x + (1-\alpha)y \in S$ 就是 convex

滿足 $x \in S \Leftrightarrow -x \in S$ 就是 centrally symmetric

想知道更多請去看 [wikipedia - Convex set](https://en.wikipedia.org/wiki/Convex_set)

### Minkowskis First Theorem

Any Lattice $L$

$$
\lambda_1(L) \le \sqrt{n}\ \text{det}(L)^{\frac{1}{n}}
$$

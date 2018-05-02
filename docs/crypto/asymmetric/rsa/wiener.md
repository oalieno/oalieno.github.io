# Wiener's attack

我們已知公鑰，也就是 $(n, e)$

### 觀察一

$\begin{aligned} \varphi(n) &= (p-1)(q-1) \\ &= n - p - q + 1 \\ &= n - p - \frac{n}{p} + 1
 \end{aligned}$

移項一下

$p^2 + p(\varphi(n) - n - 1) + n = 0$

我們就得到了一個 $p$ 的二次式，只要我們知道 $\varphi(n)$ 我們就可以解出兩個根 $p_1, p_2$

$p_1, p_2$ 就是我們的 $p, q$ ，而我們就成功分解 $n$ 了

### 觀察二

我們知道 $ed \equiv 1 \pmod{\varphi(n)}$

所以 $ed = k\varphi(n) + 1$ for some $k$

那麼 $\varphi(n) = \frac{ed - 1}{k}$ ，只要我們知道 $k, d$ 我們就可以解出 $\varphi(n)$

### Wiener's attack

根據剛剛的**觀察一**和**觀察二**，我們只要知道 $k, d$ 我們就可以解出 $p, q$ ，也就是成功分解 $n$

那這個 wiener's attack 其實就是提供你一個猜 $k, d$ 的方式

首先找出 convergents of the continued fraction expansion of $\frac{e}{n}$ ( 複習[連分數](/math/number-theory/continued-fractions/)? )

假設他們是 $\frac{k_i}{d_i}$ 我們就猜 $k = k_i, d = d_i$

然後根據上面兩個觀察解回 $p_1, p_2$ 然後檢查 $p_1p_2$ 是否等於 $n$，不是的話就換下一個 convergent

### 限制

當 $d < \frac{1}{3}n^{\frac{1}{4}}$ ，這個方法保證能找到對的 $k, d$ ，進而分解 $n$

### 時間複雜度

知道 $k, d$ 之後，回推 $\varphi(n)$ 只需要 $O(1)$

知道 $\varphi(n)$ 之後，解一元二次方程式也只需要 $O(1)$

觀察到計算 continued fraction expansion 時，其實是在做輾轉相除法

所以嘗試所有的 convergents 需要 $O(log(min(e, n)))$ ( 輾轉相除法 $a, b$ 的時間複雜度是 $O(log(min(a, b)))$ )

而我們知道 $e < \varphi(n) < n$ ，所以時間複雜度是 $O(log(e))$

### 註記

wiener attack 有兩種版本

原始論文中的是針對 $r = \lambda(n)$

我前面講的是針對 $r = \varphi(n)$

中間過程不同但都可以分解 $n = p q$

### 參考資料

* [sagi's blog](https://sagi.io/2016/04/crypto-classics-wieners-rsa-attack/)
* [Cryptanalysis of Short RSA Secret Exponents](https://www.cits.ruhr-uni-bochum.de/imperia/md/content/may/krypto2ss08/shortsecretexponents.pdf)

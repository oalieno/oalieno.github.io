# Baby-Step Giant-Step

用來解 [Discrete Logarithm Problem](/crypto/asymmetric/diffie-hellman/introduction/#discrete-logarithm-problem)

這邊為解釋方便假設 $n$ 為完全平方數

我們知道最暴力的方法就是枚舉 $\alpha^{1}, \alpha^{2}, ...$ 直到 $\alpha^x = \beta$，時間複雜度 $O(n)$

那我們把要枚舉的 $0, 1, ..., n-1$ 切成 $\sqrt{n}$ 個區塊，每個區塊有 $\sqrt{n}$ 個元素

假設現在嘗試的是第 $i$ 個區塊的第 $j$ 個元素，也就是 $x = i\sqrt{n} + j$

$$
\begin{align}
&\alpha^x = \beta \\
&\alpha^{i\sqrt{n} + j} = \beta \\
&\alpha^{i\sqrt{n}} \cdot \alpha^{j} = \beta \\
&\alpha^j = \beta \cdot \alpha^{-i\sqrt{n}}
\end{align}
$$

從 $j = 0, 1, ..., \sqrt{n} - 1$ 計算 $\alpha^j$ 建表

從 $i = 0, 1, ..., \sqrt{n} - 1$ 計算 $\beta \cdot \alpha^{-i\sqrt{n}}$，再去查表就好

## 複雜度

時間複雜度 : $O(\sqrt{n})$

空間複雜度 : $O(\sqrt{n})$

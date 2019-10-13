## Single qubit gates

在傳統計算機中，一個位元的邏輯閘只有 NOT  
NOT 是把 0 變 1，1 變 0，表示成 Truth table 就會是

| INPUT | OUTPUT |
| :-: | :-: |
| 0 | 1 |
| 1 | 0 |

在量子計算機中，有沒有類似於 NOT 的邏輯閘呢?  
我們想要的是 $|0\rangle$ 變成 $|1\rangle$，$|1\rangle$ 變成 $|0\rangle$，一個很自然的 NOT 邏輯閘就是把 $\alpha |0\rangle + \beta |1\rangle$ 變成 $\alpha |1\rangle + \beta |0\rangle$  
可以把這個 NOT gate 寫成一個矩陣

$$
X =
\begin{bmatrix}
0 & 1\\ 
1 & 0
\end{bmatrix}
$$

一個量子位元就可以表示成一個向量

$$
\begin{bmatrix}
\alpha \\
\beta
\end{bmatrix}
$$

對一個量子位元做一個 NOT 邏輯運算就變成

$$
X
\begin{bmatrix}
\alpha \\ 
\beta
\end{bmatrix}
=
\begin{bmatrix}
\beta \\
\alpha
\end{bmatrix}
$$

以下我們就稱 NOT gate 為 X gate
所以作用在一個量子位元的邏輯閘可以被表示成一個 2 x 2 的矩陣  
還記得 $\alpha, \beta$ 都要滿足 normalization condition 嗎，通過量子邏輯閘後的量子位元也要滿足 normalization condition  
根據一些數學推導，我們發現只要代表這個邏輯閘的矩陣是一個 Unitary Matrix，就能滿足 normalization condition  
而 Unitary Matrix 的定義是  

$$
\text{U is Unitary Matrix} \Leftrightarrow  U^{\dagger}U = I
$$

除了 X gate，還有另外兩個重要的邏輯閘，Z gate 和 H gate ( Hadamard gate )

$$
Z = \begin{bmatrix}
1 & 0 \\
0 & -1
\end{bmatrix}
$$

$$
H = \frac{1}{\sqrt{2}} \begin{bmatrix}
1 & 1 \\
1 & -1
\end{bmatrix}
$$

## Two qubit gates

在傳統計算機中，我們有 AND, OR, XOR 各種邏輯閘，能接受兩個 bits 作為輸入

在量子計算機中，一個能接收兩個 qubits 的邏輯閘的例子是 CNOT gate  
CNOT gate 接兩個 qubit 做輸入，第一個 qubit 叫做 control qubit，第二個 qubit 叫做 target qubit  
當 control qubit 是 0，target qubit 不會變  
當 control qubit 是 1，target qubit 會被翻轉  
CNOT gate 的行為可以這樣表示 $|A,B\rangle \rightarrow |A,B \oplus A\rangle$
下面列出 4 個 computational basis state 經過 CNOT gate 的變化

| INPUT | OUTPUT |
| :-: | :-: |
| $\mid 00 \rangle$ | $\mid 00 \rangle$ |
| $\mid 01 \rangle$ | $\mid 01 \rangle$ |
| $\mid 10 \rangle$ | $\mid 11 \rangle$ |
| $\mid 11 \rangle$ | $\mid 10 \rangle$ |

表示成一個 2 x 2 的矩陣就會是

$$
\begin{bmatrix}
1 & 0 & 0 & 0 \\
0 & 1 & 0 & 0 \\
0 & 0 & 0 & 1 \\
0 & 0 & 1 & 0
\end{bmatrix}
$$

CNOT gate 很像是量子版本的 XOR gate，那我們還做得出量子版本的 AND, OR gate 嗎?  
答案是不行的，因為量子的邏輯閘必須是 reversible，他要是一個 Unitary Matrix，而 Unitary Matrix 是 Invertible Matrix  
這邊我們只介紹 CNOT gate，當然還有很多其他的邏輯閘，不過其他有趣的邏輯閘基本上都是用我們剛剛介紹的這些邏輯閘組合出來的

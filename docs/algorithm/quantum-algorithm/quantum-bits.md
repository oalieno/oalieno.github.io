## 一個量子位元 ( 1 qubit )

### 狀態

在傳統計算機中，一個位元只會有兩種狀態，0 或 1

在量子計算機中，一個位元的狀態可以是 $|0\rangle$ 或是 $|1\rangle$ 或是他們的線性組合 $|\psi \rangle = \alpha |0\rangle + \beta |1|0\rangle$  
$|0\rangle, |1\rangle$ 我們稱他為 computational basis state  
所以在量子計算機中的位元，我們說他是處在一個**疊加態**  
這邊的 $\alpha, \beta$ 是複數 ( Complex Number )，理論上量子計算機的一個位元可以有無限多種狀態

### 觀測

在傳統計算機中，觀測一個位元，就只是把他的狀態取出來，他的狀態是 0 我們就觀測到 0，他的狀態是 1 我們就觀測到 1，非常的直覺

在量子計算機中，觀測一個位元，有 $|\alpha|^2$ 的機率觀測到 0，有 $|\beta|^2$ 的機率觀測到 1  
機率總和會是 1，所以 $\alpha, \beta$ 必須滿足 $|\alpha|^2 + |\beta|^2 = 1$，這個條件叫做 normalization condition  
不同於傳統計算機，量子計算機在觀測後會破壞原本的狀態，我們稱做**量子塌陷** ( collapse )，也就是  
觀測出 0 之後，該位元的狀態就會變 $|0\rangle$，觀測出 1 之後，該位元的狀態就會變 $|1\rangle$  
所以事實上，我們沒辦法觀測出量子位元的真實狀態 $\alpha, \beta$

## 兩個量子位元 ( 2 qubits )

2 qubits 會有 4 個 computational basis state: $|00\rangle, |01\rangle, |10\rangle, |11\rangle$  
所以 2 qubits 的狀態可以是 $|\psi\rangle = \alpha_{00} |00\rangle + \alpha_{01} |01\rangle + \alpha_{10} |10\rangle + \alpha_{11} |11\rangle$  
觀測第一個 qubit 的時候，有 $|\alpha_{00}|^2 + |\alpha_{01}|^2$ 的機率觀測到 0  
觀測出 0 之後，該位元的狀態會只剩下第一個 qubit 有 0 的項，並且要滿足 normalization condition，所以會變成

$$
\frac{\alpha_{00} |00\rangle + \alpha_{01} |01\rangle}{\sqrt{|\alpha_{00}|^2 + |\alpha_{01}|^2}}
$$

接下來我們來看一個重要的 two qubit 狀態，叫做 Bell state 或 EPR pair

$$
\frac{|00\rangle + |11\rangle}{\sqrt{2}}
$$

第一個 qubit 有 $\frac{1}{2}$ 的機率觀測到 0，有 $\frac{1}{2}$ 的機率觀測到 1，第二個 qubit 也是一樣的情況  

## 多個量子位元

同理，n 個量子位元就會長得像 $|\psi\rangle = \sum_{x=\{0, 1\}^n} \alpha_{x} |x\rangle$，$\{0, 1\}^n$ 代表由 0 或 1 組成長度為 n 的字串

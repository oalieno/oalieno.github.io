# 彩虹表 \( Rainbow Table \)

字典攻擊是預先儲存一個很大的資料庫，裡面包含許多常見字串的 hash value，透過查表的方式找回 hash key

彩虹表和字典攻擊一樣是用空間換取時間，但彩虹表多犧牲了一點時間來換去更小的空間

### 原理

我們有一個 hash function $H$，輸入任意長度的資料，輸出 $n$ bits 的資料

定義另一個 function $R$，輸入 $n$ bits 的資料，輸出 $m$ bits 的資料

挑選許多初始值 $p_0$

計算$\forall 1 \leq i \leq n : q_{i-1} = H(p_{i-1}), p_i = R(q_{i-1})$ 後將 $(p_0, p_n)$ 存入資料庫

我們稱 $p_0, q_0, p_1, \cdots, p_n$ 為 hash chain

給 $Q$ 我們要找 $P$ 使得 $H(P) = Q$

那我們就找資料庫裡面有沒有 $p_n = R(Q)$，有的話 $P = p_{n-1}$，因為 $H(p_{n-1}) = Q$

沒有的話就繼續找資料庫裡面有沒有 $p_n = R(H(R(Q)))$，有的話 $P = p_{n-2}$，因為 $H(p_{n-2}) = Q$

然後就這樣掃過 hash chain

### 工具

[ophcrack](http://ophcrack.sourceforge.net/)

[rainbowcrack](http://project-rainbowcrack.com/)

[rtgen](http://project-rainbowcrack.com/generate.pdf)

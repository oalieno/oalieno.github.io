---
title: "[後量子密碼] Knapsack Cryptosystem and Subset-Sum Problem"
date: 2020-03-20 21:11:11
categories:
- [security, crypto]
tags:
- security
- crypto
- knapsack
- subset-sum
- lattice
---

這是**楊柏因**老師在台大開的**後量子密碼學**的筆記
參考教科書 [An Introduction to Mathematical Cryptography](https://link.springer.com/book/10.1007/978-1-4939-1711-2) 7.2 章節

---

今天要介紹的是 Knapsack Cryptosystem，他是基於 Subset-Sum Problem 這個 NP-Complete 問題所設計出來的公鑰密碼系統。這個系統剛提出就被破解，然後又改良，再被破解，然後再改良，又再被破解...基本上是一個壞掉的密碼系統。

## Subset-Sum Problem

給 n 個數字組成的集合 $M = (m_1, m_2, \cdots, m_n)$ 和一個整數 $S$，求哪一個 $M$ 的子集合加起來是 $S$

{% admonition example "舉例來說" %}
假設 $M = (2,3,4,9,14,23)$, $S = 21$
那答案就會是 $\\{ 3, 4, 14 \\}$，因為 $3 + 4 + 14 = 21$
{% endadmonition %}

### Collision Attack

直接爆搜需要 $O(2^n)$，一個簡單的優化是，我們可以把 $M$ 切成兩半，分別暴搜前半和後半，並把答案存起來，然後只要兩半加起來是 $S$ 我們就找到了，這樣只需要 $O(2^{n/2})$ 的時間但需要額外 $O(2^{n/2})$ 的空間，是一個以空間換取時間的例子，這個手法和 Double DES 的 Meet-in-the-Middle 一樣。

{% admonition example "舉例來說" %}
以剛剛的例子來看就是下面這樣
| 前半 | 後半 |
| --- | --- |
| {} = 0 | {} = 0 |
| {2} = 2 | {9} = 9 |
| {2, 3} = 5 | **{14} = 14** |
| **{3, 4} = 7** | {9, 14} = 23 |
| ... | ... |
{% endadmonition %}

### Superincreasing Sequence

一個公鑰密碼系統要有一個 trapdoor，也就是要留個後門讓我們用私鑰解得出來，但監聽者沒有私鑰解不出來，而現在的 Subset-Sum Problem 是個 NP-Complete 問題大家都解不出來，這樣不行，所以這時候我們引入這個 Superincreasing Sequence 來幫助我們設計 trapdoor。

{% admonition abstract "Superincreasing Sequence" %}
序列 $R = (r_1, r_2, \cdots, r_n)$ 滿足 $2 r_i \le r_{i+1} \ \forall \ 1 \le i < n$
{% endadmonition %}

{% admonition example "舉例來說" %}
$(1, 2, 4, 8, 16)$ 和 $(2, 5, 12, 24, 50)$ 都是 Superincreasing Sequence
{% endadmonition %}

這個 Superincreasing Sequence 有個性質是 $r_1 + r_2 + \cdots + r_{k-1} < r_k \ \forall \ 2 \le k \le n$，這可以很簡單的用數學歸納法證明，我就不贅述了。

如果 Subset-Sum Problem 的集合是一個 Superincreasing Sequence，我們可以很容易的算出答案。算法是只要最後一項大於等於 $S$，就一定要選他，因為他比前面所有項加起來都大，不選他就不可能組合出 $S$，那選了最後一項之後就把他從 $S$ 中扣掉，然後考慮前面 n - 1 項，又是一樣的子問題，照一樣的方法解就行了，如果一開始最後一項小於 $S$，那就更簡單了直接忽略他，考慮剩下的 n - 1 項的子問題。

## Knapsack Cryptosystem

### 產生密鑰

選兩個整數 $A, B$，再選一組 Superincreasing Sequence $R = (r_1, r_2, \cdots, r_n)$，$A, B$ 必須滿足 $\gcd(A, B) = 1$ 且 $2 r_n < B$，然後計算 $m_i \equiv A r_i \pmod{B}$，這樣 $M = (m_1, m_2, \cdots, m_n)$ 就是公鑰，$A, B$ 就是私鑰。

{% admonition example "舉例來說" %}
$選 A = 113, B = 250, r = (3, 11, 24, 50, 115)$，計算 $M \equiv (113·3,113·11,113·24,113·50,113·115) = (89, 243, 212, 150, 245) \pmod{250}$
公鑰是 $(89, 243, 212, 150, 245)$，私鑰是 $113, 250$ 
{% endadmonition %}

### 加密

先把明文 $x$ 轉成二元陣列 $(x_1, x_2, \cdots, x_n)$，計算密文 $S = \sum_{i=1}^{n} x_i M_i$

{% admonition example "舉例來說" %}
明文 $x$ 是 $(1, 0, 1, 0, 1)$，計算密文 $S = x·M = 1·89 + 0·243 + 1·212 + 0·150 + 1·245 = 546$
{% endadmonition %}

### 解密

用私鑰 $A, B$ 把公鑰轉成 Superincreasing Sequence $r_i \equiv A^{-1} m_i \pmod{B}$，計算 $S' \equiv A^{-1} S \pmod{B}$，然後解 $R$ 和 $S'$ 構成的 Subset-Sum Problem

{% admonition example "舉例來說" %}
還原回 $r$ 之後，計算 $S' \equiv 177·546 = 142 \pmod{250}$，再來就解 Subset-Sum Problem 如下
142 >= 115，選，剩下 27
27 < 50，不選
27 >= 24，選，剩下 3
3 < 11，不選
3 >= 3，選，結束
答案是 $(1, 0, 1, 0, 1)$
{% endadmonition %}

### 參數大小

因為有 collision attack，所以要有 $2^{80}$ 的安全性需要 $n > 160$，也就是要兩倍長度。如果 $r_1$ 太小，也會被[破解](https://crypto.stackexchange.com/questions/50068/how-to-attack-merkle-hellman-cryptosystem-if-the-first-element-in-the-superincre)，所以 $2^n < r_1$ 那 $2^{2n} < r_n < B$ 才夠安全，粗略估算起來公鑰是 $n$ 個 $2^{2n}$ 大小的集合，總共 $2n^2$ 個 bits，而又因為接下來要介紹的 lattice attack 的存在，使得 $n > 300$ 才算安全，這樣公鑰就會有 $2n^2 = 180000 bits \approx 176 kB$，已經大到不堪用了。

### Lattice Attack

假設我們的 Subset-Sum Problem 要找的集合是 $M = (m_1, m_2, \cdots, m_n)$ 總和是 $S$，那我們構造下面這樣的矩陣

$$
\begin{pmatrix}
2 & 0 & 0 & \cdots & 0 & m_1 \\\\ 
0 & 2 & 0 & \cdots & 0 & m_2 \\\\ 
0 & 0 & 2 & \cdots & 0 & m_3 \\\\ 
\vdots & \vdots & \vdots & \ddots & \vdots & \vdots \\\\ 
0 & 0 & 0 & \cdots & 2 & m_n \\\\ 
1 & 1 & 1 & \cdots & 1 & S
\end{pmatrix} = \begin{pmatrix}
v_1 \\\\
v_2 \\\\
\vdots \\\\
v_n \\\\
v_{n+1}
\end{pmatrix}
$$

接下來考慮以 $v_1, v_2, \cdots, v_{n+1}$ 為 basis 構成的 lattice $L$，那 $t$ 會是其中的一個 short vector

$$
t =
\begin{pmatrix} x_1 & x_2 & \cdots & x_n & -1 \end{pmatrix}
\begin{pmatrix}
v_1 \\\\
v_2 \\\\
\vdots \\\\
v_n \\\\
v_{n+1}
\end{pmatrix}
= \begin{pmatrix} 2 x_1 - 1 & 2 x_2 - 1 & \cdots & 2 x_n - 1 & 0 \end{pmatrix}
$$

其中 $x = (x_1, x_2, \cdots, x_n, -1)$ 是這個 Subset-Sum Problem 的答案
$x$ 的每一項都等於 0 或 1，而 $t$ 的值除了最後一項是 0 其他都是 $\pm 1$，$m$ 的值根據剛剛在<a href="#參數大小">參數大小</a>的推論大約是 $2^{2n}$，$S$ 也是，所以相對於 $m$ 和 $S$ 的大小，$t$ 是一個長度為 $\sqrt{n}$ 的 short vector in $L$，最後我們只要用 LLL 或 LLL-BKZ 之類的演算法來找 $L$ 中的 short vector 就可以找到 $t$，找到 $t$ 就可以還原 $x$ 了 
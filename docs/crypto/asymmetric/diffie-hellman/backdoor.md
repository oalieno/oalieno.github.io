# Backdoor in Diffie Hellman

## Backdoor I

我們不再是選一個質數 $p$ 而是選兩個質數乘起來 $n = pq$

DLP 變成是求 $x$ 滿足 $\alpha^x \equiv \beta \pmod{n}$

另 $\beta \mod{p} = \beta_p$ 和 $\beta \mod{q} = \beta_q$

$\alpha^x \equiv \beta_p \pmod{p}$ 解出 $x \equiv x_p \pmod{p - 1}$

$\alpha^x \equiv \beta_q \pmod{q}$ 解出 $x \equiv x_q \pmod{q - 1}$

用中國剩餘定理求出 $x$

但是我們還是需要求 order 是 $p - 1$ 和 $q - 1$ 的 DLP，可以再更有效率一點

選 $p - 1 = 2p_1p_2$ 和 $q - 1 = 2q_1q_2$

$p_1, q_1$ 是很小的質數，$p_2, q_2$ 是很大的質數

我們可以找到 $g_p$ 在 $\mathbb{Z}_p$ 下的 order 是 $p_1$ 和 $g_q$ 在 $\mathbb{Z}_q$ 下的 order 是 $q_1$

然後用中國剩餘定理把 $g_p, g_q$ 組成 $g$ 在 $\mathbb{Z}_n$ 下

## Backdoor II

選 $n = pq$，使得 (p - 1) 和 (q - 1) 都是 B-smooth

這樣只有能分解 $n = pq$ 的人可以用 $(p - 1), (q - 1)$ 的小質數們做 Pohlig Hellman

但是這樣可以直接用 Pollard's p - 1 Algorithm 分解 $n$

所以我們要放 $p_big, q_big$ 稍微有點大的質數在 (p - 1) 和 (q - 1) 裡面

### 相關資源

* [How to Backdoor Diffie-Hellman](https://eprint.iacr.org/2016/644.pdf)
* https://www.cryptologie.net/article/360/how-to-backdoor-diffie-hellman-quick-explanation/

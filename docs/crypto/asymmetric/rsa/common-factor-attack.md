# Common Factor Attack

當兩個公鑰 $(n_1, e_1), (n_2, e_2)$ 的 $n_1, n_2$ 有**共同的質因數**時

我們直接用 $gcd(n_1, n_2)$ 在 $O(log(min(n_1, n_2))$ 的時間內分解 $n_1, n_2$

### Batch GCD

當我們有一群公鑰，等於是我們有一堆 $n$，我們想知道是否有其中一對 $n$ 有**共同的質因數**

<img style="height: 150px;" src="https://i.imgur.com/L95clhv.png">

以 $z_1$ 為例

我們可以把 $z_1$ 寫成 $z_1 = N_1 N_2 \cdots N_m \text{ mod } N_1^2 = N_1 N_2 \cdots N_m - k N_1^2 \text{ for some } k$，那麼

$$
\begin{align}
&\frac{z_1}{N_1} = \frac{N_1 N_2 \cdots N_m - k N_1^2}{N_1} = N_2 \cdots N_m - k N_1 \\
&gcd(N_1, \frac{z_1}{N_1}) = gcd(N_1, N_2 \cdots N_m - k N_1) = gcd(N_1, N_2 \cdots N_m)
\end{align}
$$

第一步驟求乘法時用 product tree 加速  
第二步驟求餘數時用 remainder tree 加速

### 相關資源

* [how to efficiently compute a batch gcd](https://www.cryptologie.net/article/313/how-to-efficiently-compute-a-batch-gcd/)
* [Mining Your Ps and Qs: Detection of Widespread Weak Keys in Network Devices](https://factorable.net/weakkeys12.extended.pdf)
* [FAST MULTIPLICATION AND ITS APPLICATIONS](http://cr.yp.to/lineartime/multapps-20041007.pdf)

### CTF 題目

[SECCON 2017 Online CTF - Ps and Qs](https://ctftime.org/task/5054)

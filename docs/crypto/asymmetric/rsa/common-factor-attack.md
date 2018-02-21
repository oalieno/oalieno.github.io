# Common Factor Attack

當兩個公鑰 $(N_1, e_1), (N_2, e_2)$ 的 $N_1, N_2$ 有**共同的質因數**時

我們直接用 $gcd(N_1, N_2)$ 在 $O(log(min(N_1, N_2))$ 的時間內分解 $N_1, N_2$

### Batch GCD

當我們有一群公鑰，等於是我們有一堆 $N$，我們想知道是否有其中一對 $N$ 有**共同的質因數**

參閱這個 [blog](https://www.cryptologie.net/article/313/how-to-efficiently-compute-a-batch-gcd/)

### CTF 題目

[SECCON 2017 Online CTF - Ps and Qs](https://ctftime.org/task/5054)

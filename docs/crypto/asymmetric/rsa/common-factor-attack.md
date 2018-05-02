# Common Factor Attack

當兩個公鑰 $(n_1, e_1), (n_2, e_2)$ 的 $n_1, n_2$ 有**共同的質因數**時

我們直接用 $gcd(n_1, n_2)$ 在 $O(log(min(n_1, n_2))$ 的時間內分解 $n_1, n_2$

### Batch GCD

當我們有一群公鑰，等於是我們有一堆 $n$，我們想知道是否有其中一對 $n$ 有**共同的質因數**

參閱這個 [blog](https://www.cryptologie.net/article/313/how-to-efficiently-compute-a-batch-gcd/)

### CTF 題目

[SECCON 2017 Online CTF - Ps and Qs](https://ctftime.org/task/5054)

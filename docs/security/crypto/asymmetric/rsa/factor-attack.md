# Factor Attack

破解 RSA 最簡單的方式就是分解 $n = pq$

分解 $n$ 後我們就可以照著原本產生密鑰的方式找回 **私鑰**

下面列幾個分解 $n$ 的演算法

| factoring algorithm | notes | CTF challenges |
| --- | --- | --- |
| [Pollard's p - 1 Algorithm](/algorithm/factoring/pollard) | p - 1 是 smooth number | [SECCON 2017 Online CTF](https://ctftime.org/task/5056) |
| [Williams's p + 1 Algorithm](/algorithm/factoring/williams) | p + 1 是 smooth number | |
| [Fermat's Factorization Method](/algorithm/factoring/fermat) | $\|p-q\|$ 很小 | [Codegate CTF 2018 Preliminary - Miro](https://ctftime.org/task/5246) |

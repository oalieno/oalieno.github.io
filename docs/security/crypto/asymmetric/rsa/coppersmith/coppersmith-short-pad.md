### Coppersmith’s Short-Pad Attack

假設我們有公鑰 $(n, e)$

使用公鑰加密兩個明文 $m_1, m_2$ 為 $c_1, c_2$，其中 $m_1 = 2^m M + r_1, m_2 = 2^m M + r_2$

$r_1, r_2$ 為未知 padding，$M$ 為真正的明文

設 $g_1(x, y) = x ^ e - C_1, g_2(x, y) = (x + y) ^ e - C_2$

當 $y = r_2 - r_1$，$g_1, g_2$ 有 common root $x = m_1$

設 $h(y) = res_x(g_1, g_2)$

我們知道 resultant 有一個特性是，$g_1, g_2$ 有 common root 若且唯若 $res(g_1, g_2) = 0$

所以我們就用 coppersmith method 求 $h(y)$ 的 root

求得 root 後我們就知道 $y$，接下來就套用 Franklin-Reiter Related Message Attack 即可

### CTF 題目

[CONFidence CTF 2015 – RSA1](http://mslc.ctf.su/wp/confidence-ctf-2015-rsa1-crypto-400/)

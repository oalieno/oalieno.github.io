# Introduction to RSA

### 產生密鑰

選兩個質數 $p$ and $q$ ( $p \ne q$ )
 
$N = p \times q$

$r = \varphi(N) = \varphi(p) \times \varphi(q) = (p-1)(q-1)$

選一個 $e$ 滿足 $e < r$ and $gcd(e,r) = 1$

$d$ 是 $e$ 對 $r$ 的模反元素，也就是 $ed \equiv 1 \pmod{r}$

$(N,e)$ 是公鑰 $(N,d)$ 是私鑰

### 加解密

Alice 利用上面的公式產生公鑰 $(N_1, e_1)$ 和私鑰 $(N_1, d_1)$

Bob 利用上面的公式產生公鑰 $(N_2, e_2)$ 和私鑰 $(N_2, d_2)$

Alice 跟 Bob 交換公鑰

當 Alice 要傳明文 $n_1$ 給 Bob，$n_1^{e_2} \equiv c_1 \pmod{N_2}$ ，將 $c_1$ 傳給 Bob

Bob 接到密文 $c_1$ 後，$c_1^{d_2} \equiv n_1^{e_2d_2} \equiv n_1 \pmod{N_2}$ ，成功解回 $n_1$

當 Bob 要傳明文 $n_2$ 給 Alice，$n_2^{e_1} \equiv c_2 \pmod{N_1}$，將 $c_2$ 傳給 Alice

Alice 接到密文 $c_2$ 後，$c_2^{d_1} \equiv n_2^{e_1d_1} \equiv n_2 \pmod{N_1}$ ，成功解回 $n_2$  

### 證明加解密的正確性

$ed \equiv 1 \pmod{r}$

$ed = 1+kr = 1+k\varphi(N)$ for some $k$

$n^{ed} = n^{1+k\varphi(N)} = n(n^{\varphi(N)})^{k} \equiv n(1)^k = n  \pmod{N}$

### 攻擊層面

假設我們可以對 $N$ 做質因數分解出 $p, q$，那我們就可以照著產生公私鑰的流程還原 $d$，進而解開密文

假設我們可以知道 $d$，那我們也可以進而對 $N$ 做質因數分解 **==TODO==**

### 習慣

$N$ : 模數 ( modulus )

$e$ : 公鑰指數 ( public exponent )

$d$ : 私鑰指數 ( private exponent)

### 相關資源

[Twenty Years of Attacks on the RSA Cryptosystem](https://crypto.stanford.edu/~dabo/papers/RSA-survey.pdf)

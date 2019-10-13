# Introduction to RSA

### 產生密鑰

選兩個質數 $p$ and $q$ ( $p \ne q$ )
 
$n = p \times q$

$r = \varphi(n) = \varphi(p) \times \varphi(q) = (p-1)(q-1)$

選一個 $e$ 滿足 $e < r$ and $gcd(e,r) = 1$

$d$ 是 $e$ 對 $r$ 的模反元素，也就是 $ed \equiv 1 \pmod{r}$

$(n,e)$ 是公鑰 $(n,d)$ 是私鑰

### 加解密

Alice 利用上面的公式產生公鑰 $(n_1, e_1)$ 和私鑰 $(n_1, d_1)$

Bob 利用上面的公式產生公鑰 $(n_2, e_2)$ 和私鑰 $(n_2, d_2)$

Alice 跟 Bob 交換公鑰

當 Alice 要傳明文 $m_1$ 給 Bob，$m_1^{e_2} \equiv c_1 \pmod{n_2}$ ，將 $c_1$ 傳給 Bob

Bob 接到密文 $c_1$ 後，$c_1^{d_2} \equiv m_1^{e_2d_2} \equiv m_1 \pmod{n_2}$ ，成功解回 $m_1$

當 Bob 要傳明文 $m_2$ 給 Alice，$m_2^{e_1} \equiv c_2 \pmod{n_1}$，將 $c_2$ 傳給 Alice

Alice 接到密文 $c_2$ 後，$c_2^{d_1} \equiv m_2^{e_1d_1} \equiv m_2 \pmod{n_1}$ ，成功解回 $m_2$  

### 證明加解密的正確性

$ed \equiv 1 \pmod{r}$

$ed = 1+kr = 1+k\varphi(n)$ for some $k$

$m^{ed} = m^{1+k\varphi(n)} = m(m^{\varphi(n)})^{k} \equiv m(1)^k = m  \pmod{n}$

### 注記

[Stack Overflow Discussion](https://crypto.stackexchange.com/questions/29591/lcm-versus-phi-in-rsa)

可能會看到有些人的 $r = \lambda(n) = lcm(p - 1, q - 1)$，$\lambda$ 是 [Carmichael Function](/math/number-theory/carmichael-function/)

這也是對的不影響後面的流程

並且 $\lambda(n)$ 可以整除 $\varphi(n)$

### 習慣

$n$ : 模數 ( modulus )

$e$ : 公鑰指數 ( public exponent )

$d$ : 私鑰指數 ( private exponent)

### 攻擊層面

假設我們可以對 $n$ 做質因數分解出 $p, q$，那我們就可以照著產生公私鑰的流程還原 $d$，進而解開密文

假設我們可以知道 $d$，那我們也可以進而對 $n$ 做質因數分解，可以參考這個實作 [rsatool - factor_modulus](https://github.com/ius/rsatool/blob/master/rsatool.py)

### 各種攻擊手法

| $n, p, q$ | $e, d$ | $m$ | 註解 | 攻擊手法 |
| :-: | :-: | :-: | :-: | :-: |
| $p - 1$ 是 smooth number | | | 分解 $n$ | [Pollard's p - 1 Algorithm](/algorithm/factoring/pollard/) |
| $p + 1$ 是 smooth number | | | 分解 $n$ | [Williams's p + 1 Algorithm](/algorithm/factoring/williams/) |
| $|p - q|$ 很小 | | | 分解 $n$ | [Fermat's Factorization Method](/algorithm/factoring/fermat/) |
| | $d$ 很小 | | 分解 $n$ | [Wiener's Attack](/crypto/asymmetric/rsa/wiener) |
| | $d$ 很小 | | 分解 $n$ | [Boneh and Durfee Attack](/crypto/asymmetric/rsa/coppersmith/#boneh-and-durfee-attack) |
| $gcd(n_1, ..., n_k) \ne 1$ | | | 多個密文 | [Common Factor Attack](/crypto/asymmetric/rsa/common-factor-attack) |
| $n_1 = n_2$ | $gcd(e_1, e_2) = 1$ | $m_1 = m_2$ | 兩個密文 | [Common Modulus Attack](/crypto/asymmetric/rsa/common-modulus-attack) |
| $n_1 \ne \cdots \ne n_k$ | $e_1 = \cdots = e_k$ 且 $k \ge e$ | $m_1 = \cdots = m_k$ | 多個密文 | [Håstad's Broadcast Attack](/crypto/asymmetric/rsa/coppersmith/hastad) |
| $n_1 = n_2$ | $e_1 = e_2$ | $m_1 = f(m_2)$ | 兩個密文 | [Franklin-Reiter Related Message Attack](/crypto/asymmetric/rsa/coppersmith/franklin-reiter) |
| $n_1 = n_2$ | $e_1 = e_2$ | $m_1, m_2$ 是同一明文不同 padding | 兩個密文 | [Coppersmith Short-Pad Attack](/crypto/asymmetric/rsa/coppersmith/coppersmith-short-pad/) |

### 相關資源

[Twenty Years of Attacks on the RSA Cryptosystem](https://crypto.stanford.edu/~dabo/papers/RSA-survey.pdf)

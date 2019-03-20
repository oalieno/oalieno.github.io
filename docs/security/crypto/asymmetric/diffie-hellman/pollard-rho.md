# Pollard's Rho Algorithm

目標 : 找 $x$ 滿足 $\alpha^x = \beta \pmod{p}$

$\mathbb{Z}_p$ 的 order 是 $n = p - 1$

用 [Floyd's Cycle Finding Algorithm](/algorithm/floyd-cycle-finding) 尋找 $a, b, A, B$ 滿足 $\alpha^a\beta^b \equiv \alpha^A\beta^B \pmod{p}$

$\alpha^{bx + a} \equiv \alpha^{Bx + A} \pmod{p}$

$bx + a \equiv Bx + A \pmod{n}$

$x = (B - b)^{-1}(a - A) \mod{n}$

## 註記

[stack exchange](https://crypto.stackexchange.com/questions/40165/issue-implementing-pollards-rho-for-discrete-logarithms)

很有可能 $gcd(B - b, n) = h \ne 1$

$n = hq$

我們沒辦法求 module inverse

改求 $x'$ 滿足 $(a^h)^{x'} \equiv b^h \pmod{p}$

這樣 $a^h$ 這個 generator 會產生一個 order $q$ 的 subgroup

求出 $x'$ 之後

$hx' \equiv hx \pmod{n = hq}$

$x' \equiv x \pmod{q}$

## 複雜度

時間複雜度 : $O(\sqrt{n})$

空間複雜度 : $O(1)$

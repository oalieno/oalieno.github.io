# Digital Signature Algorithm ( DSA )

明文 $m$

## Key Generation

### General Parameters

選一個 hash function $H$，例如 : SHA1

選一個質數 $p$

選一個質數 $q$，使得 $p - 1$ 是 $q$ 的倍數

選一個 $g \in \mathbb{Z}_p^*$，$g$ 的 order 是 $q$，也就是 $q$ 是最小的正整數 $g^q \equiv 1 \pmod{p}$

### Private Key

選一個整數 x ( $0 < x < q$ )

### Public Key

$y = g^x \mod{p}$

## Sign

產生 random nonce $k$ ( $1 < k < q$ )

$r = (g^k \mod{p}) \mod{q}$ ( 如果 $r = 0$，再產生一次 $k$ )

$s = k^{-1}(H(m) + xr) \mod{q}$ ( 如果 $s = 0$，再產生一次 $k$ )

`signature = (r, s)`

## Verify

$w = s^{-1} \mod{q}$

$u_1 = H(m)w \mod{q}$

$u_2 = rw \mod{q}$

$v = g^{u_1}y^{u_2} \mod{q}$

`verify v = r`

## Proof of Correctness

$s = k^{-1}(H(m) + xr) \mod{q}$

$\begin{align} k & \equiv H(m)s^{-1}+xrs^{-1}\\ & \equiv H(m)w + xrw \pmod{q} \end{align}$

因為我們選 $p, q, g$ 的方式，$g^q \equiv 1 \pmod{p}$，所以對任意的 $a$ 我們可以 $g^a \equiv g^{a \mod{q}} \pmod{p}$

${\displaystyle {\begin{aligned}g^{k}&\equiv g^{H(m)w}g^{xrw}\\&\equiv g^{H(m)w}y^{rw}\\&\equiv g^{u_{1}}y^{u_{2}}{\pmod {p}}\end{aligned}}}$

${\displaystyle {\begin{aligned}r&=(g^{k}{\bmod {\,}}p){\bmod {\,}}q\\&=(g^{u_{1}}y^{u_{2}}{\bmod {\,}}p){\bmod {\,}}q\\&=v\end{aligned}}}$

## 相關資源

wiki 寫的很詳細

* https://en.wikipedia.org/wiki/Digital_Signature_Algorithm

# Merkle–Damgård Construction

![](https://i.imgur.com/0klMuwI.png)

我們有 function $h$，和 hash function $H$

$H_0 = IV$

$\forall 1 \leq i \leq n : H_i = h(H_{i-1}, m_{i-1})$

$H(m) = H_n$

### 應用

許多 hash function 都是 Merkle–Damgård Construction，差別在於他們實作不同的 function $h$

下面列出屬於 Merkle–Damgård Construction 的 hash function

| 名稱 | 輸出長度 | 區塊長度 |
| :--- | :--- | :--- |
| MD4 | 128 bits ( 16 bytes ) | 512 bits ( 64 bytes ) |
| MD5 | 128 bits ( 16 bytes ) | 512 bits ( 64 bytes ) |
| RIPEMD-160 | 160 bits ( 20 bytes ) | 512 bits ( 64 bytes ) |
| SHA0 | 160 bits ( 20 bytes ) | 512 bits ( 64 bytes ) |
| SHA1 | 160 bits ( 20 bytes ) | 512 bits ( 64 bytes ) |
| SHA256 | 256 bits ( 32 bytes ) | 1088 bits ( 136 bytes ) |
| SHA512 | 512 bits ( 64 bytes ) | 576 bits ( 72 bytes ) |
| WHIRLPOOL | 512 bits ( 64 bytes ) | 512 bits ( 64 bytes ) |




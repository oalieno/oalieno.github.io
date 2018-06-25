# LSB Oracle Attack

### 情境

有一個 server 會幫我們做 RSA 解密並把結果的最後一個 bit 告訴你 ( 奇偶 )

也就是給 server 密文 $c$

會得到 $LSB(c^d \text{ mod } n)$

### 攻擊手法

我們的目標是解出被 rsa 加密的密文 $c$

假設明文 $m \in [0, \frac{n}{2})$，那 $2m \in [0, n)$，且 $2m \text{ mod } n = 2m$ 是偶數  
假設明文 $m \in [\frac{n}{2}, n)$，那 $2m \in [n, 2n)$，且 $2m \text{ mod } n = 2m - n$ 是奇數 ( $n$ 是奇數 )

給 server $2^ec$ 並得到 $LSB(2m \text{ mod } n)$  
就可以判斷 $m$ 是落哪個範圍

已知明文 $m \in [0, \frac{n}{2})$  
假設明文 $m \in [0, \frac{n}{4})$，那 $4m \in [0, n)$，且 $4m \text{ mod } n = 4m$ 是偶數  
假設明文 $m \in [\frac{n}{4}, \frac{2n}{4})$，那 $4m \in [n, 2n)$，且 $4m \text{ mod } n = 4m - n$ 是奇數

已知明文 $m \in [\frac{n}{2}, n)$  
假設明文 $m \in [\frac{2n}{4}, \frac{3n}{4})$，那 $4m \in [2n, 3n)$，且 $4m \text{ mod } n = 4m - 2n$ 是偶數  
假設明文 $m \in [\frac{3n}{4}, n)$，那 $4m \in [3n, 4n)$，且 $4m \text{ mod } n = 4m - 3n$ 是奇數

給 server $4^ec$ 並得到 $LSB(4m \text{ mod } n)$  
就可以判斷 $m$ 是落哪個範圍  
接下來也是做一樣的事情，一步步把範圍縮小一半，就是二分搜，總共需要 $\text{log}_2(n)$ 個步驟

### 程式碼 ( python )

```python
L = 0
H = n
t = pow(2, e, n)
for _ in range(n.bit_length()):
    c = (t * c) % n
    if oracle(c) == 0:
        H = (L + H) // 2
    else:
        L = (L + H) // 2
m = L # plain text
```

### CTF 題目

[Google CTF 2018 Quals - PERFECT SECRECY](https://ctftime.org/task/6225)

### 相關資料

* http://blog.chrstm.com/2018/04/18/RSA_LSB_Oracle_Attack/

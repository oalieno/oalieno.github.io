# Length Extension Attack ( LEA )

這個攻擊適用於 Merkle–Damgård Construction 類型的 hash function $H$

當 MAC 驗證演算法是 $H(salt || message)$ ( $||$ 是字串串接 )

我們可以繞過 MAC 驗證機制的保護，**對明文串接部分資料**

### 限制

需要知道 $message$ 和 $H(salt || message)$ 和 $salt || message$ 的長度

### 原理

我們要繞過 MAC 驗證機制，其實就是在改動明文後重新計算驗證碼

![](https://i.imgur.com/amNP1qo.png)要重新計算很簡單，我們把 $H(salt || message)$ 當作新的 $IV'$ 把要串接的 $append$ 當作新的明文算下去就好

我們就可以成功算出新的明文 $message || padding || append$ 的驗證碼

### 註記

SHA224 不會受到 LEA 的攻擊，因為 SHA224 的計算步驟跟 SHA256 一模一樣，只差在 SHA224 只取 $H_n$ 的 224 bits，所以我們無法還原 SHA224 的 internal state，無法進行 LEA attack

### 工具

[hashpump](https://github.com/bwall/HashPump)

[hash\_extender](https://github.com/iagox86/hash_extender)


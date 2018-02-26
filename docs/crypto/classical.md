# 古典密碼

### 線上工具

[cryptii](https://cryptii.com/)

[quipqiup](https://quipqiup.com/)

### 凱薩加密 ( Caesar Cipher )

把每個字母都 shift k 位

k 就是密鑰

### Vigenère Cipher

把每個字母都 shift 不同的位數

要 shift 的位數就是密鑰

### Hill Cipher

密鑰是一個方矩陣

把明文和密鑰做矩陣乘法得到密文 (乘法和加法都是 % 26 模運算)

密鑰必需可逆

![](https://i.imgur.com/7FHT9Ao.png)

### Xor Cipher

將明文和密鑰轉成 01 binary 的形式

明文和密鑰做 xor 產生密文

密文和密鑰做 xor 產生明文

暴力破解 xor key 的工具 : [xortool](https://github.com/hellman/xortool)

### 手機鍵盤

![](https://i.imgur.com/DlJ9ehT.png)

Example:

21 = A

63 = O

### Bacon Cipher

一換一式的密碼

只用 A 和 B 表示

[wiki](https://en.wikipedia.org/wiki/Bacon%27s\_cipher)

### 豬圈密碼

一換一式的密碼

[百度](http://baike.baidu.com/item/%E7%8C%AA%E5%9C%88%E5%AF%86%E7%A0%81?fr=aladdin)

### 當鋪密碼

看中文字有幾個出頭，數字就是多少

Example:

井 = 8

大 = 5

[百度](http://baike.baidu.com/item/%E5%BD%93%E9%93%BA%E5%AF%86%E7%A0%81)

### 柵欄密碼

[百度](https://baike.baidu.com/item/%E6%A0%85%E6%A0%8F%E5%AF%86%E7%A0%81)

### 更多資源

[更多通靈之術](https://gist.github.com/0kami/ffd15270914492491e18ff9f070eab2b)

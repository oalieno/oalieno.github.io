# Implementation

### DER 格式

這個格式是由 type-length-value 的 tuple 組成

```
myQuestion FooQuestion ::= {
    trackingNumber     5,
    question           "Anybody there?"
}
```

```
30 -- 標籤說明 SEQUENCE
13 -- 長度

02 -- 標籤說明 INTEGER
01 -- 長度
05 -- value

16 -- 標籤說明 IA5String
0e -- 長度
41 6e 79 62 6f 64 79 20 74 68 65 72 65 3f -- value 
("Anybody there?" in ASCII)
```

真實的資料 : `30 13 02 01 05 16 0e 41 6e 79 62 6f 64 79 20 74 68 65 72 65 3f`

### PEM 格式

將 DER 格式做 base64 編碼

### 產生私鑰

使用 openssl

```bash
openssl genrsa -out private.pem 4096
```

### 產生公鑰

從私鑰中取出公鑰的部份

使用 openssl

```bash
openssl rsa -in private.pem -pubout > public.pem
```

### 解析公鑰

使用 pycrypto 套件

```py
from Crypto.PublicKey import RSA
public = RSA.importKey(open('public.pem').read())
```

使用 openssl

```bash
openssl rsa -pubin -text -noout < public.pem
```

### 解析私鑰

使用 pycrypto 套件

```py
from Crypto.PublicKey import RSA
private = RSA.importKey(open('private.pem').read())
```

使用 openssl

```bash
openssl rsa -in private.pem -text -noout
```

### 加密

使用 openssl

```bash
openssl rsautl -encrypt -pubin -inkey public.pem -in data -out data.enc
```

### 解密

使用 openssl

```bash
openssl rsautl -decrypt -inkey private.pem -in data.enc -out data
```




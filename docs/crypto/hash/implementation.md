# 實做

### command line

```
md5sum file
```

還有 `shasum`, `sha1sum`, `sha224sum`, `sha256sum`, `sha384sum`, `sha512sum`

`shasum` 等於 `sha1sum`

### python

以下用 md5 做例子，其他同理

#### hashlib

```python
import hashlib
hashlib.md5(b'OAlienO').digest()
# b's\xf8*\xe7\x1f*V!\xf1\x1aa(\xae\x92xw'
hashlib.md5(b'OAlienO').hexdigest()
# '73f82ae71f2a5621f11a6128ae927877'
```

#### pycrypto

```python
from Crypto.Hash import MD5
MD5.new(b'OAlienO').digest()
# b's\xf8*\xe7\x1f*V!\xf1\x1aa(\xae\x92xw'
MD5.new(b'OAlienO').hexdigest()
# '73f82ae71f2a5621f11a6128ae927877'
```

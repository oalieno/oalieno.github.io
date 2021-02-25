---
title: "【技術筆記】pyc 與他們的產地"
date: 2019-06-07 00:00:00
disqusId: oalieno
tags:
- python
- pyc
---

## pyc 格式

* 前 8 bytes 是 magic number，不同的 python 的版本會有不同的 magic number，參考 [/python/cpython/Lib/importlib/_bootstrap_external.py](https://github.com/python/cpython/blob/master/Lib/importlib/_bootstrap_external.py) 或 [/google/pytype/blob/master/pytype/pyc/magic.py](https://github.com/google/pytype/blob/master/pytype/pyc/magic.py)
* 接下來 8 bytes 會是 pyc 被產生出來的時間戳記
* 剩下的都是序列化的 PyCodeObject ( marshal.dumps 的結果 )

{% admonition info "python2" %}
python2 的 magic number 和時間戳記都是 4 bytes
{% endadmonition %}

## 編譯 pyc

### import

`import` 其他的 python 程式的時候，會把被引入的程式編譯成 `.pyc` 放到 `__pycache__` 資料夾  
這樣可以減少引入的時間

### `py_compile`

```python
import py_compile
py_compile.compile('test.py')
```

就會生成 `.pyc` 檔在 `__pycache__` 資料夾

### `compileall`

```python
python -m compileall .
```

可以一次 compile 資料夾內所有檔案

## 反編譯 pyc

要 decompile pyc 可以使用 [uncompyle6](https://github.com/rocky/python-uncompyle6/) 或 [decompyle3](https://github.com/rocky/python-decompile3) 或 [pycdc](https://github.com/zrax/pycdc)

但是注意到 [uncompyle6](https://github.com/rocky/python-uncompyle6/) 對 3.6 版以上的支援沒有很好，可以看 [這個 issue](https://github.com/rocky/python-uncompyle6/issues/316)，作者沒錢拿也累了，而且新版本又多了新東西，cfg 更難分析，所以 fork 出去了 [decompyle3](https://github.com/rocky/python-decompile3) 試圖重新整理並解決問題。

```bash
uncompyle6 test.pyc
```

```python
# uncompyle6 version 3.3.2
# Python bytecode 3.7 (3394)
# Decompiled from: Python 3.7.0 (default, Oct  9 2018, 16:58:41)
# [GCC 5.4.0 20160609]
# Embedded file name: /home/oalieno/lib.py
# Size of source mod 2**32: 23 bytes


def f(x):
    return x
# okay decompiling lib.cpython-37.pyc
```

## marshal & dis

```python
import marshal
import dis

# PyCodeObject
code = marshal.loads(open('test.pyc', 'rb').read()[16:])
code = compile('x = 1', 'filename', 'exec')

# bytecode
code.co_code

# disassemble PyCodeObject (with line number and some meta data)
dis.dis(code)

# disassemble bytecode (directly)
dis.dis(code.co_code)
```

## 用眼睛看 marshal dumps data

可以參考 [marshal.c](https://github.com/python/cpython/blob/3.8/Python/marshal.c)，格式都是一個 byte 的 type 加上後面一段 data，主要的程式碼在這裡 [marshal.c line 953](https://github.com/python/cpython/blob/3.8/Python/marshal.c#L953)，這裡的 `r_object` 嘗試去讀一個 `object` 進來，裡面就用 switch case 去處理不同的 type。
比如 `TYPE_INT` 就是用 `r_long` 去讀 4 個 bytes 的 long 進來，所以 `marshal.dumps(1)` 就會長得像 `b'\xe9\x01\x00\x00\x00'`，前面的 type 有時候會被 `| 0x80`，請看 [marshal.c line 223](https://github.com/python/cpython/blob/3.8/Python/marshal.c#L223)，所以 `0xe9 & (0x80 - 1) = ord('i')`。
另一個像是 `TYPE_CODE` 就先 `r_long` 了六次，讀了 `argcount, posonlyargcount, kwonlyargcount, ...` 進來，接下來才用 `r_object` 把 code 讀進來 ( 也就是 bytecode )，讀進來的 object 其實是 bytes 型態，也就是 bytecode 是用 bytes 型態存在 code object 裡面的，接下來再繼續把一些 `consts, names, varnames, ...` 讀進來。

---

1. https://docs.python.org/3/library/dis.html
2. http://unpyc.sourceforge.net/Opcodes.html
3. https://kdr2.com/tech/main/1012-pyc-format.html
4. https://late.am/post/2012/03/26/exploring-python-code-objects.html


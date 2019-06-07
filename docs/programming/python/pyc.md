## pyc 格式

* 前 8 bytes 是 magic number，不同的 python 的版本會有不同的 magic number，參考 [cpython/Lib/importlib/_bootstrap_external.py](https://github.com/python/cpython/blob/master/Lib/importlib/_bootstrap_external.py)
* 接下來 8 bytes 是 pyc 被產生出來的時間戳記
* 剩下的都是序列化的 `PyCodeObject` ( `marshal.dumps` 的結果 )

??? info "python2"
	python2 的 magic number 和時間戳記都是 4 bytes

## python → pyc

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

## pyc → python ( bytecode → python )

使用 [uncompyle6](https://github.com/rocky/python-uncompyle6/)

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

## python → PyCodeObject

```python
code = compile('x = 1', 'filename', 'exec')
```

`compile` 是內建的函式

## marshal

```python
import marshal

obj = marshal.loads(open('test.pyc', 'rb').read()[16:])
data = marshal.dumps([1, 2, 3])
```

## bytecode disassemble

```python
import dis
dis.dis(bytecode)
```

[^1]:
    https://docs.python.org/3/library/dis.html
[^2]:
    http://unpyc.sourceforge.net/Opcodes.html
[^3]:
    https://kdr2.com/tech/main/1012-pyc-format.html
[^4]:
	https://late.am/post/2012/03/26/exploring-python-code-objects.html

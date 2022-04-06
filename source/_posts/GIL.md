---
title: "【程式語言】Python GIL"
date: 2019-01-06
categories:
- 程式
tags:
- python
- GIL
---

## GIL 解決了什麼問題

每個 python 的物件都有一個 reference count
可以透過 `sys.getrefcount` 這個函式查看

```python
>>> import sys
>>> a = []
>>> b = a
>>> sys.getrefcount(a)
3
```

以上的例子，有 `a, b` 和 `sys.getrefcount` 的參數三個 reference
在有很多 threads 的情況下我們必須防止這個 reference count 的 race condition
一個簡單的解決方法就是 GIL

## 為什麼選 GIL 作為解決方法

就因為簡單易用，讓開發者會想加入開發以及使用它 ( 正因為如此使得 python 這麼熱門 )

## 那 GIL 為什麼到現在都還沒被拿掉

因為很多提案雖然讓 multithread 效率增加但卻讓 singlethread 變慢了

## python 3.2

在 python 3.2 稍微修改了 GIL 的運作機制 ( 小改進 )
原本在有 CPU-bound 和 IO-bound 的 threads 互搶時，IO-bound 要等很久才能拿回 GIL ( [詳情看這篇](http://dabeaz.blogspot.com/2010/01/python-gil-visualized.html) )

## 有 GIL 怎辦

### multiprocessing

用 multiprocessing 分許多 process，每個 process 會有獨立的 interpreter 和 memory space ( 不會有因為 GIL 卡住的問題 )
但是 multi-processing 比起 multi-threading 會有額外的 overhead

### Alternative Python interpreters

可以用其他實作版本的 python interpreters
比如 Jython 和 IronPython 沒有 GIL

---

1. https://realpython.com/python-gil/
2. https://www.youtube.com/watch?v=Obt-vMVdM8s
3. http://dabeaz.blogspot.com/2010/01/python-gil-visualized.html
4. http://www.dabeaz.com/python/GIL.pdf

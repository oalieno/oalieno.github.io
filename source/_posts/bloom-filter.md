---
title: "【演算法筆記】Bloom Filter"
date: 2018-09-11
categories:
- 演算法
tags:
- algorithm
---

# Bloom Filter

用來快速搜尋資料是否存在於資料庫

我們的資料庫是一個 $2^m$ 大小的陣列

```python
db = [False] * (2 ** m)
```

## 加資料進資料庫

我們有 $k$ 個 hash function 的輸出都是一個 $m$ bits 的數 ( $< 2^m$ )

把資料 $x$ 加進資料庫就是等於，將 $x$ 的各個雜湊值的位置設成 True

```python
for i in range(k):
    db[hash[k](x)] = True
```

## 查詢資料是否在資料庫裡

查詢資料 $x$ 是否在資料庫裡

```python
if all([db[hash[k](x)] for i in range(k)]):
    # 資料 x 可能在資料庫裡
else:
    # 資料 x 一定不在資料庫裡
```

---

1. http://www.evanlin.com/BloomFilter/
2. http://bryanpendleton.blogspot.com/2011/12/three-papers-on-bloom-filters.html

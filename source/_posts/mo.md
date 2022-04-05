---
title: "【演算法筆記】莫隊算法"
date: 2019-04-18
categories:
- 演算法
tags:
- algorithm
---

## 問題敘述

給一大小 $N$ 的序列，回答 $M$ 次查詢，每次查詢都是問一個區間 $[L, R]$ 的答案（比如區間眾數）

## 使用條件

1. 可以在很短的時間內由 $[L, R]$ 得到 $[L, R + 1], [L - 1, R], [L, R - 1], [L + 1, R]$ 的答案
2. 可以離線運算（也就是可以把輸入通通吃進來再輸出）

## 算法

將 $M$ 次查詢根據 $L$ 的大小分為 $\sqrt{N}$ 塊
也就是每塊裡面的 $L$ 最多只會差距 $\sqrt{N}$
每塊裡面的 $R$ 再由小到大排序
按照排好的順序算答案，缺少什麼就一個個加進來，多了什麼就一個個丟掉
`add` 函式就是實作把一個數加進目前的區間
`sub` 函式就是實作把一個數從目前的區間丟掉

```c++
struct Q {
    int l, r, b, i;
    bool operator < (const Q &q) {
        return b == q.b ? (r < q.r) : b < q.b;
    }
} q[MAXM];
```

```c++
int block = ceil(sqrt(MAXN));

for (int i = 0; i < m; i++) {
    int l, r; cin >> l >> r;
    q[i].l = l;
    q[i].r = r;
    q[i].b = q[i].l / block;
    q[i].i = i;
}

sort(q, q + m);
```

```c++
for (int i = 0, L = 0, R = -1; i < m; i++) {
    while (R < q[i].r) add(a[++R]);
    while (q[i].l < L) add(a[--L]);
    while (q[i].r < R) sub(a[R--]);
    while (L < q[i].l) sub(a[L++]);
    ans[q[i].i] = cur;
}
```

## 時間複雜度

$O(N^{1.5})$

## 奇偶優化

第一塊的 $R$ 從小到大
第二塊從 $R$ 大到小
第三塊從 $R$ 小到大
在從第一塊要到第二塊的時候，$R$ 都是大的
在從第二塊要到第三塊的時候，$R$ 都是小的

```c++
bool operator < (const Q &q) {
    return b == q.b ? (r < q.r) ^ (b % 2) : b < q.b;
}
```

## 題目

[Codeforces 86D - Powerful array](http://codeforces.com/contest/86/problem/D)

---

1. http://sunmoon-template.blogspot.com/2015/08/mos-algorithm.html
2. https://zhuanlan.zhihu.com/p/25017840
3. https://oi-wiki.org/misc/mo-algo/

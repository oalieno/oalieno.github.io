---
title: "【Windows Facts】檔案總管的排序規則"
date: 2023-08-15
categories:
- 雜談
tags:
- Windows
---

首先，先讓 ChatGPT 幫我開場一下，我覺得他腦補得好像還不錯xD

{% admonition abstract "ChatGPT 小故事時間" %}
    曾經好奇過，當我們在 Windows 檔案總管中觀察文件列表時，是什麼魔法使它們按照這樣一個特定的順序排列的嗎？嗯，這就是我要告訴你的故事：一個叫做 `StrCmpLogicalW` 的神秘 Windows API 的故事。

    想像一下，有一天，Windows 開發者們圍坐在一起，思考著如何讓檔案總管的排序更符合用戶的直覺。你看，當用戶看到 "img10.jpg" 和 "img2.jpg" 這兩個文件時，他們自然會認為 "img2.jpg" 應該在 "img10.jpg" 之前，即使從字母順序上看，"10" 確實是在 "2" 之前。但是，人們不是機器，我們的大腦認為 2 小於 10。這就是 Windows 開發者們需要解決的問題。

    於是，`StrCmpLogicalW` 這個 API 應運而生。
{% endadmonition %}

我是某一天在找我的樣本的時候才發現這個神祕的排序
因為樣本大多是用檔案的 hash 當作檔名，所以會長的像下面這樣

```
1c8bb52633d0861e2137a984048bd224
4adc8224eb736aa10e168390ac8cc251
05ece5d005502c211d57c5028fcce17e
7c30d3db6f1a28c08a21fbf1bccf771f
9f6fc22fd9c97e68eda4e707e6200849
29d0984f03fd2cce2f57b17005ab8e0e
58f75d29b3675cadf8f4f25be1275838
0524df255a48254e8a7a39a20d7328e3
ae2219b53716336c3bb26f8a5ff693c0
d4a0c7c5ff0e88f31167a91085539fdd
d300c7c5ff0e88f31167a91085539fdd
```

一般正常排序會用字典序(Lexicographic order)，所以第一個字母排起來應該要是 `0, 0, 1, 2, ...` 照順序排，但我們看到上面的例子，在檔案總管裡面，他是排成 `1, 4, 0, 7, ...` 這個奇怪的順序，到底在排什麼，我一開始注意到就是各種問號，後來查一查才發現他是用 `StrCmpLogicalW` 這個神祕的 Windows API 去比較兩個字串，[這篇](https://www.geoffchappell.com/studies/windows/shell/shlwapi/api/strings/strcmplogicalw.htm)有比較細節的去介紹其中的機制，比官方文件詳細。

`StrCmpLogicalW` 在比較的時候是用 meta-character 當做單位，meta-character 有分三種
- `.`
- 數字
- 其他字元

這三大類之間的排序是 `.` < 數字 < 其他字元，之後才是比較大類裡面的大小
重點就是這裡的數字是把整串的數字當作一個數值在比較
比如 `29d0` 就是把前面兩個數字當作 `29` 這個數值比較，所以 `9f6f` < `29d0` (`9` < `29`)
之所以要這樣排，應該跟 ChatGPT 介紹得差不多，為了讓一般使用者看起來更直覺，像是 `img1.jpg`, `img2.jpg`, ..., `img10.jpg` 就會照 `1, 2, 3, ...` 的順序排了，就不會因為用字典序排，所以變成先 `1, 10, 11, ...` 1 開頭的排完才換 2 的 `2, 20, 21, ...`，這種一般使用者比較不習慣的排法。

---
- https://learn.microsoft.com/en-us/windows/win32/api/shlwapi/nf-shlwapi-strcmplogicalw
- https://www.geoffchappell.com/studies/windows/shell/shlwapi/api/strings/strcmplogicalw.htm

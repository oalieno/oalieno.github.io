---
title: "【Powershell】WTF Powershell"
date: 2022-12-15
categories:
- 程式
tags:
- powershell
---

```powershell
3..4+,2
3..4+2
2+3..4
,2+3..4
```

以上四句表達式，哪一個是不合法的表達式呢?

...
<br>
<br>
<br>


答案是第三句 `2+3..4`，他會噴出以下的 error

```powershell
方法引動過程失敗，因為 [System.Object[]] 未包含名為 'op_Addition' 的方法。
位於 線路:1 字元:1
+ 2+3..4
+ ~~~~~~
    + CategoryInfo          : InvalidOperation: (op_Addition:String) []，RuntimeException
    + FullyQualifiedErrorId : MethodNotFound
```

## 一些背景知識

在詳細講解為什麼 `2+3..4` 會出錯之前，我們首先要理解 powershell 中的四個概念，都很好理解(有學過其他語言的話O_O)，分別是
- create array
- nested array
- append array
- range

### create array

要 create 一個 array 很簡單，只要用 `,` 逗號把數字隔開，像是 `1,2,3` 這樣，就是一個 array 了，不一定要有括號在外面

### nested array

兩個逗號的話，像這樣 `,,1` 就是一個兩層的 nested array，等同於 python 的 `[[1]]`

### append array

在 powershell 中，串接陣列是用 `+`，要 `,2` 陣列和 `,3` 陣列串接的話就是 `,2+,3`，等同於 python 的 `[2] + [3]`

### range

和其他的一些語言(bash, rust, ...)一樣，powershell 是採用 `..` 來作為 range operator，像是 `1..5` 就等於 `1,2,3,4,5`

## WTF Powershell

在複習了一些 powershell 的背景知識後，我們就來看看為什麼 `2+3..4` 會是不合法的表達式，明明對稱的另一個表達式 `3..4+2` 是合法的阿
首先就運算元的優先序來看，是 `,` > `..` > `+` 的，所以我們可以把上面的四個表達式寫成

```powershell
(3..4)+(,2)
(3..4)+2
2+(3..4)
(,2)+(3..4)
```

實際上這四句分別是
- `Object[] + Object[]`
- `Object[] + Int32`
- `Int32 + Object[]`
- `Object[] + Object[]`

回頭看一下 error message 你就會發現它其實就是在說不能把 `Int32 + Object[]`
但是 `Object[] + Int32` 卻可以，所以他只實作了一個方向的加法? WTF Powershell?
不過換個方向，用 python 的角度來看，他其實像是 `a = [3, 4]; a.append(2)` 是可以的，但是沒有 `a = 2; a.append([3, 4])` 這種寫法

總而言之，因為 Powershell 把 `Object[]` 和 `Object[]` 的 concat 和 `Object[]` 和 `Int32` 的 append 混著用都是用 `+` 一個 operator 搞定，所以第一次看的時候會有些頭昏眼花，但其實還勉強算合理，不像隔壁棚的 javascript 群魔亂舞的。Powershell 的部分之後應該還會有更新，大家下集再見。

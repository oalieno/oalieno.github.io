---
title: "【Category Theory 思維升級之路】Category 是什麼?"
date: 2022-04-27
categories:
- [數學]
tags:
- math
- category theory
---

一個 Category 是由三個要素所構成的
1. Objects
    - 本身沒有意義，就是一個路標，讓你辨別某個 morphism 是從哪個 object 到哪個 object 的
2. Morphisms (或叫做 Arrows)
    - 每個 morphism 都有起點和終點
3. Composition
    - 一張對應表，紀錄了兩個 morphism f, g 做 composition 的時候會對應到哪個 morphism

如果很難想像的話，可以先把 morphism 理解為只有一個輸入的函式 (就像 Lambda Calculus 裡面的函式)，所以這個函式會有輸入的型態和輸出的型態，比如一個 `isValid` 的 morphism 是從 `int -> bool`


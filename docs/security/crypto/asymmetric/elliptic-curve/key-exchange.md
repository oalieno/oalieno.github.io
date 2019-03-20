# Elliptic Curve Key Exchange

Elliptic Curve Key Exchange 可以在雙方沒有任何共通資訊的情況下，在不安全的通道中共享祕密

假設我們有一個 Elliptic Curve 和一個 generator $G$

Alice 和 Bob 想要共享祕密

1. Alice 隨機產生 $a$，Bob 隨機產生 $b$
2. Alice 計算 $aG = A$，傳送給 Bob
3. Bob 計算 $bG = B$，傳送給 Alice
4. Alice 計算 $a(bG) = abG$
5. Bob 計算 $b(aG) = abG$
6. Alice 和 Bob 共享祕密 $abG$

## Elliptic Curve Discrete Logarithm Problem

給在 Elliptic Curve 上的兩點 $P, Q$ 求 $k$ such that $Q = kP$

這個問題是非常難解的問題

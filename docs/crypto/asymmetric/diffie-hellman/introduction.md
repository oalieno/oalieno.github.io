# Introduction to Diffie-Hellman

Diffie-Hellman Key Exchange 可以在雙方沒有任何共通資訊的情況下，在不安全的通道中共享祕密

假設我們有一個質數 $p$ 和一個整數 $g$

Alice 和 Bob 想要共享祕密

1. Alice 隨機產生 $a$，Bob 隨機產生 $b$
2. Alice 計算 $g^a\ \text{mod}\ p$，傳送給 Bob
3. Bob 計算 $g^b\ \text{mod}\ p$，傳送給 Alice
4. Alice 計算 $(g^b\ \text{mod}\ p)^a\ \text{mod}\ p = g^{ab}\ \text{mod}\ p$
5. Bob 計算 $(g^a\ \text{mod}\ p)^b\ \text{mod}\ p = g^{ab}\ \text{mod}\ p$
6. Alice 和 Bob 共享祕密 $g^{ab}\ \text{mod}\ p$

Diffie-Hellman Key Exchange 能防止**竊聽**但不能防止**中間人攻擊**

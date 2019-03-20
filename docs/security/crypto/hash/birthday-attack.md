# Birthday Attack

birthday attack 主要是用 birthday paradox 估算暴力尋找 collision 需要多少時間

### 原理

有 $n$ 個人，每個人都可以從大小為 $m$ 的集合中拿出一個元素

$p(n, m)$ 表示有兩個人選擇相同的數字的機率 ( 等同於碰撞的機率 )

$\overline{p}(n, m)$ 表示任兩個人選擇的數字都不相同的機率

顯然的，$p(n, m) = 1 - \overline{p}(n, m)$

$\overline{p}(n, m) = \frac{m}{m} \cdot \frac{m-1}{m} \cdots \frac{m - (n - 1)}{m} = \frac{m!}{m^n(m-n)!}$

$p(n, m) = 1 -
 \frac{m!}{m^n(m-n)!}$

### 估算

接下來我們用 First order approximation of Taylor series expansion of $e^x$ 來估算 $p(n, m)$

$e^x \approx 1 + x$

$p(n, m) = 1 - (1 - \frac{0}{m})(1 - \frac{1}{m}) \cdots (1 - \frac{n-1}{m}) \approx 1 - e^{-\frac{0}{m}}e^{-\frac{1}{m}} \cdots e^{-\frac{n-1}{m}} = 1 - e^{-\frac{n(n-1)}{2m}} \approx 1 - e^{-\frac{n^2}{2m}}$

假設我們想要 $p(n, m) = \frac{1}{2}$ ( 50% )

$\frac{1}{2} = 1 - e^{-\frac{n^2}{2m}}$

$e^{-\frac{n^2}{2m}} = \frac{1}{2}$

$-\frac{n^2}{2m} = -ln(2)$

$n = \sqrt{(2ln(2))m} \approx \sqrt{m}$

假設我們想要 $p(n, m) = \frac{99}{100}$ ( 99% )，$n = \sqrt{(2ln(100))m} \approx 3\sqrt{m}$

也就是說假設我們有一個長度是 $a$ bits 的 hash function，我們只需要大約 $\sqrt{2^a} = 2^{a/2}$ 個選擇就很有可能找到一組 collision

### Find collision with constant space

假設我們要找一個長度是 64 bits 的 hash function 的 collision

根據 birthday paradox 我們在產生 $3\sqrt{2^{64}} = 12884901888 \approx 10^{10}$ 個 hash value 之後有 99% 的機會找到 collision

假設電腦一秒可以跑 $10^{8}$ 次運算 ( 用 C/C++ 差不多這個速度 )，我們需要 100 秒，也就是大約 2 分鐘不到就可以找到了

但是我們必須存一個很大的表，把所有產生的 hash value 記下來 ( $2^{64}$ bits = 2 EB )

這邊的 [stackexchange](https://crypto.stackexchange.com/questions/3295/how-does-a-birthday-attack-on-a-hashing-algorithm-work) 和 [paper](http://www.cs.umd.edu/~jkatz/imc/hash-erratum.pdf) 有講到一個只需要用 constant 的空間就可以做 birthday attack 的方法 ( 其實就是用 [Floyd's Tortoise and Hare](https://en.wikipedia.org/wiki/Cycle_detection#Floyd's_Tortoise_and_Hare) 做 cycle detection )


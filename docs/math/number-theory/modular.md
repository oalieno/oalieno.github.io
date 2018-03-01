# 模運算

### 模反元素

我們有整數 $a, n$

如果 $b$ 滿足 $ab \equiv 1 \pmod{n}$ 我們稱 $b$ 是 $a$ 在模 $n$ 下的模反元素

而 $a$ 在模 $n$ 下有模反元素的充分必要條件是 $gcd(a, n) = 1$

可以使用**擴展歐基里得**求模反元素

或是使用**費馬小定理**求模反元素

### 除法

模運算底下的除法，等同於乘以其模反元素

### 開根號

$$
x^2 \equiv a \pmod{n}
$$

給 $a$ 求 $x$，$x$ 為 $a$ 的 square root

有些數字沒有 square root

數字 $a$ 有 square root 若且唯若 $a^{\frac{p-1}{2}} \equiv 1 \pmod{p}$

數字 $a$ 沒有 square root 若且唯若 $a^{\frac{p-1}{2}} \equiv -1 \pmod{p}$

可以在這個 [blog](https://eli.thegreenplace.net/2009/03/07/computing-modular-square-roots-in-python) 找到實做

可以在這篇 [Square Roots from 1;24,51,10 to Dan Shanks](http://www.math.vt.edu/people/brown/doc/sqrts.pdf) 找到理論

在 $n \equiv 3 \pmod{4}$ 時有特殊解 $a^{\frac{1}{4}(n+1)} \pmod{n}$

相關主題 : [二次剩餘](/math/number-theory/quadratic-residue.md)

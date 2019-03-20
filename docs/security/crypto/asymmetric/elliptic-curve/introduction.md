# Introduction to Elliptic Curve

Elliptic Curve 的定義就是滿足下面的式子的點的集合

$E = \{(x,y) \ | \ y^2 = x^3 + ax + b\} \text{ where } 4a^3 + 27b^2 \neq 0$

$x,y,a,b \in \mathbb{R} \text{ or } \mathbb{Q} \text{ or } \mathbb{C} \text{ or } \mathbb{Z}_p$

在 cryptography 通常是用 $\mathbb{Z}_p$

再配上一個

1. 單位元素 $O$，代表無限遠的點

2. 反元素 $-P$，代表 $P$ 對 x 軸的鏡射

3. 運算元 $+$ ( 以下稱加法 )

就形成一個群

## P + Q = R

**從幾何的角度** : R 就是 P 和 Q 畫一條線找另一個在橢圓曲線上的交點對 x 軸的鏡射

**從代數的角度** :

$P \ne Q$ :

$s = \frac{y_p - y_q}{x_p - x_q}$

$x_r = s^2 - (x_p + x_q)$

$y_r = s(x_p - x_r) - y_p$

$P = Q$ :

$s = \frac{3x_p^2 + a}{2y_p}$

$x_r = s^2 -2x_p$

$y_r = s(x_p - x_r) - y_p$

可以看這個影片 : [P + Q in algebra](https://www.youtube.com/watch?v=XmygBPb7DPM)

## kP

可以看成 k 次加法

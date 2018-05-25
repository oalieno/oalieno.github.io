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

$s = \frac{y_P - y_Q}{x_P - x_Q}$

$x_R = s^2 - (x_P + x_Q)$

$y_R = s(x_P - x_R) - y_R$

可以看這個影片 : [P + Q in algebra](https://www.youtube.com/watch?v=XmygBPb7DPM)

## kP

可以看成 k 次加法

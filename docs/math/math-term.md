# 數學名詞

## Smooth Number

一個 smooth 的正整數的質因數都很小

一個 B-smooth 的正整數的質因數都不大於 B

## Semiprime

兩個質數的乘積叫做 semiprime

## 群 ( group )

一個群 $G$ 就是帶有一個運算元 $\bullet$ 的集合

並且具備以下四種性質

1. 封閉性 ( Closure ) : $\forall a,b \in G: a \bullet b\in G$
2. 結合律 ( Associativity ) : $\forall a,b,c\in G: (a \bullet b) \bullet c=a \bullet (b \bullet c)$
3. 存在單位元素 ( Identity element ) : $\exists e\in G: \forall g\in G: e \bullet g=g \bullet e=g$
4. 任一元素有一反元素 ( Inverse element ) : $\forall g\in G:\exists g^{-1}\in G:g^{-1} \bullet g = g \bullet g^{-1} = e$

## 交換群 ( 阿貝爾群 )

滿足交換律的群

交換律 ( commutativity ) : $\forall a, b \in G : a \bullet b = b \bullet a$

### 唯一性證明

單位元素的唯一性 : 考慮 $e_1, e_2$ 都是單位元素，那麼$e_1=e_1e_2=e_2$

反元素的唯一性 : 考慮 $a, b$ 都是 $c$ 的反元素，那麼 $a = acb = b$

## 半群

半群是只滿足**封閉性**和**結合律**的群

## 環 ( ring )

一個環 $R$ 就是帶有兩個運算元 $+$ 和 $\bullet$ 的集合

$(R, +)$ 形成一個**交換群**

$(R, \bullet)$ 形成一個**半群**

$\bullet$ 對於 $+$ 有分配律

左分配律 : $\forall a, b, c \in R : a \bullet (b + c) = (a \bullet b) + (a \bullet c)$

右分配律 : $\forall a, b, c \in R : (b + c) \bullet a = (b \bullet a) + (c \bullet a)$

## 交換環

$(R, \bullet)$ 滿足交換律

## 體 ( field )

是交換環 $(F, +, \bullet)$

且 $+$ 的單位元素 ( $0$ ) 不等於 $\bullet$ 的單位元素 ( $1$ )

且所有非零元素都有乘法反元素

## 有限體 ( finite field )

有限元素個數的體

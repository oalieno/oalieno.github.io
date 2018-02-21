# 群論簡介

一個群 $G$ 就是帶有一個運算元 $\bullet$ 的集合

並且具備以下四種性質

1. 封閉性 ( Closure ) : $\forall a,b \in G: a \bullet b\in G$
2. 結合律 ( Associativity ) : $\forall a,b,c\in G: (a \bullet b) \bullet c=a \bullet (b \bullet c)$
3. 存在單位元素 ( Identity element ) : $\exists e\in G: \forall g\in G: e \bullet g=g \bullet e=g$
4. 任一元素有一反元素 ( Inverse element ) : $\forall g\in G:\exists g^{-1}\in G:g^{-1} \bullet g = g \bullet g^{-1} = e$

有些群會有交換律 ( commutativity ) : $\forall a, b \in G : a \bullet b = b \bullet a$，有交換律的群稱作 abelian group

### 唯一性證明

單位元素的唯一性 : 考慮 $e_1, e_2$ 都是單位元素，那麼$e_1=e_1e_2=e_2$

反元素的唯一性 : 考慮 $a, b$ 都是 $c$ 的反元素，那麼 $a = acb = b$

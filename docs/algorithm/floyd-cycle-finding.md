# Floyd's Cycle-Finding Algorithm

一般來說，要找 cycle 就是要把所有掃過去的 $x_i$ 記起來

直到找到一個 $x_i$ 和 $x_0$ ~ $x_{i-1}$ 有重複

但是這樣很浪費空間

Floyd's Cycle-Finding Algorithm 就是只用儲存兩個數 tortoise 和 hare

tortoise 很慢，hare 很快

也就是 tortoise 每次走一步，hare 則走兩步

那麼 hare 會從 cycle 的後面追上 tortoise

追上之後也就是說 $x_i = x_{2i}$

那 $2i - i = i$ 會是 cycle 的倍數

接下來我們就將 tortoise reset 到原點，hare 留在原地

然後 tortoise 和 hare 都每次走一步

因為現在的 tortoise 和 hare 的距離固定是 $2i$ 也是 cycle 的倍數

所以說當 tortoise 走到 cycle 的起點時，hare 會在距離他數倍 cyle 的距離，也就是 tortoise 會等於 hare

我們就找到 cycle 的起點了

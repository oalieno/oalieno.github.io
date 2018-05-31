# Håstad's Broadcast Attack

假設某人將同一個訊息 $m$ 使用不同的 $n_1, n_2, \cdots n_k$ 相同的 $e = 3$ 加密成 $c_1, c_2, \cdots c_k$ 送給 $k$ 個人

只要 $k \ge e = 3$，我們就可以解出 $m$

$$
m^3 \equiv c_1 \pmod{n_1} \\
m^3 \equiv c_2 \pmod{n_2} \\
m^3 \equiv c_3 \pmod{n_3}
$$

根據中國剩餘定理，$m^3$ 在模 $n_1n_2n_3$ 下有一個唯一解 $c$

也就是 $m^3 \equiv c \pmod{n_1n_2n_3}$

而因為 $m \lt n_i\ \forall 1 \le i \le 3$，所以 $m^3 \lt n_1n_2n_3$，所以 $m^3 = c$

那我們用求出 $c$ 後就可以解出 $m = \sqrt[3]{c}$

# Neural Network

一個 neuron 長這樣

![](http://neuralnetworksanddeeplearning.com/images/tikz0.png)

$z = \mathbf{w} \cdot \mathbf{x} + b$

output = z 代入 activation function

### Activation functions

$\text{step function} = \left\{\begin{matrix} 0 \ \text{ if } z \le 0 \\ 1 \ \text{ if } z < 0 \end{matrix}\right.$

<img style="height: 300px;" src="../../../img/step-function.svg">

$\text{sigmoid function} = {\Large \frac{1}{1+e^{-z}}}$

<img style="height: 300px;" src="../../../img/sigmoid-function.svg">

### Gradient Descent

n : numbers of training input  
y : desired output  
a : output of input x

Let $\mathbf{h} = [\mathbf{w}$, $\mathbf{b}]$

Cost function : $\begin{eqnarray} C(\mathbf{h}) \equiv \frac{1}{n} \sum_x \frac{1}{2} \| \mathbf{y} - \mathbf{a} \|^2 \end{eqnarray}$ ( $\frac{1}{2}$ 是為了之後微分方便 )

從現在的位置看出去的斜率 $\nabla C = ({\large \frac{\partial C}{\partial h_0}, \frac{\partial C}{\partial h_1}, \cdots})$ 

用 $-\eta \nabla C$ 更新 $\mathbf{h}$，可以讓我們的 $C$ 往低處跑 ( $\eta$ 是 learning rate )

$h_k(t+1) = h_k(t) -\eta \frac{\partial C}{\partial h_k}$

### Learning Rate

* Learning Rate 很大 : 學習快但容易震盪
* Learning Rate 很小 : 學習慢但比較穩定

### Momentum

$h_k(t+1) = h_k(t) -\eta \frac{\partial C}{\partial h_k} + \underset{momentum}{\underbrace{\alpha(h_k(t) - h_k(t-1))}}$

Momentum 可以加速並穩定學習曲線

### 相關資源

* http://neuralnetworksanddeeplearning.com/
* http://darren1231.pixnet.net/blog/post/338810666-類神經網路(backpropagation)-筆記

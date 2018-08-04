# Introduction

### Dirac Notation

就是另一種表示 vector 的方式

$|\mathbf{v}\rangle = \begin{bmatrix}v_0\\ v_1\\ \cdots\\ v_n \end{bmatrix}$

$\langle \mathbf{v}| = \overline{\mathbf{v}^T} = \mathbf{v}^{\dagger} = [\ \overline{v_0} \ \overline{v_1} \ \cdots \ \overline{v_n}\ ]$

* $|\mathbf{v}\rangle$ 叫做 "ket-v"
* $\langle \mathbf{v}|$ 叫做 "bra-v"
* $\mathbf{v}^{\dagger}$ 就是共軛轉置
* $\mathbf{v}^T$ 就是轉置矩陣 ( transpose )
* $\overline{v}$ 就是共軛複數 ( complex conjugate )

### Hilbert Spaces

Hilbert Spaces $\mathbb{C}^n$

$\mathbf{u}, \mathbf{v}$ 的內積 ( inner product ) 是 $\langle \mathbf{u} | \mathbf{v} \rangle = \overline{\mathbf{u}^T}\mathbf{v} = \overline{u_0} \cdot v_0 + \overline{u_1} \cdot v_1 + \cdots + \overline{u_n} \cdot v_n$

$\mathbf{u}, \mathbf{v}$ 的外積 ( outer product ) 是 $| \mathbf{u} \rangle \langle \mathbf{v} | = \mathbf{u} \overline{\mathbf{v}^T} = \begin{bmatrix} u_0 \overline{v_0} & u_0 \overline{v_1}  & \cdots  & u_0 \overline{v_n} \\  u_1 \overline{v_0} & u_1 \overline{v_1} & \cdots & u_1 \overline{v_n} \\  \cdots & \cdots  & \ddots  & \cdots \\ u_n \overline{v_0} & u_n \overline{v_1} & \cdots & u_n \overline{v_n} \end{bmatrix}$

$\mathbf{u}, \mathbf{v}$ 的張量積 ( tensor product ) 是 $| \mathbf{u} \rangle | \mathbf{v} \rangle = | \mathbf{uv} \rangle = \begin{bmatrix} u_0 \cdot v_0 \\ u_0 \cdot v_1 \\ \vdots \\ u_0 \cdot v_n \\ u_1 \cdot v_0 \\ \vdots \\ u_{m-1} \cdot v_n \\ u_m \cdot v_0 \\ \vdots \\u_m \cdot v_n \end{bmatrix}$

$\mathbf{v}$ 的長度 ( norm ) 是 $\| \mathbf{v} \| = \sqrt{\langle \mathbf{v} | \mathbf{v} \rangle}$

1. $\langle \mathbf{u} | \mathbf{v} \rangle = \overline{\langle \mathbf{v} | \mathbf{u} \rangle}$
2. $\langle \mathbf{u} | a_0\mathbf{v} + a_1\mathbf{w} \rangle = a_0 \langle \mathbf{u} | \mathbf{v} \rangle + a_1 \langle \mathbf{u} | \mathbf{w} \rangle$

### Qubit

$|0\rangle = \begin{bmatrix} 1\\ 0 \end{bmatrix}, |1\rangle = \begin{bmatrix} 0\\ 1 \end{bmatrix}$

因為 $|0\rangle$ and $|1\rangle$ are orthonormal

$\langle 0 | 1 \rangle = \langle 1 | 0 \rangle = 0$

$\langle 0 | 0 \rangle = \langle 1 | 1 \rangle = 1$

### Unitary Matrix

$U$ 是 Unitary Matrix $\Leftrightarrow U^{-1} = U^{\dagger}$ 

$U$ 是 Unitary Matrix 的話  
$U^{\dagger}$ 是 Unitary Matrix  
$|det(U)| = 1$

### Bloch Sphere

我們可以用 $(\theta, \phi)$ 來表示所有 linear combination of $| 0 \rangle, | 1 \rangle$

$| \varphi \rangle = a_0 | 0 \rangle + a_1 | 1 \rangle$

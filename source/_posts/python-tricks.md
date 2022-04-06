---
title: "【程式語言】Python 的奇淫技巧"
date: 2019-01-06
categories:
- 程式
tags:
- python
---

列了一些我新發現的各種花招

## Function Attributes (python 2.1)

[PEP 232](https://www.python.org/dev/peps/pep-0232/#reference-implementation)

```python
def a():
    a.count += 1

a.count = 0

for i in range(10):
    a()

print(a.count) # 10
```

跟 C++ 中，在 function 裡面宣告 `static` 變數差不多

## Keyword-Only Arguments (python 3.0)

[PEP 3102](https://www.python.org/dev/peps/pep-3102/)

```
def func(a, b, *, c = None):
    pass
```

* `func(1, 2, 3)` 不行
* `func(1, 2, c = 3)` 這樣才合法

## Additional Unpacking Generalizations (python 3.5)

[PEP 448](https://www.python.org/dev/peps/pep-0448/)

```python
a = [1, 2, 3]
b = [*a, 4, 5]
print(b) # [1, 2, 3, 4, 5]
```

### Merge Dicts

```python
a = {1: 2}
b = {3: 4}
c = {**a, **b}
print(c) # {1: 2, 3: 4}
```

## Metaclasses

[Python Metaclasses](https://realpython.com/python-metaclasses/)

```python
class A:
    pass

B = type('B',
         (A,),
         {
            'attr': 10,
            'func': lambda obj: obj.attr
         })

b = B()
print(b.attr)   # 10
print(b.func()) # 10
```

```python 正常寫法
class A:
    pass

class B(A):
    attr = 10
    def func(self):
        return self.attr

b = B()
print(b.attr)   # 10
print(b.func()) # 10
```

看看就好xD

## shallow vs deep copy

[Shallow vs Deep Copying of Python Objects](https://realpython.com/copying-python-objects/)

{% admonition tip "assign" %}
```python
a = [[1, 2, 3], [4, 5, 6]]
b = a

b.append('hello')
b[0].append('world')

print(a)
# [[1, 2, 3, 'world'], [4, 5, 6], 'hello']
print(b)
# [[1, 2, 3, 'world'], [4, 5, 6], 'hello']
```
{% endadmonition %}

{% admonition tip "copy" %}
```python
import copy

a = [[1, 2, 3], [4, 5, 6]]
b = copy.copy(a)

b.append('hello')
b[0].append('world')

print(a)
# [[1, 2, 3, 'world'], [4, 5, 6]]
print(b)
# [[1, 2, 3, 'world'], [4, 5, 6], 'new object']
```
{% endadmonition %}

{% admonition tip "deepcopy" %}
```python
import copy

a = [[1, 2, 3], [4, 5, 6]]
b = copy.deepcopy(a)

b.append('hello')
b[0].append('world')

print(a)
# [[1, 2, 3], [4, 5, 6]]
print(b)
# [[1, 2, 3, 'world'], [4, 5, 6], 'new object']
```
{% endadmonition %}

* `copy.copy (shallow)` 只複製該物件，不會複製子物件
* `copy.deepcopy (deep)` 會遞迴複製所有子物件

### shallow copy on list

```python
a = [1, 2, 3]
b = list(a)
```

```python
a = [1, 2, 3]
b = a[:]
```

```python
a = [1, 2, 3]
b = a.copy()
```

```python
import copy

a = [1, 2, 3]
b = copy.copy(a)
```

## annotations

* [PEP 3107](https://www.python.org/dev/peps/pep-3107/)
* [PEP 526](https://www.python.org/dev/peps/pep-0526/)

### function annotations

```python
def func(a: int, b: list) -> int:
    pass

print(func.__annotations__)
# {'a': <class 'int'>, 'b': <class 'list'>, 'return': <class 'int'>}
```

### class annotations

```python
class A():
    var: int

print(A.__annotations__)
# {'var': <class 'int'>}
```

### variable annotations

```python
a: int
b: int = 2

print(__annotations__)
# {'a': <class 'int'>, 'b': <class 'int'>}
```

## intern string

```python
s = 'hello'
s = sys.intern(s)
```

把字串存進快取池，相同的字串只會存一次
做字串比對會比較快且節省空間

---

1. http://guilload.com/python-string-interning/
2. http://www.laurentluce.com/posts/python-string-objects-implementation/

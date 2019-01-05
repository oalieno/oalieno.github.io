# python 中的奇淫技巧

列了一些我新發現的各種新花招

## Function Attributes ==2.1==

[PEP 232](https://www.python.org/dev/peps/pep-0232/#reference-implementation)

```python tab=
def a():
    a.count += 1

a.count = 0

for i in range(10):
    a()

print(a.count)
```

```tab="output"
10
```

跟 C++ 中，在 function 裡面宣告 `static` 變數差不多

## Keyword-Only Arguments ==3.0==

[PEP 3102](https://www.python.org/dev/peps/pep-3102/)

```
def func(a, b, *, c = None):
    pass
```

* {--`func(1, 2, 3)`--}
* {++`func(1, 2, c = 3)`++}

## Additional Unpacking Generalizations ==3.5==

[PEP 448](https://www.python.org/dev/peps/pep-0448/)

```python tab=
a = [1, 2, 3]
b = [*a, 4, 5]
print(b)
```

```python tab="output"
[1, 2, 3, 4, 5]
```

### Merge Dicts

```python tab=
a = {1: 2}
b = {3: 4}
c = {**a, **b}
print(c)
```

```python tab="output"
{1: 2, 3: 4}
```

## Metaclasses

[Python Metaclasses](https://realpython.com/python-metaclasses/)

```python tab="metaclasses"
class A:
    pass

B = type('B',
         (A,),
         {
            'attr': 10,
            'func': lambda obj: obj.attr
         })

b = B()
print(b.attr)
print(b.func())
```

```python tab="normal"
class A:
    pass

class B(A):
    attr = 10
    def func(self):
        return self.attr

b = B()
print(b.attr)
print(b.func())
```

```tab="output"
10
10
```

看看就好xD

## shallow vs deep copy

[Shallow vs Deep Copying of Python Objects](https://realpython.com/copying-python-objects/)

!!! tip "assign"
    ```python tab=
    a = [[1, 2, 3], [4, 5, 6]]
    b = a

    b.append('hello')
    b[0].append('world')

    print(a)
    print(b)
    ```

    ```python tab="output"
    [[1, 2, 3, 'world'], [4, 5, 6], 'hello']
    [[1, 2, 3, 'world'], [4, 5, 6], 'hello']
    ```

!!! tip "copy"
    ```python tab=
    import copy
    
    a = [[1, 2, 3], [4, 5, 6]]
    b = copy.copy(a)

    b.append('hello')
    b[0].append('world')

    print(a)
    print(b)
    ```

    ```python tab="output"
    [[1, 2, 3, 'world'], [4, 5, 6]]
    [[1, 2, 3, 'world'], [4, 5, 6], 'new object']
    ```

!!! tip "deepcopy"
    ```python tab=
    import copy

    a = [[1, 2, 3], [4, 5, 6]]
    b = copy.deepcopy(a)

    b.append('hello')
    b[0].append('world')

    print(a)
    print(b)
    ```

    ```python tab="output"
    [[1, 2, 3], [4, 5, 6]]
    [[1, 2, 3, 'world'], [4, 5, 6], 'new object']
    ```

* `copy.copy (shallow)` 只複製該物件，不會複製子物件
* `copy.deepcopy (deep)` 會遞迴複製所有子物件

### shallow copy on list

```python tab="option 1"
a = [1, 2, 3]
b = list(a)
```

```python tab="option 2"
a = [1, 2, 3]
b = a[:]
```

```python tab="option 3"
a = [1, 2, 3]
b = a.copy()
```

```python tab="option 4"
import copy

a = [1, 2, 3]
b = copy.copy(a)
```

## annotations

* [PEP 3107](https://www.python.org/dev/peps/pep-3107/)
* [PEP 526](https://www.python.org/dev/peps/pep-0526/)

### function annotations

```python tab=
def func(a: int, b: list) -> int:
    pass

print(func.__annotations__)
```

```python tab="output"
{'a': <class 'int'>, 'b': <class 'list'>, 'return': <class 'int'>}
```

### class annotations

```python tab=
class A():
    var: int

print(A.__annotations__)
```

```python tab="output"
{'var': <class 'int'>}
```

### variable annotations

```python tab=
a: int
b: int = 2

print(__annotations__)
```

```python tab="output"
{'a': <class 'int'>, 'b': <class 'int'>}
```

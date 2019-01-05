# Decorators

## Basic Example

```python tab=
def my_decorator(func):
    def wrapper():
        print('before')
        func()
        print('after')
    return wrapper

def my_func():
    print('hello')

my_func = my_decorator(my_func)

my_func()
```

```tab="output"
before
hello
after
```

上面的程式碼可以寫得更簡潔，使用 python 的語法糖

```python tab=
def my_decorator(func):
    def wrapper():
        print('before')
        func()
        print('after')
    return wrapper

@my_decorator
def my_func():
    print('hello')

my_func()
```

```tab="output"
before
hello
after
```

## Function Arguments

```python tab=
def my_decorator(func):
    def wrapper(*args, **kwargs):
        print('before')
        func(*args, **kwargs)
        print('after')
    return wrapper

@my_decorator
def my_func(name):
    print(f'hello {name}')

my_func('oalieno')
```

```tab="output"
before
hello oalieno
after
```

如果 function 有參數，記得要把 `*args, **kwargs` 傳遞進去

## functools.wraps

```python tab=
def my_decorator(func):
    def wrapper(*args, **kwargs):
        print('before')
        func(*args, **kwargs)
        print('after')
    return wrapper

@my_decorator
def my_func(name):
    print(f'hello {name}')

print(my_func)
```

```tab="output"
<function my_decorator.<locals>.wrapper at 0x7f77ec935bf8>
```

這樣直接印出 decorate 過得 function 會變成 decorator 底下的 local 變數

```python tab=
import functools

def my_decorator(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        print('before')
        func(*args, **kwargs)
        print('after')
    return wrapper

@my_decorator
def my_func(name):
    print(f'hello {name}')

print(my_func)
```

```tab="output"
<function my_func at 0x7fe73b855bf8>
```

使用 `functools` 裡面的 `wraps` 函式，讓我們的 decorator 隱形

## Decorator Arguments

```python tab=
def my_decorator(before, after):
    def decorator_wrapper(func):
        def wrapper(*args, **kwargs):
            print(before)
            func(*args, **kwargs)
            print(after)
        return wrapper
    return decorator_wrapper

@my_decorator('first', 'second')
def my_func(name):
    print(f'hello {name}')

my_func('oalieno')
```

```tab="output"
first
oalieno
second
```

## Class Decorators

```python tab=
class MyClass:
    def __init__(self, func):
        self.func = func
        self.counter = 0
    def __call__(self, *arg, **kwargs):
        self.counter += 1
        print(f'counter = {self.counter}')
        return self.func(*arg, **kwargs)

@MyClass
def my_func(name):
    print(f'hello {name}')

my_func('oalieno')
my_func('oalieno')
```

```tab="output"
counter = 1
hello oalieno
counter = 2
hello oalieno
```

記得 decorator 只是 `my_func = my_decorator(my_func)` 的語法糖

所以要用 Class 當 decorator 的話，我們只要實做 `__call__` 讓 Class 可以被呼叫就可以了

原本的函式會在 `__init__` 被傳進去

## 參考資料

* https://realpython.com/primer-on-python-decorators/

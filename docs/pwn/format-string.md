# Format String

這邊只列一些對 exploit 重要的，更多資訊可以參考 [wikipedia](https://en.wikipedia.org/wiki/Printf_format_string)

#### %c %s

```c
int width = 5, garbage;
char ch = 'a';
// 基本款
printf("%c\n", ch);
// 固定長度 padding
printf("%10c\n", ch);
// 動態長度 padding
printf("%*c\n", width, ch);
// 指定參數位置
printf("%2$c\n", width, ch);
// 組合技
printf("%3$*2$c\n", garbage, width, ch);
```

輸出如下

```
a
         a
    a
a
    a
```

%c 幾乎等同於 %s，只差在

%c 印一個字

%s 印到 `'\x00'` 之前

#### %n

```c
int num = 0, garbage;
// 將目前印出字數寫回變數
printf("AAAA%n\n", &num);
printf("num = %d\n", num);
// 將目前印出字數寫回指定參數位置的變數
printf("AAAAAA%2$n\n", garbage, &num);
printf("num = %d\n", num);
```

輸出如下

```
AAAA
num = 4
AAAAAA
num = 6
```

| 格式 | 長度 ( bytes ) |
| :-: | :-: |
| %lln | 8 |
| %n | 4 |
| %hn | 2 |
| %hhn | 1 |

#### 參數順序

For amd64 :

`rdi` is the format ( ex : `"%p"` )

`rsi` $\to$ `rdx` $\to$ `rcx` $\to$ `r8` $\to$ `r9` $\to$ `stack`

#### _printf_chk

當 format string vulnerability 發生在 `_printf_chk`

很多東西都會被檔掉

1. `%n` 寫值不能用

2. `%4$p` 指定參數也不能用

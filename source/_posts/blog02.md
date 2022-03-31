---
title: "【部落格開發日誌】0x02"
date: 2020-02-22
tags:
- hexo
- icarus
- blog
---

## Admonition

我把 [Material for MkDocs - Admonition Extension](https://squidfunk.github.io/mkdocs-material/extensions/admonition/) 搬過來啦，因為實在太好看，就搬過來用了，並且做了下面兩個小改動

1. 把 `border-radius` 拔掉了，還是方的好看
2. 陰影改淡了，感覺比較對

{% admonition example "example" %}
    這是範例
{% endadmonition %}

{% admonition note "note" %}
    這是範例
{% endadmonition %}

{% admonition abstract "abstract" %}
    這是範例
{% endadmonition %}

{% admonition info "info" %}
    這是範例
{% endadmonition %}

{% admonition tip "tip" %}
    這是範例
{% endadmonition %}

{% admonition success "success" %}
    這是範例
{% endadmonition %}

{% admonition question "question" %}
    這是範例
{% endadmonition %}

{% admonition warning "warning" %}
    這是範例
{% endadmonition %}

{% admonition failure "failure" %}
    這是範例
{% endadmonition %}

{% admonition danger "danger" %}
    這是範例
{% endadmonition %}

{% admonition quote "quote" %}
    這是範例
{% endadmonition %}

### 實作

從 [hexo-tag-admonition](https://github.com/haishanh/hexo-tag-admonition) 借 code 過來改
基本上就是 register 一個新的 hexo tag，然後用到了 `details` 和 `summary` 這兩個 html5 新的 tag
改的時候有幾個小地方要注意
1. `details` tag 原本就有一個箭頭但是很醜，在 `summary::-webkit-details-marker` 設定 `display:none` 拔掉他
2. icon 用到了 `font-family: Material Icons`，要在 `head` 裡面加個字體

## Code block

另一個改動是程式碼區塊的部分，原來的有點小醜，就改了幾下

1. 沒有給檔名就不要顯示上面的 header
2. 可以指定起始行數，以及指定標記特定行數，如下範例

```markdown
python run.py >3,6
```

```python run.py >3,6
import math

def main():
    print(f'test {math.factorial(5)}')

main()
```

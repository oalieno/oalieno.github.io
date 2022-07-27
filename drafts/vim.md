---
title: "【工具篇】vimrc 設定大全"
date: 2022-04-05
categories:
- 程式
tags:
- vim
---

## Highlight trailing spaces

vim 預設不會顯示 trailing spaces
但通常都是不小心留下了 trailing spaces 而不是故意要留的，除了有些 markdown 語法可以用 2 個 trailing spaces 做結尾來換行
所以把 trailing spaces 顯示出來可以很明顯的看到哪邊有不小心加在後面的 trailing spaces
設定如下，顏色可以自己換，這邊是設定普通的 `darkgreen`

```vim ~/.vimrc
highlight ExtraWhitespace ctermbg=darkgreen guibg=darkgreen
match ExtraWhitespace /\s\+$/
```

## No swap file

swap file 很討厭啊，每次編輯都會產生一個暫時的 `.swp` 檔案
可以在設定把他關掉
不過 swap file 在突然斷電的時候，可以幫助你恢復檔案就是了，自己斟酌要不要關xD

```vim ~/.vimrc
set noswapfile
```

## Tab 4 spaces

這是必須的設定，不然 tab 會是 `\t`，現在沒有人在用 `\t` 了啦，除非是在寫 `Makefile`

```vim ~/.vimrc
filetype plugin indent on
set tabstop=4
set shiftwidth=4
set expandtab
```

---

1. https://stackoverflow.com/questions/234564/tab-key-4-spaces-and-auto-indent-after-curly-braces-in-vim

---
title: "一秒變時尚 - iTerm2 + zsh + zimfw + powerlevel10k + nord"
date: 2020-01-18 16:11:58
disqusId: oalieno
tags:
- iterm2
- zsh
- zimfw
- powerlevel9k
- powerlevel10k
- nord
---

## [Zimfw](https://github.com/zimfw/zimfw)

我也是用了很久的 [oh-my-zsh](https://github.com/ohmyzsh/ohmyzsh)，一直都覺得 terminal 有點慢，不過直到看到這篇 [打造屬於你自己的極速 Shell「iTerm + zsh + zim + powerlevel10k」](https://www.jkg.tw/?p=2876)，才有想要換的念頭

[zimfw](https://github.com/zimfw/zimfw) 的優點就是快，雖然他不像 [oh-my-zsh](https://github.com/ohmyzsh/ohmyzsh) 一樣有[這麼多內建的插件](https://github.com/ohmyzsh/ohmyzsh/tree/master/plugins)，但一般的 zsh 插件他也都可以安裝，而且最常用也一定要有的 `zsh-syntax-highlight`, `zsh-completions`, `zsh-autosuggestions` 預設都幫你配置好了，其他插件的安裝請看下面的說明

### 插件安裝

官方提供的插件[在這](https://github.com/zimfw/zimfw/wiki/Modules)，archive 預設沒裝，我推薦可以安裝，他跟 [oh-my-zsh](https://github.com/ohmyzsh/ohmyzsh) 的 [extract](https://github.com/ohmyzsh/ohmyzsh/tree/master/plugins/extract) 插件是同樣的功能，會自動幫你根據副檔名解壓縮，就不需要再去背那些指令

非官方的插件的話，我們以 [alias-tips](https://github.com/djui/alias-tips) 這個插件做例子，只要在 `.zimrc` 加入下面一行

```bash .zimrc
zmodule djui/alias-tips
```

然後打 `zimfw install`，他就會去幫你 git clone 那個 repo 下來，接著在載入插件的時候會去找 `{init.zsh|module_name.{zsh|plugin.zsh|zsh-theme|sh}}` 這個格式的檔名，只要找得到這樣的檔案的 github repo 基本上都可以安裝

## [Powerlevel10k](https://github.com/romkatv/powerlevel10k)

[powerlevel10k](https://github.com/romkatv/powerlevel10k) 看名字就知道是用來幹掉 [powerlevel9k](https://github.com/Powerlevel9k/powerlevel9k) 的，記得當初看到 [powerlevel9k](https://github.com/Powerlevel9k/powerlevel9k) 的時候兩眼發光，此生沒看過這麼漂亮的主題，直到現在看到 [powerlevel10k](https://github.com/romkatv/powerlevel10k) powerlevel9k，那 [powerlevel10k](https://github.com/romkatv/powerlevel10k) 究竟是猛在哪，就我來看，我覺得 [powerlevel10k](https://github.com/romkatv/powerlevel10k) 最大的優點在於他優秀的客製化系統，請看下圖

![](/images/powerlevel10k.gif)

可以讓你一步步設定每個細節，而且不用自己手動去改設定，只要跑 `p10k configure` 這個指令就好，對懶人十分的友善阿，而且 [powerlevel10k](https://github.com/romkatv/powerlevel10k) 直接推薦我們安裝 `MesloLGS NF` 字型，裝好就完事了，不需要像 [powerlevel9k](https://github.com/Powerlevel9k/powerlevel9k) 還要自己調字型和大小，另一個優點就是速度了，官方說是比 powerlevel9k 快上不少，但是因為我同時也換了 zimfw 所以不知道是不是真的有變快

## [Nord](https://www.nordtheme.com/)

顏色的配置我使用 Nord 這款，有冰天雪地高冷的感覺，我把他套用到 iTerm2, vim, tmux 上，讓整個環境有一致的色調，十分舒服，請看下圖，安裝的部分可以到[官方的 github](https://github.com/arcticicestudio?tab=repositories) 裡面去找，各大常見的編輯器幾乎都有支援

![](/images/nord.gif)
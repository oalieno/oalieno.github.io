可以看看我的設定檔 [dotfile](https://github.com/OAlienO/dotfile)，有 `install.sh` 可以一鍵安裝，但是有些部分可能還是要手動來

## [zsh](https://www.zsh.org/)

使用 [oh my zsh](https://github.com/robbyrussell/oh-my-zsh) 框架管理設定與插件

使用 [powerlevel9k](https://github.com/bhilburn/powerlevel9k) 主題

!!! failure "command not found: print_icon"
    ```
    locale-gen --lang en_US.UTF-8
    ```

### 插件

| 插件 | 說明 |
| --- | --- |
| z | 快速切換路徑 |
| git | 各種 git 指令縮寫 |
| extract | 一鍵解壓縮 |
| zsh-nvm | 幫你安裝好 nvm |
| zsh-completions | 指令補齊 |
| zsh-autosuggestions | 根據歷史紀錄顯示可能指令 |
| zsh-syntax-highlighting | 幫你判斷指令文法並上色 |

## [SpaceVim](https://github.com/SpaceVim/SpaceVim)

幫你裝好各種插件的 `vim`

`SpaceVim` 用在 `neovim` 上比較沒有問題，所以可以先裝個 `neovim`

!!! failure "look: /usr/share/dict/words: no such file or directory"
    ```
    sudo apt-get install wamerican
    ```

## [thefuck](https://github.com/nvbn/thefuck)

幫你更正你打錯的指令

<script id="asciicast-WOpbhvxaTxUh7cafw7VttN2iZ" src="https://asciinema.org/a/WOpbhvxaTxUh7cafw7VttN2iZ.js" data-rows="30" async></script>

## [tldr](https://github.com/tldr-pages/tldr)

簡單明瞭用例子來說明的 `man page`

<img style="width: 600px" src="https://i.imgur.com/gXylicV.png">

## [lolcat](https://github.com/busyloop/lolcat)

就是彩色的 `cat`，沒有什麼實際用途 xD

<img style="width: 600px" src="https://i.imgur.com/fMBBTVf.png">

## [bat](https://github.com/sharkdp/bat)

更好看的 `cat`

<img style="width: 600px" src="https://i.imgur.com/JiQg08m.png">

## [ncdu](https://dev.yorhel.nl/ncdu)

更好看的 `du`

## [fd](https://github.com/sharkdp/fd/)

更好看的 `find`

[^1]:
    https://zcheng.ren/2018/07/27/spacevimtutorial/
[^2]:
    https://hufangyun.com/2017/zsh-plugin/
[^3]:
    https://remysharp.com/2018/08/23/cli-improved/

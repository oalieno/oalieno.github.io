---
title: "【部落格開發日誌】0x00"
date: 2020-01-23
tags:
- hexo
- icarus
- blog
---

之前的部落格是用 mkdocs，但是 mkdocs 其實是用來生成 document 的，不是拿來生成部落格的，所以文章都沒有日期，也沒有近期文章或是標籤的功能，我之所以選 mkdocs 是因為 [mkdocs-material](https://github.com/squidfunk/mkdocs-material) 實在太好看了很對我胃口，不過最近興起了想幫部落格換個皮的念頭，主要是看上了 [icarus](https://blog.zhangruipeng.me/hexo-theme-icarus/) 和 [material-x](https://xaoxuu.com/wiki/material-x/) 這兩個主題，都是 hexo 的主題，最後選了 [icarus](https://blog.zhangruipeng.me/hexo-theme-icarus/)，然後再自己手動調整，下面會說明一下我手動調整的內容

## 排版

這個主題整體來說很好看的，但是我不喜歡他的排版，文章只能擠在中間細細長長的，左右兩邊還留了很多空隙，不知道是作者的螢幕太小還是我螢幕太大，所以我把所有 widget 都移到左邊，然後把欄位的比例改成 3:9，css 的部份在 `source/css/style.styl:21` 把寬度調寬

```ejs layout/layout.ejs
case 2:
    return 'is-9-tablet is-9-desktop is-9-widescreen';
```

```ejs layout/common/widget.ejs
case 2:
    return 'is-3-tablet is-3-desktop is-3-widescreen';
```

```css source/css/style.styl
gap = 40px
...
@media screen and (min-width: screen-widescreen)
    .is-1-column .container
    .is-2-column .container
        max-width: screen-widescreen - 2 * gap
        width: screen-widescreen - 2 * gap
@media screen and (min-width: screen-fullhd)
    .is-2-column .container
        max-width: screen-fullhd - 2 * gap
        width: screen-fullhd - 2 * gap
    .is-1-column .container
        max-width: screen-fullhd - 2 * gap
        width: screen-fullhd - 2 * gap
```

## Read More

原本 [icarus](https://blog.zhangruipeng.me/hexo-theme-icarus/) 只有 excerpt 這個選項可以加在文章的 front-matter 中，如下

```
---
title: "部落格開發日誌"
excerpt: 寫一些摘要在這邊
---
```

但是要每一篇都要自己寫摘要好麻煩，我比較想要的是只顯示固定長度，然後邊邊模糊處理，所以就自己手刻了一個

```ejs layout/common/article.ejs
<div class="card <%= index && (!post.hasOwnProperty('readmore') || post.readmore) ? 'card-readmore' : '' %>">
...
    <% if (index && (!post.hasOwnProperty('readmore') || post.readmore)) { %>
        <div class="level is-mobile readmore-button">
            ...
        </div>
    <% } %>
...
```

```css source/css/style.styl
.card-readmore
    max-height: 400px
    overflow: hidden
    position: relative
    .readmore-button
        position absolute
        left: 0
        bottom: 20px
        width: 100%
        display: flex
        justify-content center
        z-index: 20
    &:after
        content: ''
        position: absolute
        bottom: 60px
        width: 100%
        height: 100px
        z-index: 10
        background-image: linear-gradient(to bottom, hsla(0, 100%, 100%, 0), hsla(0, 100%, 100%, 0.9))
    &:before
        content: ''
        position: absolute
        bottom: 0
        width: 100%
        height: 60px
        z-index: 10
        background-image: linear-gradient(to bottom, hsla(0, 100%, 100%, 0.9), hsla(0, 100%, 100%, 1))
```

<h2>Adblock</h2>

我本身有在用 AdBlock，然後在用 [icarus](https://blog.zhangruipeng.me/hexo-theme-icarus/) 主題的時候發現有些物件會憑空消失，比如 back-to-top 那個按了可以回到頁面頂端的小按鈕，後來發現是被 AdBlock 砍了，因為那個小按鈕有 `.back-to-top` 這個 class，不只 `.back-to-top` 還有很多關鍵字會被砍，可以看這份 [Class and ID to avoid because of AdBlock](https://gist.github.com/spyesx/42fe84c0ef757d1c38a4)，那我的解決辦法就是把原始碼裡所有的 back-to-top 改名成 bottom-to-top

就在剛剛，我寫完第一段之後，發現上面的 h2 標題 Adblock 因為 markdown 生成 html 時自動加了 `id=Adblock`，然後就被 AdBlock 砍了，只好改成自己手刻 html

```html
<h2>Adblock</h2>
```

另一個被砍掉的是 font-awesome 的 icon `.fa-instagram`，這個就不好改名了，所以我加了一小行 javascript 把 `.fa-ig` 改成 `.fa-instagram`，以結果來看我的 script 跑的順序應該是比 AdBlock 來得後面所以沒有被砍

```javascript source/js/main.js
$(document).ready(function() {
    $('.fa-ig').addClass('fa-instagram');
    $('.fa-ig').removeClass('fa-ig');
});
```

## Github

[mkdocs-material](https://github.com/squidfunk/mkdocs-material) 主題的右上角有顯示 github star 的功能，我覺得很酷，所以就搬過來了

```ejs layout/common/navbar.ejs
<a class="navbar-item github-source" href="<%= github.url %>">
    <div class="github-source-icon"><i class="fab fa-lg fa-github-alt"></i></div>
    <div class="github-source-repository">
        <%= github.name %>
    </div>
</a>
```

```css source/css/style.styl
.github-source
    .github-source-icon
        padding: 5px
    .github-source-repository
        padding-left: 10px
        font-size: 10px
        font-weight: 1000
        ul
            animation: animateElement linear .3s;
            animation-iteration-count: 1;
            li 
                float: left
                font-weight: 200
            #github-forks
                margin-left: 3px

@keyframes animateElement{
  0% {
    opacity:0;
    transform:  translate(0px,10px);
  }
  100% {
    opacity:1;
    transform:  translate(0px,0px);
  }
}
```

```javascript source/js/main.js
if (typeof (IcarusThemeSettings) !== 'undefined' &&
    typeof (IcarusThemeSettings.github.url) !== 'undefined') {
    const url = IcarusThemeSettings.github.url
    console.log(url)
    const matches = /^.+github\.com\/([^/]+)\/?([^/]+)?.*$/.exec(url)
    console.log(matches)
    if (matches && matches.length === 3) {
        const [, user, name] = matches
        console.log(user, name)
        const api = `https://api.github.com/users/${user}/repos`
        const paginate = (page = 0) => (
            fetch(`${api}?per_page=100&sort=updated&page=${page}`)
            .then(response => response.json())
            .then(data => {
                if (!(data instanceof Array))
                    return []

                /* Display number of stars and forks, if repository is given */
                if (name) {
                    const repo = data.find(item => item.name === name)
                    if (!repo && data.length === 30) return paginate(page + 1)

                    if (typeof repo.stargazers_count !== 'number' || typeof repo.forks_count !== 'number') return []
                    /* If we found a repo, extract the facts */
                    return repo
                    ? [
                        `${repo.stargazers_count} Stars`,
                        `${repo.forks_count} Forks`
                    ]
                    : []

                /* Display number of repositories, otherwise */
                } else {
                    return [
                    `${data.length} Repositories`
                    ]
                }
            })
        )
        paginate().then(data => {
            console.log(data)
            const [stars, forks] = data
            const facts = $(`<ul class="github-facts"><li id="github-stars">${stars}</li><li id="github-forks">• ${forks}</li></ul>`)
            $('.github-source-repository').append(facts)
        })
    }
}
```

## 舊部落格

[舊的部落格](/old/)我還在慢慢搬移當中，所以我把 mkdocs 生成的 html 放進來 hexo 當 static files，只要放在 `source/old/` 底下然後在 `_config.yml` 裡面加一行 `skip_render: old/**`，hexo 就不會去 render 他了

## 疑難雜症

在改主題原始碼的過程中，遇到各種奇怪問題時，記得先 `hexo clean` 一下

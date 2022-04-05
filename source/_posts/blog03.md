---
title: "【部落格開發日誌】0x03"
date: 2022-03-30
categories:
- 程式
tags:
- hexo
- icarus
- blog
---

## 部落格要恢復更新啦

距離上次更新也過了一年多了，期間為了更加客製化主題，還想過要自己從頭刻部落格，真是太天真了啊
最後還是回來用新版的 icarus 主題，真香。
之前是把 icarus 主題跟部落格綁在同個 repo 一起更新，但這樣不好管理，所以現在就直接 [fork 一份出來維護](https://github.com/oalieno/hexo-theme-icarus)，是用最版的 `5.0.0-rc.1`，之後有新版本就再 merge 進來就好了。把之前做過得一些改動都整合進主題了，還是自己客製化過得最對味啊。
之後會慢慢把之前的文章再放回來，應該至少一週一更吧，希望xD

## icarus 大改版

我之前用的 icarus 版本還在寫 `.ejs`
現在已經在寫 `.jsx` 了
之前的部落格開發日誌上的程式碼有些可能都不能直接套用了
不過不用擔心我現在已經把我改的程式碼推到 [這裡](https://github.com/oalieno/hexo-theme-icarus) 了

## Excerpt

我發現 icarus 的 excerpt 可以寫在文章內容的開頭，而不用寫在 front matter
中間加一個 `<!-- more -->` 和文章主體區隔
像是下面這樣，或是看[這裡範例](https://github.com/ppoffice/hexo-theme-icarus/blob/site/source/_posts/en/Getting-Started.md?plain=1)

```
Hello, this is the excerpt

<!-- more -->

This is the article
```

這樣 excerpt 也可以快樂寫 markdown
在首頁也只會顯示到 `<!-- more -->` 之前的內容
但是點 Read More 的按鈕跳進去文章之後，會發現 excerpt 其實還在
只是頁面會捲動到 `#more` 這個 hashtag 也就是文章主體的開頭
不過這樣感覺只是一個偷懶的作法，不是一個完美的作法

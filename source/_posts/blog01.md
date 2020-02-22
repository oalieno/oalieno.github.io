---
title: "部落格開發日誌 0x01"
date: 2020-02-08 23:02:00
tags:
- hexo
- icarus
- seo
---

部落格架好後，趁熱使用一下各種網站追蹤評測的工具，比如 [Google Search Console](https://search.google.com/search-console), [Google Analytics](https://analytics.google.com/analytics/web/), [PageSpeed Insights](https://developers.google.com/speed/pagespeed/insights/), [Sitechecker](https://sitechecker.pro/), [Hotjar](https://www.hotjar.com/)

## Hotjar

記錄使用者點擊的 heatmap

{% img /images/hotjar-heatmap.png 800 'hotjar heatmap example' %}

記錄使用者游標移動的路徑

{% img /images/hotjar-record.gif 800 'hotjar record example' %}

還可以收集使用者的 feedback 回饋，不過載入時間有點久，部落格也不太需要這些資訊，所以就拔掉了，試用一下而已xD

## SEO

### Defer offscreen images

參考 [Lazy load offscreen images with lazysizes](https://web.dev/codelab-use-lazysizes-to-lazyload-images/)，只要載入 [lazysizes](https://github.com/aFarkas/lazysizes) 這個 scripts 進來，然後把 `src` 改成 `data-src` 並加上 `class="lazyload"` 就好了

註冊個 hexo 的 `after_render`，把所有 img tag 抓出來改就完事了

```js scripts/lazy-load-image.js
hexo.extend.filter.register('after_render:html', function (htmlContent) {
    return htmlContent.replace(/<img src="([^"]*)" (?:class="([^"]*)")?([^>]*)>/, '<img data-src="$1" class="$2 lazyload" $3>')
});
```

[lazysizes](https://github.com/aFarkas/lazysizes) 有 cdn，很方便的

```ejs layout/common/scripts.ejs
<script src="https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.2.0/lazysizes.min.js" defer></script>
```

### Sitemap

```bash
npm install hexo-generator-sitemap
```

裝好 hexo-generator-sitemap 之後，在 `_config.yml` 加一行收工

```yml
sitemap:
  path: sitemap.xml
```

### Robots.txt

直接放在 `source/_posts` 下面就行了，簡單搞定
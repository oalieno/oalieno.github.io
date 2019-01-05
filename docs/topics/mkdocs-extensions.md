# 部落格維護日記 - mkdocs extensions

mkdocs 是用 [Python-Markdown](https://github.com/Python-Markdown/markdown) 這個 python package 去把 markdown 渲染成 html

所以在 `mkdocs.yml` 中設定的 `markdown_extensions` 其實就是 `Python-Markdown` 的 [extensions](https://python-markdown.github.io/extensions/api/)

除了 `Python-Markdown` 官方預設的 extension 之外，還可以用 [pymdown-extensions](https://facelessuser.github.io/pymdown-extensions/)

## 安裝 pymdown-extensions

要安裝這個 python packages 很簡單，跟一般的 python package 沒兩樣

```bash
pip install pymdown-extensions
```

但是問題是，mkdocs 到底是怎麼知道 pymdown-extensions 在哪裡的，他怎麼載入的?

```python linenums="291" hl_lines="2" tab="mkdocs/nav.py#L291 ( mkdocs==0.17.2 )"
md = markdown.Markdown(
    extensions=extensions,
    extension_configs=config['mdx_configs'] or {}
)
self.content = md.convert(self.markdown)
```

可以看到他是去創建一個 `Markdown` 物件，然後再用 `convert`

而這邊的 `extensions` 就是 `['pymdownx.arithmatex', 'pymdownx.caret', ...]`

那所以 `Python-Markdown` 是怎麼用這些字串去找我們安裝的 extensions 呢?

```python linenums="162" hl_lines="5" tab="markdown/core.py#L162 ( Markdown==3.0.1 )"
# Get class name (if provided): `path.to.module:ClassName`
ext_name, class_name = ext_name.split(':', 1) if ':' in ext_name else (ext_name, '')

try:
    module = importlib.import_module(ext_name)
    logger.debug(
        'Successfuly imported extension module "%s".' % ext_name
    )
```

可以看到他是直接去 import 我們給的字串，所以只要 `pip install` 有裝好可以 import 就可以了

追完 source code 之後才看懂他的 [document](https://python-markdown.github.io/extensions/) 上面寫的是什麼意思...

`markdown.markdown(some_text, extensions=[MyExtClass(), 'myext', 'path.to.my.ext:MyExtClass'])`

* `path.to.my.ext` 就是要 import 的 module
* `MyExtClass` 如果有給就直接用指定的 Class，沒有的話會去用 `makeExtension()` 的回傳值

結論是，只要 `pip install` 完就沒事了xD

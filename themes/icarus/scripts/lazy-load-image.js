hexo.extend.filter.register('after_render:html', function (htmlContent) {
    return htmlContent.replace(/<img src="([^"]*)" (?:class="([^"]*)")?([^>]*)>/, '<p align="center"><img data-src="$1" class="$2 lazyload" $3></p>')
});

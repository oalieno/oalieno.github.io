hexo.extend.filter.register('after_render:html', function (htmlContent) {
    return htmlContent.replace(/<img src="([^"]*)" class="([^"]*)" ([^>]*)>/, '<img data-src="$1" class="$2 lazy" $3>')
});

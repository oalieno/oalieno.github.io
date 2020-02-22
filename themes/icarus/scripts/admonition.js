/* https://github.com/haishanh/hexo-tag-admonition */
hexo.extend.tag.register('admonition', function(args, content) {
    var cls = args[0] || 'note'
    var title = args.slice(1).join(' ') || 'Note'
    var lines = hexo.render.renderSync({
        text: content,
        engine: 'markdown'
    });

    return '<details class="admonition ' + cls + '" open><summary>' + title + '</summary><p>' + lines + '</p></details>'
}, {
    async: true,
    ends: true
})
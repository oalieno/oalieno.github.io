module.exports = (ctx, locals) => {
    const { layout, content } = ctx.page;
    const { get_config } = ctx;
    if (get_config('toc') === false || (layout !== 'page' && layout !== 'post')) {
        return null;
    }
    return Object.assign(locals, { content });
}
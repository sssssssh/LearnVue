/**
 * MVVM框架入口
 * */
class Vue {
    constructor(options) {
        let data = options.data;
        let $el = document.querySelector(options.el);

        // 将data变成可以观察的 & 将data代理到vm对象上
        //this.$data = data;
        observe(data, this);

        // 将模版解析出来 并 增加watcher来将 data和template结合起来
        // 插入到指定容器
        $el.appendChild(compileToFragment($el, this));
    }
}
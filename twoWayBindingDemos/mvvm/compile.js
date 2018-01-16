/**
 * 将模版转换成documentFragement
 * */
function compileToFragment(node, vm) {
    let frag = document.createDocumentFragment();
    let child;

    while(child = node.firstChild) {
        compile(child, vm);
        frag.appendChild(child);
    }

    return frag;
}

/**
 * 解析模版时，只处理 元素节点 和 文本节点
 * */
function compile(node, vm) {
    if (node.nodeType === 1) {
        // input
        let attrs = node.attributes;
        [].slice.call(attrs).forEach((attr) => {
            if (attr.nodeName === 'v-model') {
                let exp = attr.nodeValue;

                // 添加dom事件监控
                node.addEventListener('input', function (e) {
                    vm[exp] = e.target.value;
                });
                // 赋予初始值
                node.value = vm[exp];
                // 在dom上移除标签
                node.removeAttribute('v-model');

                // 添加watcher将dom 和 viewModel结合起来
                new Watcher(vm, node, exp, 'input');
            }
        });
    } else if (node.nodeType === 3) {
        // 文本
        let reg = /\{\{(.*)\}\}/;

        // 匹配 {{}} 模版
        if (reg.test(node.textContent)) {
            let exp = (RegExp.$1).trim();

            new Watcher(vm, node, exp, 'text');
        }
    }
}
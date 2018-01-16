class Watcher {
    constructor(vm, node, exp, nodeType) {
        Dep.target = this;
        this.exp = exp;             // 对应的表达式名称
        this.node = node;           // 节点
        this.vm = vm;               // 对应viewModel
        this.nodeType = nodeType;   // 节点类型
        this.update();              // 更新数据
        Dep.target = null;
    }

    update() {
        // 通过get来收集依赖
        this.get();

        if (this.nodeType === 'text') {
            this.node.nodeValue = this.value;
        } else if (this.nodeType === 'input') {
            this.node.value = this.value;
        }
    }

    get() {
        // this.vm[this.exp] 触发vm的getter方法
        this.value = this.vm[this.exp];
    }
}
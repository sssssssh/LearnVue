/**
 * 依赖，收集相关的watcher，在有更新时通知
 * */
class Dep {
    constructor() {
        this.subs = [];
    }

    // 收集订阅者
    addSub(sub) {
        this.subs.push(sub);
    }

    notify() {
        this.subs.forEach((sub) => {
            sub.update();
        });
    }
}
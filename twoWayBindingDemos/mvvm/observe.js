function observe(obj, vm) {
    Object.keys(obj).forEach((key) => {
        defineReactive(vm, key, obj[key]);
    });
}

/**
 * 劫持对象
 * */
function defineReactive(obj, key, val) {
    var dep = new Dep();

    Object.defineProperty(obj, key, {
        get() {
            if (Dep.target) {
                dep.addSub(Dep.target);
            }
            console.log(`get ${key} => ${val}`);
            return val;
        },

        set(newVal) {
            if (newVal === val) {
                return;
            }

            val = newVal;
            dep.notify();

            console.log(`set ${key} => ${val}`);
        }
    });
}
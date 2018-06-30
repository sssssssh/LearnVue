/* @flow */

import type Watcher from './watcher'
import { remove } from '../util/index'

// 内部变量记录Dep id
let uid = 0

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
export default class Dep {
    static target: ?Watcher;
    id: number;
    subs: Array<Watcher>; // 订阅者

    constructor() {
        this.id = uid++
        this.subs = []
    }

    addSub(sub: Watcher) {
        this.subs.push(sub)
    }

    removeSub(sub: Watcher) {
        remove(this.subs, sub)
    }

    depend() {
        if (Dep.target) {
            Dep.target.addDep(this)
        }
    }

    notify() {
        // stabilize the subscriber list first
        // 首先静态化订阅者数组
        const subs = this.subs.slice()
        for (let i = 0, l = subs.length; i < l; i++) {
            subs[i].update()
        }
    }
}

// the current target watcher being evaluated.
// this is globally unique because there could be only one
// watcher being evaluated at any time.
Dep.target = null
const targetStack = []

export function pushTarget(_target: Watcher) {
    if (Dep.target) targetStack.push(Dep.target)
    Dep.target = _target
}

export function popTarget() {
    Dep.target = targetStack.pop()
}

/* @flow */

import type Router from '../index'
import { History } from './base'

/**
 * 非浏览器环境默认使用
 * 通过stack数组来模拟浏览器中的history
 */
export class AbstractHistory extends History {
  index: number;
  stack: Array<Route>;

  constructor (router: Router, base: ?string) {
    super(router, base)
    this.stack = []
    this.index = -1
  }

  push (location: RawLocation, onComplete?: Function, onAbort?: Function) {
    this.transitionTo(location, route => {
      // 队尾加入一个route路由对象
      this.stack = this.stack.slice(0, this.index + 1).concat(route)
      this.index++
      onComplete && onComplete(route)
    }, onAbort)
  }

  replace (location: RawLocation, onComplete?: Function, onAbort?: Function) {
    this.transitionTo(location, route => {
      // 替换掉最后一个route路由对象 
      this.stack = this.stack.slice(0, this.index).concat(route)
      onComplete && onComplete(route)
    }, onAbort)
  }
 
  // 跳转到第XX个记录上
  go (n: number) {
    const targetIndex = this.index + n
    if (targetIndex < 0 || targetIndex >= this.stack.length) {
      return
    }
    const route = this.stack[targetIndex]
    this.confirmTransition(route, () => {
      this.index = targetIndex
      this.updateRoute(route)
    })
  }

  // 返回最后一个route，如果没有fullPath，则返回 '/'
  getCurrentLocation () {
    const current = this.stack[this.stack.length - 1]
    return current ? current.fullPath : '/'
  }

  // 无需确保路径正确
  ensureURL () {
    // noop
  }
}

/* @flow */

import { toArray } from '../util/index'

export function initUse (Vue: GlobalAPI) {
  Vue.use = function (plugin: Function | Object) {
    const installedPlugins = (this._installedPlugins || (this._installedPlugins = []))
    // 已经安装则直接退出
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }

    // additional parameters
    const args = toArray(arguments, 1)
    args.unshift(this)

    if (typeof plugin.install === 'function') { // 如果插件的install方法存在，则调用插件的install方法
      plugin.install.apply(plugin, args)
    } else if (typeof plugin === 'function') { // 如果插件本身就是函数，则直接调用plugin本身
      plugin.apply(null, args)
    }

    // 执行完成之后，保存插件
    installedPlugins.push(plugin)
    // 返回VUE类
    return this
  }
}

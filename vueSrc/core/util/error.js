/* @flow */

import config from '../config'
import { warn } from './debug'
import { inBrowser } from './env'

export function handleError(err: Error, vm: any, info: string) {
    // 配置了errorHandler则报错
    if (config.errorHandler) {
        config.errorHandler.call(null, err, vm, info)
    } else {
        if (process.env.NODE_ENV !== 'production') {
            warn(`Error in ${info}: "${err.toString()}"`, vm)
        }
        /* istanbul ignore else */
        // 浏览器中用console，其他直接抛出异常
        if (inBrowser && typeof console !== 'undefined') {
            console.error(err)
        } else {
            throw err
        }
    }
}

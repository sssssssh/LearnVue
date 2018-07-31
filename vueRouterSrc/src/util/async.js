/* @flow */

/**
 * @param queue   任务队列
 * @param fn      每一个任务应该如何处理
 * @param cb      对列表中所有任务执行完成后，执行的回调
 */
export function runQueue (queue: Array<?NavigationGuard>, fn: Function, cb: Function) {
  const step = index => {
    if (index >= queue.length) {
      cb()
    } else {
      if (queue[index]) {
        fn(queue[index], () => {
          step(index + 1)
        })
      } else {
        step(index + 1)
      }
    }
  }

  // 用递归的方式，完成队列
  step(0)
}

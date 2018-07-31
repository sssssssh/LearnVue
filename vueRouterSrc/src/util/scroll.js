/* @flow */

import type Router from '../index'
import { assert } from './warn'
import { getStateKey, setStateKey } from './push-state'

// 生成一个空对象
const positionStore = Object.create(null)

export function setupScroll () {
  // Fix for #1585 for Firefox
  window.history.replaceState({ key: getStateKey() }, '')
  window.addEventListener('popstate', e => {
    saveScrollPosition()
    if (e.state && e.state.key) {
      setStateKey(e.state.key)
    }
  })
}

// 处理滚动事件
export function handleScroll (
  router: Router,
  to: Route,
  from: Route,
  isPop: boolean
) {
  if (!router.app) {
    return
  }

  const behavior = router.options.scrollBehavior
  if (!behavior) {
    return
  }

  if (process.env.NODE_ENV !== 'production') {
    assert(typeof behavior === 'function', `scrollBehavior must be a function`)
  }

  // wait until re-render finishes before scrolling
  // 利用vue的nextTick方法，确保在滚动结束后才触发重新渲染
  router.app.$nextTick(() => {
    const position = getScrollPosition()
    const shouldScroll = behavior.call(router, to, from, isPop ? position : null)

    if (!shouldScroll) {
      return
    }

    if (typeof shouldScroll.then === 'function') {
      shouldScroll.then(shouldScroll => {
        scrollToPosition((shouldScroll: any), position)
      }).catch(err => {
        if (process.env.NODE_ENV !== 'production') {
          assert(false, err.toString())
        }
      })
    } else {
      scrollToPosition(shouldScroll, position)
    }
  })
}

// 保存滚动的位置
export function saveScrollPosition () {
  // 根据时间生成独一无二的键
  const key = getStateKey()
  if (key) {
    positionStore[key] = {
      x: window.pageXOffset,
      y: window.pageYOffset
    }
  }
}

// 获得一个位置信息
function getScrollPosition (): ?Object {
  const key = getStateKey()
  if (key) {
    return positionStore[key]
  }
}

function getElementPosition (el: Element, offset: Object): Object {
  const docEl: any = document.documentElement
  const docRect = docEl.getBoundingClientRect()
  const elRect = el.getBoundingClientRect()

  // 通过计算不同DOM的位置差来获得滚动的实际位置
  return {
    x: elRect.left - docRect.left - offset.x,
    y: elRect.top - docRect.top - offset.y
  }
}

// 是否是有效的位置
// 为什么不是判断两个字段都是数字？
function isValidPosition (obj: Object): boolean {
  return isNumber(obj.x) || isNumber(obj.y)
}

// 正常化位置信息
function normalizePosition (obj: Object): Object {
  return {
    x: isNumber(obj.x) ? obj.x : window.pageXOffset,
    y: isNumber(obj.y) ? obj.y : window.pageYOffset
  }
}

function normalizeOffset (obj: Object): Object {
  return {
    x: isNumber(obj.x) ? obj.x : 0,
    y: isNumber(obj.y) ? obj.y : 0
  }
}

// 判断是不是数字, 类似 Object.prototype.toString.call(v) === '[object Number]'
function isNumber (v: any): boolean {
  return typeof v === 'number'
}

function scrollToPosition (shouldScroll, position) {
  const isObject = typeof shouldScroll === 'object'
  if (isObject && typeof shouldScroll.selector === 'string') {
    const el = document.querySelector(shouldScroll.selector)
    if (el) {
      let offset = shouldScroll.offset && typeof shouldScroll.offset === 'object' ? shouldScroll.offset : {}
      offset = normalizeOffset(offset)
      position = getElementPosition(el, offset)
    } else if (isValidPosition(shouldScroll)) {
      position = normalizePosition(shouldScroll)
    }
  } else if (isObject && isValidPosition(shouldScroll)) {
    position = normalizePosition(shouldScroll)
  }

  if (position) {
    window.scrollTo(position.x, position.y)
  }
}

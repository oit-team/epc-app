import { Toast } from 'vant'

// 用于缓冲显示时间，避免闪现
let defer = null
// 用于超过特定时间后强制结束显示
let timeout = null
// 多少毫秒内的响应不显示loading
const DELAY_TIME = 200

Toast.loading = (function(fn) {
  return function loading(ToastOptions, delay) {
    ToastOptions = typeof ToastOptions === 'string' ? { message: ToastOptions } : ToastOptions

    const loading = () => {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        // 超过特定时间则强制关闭
        Toast.clear()
      }, 60000)
      return fn.call(this, Object.assign({
        duration: 0,
        forbidClick: true,
        message: '加载中',
      }, ToastOptions))
    }

    if (delay) {
      defer = setTimeout(() => {
        loading()
      }, typeof delay === 'boolean' ? DELAY_TIME : delay)
      return defer
    }

    return loading()
  }
})(Toast.loading)

Toast.clear = (function(fn) {
  return function loading(all) {
    if (defer) {
      clearTimeout(defer)
      defer = null
    }
    clearTimeout(timeout)
    return fn.call(this, all)
  }
})(Toast.clear)

export default Toast

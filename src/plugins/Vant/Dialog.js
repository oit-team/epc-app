import { Dialog } from 'vant'

Dialog.confirm = (function(fn) {
  return function confirm(options) {
    options = typeof options === 'string'
    ? { title: '提示', message: options }
    : options

    return fn.call(this, options)
  }
})(Dialog.confirm)

export default Dialog

import { isAndroid, isIos } from '@/utils/helper'

export default {
  /**
   * 调用原生事件
   * @param {string} type 事件类型名
   * @param {object} params 事件参数，注意参数值只能是string类型
   */
  postMessage(type, params = {}) {
    const eventContent = {
      methodName: type,
      ...params,
    }
    console.debug('[iframe] 事件内容 ==>', eventContent)

    if (isIos) window.webkit?.messageHandlers?.JsCallObjectC?.postMessage(JSON.stringify(eventContent))
    if (isAndroid) window.JsCallObjectC?.postMessage(JSON.stringify(eventContent))
  },
  /**
   * 以Promise形式返回，适用于只有一次返回的情况
   * @param {string} type 事件类型
   * @return {Promise<object>}
   */
  bindPromised(type) {
    return new Promise((resolve, reject) => {
      window[type] = (data) => resolve(JSON.parse(data))
    })
  },
  /**
   * 以回调方式返回，适用于可能会多次回调的情况
   * @param {string} type 事件类型
   * @param {function} callback 回调函数
   */
  bindEventListener(type, callback) {
    window[type] = (data) => callback(JSON.parse(data))
  },
}

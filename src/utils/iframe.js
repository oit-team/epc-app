import store from '@/store'
import { isIos, isAndroid } from '@/utils/helper'

const iframe = {
  /**
   * 调用原生事件
   * @param {object} event 事件内容，注意参数值只能是string类型
   * @param {string} event.methodName 调用事件名称
   */
  postMessage(event) {
    console.debug('[iframe] 事件内容 ==>', event)

    if (isIos) window.webkit?.messageHandlers?.JsCallObjectC?.postMessage(JSON.stringify(event))
    if (isAndroid) window.JsCallObjectC?.postMessage(JSON.stringify(event))
  },
  /**
   * 跳转到语音助手
   */
  switchToSiri() {
    iframe.postMessage({ methodName: 'switchToSiri' })
  },
  /**
   * 登录成功
   */
  loginSuccess() {
    const userData = store.getters.userData

    iframe.postMessage({
      methodName: 'loginSuccess',
      realName: userData.userName,
      userId: String(userData.userId),
      orgId: String(userData.orgId),
      userName: userData.employeeId,
      accessToken: userData.accessToken,
    })
  },
  /**
   * 获取团队或员工详情信息
   * @param {string} msgId 查询结果ID
   * @returns {Promise<object>} 查询结果
   */
  getQueryDetail(msgId) {
    iframe.postMessage({
      methodName: 'getQueryDetail',
      msgId,
    })

    return new Promise((resolve) => {
      window.siriQueryDetail = (data) => {
        resolve(JSON.parse(data))
      }
    })
  },
}

export default iframe

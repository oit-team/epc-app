import { post } from './index'
import API_SERVICE from './API_SERVICE'

/**
 * 获取工作页面未读数量
 */
export function getBhdCount() {
  return post(API_SERVICE.WARNING + '/alarm/getBhdCount')
}

/**
 * 查询留言板消息
 * @param {object} params
 * @param {number} params.pageNum 分页
 * @param {number} params.pageSize 分页
 * @param {number} params.msgType 消息类型
 * @param {number} params.state 消息状态
 */
export function getMsgList(params) {
  return post(API_SERVICE.SYSTEM + '/msg/getMsgList', params, { loading: true })
}

/**
 * 查询消息类型
 */
export function getMsgTypeInfo() {
  return post(API_SERVICE.SYSTEM + '/msg/getMsgTypeInfo')
}

/**
 * 修改消息已读/未读状态
 * @param {number} msgId 消息ID
 */
export function updateMsgState(msgId) {
  return post(API_SERVICE.SYSTEM + '/msg/upMsgState', { msgId })
}

/**
 * 获取未读消息数量
 */
export function getUnreadMsgCount() {
  return post(API_SERVICE.SYSTEM + '/msg/getUnreadMsgCount')
}

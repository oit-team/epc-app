import { post } from './index'
import API_SERVICE from './API_SERVICE'

/**
 * 账号登录
 * @param {object} params
 * @param {string} params.employeeId 登录账号
 * @param {string} params.passWord 经过AES加密后的密码
 */
export function loginAccount(params) {
  return post(API_SERVICE.SYSTEM + '/user/login', params)
}

/**
 * 验证用户并获取数据
 * @param {object} params
 * @param {number} params.id 用户ID
 * @param {number} params.orgId 机构ID
 * @param {number} params.status
 * @param {boolean} tips 是否显示提示
 */
export function selUserByID(params, tips = true) {
  return post(API_SERVICE.SYSTEM + '/user/selUserByID', params, { tips })
}

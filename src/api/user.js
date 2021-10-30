import { post } from './index'

/**
 * 账号登录
 * @param {object} params
 * @param {string} params.employeeId 登录账号
 * @param {string} params.passWord 经过AES加密后的密码
 */
export function loginAccount(params) {
  return post('/system/user/login', params)
}

/**
 * 验证用户并获取数据
 * @param {object} params
 * @param {number} params.id 用户ID
 * @param {number} params.orgId 机构ID
 * @param {number} params.status
 */
export function selUserByID(params) {
  return post('/system/user/selUserByID', params)
}

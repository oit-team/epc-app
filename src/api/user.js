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

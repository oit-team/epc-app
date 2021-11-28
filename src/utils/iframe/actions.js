import util from '@/utils/iframe/util'

export default {
  /**
   * 登录成功
   * @param {object} userData 用户数据
   */
  loginSuccess(userData) {
    util.postMessage('loginSuccess', {
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
    util.postMessage('getQueryDetail', {
      msgId,
    })

    return util.bindPromised('siriQueryDetail')
  },
}

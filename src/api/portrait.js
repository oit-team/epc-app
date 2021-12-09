import { post } from './index'
import API_SERVICE from './API_SERVICE'

/**
 * 查询我的画像
 * @param {object} params
 * @param {number} params.startTime 开始时间
 * @param {number} params.endTime 结束时间
 * @param {number} params.userId 用户ID
 */
export function getExcellentScore(params) {
  return post(API_SERVICE.REPORTING + '/starList/getExcellentScore', params)
}

export function getMyPortrait(params) {
  return post(API_SERVICE.REPORTING + '/portrait/getMyPortrait', params)
}

/**
 * 查询同事画像排名
 * @param {{startTime: string, endTime: string, userName: string}} params
 * @param {string} params.startTime 开始时间
 * @param {string} params.endTime 结束时间
 * @param {number} params.userName 用户
 */
export function getUserPortrait(params) {
  return post(API_SERVICE.REPORTING + '/portrait/getUserRankingList', params)
}

/**
 * 查询部门画像
 * @param {object} params
 * @param {string} params.startTime 开始时间
 * @param {string} params.endTime 结束时间
 * @param {number} params.deptId 部门ID
 */
export function getDeptPortrait(params) {
  return post(API_SERVICE.REPORTING + '/portrait/getDeptPortrait', params)
}

/**
 * 查询风险管理的预警次数
 * @param {object} params
 * @param {number} params.userId 用户ID
 * @param {number} params.pageNum  页码
 * @param {number} params.pageSize 每页多少条
 */
export function getBHDCount(params) {
  return post(API_SERVICE.REPORTING + '/portrait/getBHDCount', params)
}

/**
 * 查询风险管理的操作记录
 * @param {object} params
 * @param {number} params.userId 用户ID
 * @param {number} params.pageNum 页码
 * @param {number} params.pageSize 每页多少条
 */
export function getSoftCountInfo(params) {
  return post(API_SERVICE.REPORTING + '/portrait/getSoftCountInfo', params)
}

/**
 * 查询风险管理的优化建议
 * @param {object} params
 * @param {number} params.userId 用户ID
 */
export function getProposalInfo(params) {
  return post(API_SERVICE.REPORTING + '/portrait/getProposalInfo', params)
}

/**
 * 查询部门筛选条件
 */
export function getDeptSearchInfo() {
  return post(API_SERVICE.REPORTING + '/portrait/getDeptSearchInfo')
}

/**
 * 查询部门排名
 * @param {object} params
 * @param {string} params.startTime 开始时间
 * @param {string} params.endTime 结束时间
 * @param {number} params.deptId 部门ID
 * @param {boolean} loading 显示加载弹框
 */
export function getDeptRankingList(params, loading) {
  return post(API_SERVICE.REPORTING + '/portrait/getDeptRankingList', params, { loading })
}

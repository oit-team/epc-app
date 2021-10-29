import { post } from './index'

/**
 * 获取明星榜数据
 * @param {object} params
 * @param {number} params.orgId 企业ID
 * @param {number} params.dayNum 往前推移的时间，根据传入的flag不同，推移的时间单位也不同
 */
export function getTopEmployeeByDate(params) {
  return post('/reporting/starList/getTopEmployeeByDate', params)
}

/**
 * 查询明星榜数据
 * @param {object} params
 * @param {number} params.orgId 企业ID
 * @param {number} params.flag 日周月季标识(1、2、3、4)
 * @param {number} params.belong 时间筛选条件
 */
export function getUserRanking(params) {
  return post('/reporting/starList/getUserRanking', params)
}

/**
 * 查询软件使用时长
 * @param {object} params
 * @param {number} params.orgId 企业ID
 * @param {number} params.userId 用户ID
 * @param {number} params.flag 日周月季标识(1、2、3、4)
 * @param {number} params.belong 时间筛选条件
 */
export function getSotfUeingList(params) {
  return post('/reporting/starList/getSotfUeingList', params)
}

/**
 * 查询软件使用比
 * @param {object} params
 * @param {number} params.orgId 企业ID
 * @param {number} params.userId 用户ID
 * @param {number} params.flag 日周月季标识(1、2、3、4)
 * @param {number} params.belong 时间筛选条件
 */
export function getUserSotfRanking(params) {
  return post('/reporting/starList/getUserSotfRanking', params)
}

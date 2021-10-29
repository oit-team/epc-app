/**
 * 转换单位
 * @param str
 * @param unit 单位默认px
 * @returns {string|undefined}
 */
export function convertToUnit(str, unit = 'px') {
  if (str === null || str === undefined || str === '')
    return undefined
  else if (isNaN(+str))
    return String(str)
  else
    return `${Number(str)}${unit}`
}

/**
 * 格式化日期时间
 * @param date 日期时间
 * @param format 格式
 * @returns {string} format 格式后的日期时间
 */
export const formatDate = (date, format = 'yyyy-MM-dd') => {
  if (!date) return ''
  if (typeof date === 'number' && String(date).length <= 10) date = date * 1000
  // 此处将横杠"-"替换成"/"是为了处理ios端兼容
  date = new Date(typeof date === 'string' ? date.replace(/-/g, '/') : date)
  if (date.toString() === 'Invalid Date') return ''
  if (/(y+)/.test(format))
    format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))

  const o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
  }
  for (const k in o) {
    if (new RegExp(`(${k})`).test(format)) {
      const str = o[k] + ''
      format = format.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? str : ('00' + str).substr(str.length),
      )
    }
  }
  return format
}

/**
 * 注册vant组件
 * @param {array} components 需要注册的组件
 * @returns {object} 注册的组件
 */
export function registerVantComponents(components) {
  const map = {}

  components.forEach(item => {
    if (item.name) map[item.name] = item
  })
  return map
}

/**
 * 获取值的原始类型字符串，例如：[object Object]
 */
const _toString = Object.prototype.toString

export function getRawType(value) {
  return _toString.call(value).slice(8, -1)
}

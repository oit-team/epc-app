/**
 * 转换单位
 * @param str
 * @param unit 单位默认px
 * @returns {string|undefined}
 */
export function convertToUnit(str, unit = 'px') {
  let size

  if (str === null || str === undefined || str === '')
    return undefined
  else if (isNaN(+str))
    size = String(str)
  else
    size = `${Number(str)}${unit}`

  if (/([0-9]+(\.?[0-9]+)?)px$/.test(size)) {
    const num = parseFloat(size)
    return `${num / 375 * 100}vw`
  } else {
    return size
  }
}

/**
 * 格式化日期时间
 * @param date 日期时间
 * @param format 格式
 * @returns {string} format 格式后的日期时间
 */
export const formatDate = (date, format = 'yyyy/MM/dd') => {
  if (date === undefined) return ''
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

/**
 * 合并函数式组件上下文数据
 * @param {object} context 上下文
 * @param {object} data 需要合并的数据
 * @returns {object} 合并结果
 */
export function mergeContextData(context, data) {
  const assign = (obj1, obj2) => Object.assign({}, obj1, obj2)

  return {
    ...context.data,
    ...data,
    attrs: assign(context.data.attrs, data.attrs),
    props: assign(context.props, data.props),
    on: assign(context.listeners, data.on),
    scopedSlots: assign(context.data.scopedSlots, data.scopedSlots),
  }
}

// 验证是否是IOS系统
export const isIos = /Mac OS/.test(window.navigator.userAgent)
// 验证是否是安卓系统
export const isAndroid = /Android/.test(window.navigator.userAgent)

/**
 * 获取多少天以前的日期
 * @param {object} day 要往前的天数
 * @param {string} format 格式化
 */
export function getDaysAgo(day, format = 'yyyy/MM/dd') {
  const total = 1000 * 60 * 60 * 24 * day

  return formatDate(Date.now() - total, format)
}

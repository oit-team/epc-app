import Axios from 'axios'
import store from '@/store'
import API_STATUS from '@/api/API_STATUS'

// axios配置
const axiosConfig = {
  // 请求超时时间
  timeout: 60000,
  baseURL: '/',
}

// 创建axios实例
const axios = Axios.create(axiosConfig)

/**
 * 请求拦截器
 */
axios.interceptors.request.use(config => {
  const userData = store.getters.userData

  config.headers.userId ??= userData?.userId
  config.headers.token ??= userData?.accessToken

  return config
}, error => {
  return Promise.reject(error)
})

/**
 * 响应拦截器
 */
axios.interceptors.response.use(response => {
  return response
}, error => {
  return Promise.reject(error)
})

/**
 * post封装
 * @param {string} url 请求地址
 * @param {object} params 请求参数
 * @param {object} config 配置
 */
export function post(url, params = {}, config = {}) {
  const userData = store.getters.userData

  const formatedParams = {
    head: {
      aid: userData?.userId,
      ver: '1.0',
      ln: 'cn',
      mod: 'app',
      de: '2019-10-16',
      sync: 1,
      uuid: userData?.orgId,
      chcode: 'ef19843298ae8f2134f',
    },
    con: params,
  }

  return axios({
    url,
    method: 'post',
    data: formatedParams,
  }).then(res => {
    if (res.data.head?.status === API_STATUS.OK) {
      return res.data
    } else {
      return Promise.reject(res.data)
    }
  }).catch(err => {
    return Promise.reject(err)
  })
}

export default axios

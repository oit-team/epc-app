import Axios from 'axios'
import store from '@/store'
import API_STATUS from '@/api/API_STATUS'
import { Toast } from 'vant'
import router from '@/router'
import { isNil } from 'lodash'
import apiConfig from './api.config'

// axios配置
const axiosConfig = {
  // 请求超时时间
  timeout: 60000,
  baseURL: ['production', 'testing'].includes(process.env.NODE_ENV) ? './epc' : apiConfig.baseURL,
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

function HandlingError(code, tips) {
  let message

  switch (code) {
    case API_STATUS.UNAUTHORIZED:
      message = '会话超时，请重新登录'
      router.to('Login')
      break
  }

  tips
  && !isNil(code)
  && !isNil(message)
  && Toast.fail(message)
}

/**
 * post封装
 * @param {string} url 请求地址
 * @param {object} params 请求参数
 * @param {object} config 配置
 */
export function post(url, params = {}, config = { tips: true }) {
  const userData = store.getters.userData

  const formattedParams = {
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

  let defer = null
  // 根据传入的配置判断是否需要显示加载提示
  if (config.loading) {
    const type = typeof config.loading
    const options = type === 'string'
      ? config.loading
      : type === 'boolean'
        ? {}
        : config.loading
    // 低于设置的延迟则不显示loading
    defer = setTimeout(() => {
      Toast.loading(options)
    }, 200)
  }

  return axios({
    url,
    method: 'post',
    data: formattedParams,
  })
    .then(res => {
      if (res.data.head?.status === API_STATUS.OK) {
        return res.data
      } else {
        return Promise.reject(res.data)
      }
    })
    .catch(err => {
      HandlingError(err.isAxiosError ? err.response?.status : err.head?.status, config.tips)
      return Promise.reject(err)
    })
    .finally(() => {
      if (config.loading) {
        Toast.clear()
        clearTimeout(defer)
      }
    })
}

export default axios

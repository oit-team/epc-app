import Vue from 'vue'
import Vuex from 'vuex'
import storage from '@/utils/storage'
import { isNil, isEmpty } from 'lodash'

Vue.use(Vuex)

/**
 * 保存数据并缓存
 * @param {string} key
 * @param {object} state
 * @param {any} data
 */
function saveToStoreAndStorage(key, state, data, defer = true) {
  state[key] = data
  storage.setItem(key, data, defer)
}

/**
 * 从vuex或缓存中获取数据
 * @param {object} state
 * @param {string} key
 * @returns {*}
 */
 function getFromStoreOrStorage(state, key) {
  // 验证state的值是否是空值
  if (isNil(state[key]) || state[key] === '' || isEmpty(state[key])) {
    if (!isNil(storage.getItem(key))) {
      state[key] = storage.getItem(key)
    }
  }
  return state[key]
}

export default new Vuex.Store({
  state: {
    // 用户数据
    userData: {},
  },
  mutations: {
    // 保存用户数据
    SAVE_USER_DATA(state, data) {
      saveToStoreAndStorage('userData', state, data)
    },
  },
  getters: {
    userData(state) {
      return getFromStoreOrStorage(state, 'userData')
    },
  },
  actions: {
    logOut(ctx) {
      localStorage.clear()
      ctx.commit('SAVE_USER_DATA', {})
    },
  },
})

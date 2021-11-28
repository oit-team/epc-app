import Vue from 'vue'
import Vuex from 'vuex'
import storage from '@/utils/storage'
import { isNil, isEmpty } from 'lodash'
import { selUserByID } from '@/api/user'
import iframe from '@/utils/iframe'
import { Toast } from 'vant'

Vue.use(Vuex)

/**
 * 保存数据并缓存
 * @param {string} key
 * @param {object} state
 * @param {any} data
 * @param {boolean} defer 是否推迟到队列最后保存
 */
function saveToStoreAndStorage(key, state, data, defer = true) {
  state[key] = data
  storage.setItem(key, data, defer)
}

/**
 * 从vuex中获取数据，如果无数据，会尝试从缓存中取
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

const STATIC_TYPES = {
  // 验证成功
  SUCCESS: 0,
  // 用户不存在
  NOT_EXIST: 1,
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
    checkLogin(ctx, tips = true) {
      const userData = ctx.getters.userData

      return selUserByID({
        id: userData.userId,
        orgId: userData.orgId,
        status: 0,
      }, tips).then(res => {
        const userStatic = res.body.static

        if (userStatic === STATIC_TYPES.SUCCESS) {
          iframe.loginSuccess(userData)
          return res
        } else if (userStatic === STATIC_TYPES.NOT_EXIST) {
          Toast.fail('用户不存在')
          return Promise.reject(res)
        }
      })
    },
  },
})

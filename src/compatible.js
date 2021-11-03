/* eslint-disable camelcase */
import Vue from 'vue'
import axios from '@/api'
import store from '@/store'

function g_paramJson(con) {
  const userData = store.getters.userData
  const g_paramJson = {
    head: {
      aid: userData.userId,
      ver: '1.0',
      ln: 'cn',
      mod: 'app',
      de: '2019-10-16',
      sync: 1,
      uuid: userData.orgId,
      chcode: 'ef19843298ae8f2134f',
    },
    con: con,
  }
  return g_paramJson
}

const systemServer = 'system'
const alarmServer = 'warning'
const smart_manager_server = 'voiceAssistant'
const GLOBAL = {
  g_paramJson,
  systemServer,
  smart_manager_server,
  alarmServer,
}

Vue.prototype.GLOBAL = GLOBAL
Vue.prototype.$axios = axios

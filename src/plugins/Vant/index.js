import Vue from 'vue'
import Toast from './toast'
import {
  Notify,
} from 'vant'

Vue.prototype.$notify = Notify
Vue.prototype.$toast = Toast

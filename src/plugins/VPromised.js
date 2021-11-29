import Vue from 'vue'
import VPromised from 'v-promised-beta'
import { Empty, Loading } from 'vant'

Vue.use(VPromised, {
  props: {
    overlay: true,
  },
  slots: {
    pending: (h) => {
      return h(Loading)
    },
    rejected: (h, { retry, error }) => {
      if (error === undefined || (error && error.isEmpty)) {
        return h(Empty, '空数据')
      } else {
        return h('div', [
          h('button', { on: { click: retry } }, '重试'),
        ])
      }
    },
  },
})

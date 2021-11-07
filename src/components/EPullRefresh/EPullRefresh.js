import { PullRefresh } from 'vant'

import './EPullRefresh.scss'

export default {
  name: 'EPullRefresh',

  data: () => ({
    refreshState: false,
    tipsText: '',
  }),

  methods: {
    refreshDone() {
      // 避免直接调用导致dom更新不及时
      this.$nextTick(() => {
        this.refreshState = false
      })
    },
  },

  render(h) {
    return h(PullRefresh, {
      class: 'e-pull-refresh',
      props: {
        value: this.refreshState,
        successText: this.tipsText,
      },
      on: {
        input: () => {
          this.refreshState = true
          this.$emit('refresh', {
            loaded: () => {
              this.tipsText = '刷新成功'
              this.refreshDone()
            },
            error: () => {
              this.tipsText = '刷新失败'
              this.refreshDone()
            },
          })
        },
      },
    }, this.$slots.default)
  },
}

import Vue from 'vue'
import VPromised from 'v-promised'
import { ELoading, EEmpty, EBtn } from '@/components'

Vue.use(VPromised, {
  customProps: {
    pendingTips: String,
    onlyPending: Boolean,
  },
  props: {
    append: true,
  },
  slots: {
    pending(h) {
      return h(ELoading, { props: { show: true } }, this.$props.pendingTips)
    },
    rejected(h, { error }) {
      // 不显示rejected内容
      if (this.$props.onlyPending) return

      // 前面两个校验完成后，最后判断是否有重试函数，如果没有，也显示空数据
      if (error === undefined || (error && error.isEmpty) || this.$listeners.retry === undefined) {
        return h(EEmpty, '空数据')
      } else {
        const btn = h(EBtn, {
          props: {
            type: 'danger ',
            plain: true,
          },
          on: {
            click: () => this.$emit('retry'),
          },
        }, '点击重试')

        return h(EEmpty, {
          props: {
            image: 'error',
            description: '出现错误',
          },
        }, [btn])
      }
    },
  },
})

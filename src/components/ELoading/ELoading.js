import { Loading } from 'vant'

import './ELoading.scss'

export default {
  name: 'ELoading',

  props: {
    show: Boolean,
    vertical: {
      default: true,
    },
    delay: {
      type: [Number, Boolean],
      default: false,
    },
  },

  data: () => ({
    innerShow: false,
  }),

  methods: {
    genLoading() {
      if (this.innerShow) {
        return this.$createElement(Loading, {
          props: this.$props,
          class: 'e-loading',
        }, this.$slots.default || '加载中')
      }
    },
  },

  render(h) {
    const delay = typeof this.delay === 'boolean'
    ? (this.delay ? 200 : false)
    : (this.delay > 0 ? this.delay : false)

    if (this.show) {
      if (delay) {
        setTimeout(() => {
          this.innerShow = true
        }, delay)
      } else {
        this.innerShow = true
      }
    } else {
      this.innerShow = false
    }

    return this.genLoading()
  },
}

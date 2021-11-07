import { Loading } from 'vant'

import './ELoading.scss'

export default {
  name: 'ELoading',

  props: {
    show: Boolean,
    promise: [Promise],
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
    innerPromise: null,
  }),

  watch: {
    promise() {
      this.innerPromise = this.promise
      this.watchPromise()
    },
  },

  created() {
    if (this.promise) {
      this.innerPromise = this.promise
      this.watchPromise()
    }
  },

  methods: {
    watchPromise() {
      this.innerShow = true
      this.innerPromise.finally(() => {
        this.innerShow = false
      })
    },
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
    if (!this.promise) {
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
    }
    return this.genLoading()
  },
}

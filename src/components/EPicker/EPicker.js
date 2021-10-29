import { Popup, Picker } from 'vant'

export default {
  name: 'EPicker',

  props: {
    ...Picker.props,
    value: Boolean,
    showToolbar: {
      default: true,
    },
  },

  data: () => ({
    innerValue: false,
  }),

  watch: {
    value: {
      handler() {
        this.innerValue = this.value
      },
      immediate: true,
    },
  },

  methods: {
    genPicker() {
      return this.$createElement(Picker, {
        props: this.$props,
        on: {
          ...this.$listeners,
          cancel: () => {
            this.$emit('cancel')
            this.handler(false)
          },
        },
       })
    },
    /**
     * 改变自身属性同时激活事件
     * @param {boolean} show 是否显示
     */
    handler(show) {
      this.innerValue = show
      this.$emit('input', show)
    },
    open() {
      this.handler(true)
    },
    close() {
      this.handler(false)
    },
  },

  render(h) {
    return h(Popup, {
      props: {
        value: this.innerValue,
        position: 'bottom',
        round: true,
      },
      on: {
        input: (e) => this.handler(e),
      },
    }, [this.genPicker()])
  },
}

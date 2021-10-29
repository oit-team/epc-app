import { Tabs } from 'vant'

import './ETabs.scss'

export default {
  name: 'ETabs',

  props: {
    ...Tabs.props,
    hideSlider: [Boolean],
  },

  mounted() {
    !this.hideSlider && this.syncWdith()
  },

  methods: {
    syncWdith() {
      this.$nextTick(() => {
        const el = this.$refs.ETabs.$el
        const active = el.querySelector('.van-tab--active .van-tab__text')
        const line = el.querySelector('.van-tabs__line')
        active && line.style.setProperty('--e-tab-line-width', active.offsetWidth + 'px')
      })
    },
  },

  render(h) {
    return h(Tabs, {
      ref: 'ETabs',
      class: {
        'e-tabs-slider--hidden': this.hideSlider,
      },
      props: this.$props,
      on: {
        ...this.$listeners,
        click: (e) => {
          this.$emit('click', e)
          this.$emit('input', e)
          !this.hideSlider && this.syncWdith()
        },
      },
    }, this.$slots.default)
  },
}

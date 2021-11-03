export default {
  redisplay: false,

  created() {
    typeof this.$options.onLoad === 'function' && this.$options.onLoad.call(this)
  },

  activated() {
    if (this.$options.redisplay) {
      typeof this.$options.onLoad === 'function' && this.$options.onLoad.call(this)
      typeof this.$options.onShow === 'function' && this.$options.onShow.call(this)
    }
  },

  deactivated() {
    this.$options.redisplay = true
  },
}

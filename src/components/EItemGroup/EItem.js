export default {
  name: 'EItem',

  inject: ['itemGroup'],

  props: {
    activeClass: {
      type: String,
      default() {
        if (!this.itemGroup) return undefined
        return this.itemGroup.activeClass
      },
    },
    value: {},
    disabled: Boolean,
  },

  data: () => ({
    isActive: false,
  }),

  created() {
    this.itemGroup && this.itemGroup.register(this)
  },

  methods: {
    toggle() {
      if (this.disabled) return
      this.isActive = !this.isActive
      this.$emit('change')
    },
  },

  beforeDestroy() {
    this.itemGroup.unregister(this)
  },

  render(h) {
    let element
    if (!this.$scopedSlots.default) {
      console.warn('[警告] e-item 缺少默认的Slot')
      return null
    } else {
      element = this.$scopedSlots.default({
        active: this.isActive,
        toggle: this.toggle,
      })
    }

    if (Array.isArray(element) && element.length === 1) {
      element = element[0]
    }

    if (!element || Array.isArray(element) || !element.tag) {
      console.warn('e-item 只能包含一个元素')
      return element
    }

    element.data = Object.assign({}, element.data, {
      class: { [this.activeClass]: this.isActive },
    })

    return element
  },
}

export default {
  name: 'EItemGroup',

  provide() {
    return {
      itemGroup: this,
    }
  },

  props: {
    activeClass: {
      type: String,
      default: 'e-item--active',
    },
    value: {},
    multiple: Boolean,
    mandatory: Boolean,
    max: Number,
  },

  data() {
    return {
      internalLazyValue: this.value !== undefined
        ? this.value
        : this.multiple ? [] : undefined,
      items: [],
    }
  },

  computed: {
    internalValue: {
      get() {
        return this.internalLazyValue
      },
      set(val) {
        if (val === this.internalLazyValue) return
        this.internalLazyValue = val
        this.$emit('input', val)
      },
    },
    selectedIndex() {
      return (this.selectedItem && this.items.indexOf(this.selectedItem)) || -1
    },
    selectedItem() {
      if (this.multiple) return undefined

      return this.selectedItems[0]
    },
    selectedItems() {
      return this.items.filter((item, index) => {
        return this.toggleMethod(this.getValue(item, index))
      })
    },
    selectedValues() {
      if (this.internalValue === null || this.internalValue === undefined) return []

      return Array.isArray(this.internalValue)
        ? this.internalValue
        : [this.internalValue]
    },
    toggleMethod(v) {
      if (!this.multiple) {
        return (v) => this.internalValue === v
      }

      const internalValue = this.internalValue
      if (Array.isArray(internalValue)) {
        return (v) => internalValue.includes(v)
      }

      return () => false
    },
  },

  watch: {
    internalValue(val) {
      this.updateItemsState()

      this.$emit('input', val)
    },
    items: 'updateItemsState',
  },

  methods: {
    register(item) {
      const index = this.items.push(item) - 1

      item.$on('change', () => this.onClick(item))

      this.updateItem(item, index)
    },
    unregister(item) {
      if (this._isDestroyed) return

      const index = this.items.indexOf(item)
      const value = this.getValue(item, index)

      this.items.splice(index, 1)

      if (this.selectedValues.includes(value)) return

      if (!this.mandatory) {
        return this.updateInternalValue(value)
      }

      if (this.multiple && Array.isArray(this.internalValue)) {
        this.internalValue = this.internalValue.filter(v => v !== value)
      } else {
        this.internalValue = undefined
      }

      if (!this.selectedItems.length) {
        this.updateMandatory(true)
      }
    },
    getValue(item, index) {
      return item.value === null || item.value === undefined || item.value === ''
        ? index
        : item.value
    },
    onClick(item) {
      this.updateInternalValue(
        this.getValue(item, this.items.indexOf(item)),
      )
    },
    updateInternalValue(value) {
      this.updateItemsState()

      this.multiple
        ? this.updateMultiple(value)
        : this.updateSingle(value)
    },
    updateMultiple(value) {
      const defaultValue = Array.isArray(this.internalValue)
        ? this.internalValue
        : []
      const internalValue = defaultValue.slice()
      const index = internalValue.findIndex(val => val === value)

      if (
        this.mandatory
        && index > -1
        && internalValue.length - 1 < 1
      ) return

      if (
        this.max !== null
        && this.max !== undefined
        && index < 0
        && internalValue.length + 1 > this.max
      ) return

      index > -1
        ? internalValue.splice(index, 1)
        : internalValue.push(value)

      this.internalValue = internalValue
    },
    updateSingle(value) {
      const isSame = value === this.internalValue

      if (this.mandatory && isSame) return

      this.internalValue = isSame ? undefined : value
    },
    updateItemsState() {
      this.$nextTick(() => {
        if (this.mandatory
          && !this.selectedItems.length
        ) {
          return this.updateMandatory()
        }

        this.items.forEach(this.updateItem)
      })
    },
    updateItem(item, index) {
      const value = this.getValue(item, index)
      item.isActive = this.toggleMethod(value)
    },
    updateMandatory(last) {
      if (!this.items.length) return

      const items = this.items.slice()
      if (last) items.reverse()

      const item = items.find(item => !item.disabled)
      if (!item) return

      const index = this.items.indexOf(item)

      this.updateInternalValue(
        this.getValue(item, index),
      )
    },
  },

  render(h) {
    return h('div', {
      class: 'e-item-group',
    }, this.$slots.default)
  },
}

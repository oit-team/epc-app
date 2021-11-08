import { ELoading, EEmpty } from '@/components'

import './EPromise.scss'

const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

export default {
  name: 'EPromise',

  props: {
    promise: [Promise],
    loading: Boolean,
    always: Boolean,
    root: Boolean,
  },

  data: () => ({
    innerPromise: null,
    state: '',
    loaded: false,
  }),

  watch: {
    promise() {
      this.innerPromise = this.promise
      this.watchPromise()
    },
  },

  created() {
    this.innerPromise = this.promise
    this.watchPromise()
  },

  methods: {
    watchPromise() {
      if (this.loaded || !this.innerPromise) return

      this.state = PENDING
      this.innerPromise.then(data => {
        if (!this.always) this.loaded = true
        this.state = FULFILLED
        return data
      }).catch(err => {
        this.state = REJECTED
        return Promise.reject(err)
      })
    },
    genPendingSlot() {
        if (this.loading && this.$scopedSlots.combined === undefined)
          return this.$createElement(ELoading, { props: { show: true } })
        else
          return this.$scopedSlots.pending?.()
    },
    genDefaultSlot() {
      return this.$scopedSlots.default?.()
    },
    genRejectedSlot() {
      if (this.$scopedSlots.rejected) {
        return this.$scopedSlots.rejected()
      } else {
        return this.$createElement(EEmpty)
      }
    },
    genCombinedSlot() {
      return this.$scopedSlots.combined?.({
        pending: this.state === PENDING,
        fulfilled: this.state === FULFILLED,
        rejected: this.state === REJECTED,
      })
    },
  },

  render(h) {
    if (this.root) {
      const slots = []
      slots.push(this.genDefaultSlot())
      slots.push(this.genCombinedSlot())
      if (this.state === PENDING) slots.push(this.genPendingSlot())
      if (this.state === REJECTED) slots.push(this.genRejectedSlot())

      return h('div', {
        class: 'e-promise',
      }, slots)
    } else {
      if (this.state === PENDING) return this.genPendingSlot()
      if (this.state === FULFILLED) return this.genDefaultSlot()
      if (this.state === REJECTED) return this.genRejectedSlot()
    }
  },
}

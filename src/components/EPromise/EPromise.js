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
      if (this.loaded) return

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
        if (this.loading)
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
  },

  render(h) {
    if (this.state === PENDING) return this.genPendingSlot()
    if (this.state === FULFILLED) return this.genDefaultSlot()
    if (this.state === REJECTED) return this.genRejectedSlot()
  },
}

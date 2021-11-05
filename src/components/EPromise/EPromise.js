import { ELoading } from '@/components'

import './EPromise.scss'

const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

export default {
  name: 'EPromise',

  props: {
    promise: [Promise],
    loading: Boolean,
  },

  data: () => ({
    innerPromise: null,
    state: '',
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
      this.state = PENDING
      this.innerPromise.then(data => {
        this.state = FULFILLED
        return data
      }).catch(err => {
        this.state = REJECTED
        return Promise.reject(err)
      })
    },
    genPendingSlot() {
      if (this.state === PENDING) {
        if (this.loading)
          return this.$createElement(ELoading, { props: { show: true } })
        else
          return this.$scopedSlots.pending?.()
      }
    },
    genDefaultSlot() {
      console.log(this.$scopedSlots.default?.())
      if (this.state === FULFILLED) return this.$scopedSlots.default?.()
    },
    genRejectedSlot() {
      if (this.state === REJECTED) return this.$scopedSlots.rejected?.()
    },
  },

  render(h) {
    if (this.state === PENDING) return this.genPendingSlot()
    if (this.state === FULFILLED) return this.genDefaultSlot()
    if (this.state === REJECTED) return this.genRejectedSlot()
    // return h('div', {
    //   class: 'e-promise',
    // }, [
    //   this.genPendingSlot(),
    //   this.genDefaultSlot(),
    //   this.genRejectedSlot(),
    // ])
  },
}

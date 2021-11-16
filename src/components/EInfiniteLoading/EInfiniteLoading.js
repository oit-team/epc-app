import { List } from 'vant'

const NOT_LOADED = 0
const LOADING = 1
const LOADED = 2
const ERROR = 3
const FINISHED = 4

export default {
  name: 'EInfiniteLoading',

  props: {
    pager: [Boolean, Number, String],
  },

  data: () => ({
    state: NOT_LOADED,
    index: 1,
  }),

  methods: {
    activateLoad() {
      this.changeStatus(LOADING)
      const args = {
        loaded: () => {
          this.pager !== false && this.index++
          this.changeStatus(LOADED)
        },
        finished: () => {
          this.changeStatus(FINISHED)
        },
        error: () => {
          this.changeStatus(ERROR)
        },
      }
      if (this.pager !== false) {
        args.page = this.index
      }
      this.$emit('load', args)
    },
    changeStatus(state) {
      this.state = state
    },
    genErrorSlot() {
      if (this.state === ERROR)
        return this.$createElement('div', {
          slot: 'error',
          class: 'van-list__error-text',
          on: {
            click: () => {
              this.activateLoad()
            },
          },
        }, '请求失败，点击重新加载')
    },
    genFinishedSlot() {
      return this.$createElement('div', {
        slot: 'finished',
      }, [
        this.$createElement('e-divider', { class: 'py-2' }, '我是有底线的'),
      ])
    },
    resetState() {
      if (this.pager !== false) {
        this.index = 1
      }
      this.state = NOT_LOADED
    },
  },

  render(h) {
    return this.$createElement(List, {
      props: {
        loading: this.state === LOADING,
        finished: this.state === FINISHED || this.state === ERROR,
      },
      on: {
        load: () => {
          this.state = LOADING
          this.activateLoad()
        },
      },
    }, [
      this.$slots.default,
      this.genErrorSlot(),
      this.genFinishedSlot(),
    ])
  },
}

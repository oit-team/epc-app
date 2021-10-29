import { Tab } from 'vant'

export default {
  name: 'ETab',

  functional: true,

  render(h, ctx) {
    return h(Tab, {
      ...ctx.data,
    }, ctx.children)
  },
}

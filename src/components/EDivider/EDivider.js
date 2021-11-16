import { Divider } from 'vant'

export default {
  name: 'EDivider',

  functional: true,

  render(h, ctx) {
    return h(Divider, ctx.data, ctx.children)
  },
}

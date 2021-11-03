import { Badge } from 'vant'

export default {
  name: 'EBadge',

  functional: true,

  props: {
    max: {
      default: 99,
    },
  },

  render(h, ctx) {
    return h(Badge, {
      ...ctx.data,
      props: ctx.props,
    }, ctx.children)
  },
}

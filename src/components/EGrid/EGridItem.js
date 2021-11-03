import { GridItem } from 'vant'

export default {
  name: 'EGridItem',

  functional: true,

  render(h, ctx) {
    return h(GridItem, ctx.data, ctx.children)
  },
}

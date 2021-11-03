import { Grid } from 'vant'
import { mergeContextData, convertToUnit } from '@/utils/helper'

export default {
  name: 'EGrid',

  functional: true,

  props: {
    iconSize: {},
    columnNum: {
      default: 3,
    },
    border: {
      default: false,
    },
  },

  render(h, ctx) {
    const data = mergeContextData(ctx, {
      props: {
        iconSize: convertToUnit(ctx.props.iconSize),
      },
    })

    return h(Grid, data, ctx.children)
  },
}

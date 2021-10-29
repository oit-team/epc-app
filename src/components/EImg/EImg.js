import { Image } from 'vant'
import { convertToUnit } from '@/utils/helper'

export default {
  name: 'EImg',

  functional: true,

  props: {
    ...Image.props,
    size: [String, Number],
  },

  render(h, ctx) {
    let src = ctx.props.src
    // 图片占位填充
    if (/^lorem:(.*)/.test(src)) {
      src = 'https://picsum.photos/' + RegExp.$1
    }

    return h(Image, {
      ...ctx.data,
      props: {
        ...ctx.props,
        src,
        height: ctx.props.height ?? convertToUnit(ctx.props.size),
        width: ctx.props.width ?? convertToUnit(ctx.props.size),
      },
    })
  },
}

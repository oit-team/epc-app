import { NavBar } from 'vant'
import { mergeContextData } from '../../utils/helper'
import router from '@/router'

export default {
  name: 'EHeader',

  functional: true,

  props: {
    // 使用back参数来控制是否显示返回按钮
    back: {
      type: [Boolean],
      default: true,
    },
  },

  render(h, ctx) {
    const data = mergeContextData(ctx, {
      class: 'e-header',
      props: {
        leftArrow: ctx.props.back,
      },
      on: {
        'click-left': () => {
          if (ctx.listeners.back) ctx.listeners.back()
          else router.back()
        },
      },
    })

    return h(NavBar, data)
  },
}

import { NavBar } from 'vant'

export default {
  name: 'EHeader',

  functional: true,

  props: {
    ...NavBar.props,
    border: {
      default: false,
    },
    // 使用back参数来控制是否显示返回按钮
    back: {
      type: [Boolean],
      default: true,
    },
  },

  render(h, ctx) {
    return h(NavBar, {
      ...ctx.data,
      class: 'e-header',
      props: {
        ...ctx.props,
        leftArrow: ctx.props.back,
      },
    })
  },
}

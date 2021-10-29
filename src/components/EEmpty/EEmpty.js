import { Empty } from 'vant'

import './EEmpty.scss'

export default {
  name: 'EEmpty',

  functional: true,

  render(h, ctx) {
    return h(Empty, {
      ...ctx.data,
      class: 'e-empty',
    }, ctx.children || '暂无数据')
  },
}

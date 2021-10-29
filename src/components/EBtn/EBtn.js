import { Button } from 'vant'

export default {
  name: 'EBtn',

  functional: true,

  render(h, ctx) {
    return h(Button, ctx.data, ctx.children)
  },
}

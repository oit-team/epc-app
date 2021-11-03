import { Cell } from 'vant'
import icons from '@/assets/icons'
import { mergeContextData } from '@/utils/helper'
import { isNil } from 'lodash'
import router from '@/router'

export default {
  name: 'ECell',

  functional: true,

  render(h, ctx) {
    const { icon, rightIcon, to } = ctx.props
    const slots = {}

    if (icons.includes(icon)) {
      slots.icon = () => h('e-icon', { class: 'van-cell__left-icon' }, icon)
    }
    if (icons.includes(rightIcon)) {
      slots.rightIcon = () => h('e-icon', { class: 'van-cell__right-icon' }, rightIcon)
    }

    const data = mergeContextData(ctx, {
      scopedSlots: slots,
    })

    if (!isNil(to)) {
      delete data.props.to
      delete data.attrs.to

      const emitClick = data.on.click
      data.on.click = () => {
        emitClick && emitClick()
        router.to(to)
      }
    }

    return h(Cell, data, ctx.children)
  },
}

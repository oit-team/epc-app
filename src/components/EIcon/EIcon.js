import './EIcon.scss'

import { convertToUnit } from '@/utils/helper'

export default {
  name: 'EIcon',

  props: {
    icon: String,
    size: [String, Number],
    color: String,
  },

  methods: {
    getSize() {
      return convertToUnit(this.size)
    },
  },

  render(h) {
    const iconName = (this.$slots.default?.[0].text ?? this.icon)?.trim() || ''

    if (!iconName) return

    const fontSize = this.getSize() || '16'

    return h('span', {
      class: 'e-icon',
      style: {
        height: fontSize,
        width: fontSize,
        fontSize: fontSize,
        color: this.color,
      },
    }, [
      h('svg', {
        class: 'e-icon__svg',
        attrs: {
          'aria-hidden': true,
        },
        on: this.$listeners,
      }, [
        h('use', {
          attrs: {
            'xlink:href': `#icon-${iconName}`,
          },
        }),
      ]),
    ])
  },
}

import { Icon } from 'vant'
import { convertToUnit } from '@/utils/helper'
import icons from '@/assets/icons'

import './EIcon.scss'

export default {
  name: 'EIcon',

  props: {
    name: String,
    size: [String, Number],
    color: String,
  },

  data: () => ({
    iconName: '',
    iconSize: '',
  }),

  methods: {
    genSvgIcon() {
      const h = this.$createElement

      return h('span', {
        class: 'e-icon',
        style: {
          height: this.iconSize,
          width: this.iconSize,
          fontSize: this.iconSize,
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
              'xlink:href': `#icon-${ this.iconName }`,
            },
          }),
        ]),
      ])
    },
    genVanIcon() {
      const h = this.$createElement

      return h(Icon, {
        props: {
          ...this.$attrs,
          ...this.$props,
          name: this.iconName,
          size: this.iconSize,
        },
      })
    },
  },

  render(h) {
    this.iconName = (this.$slots.default?.[0].text ?? this.name)?.trim() || ''
    this.iconSize = convertToUnit(this.size)

    if (!this.iconName) return

    if (icons.includes(this.iconName)) {
      return this.genSvgIcon()
    } else {
      return this.genVanIcon()
    }
  },
}

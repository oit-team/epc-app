import { Tabbar, TabbarItem } from 'vant'
import iframe from '@/utils/iframe'

import './ETabbar.scss'

export default {
  name: 'ETabbar',

  data: () => ({
    tabIndex: 0,
    show: false,
  }),

  watch: {
    $route(to) {
      this.matchRouter(to.path)
    },
  },

  mounted() {
    this.matchRouter()
  },

  methods: {
    matchRouter(path) {
      path ??= this.$route.path
      let matched = false
      for (const index in this.options) {
        if (this.options[index].to === path || this.options[index].routes?.includes(path)) {
          this.tabIndex = Number(index)
          matched = true
          break
        }
      }
      this.show = !matched
    },
  },

  render(h) {
    this.options = [
      {
        title: '画像',
        icon: 'portrait',
        to: '/portrait',
        routes: ['/portrait', '/portrait/data', '/portrait/personal-rank', '/portrait/department-rank'],
      },
      {
        title: '工作',
        icon: 'work',
        to: '/home',
      },
      {
        title: '易助手',
        icon: 'siri',
        click: iframe.switchToSiri,
      },
      {
        title: '我的',
        icon: 'account',
        to: '/account',
      },
    ]

    const tabbarItems = this.options.map((item, index) => {
      const tabData = {
        props: {},
        on: {},
        scopedSlots: {
          icon: ({ active }) => h('e-img', {
            props: {
              src: `assets/images/icons/${active ? item.icon + '-active' : item.icon}.png`,
              size: 30,
              showLoading: false,
              showError: false,
            },
          }),
        },
      }

      if (item.to) tabData.props.to = item.to
      if (item.click) tabData.on.click = item.click

      return h(TabbarItem, tabData, [
        h('span', item.title),
      ])
    })

    const tabbar = h(Tabbar, {
      props: {
        value: this.tabIndex,
      },
    }, tabbarItems)

    if (!this.show) {
      return h('div', {
        class: 'e-tabbar',
      }, [tabbar])
    }
  },
}

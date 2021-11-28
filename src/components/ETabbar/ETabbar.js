import { Tabbar, TabbarItem } from 'vant'
import iframe from '@/utils/iframe'

import './ETabbar.scss'

export default {
  name: 'ETabbar',

  data: () => ({
    tabIndex: 0,
    options: [],
  }),

  watch: {
    $route(to) {
      this.matchRouter(to.path)
    },
  },

  created() {
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
        to: '/work',
        dot: false,
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
  },

  mounted() {
    this.matchRouter()
  },

  methods: {
    matchRouter(path) {
      path ??= this.$route.path
      for (const index in this.options) {
        if (this.options[index].to === path || this.options[index].routes?.includes(path)) {
          this.tabIndex = Number(index)
          break
        }
      }
    },
  },

  render(h) {
    const tabbarItems = this.options.map((item, index) => {
      const tabData = {
        props: {
          dot: item.dot,
        },
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

    return h('div', {
      class: 'e-tabbar',
    }, [tabbar])
  },
}

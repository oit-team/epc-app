<template>
  <div>
    <e-header class="bg-gray" title="工作" :back="false" :border="false">
      <template #right>
        <e-badge class="message-badge" :dot="unreadMsg > 0">
          <e-icon v-to="'Messages'" name="bell-regular" size="18" />
        </e-badge>
      </template>
    </e-header>
    <div class="px-2">
      <e-panel
        v-for="(panel, index) of panelData"
        :key="`panel-${index}`"
        class="mb-2"
        title-class="text-secondary"
        :title="panel.title"
      >
        <e-grid>
          <e-grid-item
            v-for="(item, itemIndex) of panel.items"
            :key="`panel-${index}-${itemIndex}`"
            v-to="item.to"
            :text="item.text"
          >
            <template #icon>
              <e-badge v-if="item.badge" :content="item.badge">
                <e-img :src="item.icon" size="36"></e-img>
              </e-badge>
              <e-img v-else :src="item.icon" size="36"></e-img>
            </template>
          </e-grid-item>
        </e-grid>
      </e-panel>
    </div>
    <e-tabbar ref="tabbar"></e-tabbar>
  </div>
</template>

<script>
import { EGrid, EGridItem, EPanel, EBadge, ETabbar } from '@/components'
import * as api from '@/api/work'

export default {
  name: 'Work',

  components: {
    EGrid,
    EGridItem,
    EPanel,
    EBadge,
    ETabbar,
  },

  data: () => ({
    panelData: [],
    unreadMsg: 0,
  }),

  created() {
    this.panelData = [
      {
        title: '预警',
        items: [
          {
            bhdId: '1',
            text: '工作效率',
            icon: 'assets/images/work/6390dbec1d8114243b4d331903800434.png',
            to: '/warn?bhdId=1',
            badge: 0,
          },
          {
            bhdId: '2',
            text: '考勤',
            icon: 'assets/images/work/c73426997a1143452ec229fd459ce115.png',
            to: '/warn?bhdId=2',
            badge: 0,
          },
        ],
      },
      {
        title: '日常',
        items: [
          {
            text: '明星榜',
            icon: 'assets/images/work/04a2abf3cb5a443cf299ae007ff1babf.png',
            to: 'StarRank',
          },
        ],
      },
    ]
  },

  onLoad() {
    this.getBhdCount()
    this.getUnreadMsgCount()
  },

  methods: {
    getBhdCount() {
      api.getBhdCount().then(res => {
        const tabbar = this.$refs.tabbar
        res.body.resultList?.forEach(item => {
          this.panelData[0].items.forEach(panelItem => {
            if (panelItem.bhdId === item.bhdItem) {
              panelItem.badge = item.totalCount
              if (item.totalCount > 0) {
                tabbar.options[1].dot = true
              }
            }
          })
        })
      })
    },
    getUnreadMsgCount() {
      api.getUnreadMsgCount().then(res => {
        this.unreadMsg = res.body.totalCount
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.message-badge {
  ::v-deep .van-badge {
    top: 5px;
    right: 3px;
  }
}
</style>

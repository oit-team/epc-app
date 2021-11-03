<template>
  <div>
    <e-header class="bg-gray" title="工作" :back="false" :border="false"></e-header>
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
  </div>
</template>

<script>
import { EGrid, EGridItem, EPanel, EBadge } from '@/components'
import * as api from '@/api/home'

export default {
  name: 'Home',

  components: {
    EGrid,
    EGridItem,
    EPanel,
    EBadge,
  },

  created() {
    this.panelData = [
      {
        title: '预警',
        items: [
          {
            bhdId: '1',
            text: '工作效率',
            icon: '/images/home/6390dbec1d8114243b4d331903800434.png',
            to: '/warn?bhdId=1',
            badge: 0,
          },
          {
            bhdId: '2',
            text: '考勤',
            icon: '/images/home/c73426997a1143452ec229fd459ce115.png',
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
            icon: '/images/home/04a2abf3cb5a443cf299ae007ff1babf.png',
            to: 'StarRank',
          },
        ],
      },
    ]
  },

  activated() {
    this.getBhdCount()
  },

  methods: {
    getBhdCount() {
      api.getBhdCount().then(res => {
        res.body.resultList?.forEach(item => {
          this.panelData[0].items.forEach(panelItem => {
            if (panelItem.bhdId === item.bhdItem) {
              panelItem.badge = item.totalCount
            }
          })
        })
      })
    },
  },
}
</script>

<style lang='scss' scoped>
</style>

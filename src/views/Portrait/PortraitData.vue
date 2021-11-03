<template>
  <div class="flex-1 flex flex-col">
    <e-header v-if="$route.meta.page" title="参数"></e-header>
    <e-tabs class="data-type">
      <e-tab title="基础信息"></e-tab>
      <e-tab title="风险管理"></e-tab>
    </e-tabs>

    <div class="p-2 flex-1 flex flex-col">
      <e-panel class="mb-2">
        <div class="flex">
          <div class="border-r border-gray w-2/5 text-center py-2 px-1">
            <div class="score text-primary">
              <span>{{ scoreSplit[0] }}</span>
              <span v-if="scoreSplit[1]" class="decimal">.{{ scoreSplit[1] }}</span>
            </div>
            <div class="text-sm">资质分</div>
          </div>
          <div class="text-sm flex flex-col justify-between py-3 px-4">
            <div>姓名：陈小龙</div>
            <div>职位：WEB前端开发</div>
            <div>部门：产品团队</div>
          </div>
        </div>
      </e-panel>
      <e-panel class="flex-1" title-class="flex justify-between">
        <template #title>
          <div>
            <e-img class="align-middle mr-1" src="/images/portrait/c8021a9e914e4262eaee5071f9c3d3c5.png" size="16"></e-img>
            <span>职位排名：第</span>
            <span class="text-primary text-lg leading-none"> 1 </span>
            <span>名</span>
          </div>
          <div>非常棒，请继续保持</div>
        </template>
        <e-charts :option="chartOption"></e-charts>
      </e-panel>
    </div>
  </div>
</template>

<script>
import { ETabs, ETab, EPanel, ECharts } from '@/components'
import theme from '@/theme'

export default {
  name: 'PortraitData',

  components: {
    ETabs,
    ETab,
    EPanel,
    ECharts,
  },

  data: () => ({
    score: 58,
  }),

  computed: {
    scoreSplit() {
      return String(this.score).split('.')
    },
    chartOption() {
      return {
        grid: {
          width: 100,
        },
        radar: {
          indicator: [
            { name: '工作态度', max: 100 },
            { name: '工作效率', max: 100 },
            { name: '执行力', max: 100 },
            { name: '职位贡献', max: 100 },
          ],
          radius: [0, 100],
        },
        series: [
          {
            type: 'radar',
            itemStyle: {
              color: theme.primary,
              lineStyle: {
                color: theme.primary,
              },
            },
            label: {
              show: true,
              textStyle: {
                color: theme['gray-1'],
              },
            },
            data: [
              {
                value: [80, 70, 90, 60],
              },
            ],
          },
        ],
      }
    },
  },
}
</script>

<style lang='scss' scoped>
.data-type::v-deep {
  padding-left: 10px;
  background-color: white;

  .van-tab {
    flex: initial;
    padding: 0 10px;
  }
}

.score {
  font-size: 50px;

  .decimal {
    font-size: 0.5em;
  }
}
</style>

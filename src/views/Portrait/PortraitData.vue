<template>
  <div class="flex-1 flex flex-col relative">
    <e-header v-if="$route.meta.page" :title="portraitData.userInfo.userName"></e-header>
    <div class="flex bg-white items-center justify-between pl-2 pr-3">
      <e-tabs v-model="dataType" class="data-type">
        <e-tab title="基础信息"></e-tab>
        <e-tab title="风险管理"></e-tab>
      </e-tabs>
      <e-icon v-if="!$route.meta.page" @click="showCalendar = true">filter-list</e-icon>
    </div>

    <div v-if="dataType === 0" class="p-2 flex-1 flex flex-col">
      <e-panel class="mb-2">
        <template #title>
          <div class="text-center leading-none">{{ startTime }} - {{ endTime }}</div>
        </template>
        <div class="flex">
          <div class="border-r border-gray w-2/5 text-center py-2 px-1">
            <div class="score text-primary">
              <span>{{ scoreSplit[0] }}</span>
              <span v-if="scoreSplit[1]" class="decimal">.{{ scoreSplit[1] }}</span>
            </div>
            <div class="text-sm">资质分</div>
          </div>
          <div class="text-sm flex flex-col justify-between py-3 px-4">
            <div>姓名：{{ portraitData.userInfo.userName }}</div>
            <div>职位：{{ portraitData.userInfo.position }}</div>
            <div>部门：{{ portraitData.userInfo.deptName }}</div>
          </div>
        </div>
      </e-panel>
      <e-panel class="flex-1" title-class="flex justify-between">
        <template #title>
          <div>
            <e-img
              class="align-middle mr-1"
              src="assets/images/portrait/c8021a9e914e4262eaee5071f9c3d3c5.png"
              size="16"
            ></e-img>
            <span>职位排名：第</span>
            <span class="text-primary text-lg leading-none"> {{ portraitData.userInfo.ranking }} </span>
            <span>名</span>
          </div>
          <!--TODO-->
          <!--<div>非常棒，请继续保持</div>-->
        </template>
        <e-charts :option="chartOption"></e-charts>
      </e-panel>
    </div>
    <div v-else-if="dataType === 1"></div>

    <e-loading :promise="loadingPromise"></e-loading>
    <van-calendar
      v-model="showCalendar"
      type="range"
      :min-date="minDate"
      :max-date="maxDate"
      @confirm="confirmCalendar"
    />
  </div>
</template>

<script>
import { ETabs, ETab, EPanel, ECharts } from '@/components'
import theme from '@/theme'
import * as api from '@/api/portrait'
import { getDaysAgo, formatDate } from '@/utils/helper'
import { Calendar } from 'vant'

export default {
  name: 'PortraitData',

  components: {
    ETabs,
    ETab,
    EPanel,
    ECharts,
    [Calendar.name]: Calendar,
  },

  data: () => ({
    portraitData: {
      userInfo: {},
      portrait: {},
    },

    dataType: 0,
    loadingPromise: null,
    showCalendar: false,
    startTime: getDaysAgo(30),
    endTime: formatDate(Date.now()),
    minDate: new Date(getDaysAgo(365)),
    maxDate: new Date(),
  }),

  computed: {
    scoreSplit() {
      return String(this.portraitData.userInfo.qualificationNum)?.split('.')
    },
    chartOption() {
      const {
        workAttitude,
        eawPercent,
        forceExecutive,
        validTimePercent,
      } = this.portraitData.portrait

      return {
        grid: {
          width: 100,
        },
        radar: {
          indicator: [
            {
              name: '工作态度',
              max: 100,
            },
            {
              name: '工作效率',
              max: 100,
            },
            {
              name: '执行力',
              max: 100,
            },
            {
              name: '职位贡献',
              max: 100,
            },
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
                value: [
                  workAttitude,
                  eawPercent,
                  forceExecutive,
                  validTimePercent,
                ],
              },
            ],
          },
        ],
      }
    },
  },

  onLoad() {
    this.userId = this.$route.params.id ?? this.$store.getters.userData.userId

    this.getMyPortrait()
  },

  methods: {
    getMyPortrait() {
      this.loadingPromise = api.getMyPortrait({
        startTime: this.startTime,
        endTime: this.endTime,
        userId: this.userId,
      }).then(res => {
        this.portraitData = res.body.userRanking[0]
      })
    },
    confirmCalendar([start, end]) {
      this.startTime = formatDate(start)
      this.endTime = formatDate(end)
      this.showCalendar = false
      this.getMyPortrait()
    },
  },
}
</script>

<style lang="scss" scoped>
.data-type::v-deep {
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

<template>
  <e-promise :promise="loadingPromise" loading root>
    <e-header v-if="$route.meta.page" :title="portraitData.title"></e-header>
    <div class="filter-bar justify-between pr-3">
      <e-tabs v-model="dataType" class="data-type">
        <e-tab title="基本信息"></e-tab>
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
            <div class="text-sm">{{ switchText('资质分', '执行力') }}</div>
          </div>
          <div
            class="text-sm flex flex-col py-3 px-4"
            :class="{
              'justify-between': $route.meta.personal,
              'justify-around': $route.meta.dept
            }"
          >
            <template v-if="$route.meta.personal">
              <div>姓名：{{ portraitData.userName }}</div>
              <div>职位：{{ portraitData.position }}</div>
              <div>部门：{{ portraitData.deptName }}</div>
            </template>
            <template v-else-if="$route.meta.dept">
              <div>部门：{{ portraitData.deptName }}</div>
              <div>人数：{{ portraitData.userCountNum }}</div>
            </template>
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
            <span>
              {{ switchText('职位', '部门') }}排名：第</span>
            <span class="text-primary text-lg leading-none"> {{ portraitData.ranking }} </span>
            <span>名</span>
          </div>
          <!--TODO-->
          <!--<div>非常棒，请继续保持</div>-->
        </template>
        <e-charts :option="chartOption"></e-charts>
      </e-panel>
    </div>
    <div v-else-if="dataType === 1">
    </div>

    <van-calendar
      v-model="showCalendar"
      type="range"
      :min-date="minDate"
      :max-date="maxDate"
      @confirm="confirmCalendar"
    />
  </e-promise>
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
    personalData: {
      userInfo: {},
      portrait: {},
    },
    deptData: {},

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
      return String(this.portraitData.qualificationNum)?.split('.')
    },
    chartOption() {
      const {
        workAttitude,
        eawPercent,
        forceExecutive,
        validTimePercent,
      } = this.portraitData

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
            // 不显示数字
            // label: {
            //   show: true,
            //   textStyle: {
            //     color: theme['gray-1'],
            //   },
            // },
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
    portraitData() {
      if (this.$route.meta.dept) {
        const deptData = this.deptData
        return {
          title: deptData.departName,
          ranking: deptData.ranking,
          qualificationNum: deptData.qualificationNum,
          userCountNum: deptData.userCountNum,
          deptName: deptData.departName,
          workAttitude: deptData.workAttitude,
          eawPercent: deptData.eawPercent,
          forceExecutive: deptData.forceExecutive,
          validTimePercent: deptData.validTimePercent,
        }
      } else if (this.$route.meta.personal) {
        const userInfo = this.personalData.userInfo
        const portrait = this.personalData.portrait
        return {
          title: userInfo.userName,
          ranking: userInfo.ranking,
          qualificationNum: userInfo.qualificationNum,
          userName: userInfo.userName,
          position: userInfo.position,
          deptName: userInfo.deptName,
          workAttitude: portrait.workAttitude,
          eawPercent: portrait.eawPercent,
          forceExecutive: portrait.forceExecutive,
          validTimePercent: portrait.validTimePercent,
        }
      }
      return {}
    },
  },

  onLoad() {
    const {
      query,
      params,
    } = this.$route
    this.id = params.id ?? this.$store.getters.userData.userId
    const {
      startTime,
      endTime,
    } = query
    this.startTime = startTime ?? this.startTime
    this.endTime = endTime ?? this.endTime

    this.loadingPromise = this.loadData()
  },

  methods: {
    loadData() {
      const { meta } = this.$route
      if (meta.dept) {
        return this.getDeptPortrait()
      } else if (meta.personal) {
        return this.getMyPortrait()
      }
    },
    getMyPortrait() {
      return api.getMyPortrait({
        startTime: this.startTime,
        endTime: this.endTime,
        userId: this.id,
      }).then(res => {
        this.personalData = res.body.userRanking[0]
      })
    },
    getDeptPortrait() {
      return api.getDeptPortrait({
        startTime: this.startTime,
        endTime: this.endTime,
        deptId: this.id,
      }).then(res => {
        this.deptData = res.body.resultMap
      })
    },
    confirmCalendar([start, end]) {
      this.startTime = formatDate(start)
      this.endTime = formatDate(end)
      this.showCalendar = false
      this.getMyPortrait()
    },
    switchText(text1, text2) {
      if (this.$route.meta.personal) return text1
      else if (this.$route.meta.dept) return text2
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

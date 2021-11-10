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

    <div class="flex flex-col flex-1 relative overflow-auto p-2">
      <template v-if="dataType === 0">
        <e-panel class="mb-2">
          <template #title>
            <div class="text-center leading-none">{{ startTime }} - {{ endTime }}</div>
          </template>
          <div class="flex">
            <div class="border-r border-gray w-2/5 text-center py-2 px-1">
              <div class="score" :class="portraitData.qualificationNum > 60 ? 'text-primary' : 'text-warn'">
                <span>{{ scoreSplit[0] }}</span>
                <span v-if="scoreSplit[1]" class="decimal">.{{ scoreSplit[1] }}</span>
              </div>
              <div class="text-sm">优秀值</div>
            </div>
            <div
              class="text-sm flex flex-col py-3 px-4 justify-between"
            >
              <template v-if="$route.meta.personal">
                <div>姓名：{{ portraitData.userName }}</div>
                <div>部门：{{ portraitData.deptName }}</div>
                <div>职位：{{ portraitData.position }}</div>
              </template>
              <template v-else-if="$route.meta.dept">
                <div>部门：{{ portraitData.deptName }}</div>
                <div>级别：{{ portraitData.departGrade }}</div>
                <div>人数：{{ portraitData.userCountNum }}</div>
              </template>
            </div>
          </div>
        </e-panel>
        <e-panel class="flex-1" title-class="flex justify-between">
          <template #title>
            <div class="flex items-center">
              <e-icon class="mr-1">medal</e-icon>
              <span>
                {{ switchText('职位', '部门') }}排名：第</span>
              <span class="text-primary text-lg leading-none"> {{ portraitData.ranking }} </span>
              <span>名</span>
            </div>
            <div v-if="$route.meta.personal" class="flex items-center">
              <span>{{ portraitData.scoreGap }}</span>
              <e-icon class="text-primary ml-1" size="18">
                {{ portraitData.ranking === 1 ? 'crown' : 'to-top' }}
              </e-icon>
            </div>
          </template>
          <e-charts :option="chartOption" height="300"></e-charts>
        </e-panel>
      </template>
      <template v-else-if="dataType === 1">
        <e-panel class="mb-2" title="预警趋势图(次)">
          <e-promise :promise="warnCountPromise" root>
            <e-charts :option="chartRisk" height="230"></e-charts>
          </e-promise>
        </e-panel>
        <e-panel class="flex-1" content-class="text-sm leading-normal" title="优化建议">
          <e-promise class="p-2 h-full" :promise="suggestedPromise" root>
            <div class="flex items-center">
              <e-img class="mr-1" src="assets/images/warn/noAccess.png" size="16"></e-img>
              <span>
                非标软件
                <span class="text-error text-base font-bold text-opacity-75">{{ suggestedData.invalidSoftCount }}</span>
                项,使用时长
                <span class="text-error text-base font-bold text-opacity-75">{{ suggestedData.invalidTime }}</span>
                ,前5项为:
              </span>
            </div>
            <div v-if="suggestedData.userSoftTop">
              <div class="divide-y divide-gray">
                <div
                  v-for="(item, index) of suggestedData.userSoftTop"
                  :key="item.appName"
                  class="leading-loose flex justify-between"
                >
                  <span class="truncate">{{ index + 1 }}. {{ item.appName }}</span>
                  <span class="whitespace-nowrap">{{ item.invalidCount }}</span>
                </div>
              </div>
            </div>
          </e-promise>
        </e-panel>
      </template>
      <!--      <e-loading :promise="loadingPromise"></e-loading>-->
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
import { Calendar, Popup } from 'vant'

export default {
  name: 'PortraitData',

  components: {
    ETabs,
    ETab,
    EPanel,
    ECharts,
    [Popup.name]: Popup,
    [Calendar.name]: Calendar,
  },

  data: () => ({
    personalData: {
      userInfo: {},
      portrait: {},
    },
    deptData: {},
    countList: [],
    suggestedData: {},

    // tabs top
    dataType: 0,
    // tabs bottom
    workType: 0,
    loadingPromise: null,
    warnCountPromise: null,
    suggestedPromise: null,
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
    chartRisk() {
      return {
        grid: {
          top: 20,
          left: 20,
          right: 20,
          bottom: 20,
          containLabel: true,
        },
        tooltip: {
          trigger: 'axis',
          confine: true,
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: [...this.warnDateList],
          },

        ],
        yAxis: [
          {
            type: 'value',
          },
        ],
        series: [
          {
            type: 'line',
            itemStyle: {
              color: theme.warn,
              lineStyle: {
                color: theme.warn,
              },
            },
            data: [...this.warnCountList],
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
          departGrade: deptData.departGrade,
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
          scoreGap: portrait.scoreGap,
        }
      }
      return {}
    },
    warnCountList() {
      return this.countList.map(item => item.countNum)
    },
    warnDateList() {
      return this.countList.map(item => item.date)
    },
    queryIdField() {
      if (this.$route.meta.personal) return { userId: this.id }
      else if (this.$route.meta.dept) return { deptId: this.id }
      return {}
    },
  },

  watch: {
    workType(newValue) {
      this.workType = newValue
      // this.loadData()
    },
    dataType(newValue) {
      this.dataType = newValue
      this.loadData()
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

      if (this.dataType === 0) {
        if (meta.dept) {
          return this.getDeptPortrait()
        } else if (meta.personal) {
          return this.getMyPortrait()
        }
      } else if (this.dataType === 1) {
        this.warnCountPromise = this.getBHDCount()
        this.suggestedPromise = this.getProposalInfo()
      }
    },
    // 风险管理 二级tabs
    tabsData() {
      if (this.workType === 0) {
        // this.getBHDCount()
      } else if (this.workType === 1) {
        // this.getSoftCountInfo()
      } else if (this.workType === 2) {
        // this.getProposalInfo()
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
    getBHDCount() {
      return api.getBHDCount({
        startTime: this.startTime,
        endTime: this.endTime,
        ...this.queryIdField,
        pageNum: 1,
        pageSize: 365,
      }).then(res => {
        this.countList = res.body.countList
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
    getSoftCountInfo() {
      this.loadingPromise = api.getSoftCountInfo({
        startTime: this.startTime,
        endTime: this.endTime,
        userId: this.userId,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      }).then(res => {
        // resData
      })
    },
    getProposalInfo() {
      return api.getProposalInfo({
        startTime: this.startTime,
        endTime: this.endTime,
        ...this.queryIdField,
        pageNum: 1,
        pageSize: 365,
      }).then(res => {
        this.suggestedData = res.body
        // eslint-disable-next-line prefer-promise-reject-errors
        if (res.body.totalCount === 0) return Promise.reject()
      })
    },
    confirmCalendar([start, end]) {
      this.startTime = formatDate(start)
      this.endTime = formatDate(end)
      this.showCalendar = false
      this.loadData()
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

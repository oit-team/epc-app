<template>
  <div class="bg-white flex flex-col">
    <e-header title="明星榜" border></e-header>
    <div class="date-type flex bg-white z-50">
      <e-tabs v-model="dateType" class="flex-1">
        <e-tab title="日" name="1"></e-tab>
        <e-tab title="周" name="2"></e-tab>
        <e-tab title="月" name="3"></e-tab>
        <e-tab title="季" name="4"></e-tab>
      </e-tabs>
      <div class="flex-center w-10" @click="() => $refs.picker.open()">
        <e-icon>filter-list</e-icon>
      </div>
    </div>

    <div class="bg-gray">
      <div class="text-center text-sm mt-2">{{ queryDateField }}</div>
      <e-tabs
        v-model="userIndex"
        class="star-people text-left bg-gray"
        hide-slider
      >
        <e-tab v-for="item of userRankList" :key="item.userId">
          <template #title>
            <div class="star-people-card">
              <e-img
                class="mr-4"
                :src="item.headPortrait"
                round
                size="50"
              ></e-img>
              <div class="flex flex-col justify-around">
                <div class="text-xl font-bold">{{ item.userName }}</div>
                <div class="text-xs text-secondary">{{ item.departName }}</div>
                <div class="text-xs text-secondary">{{ item.groupName }}</div>
              </div>
            </div>
          </template>
        </e-tab>
      </e-tabs>
    </div>

    <e-tabs v-model="chartType" class="chart-tabs">
      <e-tab title="优秀表现" :name="CHART_TYPES.PORTRAIT"></e-tab>
      <e-tab title="软件使用比" :name="CHART_TYPES.USE_RATIO"></e-tab>
      <e-tab title="软件使用分布" :name="CHART_TYPES.USE_TIME"></e-tab>
    </e-tabs>
    <div class="relative flex-1 overflow-hidden bg-gray">
      <e-charts
        v-if="chartType === CHART_TYPES.PORTRAIT"
        :option="portraitChartOption"
      ></e-charts>
      <e-charts
        v-if="chartType === CHART_TYPES.USE_RATIO"
        key="USE_RATIO"
        :option="useRatioChartOption"
      ></e-charts>
      <e-charts
        v-if="chartType === CHART_TYPES.USE_TIME"
        ref="useTime"
        key="USE_TIME"
        :option="useTimeChartOption"
      ></e-charts>
    </div>
    <e-empty v-if="pageEmpty" class="bg-gray"></e-empty>
    <e-loading class="bg-gray" :show="pageLoading"></e-loading>
    <e-picker
      ref="picker"
      :columns="dateFilterColumns"
      @confirm="confirmDateFilter"
    ></e-picker>
  </div>
</template>

<script>
import { ETabs, ETab, ECharts, ELoading, EPicker, EEmpty } from '@/components'
import * as api from '@/api/star'
import { getExcellentScore } from '@/api/portrait'
import theme from '@/theme'
import API_STATUS from '@/api/API_STATUS'

const CHART_TYPES = {
  // 画像图表
  PORTRAIT: 0,
  // 使用比
  USE_RATIO: 1,
  // 使用时长
  USE_TIME: 2,
}

// 日期类型
const DATE_TYPES = {
  // 日
  DAY: '1',
  // 周
  WEEK: '2',
  // 月
  MONTH: '3',
  // 季
  SEASON: '4',
}
// 准入软件颜色
const VALID_COLOR = '#ff8c7c'
// 非标软件颜色
const INVALID_COLOR = '#909399'

export default {
  name: 'StarRank',

  components: {
    ETabs,
    ETab,
    ECharts,
    ELoading,
    EPicker,
    EEmpty,
  },

  data: () => ({
    // 优秀表现
    portraitData: {},
    // 用户排行数据
    userRankList: [],
    // 图表数据
    useRatio: {},
    // 筛选条件数据缓存
    dateFilters: {},
    // 软件使用时长数据
    useTimeList: [],
    // 时间筛选类型选择
    dateType: '1',
    // 图表类型选择
    chartType: 0,
    // 当前选择的日期下标
    selectedIndex: 0,
    // 选择的用户下标
    userIndex: 0,
    // 页面loading
    pageLoading: true,
    // 页面无数据
    pageEmpty: false,
    // 图表loading
    chartLoading: false,
    // 图表无数据
    chartEmpty: false,
  }),

  computed: {
    portraitChartOption() {
      const {
        workAttitude,
        eawPercent,
        forceExecutive,
        validTimePercent,
        workEnthusiasm,
      } = this.portraitData

      return {
        grid: {
          width: 100,
        },
        radar: {
          indicator: [
            '工作态度',
            '工作效率',
            '工作改进',
            '职位贡献',
            '工作热情',
          ].map(name => ({
            name,
            max: 100,
          })),
          radius: [0, 100],
        },
        series: [
          {
            type: 'radar',
            itemStyle: {
              color: theme.warn,
              lineStyle: {
                color: theme.warn,
              },
            },
            data: [
              {
                value: [
                  workAttitude,
                  eawPercent,
                  forceExecutive,
                  validTimePercent,
                  workEnthusiasm,
                ],
              },
            ],
          },
        ],
      }
    },
    // 软件使用比图表配置
    useRatioChartOption() {
      return {
        tooltip: {
          trigger: 'item',
          confine: true,
          formatter: '{b}: {c}%',
        },
        series: [
          {
            type: 'pie',
            radius: '50%',
            label: {
              formatter: '{b}\n{d}%',
              position: 'inner',
              color: 'white',
            },
            data: [
              {
                value: Number(this.useRatio.valid),
                name: '准入软件',
                itemStyle: { color: VALID_COLOR },
              },
              {
                value: Number(this.useRatio.invalid),
                name: '非标软件',
                itemStyle: { color: INVALID_COLOR },
              },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          },
        ],
      }
    },
    // 软件使用时长图表配置
    useTimeChartOption() {
      this.$refs.useTime?.chart?.clear()
      return {
        grid: {
          top: '15%',
          left: '5%',
          bottom: 30,
          right: '20%',
          containLabel: true,
        },
        title: {
          text: 'TOP10',
          left: 'center',
          top: '5%',
        },
        label: {
          formatter: '{c}时',
        },
        tooltip: {
          trigger: 'item',
          confine: true,
        },
        xAxis: {
          type: 'value',
          max: 'dataMax',
        },
        yAxis: {
          type: 'category',
          data: this.useTimeTitle,
          inverse: true,
          max: 9,
        },
        series: [
          {
            realtimeSort: true,
            type: 'bar',
            data: this.useTimeData,
            label: {
              show: true,
              position: 'right',
              valueAnimation: true,
            },
          },
        ],
      }
    },
    // 时间筛选条件选项
    dateFilterColumns() {
      const dateType = this.dateType
      if (dateType === DATE_TYPES.WEEK) {
        return this.dateFilters[dateType]?.map(item => {
          return `${ item.startTime } - ${ item.endTime }`
        })
      } else if (dateType === DATE_TYPES.SEASON) {
        return this.dateFilters[dateType]?.map(item => {
          return `第${ item.belong }季度 ${ item.startTime } - ${ item.endTime }`
        })
      } else {
        return this.dateFilters[dateType]
      }
    },
    // 当前选择的时间筛选条件
    selectedDate() {
      return this.dateFilters[this.dateType]?.[this.selectedIndex]
    },
    // 查询字段格式化
    queryDateField() {
      return this.selectedDate && this.formatQuery(this.selectedDate)
    },
    // 软件使用时长图表左侧标题数据
    useTimeTitle() {
      return this.useTimeList.map(item => item.sotExeName)
    },
    // 软件使用时长数据
    useTimeData() {
      return this.useTimeList.map(item => ({
        value: item.validTime,
        name: item.sotExeName,
        itemStyle: {
          color: item.validType === '准入软件' ? VALID_COLOR : INVALID_COLOR,
        },
      }))
    },
    selectedUser() {
      return this.userRankList[this.userIndex]
    },
  },

  watch: {
    dateType() {
      this.userIndex = 0
      this.selectedIndex = 0
      this.loadData()
    },
    userIndex: 'loadChartData',
  },

  created() {
    this.CHART_TYPES = CHART_TYPES

    this.loadData()
  },

  methods: {
    async loadData() {
      this.pageLoading = true
      await this.getTopEmployeeByDate()
      await this.getUserRanking()
      if (this.selectedUser) {
        await this.loadChartData()
      }
      this.pageLoading = false
    },
    loadChartData() {
      this.chartLoading = true
      return Promise.all([this.getUserSotfRanking(), this.getSotfUeingList(), this.getExcellentScore()])
        .then(() => {
          this.chartEmpty = !this.useTimeList.length
        })
        .catch(() => {
          this.chartEmpty = true
        })
        .finally(() => {
          this.chartLoading = false
        })
    },
    // 查询明星榜筛选条件
    getTopEmployeeByDate(dateType) {
      dateType ??= this.dateType

      // 如果有数据则返回
      if (this.dateFilters[dateType]) return this.dateFilters[dateType]

      // 日期类型
      const dateMap = {
        // 日，往前推几月中的每一天
        [DATE_TYPES.DAY]: 1,
        // 周，往前推几周
        [DATE_TYPES.WEEK]: 4,
        // 月，往前推几月
        [DATE_TYPES.MONTH]: 3,
        // 季，往前推几季
        [DATE_TYPES.SEASON]: 3,
      }
      const params = {
        flag: dateType,
        dayNum: dateMap[dateType],
      }

      return api.getTopEmployeeByDate(params).then(res => {
        this.$set(this.dateFilters, dateType, res.body.resultList)
      })
    },
    // 获取明星榜数据
    getUserRanking() {
      const dateType = this.dateType
      this.$refs.picker.close()
      return api
        .getUserRanking({
          orgId: this.$store.getters.userData.orgId,
          flag: dateType,
          belong: this.formatQuery(this.selectedDate, true),
        })
        .then(res => {
          this.userRankList = res.body.resultList
          this.pageEmpty = false
          // 如果用户不存在则重置下标
          if (this.selectedUser === undefined) {
            this.userIndex = 0
          }
        })
        .catch(err => {
          if (err.head.status === API_STATUS.FAILED && err.body === null) {
            this.userRankList = []
            this.pageEmpty = true
            this.pageLoading = false
          }
        })
    },
    // 查询软件使用比
    getUserSotfRanking() {
      return api
        .getUserSotfRanking({
          orgId: this.$store.getters.userData.orgId,
          userId: this.selectedUser.userId,
          flag: this.dateType,
          belong: this.queryDateField,
        })
        .then(res => {
          this.useRatio = res.body
        })
    },
    // 查询软件使用时长
    getSotfUeingList() {
      return api
        .getSotfUeingList({
          orgId: this.$store.getters.userData.orgId,
          userId: this.selectedUser.userId,
          flag: this.dateType,
          belong: this.queryDateField,
        })
        .then(res => {
          this.useTimeList = res.body.sotfUeingList
        })
    },
    // TODO: 确认后缓存选中，下次切换时间选择回到之前的选中，切换人员时重置
    confirmDateFilter(value, index) {
      this.selectedIndex = index
      this.loadData()
    },
    /**
     * @param {boolean} num 用于差异判断，查询季的用户排行榜数据需要传数字
     */
    formatQuery(item, num) {
      if (this.dateType === DATE_TYPES.WEEK) {
        return `${ item.startTime }-${ item.endTime }`
      } else if (this.dateType === DATE_TYPES.SEASON) {
        return num ? item.belong : `${ item.startTime }-${ item.endTime }`
      } else {
        return item
      }
    },
    getExcellentScore() {
      return getExcellentScore({
        orgId: this.$store.getters.userData.orgId,
        userId: this.selectedUser.userId,
        flag: this.dateType,
        belong: this.queryDateField,
      }).then(res => {
        this.portraitData = res.body.result || {}
      })
    },
  },
}
</script>

<style lang="scss" scoped>
  .date-type::v-deep {
    .van-tabs__nav {
      padding-bottom: 10px;
    }

    .van-tabs__nav > :not(:last-child) ~ :not(:last-child) {
      &:before {
        content: "";
        display: block;
        position: absolute;
        left: 0;
        height: 1em;
        border-left: 2px solid #f0f0f0;
      }
    }

    .van-tab--active {
      font-size: 1rem;
    }
  }

  .star-people::v-deep {
    .van-tabs__wrap {
      height: initial;
    }

    .van-tabs__nav {
      height: 100px;
      padding: 10px 5px;
      overflow-x: auto;
      overflow-y: hidden;
      -webkit-overflow-scrolling: touch;
      background: transparent;
      box-sizing: border-box;
    }

    .van-tab {
      flex: 1 0 auto;

      .van-tab__text {
        overflow: initial;
        flex: inherit;
      }

      .star-people-card {
        @apply flex items-center justify-center p-2 bg-white rounded-lg;
        transition: 0.3s;
      }
    }

    .van-tab--active {
      .star-people-card {
        background: #e8f2e7;
      }
    }
  }

  .chart-tabs::v-deep {
    .van-tab {
      flex: none;
      padding: 0 10px;
    }
  }
</style>

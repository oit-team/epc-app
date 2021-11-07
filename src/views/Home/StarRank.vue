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

    <e-tabs v-model="userIndex" class="star-people text-left" hide-slider>
      <e-tab v-for="item of userRankList" :key="item.userId">
        <template #title>
          <div class="star-people-card">
            <e-img
              class="mr-4"
              :src="item.headPortrait"
              round
              size="50"
            ></e-img>
            <div>
              <div>{{ item.userName }}</div>
              <div>{{ item.groupName }}</div>
              <div>{{ item.departName }}</div>
            </div>
          </div>
        </template>
      </e-tab>
    </e-tabs>

    <e-tabs v-model="chartType" class="chart-tabs">
      <e-tab title="软件使用比"></e-tab>
      <e-tab title="软件使用分布"></e-tab>
    </e-tabs>
    <div class="relative flex-1 overflow-hidden">
      <e-charts
        v-if="chartType === USE_RATIO"
        key="USE_RATIO"
        :option="useRatioChartOption"
      ></e-charts>
      <e-charts
        v-if="chartType === USE_TIME"
        key="USE_TIME"
        :option="useTimeChartOption"
      ></e-charts>
      <e-empty v-if="chartEmpty"></e-empty>
      <e-loading class="bg-gray" :show="chartLoading"></e-loading>
    </div>

    <e-empty v-if="pageEmpty"></e-empty>
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
import API_STATUS from '@/api/API_STATUS'

// 使用比
const USE_RATIO = 0
// 使用时长
const USE_TIME = 1
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
    chartLoading: true,
    // 图表无数据
    chartEmpty: false,

    // 用户排行数据
    userRankList: [],
    // 图表数据
    useRatio: {},
    // 筛选条件数据缓存
    dateFilters: {},
    // 软件使用时长数据
    useTimeList: [],
  }),

  computed: {
    // 软件使用比图表配置
    useRatioChartOption() {
      return {
        title: {
          text: this.queryDateField,
          left: 'center',
          top: '5%',
        },
        tooltip: {
          trigger: 'item',
          confine: true,
          formatter: '{b}: {c}%',
        },
        series: [
          {
            type: 'pie',
            radius: '50%',
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
      return {
        grid: {
          top: '15%',
          bottom: 30,
          left: '40%',
          right: 50,
        },
        title: {
          text: `${this.queryDateField}(TOP10)`,
          left: 'center',
          top: '5%',
        },
        tooltip: {
          trigger: 'item',
          confine: true,
        },
        xAxis: {
          max: 'dataMax',
        },
        yAxis: {
          type: 'category',
          data: this.useTimeTitle,
          inverse: true,
          animationDuration: 300,
          animationDurationUpdate: 300,
          max: 9,
        },
        series: [
          {
            realtimeSort: true,
            name: 'X',
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
          return `${item.startTime} - ${item.endTime}`
        })
      } else if (dateType === DATE_TYPES.SEASON) {
        return this.dateFilters[dateType]?.map(item => {
          return `第${item.belong}季度 ${item.startTime} - ${item.endTime}`
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
      this.selectedIndex = 0
      this.loadData()
    },
    userIndex: 'loadChartData',
  },

  created() {
    this.USE_RATIO = USE_RATIO
    this.USE_TIME = USE_TIME

    this.loadData()
  },

  methods: {
    async loadData() {
      this.pageLoading = true
      await this.getTopEmployeeByDate()
      await this.getUserRanking()
      await this.loadChartData()
      this.pageLoading = false
    },
    loadChartData() {
      this.chartLoading = true
      return Promise.all([this.getUserSotfRanking(), this.getSotfUeingList()])
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

      return api.getUserRanking({
        orgId: '266',
        flag: dateType,
        belong: this.formatQuery(this.selectedDate, true),
      }).then(res => {
        this.userRankList = res.body.resultList
        this.pageEmpty = false
      }).catch(err => {
        if (err.head.status === API_STATUS.FAILED && err.body === null) {
          this.userRankList = []
          this.pageEmpty = true
          this.loading = false
        }
      })
    },
    // 查询软件使用比
    getUserSotfRanking() {
      if (!this.selectedUser) return

      return api.getUserSotfRanking({
        orgId: '3',
        userId: this.selectedUser.userId,
        flag: this.dateType,
        belong: this.queryDateField,
      }).then(res => {
        this.useRatio = res.body
      })
    },
    // 查询软件使用时长
    getSotfUeingList() {
      if (!this.selectedUser) return

      return api.getSotfUeingList({
        orgId: '3',
        userId: this.selectedUser.userId,
        flag: this.dateType,
        belong: this.queryDateField,
      }).then(res => {
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
        return `${item.startTime}-${item.endTime}`
      } else if (this.dateType === DATE_TYPES.SEASON) {
        return num ? item.belong : `${item.startTime}-${item.endTime}`
      } else {
        return item
      }
    },
  },
}
</script>

<style lang='scss' scoped>
  .date-type::v-deep {
    .van-tabs__wrap {
      padding-right: 130px;
    }
    .van-tab {
      margin: 0 10px;
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
        box-shadow: 0 0 10px -1px var(--primary);
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

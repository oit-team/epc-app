<template>
  <div>
    <div class="filter-bar px-2 items-stretch py-1 text-secondary">
      <div class="bg-gray flex items-center flex-1 px-2" @click="showFilter = true">
        <e-icon class="pr-2 align-middle">sitemap</e-icon>
        <span>组织筛选</span>
      </div>
      <div class="flex items-center bg-gray ml-1 px-2 w-3/5" @click="showCalendar = true">
        <e-icon class="pr-2">filter-list</e-icon>
        <span>{{ startTime }} - {{ endTime }}</span>
      </div>
    </div>

    <div class="p-2 flex-1">
      <e-panel class="h-full overflow-hidden">
        <!--        <e-pull-refresh>-->
        <!--          <e-infinite-loading>-->
        <div class="divide-y divide-gray h-full">
          <rank-item
            v-for="(item, index) of rankData"
            :key="item.deptId"
            :index="index + 1"
            :item="item"
            :params="{
              startTime,
              endTime,
            }"
          ></rank-item>
        </div>
        <!--          </e-infinite-loading>-->
        <!--        </e-pull-refresh>-->
      </e-panel>
    </div>

    <van-popup v-model="showFilter" position="bottom" round>
      <div class="flex justify-between px-3 py-2 text-sm">
        <span class="text-secondary" @click="showFilter = false">取消</span>
        <span class="text-primary" @click="confirmFilter">确定</span>
      </div>
      <van-tree-select
        :items="deptTreeItems"
        :active-id.sync="activeIdsLazy"
        :main-active-index.sync="activeIndex"
      ></van-tree-select>
    </van-popup>

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
import { EPanel } from '@/components'
import { TreeSelect, Popup, Calendar } from 'vant'
import * as api from '@/api/portrait'
import { formatDate, getDaysAgo, registerVantComponents } from '@/utils/helper'

const RankItem = {
  props: {
    index: [Number, String],
    item: Object,
    params: {},
  },

  render(h) {
    const path = this.self ? './data' : './data/dept/' + this.item.deptId
    const qualificationNum = parseFloat(Number(this.item.qualificationNum).toFixed(2))

    return (
        <div class="flex items-center py-2 text-center" vOn:click={() => this.$router.to(path, this.params, true)}>
          <div class="text-primary w-1/6">{this.index}</div>
          <div class="flex-1 text-sm">{this.item.departName}</div>
          <div class="flex-1 text-sm">共{this.item.userCountNum}人</div>
          <div class="w-1/6 text-xl text-warn">{qualificationNum}</div>
        </div>
    )
  },
}

export default {
  name: 'DepartmentRank',

  components: {
    EPanel,
    RankItem,
    ...registerVantComponents([TreeSelect, Popup, Calendar]),
  },

  data: () => ({
    rankData: [],
    deptItems: [],

    activeIds: [],
    activeIdsLazy: [],
    showFilter: false,
    activeIndex: 0,
    showCalendar: false,
    startTime: getDaysAgo(30),
    endTime: formatDate(Date.now()),
    minDate: new Date(getDaysAgo(365)),
    maxDate: new Date(),
  }),

  computed: {
    deptTreeItems() {
      return this.deptItems.map(group => ({
        text: group.deptLevel,
        children: group.deptData.map(item => ({
          text: item.deptName,
          id: item.deptId,
        })),
      }))
    },
  },

  watch: {
    activeIndex() {
      this.activeIdsLazy = []
    },
  },

  onLoad() {
    this.getDeptRankingList()
    this.getDeptSearchInfo()
  },

  methods: {
    getDeptRankingList(loading) {
      api.getDeptRankingList({
        startTime: this.startTime,
        endTime: this.endTime,
        deptId: this.activeIds.length > 0 ? this.activeIds : null,
      }, loading).then(res => {
        this.rankData = res.body.resultList
      })
    },
    getDeptSearchInfo() {
      api.getDeptSearchInfo().then(res => {
        this.deptItems = res.body.resultList
      })
    },
    confirmCalendar([start, end]) {
      this.startTime = formatDate(start)
      this.endTime = formatDate(end)
      this.showCalendar = false
      this.getDeptRankingList(true)
    },
    confirmFilter() {
      this.activeIds = this.activeIdsLazy
      this.getDeptRankingList(true)
      this.showFilter = false
    },
  },
}
</script>

<style lang="scss" scoped>

</style>

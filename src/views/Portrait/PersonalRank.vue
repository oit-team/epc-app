<template>
  <e-promise :promise="loadingPromise" loading>
    <e-pull-refresh class="p-2 pt-0 flex-1 flex flex-col overflow-hidden relative" @refresh="refresh">
      <div class="-mx-2 mb-2 flex items-center bg-white">
        <van-search
          v-model="searchText"
          class="flex-1 p-1 pr-0"
          clear-trigger="always"
          @input="() => (getUserPortrait(), null)"
        ></van-search>
        <e-icon class="px-3" @click="showCalendar = true">filter-list</e-icon>
      </div>
      <e-panel>
        <rank-item :index="selfData.userInfo.ranking" :item="selfData" self></rank-item>
      </e-panel>
      <e-panel class="flex-1 mt-2 overflow-hidden relative">
        <div class="divide-y divide-gray">
          <rank-item
            v-for="item of portraitList"
            :key="item.userInfo.userId"
            :item="item"
            :index="item.userInfo.ranking"
          ></rank-item>
        </div>
        <e-empty v-if="dataEmpty"></e-empty>
      </e-panel>
      <van-calendar
        v-model="showCalendar"
        type="range"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="confirmCalendar"
      />
    </e-pull-refresh>
  </e-promise>
</template>

<script>
import { EPanel, EEmpty } from '@/components'
import * as api from '@/api/portrait'
import { formatDate, getDaysAgo, registerVantComponents } from '@/utils/helper'
import { Calendar, Search } from 'vant'

const RankItem = {
  props: {
    index: [Number, String],
    item: Object,
    self: Boolean,
  },

  render(h) {
    const userInfo = this.item?.userInfo ?? {}
    const path = this.self ? './data' : './data/personal/' + userInfo.userId
    const qualificationNum = parseFloat(Number(userInfo.qualificationNum).toFixed(2))

    return (
        <div
            class="flex items-center py-2 text-center"
            vOn:click={() => this.$router.to(path)}
        >
          <div class="text-primary w-1/6">{this.index}</div>
          <e-img class="rounded-lg mr-2" src={userInfo.telephone} size="50"></e-img>
          <div class="flex-1 text-sm text-left">
            <div>{userInfo.userName} - {userInfo.position}</div>
            <div>{userInfo.deptName}</div>
          </div>
          <div class="w-1/6 text-xl text-warn">{qualificationNum}</div>
        </div>
    )
  },
}

export default {
  name: 'PersonalRank',

  components: {
    EPanel,
    EEmpty,
    RankItem,
    ...registerVantComponents([Search, Calendar]),
  },

  data: () => ({
    selfData: {
      userInfo: {},
    },
    portraitList: [],

    searchText: '',
    loadingPromise: null,
    showCalendar: false,
    dataEmpty: false,
    startTime: getDaysAgo(30),
    endTime: formatDate(Date.now()),
    minDate: new Date(getDaysAgo(365)),
    maxDate: new Date(),
  }),

  onLoad() {
    this.loadingPromise = this.getUserPortrait()
  },

  methods: {
    getUserPortrait() {
      return api.getUserPortrait({
        startTime: this.startTime,
        endTime: this.endTime,
        userName: this.searchText,
      }).then(res => {
        this.selfData = res.body.userRanking[0]
        this.portraitList = res.body.portraitList
        this.dataEmpty = false
      }).catch(() => {
        this.portraitList = []
        this.dataEmpty = true
      })
    },
    confirmCalendar([start, end]) {
      this.startTime = formatDate(start)
      this.endTime = formatDate(end)
      this.showCalendar = false
      this.getUserPortrait()
    },
    refresh($state) {
      this.getUserPortrait().then($state.loaded).catch($state.error)
    },
  },
}
</script>

<style lang="scss" scoped>
</style>

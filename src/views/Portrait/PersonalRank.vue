<template>
  <e-promise :promise="loadingPromise" loading root>
    <div class="filter-bar px-2 text-secondary text-sm">
      <van-search
        v-model="searchText"
        class="py-1 px-0 flex-1 text-secondary rounded"
        clear-trigger="always"
        @input="() => (getUserPortrait(), null)"
      ></van-search>
      <div class="flex items-center bg-gray self-stretch my-1 ml-1 px-2 w-3/5 rounded" @click="showCalendar = true">
        <e-icon class="pr-2">calendar-days</e-icon>
        <span class="whitespace-nowrap">{{ startTime }} - {{ endTime }}</span>
      </div>
    </div>

    <div class="flex-1 flex flex-col p-2 overflow-hidden">
      <e-panel>
        <rank-item :index="selfData.userInfo.ranking" :item="selfData" self></rank-item>
      </e-panel>
      <e-panel class="flex-1 mt-2 relative overflow-hidden" content-class="overflow-auto">
        <!--        <e-pull-refresh class="" @refresh="refresh">-->
        <e-infinite-loading ref="list" pager @load="loadData">
          <div class="divide-y divide-gray">
            <rank-item
              v-for="item of portraitList"
              :key="item.userInfo.userId"
              :item="item"
              :index="item.userInfo.ranking"
              :params="{
                startTime,
                endTime,
              }"
            ></rank-item>
          </div>
        </e-infinite-loading>
        <!--        </e-pull-refresh>-->
        <e-empty v-if="dataEmpty"></e-empty>
      </e-panel>
    </div>

    <van-calendar
      v-model="showCalendar"
      type="range"
      :min-date="minDate"
      :max-date="maxDate"
      allow-same-day
      @confirm="confirmCalendar"
    />
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
    params: {},
  },

  render(h) {
    const userInfo = this.item?.userInfo ?? {}
    const path = this.self ? './data' : './data/personal/' + userInfo.userId
    const qualificationNum = parseFloat(Number(userInfo.qualificationNum).toFixed(2))

    return (
        <div
            class="flex items-center py-2 text-center"
            vOn:click={() => this.$router.to(path, this.params, true)}
        >
          <div class="text-primary w-1/6">{this.index}</div>
          <e-img class="rounded-lg mr-2" src={userInfo.telephone} size="50"></e-img>
          <div class="flex-1 text-sm text-left">
            <div>
              <span class="font-bold">{userInfo.userName}</span>
              <span class="text-secondary"> - {userInfo.deptName}</span>
            </div>
            <div>
              <span class="text-secondary">{userInfo.position}</span>
            </div>
          </div>
          <div class={['w-1/6 text-xl', qualificationNum >= 60 ? 'text-primary' : 'text-warn']}>{qualificationNum}</div>
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
    this.loadingPromise = this.getUserPortrait().catch((err) => {
      this.dataEmpty = true
      this.portraitList = []
      return Promise.reject(err)
    }).finally(() => {
      this.loadingPromise = null
    })
  },

  methods: {
    getUserPortrait(page = 1) {
      return api.getUserPortrait({
        startTime: this.startTime,
        endTime: this.endTime,
        userName: this.searchText,
        pageNum: page,
        pageSize: 100,
      }).then(res => {
        if (page === 1) this.$refs.list.resetState()
        this.portraitList = page === 1 ? res.body.portraitList : this.portraitList.concat(res.body.portraitList)
        this.selfData = res.body.userRanking[0]
        this.dataEmpty = false
        return res.body.portraitList
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
    loadData($state) {
      const promise = this.loadingPromise !== null ? this.loadingPromise : this.getUserPortrait($state.page)
      promise.then(res => {
        res.length === 0 ? $state.finished() : $state.loaded()
      }).catch($state.error)
    },
  },
}
</script>

<style lang="scss" scoped>
</style>

<style lang="scss">
.van-field__control {
  color: var(--secondary)
}
</style>

<template>
  <div class="p-2 flex-1 flex flex-col overflow-hidden">
    <e-panel>
      <rank-item :index="selfData.userInfo.ranking" :item="selfData" self></rank-item>
    </e-panel>
    <e-promise :promise="promise" loading>
      <e-panel class="flex-1 mt-2 overflow-hidden">
        <div class="divide-y divide-gray">
          <rank-item
            v-for="item of portraitList"
            :key="item.userInfo.userId"
            :item="item"
            :index="item.userInfo.ranking"
          ></rank-item>
        </div>
      </e-panel>
    </e-promise>
  </div>
</template>

<script>
import { EPanel, EPromise } from '@/components'
import * as api from '@/api/portrait'
import { formatDate, getDaysAgo } from '@/utils/helper'

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
          <div class="w-1/6 text-xl text-warn">{ qualificationNum }</div>
        </div>
    )
  },
}

export default {
  name: 'PersonalRank',

  components: {
    // eslint-disable-next-line vue/no-unused-components
    EPromise,
    EPanel,
    RankItem,
  },

  data: () => ({
    selfData: {
      userInfo: {},
    },
    portraitList: [],
    promise: null,
  }),

  onLoad() {
    this.promise = this.getUserPortrait()
  },

  methods: {
    getUserPortrait() {
      return api.getUserPortrait({
        startTime: getDaysAgo(30),
        endTime: formatDate(Date.now()),
        userName: '',
      }).then(res => {
        this.selfData = res.body.userRanking[0]
        this.portraitList = res.body.portraitList
      }).catch(err => {
        console.log(err)
      })
    },
  },
}
</script>

<style lang="scss" scoped>

</style>

<template>
  <div class="p-2 flex-1 flex flex-col overflow-hidden">
    <div class="-mt-2 -mx-2 mb-2 flex items-center bg-white">
      <e-icon class="px-3" @click="showCalendar = true">filter-list</e-icon>
    </div>
    <e-panel>
      <rank-item index="1" :item="{}"></rank-item>
    </e-panel>
    <e-panel class="flex-1 mt-2 overflow-hidden">
      <e-pull-refresh>
        <e-infinite-loading>
          <div class="divide-y divide-gray">
            <rank-item v-for="(item, index) of 20" :key="index" :index="index"></rank-item>
          </div>
        </e-infinite-loading>
      </e-pull-refresh>
    </e-panel>
  </div>
</template>

<script>
import { EPanel, EInfiniteLoading, EPullRefresh } from '@/components'
import * as api from '@/api/portrait'
import { formatDate, getDaysAgo } from '@/utils/helper'

const RankItem = {
  props: {
    index: [Number, String],
    item: Object,
  },

  render(h) {
    return (
      <div class="flex items-center py-2 text-center">
        <div class="text-primary w-1/6">{this.index}</div>
        <div class="flex-1 text-sm">软件部门</div>
        <div class="flex-1 text-sm">共16人</div>
        <div class="w-1/6 text-xl text-warn">100</div>
      </div>
    )
  },
}

export default {
  name: 'DepartmentRank',

  components: {
    EPanel,
    RankItem,
    EInfiniteLoading,
    EPullRefresh,
  },

  onLoad() {
    this.getDeptPortrait()
  },

  methods: {
    getDeptPortrait() {
      api.getDeptPortrait({
        startTime: getDaysAgo(30),
        endTime: formatDate(Date.now()),
        deptId: '202',
      }).then(res => {
      })
    },
  },
}
</script>

<style lang='scss' scoped>

</style>

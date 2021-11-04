<template>
  <div class="p-2 flex-1 flex flex-col overflow-hidden">
    <e-panel>
      <rank-item index="1" :item="{}"></rank-item>
    </e-panel>
    <e-panel class="flex-1 mt-2 overflow-hidden">
      <div class="divide-y divide-gray">
        <rank-item v-for="(item, index) of 20" :key="index" :index="index"></rank-item>
      </div>
    </e-panel>
  </div>
</template>

<script>
import { EPanel } from '@/components'

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
  },
}
</script>

<style lang='scss' scoped>

</style>

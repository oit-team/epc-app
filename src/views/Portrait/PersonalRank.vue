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
      <div class="flex items-center py-2 text-center" vOn:click={() => this.$router.to(/* './data/personal/' + this.index */ 'Portrait')}>
        <div class="text-primary w-1/6">{this.index}</div>
        <e-img class="rounded-lg mr-2" src="lorem:50" size="50"></e-img>
        <div class="flex-1 text-sm text-left">
          <div>陈小龙，软件部门</div>
          <div>JAVA开发工程师</div>
        </div>
        <div class="w-1/6 text-xl text-warn">100</div>
      </div>
    )
  },
}

export default {
  name: 'PersonalRank',

  components: { EPanel, RankItem },
}
</script>

<style lang='scss' scoped>

</style>

<template>
  <div class="flex flex-col">
    <div v-if="!$route.meta.page" class="flex bg-white justify-center py-2 text-lg">
      <div
        v-for="(tab, index) of tabs"
        :key="tab.to"
        v-to="tab.to"
        class="mx-3"
        :class="{'text-primary': tabIndex === index}"
      >
        {{ tab.title }}
      </div>
    </div>

    <e-divider />

    <router-view class="flex-1 flex flex-col relative overflow-hidden"></router-view>
  </div>
</template>

<script>
// TODO: 用颜色区分分数

export default {
  name: 'Portrait',

  computed: {
    tabIndex() {
      return this.tabs.findIndex(item => this.$route.path === item.to)
    },
  },

  created() {
    this.tabs = [
      {
        title: '我的',
        to: '/portrait/data',
      },
      {
        title: '同事',
        to: '/portrait/personal-rank',
      },
      {
        title: '部门',
        to: '/portrait/department-rank',
      },
    ]
  },
}
</script>

<style lang='scss'>
.filter-bar {
  @apply flex items-center bg-white text-sm px-2;
  min-height: 44px;
}
</style>

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

    <div class="relative flex flex-col flex-1 overflow-hidden">
      <router-view></router-view>
    </div>
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

<style lang='scss' scoped>
</style>

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

    <router-view></router-view>
  </div>
</template>

<script>
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
        title: '个人',
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

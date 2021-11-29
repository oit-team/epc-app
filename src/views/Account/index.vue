<template>
  <div class="account">
    <header v-to="'UserInfo'" class="flex py-6 pl-4 pr-5 bg-white">
      <e-img class="rounded-lg mr-4" :src="userData.headPortrait" size="60" fit="cover"></e-img>
      <div class="flex flex-col flex-1 justify-between">
        <div class="text-lg font-bold leading-none">{{ userData.userName }}</div>
        <div class="text-sm leading-none text-gray-2">账号：{{ userData.employeeId }}</div>
        <div class="text-sm leading-none text-gray-2">职位：{{ userData.groupName === '普通员工' ? '无' : userData.groupName }}</div>
      </div>
      <e-icon class="self-center text-gray-3">arrow</e-icon>
    </header>

    <div class="m-2 rounded-lg">
      <e-cell v-to="'Setup'" class="px-3 py-4" is-link>
        <template #title>
          <e-icon class="align-middle mr-2" name="setting" size="22" color="#4b92fc"></e-icon>
          <span class="align-middle">设置</span>
        </template>
      </e-cell>
    </div>

    <router-view></router-view>

    <e-tabbar />
  </div>
</template>

<script>
import { ECell, ETabbar } from '@/components'

export default {
  name: 'Account',

  components: {
    ECell,
    ETabbar,
  },

  computed: {
    userData() {
      return this.$store.getters.userData
    },
  },
}
</script>

<style lang="scss" scoped>
</style>

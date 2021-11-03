<template>
  <div>
    <e-header title="个人信息"></e-header>

    <van-cell-group>
      <van-cell class="py-2" title="头像" clickable>
        <e-img class="rounded-lg float-right" :src="userData.headPortrait" size="50" fit="cover"></e-img>
      </van-cell>
      <van-cell class="py-3" title="姓名" :value="userData.userName"></van-cell>
      <van-cell class="py-3" title="部门" :value="userData.deptName"></van-cell>
      <van-cell class="py-3" title="性别" :value="userData.sex"></van-cell>
      <van-cell class="py-3" title="电话" :value="userData.phoneNum" is-link></van-cell>
      <van-cell class="py-3" title="入职时间" :value="userData.entryTime"></van-cell>
    </van-cell-group>
  </div>
</template>

<script>
import { Cell, CellGroup } from 'vant'

export default {
  name: 'UserInfo',

  components: {
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
  },

  computed: {
    userData() {
      return this.$store.getters.userData
    },
  },
}
</script>

<style lang='scss' scoped>
.van-cell {
  align-items: center;
}
.van-cell__title {
  font-size: 0.875rem;
}
.van-cell__value {
  color: var(--gray-3);
}
</style>

<template>
  <div>
    <e-header title="个人信息"></e-header>
    <van-cell-group>
      <van-cell class="py-2" title="头像" clickable>
        <input type="file" class="avatarFile" accept="image/*" name="image" @change="handleInputChange($event)">
        <e-img class="rounded-lg float-right photo" :src="userData.headPortrait ? userData.headPortrait : 'assets/images/userAvatar.png'" size="50" fit="cover"></e-img>
      </van-cell>
      <van-cell class="py-3" title="姓名" :value="userData.userName"></van-cell>
      <van-cell class="py-3" title="部门" :value="userData.deptName"></van-cell>
      <van-cell class="py-3" title="性别" :value="userData.sex"></van-cell>
      <van-cell class="py-3" title="电话" :value="userData.phoneNum" is-link @click="updatePhone()"></van-cell>
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
  data: () => ({
    // base64压缩头像(调接口用)
    imgStr: '',
  }),

  computed: {
    userData() {
      return this.$store.getters.userData
    },
  },

  methods: {
    // 跳转修改手机号
    updatePhone() {
      this.$router.to('UpdateUserInfo')
    },
    // 更新头像
    updateInfos() {
      const data = {
        headPortrait: this.imgStr,
        sex: this.$store.getters.userData.sex === '男' ? '0' : this.$store.getters.userData.sex === '女' ? '1' : '',
        userId: this.$store.getters.userData.userId,
        entryTime: this.$store.getters.userData.entryTime,
        employeeName: this.$store.getters.userData.userName,
      }
      const jsonParam = this.GLOBAL.g_paramJson(data)
      this.$axios.post(this.GLOBAL.systemServer + '/user/upUserInfo', jsonParam)
        .then((res) => {
          if (res.data.head.status === 0) {
            if (res.data.body.headPortrait) {
              this.$store.commit('SAVE_USER_DATA', {
                ...this.$store.getters.userData,
                headPortrait: res.data.body.headPortrait,
              })
            }
            this.$toast('修改成功')
          } else {
            this.$toast('修改失败！')
          }
        })
    },
    // 处理头像上传
    handleInputChange(e) {
      const file = e.target.files[0]
      const imgSize = file.size
      const isFlag = !!((file.type === 'image/jpeg' || file.type === 'image/png'))
      if (!isFlag) {
        this.$toast('上传图片只能是 JPG、PNG 格式!')
        return false
      }
      if (imgSize >= 800 * 1024) {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onloadend = () => {
          const dataURL = reader.result
          this.imageCompress(dataURL).then(res => {
            this.imgStr = res
            this.updateInfos()
          })
        }
      } else {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onloadend = () => {
          const dataURL = reader.result
          this.imgStr = dataURL
          this.updateInfos()
        }
      }
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
// 电话默认样式
.photo{
  position :relative;
}
// input样式, (透明 跟e-img重叠)
.avatarFile{
  display: block;
  position :absolute;
  right: 0;
  height: 50px;
  width: 50px;
  opacity: 0;
  z-index: 10000;
  filter:alpha(opacity=0); /* IE */
}
</style>

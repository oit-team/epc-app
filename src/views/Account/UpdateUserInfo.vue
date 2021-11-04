<template>
  <div id="updateUserInfo">
    <e-header class="bg-white" title="修改电话"></e-header>
    <div class="update-con">
      <input v-model="phoneNum" class="ipt" type="text" placeholder="请输入电话">
      <div class="tip">请注意电话格式哦</div>
    </div>
    <div class="conBtn" @click="updateInfo()">确认</div>
  </div>
</template>
<script>
export default {
  name: 'UpdateUserInfo',
  components: {},
  data() {
    return {
      phoneNum: '',
    }
  },
  created() {
    this.phoneNum = this.$store.getters.userData.phoneNum
  },
  methods: {
    // 确认 校验电话号码格式
    updateInfo() {
      // 校验电话号码格式
      const reg = 11 && /^((13|14|15|16|17|18|19)[0-9]{1}\d{8})$/
      const partten = /^(\d3,4|\d{3,4}-)?\d{7,8}$/
      if (this.phoneNum === '') {
        this.updateInfoRequest()
      } else if (reg.test(this.phoneNum) || partten.test(this.phoneNum)) {
        this.updateInfoRequest()
      } else {
        this.$toast('手机格式不正确！')
      }
    },
    // 调用修改电话接口
    updateInfoRequest() {
      const data = {
        userId: this.$store.getters.userData.userId,
        employeeName: this.$store.getters.userData.userName,
        phoneNum: this.phoneNum,
      }
      const jsonParam = this.GLOBAL.g_paramJson(data)
      this.$axios.post(this.GLOBAL.systemServer + '/user/upUserInfo', jsonParam).then((res) => {
        if (res.data.head.status === 0) {
          this.$toast('保存成功')
          this.$store.commit('SAVE_USER_DATA', {
            ...this.$store.getters.userData,
            phoneNum: this.phoneNum,
          })
          this.$router.go(-1)
        } else {
          this.$toast('保存失败！')
        }
      })
    },
  },

}
</script>
<style lang="less" scoped>
#updateUserInfo{
  width:100%;
  background-color: #fff;
}
.update-con{
  width:100%;
  padding:12px 12px;
  background-color: #fff;
  box-sizing: border-box;
}
.update-con .ipt{
  width:100%;
  height:50px;
  line-height: 50px;
  font-size:16px;
  padding-left:4px;
  border:none;
  border-bottom:1px solid #ccc;
}
.update-con .tip{
  margin-top:13px;
  font-size:14px;
  color:#808080;
}
.save-btn{
  width:60px;
  height:35px;
  margin:0 auto;
  line-height: 35px;
  background-color: #00A2EA;
  color:#fff;
  font-size:14px;
  text-align: center;
  margin-top:25px;
  border-radius:8px;
}
.textarea-box{
  width:100%;
  border:none;
  border-bottom:1px solid #ccc;
}
.conBtn {
    width: 90%;
    height: 40px;
    line-height: 40px;
    background-color: rgb(71, 187, 80);
    color: #fff;
    font-size: 16px;
    text-align: center;
    margin: 0 auto;
    border-radius: 12px;
    margin-top: 10px;
}
</style>

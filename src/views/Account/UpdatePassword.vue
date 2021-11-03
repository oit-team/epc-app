<template>
  <div class="main bg-gray" @touchmove.prevent>
    <e-header title="修改密码"></e-Header>
    <div class="page">
      <ul>
        <li>
          <input v-model="oldPassword" type="password" placeholder="输入旧密码">
        </li>
        <li>
          <input v-model="password" type="password" placeholder="输入新密码">
        </li>
        <li>
          <input v-model="realPassword" type="password" placeholder="确认新密码">
        </li>
      </ul>
    </div>
    <div class="conBtn" @click="change">确认</div>
  </div>
</template>

<script>
import crypto from '@/utils/crypto'
export default {
  name: 'UpdatePassword',
  data() {
    return {
      oldPassword: '',
      password: '',
      realPassword: '',
    }
  },
  mounted() {

  },
  methods: {
    back() {
      this.oldPassword = ''
      this.password = ''
      this.realPassword = ''
      this.$router.go(-1)
    },
    change() {
      const _this = this
      if (_this.password === '' || _this.realPassword === '') {
        this.$toast('密码不能为空!')
        return false
      }
      if (_this.password !== _this.realPassword) {
        this.$toast('两次密码不一致!')
        return false
      }
      const oldPwd = crypto.encrypt(this.oldPassword)
      const realPwd = crypto.encrypt(this.realPassword)
      const param = {
        oldPassWord: oldPwd,
        newPassWord: realPwd,
      }
      const jsonParam = this.GLOBAL.g_paramJson(param)
      // api update
      _this.$axios.post(this.GLOBAL.systemServer + '/user/updatePassWord', jsonParam)
        .then(function(res) {
          const data = res.data
          if (data.head.status === 0) {
            this.$toast('修改成功')
            _this.$router.replace({
              path: '/login',
            })
          } else {
            this.$toast('修改失败')
          }
        })
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
.main {
    display: flex;
    flex-direction: column;
    color: #333333;
    font-family: PingFang-SC-Medium;
    font-size: 15px;
}

.header {
    height: 1.2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 18px;
}

.header div {
    padding-left: 0.4rem;
    padding-right: 0.4rem;
    height: 1rem;
    display: flex;
    align-items: center;
}

.header .right {
    font-size: 14px;
    padding-right: 0.4rem;
}

.header img {
    height: 0.4rem;
}

.page {
    /* border-top:0.5px solid #ccc;  */
}

.page ul {
    background-color: #FFFFFF;
    display: flex;
    flex-direction: column;
    padding: 0 15px;
    width: 100%;
    margin: 10px auto;
    border-radius: 12px;
    box-sizing: border-box;
}

.page ul li {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    height: 50px;
    border-bottom: 0.5px solid #f3f3f3;
}

.page ul li span {
    margin-right: 55px;
}

.page ul li input {
    flex: 1;
    background: transparent;
    border: 0;
    outline: none;
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

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
    change() {
      if (this.password === '' || this.realPassword === '') {
        this.$toast('密码不能为空!')
        return false
      }
      if (this.password !== this.realPassword) {
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
      this.$axios.post(this.GLOBAL.systemServer + '/user/updatePassWord', jsonParam)
        .then((res) => {
          const data = res.data
          if (data.head.status === 0) {
            this.$toast('修改成功')
            this.$store.dispatch('logOut')
            this.$router.replace({
              name: 'Login',
            })
          } else {
            this.$toast('修改失败')
          }
        })
    },
  },
}
</script>

<style scoped>
.main {
    display: flex;
    flex-direction: column;
    color: #333333;
    font-family: PingFang-SC-Medium;
    font-size: 15px;
    background-color: var(--white);
}
/* .page{

} */
.page ul {
    background-color: #FFFFFF;
    display: flex;
    flex-direction: column;
    padding: 0 15px;
    width: 100%;
    margin: 10px auto;
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

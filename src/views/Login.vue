<template>
  <v-promised
    :promise="promise.checkLogin"
    pending-tips="正在验证数据"
    once
    only-pending
  >
    <div class="flex-center text-center px-10">
      <div>
        <div class="mb-8">
          <e-img src="assets/images/logo.png" size="90"></e-img>
          <div class="text-xl font-bold text-gray-3">欢迎来到EPC</div>
        </div>
        <form @submit.prevent>
          <div class="field">
            <e-icon class="text-gray-1" size="18">user</e-icon>
            <input v-model.trim="form.username" type="text" placeholder="账号">
            <e-icon
              v-if="form.username.length > 0"
              class="text-gray-1"
              size="14"
              @click="form.username = ''"
              @mousedown.prevent
            >
              circle-xmark
            </e-icon>
          </div>
          <div class="field">
            <e-icon class="text-gray-1" size="18">lock-keyhole</e-icon>
            <input v-model.trim="form.password" type="password" placeholder="密码">
            <e-icon
              v-if="form.password.length > 0"
              class="text-gray-1"
              size="14"
              @click="form.password = ''"
              @mousedown.prevent
            >
              circle-xmark
            </e-icon>
          </div>
          <e-btn class="mt-10" type="primary" block @click="login()">登录</e-btn>
        </form>
      </div>
    </div>
  </v-promised>
</template>

<script>
import crypto from '@/utils/crypto'
import * as api from '@/api/user'
import iframe from '@/utils/iframe'
import router from '@/router'

export default {
  name: 'Login',

  data: () => ({
    showLoading: false,
    form: {
      username: '',
      password: '',
    },

    promise: {
      checkLogin: null,
    },
  }),

  created() {
    this.checkLogin()
  },

  methods: {
    login() {
      if (this.form.username === '') return this.$toast('账号不能为空')
      if (this.form.password === '') return this.$toast('密码不能为空')

      // AES加密后的密码
      const encryptedPwd = crypto.encrypt(this.form.password)

      this.$toast.loading('正在登录')
      api.loginAccount({
        employeeId: this.form.username,
        passWord: encryptedPwd,
      })
        .then(res => {
          this.$store.commit('SAVE_USER_DATA', {
            ...res.body.result,
            accessToken: res.body.accessToken,
          })
          iframe.loginSuccess(this.$store.getters.userData)

          this.$router.to('/portrait')
          this.$toast.success('登录成功')
        })
        .catch(err => {
          this.$toast.fail(err.head.msg)
        })
    },
    checkLogin() {
      this.promise.checkLogin = new Promise((resolve, reject) => {
        this.$store.dispatch('checkLogin', false)
          .then(() => {
            router.replace('/portrait').then(resolve)
          })
          .catch(() => {
            reject({
              isEmpty: false,
            })
          })
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.field {
  @apply flex items-center px-2 mt-2;
  width: 240px;
  height: 45px;
  background-color: #e1e1e1;

  input {
    @apply ml-2 flex-1;
    background-color: inherit;
  }
}
</style>

<template>
  <div class="flex-center text-center px-10">
    <div class="flex-1">
      <div class="mb-8">
        <e-img src="images/logo.png" size="90"></e-img>
        <div class="text-xl font-bold text-gray-2">欢迎来到EPC</div>
      </div>
      <form>
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
</template>

<script>
import crypto from '@/utils/crypto'
import * as api from '@/api/user'
import storage from '@/utils/storage'

export default {
  name: 'Login',

  data: () => ({
    form: {
      username: '',
      password: '',
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
      }).then(res => {
        storage.setItem('accessToken', res.body.accessToken)
        storage.setItem('userData', res.body.result)
        this.$toast.success('登录成功')
      }).catch(err => {
        this.$toast.fail(err.head.msg)
      })
    },
    checkLogin() {
      const userData = storage.getItem('userData')

      if (!userData) return

      api.selUserByID({
        id: userData.userId,
        orgId: userData.orgId,
        status: 0,
      }).then(res => {
        console.log(res)
      })
    },
  },
}
</script>

<style lang='scss' scoped>
.field {
  @apply flex items-center px-2 mt-2;
  height: 45px;
  background-color: #e1e1e1;

  input {
    @apply ml-2 flex-1;
    background-color: inherit;
  }
}
</style>

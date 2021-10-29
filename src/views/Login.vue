<template>
  <div class="flex-center text-center px-10">
    <div class="flex-1">
      <div class="mb-8">
        <e-img src="images/logo.png" size="90"></e-img>
        <div class="text-xl font-bold text-gray-2">欢迎来到EPC</div>
      </div>
      <form>
        <div class="field">
          <e-icon class="text-gray-1" size="20">user</e-icon>
          <input v-model.trim="form.username" type="text" placeholder="账号">
        </div>
        <div class="field">
          <e-icon class="text-gray-1" size="20">lock-keyhole</e-icon>
          <input v-model.trim="form.password" type="password" placeholder="密码">
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

  methods: {
    login() {
      if (this.form.username === '') return this.$toast('账号不能为空')
      if (this.form.password === '') return this.$toast('密码不能为空')

      const encryptedPwd = crypto.encrypt(this.form.password)
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
  },
}
</script>

<style lang='scss' scoped>
.field {
  @apply flex items-center px-2 mt-2;
  height: 45px;
  background-color: #e1e1e1;

  input {
    @apply ml-2;
    background-color: inherit;
  }
}
</style>

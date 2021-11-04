<template>
  <div class="setupMainPage" @touchmove.prevent>
    <e-header title="设置"></e-header>
    <div class="page select-none">
      <ul>
        <li @click="toSecret">
          <span class="item-tit">修改密码</span>
          <e-icon name="arrow" />
        </li>
        <li @click="toAbout">
          <span class="item-tit">关于我们</span>
          <e-icon name="arrow" />
        </li>
        <li @click="toFeedback">
          <span class="item-tit">意见反馈</span>
          <e-icon name="arrow" />
        </li>
        <li>
          <span class="item-tit">版&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;本</span>
          <div>1.0.0</div>
        </li>
        <li class="quit" @click="exit">
          <span>退出登录</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Setup',
  methods: {
    toSecret() {
      this.$router.to('UpdatePassword')
    },
    toAbout() {
      this.$router.to('About')
    },
    toFeedback() {
      this.$router.to('Feedback')
    },
    exit() {
      this.$dialog.confirm('确定退出当前账号?').then(() => {
        localStorage.clear()
        sessionStorage.clear()

        this.$router.replace('/login')
      })
    },
  },
}
</script>

<style lang="less" scoped>
.setupMainPage {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    color: #333333;
    font-family: PingFang-SC-Medium;
    font-size: 15px;
    background-color: #f5f5f5;
}

.page ul {
    display: flex;
    flex-direction: column;

    li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 55px;
        border-bottom: 0.5px solid #f3f3f3;
        background-color: #fff;
        padding: 0px 12px;

        .item-tit {
            margin-right: auto;
            margin-left: 5px;
        }

        img {
            height: 10.5px;
            width: 5.5px;
            margin-left: 0.1rem;
        }
    }

    li.changeAmount,
    li.quit {
        margin-top: 10px;
        justify-content: center;
    }
}

.select-none {
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
}
</style>

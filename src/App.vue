<template>
  <div id="app">
    <transition :name="transitionName">
      <keep-alive :include="keepAlive.toString()">
        <router-view class="router-view"></router-view>
      </keep-alive>
    </transition>
  </div>
</template>

<script>
import { isIos } from '@/utils/helper'

export default {
  data: () => ({
    transitionName: '',
  }),

  watch: {
    $route: function(to, form) {
      // 是否是前往主页
      const toHome = this.tabBars.includes(to.name)
      // 是否来自主页
      const formHome = this.tabBars.includes(form.name)

      const routeIndex = this.routeHistory.indexOf(to.name)
      // 是否是返回
      let isBack = false

      if (~routeIndex) {
        // 移除之后的记录
        this.routeHistory.splice(routeIndex + 1)
        isBack = true
      } else if (!toHome) {
        // 添加记录
        this.routeHistory.push(to.name)
      } else {
        // 清空记录
        this.routeHistory = []
      }

      // 如果是主页之间跳转或者是内部路由则无动画
      if ((toHome && formHome) || to.meta.internal) {
        this.transitionName = ''
      } else {
        // 进入路由的动画
        const enterRouteTransition = to.meta.transition && to.meta.transition.enter
        // 退出路由的动画
        const leaveRouteTransition = form.meta.transition && form.meta.transition.leave

        if (toHome) {
          this.switchTransition(leaveRouteTransition, 'pop-route')
        } else {
          this.switchTransition(enterRouteTransition, isBack ? 'pop-route' : 'push-route')
        }
      }
    },
  },

  created() {
    this.routeHistory = []
    this.tabBars = ['PortraitData', 'PersonalRank', 'DepartmentRank', 'Work', 'Account']
    this.keepAlive = ['Portrait', 'Work', 'Account']

    if (isIos) {
      let timer = null
      document.body.addEventListener('focusin', () => {
        clearTimeout(timer)
      })
      document.body.addEventListener('focusout', () => {
        timer = setTimeout(() => {
          document.body.scrollIntoView({ behavior: 'smooth' })
        }, 10)
      })
    }
  },

  methods: {
    switchTransition(transition, defaultTransition) {
      if (transition !== undefined) {
        if (typeof transition === 'boolean') {
          this.transitionName = transition ? defaultTransition : ''
        } else {
          this.transitionName = transition
        }
      } else {
        this.transitionName = defaultTransition
      }
    },
  },
}
</script>

<style lang="scss">
#app {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow: auto;
}

.router-view {
  @apply absolute inset-0;
  height: 100%;
  width: 100%;
  background: var(--gray);
  will-change: transform;
  overflow-y: auto;
}
</style>

<template>
  <div id="app">
    <template v-if="$route.meta.keepAlive">
      <!--永久缓存的页面-->
      <keep-alive>
        <router-view v-if="alwaysAlive" :key="$route.fullPath" class="router-view always" />
      </keep-alive>
      <!--缓存页面-->
      <keep-alive :max="10">
        <router-view v-if="!alwaysAlive" :key="$route.fullPath" class="router-view"></router-view>
      </keep-alive>
    </template>
    <router-view v-else class="router-view"></router-view>

    <e-tabbar ref="tabbar"></e-tabbar>
  </div>
</template>

<script>
import { ETabbar } from '@/components'

export default {
  components: {
    ETabbar,
  },

  data: () => ({
  }),

  computed: {
    alwaysAlive() {
      return ['/portrait/data', '/portrait/personal-rank', '/portrait/department-rank', '/work', '/account']
        .includes(this.$route.fullPath)
    },
  },

  created() {
  },

  methods: {
  },
}
</script>

<style lang="scss">
  #app {
    display: flex;
    flex-direction: column;
    height: 100vh;
    width: 100vw;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow: hidden;
  }

  .router-view {
    flex: 1;
    width: 100%;
    background: var(--gray);
    overflow: auto;
  }
</style>

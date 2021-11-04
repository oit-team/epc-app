<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="alwaysAlive" :key="$route.fullPath" class="router-view" />
    </keep-alive>
    <!-- <router-view v-if="!$route.meta.keepAlive" :key="$route.fullPath" class="router-view"></router-view> -->
    <keep-alive max="10">
      <router-view v-if="!alwaysAlive" :key="$route.fullPath" class="router-view"></router-view>
    </keep-alive>

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
      return ['/portrait/data', '/portrait/personal-rank', '/portrait/department-rank', '/home', '/account']
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
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: rgba(0, 0, 0, .87);
    overflow: hidden;
    user-select: none;
  }

  .router-view {
    flex: 1;
    width: 100%;
    background: var(--gray);
    overflow: auto;
  }
</style>

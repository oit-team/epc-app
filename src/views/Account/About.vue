<template>
  <div class="bg-white flex flex-col">
    <e-header title="关于我们"></e-header>

    <div class="flex-1 overflow-hidden">
      <e-img src="assets/images/about.png" size="100%" fit="contain"></e-img>
    </div>

    <footer class="text-center text-sm py-2">
      <div>
        <router-link class="text-link underline" :to="{name: 'ServiceAggrement'}">用户协议</router-link>
        <span class="mx-1">|</span>
        <router-link class="text-link underline" :to="{name: 'PrivacyPolicy'}">隐私协议</router-link>
      </div>
      <div>Copyright @2021 奥意特信息科技 版权所有</div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'About',
  methods: {

  },
}
</script>

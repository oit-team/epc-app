import '@/utils/storage'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 暂未用到vuex，预留在此
// import store from './store'

import './plugins/Vant'
import './components'
import '@/assets/icons'
import theme from './theme'

import 'tailwindcss/tailwind.css'
import './styles/index.scss'

Object.entries(theme).forEach(([name, value]) => {
  const html = document.querySelector('html')
  html.style.setProperty(`--${name}`, value)
})

Vue.config.productionTip = false

new Vue({
  router,
  // store,
  render: h => h(App),
}).$mount('#app')

import '@/utils/storage'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import './plugins'
import './components'
import './directives'
import './mixins'
import '@/assets/icons'
import theme from './theme'
// import eruda from 'eruda'

import 'tailwindcss/tailwind.css'
import './styles/index.scss'

import './compatible'

// 保存主题到css变量
Object.entries(theme).forEach(([name, value]) => {
  document.querySelector('html').style.setProperty(`--${ name }`, value)
})

// eruda.init()

Vue.config.productionTip = false

export default new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')

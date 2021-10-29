import Vue from 'vue'
import to from './to'

const directives = {
  to,
}

Object.keys(directives).forEach(key => {
  Vue.directive(key, directives[key])
})

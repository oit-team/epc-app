import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/Home/index'),
  },
  {
    path: '/star/rank',
    name: 'StarRank',
    component: () => import('@/views/Home/StarRank'),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login'),
  },
]

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}

/**
 * 封装跳转
 * @param {string} target 跳转目标
 * @param {object} params 跳转参数配置
 * @param {boolean} query 是否将参数拼接到url上
 */
 VueRouter.prototype.to = function(target, params = {}, query = false) {
  if (typeof target !== 'string') throw new TypeError('target 必须是 string 类型')

  const isPath = /\//.test(target)
  return this.push({
    [isPath ? 'path' : 'name']: target,
    [query ? 'query' : 'params']: params,
  })
}

const router = new VueRouter({
  routes,
})

export default router

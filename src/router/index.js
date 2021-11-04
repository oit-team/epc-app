import Vue from 'vue'
import VueRouter from 'vue-router'
import { kebabCase } from 'lodash'

Vue.use(VueRouter)

const Login = () => import('@/views/Login')
const Home = () => import('@/views/Home')
const Warn = () => import('@/views/Home/Warn')
const WarnUserList = () => import('@/views/Home/WarnUserList')
const WarnListDetail = () => import('@/views/Home/WarnListDetail')
const StarRank = () => import('@/views/Home/StarRank')

const Account = () => import('@/views/Account')
const Setup = () => import('@/views/Account/Setup')
const UpdatePassword = () => import('@/views/Account/UpdatePassword')
const About = () => import('@/views/Account/About')
const PrivacyPolicy = () => import('@/views/Account/PrivacyPolicy')
const ServiceAggrement = () => import('@/views/Account/ServiceAggrement')
const Feedback = () => import('@/views/Account/Feedback')
const UserInfo = () => import('@/views/Account/UserInfo')
const UpdateUserInfo = () => import('@/views/Account/UpdateUserInfo')
const SiriResult = () => import('@/views/Siri/SiriResult')

const Portrait = () => import('@/views/Portrait')
const PortraitData = () => import('@/views/Portrait/PortraitData')
const PersonalRank = () => import('@/views/Portrait/PersonalRank')
const DepartmentRank = () => import('@/views/Portrait/DepartmentRank')

const routes = [
  {
    path: '/',
    redirect: '/home',
  },
  Home,
  Login,
  Account,
  Setup,
  StarRank,
  UpdatePassword,
  About,
  Feedback,
  Warn,
  WarnListDetail,
  WarnUserList,
  UserInfo,
  UpdateUserInfo,
  SiriResult,
  PrivacyPolicy,
  ServiceAggrement,
  {
    component: Portrait,
    children: [
      {
        path: '',
        redirect: './data',
      },
      {
        path: 'data',
        component: PortraitData,
      },
      {
        path: 'data/personal/:id',
        component: PortraitData,
        meta: {
          personal: true,
          page: true,
        },
      },
      {
        path: 'data/dept/:id',
        component: PortraitData,
        meta: {
          dept: true,
          page: true,
        },
      },
      {
        path: 'personal-rank',
        name: 'PersonalRank',
        component: PersonalRank,
      },
      {
        path: 'department-rank',
        name: 'DepartmentRank',
        component: DepartmentRank,
      },
    ],
  },
]

/**
 * 配置路由，每个组件必须提供name值，且不能重复
 * @param {Array} routes 路由数组
 * @param {boolean} child 是否是子路由
 * @returns {Array} 路由表
 */
const configureRoutes = (routes, child = false) => routes.map(item => {
  if (typeof item === 'function') {
    return {
      path: '/' + kebabCase(item.name),
      name: item.name,
      component: item,
      meta: {
        keepAlive: true,
      },
    }
  } else if (typeof item === 'object') {
    if (item.redirect) return item
    const hasChild = item.children !== undefined

    const route = {
      ...item,
      meta: {
        keepAlive: true,
        ...item.meta,
      },
    }

    if (!child) {
      route.path = item.path ?? '/' + kebabCase(item.component.name)
      route.name = hasChild ? '' : item.name ?? item.component.name
    }

    if (hasChild) {
      route.children = configureRoutes(route.children, true)
    }

    return route
  }
})

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
  routes: configureRoutes(routes),
})

export default router

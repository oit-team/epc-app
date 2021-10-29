import router from '@/router'
import { isEmpty } from 'lodash'

const toRoute = (binding) => {
  try {
    let way, target

    if (!isEmpty(binding.modifiers)) {
      if (Object.keys(binding.modifiers).length > 1) return console.error('[v-to] modifiers 只能存在一个');
      [way, target] = Object.keys(binding.modifiers)[0].split(':')
    }

    target = target || binding.arg || binding.value
    way = way || 'push'

    if (typeof target === 'string') {
      // 验证是否是相对路径跳转
      const to = /\//.test(target)
                 ? target
                 : { name: target }
      router[way](to)
    } else {
      router[way](target)
    }
  } catch (e) {
    console.error(e)
  }
}

/**
 * 跳转页面指令
 */
export default {
  bind(el, binding) {
    el.onclick = () => toRoute(binding)
  },
  update(el, binding) {
    el.onclick = () => toRoute(binding)
  },
}

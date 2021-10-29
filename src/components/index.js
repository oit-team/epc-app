import Vue from 'vue'

import EBtn from './EBtn'
import ECharts from './ECharts'
import EHeader from './EHeader'
import EIcon from './EIcon'
import EImg from './EImg'
import { EItemGroup, EItem } from './EItemGroup'
import { ETabs, ETab } from './ETabs'
import ELoading from './ELoading'
import EPicker from './EPicker'
import EPromise from './EPromise'
import EEmpty from './EEmpty'

// 需要全局注册的组件，使用频繁的组件可以放在这里
const commonComponents = [
  EImg,
  EBtn,
  EHeader,
  EIcon,
]

// 全局注册组件
commonComponents.forEach(component => Vue.component(component.name, component))

export {
  EBtn,
  ECharts,
  EHeader,
  EIcon,
  EImg,
  EItemGroup,
  EItem,
  ETabs,
  ETab,
  ELoading,
  EPicker,
  EPromise,
  EEmpty,
}

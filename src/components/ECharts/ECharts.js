// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from 'echarts'

// import { LabelLayout } from 'echarts/features'
// // 渲染方式
// import { CanvasRenderer } from 'echarts/renderers'

import { convertToUnit } from '@/utils/helper'
import { upperFirst } from 'lodash'

let echartsComponents = []
let echartsTypes = []

export default {
  name: 'ECharts',

  props: {
    width: {
      type: [String, Number],
      default: '100%',
    },
    height: {
      type: [String, Number],
      default: '100%',
    },
    option: [Object],
  },

  data: () => ({
  }),

  watch: {
    option: {
      async handler(newOption, oldOption) {
        this.setOption(this.option)
      },
      deep: true,
    },
  },

  computed: {
    chartSize() {
      return {
        width: convertToUnit(this.width),
        height: convertToUnit(this.height),
      }
    },
  },

  async mounted() {
    this.chart = null
    await this.init()
    this.setOption()
  },

  methods: {
    /**
     * 初始化
     */
    async init() {
      // const components = await this.getChartComponents()
      // const chartTypes = await this.getChartTypes()

      // echarts.use([
      //   ...components,
      //   ...chartTypes,
      //   CanvasRenderer,
      //   LabelLayout,
      // ])

      this.chart ??= echarts.init(this.$refs.chart)
    },
    /**
     * 更新配置
     */
    setOption() {
      this.$nextTick(() => {
        console.debug('[echarts] 配置改变 ==> ', this.option)
        this.chart.setOption(this.option, true)
          // this.chart.resize()
      })
    },
    /**
     * 根据配置获取需要加载的组件
     * @returns 组件合集
     */
    async getChartComponents(option) {
      if (!echartsComponents.length)
        echartsComponents = await import('echarts/components')

      const components = new Set()
      option ??= this.option

      Object.keys(option).forEach(item => {
        let componentName
        const matchNames = {
          '^.Axis$': 'GridComponent',
        }

        componentName = `${ upperFirst(item) }Component`

        if (echartsComponents[componentName]) {
          components.add(echartsComponents[componentName])
        } else {
          for (const [rule, name] of Object.entries(matchNames)) {
            componentName = item.match(rule) && name
          }
          echartsComponents[componentName] && components.add(echartsComponents[componentName])
        }
      })

      return [...components]
    },
    /**
     * 根据option.series数组中的类型自动获取图表类型组件
     * @returns {} 图表类型组件
     */
    async getChartTypes() {
      if (!echartsTypes.length)
        echartsTypes = await import('echarts/charts')

      const chartTypes = []
      this.option.series.forEach(item => {
        const chartName = `${ upperFirst(item.type) }Chart`
        !chartTypes.includes(echartsTypes[chartName])
          && echartsTypes[chartName]
          && chartTypes.push(echartsTypes[chartName])
      })

      return chartTypes
    },
    async detectModuleChanges(newOption, oldOption) {
      const keyStr = opt => {
        return opt && Object.keys(opt)
          .sort()
          .toString()
      }

      // 比较对象属性是否变动
      if (keyStr(newOption) !== keyStr(oldOption)) {
        const newModules = await this.getChartComponents(newOption)
        const oldModules = await this.getChartComponents(oldOption)

        // 检测是否有新的模块
        const addedModule = newModules.filter(module => {
          return !oldModules.includes(module)
        })

        echarts.use([...addedModule])
      }
    },
  },

  render(h) {
    return h('div', {
      ref: 'chart',
      class: 'e-charts',
      style: {
        ...this.chartSize,
      },
    })
  },
}

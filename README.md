# EPC-APP

## 项目指令
```bash
# 安装项目
yarn
# 启动项目
yarn serve
# 构建项目
yarn build
# 修复eslint错误
yarn lint-fix
```

## 项目结构
- public - 公共静态资源
  - images - 图片资源
- scripts - 公共脚本
  - clean - 清理打包的压缩文件
- src
  - api - 后台接口相关
  - assets - 资源
  - components - 组件
    - ...多数是二次封装vant
    - EPanel - 面板
    - ECharts - 图表
    - EItemGroup - 项目组
  - directives - 公共指令
    - to.js - 跳转路由指令
  - mixins - vue混入
    - lifecycle.js - 实现生命周期 
  - router - 页面路由
  - store - vuex
  - styles - 公共样式文件
    - _mixins.scss - 实用混入
    - _reset.scss - 重置全局样式
    - _transition.scss - 过渡效果
    - _utils.scss - 实用样式
  - utils - JS工具库
    - iframe - 原生调用封装
    - crypto.js - 实用库
    - storage - localStorage 封装
  - views - 页面
- babel.config.js - babel 配置
- .eslintrc.js - eslint 配置
- vue.config.js - vue 配置
- vant.config.js - vant 配置
- tailwind.config.js - tailwindcss 配置

## 项目依赖
- [vant]- https://youzan.github.io/vant - UI库
- [tailwindcss]- https://www.tailwindcss.cn - CSS原子类框架
- [lodash]- https://lodash.com - JavaScript工具库

## TODO

- [x] 优化项目目录结构
- [x] 使用yarn管理资源
- [x] 封装api，并对接口请求进行统一管理
- [x] 接口请求错误处理
- [x] 加入eslint进行代码风格管控
- [x] 升级到vue-cli 4+
- [x] 移除无用文件或代码
- [x] 封装路由配置
- [x] 引入字体图标库
- [x] 路由过渡效果

# EPC-APP

## 项目指令
```bash
# 安装项目
yarn

# 启动项目
yarn serve

# 构建项目
yarn build

# 运行eslint检测
yarn lint

# 修复eslint错误
yarn lint:fix

# 启动文档
yarn docs:dev

# 构建文档
yarn docs:build
```

## 项目结构
- public - 公共静态资源
  - images - 图片资源
- src
  - api - 后台接口相关
  - assets - 资源
  - components - 组件 
  - directives - 指令
  - mixins - vue混入
  - plugins - 插件
  - router - 页面路由
  - store - vuex
  - styles - 样式文件
  - utils - JS工具库
  - views - 页面
- .eslintrc.js - eslint配置
- babel.config.js - babel配置
- tailwind.config.js - tailwindcss框架配置
- vant.config.js - vant配置
- vue.config.js - vue配置

## 项目依赖
- [vant](https://youzan.github.io/vant) - UI库
- [tailwindcss](https://www.tailwindcss.cn) - CSS原子类框架
- [lodash](https://lodash.com) - JavaScript工具库
- [echarts](https://echarts.apache.org) - 图表框架
- [crypto-js](https://www.npmjs.com/package/crypto-js) - 加密库

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

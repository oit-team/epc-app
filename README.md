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
- public (公共静态资源)
  - images (图片资源)
- src
  - api (后台接口相关)
  - assets (资源)
  - components (组件)
  - mixins (vue混入)
  - router (页面路由)
  - store (vuex)
  - styles (样式文件)
  - utils (JS工具库)
  - views (页面)
- .eslintrc.js (eslint配置)
- vue.config.js (vue配置)

## 项目依赖
- [vant](https://youzan.github.io/vant) - UI库
- [tailwindcss](https://www.tailwindcss.cn) - CSS原子类框架
- [lodash](https://lodash.com/) - JavaScript工具库

## TODO

- [x] 优化项目目录结构
- [x] 使用yarn管理资源
- [x] 封装api，并对接口请求进行统一管理
- [ ] 接口请求错误处理
- [x] 加入eslint进行代码风格管控
- [x] 升级到vue-cli 4+
- [x] 移除无用文件或代码
- [ ] 封装路由配置
- [x] 引入字体图标库

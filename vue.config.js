// https://www.tailwindcss.cn
const tailwindcss = require('tailwindcss')
// https://github.com/evrone/postcss-px-to-viewport/blob/HEAD/README_CN.md
const pxtoviewport = require('postcss-px-to-viewport')
const path = require('path')
const modifyVars = require('./vant.config')
const production = process.env.NODE_ENV === 'production'

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  publicPath: './',
  devServer: {
    port: 9000,
    // 后端API地址
    proxy: 'http://ox98jgp.nat.ipyingshe.com:42729/zxl/',
  },
  productionSourceMap: !production,
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          tailwindcss,
          pxtoviewport({
            viewportWidth: 375, // UI设计稿的宽度
          }),
        ],
      },
      less: {
        modifyVars,
      },
    },
  },
  chainWebpack: config => {
    config.module
      .rule('svg')
      .exclude.add(resolve('src/assets/icons/svg'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/assets/icons/svg'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]',
      })
      .end()
      .before('svg-sprite-loader')
      .use('svgo-loader')
      .loader('svgo-loader')
      .end()

    /* 添加分析工具 */
    if (production) {
      config
        .plugin('webpack-bundle-analyzer')
        .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
        .end()
      config.plugins.delete('prefetch')
    }
  },
}

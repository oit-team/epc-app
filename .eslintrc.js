const production = process.env.NODE_ENV === 'production'

module.exports = {
  root: true,

  env: {
    node: true,
  },

  extends: [
    'plugin:vue/recommended',
    '@vue/standard',
  ],

  parserOptions: {
    parser: '@babel/eslint-parser',
  },

  rules: {
    // 使用console时警告
    'no-console': ['warn', { allow: ['debug', 'error', 'warn'] }],
    'no-debugger': production ? 'error' : 'off',
    // 强制使用===
    eqeqeq: ['error', 'always'],
    // 函数后面紧贴括号
    'space-before-function-paren': ['error', 'never'],
    // 关闭默认缩进验证
    indent: 'off',
    // 追加逗号
    'comma-dangle': ['error', {
      arrays: 'always-multiline',
      objects: 'always-multiline',
      imports: 'always-multiline',
      exports: 'always-multiline',
      functions: 'always-multiline',
    }],
    // 不强制if，else，for，while，或do添加大括号
    curly: 'off',
    // 强制操作符使用一致的换行符风格
    'operator-linebreak': ['error', 'before'],
    /* -------------以下为vue相关验证[https://eslint.vuejs.org/rules]------------- */
    // 缩进规则
    'vue/script-indent': ['error', 2, { baseIndent: 0, switchCase: 1 }],
    // 闭合标签
    'vue/html-self-closing': 'off',
    // html属性超过5个时换行
    'vue/max-attributes-per-line': ['error', { singleline: { max: 5 } }],
    // 不强制在组件参数里设置默认值
    'vue/require-default-prop': 'off',
    // 不强制在单行元素的内容前后换行
    'vue/singleline-html-element-content-newline': 'off',
  },
}

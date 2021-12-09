module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset',
    '@vue/babel-preset-jsx',
  ],
  plugins: [
    ['import', {
      libraryName: 'vant',
      libraryDirectory: 'es',
      style: (name) => `${ name }/style/less`,
    }, 'vant'],
    '@babel/plugin-proposal-optional-chaining',
  ],
}

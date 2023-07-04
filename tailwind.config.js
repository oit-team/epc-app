const colors = require('./src/theme')

const spacing = (() => {
  const spacers = {}
  const spacer = 5
  for (let i = 0, l = 20; i <= l; i++) {
    spacers[i] = `${ i * spacer }px`
  }
  return spacers
})()

module.exports = {
  important: '#app',
  purge: [
    './src/**/*.{vue,js,scss}',
  ],
  darkMode: false,
  theme: {
    colors,
    zIndex: {
      0: 0,
      10: 10,
      20: 20,
      30: 30,
      40: 40,
      50: 50, // 基准
      60: 60,
      70: 70,
      80: 80,
      90: 90,
      100: 100,
      auto: 'auto',
    },
    extend: {
      spacing: {
        ...spacing,
        auto: 'auto',
      },
      fontSize: {
      },
      borderRadius: {
        circle: '50%',
      },
    },
  },
  corePlugins: {
    fill: false,
    stroke: false,
    strokeWidth: false,
    accessibility: false,
    resize: false,
    pointerEvents: false,
    outline: false,
    appearance: false,
    skew: false,
    ringOffsetColor: false,
    ringOffsetWidth: false,
    ringOpacity: false,
    ringColor: false,
    ringWidth: false,
    gradientColorStops: false,
    backgroundImage: false,
    backgroundSize: false,
    backgroundRepeat: false,
    backgroundPosition: false,
    backgroundClip: false,
    backgroundAttachment: false,
    textTransform: false,
    listStylePosition: false,
    listStyleType: false,
    fontVariantNumeric: false,
    fontSmoothing: false,
    fontFamily: false,
    objectPosition: false,
    objectFit: false,
  },
  plugins: [],
}

import './EPanel.scss'

export default {
  name: 'EPanel',

  props: {
    title: String,
    titleClass: [String],
    contentClass: [String],
  },

  methods: {
    genPanelTitle() {
      const title = this.$slots.title ?? this.title

      if (title) {
        return [
          this.$createElement('div', {
            class: ['e-panel-title', this.titleClass],
          }, this.$slots.title ?? this.title),
          this.$createElement('e-divider'),
        ]
      } else return []
    },
    genPanelContent() {
      return this.$createElement('div', {
        class: ['e-panel-content', this.contentClass],
      }, this.$slots.default)
    },
  },

  render(h) {
    return h('section', {
      class: 'e-panel',
    }, [
      ...this.genPanelTitle(),
      this.genPanelContent(),
    ])
  },
}

import { Calendar } from 'vant'
import theme from '@/theme'

export default {
  name: 'ECalendar',

  mixins: [Calendar],

  props: {
    color: {
      default: theme.primary,
    },
  },
}

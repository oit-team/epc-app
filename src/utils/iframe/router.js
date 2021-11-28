import util from '@/utils/iframe/util'

export default {
  /**
   * 跳转到语音助手
   */
  switchToSiri() {
    util.postMessage('switchToSiri')
  },
}

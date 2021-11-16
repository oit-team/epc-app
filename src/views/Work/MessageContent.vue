<template>
  <div class="bg-white">
    <e-header title="详情"></e-header>

    <div class="p-2">
      <p class="mb-2 text-sm text-secondary">
        <span>{{ info.publisherName }}</span>
        <span class="ml-2">{{ info.msgTime }}</span>
      </p>
      <p class="whitespace-pre-wrap">{{ info.msgContent }}</p>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import * as api from '@/api/work'

// 未读
const UNREAD = 0
// 已读
const READ = 1

export default {
  name: 'MessageContent',

  data: () => ({
    info: {},
  }),

  onLoad() {
    this.info = this.$route.params.item

    if (this.info.state === UNREAD) {
      api.updateMsgState(this.info.msgId).then(res => {
        this.$set(this.info, 'state', READ)
      })
    }
  },
}
</script>

<style scoped>

</style>

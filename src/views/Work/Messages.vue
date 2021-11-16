<template>
  <div class="flex flex-col">
    <e-header title="消息通知"></e-header>
    <e-tabs v-if="tabs.length > 0" v-model="type">
      <e-tab
        v-for="tab of tabs"
        :key="tab.msgTypeValue"
        :title="tab.msgTypeName
          + `${tab.count ? `(${tab.count})` : ''}`"
        :name="tab.msgTypeValue"
      ></e-tab>
    </e-tabs>

    <e-infinite-loading
      ref="infinite-loading"
      class="bg-gray p-2 relative flex-1 overflow-auto"
      pager
      @load="loadMore"
    >
      <template v-if="msgMapList[type]">
        <section
          v-for="item of msgMapList[type].resultList"
          :key="item.msgId"
          v-to="{name: 'MessageContent', params: { item }}"
          class="bg-white rounded-lg p-2 mb-2"
          :class="{'text-secondary': item.state === 1}"
        >
          <p class="text-sm whitespace-pre-wrap">{{ item.msgContent }}</p>
          <p class="text-xs text-secondary mt-1">
            <span>{{ item.publisherName }}</span>
            <span class="float-right">{{ item.msgTime }}</span>
          </p>
        </section>
      </template>
      <e-empty v-if="msgMapList[type] && msgMapList[type].resultList.length === 0" class="bg-gray"></e-empty>
    </e-infinite-loading>
  </div>
</template>

<script>
import { ETabs, ETab, EEmpty, EInfiniteLoading } from '@/components'
import * as api from '@/api/work'

export default {
  name: 'Messages',

  components: {
    ETabs,
    ETab,
    EEmpty,
    EInfiniteLoading,
  },

  data: () => ({
    msgMapList: {},

    type: '1',
    tabs: [],
    dataEmpty: false,
  }),

  watch: {
    type() {
      this.$refs['infinite-loading']?.resetState()
      this.getMsgList()
    },
  },

  onLoad() {
    this.getMsgTypeInfo()
  },

  methods: {
    getMsgTypeInfo() {
      api.getMsgTypeInfo().then(res => {
        this.tabs = res.body.resultList
      })
    },
    getMsgList(type, page = 1) {
      type ??= this.type

      return api.getMsgList({
        pageNum: page,
        pageSize: 20,
        msgType: type,
        state: 0,
      }).then(res => {
        if (page === 1) {
          this.$set(this.msgMapList, type, res.body)
        } else {
          this.msgMapList[type].resultList = this.msgMapList[type].resultList.concat(res.body.resultList)
        }
        return res
      })
    },
    loadMore($state) {
      this.getMsgList(this.type, $state.page).then(res => {
        if (res.body.resultList.length === 0) $state.finished()
        else $state.loaded()
      }).catch($state.error)
    },
  },
}
</script>

<style scoped>

</style>

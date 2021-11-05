<template>
  <div class="siriPage" @touchmove.prevent>
    <e-header title="易助手" border @back="back"></e-header>
    <!-- <div v-if="classLoading" class="coll-loading-box">
      <e-loading color="#00a2ea" />
    </div> -->
    <e-loading :show="classLoading"></e-loading>
    <div v-if="!classLoading" class="page">
      <div class="li-title">
        <img class="helpImg" src="/images/siri/help.png" />
        <span>{{ sentence }}</span>
      </div>
      <div v-if="timeFrame.startTime && timeFrame.startTime == timeFrame.endTime" class="info">查询时间（{{ timeFrame.startTime }}）</div>
      <div v-else-if="timeFrame.startTime && timeFrame.startTime != timeFrame.endTime" class="info">查询时间（{{ timeFrame.startTime }}~{{ timeFrame.endTime }}）</div>
      <div v-else class="info">{{ timeFrame }}</div>
      <div class="infoTit">
        <span class="item-tit">以下为查询结果:</span>
      </div>
    </div>

    <Scroll
      v-if="tableDataList.length > 1 && !classLoading"
      ref="list-title-li"
      class="list-title-li"
      :listen-scroll="true"
      :probe-type="3"
      :scroll-x="true"
      :scroll-y="false"
      :auto-update="true"
      :pull-down="false"
      :pull-up="false"
    >
      <div>
        <span v-for="(item,index) in tableDataList" :key="index" class="ospan" :class="keyWordIndex == index?'active':''" @click="keyWordShow(index)">
          <span v-for="(itemKey,i) in item.row" :key="i">
            <span v-if="itemKey.dspKey == 'employeeName'">
              {{ itemKey.dspData + (index==0?'':index) }}
            </span>
          </span>
        </span>
      </div>
    </Scroll>
    <Scroll
      v-if="!classLoading"
      ref="siriResultUl"
      :update-data="[tableDatas]"
      :refresh-data="[tableDatas]"
      class="siriResultUl"
      :probe-type="3"
      :bounce-time="300"
      :listen-scroll="true"
      :scroll-x="false"
      :scroll-y="true"
      :auto-update="false"
      @pullingDown="styleRefresh"
      @pullingUp="styleLoadMore"
    >
      <div style="height: 1px;"></div>
      <div v-if="tableDatas && tableDatas.length > 0" class="census">
        <div class="census-content">
          <van-icon class="icon-des" size="20" name="description" />
          <span class>
            <span v-for="(item,index) in tableData.row" :key="index">
              <span v-if="index == tableData.row.length-1">{{ item.dspValue }}<span class="census-span">{{ item.dspData }}</span>。</span>
              <span v-else>{{ item.dspValue }}<span class="census-span">{{ item.dspData }}</span>,</span>
            </span>
          </span>
        </div>
      </div>
      <div v-else class="ul-data">
        <div class="ul-content">
          <div v-for="(item,index) in tableData.row" :key="index" class="li-content">
            <span>{{ item.dspValue }}</span>
            <span>{{ item.dspData }}</span>
          </div>
        </div>
      </div>
      <div v-for="(list,index) in tableDatas" :key="index" class="li-border">
        <div class="sort">{{ index+1 }}</div>
        <div class="li-content">
          <div v-for="item in list.row" :key="item">
            <span>{{ item.dspValue }}:</span>
            <span>{{ item.dspData }}</span>
          </div>
        </div>
      </div>
    </Scroll>
  </div>
</template>

<script>
import { ELoading } from '@/components'
import Scroll from 'vue-slim-better-scroll'
import iframe from '@/utils/iframe'
export default {
  name: 'Siri',
  components: {
    ELoading,
    Scroll,
  },
  data: () => ({
    sentence: '',
    resultJson: {}, // resultJson
    tableDataList: [],
    tableData: [
      {
        row: [],
      },
      {
        row: [],
      },
    ],
    tableDatas: [],
    keyWord: '',
    paramJson: {},
    keyWordIndex: 0,
    timeFrame: '',
    classLoading: true, // 加载效果
    resultType: '',
    pageNum: 1,
    pageSize: 10,
    count: '',
    apiUrl: '',
  }),
  mounted() {
    // 方法定义到window上面
    window.siriQueryDetail = this.siriQueryDetail
    iframe.getQueryDetail(this.$route.query.msgId)
  },
  methods: {
    // 返回到语音助手
    back() {
      iframe.switchToSiri()
    },
    // 重复真实姓名切换
    keyWordShow(index) {
      this.keyWordIndex = index
      if (index === 0) {
        this.tableData = this.resultJson.countInfo[0]
      } else {
        this.tableData = this.resultJson.countInfo[index]
      }
    },
    // 原生调用
    siriQueryDetail(data) {
      this.pageNum = 1
      const siriData = JSON.parse(data) // 字符串转json，严格转换，属性跟值必须加"":""
      this.sentence = siriData.sentence
      if (siriData.resultJson.countInfo) {
        this.tableDataList = siriData.resultJson.countInfo
      }
      if (siriData.resultJson.count) {
        this.count = siriData.resultJson.count
      }
      if (siriData.resultJson.countInfo[0]) {
        this.tableData = siriData.resultJson.countInfo[0]
      }
      if (siriData.resultJson) {
        this.resultJson = siriData.resultJson
      }
      if (siriData.apiUrl) {
        this.apiUrl = siriData.apiUrl
      }
      if (siriData.resultJson.pageList) {
        this.tableDatas = siriData.resultJson.pageList
      }
      this.paramJson = siriData.paramJson
      this.keyWord = siriData.paramJson.keyWord
      this.timeFrame = siriData.timeFrame
      // 等这个方法执行完以后，loading为false
      this.getStylesList()
    },
    // 下拉刷新
    styleRefresh() {
      this.pageNum = 1
      this.getStylesList()
    },
    // 上拉加载
    styleLoadMore() {
      if (this.count > this.tableDatas.length) {
        this.pageNum++
        this.getStylesList()
      } else {
        this.$refs.siriResultUl.update(true)
      }
    },
    // 分页请求接口 查询
    getStylesList() {
      const params = {}
      params.paramJson = this.paramJson
      params.apiUrl = this.apiUrl
      params.sentence = this.sentence
      params.paramJson.pageNum = this.pageNum
      params.paramJson.pageSize = this.pageSize
      const jsonParam = this.GLOBAL.g_paramJson(params)
      this.$axios.post(this.GLOBAL.smart_manager_server + '/smart/requestForward', jsonParam).then((res) => {
        this.classLoading = false
        if (res.data.head.status === 0) {
          if (this.pageNum === 1) {
            const siriData = res.data.body
            this.sentence = siriData.sentence
            this.tableDataList = siriData.resultJson.countInfo
            this.count = siriData.resultJson.count
            this.tableData = siriData.resultJson.countInfo[0]
            this.resultJson = siriData.resultJson
            this.apiUrl = siriData.apiUrl
            if (siriData.resultJson.pageList) {
              this.tableDatas = siriData.resultJson.pageList
            }
            this.paramJson = siriData.paramJson
            this.keyWord = siriData.paramJson.keyWord
            this.classLoading = false
          } else {
            const siriData = res.data.body
            this.sentence = siriData.sentence
            this.tableDataList = siriData.resultJson.countInfo
            this.count = siriData.resultJson.count
            this.tableData = siriData.resultJson.countInfo[0]
            this.resultJson = siriData.resultJson
            this.apiUrl = siriData.apiUrl
            if (siriData.resultJson.pageList) {
              this.tableDatas = this.tableDatas.concat(siriData.resultJson.pageList)
            }
            this.paramJson = siriData.paramJson
            this.keyWord = siriData.paramJson.keyWord
            this.classLoading = false
          }
        } else {
          this.$toast(res.data.head.msg)
        }
      })
        .catch(function(error) {
          this.$toast(error)
        })
    },
  },
}
</script>
<style lang="less" scoped>

.siriPage {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  color: #333333;
  font-family: PingFang-SC-Medium;
  font-size: 14px;
  .page{
    display: flex;
    flex-direction: column;
    box-sizing:border-box;
    .li-title {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 5px 3%;
      background: #f0f0f0;
      border: none;
      .helpImg{
        box-sizing: content-box;
        width:20px;
        height:20px;
        padding-right:5px;
      }
    }
    .info {
      height:40px;
      line-height:40px;
      color: #999999;
      padding: 0 3%;
      width:100%;
      box-sizing: border-box;
    }

    .infoTit {
      display: flex;
      align-items: center;
      background:#E0E0E0;
      width:100%;
      height:40px;
      line-height:30px;
      box-sizing: border-box;
      padding:5px 3%;
      .item-tit {
        line-height:30px;
        height:30px;
        flex:1;
        font-weight: bolder;
      }
    }
    // ----------------------------↓

    /deep/.van-cell {
      background-color: #f0f0f0;
      font-size: 14px;
    }
  }
  // -------------------------------------------------↑
  .list-title-li{
    width:100%;
    overflow: hidden;
    padding: 0 3%;
    height:40px;
    display: flex;
    flex-direction: row;
    div{
      flex:1;
      display: flex;
      flex-direction: row;
      white-space: nowrap;
      .ospan{
        display:inline-block;
        height:40px;
        line-height:40px;
        box-sizing: border-box;
        margin:0 15px;
      }
      .active{
        border-bottom:2px solid #333;
        color: #333;
      }
    }
  }
  .siriResultUl{
      flex:1;
      overflow: hidden;
      .census{
        padding: 10px 10px;
        background: #f0f0f0;
        .census-content{
          display: flex;
          flex-direction: row;
          align-items: center;
          line-height: 20px;
          .icon-des{
            padding-right:5px;
          }
          span{
            span{
              .census-span{
                color:#E30101;
                font-size: 16px;
              }
            }
          }
        }
      }
      .li-border {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 0 10px;
        background: #f0f0f0;
        border-top: 2px solid #b5b5b5;
        .sort{
          padding:0 12.5px 0 12.5px;
        }
        .li-content {
          padding: 10px 0;
          display: flex;
          flex-direction: column;
          background: #f0f0f0;

        }
      }
      .li-border:nth-child(2) {
        border: none;
      }
      .ul-data{
        flex:1;
        .ul-content{
          display: flex;
          flex-direction: column;
          align-items: center;
          background: #f0f0f0;
          margin-bottom:15px;
          .li-content{
            width:94%;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            background: #f0f0f0;
            padding: 10px 3%;
            border-top: 2px solid #b5b5b5;

          }
          .li-content:nth-child(1){
            border:none;
          }
        }
      }
    }
}

</style>

<template>
  <div id="index" @touchmove.prevent>
    <e-header :title="title" border @back="back"></e-header>
    <div class="box">
      <ul class="box-list">
        <li :class="isActive == 1?'active':''" @click="changeAdd(1)">{{ '未查看('+ totalCount +')' }}</li>
        <li :class="isActive == 2?'active':''" @click="changeAdd(2)">{{ '已查看('+ total +')' }}</li>
      </ul>
    </div>
    <e-loading class="bg-gray" :show="styleListFlag"></e-loading>
    <Scroll
      v-if="!styleListFlag"
      ref="workGroupScroll"
      :update-data="[resultList]"
      :refresh-data="[]"
      class="indexCon"
      :listen-scroll="true"
      :probe-type="3"
      :bounce-time="300"
      :scroll-x="false"
      :scroll-y="true"
      :auto-update="false"
      @pullingDown="styleRefresh"
      @pullingUp="styleLoadMore"
    >
      <div v-if="resultList && resultList.length > 0">
        <div v-for="(list,index) in resultList" :key="index" class="mineTopBox" @click="detailShow(list)">
          <div class="title">
            <e-icon class="title-img" :name="list.userName?'manager-o':'cluster-o'"></e-icon>
            <div class="title-li">
              <span class="title-span">{{ list.departName?list.departName:list.userName }}</span>
              <span v-if="list.startTime == list.endTime" class="title-date">{{ list.startTime.slice(0,10) }}</span>
              <span v-else class="title-date">{{ list.startTime.slice(0,10)+ ' — ' +list.endTime.slice(0,10) }}</span>
            </div>
            <div class="title-arrow"></div>
            <span class="title-day">{{ list.bhdTimeUnit }}</span>
          </div>
          <div class="content-box">
            <div class="content-box-li">
              <div :class="JSON.parse(list.ewContent.replace('//g',''))[0].orderNum == 5 ? '' : 'list-border'" class="list-li">
                <div class="color_grey">{{ JSON.parse(list.ewContent.replace('//g',''))[0].dspValue }}</div>
                <div :class="JSON.parse(list.ewContent.replace('//g',''))[0].dspData == '低'?'color-low':JSON.parse(list.ewContent.replace('//g',''))[0].dspData == '中'?'color-in':JSON.parse(list.ewContent.replace('//g',''))[0].dspData == '高'?'color-top':''">{{ JSON.parse(list.ewContent.replace('//g',''))[0].dspData }}</div>
              </div>
            </div>
            <div class="content-box-li">
              <div :class="JSON.parse(list.ewContent.replace('//g',''))[1].orderNum == 5 ? '' : 'list-border'" class="list-li">
                <div class="color_grey">{{ JSON.parse(list.ewContent.replace('//g',''))[1].dspValue }}</div>
                <div :class="JSON.parse(list.ewContent.replace('//g',''))[1].dspData == '低'?'color-low':JSON.parse(list.ewContent.replace('//g',''))[1].dspData == '中'?'color-in':JSON.parse(list.ewContent.replace('//g',''))[1].dspData == '高'?'color-top':''">{{ JSON.parse(list.ewContent.replace('//g',''))[1].dspData }}</div>
              </div>
            </div>
            <div class="content-box-li">
              <div :class="JSON.parse(list.ewContent.replace('//g',''))[2].orderNum == 5 ? '' : 'list-border'" class="list-li">
                <div class="color_grey">{{ JSON.parse(list.ewContent.replace('//g',''))[2].dspValue }}</div>
                <div :class="JSON.parse(list.ewContent.replace('//g',''))[2].dspData == '低'?'color-low':JSON.parse(list.ewContent.replace('//g',''))[2].dspData == '中'?'color-in':JSON.parse(list.ewContent.replace('//g',''))[2].dspData == '高'?'color-top':''">{{ JSON.parse(list.ewContent.replace('//g',''))[2].dspData }}</div>
              </div>
            </div>
            <div class="content-box-li">
              <div :class="JSON.parse(list.ewContent.replace('//g',''))[3].orderNum == 5 ? '' : 'list-border'" class="list-li">
                <div class="color_grey">{{ JSON.parse(list.ewContent.replace('//g',''))[3].dspValue }}</div>
                <div :class="JSON.parse(list.ewContent.replace('//g',''))[3].dspData == '低'?'color-low':JSON.parse(list.ewContent.replace('//g',''))[3].dspData == '中'?'color-in':JSON.parse(list.ewContent.replace('//g',''))[3].dspData == '高'?'color-top':''">{{ JSON.parse(list.ewContent.replace('//g',''))[3].dspData }}</div>
              </div>
            </div>
            <div class="content-box-li">
              <div :class="JSON.parse(list.ewContent.replace('//g',''))[4].orderNum == 5 ? '' : 'list-border'" class="list-li">
                <div class="color_grey">{{ JSON.parse(list.ewContent.replace('//g',''))[4].dspValue }}</div>
                <div :class="JSON.parse(list.ewContent.replace('//g',''))[4].dspData == '低'?'color-low':JSON.parse(list.ewContent.replace('//g',''))[4].dspData == '中'?'color-in':JSON.parse(list.ewContent.replace('//g',''))[4].dspData == '高'?'color-top':''">{{ JSON.parse(list.ewContent.replace('//g',''))[4].dspData }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <e-empty v-if="!resultList || resultList.length == 0"></e-empty>
    </Scroll>
  </div>
</template>

<script>
import { ELoading, EEmpty } from '@/components'
import Scroll from 'vue-slim-better-scroll'
export default {
  name: 'Warn',
  components: {
    ELoading,
    EEmpty,
    Scroll,
  },

  data: () => ({
    // 标题
    title: '',
    // lodding
    styleListFlag: true,
    // 判断是 未处理 1 还是 已处理 2
    isActive: 1,

    pageNum: 1,
    pageSize: 10,
    total: 0, // 已读
    totalCount: 0, // 未读

    // 接受跳转传参
    query: {},
    // 切换（已读/未读）列表数据
    resultList: [],
    // 已读列表数据
    ruleList: [],
    // 未读列表数据
    resuList: [],
  }),
  onLoad() {
    this.styleListFlag = true
    if (this.$route.query.bhdId) {
      this.bhdId = Number(this.$route.query.bhdId)
      // 预警团队用
      localStorage.bhdId = this.$route.query.bhdId
    }
    if (this.bhdId === 1) {
      this.title = '工作效率'
    } else if (this.bhdId === 2) {
      this.title = '考勤'
    }
    if (this.$route.query.specialVal) {
      this.isActive = this.$route.query.specialVal
    } else {
      if (Number(localStorage.isProcessed)) {
        this.isActive = Number(localStorage.isProcessed)
      } else {
        this.isActive = 1
      }
    }
    this.resultList = []
    this.searchInfo()
  },
  activated() {
    this.styleListFlag = true
    if (this.$route.query.specialVal) {
      this.isActive = this.$route.query.specialVal
    } else {
      if (Number(localStorage.isProcessed)) {
        this.isActive = Number(localStorage.isProcessed)
      } else {
        this.isActive = 1
      }
    }
    this.resultList = []
    this.searchInfo()
  },
  mounted() {},
  methods: {
    // 返回
    back() {
      localStorage.removeItem('bhdId')
      localStorage.removeItem('isProcessed')
      this.$router.to('Work')
    },
    //  跳转至工作日志
    detailShow(list) {
      localStorage.isProcessed = this.isActive
      if (list.userName) {
        this.$router.push(
          {
            name: 'WarnListDetail',
            params: {
              list: list,
            },
          },
        )
      } else {
        this.$router.push(
          {
            name: 'WarnUserList',
            params: {
              list: list,
            },
          },
        )
      }
    },
    styleRefresh() {
      this.pageNum = 1
      this.searchInfo()
    },
    styleLoadMore() {
      if (this.resultList.length < this.styleTotal) {
        this.pageNum++
        this.searchInfo()
      } else {
        this.$refs.workGroupScroll.update(true)
      }
    },
    // 查询
    searchInfo() {
      // 未读信息
      const params = {
        bhdId: String(this.bhdId),
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      }
      const jsonParam = this.GLOBAL.g_paramJson(params)
      this.$axios.post(this.GLOBAL.alarmServer + '/alarm/getNotBhdList', jsonParam).then((res) => {
        this.styleListFlag = false
        if (res.data.head.status === 0) {
          if (this.pageNum === 1) {
            this.totalCount = res.data.body.totalCount
            this.resuList = res.data.body.resultList
          } else {
            this.totalCount = res.data.body.totalCount
            this.resuList = this.resuList.concat(res.data.body.resultList)
            if (this.totalCount === this.resultList.length) {
              this.$refs.workGroupScroll.update(true)
            }
          }
          if (this.isActive === 1) {
            this.resultList = this.resuList
          }
        } else {
          this.$this.$toast(res.data.head.msg)
        }
      })
      // 已读信息
      const par = {
        bhdId: String(this.bhdId),
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      }
      const jsonPar = this.GLOBAL.g_paramJson(par)
      this.$axios
        .post(this.GLOBAL.alarmServer + '/alarm/getBhdList', jsonPar)
        .then((res) => {
          if (res.data.head.status === 0) {
            this.total = res.data.body.totalCount
            this.ruleList = res.data.body.resultList

            if (this.pageNum === 1) {
              this.total = res.data.body.totalCount
              this.ruleList = res.data.body.resultList
            } else {
              this.total = res.data.body.totalCount
              this.ruleList = this.ruleList.concat(res.data.body.resultList)
              if (this.total === this.resultList.length) {
                this.$refs.workGroupScroll.update(true)
              }
            }
            if (this.isActive === 2) {
              this.resultList = this.ruleList
            }
          } else {
            this.$toast(res.data.head.msg)
          }
        })
    },
    changeAdd(index) {
      this.isActive = index
      localStorage.isProcessed = index
      this.pageNum = 1
      if (index === 1) {
        this.searchInfo()
      } else if (index === 2) {
        this.searchInfo()
      }
    },
  },
}
</script>

<style lang="less" scoped>
#index {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  background-color: #f5f5f5;
  .header {
    width: 100%;
    height: 1.2rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    font-size: 16px;
    color: #333;
    box-sizing: border-box;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    padding:0 3%;

  }
  .box {
    width: 100%;
    height: 40px;
    display: flex;
    background-color: #ffffff;
    justify-content: center;
    .box-list {
      width: 250px;
      -webkit-box-flex: 1;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      height: 40px;
      li {
        font-size: 15px;
        color: #333;
        white-space: nowrap;
        margin: 0 15px;
        height: 30px;
        line-height: 30px;
        padding:3.5px 0;
      }
      .active {
        box-sizing: content-box;
        border-bottom: 3px solid #00cc65;
      }

    }
  }

  .indexCon {
    flex: 1;
    overflow: hidden;
    width:94%;
    margin: 10px 3% 10px 3%;
    .mineTopBox {
      display: flex;
      flex-direction: column;
      font-size: 14px;
      align-items: center;
      box-sizing: border-box;
      background-color: #ffffff;
      border-radius: 8px;
      color: #333;
      margin-bottom: 10px;
      position: relative;
      .title {
        width: 100%;
        border-bottom: 2px solid #f5f5f5;
        height: 40px;
        display: flex;
        flex-direction: row;
        align-items: center;

        .title-img {
          padding:5px 5px 0 5px;
          font-size: 20px;
        }
        .title-li{
          flex:1;
          display: flex;
          flex-direction: row;
          align-items:baseline ;
          padding-top:10px;
          .title-span {
            width:60px;
            font-weight: bolder;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .title-date{
            font-size: 12px;
            flex:1;
            text-align:left;
          }
        }
        .title-arrow {
          margin-left:60px;
          width: 0;
          height: 0;
          border-top: 15px solid #a0a0a0;
          border-right: 15px solid #a0a0a0;
          border-bottom: 15px solid transparent;
          border-left: 15px solid transparent;
          border-radius: 0 8px 0 0;
          display:flex;
          align-self:flex-start;
        }

        .title-day {
          position: absolute;
          right: 0;
          top:0;
          color: #ffffff;
        }
      }

      .content-box {
        width: 100%;
        height: 80px;
        font-size: 13px;
        display: flex;
        flex-direction: row;
        align-items: center;
        /deep/ .vue-slim-better-scroll__wrapper{
          display: flex;
          flex-direction: row;
        }
        .content-box-li {
          flex: 1;
          text-align: center;
          padding: 10px 0;
          .list-li{
            .color_grey {
              color: #333;
              padding-bottom: 5px;
            }
            .color-low{
              color:#00CC65;
            }
            .color-in{
              color:#FFA500;
            }
            .color-top{
              color:#E30101;
            }
          }
          .list-border{
            border-right:1px solid #f5f5f5;
          }
        }
      }

      .mf20 {
        margin-left: 10px;
      }

      .mf60 {
        margin-left: 30px;
      }

      .tabMark {
        position: absolute;
        top: 0;
        left: 0;
        height: 20px;
      }

      .more-icon {
        width: 6px;
        vertical-align: baseline;
        float: right;
      }
    }
  }
}
</style>

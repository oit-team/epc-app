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
            <e-icon class="title-img" :name="list.userName?'manager-o':'cluster-o'" />
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
    styleListFlag: true, // 加载lodding
    // title:'预警',
    title: '工作效率',
    isActive: 1, // 判断是 未处理 1 还是 已处理 2
    contentArr: [
      // 显示未处理  已处理
      { dicttimeDisplayName: '未处理' },
      { dicttimeDisplayName: '已处理' },
    ],
    isLoading: false, // lodding
    pageSize: 10,
    pageNum: 1,
    totalCount: 0, // 未读
    total: 0, // 已读

    query: {}, // 接受跳转传参
    resultList: [], // 切换（已读/未读）列表数据
    ruleList: [], // 已读列表数据
    resuList: [], // 未读列表数据
  }),
  created() {
    this.bhdId = Number(this.$route.query.bhdId)
  },
  mounted() {},
  activated() {
    // this.bhdId = 1//后面-》删除
    console.debug('admin')
    if (this.bhdId === 1) {
      this.title = '工作效率'
    } else if (this.bhdId === 2) {
      this.title = '考勤'
    }
    if (this.$route.query.specialVal) {
      this.isActive = this.$route.query.specialVal
    } else {
      if (Number(localStorage.isProcessed)) {
        this.isActive = localStorage.isProcessed
      } else {
        this.isActive = 1
      }
    }
    this.resultList = []
    // this.styleListFlag = false
    this.searchInfo()
  },
  methods: {
    // 返回
    back() {
      localStorage.isProcessed = ''
      // this.$router.go(-1);
      this.$router.push(
        {
          path: '/',
        },
      )
    },
    //  跳转至工作日志
    detailShow(list) {
      localStorage.isProcessed = this.isActive
      // localStorage.isProcessed = 2
      if (list.userName) {
        this.$router.push(
          {
            name: 'WarnListDetail',
            query: {
              list: list,
            },
          },
        )
      } else {
        this.$router.push(
          {
            name: 'WarnUserList',
            query: {
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
      const _this = this
      const params = {
        bhdId: String(this.bhdId),
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      }
      const jsonParam = this.GLOBAL.g_paramJson(params)
      _this.$axios.post(this.GLOBAL.alarmServer + '/alarm/getNotBhdList', jsonParam).then(function(res) {
        _this.styleListFlag = false
        if (res.data.head.status === 0) {
          if (_this.pageNum === 1) {
            _this.totalCount = res.data.body.totalCount
            _this.resuList = res.data.body.resultList
          } else {
            _this.totalCount = res.data.body.totalCount
            _this.resuList = _this.resuList.concat(res.data.body.resultList)
          }
          // console.log(_this.isActive)
          if (_this.isActive === 1) {
            _this.resultList = _this.resuList
          }
          if (_this.totalCount === _this.resultList.length) {
            this.$refs.workGroupScroll.update(true)
          }
          // 截取
          // console.log(_this.resuList[0].ewContent)
          // console.log(typeof _this.resuList[0].ewContent)
          // console.log('_this.resuList.ewContent0='+_this.resuList[0].ewContent.replace(//g,''));//替换''为''
          // console.log(typeof _this.resuList[0].ewContent.replace(//g,''))
        } else {
          _this.$this.$toast(res.data.head.msg)
        }
      }).catch(function() {
        // _this.$this.$toast("接口调用失败");
      })
      // 已读信息
      const par = {
        bhdId: String(this.bhdId),
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      }
      const jsonPar = this.GLOBAL.g_paramJson(par)
      _this.$axios
        .post(this.GLOBAL.alarmServer + '/alarm/getBhdList', jsonPar)
        .then(function(res) {
          if (res.data.head.status === 0) {
            _this.total = res.data.body.totalCount
            _this.ruleList = res.data.body.resultList

            if (_this.pageNum === 1) {
              _this.total = res.data.body.totalCount
              _this.ruleList = res.data.body.resultList
            } else {
              _this.total = res.data.body.totalCount
              _this.ruleList = _this.ruleList.concat(res.data.body.resultList)
            }

            // console.log(_this.isActive)
            if (_this.isActive === 2) {
              _this.resultList = _this.ruleList
            }

            if (_this.total === _this.resultList.length) {
              this.$refs.workGroupScroll.update(true)
            }
          } else {
            _this.$this.$toast(res.data.head.msg)
          }
        })
        .catch(function() {
          // _this.$this.$toast("接口调用失败");
        })
    },
    changeAdd(index) {
      this.styleListFlag = false
      this.isActive = index
      localStorage.isProcessed = index
      this.pageNum = 1
      if (index === 1) {
        this.searchInfo()
      } else if (index === 2) {
        this.searchInfo()
      }
    },
    // onRefresh() {
    //   setTimeout(() => {
    //     this.isLoading = false;
    //   }, 1000);
    // }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style lang="less" scoped>
#index {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  background-color: #f5f5f5;
  //padding: 10px 12px;

  // .header {
  //   background-color: #f5f5f5;
  // }
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
    // background-color: #ffffff;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    // padding: 0px 8px;
    padding:0 3%;

  }
  .header .img{
    height:1.2rem;
    display: flex;
    align-items: center;
  }
  .header .img img {
    width: 18px;
    height: 18px;
    padding-right:15px;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
  }
  .header .img .banImg {
    width: 18px;
    height: 18px;
    padding-right:15px;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
  }
  .header .tit {
    height: 1.2rem;
    line-height:1.2rem;
    font-size: 18px;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
  }
  .header .placeLabel {
    height: 1.2rem;
    line-height:1.2rem;
    width: 33px;
  }
  .box {
    width: 100%;
    height: 40px;
    // line-height: 1.2rem;
    display: flex;
    background-color: #ffffff;
    // border-bottom: 1px solid #f5f5f5;
    justify-content: center;

    .box-list {
      //width: 100%;
      width: 250px;
      -webkit-box-flex: 1;
      // flex: 1;
      // overflow: hidden;
      display: flex;
      flex-direction: row;
      // align-items: center;
      justify-content: space-between;
      height: 40px;
      // box-sizing: border-box;
      li {
        font-size: 15px;
        color: #333;
        white-space: nowrap;
        // box-sizing: border-box;
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
    // /deep/ .van-empty__description{
    //   font-size:14px;
    // }

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
      position: relative;// 为子元素定位

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
            // color:#a0a0a0;
            // font-weight: bolder;
            flex:1;
            // padding-left:30px;
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
          // height:100%!important;
          // background-color: pink;
          display: flex;
          flex-direction: row;
          // >div{
          //   width: 100% !important;
          // }
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

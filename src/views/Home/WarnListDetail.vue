<template>
  <div id="index" @touchmove.prevent>
    <e-header :title="params.userName" border></e-header>
    <!-- tabs -->
    <div class="logTabs">
      <span :class="warnActive==1?'active':''" @click="warnShow(1)">预警记录</span>
      <span :class="warnActive==2?'active':''" @click="warnShow(2)">工作信息</span>
      <span :class="warnActive==3?'active':''" @click="warnShow(3)">{{ params.bhdTimeUnit=='日'?'自我优化':'优化记录' }}</span>
    </div>
    <!-- 预警记录列表 -->
    <Scroll
      v-if="styleListFlag"
      v-show="warnActive == 1"
      ref="warnLogScroll"
      class="warnLogScroll"
      :probe-type="3"
      :scroll-x="false"
      :scroll-y="true"
      :pull-down="false"
      :pull-up="false"
    >
      <div v-if="bhdLog && bhdLog.length > 0" class="warnLog">
        <div v-for="(list,index) in bhdLog" :key="index" class="mineTopBox">
          <div class="title">
            <e-icon class="title-img" :name="params.userName?'manager-o':'cluster-o'"></e-icon>
            <div class="title-li">
              <span class="title-span">{{ params.departName?params.departName:params.userName }}</span>
              <span class="title-date">{{ list.createTime }}</span>
            </div>
          </div>
          <div class="content-box">
            <div class="content-box-li">
              <div :class="JSON.parse(list.bhdContent.replace('//g',''))[0].orderNum == 5 ? '' : 'list-border'" class="list-li">
                <div class="color_grey">{{ JSON.parse(list.bhdContent.replace('//g',''))[0].dspValue }}</div>
                <div :class="JSON.parse(list.bhdContent.replace('//g',''))[0].dspData == '低'?'color-low':JSON.parse(list.bhdContent.replace('//g',''))[0].dspData == '中'?'color-in':JSON.parse(list.bhdContent.replace('//g',''))[0].dspData == '高'?'color-top':''">{{ JSON.parse(list.bhdContent.replace('//g',''))[0].dspData }}</div>
              </div>
            </div>
            <div class="content-box-li">
              <div :class="JSON.parse(list.bhdContent.replace('//g',''))[1].orderNum == 5 ? '' : 'list-border'" class="list-li">
                <div class="color_grey">{{ JSON.parse(list.bhdContent.replace('//g',''))[1].dspValue }}</div>
                <div :class="JSON.parse(list.bhdContent.replace('//g',''))[1].dspData == '低'?'color-low':JSON.parse(list.bhdContent.replace('//g',''))[1].dspData == '中'?'color-in':JSON.parse(list.bhdContent.replace('//g',''))[1].dspData == '高'?'color-top':''">{{ JSON.parse(list.bhdContent.replace('//g',''))[1].dspData }}</div>
              </div>
            </div>
            <div class="content-box-li">
              <div :class="JSON.parse(list.bhdContent.replace('//g',''))[2].orderNum == 5 ? '' : 'list-border'" class="list-li">
                <div class="color_grey">{{ JSON.parse(list.bhdContent.replace('//g',''))[2].dspValue }}</div>
                <div :class="JSON.parse(list.bhdContent.replace('//g',''))[2].dspData == '低'?'color-low':JSON.parse(list.bhdContent.replace('//g',''))[2].dspData == '中'?'color-in':JSON.parse(list.bhdContent.replace('//g',''))[2].dspData == '高'?'color-top':''">{{ JSON.parse(list.bhdContent.replace('//g',''))[2].dspData }}</div>
              </div>
            </div>
            <div class="content-box-li">
              <div :class="JSON.parse(list.bhdContent.replace('//g',''))[3].orderNum == 5 ? '' : 'list-border'" class="list-li">
                <div class="color_grey">{{ JSON.parse(list.bhdContent.replace('//g',''))[3].dspValue }}</div>
                <div :class="JSON.parse(list.bhdContent.replace('//g',''))[3].dspData == '低'?'color-low':JSON.parse(list.bhdContent.replace('//g',''))[3].dspData == '中'?'color-in':JSON.parse(list.bhdContent.replace('//g',''))[3].dspData == '高'?'color-top':''">{{ JSON.parse(list.bhdContent.replace('//g',''))[3].dspData }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else style="text-align:center;">
        <e-empty></e-empty>
      </div>
    </Scroll>
    <!-- 工作信息列表-工作状态 -->
    <div v-if="warnActive == 2 && warningList && warningList.length > 0 && styleListFlag" class="indexCon">
      <div class="workList" @click="statusShow()">
        <div class="workUl">
          <span>工作状态</span>
          <div>
            <span class="more">更多</span>
            <e-icon name="arrow" color="#999"></e-icon>
          </div>
        </div>
        <div class="workLi">
          <div v-if="params.startTime == params.endTime " class="workStatistics">在这期间({{ params.startTime.slice(0,10) }})使用软件共<span class="softColor">{{ tableData.admittanceSize+tableData.notStandardSize }}</span>项;</div>
          <div v-else class="workStatistics">在这期间({{ params.startTime.slice(0,10) }} — {{ params.endTime.slice(0,10) }})使用软件共<span class="softColor">{{ tableData.admittanceSize+tableData.notStandardSize }}</span>项;</div>
          <div class="workStatistics"><e-img class="banImg" src="/images/warn/ranking.png"></e-img>在【{{ tableData.deptName }}】排名第<span class="softColor">{{ tableData.ranking }}</span>名。</div>
        </div>
      </div>
    </div>
    <!-- 工作信息列表-工作日志 -->
    <div v-if="warnActive == 2 && styleListFlag && warningList.length > 0" class="workUlTit">
      <span>工作日志</span>
    </div>
    <e-loading class="bg-gray" :show="!styleListFlag"></e-loading>
    <Scroll
      v-if="styleListFlag"
      v-show="warnActive == 2"
      ref="workLogScroll"
      :update-data="[warningList]"
      :refresh-data="[]"
      class="workLogScroll"
      :probe-type="3"
      :listen-scroll="true"
      :scroll-x="false"
      :scroll-y="true"
      :auto-update="false"
      @pullingDown="styleRefresh"
      @pullingUp="styleLoadMore"
    >
      <div v-if="warningList && warningList.length > 0" class="workLog">
        <div v-for="(item,index) in warningList" :key="index" class="workLi">
          <span>{{ item.sotExeName }}</span>
          <span :class="item.validType=='准入软件'?'adoptType':item.validType=='非标软件'?'banType':''">{{ item.validType }}</span>
          <span>{{ item.validTime }}</span>
        </div>
      </div>
      <div v-else style="text-align:center;padding-top:1px;">
        <e-empty></e-empty>
      </div>
    </Scroll>
    <!-- 优化记录列表 -->
    <div v-if="warnActive == 3 && styleListFlag" class="indexConOptimize">
      <div class="workRecord" :class="params.bhdTimeUnit=='日' && !data?'':'recordActive'">
        <div v-if="optimizationList && optimizationList.length > 0 " class="workListList">
          <div v-for="(item,index) in optimizationList" :key="index" class="workLi" @click="workDetailShow(item)">
            <span class="workLiEll">{{ item.backup }}</span>
            <span>{{ item.userName }}</span>
            <span>{{ item.createTime }}</span>
          </div>
        </div>
        <div v-else class="workListList" style="text-align:center;">
          <e-empty></e-empty>
        </div>
      </div>
      <div v-if="params.bhdTimeUnit=='日' && !data" class="workUl">
        <e-icon class="fire-o" size="38" color="#fff" name="fire-o" @click="optimizeShow()"></e-icon>
      </div>
    </div>
    <!-- 工作状态弹出层 -->
    <van-popup v-model="workStatusBoole" closeable round position="bottom" :style="{ height: '60%' }">
      <div class="popupUl">
        <div class="popupTitle">工作状态</div>
        <Scroll
          ref="popupScroll"
          class="popupScroll"
          :probe-type="3"
          :bounce-time="0"
          :listen-scroll="true"
          :pull-down="false"
          :pull-up="false"
        >
          <div class="popupContent">
            <div v-if="params.startTime == params.endTime">在这期间({{ params.startTime.slice(0,10) }})共使用软件<span class="softColor">{{ tableData.admittanceSize+tableData.notStandardSize }}</span>项;</div>
            <div v-else>在这期间({{ params.startTime.slice(0,10) }} — {{ params.endTime.slice(0,10) }})共使用软件<span class="softColor">{{ tableData.admittanceSize+tableData.notStandardSize }}</span>项;</div>
            <div><e-img class="banImg" src="/images/warn/access.png"></e-img>准入软件<span class="softNum">{{ tableData.admittanceSize }}</span>项,总使用时长<span class="softNum">{{ tableData.admittanceSum }}</span>;</div>
            <div><e-img class="banImg" src="/images/warn/noAccess.png"></e-img>非标软件<span class="softNumBan">{{ tableData.notStandardSize }}</span>项,总使用时长<span class="softNumBan">{{ tableData.notStandardSum }}</span>;</div>
            <div><e-img class="banImg" src="/images/warn/ranking.png"></e-img>在【{{ tableData.deptName }}】排名第<span class="softColor">{{ tableData.ranking }}</span>名。</div>
          </div>
        </Scroll>
      </div>
    </van-popup>
    <!-- 优化记录弹出层 -->
    <van-popup v-model="workLiBoole" closeable round position="bottom" :style="{ height: '60%' }">
      <div class="popupUl">
        <div class="popupTitle">优化记录</div>
        <Scroll
          ref="popupScroll"
          class="popupScroll"
          :probe-type="3"
          :bounce-time="0"
          :listen-scroll="true"
          :pull-down="false"
          :pull-up="false"
        >
          <div class="popupContent">
            <div><span>员工姓名：</span>{{ workDetail.userName }}</div>
            <div><span>优化描述：</span>{{ workDetail.backup }}</div>
            <div><span>优化时间：</span>{{ workDetail.createTime }}</div>
          </div>
        </Scroll>
      </div>
    </van-popup>
    <!-- 优化描述弹出框 -->
    <van-popup v-model="optimizeBoole" round style="width:80%;">
      <van-cell-group style="padding:20px;">
        <van-field
          v-model="backup"
          class="describe"
          rows="10"
          autosize
          label=""
          type="textarea"
          maxlength="200"
          placeholder="请输入优化描述"
          show-word-limit
        />
      </van-cell-group>
      <div class="confirmSbmit">
        <span @click="cancel()">取 消</span>
        <span @click="optimizeSubmit()">确 认</span>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { ELoading, EEmpty } from '@/components'
import { Popup, Field } from 'vant'
import Scroll from 'vue-slim-better-scroll'
export default {
  name: 'WarnListDetail',
  components: {
    ELoading,
    Scroll,
    EEmpty,
    [Popup.name]: Popup,
    [Field.name]: Field,
  },
  data: () => ({
    title: '日志信息',
    // 接受跳转传参
    params: {
      startTime: '',
      endTime: '',
    },
    styleListFlag: false, // 加载lodding

    tableData: {}, // 总数据集合
    bhdLog: [], // 预警记录
    optimizationList: [], // 优化记录
    warningList: [], // 工作日志
    pageNum: 1,
    pageSize: 12,
    totalCount: '',
    optimizeBoole: false, // 优化弹框
    backup: '', // 优化描述内容
    workStatusBoole: false, // 工作状态弹出层
    workLiBoole: false, // 优化记录弹出层
    warnActive: 1,
    data: {},
    workDetail: {},
  }),
  created() {
    console.log('details created')
    this.styleListFlag = false
    // this.bhdLog = []
    // this.warningList = []
    // this.optimizationList = []
    this.params = this.$route.params.list
    this.data = this.$route.params.data
    if (localStorage.isProcessed === 1 && !this.data) {
      this.processedInfo()// 调用已处理
    } else if (localStorage.isProcessed === 2) {
    }
    this.warnActive = 1

    setTimeout(() => {
      this.searchInfo()
    }, 500)
  },
  mounted() {},
  activated() {
    console.log('details activated')
  },
  methods: {
    workDetailShow(item) {
      this.workLiBoole = true
      this.workDetail = item
    },
    // 预警记录
    warnShow(val) {
      this.pageNum = 1
      this.warnActive = val
      this.styleListFlag = false
      this.searchInfo()
    },
    // 展开工作状态改变Boolean
    statusShow() {
      this.workStatusBoole = true
    },

    //  优化
    optimizeShow() {
      this.optimizeBoole = true
    },
    // 取消
    cancel() {
      this.backup = ''
      this.optimizeBoole = false
    },
    // 提交
    optimizeSubmit() {
      // alarm/getWarningLog
      const _this = this
      const params = {
        bhdId: this.params.ewId,
        userId: this.$store.getters.userData.userId,
        // 备注
        backup: this.backup,
      }
      const jsonParam = this.GLOBAL.g_paramJson(params)
      _this.$axios
        .post(this.GLOBAL.alarmServer + '/alarm/addOptimization', jsonParam)
        .then(function(res) {
          if (res.data.head.status === 0) {
            _this.optimizeBoole = false
            _this.backup = ''
            _this.searchInfo()
          } else {
            _this.$toast(res.data.head.msg)
          }
        })
    },
    styleRefresh() {
      this.pageNum = 1
      this.searchInfo()
    },
    styleLoadMore() {
      if (this.totalCount > this.warningList.length) {
        this.pageNum++
        this.searchInfo()
      } else {
        this.$refs.workLogScroll.update(true)
      }
    },
    // 查询
    searchInfo() {
      // / alarm/getWarningLog预警日志
      const _this = this
      const params = {
        bhdId: this.params.ewId,
        warmomgType: this.params.userName ? 0 : 1,
        startTime: this.params.startTime.slice(0, 10) + ' 00:00',
        endTime: this.params.endTime.slice(0, 10) + ' 23:59',
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        userId: this.params.userId ? this.params.userId : this.$store.getters.userData.userId,
        code: this.params.bhdTimeUnit === '日' ? 0 : 1,
      }
      const jsonParam = this.GLOBAL.g_paramJson(params)
      _this.$axios
        .post(this.GLOBAL.alarmServer + '/alarm/getWarningLog', jsonParam)
        .then(function(res) {
          _this.styleListFlag = true
          if (res.data.head.status === 0) {
            if (_this.pageNum === 1) {
              _this.tableData = res.data.body
              _this.bhdLog = res.data.body.bhdLog
              _this.optimizationList = res.data.body.optimizationList
              _this.warningList = res.data.body.warningList
              _this.totalCount = res.data.body.count
            } else {
              _this.tableData = res.data.body
              _this.bhdLog = res.data.body.bhdLog
              _this.optimizationList = res.data.body.optimizationList
              _this.warningList = _this.warningList.concat(res.data.body.warningList)
              _this.totalCount = res.data.body.count
            }
          } else {
            _this.$toast(res.data.head.msg)
          }
        })
    },
    processedInfo() {
      // /workSoftBase/addSoft 添加到已查看
      const _this = this
      const params = {
        bhdId: localStorage.bhdId,
        ewType: this.params.userName ? 0 : 1,
        userId: this.$store.getters.userData.userId,
        ewId: this.params.ewId,
        orgId: this.$store.getters.userData.orgId,
      }
      const jsonParam = this.GLOBAL.g_paramJson(params)
      _this.$axios
        .post(this.GLOBAL.alarmServer + '/alarm/addUserBhdData', jsonParam)
        .then(function(res) {
          if (res.data.head.status === 0) {
            // _this.$toast(res.data.head.msg);
          } else {
            _this.$toast(res.data.head.msg)
          }
        })
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
  .logTabs{
    width: 100%;
    box-sizing: border-box;
    padding:0 10px;
    height:40px;
    background:#fff;
    margin-bottom:10px;
    display: flex;
    flex-direction: row;
    z-index:50;
    span{
      font-size: 15px;
      padding:7px 0;
      margin:0 10px;
      box-sizing: content-box;
    }
    .active{
      border-bottom:3px solid #00cc65;
    }
  }

  .workUlTit{
    box-sizing: content-box;
    font-weight: bolder;
    margin:0 3%;
    font-size: 14px;
    height:28px;
    line-height:28px;
    padding: 5px 10px;
    background:#fff;
    border-bottom: 2px solid #f5f5f5;
    border-radius:  8px 8px 0 0;
  }
  .indexCon {
    display: flex;
    flex-direction: column;
    width:94%;
    margin:0 3% ;
    font-size: 14px;
    .workList {
      display: flex;
      flex-direction: column;
      background:#fff;
      border-radius: 8px;
      margin-bottom: 10px;
      // height:320px;
      .workUl {
        border-bottom: 2px solid #f5f5f5;
        font-weight: bolder;
        line-height:28px;
        padding: 5px 10px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        .banImg{
          width: 16px;
        }
        .more{
          color:#999;
        }
      }
      .workLi{
        flex:1;
        display: flex;
        flex-direction: column;
        line-height:28px;
        padding: 5px 10px;
        border-bottom: 2px solid #f5f5f5;
        .workStatistics{
          display:flex;
          flex-direction: row;
          justify-content: center;
          padding:2px 0;
          text-overflow: -o-ellipsis-lastline;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          -webkit-box-orient: vertical;
          .softColor{
            font-size: 16px;
            // font-weight: bold;
            color:#FFA500;
          }
          .softNum{
            font-size: 16px;
            color:#00CC65;
          }
          .softNumBan{
            font-size: 16px;
            color:#E30101;
          }
          .banImg{
            box-sizing: content-box;
            width:16px;
            height:16px;
            display: inline-block;
            vertical-align: middle;
            padding-right:5px;
            padding-bottom:2.5px;
          }
        }
      }
    }
  }
  .indexConOptimize{
    flex:1;
    display: flex;
    flex-direction: column;
    width:94%;
    margin:0 3% ;
    font-size: 14px;
    .workRecord {
      flex:1;
      border-radius: 8px;
      background:#fff;
      display: flex;
      flex-direction: column;
      // height:320px;
      .workListList{
        // flex:1;
        display: flex;
        flex-direction: column;
        .workLi{
          flex:1;
          display: flex;
          flex-direction: row;
          justify-content: space-between;

          padding: 5px 10px;
          border-bottom: 2px solid #f5f5f5;
          .workLiEll{
            white-space:nowrap;
            overflow:hidden;
            text-overflow:ellipsis;
          }
          span{
            flex:1;
            height:28px;
            line-height:28px;
          }
          span:nth-child(1){
            flex:2
          }
          span:nth-child(2){
            flex:1;
            text-align: center;
          }
          span:nth-child(3){
            flex:2;
            text-align: right;
          }
        }
      }
    }
    .recordActive{
      margin-bottom: 10px;
      border-radius: 8px;
    }
    .workUl {
      font-weight: bolder;
      line-height:28px;
      padding: 5px 10px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      margin-bottom: 10px;
      // background:#fff;
      z-index:50;
      .banImg{
        width: 16px;
      }
      .fire-o{
        border-radius: 50%;
        padding:10px;
        background:#69cd66;
      }
    }
  }
  .warnLogScroll{
    flex: 1;
    font-size: 14px;
    border-radius:  0 0 8px 8px;
    display: flex;
    flex-direction: column;
    // box-sizing: border-box;
    overflow: hidden;
    // background:#fff;
    margin: 0 3%;
    width:94%;
    margin-bottom: 10px;
    .warnLog{
      flex:1;
      display: flex;
      flex-direction: column;
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
              // padding-left:60px;
              text-align:left;
            }
          }
          .title-arrow {
            margin-left:120px;
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
              border-right:2px solid #f5f5f5;
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
  .workLogScroll{
    width:94%;
    margin: 0 3% 10px 3%;
    font-size: 14px;
    border-radius:  0 0 8px 8px;
    flex:1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-sizing: border-box;
    background:#fff;
    .workLog{
      flex:1;
      display: flex;
      flex-direction: column;
      .workLi{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        line-height:28px;
        padding: 5px 10px;
        border-bottom: 2px solid #f5f5f5;
        span{
          flex:1;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }
        span:nth-child(1){
          flex:2;
        }
        span:nth-child(2){
          text-align: center;
        }
        span:nth-child(3){
          text-align: right;
        }
        .adoptType{
          color:#00CC65
        }
        .banType{
          color:#E30101
        }
      }
    }
  }

  .confirmSbmit{
    display:flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    span{
      flex:1;
      display: flex;
      align-items: center;
      justify-content: center;
      line-height:40px;
    }
  }

  .optimize{
    height: 30px;
    line-height:30px;
    width:94%;
    margin:0 3%;
    margin-bottom:10px;
    text-align: center;
    background:#fff;
  }
  // 工作状态弹出层
  .popupUl{
    .popupTitle{
      line-height:28px;
      padding: 2.5px 10px;
      font-size: 14px;
      font-weight: bold;
      border-bottom: 2px solid #f5f5f5;
    }
    .popupContent{
      font-size: 14px;
      padding: 2.5px 10px;
      div{
        display:flex;
        align-items: center;
        // text-indent:2em;
        line-height:18px;
        padding:5px 0;
        .softColor{
          font-size: 16px;
          color:#FFA500;
        }
        .softNum{
          font-size: 16px;
          color:#00CC65;
        }
        .softNumBan{
          font-size: 16px;
          color:#E30101;
        }
        .banImg{
          width:16px;
          height:16px;
          display: inline-block;
          box-sizing: content-box;
          vertical-align: middle;
          padding-right:5px;
        }
      }
    }
  }
  .describe{
    font-size: 14px;
    line-height: 20px;
    /deep/ .van-field__control{
      font-size: 14px;
      line-height: 20px;
    }
    /deep/ .van-field__word-limit{
      font-size: 14px;
      line-height: 20px;
    }
  }
}
</style>

<template>
  <div id="index" @touchmove.prevent>
    <e-header :title="params.departName" border></e-header>
    <div class="logTabs">
      <span :class="warnActive==0?'active':''" @click="warnShow(0)">预警人员</span>
      <span :class="warnActive==1?'active':''" @click="warnShow(1)">预警记录</span>
      <span :class="warnActive==2?'active':''" @click="warnShow(2)">工作信息</span>
      <span :class="warnActive==3?'active':''" @click="warnShow(3)">优化记录</span>
    </div>
    <e-loading :show="styleListFlag"></e-loading>
    <Scroll
      v-if="warnActive == 0 && !styleListFlag"
      ref="workGroupScroll"
      :update-data="[resultList]"
      :refresh-data="[]"
      class="indexCon"
      :probe-type="3"
      :bounce-time="600"
      :listen-scroll="true"
      :scroll-x="false"
      :scroll-y="true"
      @pullingDown="styleRefreshUser"
      @pullingUp="styleLoadMoreUser"
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
      <div v-else style="text-align:center;padding-top:1px;">
        <e-empty></e-empty>
      </div>
    </Scroll>
    <!-- ------------------------------------------------------------------ -->
    <Scroll
      v-if="warnActive == 1 && !styleListFlag"
      ref="warnLogScroll"
      :update-data="[bhdLog]"
      :refresh-data="[]"
      class="warnLogScroll"
      :probe-type="3"
      :bounce-time="300"
      :listen-scroll="true"
      :scroll-x="false"
      :scroll-y="true"
      @pullingDown="styleRefreshLogDownbhdLog"
      @pullingUp="styleLoadMoreLogUpbhdLog"
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
      <div v-else style="text-align:center;padding-top:1px;">
        <e-empty></e-empty>
      </div>
    </Scroll>

    <div v-if="warnActive == 2 && warningList && warningList.length > 0 && !styleListFlag" class="indexConLog">
      <div class="workList" @click="statusShow()">
        <div class="workUl">
          <span>工作状态</span>
          <div>
            <span class="more">更多</span>
            <e-icon name="arrow" color="#999"></e-icon>
          </div>
        </div>
        <div class="workLi">
          <div v-if="params.startTime == params.endTime " class="workStatistics">{{ params.departName }}共<span class="softColor">{{ tableData.daptCount }}</span>人,在这期间({{ params.startTime.slice(0,10) }})使用软件共<span class="softColor">{{ tableData.admittanceSize+tableData.notStandardSize }}</span>项;</div>
          <div v-else class="workStatistics">{{ params.departName }}在这期间({{ params.startTime.slice(0,10) }} — {{ params.endTime.slice(0,10) }})使用软件共<span class="softColor">{{ tableData.admittanceSize+tableData.notStandardSize }}</span>项;</div>
        </div>
      </div>
    </div>
    <div v-if="warnActive == 2 && !styleListFlag && warningList.length > 0" class="workUlTit">
      <span>工作日志</span>
    </div>
    <Scroll
      v-if="warnActive == 2 && !styleListFlag"
      ref="workLogScroll"
      :update-data="[warningList]"
      :refresh-data="[]"
      class="workLogScroll"
      :listen-scroll="true"
      :probe-type="3"
      :bounce-time="300"
      :scroll-x="false"
      :scroll-y="true"
      @pullingDown="styleRefreshLog"
      @pullingUp="styleLoadMoreLog"
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
    <div v-if="warnActive == 3 && !styleListFlag" class="indexConOptimize">
      <div class="workRecord">
      </div>
    </div>
    <Scroll
      v-if="warnActive == 3 && !styleListFlag"
      ref="workListList"
      :update-data="[optimizationList]"
      :refresh-data="[]"
      class="workListList"
      :probe-type="3"
      :bounce-time="300"
      :listen-scroll="true"
      :scroll-x="false"
      :scroll-y="true"
      @pullingDown="styleRefreshLogDown"
      @pullingUp="styleLoadMoreLogUp"
    >
      <div v-if="optimizationList && optimizationList.length > 0 ">
        <div v-for="(item,index) in optimizationList" :key="index" class="workLi" @click="workDetailShow(item)">
          <span class="workLiEll">{{ item.backup }}</span>
          <span>{{ item.userName }}</span>
          <span>{{ item.createTime }}</span>
        </div>
      </div>
      <div v-else style="text-align:center;">
        <e-empty></e-empty>
      </div>
    </Scroll>
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
            <div v-if="params.startTime == params.endTime" class="odiv">{{ params.departName }}共<span class="softColor">{{ tableData.daptCount }}</span>人,在这期间({{ params.startTime.slice(0,10) }})使用软件共<span class="softColor">{{ tableData.admittanceSize+tableData.notStandardSize }}</span>项;</div>
            <div v-else class="odiv">{{ params.departName }}共<span class="softColor">{{ tableData.daptCount }}</span>人,在这期间({{ params.startTime.slice(0,10) }} — {{ params.endTime.slice(0,10) }})使用软件共<span class="softColor">{{ tableData.admittanceSize+tableData.notStandardSize }}</span>项;</div>
            <div><e-img class="banImg" src="assets/images/warn/access.png"></e-img>准入软件<span class="softNum">{{ tableData.admittanceSize }}</span>项,总使用时长<span class="softNum">{{ tableData.admittanceSum }}</span>;</div>
            <div><e-img class="banImg" src="assets/images/warn/noAccess.png"></e-img>非标软件<span class="softNumBan">{{ tableData.notStandardSize }}</span>项,总使用时长<span class="softNumBan">{{ tableData.notStandardSum }}</span> ;</div>
          </div>
        </Scroll>
      </div>
    </van-popup>

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
  </div>
</template>

<script>
import { ELoading, EEmpty } from '@/components'
import { Popup, Field } from 'vant'
import Scroll from 'vue-slim-better-scroll'
export default {
  name: 'Index',
  components: {
    ELoading,
    Scroll,
    EEmpty,
    [Popup.name]: Popup,
    [Field.name]: Field,
  },
  data: () => {
    return {
      styleListFlag: true,
      isLoading: false, // lodding
      params: {
        startTime: '',
        endTime: '',
      }, // 接受跳转传参
      tableData: {}, // 总数据集合

      pageNumUser: 1,
      pageSizeUser: 10,
      resultList: {}, // 人员列表
      totalCountUser: '', // 人员total

      bhdLog: [], // 预警记录
      bhdLogCount: '', // 预警记录total

      warningList: [], // 工作日志
      totalCount: '', // 工作日志total

      optimizationList: [], // 优化记录
      optimizationCount: '', // 优化记录Count

      pageNumLog: 1, // 第几页优化记录
      pageSizeLog: 10, // 每页多少条优化记录

      optimizeBoole: false, // 优化描述内容弹框
      backup: '', // 优化描述内容

      workStatusBoole: false, // 工作状态弹出层
      workLiBoole: false, // 优化记录弹出层
      warnActive: 0, // tabs 第二次
      workDetail: {
        backup: '',
        userName: '',
        createTime: '',
      },
    }
  },
  created() {
    // this.bhdLog = []
    this.styleListFlag = true
    if (this.$route.params.list) {
      this.params = this.$route.params.list
    }
    if (Number(localStorage.isProcessed) === 1) {
      this.processedInfo()
    }
    this.warnActive = 0
    setTimeout(() => {
      this.searchInfoUser()
    }, 500)
  },
  mounted() {},
  activated() {
    this.styleListFlag = true
    setTimeout(() => {
      this.searchInfoUser()
    }, 500)
  },
  methods: {
    workDetailShow(item) {
      this.workLiBoole = true
      this.workDetail = item
    },
    //  跳转至工作日志
    detailShow(list) {
      this.$router.push(
        {
          name: 'WarnListDetail',
          params: {
            list: list,
            data: this.params,
          },
        },
      )
    },
    // 上拉刷新
    styleRefreshUser() {
      this.pageNumUser = 1
      this.searchInfoUser()
    },
    // 下拉加载
    styleLoadMoreUser() {
      if (this.resultList.length < this.totalCountUser) {
        this.pageNumUser++
        this.searchInfoUser()
      } else {
        this.$refs.workGroupScroll.update(true)
      }
    },
    // 查询部门下用户
    searchInfoUser() {
      const _this = this
      const par = {
        deptId: this.params.deptId,
        bhdId: localStorage.bhdId,
        pageNum: this.pageNumUser,
        pageSize: this.pageSizeUser,
        startTime: this.params.startTime,
        endTime: this.params.endTime,
      }
      const jsonPar = this.GLOBAL.g_paramJson(par)
      _this.$axios
        .post(this.GLOBAL.alarmServer + '/alarm/getDeptBhdList', jsonPar)
        .then(function(res) {
          _this.styleListFlag = false
          if (res.data.head.status === 0) {
            if (_this.pageNumUser === 1) {
              _this.resultList = res.data.body.userBhd
              _this.totalCountUser = res.data.body.totalCount
            } else {
              _this.resultList = _this.resultList.concat(res.data.body.userBhd)
              _this.totalCountUser = res.data.body.totalCount
            }
          } else {
            _this.$toast(res.data.head.msg)
          }
        })
    },
    // /workSoftBase/addSoft未处理新增到已处理
    processedInfo() {
      const _this = this
      const params = {
        bhdId: Number(localStorage.bhdId),
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
          } else {
            _this.$toast(res.data.head.msg)
          }
        })
    },
    // ---------------------------------------------------------------------
    // 预警记录
    warnShow(val) {
      this.warnActive = val
      this.styleListFlag = true
      if (val) {
        this.pageNumLog = 1
        this.searchInfoLog()
      } else {
        this.pageNumUser = 1
        this.searchInfoUser()
      }
    },
    // 展开工作状态改变Boolean
    statusShow() {
      this.workStatusBoole = true
    },

    // 上拉刷新 预警记录
    styleRefreshLogDownbhdLog() {
      this.pageNumLog = 1
      this.searchInfoLog()
    },
    // 下拉加载 预警记录
    styleLoadMoreLogUpbhdLog() {
      if (this.totalCount > this.bhdLog.length) {
        this.pageNumLog++
        this.searchInfoLog()
      } else {
        this.$refs.warnLogScroll.update(true)
      }
    },
    // 上拉刷新  工作日志
    styleRefreshLog() {
      this.pageNumLog = 1
      this.searchInfoLog()
    },
    // 下拉加载 工作日志
    styleLoadMoreLog() {
      if (this.totalCount > this.warningList.length) {
        this.pageNumLog++
        this.searchInfoLog()
      } else {
        this.$refs.workLogScroll.update(true)
      }
    },
    // 上拉刷新 优化记录
    styleRefreshLogDown() {
      this.pageNumLog = 1
      this.searchInfoLog()
    },
    // 下拉加载 优化记录
    styleLoadMoreLogUp() {
      if (this.totalCount > this.optimizationList.length) {
        this.pageNumLog++
        this.searchInfoLog()
      } else {
        this.$refs.workListList.update(true)
      }
    },
    // 查询
    searchInfoLog() {
      // / alarm/getWarningLog预警日志
      const _this = this
      const params = {
        bhdId: this.params.ewId,
        warmomgType: this.params.userName ? 0 : 1,
        startTime: this.params.startTime.slice(0, 10) + ' 00:00',
        endTime: this.params.endTime.slice(0, 10) + ' 23:59',
        pageNum: this.pageNumLog,
        pageSize: this.pageSizeLog,
        deptId: this.params.deptId,
      }
      const jsonParam = this.GLOBAL.g_paramJson(params)
      _this.$axios
        .post(this.GLOBAL.alarmServer + '/alarm/getWarningLog', jsonParam)
        .then(function(res) {
          _this.styleListFlag = false
          if (res.data.head.status === 0) {
            if (_this.pageNumLog === 1) {
              _this.tableData = res.data.body
              _this.bhdLog = res.data.body.bhdLog// 预警记录
              _this.bhdLogCount = res.data.body.bhdLogCount

              _this.optimizationList = res.data.body.optimizationList// 优化记录
              _this.optimizationCount = res.data.body.optimizationCount

              _this.warningList = res.data.body.warningList// 工作日志
              _this.totalCount = res.data.body.count

              // if (_this.warnActive === 1) {
              //   if (_this.bhdLog.length === _this.totalCount) {
              //     _this.$refs.warnLogScroll.update(true)
              //   }
              // }
              // if (_this.warnActive === 2) {
              //   if (_this.warningList.length === _this.totalCount) {
              //     _this.$refs.workLogScroll.update(true)
              //   }
              // }
              // if (_this.warnActive === 3) {
              //   if (_this.optimizationList.length === _this.optimizationCount) {
              //     _this.$refs.workListList.update(true)
              //   }
              // }
            } else {
              _this.tableData = res.data.body
              _this.bhdLog = _this.bhdLog.concat(res.data.body.bhdLog)
              _this.warningList = _this.warningList.concat(res.data.body.warningList)
              _this.optimizationList = _this.optimizationList.concat(res.data.body.optimizationList)
            }
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
        border-bottom: 3px solid #00cc65;
      }

    }
  }
  .indexCon {
    flex: 1;
    overflow: hidden;
    width:94%;
    margin: 0 3% 10px 3%;

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
  // ---------------------------------------------------------
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
      padding:3.5px 0;
      margin:0 10px;
      line-height:30px;
      height:30px;
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
  .indexConLog {
    display: flex;
    flex-direction: column;
    width:94%;
    margin:0 3% ;
    font-size: 14px;
    .workList {
      background:#fff;
      border-radius: 8px;
      margin-bottom: 10px;
      .workUl {
        border-bottom: 2px solid #f5f5f5;
        font-weight: bolder;
        line-height:28px;
        padding:5px 10px;
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
          text-overflow: -o-ellipsis-lastline;
          overflow: hidden;
          padding:2px 0;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          -webkit-box-orient: vertical;
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
            vertical-align: middle;
            padding-right:5px;
            padding-bottom:2.5px;
          }
        }
      }
    }
  }
  .indexConOptimize{
    display: flex;
    flex-direction: column;
    width:94%;
    margin:0 3% ;
    font-size: 14px;
    .workRecord {
      border-radius: 8px 8px 0 0;
      background:#fff;
      .workUl {
        border-bottom: 2px solid #f5f5f5;
        font-weight: bolder;
        padding: 5px 10px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        .banImg{
          width: 16px;
        }
      }
    }
  }

  .workListList{
    flex:1;
    width:94%;
    margin:0 3%;
    display: flex;
    font-size:14px;
    flex-direction: column;
    border-radius: 8px;
    background:#fff;
    margin-bottom: 10px;
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

  .warnLogScroll{
    flex: 1;
    font-size: 14px;
    border-radius:  0 0 8px 8px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
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
          width: 12px;
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
      .odiv{
        display:flex;
        align-items: center;
        padding:5px 0;
        text-overflow: -o-ellipsis-lastline;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 10;
        line-clamp: 10;
        -webkit-box-orient: vertical;
      }
      div{
        display:flex;
        align-items: center;
        line-height:28px;
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
          box-sizing: content-box;
          display: inline;
          width:16px;
          height:16px;
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

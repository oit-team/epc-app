<template>
  <div id="index" @touchmove.prevent>
    <!-- <div class='header'>
      <div class="img" @click="back">
        <img class="banImg" src="/static/imgs/back.png" >
      </div>
      <span class="tit">{{query.departName}}</span>
      <span class="placeLabel" ></span>
    </div> -->
    <e-header :title="query.departName" border @back="back"></e-header>
    <div class="logTabs">
      <span :class="warnActive==0?'active':''" @click="warnShow(0)">预警人员</span>
      <span :class="warnActive==1?'active':''" @click="warnShow(1)">预警记录</span>
      <span :class="warnActive==2?'active':''" @click="warnShow(2)">工作信息</span>
      <span :class="warnActive==3?'active':''" @click="warnShow(3)">优化记录</span>
    </div>
    <div v-if="!styleListFlag"><van-loading color="#00a2ea" /></div>
    <Scroll
      v-if="warnActive == 0 && styleListFlag"
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
            <van-icon class="title-img" :name="list.userName?'manager-o':'cluster-o'" />
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
        <van-empty description="暂无数据" />
      </div>
    </Scroll>
    <!-- ------------------------------------------------------------------ -->
    <Scroll
      v-if="warnActive == 1 && styleListFlag"
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
            <van-icon class="title-img" :name="query.userName?'manager-o':'cluster-o'" />
            <div class="title-li">
              <span class="title-span">{{ query.departName?query.departName:query.userName }}</span>
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
        <van-empty description="暂无数据" />
      </div>
    </Scroll>

    <div v-if="warnActive == 2 && warningList && warningList.length > 0 && styleListFlag" class="indexConLog">
      <div class="workList" @click="statusShow()">
        <div class="workUl">
          <span>工作状态</span>
          <div>
            <span class="more">更多</span>
            <van-icon name="arrow" color="#999" />
          </div>
          <!-- <img src="/static/imgs/rightArrowGrey.png" > -->
        </div>
        <div class="workLi">
          <div v-if="query.startTime == query.endTime " class="workStatistics">{{ query.departName }}共<span class="softColor">{{ tableData.daptCount }}</span>人,在这期间({{ query.startTime.slice(0,10) }})使用软件共<span class="softColor">{{ tableData.admittanceSize+tableData.notStandardSize }}</span>项;</div>
          <div v-else class="workStatistics">{{ query.departName }}在这期间({{ query.startTime.slice(0,10) }} — {{ query.endTime.slice(0,10) }})使用软件共<span class="softColor">{{ tableData.admittanceSize+tableData.notStandardSize }}</span>项;</div>
        </div>
      </div>
    </div>
    <div v-if="warnActive == 2 && styleListFlag" class="workUlTit">
      <span>工作日志</span>
    </div>
    <Scroll
      v-if="warnActive == 2 && styleListFlag"
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
        <van-empty description="暂无数据" />
      </div>
    </Scroll>
    <div v-if="warnActive == 3 && styleListFlag" class="indexConOptimize">
      <div class="workRecord">
      </div>
    </div>
    <Scroll
      v-if="warnActive == 3 && styleListFlag"
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
        <van-empty description="暂无数据" />
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
            <div v-if="query.startTime == query.endTime" class="odiv">{{ query.departName }}共<span class="softColor">{{ tableData.daptCount }}</span>人,在这期间({{ query.startTime.slice(0,10) }})使用软件共<span class="softColor">{{ tableData.admittanceSize+tableData.notStandardSize }}</span>项;</div>
            <div v-else class="odiv">{{ query.departName }}共<span class="softColor">{{ tableData.daptCount }}</span>人,在这期间({{ query.startTime.slice(0,10) }} — {{ query.endTime.slice(0,10) }})使用软件共<span class="softColor">{{ tableData.admittanceSize+tableData.notStandardSize }}</span>项;</div>
            <div><img class="banImg" src="/static/imgs/access.png" />准入软件<span class="softNum">{{ tableData.admittanceSize }}</span>项,总使用时长<span class="softNum">{{ tableData.admittanceSum }}</span>;</div>
            <div><img class="banImg" src="/static/imgs/noAccess.png" />非标软件<span class="softNumBan">{{ tableData.notStandardSize }}</span>项,总使用时长<span class="softNumBan">{{ tableData.notStandardSum }}</span> ;</div>
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
export default {
  name: 'Index',
  data() {
    return {
      styleListFlag: false,
      isLoading: false, // lodding
      query: {
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
  created() {},
  mounted() {},
  activated() {
    this.styleListFlag = false
    this.bhdLog = []

    this.query = this.$route.query.list
    if (localStorage.isProcessed === 1) {
      this.processedInfo()
    }
    this.warnActive = 0
    setTimeout(() => {
      this.searchInfoUser()
    }, 500)
  },
  methods: {
    workDetailShow(item) {
      this.workLiBoole = true
      this.workDetail = item
    },
    // 返回
    back() {
      this.$router.push({
        path: '/Warn',
        query: {
          specialVal: 2,
        },
      })
    },
    //  跳转至工作日志
    detailShow(list) {
      this.$router.push(
        {
          path: '/WarnListDetail',
          query: {
            list: list,
            data: this.query,
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
        deptId: this.query.deptId,
        bhdId: localStorage.bhdId,
        pageNum: this.pageNumUser,
        pageSize: this.pageSizeUser,
        startTime: this.query.startTime,
        endTime: this.query.endTime,
      }
      const jsonPar = this.GLOBAL.g_paramJson(par)
      _this.$axios
        .post(this.GLOBAL.alarmServer + '/alarm/getDeptBhdList', jsonPar)
        .then(function(res) {
          _this.styleListFlag = true
          if (res.data.head.status === 0) {
            if (_this.pageNumUser === 1) {
              _this.resultList = res.data.body.userBhd
              _this.totalCountUser = res.data.body.totalCount
              if (_this.resultList.length === _this.totalCountUser) {
                _this.$refs.workGroupScroll.update(true)
              }
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
        bhdId: localStorage.bhdId,
        ewType: this.query.userName ? 0 : 1,
        userId: localStorage.userId,
        ewId: this.query.ewId,
        orgId: localStorage.orgId,
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
    // ---------------------------------------------------------------------
    // 预警记录
    warnShow(val) {
      this.warnActive = val
      this.styleListFlag = false
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
      // this.$refs.workLogScroll.update(true);
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
      // this.$refs.workLogScroll.update(true);
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
      // this.$refs.workLogScroll.update(true);
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
        bhdId: this.query.ewId,
        warmomgType: this.query.userName ? 0 : 1,
        startTime: this.query.startTime.slice(0, 10) + ' 00:00',
        endTime: this.query.endTime.slice(0, 10) + ' 23:59',
        pageNum: this.pageNumLog,
        pageSize: this.pageSizeLog,
        deptId: this.query.deptId,
      }
      const jsonParam = this.GLOBAL.g_paramJson(params)
      _this.$axios
        .post(this.GLOBAL.alarmServer + '/alarm/getWarningLog', jsonParam)
        .then(function(res) {
          _this.styleListFlag = true
          if (res.data.head.status === 0) {
            if (_this.pageNumLog === 1) {
              _this.tableData = res.data.body
              _this.bhdLog = res.data.body.bhdLog// 预警记录
              _this.bhdLogCount = res.data.body.bhdLogCount

              _this.optimizationList = res.data.body.optimizationList// 优化记录
              _this.optimizationCount = res.data.body.optimizationCount

              _this.warningList = res.data.body.warningList// 工作日志
              _this.totalCount = res.data.body.count

              if (_this.warnActive === 1) {
                if (_this.bhdLog.length === _this.totalCount) {
                  _this.$refs.warnLogScroll.update(true)
                }
              }
              if (_this.warnActive === 2) {
                if (_this.warningList.length === _this.totalCount) {
                  _this.$refs.workLogScroll.update(true)
                }
              }
              if (_this.warnActive === 3) {
                if (_this.optimizationList.length === _this.optimizationCount) {
                  _this.$refs.workListList.update(true)
                }
              }
            } else {
              _this.tableData = res.data.body
              _this.bhdLog = _this.bhdLog.concat(res.data.body.bhdLog)
              _this.warningList = _this.warningList.concat(res.data.body.warningList)
              _this.optimizationList = _this.optimizationList.concat(res.data.body.optimizationList)
            }

            // _this.tableData = res.data.body
            // _this.bhdLog = res.data.body.bhdLog
            // _this.optimizationList = res.data.body.optimizationList
            // _this.warningList = res.data.body.warningList
          } else {
            _this.$toast(res.data.head.msg)
          }
        })
    },
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
  //padding: 20px 24px;

  .header {
    width: 100%;
    height: 1.2rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    font-size: 32px;
    color: #333;
    box-sizing: border-box;
    // background-color: #ffffff;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    // padding: 0px 16px;
    padding:0 3%;

  }
  .header .img{
    height:1.2rem;
    display: flex;
    align-items: center;
  }
  .header .img img {
    width: 36px;
    height: 36px;
    padding-right:30px;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
  }
  .header .tit {
    height: 1.2rem;
    line-height:1.2rem;
    font-size: 36px;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
  }
  .header .placeLabel {
    height: 1.2rem;
    line-height:1.2rem;
    width: 66px;
    text-align: center;
  }
  .box {
    width: 100%;
    height: 80px;
    // line-height: 1.2rem;
    display: flex;
    background-color: #ffffff;
    // border-bottom: 2px solid #f5f5f5;
    justify-content: center;

    .box-list {
      //width: 100%;
      width: 500px;
      -webkit-box-flex: 1;
      // flex: 1;
      // overflow: hidden;
      display: flex;
      flex-direction: row;
      // align-items: center;
      justify-content: space-between;
      height: 80px;
      // box-sizing: border-box;
      li {
        font-size: 30px;
        color: #333;
        white-space: nowrap;
        // box-sizing: border-box;
        margin: 0 30px;
        height: 60px;
        line-height: 60px;
        padding:7px 0;
      }
      .active {
        border-bottom: 6px solid #00cc65;
      }

    }
  }
  .indexCon {
    flex: 1;
    overflow: hidden;
    width:94%;
    margin: 0 3% 20px 3%;
    // /deep/ .van-empty__description{
    //   font-size:28px;
    // }

    .mineTopBox {
      display: flex;
      flex-direction: column;
      font-size: 28px;
      align-items: center;
      box-sizing: border-box;
      background-color: #ffffff;
      border-radius: 16px;
      color: #333;
      margin-bottom: 20px;
      position: relative;// 为子元素定位

      .title {
        width: 100%;
        border-bottom: 4px solid #f5f5f5;
        height: 80px;
        display: flex;
        flex-direction: row;
        align-items: center;

        .title-img {
          padding:10px 10px 0 10px;
          font-size: 40px;
        }
        .title-li{
          flex:1;
          display: flex;
          flex-direction: row;
          align-items:baseline ;
          padding-top:20px;
          .title-span {
            width:120px;
            font-weight: bolder;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .title-date{
            font-size: 24px;
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
          border-top: 30px solid #a0a0a0;
          border-right: 30px solid #a0a0a0;
          border-bottom: 30px solid transparent;
          border-left: 30px solid transparent;
          border-radius: 0 16px 0 0;
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
        height: 160px;
        font-size: 26px;
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
          padding: 20px 0;
          .list-li{
            .color_grey {
              color: #333;
              padding-bottom: 10px;
            }
            .color-in{
              color:#00CC65;
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
        margin-left: 20px;
      }

      .mf60 {
        margin-left: 60px;
      }

      .tabMark {
        position: absolute;
        top: 0;
        left: 0;
        height: 40px;
      }

      .more-icon {
        width: 12px;
        vertical-align: baseline;
        float: right;
      }
    }
  }
  // ---------------------------------------------------------
  .logTabs{
    width: 100%;
    box-sizing: border-box;
    // margin-top:20px;
    padding:0 20px;
    height:80px;
    background:#fff;
    margin-bottom:20px;
    display: flex;
    flex-direction: row;
    // justify-content: space-between;
    span{
      font-size: 30px;
      padding:7px 0;
      margin:0 20px;
      line-height:60px;
      height:60px;
      box-sizing: content-box;
    }
    .active{
      border-bottom:6px solid #00cc65;
    }
  }

  .workUlTit{
    box-sizing: content-box;
    font-weight: bolder;
    margin:0 3%;
    font-size: 28px;
    height:56px;
    line-height:56px;
    padding: 10px 20px;
    background:#fff;
    border-bottom: 4px solid #f5f5f5;
    border-radius:  16px 16px 0 0;
  }
  .indexConLog {
    display: flex;
    flex-direction: column;
    width:94%;
    margin:0 3% ;
    font-size: 28px;
    .workList {
      background:#fff;
      border-radius: 16px;
      margin-bottom: 20px;
      // height:320px;
      .workUl {
        border-bottom: 4px solid #f5f5f5;
        font-weight: bolder;
        line-height:56px;
        padding:10px 20px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        img{
          width: 32px;
        }
        .more{
          color:#999;
        }
      }
      .workLi{
        flex:1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 10px 20px;
        border-bottom: 4px solid #f5f5f5;
        .workStatistics{
          // text-indent:2em;
          line-height: 56px;
          text-overflow: -o-ellipsis-lastline;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          -webkit-box-orient: vertical;
          .softColor{
            font-size: 32px;
            // color:#fccb02;
            color:#FFA500;
          }
          .softNum{
            font-size: 32px;
            color:#00CC65;
          }
          .softNumBan{
            font-size: 32px;
            color:#E30101;
          }
          img{
            width:32px;
            height:32px;
            vertical-align: middle;
            padding-right:10px;
            padding-bottom:5px;
          }
        }
      }
    }
  }
  .indexConOptimize{
    // flex:1;
    display: flex;
    flex-direction: column;
    width:94%;
    margin:0 3% ;
    font-size: 28px;
    .workRecord {
      // flex:1;
      border-radius: 16px 16px 0 0;
      background:#fff;
      // margin-bottom: 20px;
      // height:320px;
      .workUl {
        border-bottom: 4px solid #f5f5f5;
        font-weight: bolder;
        line-height:56px;
        padding: 10px 20px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        img{
          width: 32px;
        }
      }
      // .workListList{
      //   flex:1;
      //   display: flex;
      //   flex-direction: column;
      //   .workLi{
      //     flex:1;
      //     display: flex;
      //     flex-direction: row;
      //     justify-content: space-between;
      //     line-height:56px;
      //     padding: 5px 20px;
      //     border-bottom: 4px solid #f5f5f5;
      //     .workLiEll{
      //       white-space:nowrap;
      //       overflow:hidden;
      //       text-overflow:ellipsis;
      //     }
      //     span{
      //       flex:1;
      //     }
      //     span:nth-child(1){
      //       flex:2
      //     }
      //     span:nth-child(2){
      //       flex:1;
      //       text-align: center;
      //     }
      //     span:nth-child(3){
      //       text-align: right;
      //     }
      //   }
      // }
    }
  }

  .workListList{
    flex:1;
    width:94%;
    margin:0 3%;
    display: flex;
    font-size:28px;
    flex-direction: column;
    border-radius: 16px 16px 16px 16px;
    background:#fff;
    margin-bottom: 20px;
    .workLi{
      flex:1;
      display: flex;
      flex-direction: row;
      justify-content: space-between;

      padding: 10px 20px;
      border-bottom: 4px solid #f5f5f5;
      .workLiEll{
        white-space:nowrap;
        overflow:hidden;
        text-overflow:ellipsis;
      }
      span{
        flex:1;
        height:56px;
        line-height:56px;
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
    font-size: 28px;
    border-radius:  0 0 16px 16px;
    display: flex;
    flex-direction: column;
    // box-sizing: border-box;
    overflow: hidden;
    // background:#fff;
    margin: 0 3%;
    width:94%;
    margin-bottom: 20px;
    .warnLog{
      flex:1;
      display: flex;
      flex-direction: column;
      .mineTopBox {
        display: flex;
        flex-direction: column;
        font-size: 28px;
        align-items: center;
        box-sizing: border-box;
        background-color: #ffffff;
        border-radius: 16px;
        color: #333;
        margin-bottom: 20px;
        position: relative;// 为子元素定位

        .title {
          width: 100%;
          border-bottom: 4px solid #f5f5f5;
          height: 80px;
          display: flex;
          flex-direction: row;
          align-items: center;

          .title-img {
            padding:10px 10px 0 10px;
            font-size: 40px;
          }
          .title-li{
            flex:1;
            display: flex;
            flex-direction: row;
            align-items:baseline ;
            padding-top:20px;
            .title-span {
              width:120px;
              font-weight: bolder;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .title-date{
              font-size: 24px;
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
            border-top: 30px solid #a0a0a0;
            border-right: 30px solid #a0a0a0;
            border-bottom: 30px solid transparent;
            border-left: 30px solid transparent;
            border-radius: 0 16px 0 0;
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
          height: 160px;
          font-size: 26px;
          display: flex;
          flex-direction: row;
          align-items: center;
          .content-box-li {
            flex: 1;
            text-align: center;
            padding: 20px 0;
            .list-li{
              .color_grey {
                color: #333;
                padding-bottom: 10px;
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
          margin-left: 20px;
        }

        .mf60 {
          margin-left: 60px;
        }

        .tabMark {
          position: absolute;
          top: 0;
          left: 0;
          height: 40px;
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
    margin: 0 3% 20px 3%;
    font-size: 28px;
    border-radius:  0 0 16px 16px;
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
        line-height:56px;
        padding: 10px 20px;
        border-bottom: 4px solid #f5f5f5;
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
      line-height:80px;
    }
  }

  .optimize{
    height: 60px;
    line-height:60px;
    width:94%;
    margin:0 3%;
    margin-bottom:20px;
    text-align: center;
    background:#fff;
  }
  // 工作状态弹出层
  .popupUl{
    .popupTitle{
      line-height:56px;
      padding: 5px 20px;
      font-size: 28px;
      font-weight: bold;
      border-bottom: 4px solid #f5f5f5;
    }
    .popupContent{
      font-size: 28px;
      padding: 5px 20px;
      .odiv{
        display:flex;
        align-items: center;
        // text-indent:2em;
        line-height:56px;
        padding:10px 0;
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
        // text-indent:2em;
        line-height:56px;
        padding:10px 0;
        .softColor{
          font-size: 32px;
          // font-weight: bold;
          color:#FFA500;
        }
        .softNum{
          font-size: 32px;
          color:#00CC65;
        }
        .softNumBan{
          font-size: 32px;
          color:#E30101;
        }
        img{
          box-sizing: content-box;
          display: inline;
          width:32px;
          height:32px;
          vertical-align: middle;
          padding-right:10px;
        }
      }
    }
  }
  .describe{
    font-size: 28px;
    line-height: 40px;
    /deep/ .van-field__control{
      font-size: 28px;
      line-height: 40px;
    }
    /deep/ .van-field__word-limit{
      font-size: 28px;
      line-height: 40px;
    }
  }
}
</style>

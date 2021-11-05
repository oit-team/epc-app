<template>
  <div class="bg-white">
    <e-header title="意见反馈"></e-header>
    <div class="feedback">
      <!-- <Header title="意见反馈"></Header> -->
      <div class="feedback-content">
        <van-field
          v-model="message"
          rows="2"
          autosize
          type="textarea"
          maxlength="1000"
          placeholder="请写下你的意见或建议"
          show-word-limit
          class="fieldText"
        />
        <div class="feedButtom">
          <div>选择反馈类型</div>
          <van-radio-group v-model="radio" direction="horizontal" class="feedUl">
            <van-radio name="1" icon-size="14px">程序bug</van-radio>
            <van-radio name="2" icon-size="14px">内容意见</van-radio>
            <van-radio name="3" icon-size="14px">其他</van-radio>
          </van-radio-group>
        </div>
        <van-button class="btn" color="#333" plain @click="btnShow()">提交</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import { Field, Radio, RadioGroup, Button } from 'vant'

export default {
  name: 'Feedback',
  components: {
    [Field.name]: Field,
    [Radio.name]: Radio,
    [RadioGroup.name]: RadioGroup,
    [Button.name]: Button,
  },
  data() {
    return {
      radio: '',
      message: '',
    }
  },
  mounted() {
  },
  updated() {
  },
  methods: {
    btnShow() {
      if (this.radio && this.message) {
        this.$toast('提交成功，客服将于24小时内与您联系。')
        this.radio = ''
        this.message = ''
        // this.$router.go(-1);
      } else {
        if (this.radio) {
          this.$toast('请写下你的意见或建议')
        }
        if (this.message) {
          this.$toast('请选择反馈类型')
        }
        if (!this.radio && !this.message) {
          this.$toast('请写下你的意见或建议,请选择反馈类型')
        }
      }
    },
    checkedShow(val) {
      if (val === 1) {
        this.checked2 = false
        this.checked3 = false
      } else if (val === 2) {
        this.checked1 = false
        this.checked3 = false
      } else if (val === 3) {
        this.checked2 = false
        this.checked1 = false
      }
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.feedback{
  margin-top:20px;
  background:#fff;
  color: #333333;
  font-family:PingFang-SC-Medium;
  align-items: center;
  width: 100%;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  .feedback-content{
    display:flex;
    flex-direction: column;
    box-sizing: border-box;
    width:100%;
    .fieldText{
      border:1px solid #e5e5e5;
    }
    .feedButtom{
      border:1px solid #e5e5e5;
      margin-top:10px;
      color:#000;
      padding: 10px;
      .feedUl{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        height:40px;
      }
    }
    .btn{
      font-size: 16px;
      width:100%;
      color:#aaa !important;
      border-color:#ccc !important;
      background: #f5f5f5;
      margin:20px 0;
    }
  }
}
</style>

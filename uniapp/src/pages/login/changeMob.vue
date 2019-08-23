<template>
  <view class="changeMob container">
    <view class="inner">
      <view class="changeMob-head">
        <text class="title">{{changeMobTitle}}</text>
        <text class="tips">{{changeMobTip}}</text>
      </view>
      <view class="form-filed" :class="mobState?'focus':''" v-show="step == 1">
        <input placeholder-class="phcolor" class="tui-input" :focus="true" name="mobile" placeholder="请输入你的新手机号码" maxlength="11" v-model="mob"
					 type="number" @focus="focusEvt('mob')" @blur="blurEvt" auto-focus/>
        <tui-icon name="close-fill" :size='clearSize' color='#333' @tap="clearEvt(1)" v-if="mob && mobState"></tui-icon>
      </view>
      <view class="form-filed" :class="verifyState?'focus':''" v-show="step == 2">
        <input placeholder-class="phcolor" class="tui-input verify" type="number" v-model="verifyCode" placeholder="请输入验证码" maxlength="6" @focus="focusEvt('verify')" @blur="blurEvt" @confirm="next"/>
        <tui-icon name="close-fill" :size='clearSize' color='#333' @tap="clearEvt(2)" v-if="verifyState && verifyCode"></tui-icon>
        <verifyCode ref="verifyCode" :mob="mob" :type="type"/>
      </view>
     </view>
     <view class="submit">
       <button type="primary"  @click="next" :class="(mob.length == 11 && step==1) || (verifyCode.length == 6 && step==2)?'login':''">下一步</button>
       <!-- <van-button round block type="primary" @click="next" :class="(mob.length == 11 && step==1) || (verifyCode.length == 6 && step==2)?'login':''">下一步</van-button> -->
     </view>
  </view> 
</template>

<script>
    import verifyCode from '@/components/verifyCode'
    import tuiButton from "@/components/tui/button/button"
    import tuiIcon from "@/components/tui/icon/icon"
    import { setTimeout } from 'timers';
    export default {
      name: 'changeMob',
      components: {verifyCode, tuiButton, tuiIcon},
      data(){
        return {
          pageTitle: '修改手机号',
          changeMobTitle: '输入手机号',
          changeMobTip: '请告诉我们，您需要绑定的新手机号码',
          member_id: '',
          step: 1,
          mob: '',
          verifyCode: '',
          mobState: false,
          verifyState: false,
          type: 4,
          clearSize: 18,
        }
      },
      methods: {
        focusEvt(state){
          setTimeout(()=>{
            state == 'mob' ? this.mobState = true : this.verifyState = true
          }, 150)
        },
        clearEvt(type){
          type == 1 ? this.mob = '' :  this.verifyCode = ''
        },
        blurEvt(e){
          setTimeout(()=>{
            this.mobState = this.verifyState = false
          }, 100)  
        },
        checkMobile(){
            if(this.mob.length != 11) return
            if(!this.$regs.isPhone.test(this.mob)){
              this.$mUtils.toast('手机号格式不正确')
              return 
            }
            let d = {
              mobile: this.mob
            }
            this.$api.checkMobile({
                cmd:{member:'checkMobile'},
                data:d
            }).then(res=>{
                if(res.code == 1) {
                  this.$mUtils.toast('手机号已被注册')
                }else{
                  this.step++
                  this.$refs.verifyCode.getVerify()
                  this.changeMobTitle = '手机号验证'
                  this.changeMobTip = '验证码已发送至'+this.mob.slice(0,3) + '*****' +this.mob.slice(8,11)  
                }
            }).catch(res=>{

            })
            
        },
        changeMob(){
          if(this.verifyCode.length != 6) return
          let d = {
            mobile: this.mob,
            verify_code: this.verifyCode,
            member_id: this.member_id
          }
          this.$api.changemobile({
              cmd:{member:'changemobile'},
              data:d
          }).then(res=>{
              if(res.code == 1) {
                this.$store.commit('logout')
                this.$mUtils.toast('修改成功，前往重新登录')
                this.$mRouter.push({
                  route: this.$mRoutesConfig.login,
                  query: {}
                })
              }else{
                this.$mUtils.toast(res.msg)
              }
          }).catch(res=>{

          })
        },
        next(){
          this.step === 1 ? this.checkMobile() : this.changeMob()
        }
      },
      onLoad(){
        this.member_id = this.$store.state.userInfo.member_id
      }
    }
</script>

<style lang="scss" type="text/scss">
.changeMob{
  background: #fff;
  .inner{
    display: flex;
    flex-direction: column;
    padding: 0 100upx;
    padding-top: 80upx;
  }
  .changeMob-head{
    flex-direction: column;
    text-align: left;
    color: #333;
    >.title {
      font-size: 32upx;
      line-height: 48upx;
      font-weight: 600;
    }
    >.tips{
      font-size: 28upx;
      line-height: 40upx;
      margin: 30upx 0 40upx;
    }
  }
  .form-filed {
    position: relative;
    display: flex;
    // justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 88upx;
    border-bottom: 4upx solid transparent;
    padding-bottom: 4upx;
    .tui-input{
      width: 100%;
      line-height: 80upx;
    }
    input{
      height: 100%;
      border: 0;
      color: #333;
      font-size:32upx;
      background: transparent;
      &.mob, &.pwd{
        width: 100%;
      }
      &.verify{
        width: calc(100% - 180upx);
      }
    }
    &:after{
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      content: '';
      border-bottom: 2upx solid #ebebeb;
    }
    &.focus{
      transition:all 1s ease 0s;
      border-bottom: 4upx solid $site-default-color;
      &:after{
        border: 0;
      }
    }
        }
      .submit{
        margin-top: 120upx;
        padding: 0 100upx;
                uni-button{
          width: 100%;
          background: #ccc;
          color: #fff!important;
          font-size: 32upx;
          margin-left: 0;
          padding: 0;
          letter-spacing: 2upx;
          border: 0!important;
          &.login{
            background: $site-default-color;
          }
        }
        button{
          width: 100%;
          background: #ccc;
          color: #fff!important;
          padding: 0;
          font-size: 32upx;
          border: 0;
          &.login{
            background: $site-default-color;
          }
        }
      }
}
</style>

<template>
    <view class="verify-component">
        <tui-button size="mini" class="verify" shape="circle" :plain="true" :disabled="disabled" :class="mob.length == 11?'light':''" @click="getVerify">{{verifyText}}</tui-button>
    </view>
</template>
<script>
    import tuiButton from "@/components/tui/button/button"
    export default{
        name: 'verifyCode',
        components: {tuiButton},
        props: {
            mob: {
              type: String
            },
            type: {
              type: Number
            }
        },
        data() {
            return {
              verifyText: '获取验证码',
              disabled: false,
            }
        },
        methods: {
            getVerify(){
              if(this.mob.length < 11) return
              if(!this.$regs.isPhone.test(this.mob)){
                this.$mUtils.toast('手机格式不正确')
                return 
              }
              this.disabled = true
              this.verifyText = '请稍候...'
              this.$api.mobileVerifyCode({
                  cmd:{member:'mobileVerifyCode'},
                  data:{
                    type: this.type,
                    mobile: this.mob
                  }
              }).then(res=>{
                  console.log(res)
                  if(res.code===1){
                    this.countDown(60)
                  }else{
                    this.disabled = false
                    this.verifyText = '获取验证码'
                    this.$mUtils.toast(res.msg)
                  }
              }).catch(err=>{

              })
           },

           countDown(seconds){
              this.verifyText = `已发送${seconds}s`
              var auth_timetimer =  setInterval(()=>{
                  if(seconds > 0 ){
                     this.verifyText = `已发送${seconds}s`
                     --seconds
                  }else{
                      this.verifyText='重新获取'
                      this.disabled = false
                      clearInterval(auth_timetimer)
                  }
              }, 1000);
           }
        },
        created() {
        }        
    }
</script>
<style lang="scss">
    uni-button{
      &.verify{
        color: #999!important;
        padding: 0;
        width: 156upx;
        height: 48upx;
        line-height: 48upx;
        font-size: 24upx;
        box-sizing: border-box;
        background: transparent;
        border-radius: 24upx;
        &:after{
            border: 2upx solid $uni-text-color-grey!important;
        }
        &.light{
            color: $site-default-color!important;
            &:after{
              border-color: $site-default-color!important;
            }
        }
        
      }
    }
    tui-button{
      &.verify{
        height: 48upx;
        button{
          width: 156upx!important;
          height: 100%!important;
          line-height: 44upx!important;
          font-size: 24upx!important;
          padding: 0;
          border-radius: 24upx!important;
          border: 2upx solid #999!important;
          color: #999;
        }
        &.light{
          button{
            background: transparent;
            color: $site-default-color!important;
            border: 2upx solid $site-default-color!important;
          }
        }
      }
      
    }
</style>
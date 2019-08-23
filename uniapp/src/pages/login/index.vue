<template>
  <view class="login container">
    <view class="inner">
      <view class="bg-box">
        <image :src="logo" class="bg-logo"></image>
      </view>
      <view class="form">
        <view class="form-filed" :class="mobState?'focus':''">
          <image :src="mobIcon" class="ic-mob"></image>
          <input placeholder-class="phcolor" class="tui-input" :focus="true" name="mobile" placeholder="请输入手机号码" maxlength="11" v-model="mob"
					 type="number" @focus="focusEvt('mob')" @blur="blurEvt" auto-focus/>
           <tui-icon name="close-fill" :size='clearSize' color='#333' @tap="clearEvt(1)" v-if="mobState && mob"></tui-icon>
        </view>
        <view class="form-filed" :class="verifyState?'focus':''">
          <image :src="verifyIcon" ></image>
          <input placeholder-class="phcolor" class="tui-input verify" type="number" v-model="verifyCode" placeholder="请输入验证码" maxlength="6" @focus="focusEvt('verify')" @blur="blurEvt" @confirm="login"/>
          <tui-icon name="close-fill" :size='clearSize' color='#333' @tap="clearEvt(2)" v-if="verifyState && verifyCode"></tui-icon>
          <verifyCode :mob="mob" :type="1"/>
        </view>
        <view class="form-filed-agree">
          <checkbox class="isAgreeCheck" @tap="changeIsAgree" :checked="isAgree">我已阅读并同意</checkbox><view class="isAgreePopupText" @tap="agreePopEvt">《用户服务协议》</view>
        </view>
        <!-- <view class="btn-opt">
          <text @tap="goForget">忘记密码</text>
          <text @tap="goRegister">还没有账号，立即注册</text>
        </view> -->
      </view>
      <view class="submit">
        <button type="primary"  @click="login" :class="mob&&isAgree&&verifyCode.length == 6?'login':''">登录</button>
      </view>
    </view>
    <uni-popup ref="agreePop" type="center" class="agreePop">
      <view class="header">{{article.article_title}}</view>
      <view class="content">
        <rich-text :nodes="article_text" class="agreePopTxt"></rich-text>
      </view>
      <view class="bottom">
        <tui-button class="knowBtn" @click="closePop">知道了</tui-button>
      </view>
    </uni-popup>
  </view> 
</template>

<script>
    import {
      mapState,
      mapMutations,
      mapActions
    } from 'vuex'
    import verifyCode from '@/components/verifyCode'
    import tuiButton from "@/components/tui/button/button"
    import tuiIcon from "@/components/tui/icon/icon"
    import uniPopup from "@/components/tui/uni-popup/uni-popup.vue"
import { setTimeout } from 'timers';
    export default {
      name: 'login',
      components: {tuiButton, tuiIcon, verifyCode, uniPopup},
      data(){
        return {
          mobIcon: require('@/static/imgs/icons/icon_shouji@2x.png'),
          verifyIcon: require('@/static/imgs/icons/icon_yanzhengma@2x.png'),
          clearSize: 18,
          siteConfig: {},
          logo: '',
          mob: '',
          fromUrlName: '',
          verifyCode: '',
          mobState: false,
          verifyState: false,
          isAgree: true,
          articleType: 7,
          article: '',
          article_text: ''
        }
      },
      methods: {
        // ...mapMutations(['login']),
        goForget(){
          
        },
        goRegister(){
          
        },
        agreePopEvt(){
          this.$refs.agreePop.open()
        },
        closePop(){
          this.$refs.agreePop.close()
        },
        changeIsAgree(){
          this.isAgree = !this.isAgree
        },
        getArticle(){
          this.$api.getArticle({//协议文章
            cmd:{
              member:"getArticle"
            },
            data:{
              article_id: this.articleType
            }
          }).then(res=>{
            if(res.code ===1){
              console.log(res,"article");
              this.article_text = res.data.article_text.replace(/\/upload\//g, this.$mConfig.imgUrl + '/upload/')
              this.article_text = this.$mUtils.rplaceRichImg(this.article_text)
              this.article = res.data
            }else{
              console.log(res.msg);
            }
          }).catch(err=>{
            console.log(err);
          })
        },
        checkBack(){
          let pages = getCurrentPages()
          if(pages.length > 1) {
            let prePage = pages[pages.length - 2],
                name = '/'+prePage.route
            if(name == this.$mRoutesConfig.changeMob.path){
              this.$mRouter.push({route: this.$mRoutesConfig.own, query: {}})
              return
            }else if(name == this.$mRoutesConfig.goodsDetail.path){
              
            }else if(name == this.$mRoutesConfig.shopCar.path){

            }else if(name == this.$mRoutesConfig.own.path){

            }
          }
          this.$mRouter.back(1)
        },
        login(){
            if(!(this.mob && this.isAgree && this.verifyCode.length == 6)) return
            if(!this.$regs.isPhone.test(this.mob)){
              this.$mUtils.toast('手机号格式不正确')
              return 
            }
            let data = {}
            data.mobile = this.mob
            data.verify_code = this.verifyCode
            this.$api.login({
                cmd:{member:'login'},
                data:data
            }).then(res=>{
                console.log(res)
                res.code===1 ? this.$mUtils.toast("登录成功", 2000, true) : this.$mUtils.toast(res.msg)
                if(res.code===1){
                  this.$store.commit('SET_USERINFO', res.data)
                  this.checkBack()
                }else if(res.code == '1109' || res.code == '1113' || res.code == '1114' || res.code == '1115'){
                  this.verifyCode = ''
                }else if(res.code == '1108' || res.code == '1111'){
                    this.mob = this.verifyCode = ''    
                }  
            }).catch(err=>{

            })
        },
        focusEvt(state){
          setTimeout(()=>{
            state == 'mob' ? this.mobState = true : this.verifyState = true
          }, 150)  
        },
        clearEvt(type){
          type == 1 ? this.mob = '' : this.verifyCode = ''
        },
        blurEvt(e){
          setTimeout(()=>{
            this.mobState = this.verifyState = false
          }, 100)
          
        },
      },
      onLoad(){
        if(this.$store.state.siteConfig.length) {
          this.logo = this.$store.state.siteConfig.site_logo
        }else{
          setTimeout(()=>{
            this.logo = this.$store.state.siteConfig.site_logo
          }, 1000)
        }
        
        this.getArticle()
      }
    }
</script>

<style lang="scss" type="text/scss">
.login{
    background: #fff;
    .inner{
      display: flex;
      flex-direction: column;
      padding: 0 100upx;
      .bg-box{
        .bg-logo{
          background: #f0f0f0;
          width: 380upx;
          height: 120upx;
          margin: 100upx auto 120upx;
        }
      }
    }
    .form{
      flex-direction: column;
        .form-filed {
          position: relative;
          display: flex;
          // justify-content: space-between;
          align-items: center;
          width: 100%;
          height: 88upx;
          
          border-bottom: 4upx solid transparent;
          padding-bottom: 4upx;
          >uni-image, >image {
            width: 30upx;
            height: 30upx;
            margin-right: 20upx;
            &.ic-mob{
              width: 26upx;
              margin-right: 24upx;
            }
            &.ic-pwd{
              height: 20upx;
            }
          }
          .tui-input{
            line-height: 80upx;
          }
          input{
            height: 100%;
            border: 0;
            color: #333;
            font-size:32upx;
            flex: 1;
            &.mob, &.pwd{
              width: calc(100% - 40upx);
            }
            &.verify{
              width: calc(100% - 220upx);
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
        .btn-opt{
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 30upx 0 66upx;
          uni-text, text{
            font-size: 28upx;
            color: #999;
          }
        }
      }
      .form-filed-agree{
          display: flex;
          align-items:center;
          margin: 30upx 0;
          font-size: 28upx;
          color: #999;
          .isAgreePopupText{
            color: $site-default-color;
          }
        }
      .submit{
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
    
    /* #ifdef APP-PLUS || MP-WEIXIN */
    /deep/.uni-popup{
      top: 0;
    }
    /* #endif */
}
</style>

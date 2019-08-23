<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>

export default {
  name: 'app',
  data() {
      return {
          isWx: false,
          site_config: ''
      }
  },
  methods:{
    parseQueryString(str){
        let srtChar = str
        if(srtChar.includes('?')){
            var str = srtChar.split('?')[1]
            var result = {}
            var temp = str.split('&')
            for(var i=0; i<temp.length; i++) {
                var temp2 = temp[i].split('=')
                result[temp2[0]] = temp2[1]
            }
            return result
        }else {
            return false
        }

    },

    // 微信端打开授权
    getWxOpenid(){
      console.log(process.env, 'mode')
      if(this.isWx) {
        let queryRes = this.parseQueryString(window.location.href)
        if(queryRes) {
            if(queryRes['code'] == undefined || queryRes['code'] == '') {
              let url = encodeURIComponent(window.location.href),
                appid = process.env.VUE_APP_MODE == 'alpha' ? 'wxb37f433fc67146e1' : 'wxb5d7706c376b3d89',
                scope = 'snsapi_userinfo'
              location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+appid+'&redirect_uri='+url+'&response_type=code&scope='+scope+'&state=STATE#wechat_redirect'
            }else{
              this.$api.getWxOpenId({
                  cmd:{member:'getWxOpenId'},
                  data:{code: queryRes['code']}
              }).then(res=>{
                console.log(res, 'openid')
                  if(res.code==1){
                      localStorage.setItem('openid',res.data)
                  }
              }).catch(err=>{})
              this.getSiteConfig()
            }
        }else{
            let url = encodeURIComponent(window.location.href),
              appid = process.env.VUE_APP_MODE == 'alpha' ? 'wxb37f433fc67146e1' : 'wxb5d7706c376b3d89',
              scope = 'snsapi_userinfo'
            location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+appid+'&redirect_uri='+url+'&response_type=code&scope='+scope+'&state=STATE#wechat_redirect'
        }
      }else{
        this.getSiteConfig()
      }
    },

    getSiteConfig(){
      let siteConfig = JSON.parse(localStorage.getItem('siteConfig')) || {}
      if(Object.keys(siteConfig).length ) return
      this.$api.siteconfig({
            cmd:{member:'siteconfig'},
            data:{}
        }).then(res=>{
            if(res.code==1){
              this.site_config = JSON.stringify(res.data)
              localStorage.setItem('siteConfig', JSON.stringify(res.data))
            }
        }).catch(err=>{

        })
    }
  },
  created() {
    // this.isWx = this.$checkBrowser.isWx
    this.getWxOpenid()
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>

<template>
    <view class="authorize">
        <uni-popup ref="authorizePopup" type="center">
            <text class="title">授权提示</text>
            <text class="content">需要获取您的公开信息(昵称、头像等)</text>
            <view class="footer">
                <button class="cance-btn" @tap="cancel">取消</button>
                <button class="confirm-btn" open-type="getUserInfo" @getuserinfo="wxGetUserInfo" withCredentials="true">确定</button>
            </view>            
        </uni-popup>
    </view>
</template>
<script>
import uniPopup from "@/components/tui/uni-popup/uni-popup"
export default{
    name: 'authorize-popup',
    components: {uniPopup},
    props: {},
    data(){
        return{
            
        }
    },
    methods: {
        wxGetUserInfo(res){
            if (!res.detail.iv) {
                uni.showToast({
                    title: "您取消了授权",
                    icon: "none"
                });
                return false;
            }else{
                var that = this
                uni.login({
                    success: function(_res){
                        console.log(_res.code)
                        let code = _res.code
                        // console.log(code, that.$api)
                        that.$api.getOpenid({
                            cmd:{user:'getOpenid'},
                            data:{code: code}
                        }).then(res=>{
                            console.log(res, 'openid')
                            if(res.code==1){
                                that.$store.commit("SET_OPENID", res.data.openid)
                                that.$store.commit("SET_AUTHORIZE", true)
                            }
                        }).catch(err=>{})
                    }
                })
                
            }
            this.cancel()
        },
        cancel(){
            this.$refs.authorizePopup.close()
        },
        checkIsAuthorize(){
            if(!this.$store.state.authorize) {
                this.$refs.authorizePopup.open()
            }else{
                this.cancel()
            }
        }
    },
    mounted(){
        
    }
}
</script>
<style lang="scss" type="text/scss" scoped>

</style>
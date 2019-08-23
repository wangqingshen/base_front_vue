<template>
    <view class="payResult-wrapper container">
        <view class="pay-status" v-show="pageShow">
			<view class="icon">
                <tui-icon name="circle-fill" :size="iconSize" color='#1AAD19' v-if="status"></tui-icon>
                <tui-icon name="close-fill" :size="iconSize" color='#DF1222' v-else></tui-icon>
			</view>
			<view class="txt">{{status ? (payway != 3? '支付成功':'请尽快将订单金额打款到以下账户，打款完成后平台将进行确认') : '支付失败'}}</view>
			<!-- <view class="account-info" v-if="status && payway == 3">
				<h1>收款账户</h1>
				<view class="content">
					<p><label>收款账户：</label><span>{{siteConfig.collect_account.value}}</span></p>
					<p><label>收款人：</label><span>{{siteConfig.collect_people.value}}</span></p>
					<p><label>收款银行：</label><span>{{siteConfig.collect_bank.value}}</span></p>
				</view>
			</view> -->
			<view class="btn" @click="goPage">返回商家</view>  
        </view>
    </view>
</template>
<script>
	import tuiIcon from "@/components/tui/icon/icon"
    export default{
        name:'payResult',
        data(){
            return{
                pageShow: false,
                status: false,
                order_num: '',
                payway: '',
                order_sn: '',
                iconSize: 80
                // siteConfig: {
                //     collect_account: {
                //         value: ''
                //     },
                //     collect_people: {
                //         value: ''
                //     },
                //     collect_bank: {
                //         value: ''
                //     },
                // }
            }
        },
        components:{
            tuiIcon
        },
        methods:{
            goPage(){
				this.$mRouter.redirectTo({
					route: this.$mRoutesConfig.orderList,
					query: {
						status:0
					}
				})
            },

            getPayStatus(){
                this.$api.queryPayStatus({
                    cmd:{
                        order:"queryPayStatus"
                    },
                    data:{
                        order_sn: this.order_sn,
                        pay_type: this.payway
                    }
                }).then(res=>{
                    console.log(res)
                    this.status = res.code==1 ? true : false
                    this.pageShow = true
                })
            },
//             getSiteConfig(){
//                 this.$api.siteconfig({
//                     cmd:{member:'siteconfig'},
//                     data:{}
//                 }).then(res=>{
//                     if(res.code==1){
//                     this.siteConfig = res.data
//                     localStorage.setItem('siteConfig', JSON.stringify(res.data))
//                     }
//                 }).catch(err=>{
// 
//                 })
//             }
        },
        onLoad(option){
			console.log(option,'option')
            this.payway = option.payway
            this.order_sn = uni.getStorageSync('pay_order_sn')
            // this.getSiteConfig()
            this.getPayStatus()
        }
    }
</script>
<style lang='scss' type="text/scss">
    .pay-status{
        height: 100%;
        text-align: center;
		flex-direction: column;
        .icon{
            margin-top: 140upx;
			justify-content:center;
			/deep/.img{
				img{
					width: 186upx;
					height: 188upx;
					opacity: 1;
				}
			   
			}
        }
        .txt{
            font-size: 40upx;
            color: #000;
            margin-top: 50upx;
            padding: 0 40upx;
			justify-content:center;
        }
        .account-info{
            border:2upx solid #ddd;
            border-radius: 10upx;
            width: 90%;
            margin: 40upx auto 0;
            background: #fff;
            padding: 30upx 70upx 50upx;
            text-align: left;
            h1{
                font-size: 32upx;
                color: #333;
                font-weight: 600;
                text-align: center;
                margin-bottom: 20upx;
            }
            .content{
                font-size: 28upx;
                p{
                    margin-top: 10upx;
                }
            }
        }
        .btn{
            height: 88upx;
            margin:130upx 30upx 40upx;
            line-height: 88upx;
            font-size: 32upx;
            background: #1AAD19;
            text-align: center;
            color: #fff;
            border-radius: 4upx;
			justify-content: center;
        }
    }
</style>

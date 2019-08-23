<template>
    <view class="container logistics-wrap">
        <view class="tui-order-header">
            <view class="tui-img">
                <image :src="logisticsData.goods_img"></image>
            </view>
            <view class="tui-info">
                <view class="tui-text">运输状态：
                    <text class="tui-bold">运输中</text>
                </view>
                <view class="tui-text">订单编号：
                    <text class="tui-bold">{{logisticsData.order_sn}}</text>
                </view>
                <view class="tui-text">物流方式：快递物流</view>
                <view class="tui-text" v-if="logisticsData.company">{{logisticsData.company}}：
                    <text class="tui-bold">{{logisticsData.express_code}}</text></view>
            </view>	
		</view>
		<view class="tui-order-tracking">
			<tui-time-axis v-if="logisticsData.logistics_info != undefined && logisticsData.logistics_info.length">
				<tui-timeaxis-item bgcolor="none" v-for="(item,index) in logisticsData.logistics_info" :key="index">
					<template v-slot:node>
						<view class="tui-node tui-bg-primary">
							<tui-icon name="check" color="#fff" :size="size" :bold="true"></tui-icon>
						</view>
					</template>
					<template v-slot:content>
						<!-- <view class="tui-order-title">已签收</view> -->
						<view class="tui-order-desc">{{item.remark}}</view>
						<view class="tui-order-time tui-gray">{{item.ftime.year}} {{item.ftime.hour}}</view>
					</template>
				</tui-timeaxis-item>
			</tui-time-axis>
            <view class="no-tacking" v-else>
                <view class="tui-text">物流详情：
                    <text class="tui-bold">暂无</text>
                </view>
            </view>
		</view>
        <view class="tui-order-remark">
            <view class="tui-text">发货备注：
                <text class="tui-bold">{{logisticsData.logistics_remark || '暂无'}}</text>
            </view>
        </view>
    </view>
</template>
<script>
    import tuiIcon from "@/components/tui/icon/icon"
	import tuiTimeAxis from "@/components/tui/time-axis/time-axis"
	import tuiTimeaxisItem from "@/components/tui/timeaxis-item/timeaxis-item"
    export default{
        name:'logistics',
        data(){
            return{
                pageTitle: '物流详情',
                logisticsData:{
                    goods_img: '',
                    data: []
                },
                order_id:'',
                isloading: true,
                size: 14
            }
        },
        components:{
            tuiIcon,
            tuiTimeAxis,
            tuiTimeaxisItem
        },
        computed:{

        },
        watch:{

        },
        methods:{
            getLogistics(){
                (async()=>{
                    let result
                    try{
                        result = await this.$api.logistics({
                            cmd:{
                                logistics:'searchlogistics'
                            },
                            data:{
                                order_id:this.order_id
                            }

                        })
                        if(result.code===1){
                            this.logisticsData = result.data
                            console.log(result.data)
                            if(this.logisticsData.logistics_info != undefined && this.logisticsData.logistics_info.length) {
                                this.logisticsData.logistics_info.forEach(item=>{
                                    let year = item.datetime.split(' ')[0]
                                    let hour = item.datetime.split(' ')[1]
                                    item.ftime = {year,hour}

                                })
                            }
                        }
                        this.isloading = false
                    }
                    catch(err){
                        this.isloading = false
                    }
                })()
            }
        },
        onLoad(options){
            this.order_id = options.orderid
            this.getLogistics()
        },
        // created(){
        //     this.order_id = this.$route.params.order_id
        //     this.getLogistics()
        // },
        mounted(){

        }
    }
</script>
<style lang="scss" type="text/scss">
    .logistics-wrap{
        .tui-order-header {
            padding: 30upx;
            box-sizing: border-box;
            background: #fff;
            .tui-img{
                width: 160upx;
                height: 160upx;
                border-radius: 8upx;
                overflow: hidden;
                margin-right: 30upx;
                background: #f5f5f5;
            }
            .tui-info{
                flex-direction: column;
            }
        }

        .tui-text {
            font-size: 28upx;
            color: #333;
            padding: 0 4upx 4upx;
        }

        .tui-bold {
            font-weight: bold;
        }

        .tui-node {
            background: #ddd;
            height: 44upx;
            width: 44upx;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
            padding-top: 0;
        }

        .tui-node-small {
            height: 16upx !important;
            width: 16upx !important;
        }

        .tui-bg-primary {
            background: $site-default-color !important;
        }

        .tui-order-tracking, .tui-order-remark {
            flex-direction: column;
            padding: 30upx 30upx 30upx 40upx;
            background: #fff;
            margin-top: 20upx;
            box-sizing: border-box;
            .tui-time-axis{
                flex-direction: column;
            }
        }

        .tui-order-title {
            color: #333;
            font-weight: bold;
            font-size: 32upx;
            font-family: "microsoft yahei";
        }

        .tui-timeaxis-item>view{
            display: block;
        }

        .tui-order-desc {
            display: block;
            font-size: 28upx;
            color: #333;
            padding: 0 0 12upx;
        }

        .tui-ptop {
            display: flex;
            justify-content: flex-start;
            line-height: 28upx;
        }

        .tui-order-time {
            font-size: 24upx;
            font-weight: bold;
        }

        .tui-gray {
            color: #848484 !important;
        }

        .tui-light-gray {
            color: #888 !important;
        }

        .tui-primary {
            color: #5677fc;
        }
    }
</style>

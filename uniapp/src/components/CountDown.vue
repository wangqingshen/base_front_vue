<template>
    <view class="countDown-component">
        <view class="countDown-temp" v-if="temp === '1' || temp === '5'">
            <view v-if="isCountDown">
				若未在{{timeObj.hr}}时{{timeObj.min}}分{{timeObj.sec}}秒内付款,超时订单将自动关闭
            </view>
            <view v-if="!isCountDown">已结束</view>
        </view>
        <view class="countDown-temp" v-if="temp === '4'">
            <view v-if="isCountDown">
				还剩{{timeObj.day}}天{{timeObj.hr}}时{{timeObj.min}}分{{timeObj.sec}}秒自动确认收货
            </view>
            <view v-if="!isCountDown">已结束</view>
        </view>
        <view class="countDown-temp" :class="{'temp2':temp ==='2' }" v-if="temp ==='2'">
            <view v-if="isCountDown">
                <view class="countDown-box">
                    <view class="countDown-inner" >
                        <view class="box pay-m">{{timeObj.hr}}</view>
                        <view class="box box21">:</view>
                        <view class="box pay-m">{{timeObj.min}}</view>
                        <view class="box box21">:</view>
                        <view class="box pay-s">{{timeObj.sec}}</view>
                    </view>
                </view>
            </view>
        </view>
        <view class="countDown-temp" :class="{'temp3':temp ==='3'}" v-if="temp ==='3'">
            <view v-if="isCountDown">
                <view class="countDown-box">
                    <view class="txt3">{{isStart === 1 ? '距结束' : '距开始'  }}</view>
                    <view class="countDown-inner" >
                        <view class="box d" v-if="timeObj.day !== '00'">{{timeObj.day}}</view>
                        <view class="box" v-if="timeObj.day !== '00'">天</view>
                        <view class="box h">{{timeObj.hr}}</view>
                        <view class="box box2">:</view>
                        <view class="box m">{{timeObj.min}}</view>
                        <view class="box box2">:</view>
                        <view class="box s">{{timeObj.sec}}</view>
                    </view>
                </view>
            </view>
        </view>
		<!-- 退款详情倒计时 -->
		<view class="countDown-temp" v-if="temp === '6'">
		    <view v-if="isCountDown">
				还剩<text class="refund-count-down">{{timeObj.day}}天{{timeObj.hr}}时{{timeObj.min}}分{{timeObj.sec}}秒</text>
		    </view>
		    <view v-if="!isCountDown">已结束</view>
		</view>
    </view>
</template>
<script>
    export default{
        name:'countDown',
        props:{
            timeProps:{
            },
            temp:{
                default:'1',
                type:String
            },
            isStart:{}
        },
        computed:{

        },
        data(){
            return{
                timeObj:{},
                isCountDown:true,
                interval:null,
                time:this.timeProps
            }
        },
        watch:{
            timeProps(val) {
				this.time = val
                this.isCountDown = true
            }
        },
        methods:{
            countDown() {
                if(this.isCountDown){
                    let timeObj=this.dateFormat(this.time)
                    this.timeObj = timeObj
                    if(this.time<= 0 ){
                        this.isCountDown = false
                        this.$emit('emitCountDownFun')
                    }
                    this.interval = setTimeout(()=>{
                        this.time-= 1000
                        this.countDown()
                    },1000)
                }
            },
            timeFormat(param) {
                return param < 10 ? '0' + param : param;
            },
            dateFormat (time) {

                if(time>0){
                    var second = Math.floor(time/1000)
                    var day = Math.floor(second / (3600*24))
                    var hr = Math.floor(second % (60 * 60 * 24) / 3600)
                    var min = Math.floor(second % (3600 * 24) % 3600 / 60)
                    var sec = second % (60 * 60 * 24) % 3600 % 60
                    var micro_sec = Math.floor((time % 1000) / 10)

                    return {
                        day:this.timeFormat(day),
                        hr:this.timeFormat(hr),
                        min:this.timeFormat(min),
                        sec:this.timeFormat(sec),
                        micro_sec:this.timeFormat(micro_sec)
                    }
                }else {
                    return {
                        day:'00',
                        hr:'00',
                        min:'00',
                        sec:'00',
                        micro_sec:'00'
                    }
                }

            },
        },
		// onLoad() {
  //           this.countDown()
		// },
		created(){
			this.countDown()
		},
		
        onShow(){
			
        },
        onUnload(){
            clearInterval(this.interval);
        }
    }
</script>
<style lang="scss" type="text/scss">
    .countDown-temp{
        font-size: 24upx;
        color: #fffefe;
        .countDown-box{
            align-items: center;
            .countDown-inner{
                align-items: center;
                margin: 0 4upx;
                .box{
                    width: 28upx;
                    text-align: center;

                }
            }
        }
        &.temp2,&.temp3{
            color: #353535;
            line-height: 1;
            .txt{
                font-size: 28upx;
                color: #000;
            }
            .txt3{
                font-size: 24upx;
                color: #666666;
            }
            .countDown-inner{
                margin-left: 15upx;

            }
            .box{
                &.d,&.h,&.m,&.s{
                    background: #423F4E;
                    border-radius: 4upx;
                    width: 30upx;
                    height: 30upx;
                    color: #fff;
                    font-size: 24upx;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                &.box2, &.pay-m, &.pay-s{
                    width: auto;
                    color: $site-default-color;
                    font-size: 28upx;
                    margin: 0 6upx;
                }
				&.pay-m, &.pay-s{
				    width: auto;
					width: 36upx;
					height: 36upx;
					background: #F5F5F5;
				    color: $site-default-color;
				    font-size: 28upx;
				    margin: 0 6upx;
					line-height: 36upx;
				}
				&.box21{
					color: $site-default-color;
					width: 8upx;
				}
            }

        }
		.refund-count-down{
			color: #F8E71C;
		}
    }


</style>

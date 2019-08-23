<template>
    <view class="orderConfirm-wrap container">
        <!-- <NavBar :pageTitle="pageTitle"/> -->
        <view class="submitOrder-inner" v-show="pageShow">
            <view class="content">
				<view class="address-box" @click="selAddressFun">
					<view class="sel-address-box">
						<view class="location-icon">
							<image class="img" :src="icomImg"></image>
						</view>
						<view class="address-info uni-flex uni-column" v-if="!addressFlag">
							<view class="info uni-flex uni-row">
								<view class="name">{{addressObj.true_name}}</view>
								<view class="phone">{{addressObj.mobile}}</view>
							</view>
							<view class="area">
								<span></span>
								<span>{{addressObj.address}}</span>
							</view>
						</view>
						<view class="address-info no-address uni-flex uni-row" v-else>
							<view class="txt">请选择收货地址</view>
						</view>
                        <tui-icon name="arrowright" :color="'#999'" :size="iconSize"></tui-icon>
					</view>
				</view>
				<!-- 可买商品缺省 -->
				<view class="store-nodata" v-if="noGoods">
					<view class="pic" :class="addressFlag?'add':'no-goods'"></view>
					<view class="text-wrapper">
						<view class="text">{{addressFlag ? '您还没有收货地址': '没有可购买的商品' }}</view>
						<view class="text">{{addressFlag ? '请添加收货地址后再进行购买':'快买点东西犒劳自己吧'}}</view>
					</view>
					<button class="g-btn" type="default" @click="goIndex" v-if="!addressFlag">去逛逛</button>
					<button class="g-btn" type="default" @click="selAddressFun" v-else>立即添加</button>
				</view>
				<view class="store-orderList" v-else>
					<view class="store-orderItem" v-for="(item,index) in orderData" :key="index">
						<view class="storeItem-hd">
							<view class="store-name">
								<view class="shop-icon"></view>
								<view class="name">{{item.store_name}}</view>
							</view>
						</view>
						<view class="storedItem-bd">
							<goodsItem :orderItemData="item.order_goods" style="flex:1"></goodsItem>
						</view>

						<view class="storedItem-ft">
							<view class="row1">
								<view>配送方式</view>
								<view>快递物流</view>
							</view>
							<view class="row2">
								<view class="num">共{{item.goods_num}}件商品</view>
								<view class="titlePrice">小计：<span class="price">￥{{item.goods_amount.toFixed(2)}}</span></view>
							</view>
						</view>
					</view>
				</view>
				<view class="total-box uni-flex uni-column" v-if="!noGoods">
					<view class="cell">
						<view class="key">商品总价</view>
						<view class="value">￥{{Number(totalGoodsAmount).toFixed(2)}}</view>
					</view>
					<view class="cell">
						<view class="key">运费</view>
						<view class="value">+￥{{Number(free).toFixed(2)}}</view>
					</view>
				</view>
				<!-- 无法购买商品 -->
				<view class="fail-goods" v-if="failGoods.length">
					<view class="fail-goods-header">以下商品无法购买，点击查看原因</view>
					<fail-goods-item
						v-for="(item, index) in failGoods"
						:key="index"
						@click.native="viewReasons(item)"
						:badData="item"
					></fail-goods-item>
				</view>
            </view>
            
            <view class="submit-total">
                <view class="">合计：<span class="red">{{noGoods?'0.00':'￥'+((total.orderPrice + free).toFixed(2))}}</span></view>
                <view class="submit-btn" :class="showBtn?'submit-btn':'gray'" @click="submitOrder">提交订单</view>
            </view>
        </view>
        </transition>
        <!-- 无法购买商品弹窗 -->
        <popup v-if="failGoods.length" type="bottom" ref='popup' class="failDialog" style="flex-direction: column;">
            <fail-goods-item :type="2" :badData="currentFail"></fail-goods-item>
            <view class="fail-reasons">无法购买的原因：{{failReasons}}</view>
            <button class="fail-button" @click="failGoodsDialogFun">我知道了</button>
        </popup>
    </view>
</template>
<script>
    import popup from '@/components/tui/uni-popup/uni-popup.vue'
    import goodsItem from '@/components/orderConfirm/goodsItem.vue'
    import FailGoodsItem from '@/components/orderConfirm/FailGoodsItem'
    import tuiIcon from "@/components/tui/icon/icon"
    // import couponItem from '@/components/couponItem'
    export default{
        name:'orderConfirm',
        data(){
            return{
                pageShow: false,
                pageTitle:'订单确认',
                addressFlag:false,
				showBtn:false,
                order_id:'',
                member_id:'',
                userInfo:'',
				icomImg:require('../../static/imgs/icons/Combined Shape@2x.png'),
                orderData:[
					
				],
                order_goods: {},
				orderGoods:{},
                addressObj:{address_id:''},
                orderPrice:'',
                storeTotal:[],
                payway:'',
                order_sn: '',
                store_ids: [],
                invoice_id: -1,
                invoice_txt: '无需发票',
                noGoods: false,   //无可购买商品
                failGoodsDialog:false,  //失败商品弹窗
                failReasons: '',  //无法购买原因
                failCode: '',
                failGoods: [],
                currentFail:{},  //当前失效商品
                couponIsDialog:false,
                couponItemData:[],
                couponItemData2:[],
                tabCardIndex:0,
                checkCouponItem:[],
                discount_id:[],
                couponState:4,
                noData:false,
                noData2:false,
                order_type: 1, //1普通 2拼团 3秒杀 4分销商
                distribution_code: '',
                seckill_time_sku_id: '',
                team_id: '',
                group_id: '',
                sellerInfo: {},
                iconSize: 20
            }

        },
        components:{
            goodsItem,
            FailGoodsItem,
            popup,
            tuiIcon
            // couponItem
        },
        computed:{
            total(){
                let assignArr = []
                let discountRedBag = {}
                let discountRedGoodsAmount = 0
                let discountRedAmount = 0
                let id = ''
                let discountGoodsLists = ''
                this.storeTotal.forEach(item2=>{
                    this.checkCouponItem.forEach(item1=>{
                        if(item2.store_id === item1.store_id){
                            let assignObj = Object.assign({},item2,item1)
                            assignArr.push(assignObj)
                        }else if(item1.store_id == 0){
                            id = item1.id
                            discountGoodsLists = item1.discount_goods_lists
                            discountRedGoodsAmount += item2.goods_amount
                            discountRedAmount = item1.discount_price
                        }
                    })
                })
                if(discountRedGoodsAmount > 0) {
                    discountRedBag.goods_amount = discountRedGoodsAmount
                    discountRedBag.discount_price = discountRedAmount
                    discountRedBag.id = id
                    discountRedBag.store_id = 0
                    assignArr.push(discountRedBag)
                }
                let sale1sum = 0
                let sale2sum = 0
                let saleSum = 0
                assignArr.forEach(item=>{
                    if(!item.discount_goods_lists){
                        if(item.discount_type === 2){
                            if(item.discount_highest_reduction !== '0.00'){
                                let sale = Math.abs((item.discount_rate/10)*item.goods_amount)
                                if(sale > Math.abs(item.discount_highest_reduction)){
                                    console.log(sale,'2222')
                                    sale1sum+= Math.abs(item.discount_highest_reduction)
                                }else {
                                    sale1sum += Math.abs(item.goods_amount)-sale
                                    if(sale1sum>Math.abs(item.discount_highest_reduction)){
                                        sale1sum = Math.abs(item.discount_highest_reduction)
                                    }
                                }
                            }else {
                                sale1sum += Math.abs(item.goods_amount) - Math.abs((item.discount_rate/10)*item.goods_amount)
                            }
                        }else {
                            if(item.goods_amount<item.discount_price){
                                sale2sum += item.goods_amount
                            }else {
                                sale2sum += Math.abs(item.discount_price)
                            }
                        }
                    }else{
                        let discount_goods_lists = item.discount_goods_lists.split(','),
                            connect_goods_list = item.order_goods,
                            goods_price = 0
                        discount_goods_lists.forEach(_item=>{
                            connect_goods_list.forEach(_item1=>{
                                if(_item == _item1.spu_id){
                                    goods_price += Number(_item1.goods_price)
                                }
                            })
                        })
                        if(item.discount_type === 2){
                            if(item.discount_highest_reduction !== '0.00'){
                                let sale = Math.abs((item.discount_rate/10)*goods_price)
                                if(sale > Math.abs(item.discount_highest_reduction)){

                                    sale1sum+= Math.abs(item.discount_highest_reduction)
                                }else {
                                    sale1sum += Math.abs(goods_price)-sale
                                    if(sale1sum>Math.abs(item.discount_highest_reduction)){
                                        sale1sum = Math.abs(item.discount_highest_reduction)
                                    }
                                }
                            }else {
                                sale1sum += Math.abs(goods_price) - Math.abs((item.discount_rate/10)*goods_price)
                            }
                        }else {
                            if(goods_price<item.discount_price){
                                sale2sum += goods_price
                            }else {
                                sale2sum += Math.abs(item.discount_price)
                            }
                        }
                    }
                    
                })
                saleSum = sale1sum+sale2sum
                let orderPrice = this.totalGoodsAmount - saleSum <= 0 ? 0: Number(this.totalGoodsAmount) - Number(saleSum)
                return {
                    couponSale:parseFloat(saleSum).toFixed(2),
                    orderPrice:orderPrice
                }
            },
            totalGoodsAmount(){
                let total = 0
                this.orderData.map(item=>{
                    total += item.goods_amount
                })
                return total
            },
            free(){
                let free = 0
                this.orderData.map(item=>{
                    free += Number(item.shipping_fee)
                })
                return free
            }
        },
        watch:{

        },
        methods:{
            isEmptyObject(arr) {
                var t
                for (t in arr)
                    return !1
                return !0
            },
            goIndex(){
				this.$mRouter.switchTab({
					route: this.$mRoutesConfig.index,
					query: {
						
					}
				})
            },
            submitOrder(){
                if(!this.orderData.length) return
				if(this.failGoods.length!=0){
				    // 部分商品失效，排除此类商品
				    this.failGoods.forEach(item=>{
				        this.order_goods = this.order_goods.filter(val=>{
				            return val.sku_id!=item.sku_id
				        })
				    })
				}
                if(this.addressObj.address_id !== '' || this.order_type == 6){
					uni.showLoading({
						mask: true,
						title: '生成订单中',
					})
                    let data = {
                        member_id:this.member_id,
                        goods:this.order_goods,
                        address_id:this.addressObj.address_id,
                        discount_ids: this.discount_id,
                        distribution_code: this.distribution_code,
                        order_type: this.order_type
                    }
                    if(this.order_type == 3) this.$set(data, 'seckill_time_sku_id', this.seckill_time_sku_id)
                    if(this.order_type == 2) {
                        this.$set(data, 'team_id', this.team_id)
                        this.$set(data, 'group_id', this.group_id)
                    }
                    this.$api.createOrder({
                        cmd:{
                            order:"createorder"
                        },
                        data:data,
                    }).then(res=>{
						uni.showLoading({
							mask: true,
							title: '生成订单中',
						})
                        console.log(res)
                        if(res.code == 1) {
                            this.order_sn = res.data.order_sn
                            this.getOrderIds()
                        }else{
							// uni.showToast({
							// 	title: res.msg,
							// 	duration: 2000
							// })
                        }
                        
                    })
                }else {
					uni.showToast({
						title: '请选择地址',
						duration: 2000
					})
                }


            },
            getOrderIds(){
                this.$api.orderResult({
                    cmd:{
                        order:"createOrderResult"
                    },
                    data:{
                        order_sn: this.order_sn
                    },
                }).then(res=>{
                     console.log(res)
                    if(res.code == 1){
						this.$mRouter.redirectTo({
							route: this.$mRoutesConfig.pay,
							query: {
								orderid:this.order_sn, 
								payway: this.payway,
								resultFrom: 'other', 
								orderArr: res.data.order_ids
							}
						})
                        // this.$router.replace({name:'payCashier',params:{orderid:this.order_sn, payway: this.payway, resultFrom: 'other', orderArr: res.data.order_ids}})
                    }else{
                        this.getOrderIds()
                    }
                }).catch(res=>{
                    this.$toast.clear()
                })
            },
            selAddressFun(){
				uni.setStorageSync('isSel',true)
				console.log(this.order_goods,'this.order_goods this.order_goods')
                // this.$store.dispatch('setSelAddress',true)
				this.$mRouter.push({
					route: this.$mRoutesConfig.addressList,
					query: {
						pageType:"order",
						goodsData: JSON.stringify(this.order_goods),
						payway: this.payway,
						orderType: this.order_type
					}
				})
                // this.$router.push({name:"addressList", params: {type: 2, goodsData: JSON.stringify(this.order_goods), payway: this.payway, orderType: this.order_type}})
            },

            // invoiceEvt(){
            //     this.$router.push({name: 'invoiceConfirm', params: {store_id: JSON.stringify(this.store_ids), invoice_id: this.invoice_id}})
            // },

            confirmInfo() {
                // if(Object.keys(this.$store.state.address).length !== 0 && this.$store.state.isSel){
                //     this.addressObj = this.$store.state.address
                // }
                this.$api.goPay({ //确认订单信息详情
                    cmd:{
                        cart:"orderconfirm"
                    },
                    data:{
                        member_id:this.member_id,
                        order_goods:this.order_goods,
                        address_id: this.addressObj.address_id,
                        distribution_code:this.distribution_code,
                        order_type: this.order_type,
                        seckill_time_sku_id: this.seckill_time_sku_id
                    },
                }).then(res=>{
                    console.log(res,'resdata')
                    if(res.code ===1){
                        this.pageShow = true
                        this.orderData = res.data.goods_list
                        this.failGoods = res.data.bad_list
                        let address = this.addressObj
                        // if(Object.keys(address).length === 0 && Object.keys(this.$store.state.address).length === 0){
                        if(address.address_id == '' && this.order_type != 6){
                            this.addressFlag = true
                            this.noGoods = true
                            //所有商品置入无法购买
                            if(res.data.goods_list.length){
                                let failGoods = this.failGoods;
                                res.data.goods_list.forEach(item=>{
                                    item.order_goods.forEach(val=>{
                                    failGoods.push(val)
                                    })
                                })
                                res.data.goods_list.length = 0
                            }
                        }
                        if(!res.data.goods_list.length){
                            //无有效商品
							this.showBtn = false;
                            this.noGoods = true;
                        }else{
							this.showBtn = true;
                            //存在有效商品
                            // if(res.data.bad_list.length!=0){
                            //     // 部分商品失效，排除此类商品
                            //     res.data.bad_list.forEach(item=>{
                            //         this.order_goods = this.order_goods.filter(val=>{
                            //             return val.sku_id!=item.sku_id
                            //         })
                            //     })
                            // }
                            this.storeTotal = this.orderData.reduce((cur,prev)=>{
                                return cur.concat(prev)
                            },[])

                            let couponSpu_idArr = []
                            this.orderData.forEach(item=>{
                                item.order_goods.forEach(item=>{
                                    couponSpu_idArr.push(item.spu_id)
                                })
                            })
                            couponSpu_idArr = Array.from(new Set(couponSpu_idArr))

                            let amountArr = this.orderData.map(item=>{
                                let {store_id,goods_amount} = item
                                this.store_ids.push(store_id)
                                return item.order_goods.map(item=>{
                                    return {
                                        store_id,
                                        goods_amount,
                                        spu_id:item.spu_id
                                    }
                                })
                            })

                            amountArr = amountArr.reduce(function(cur, next) {
                                return cur.concat(next)
                            }, [])
                            let obj = {}
                            amountArr = amountArr.reduce((cur,next) => {
                                obj[next.spu_id] ? "" : obj[next.spu_id] = true && cur.push(next)
                                return cur
                            },[])

                            return {couponSpu_idArr, amountArr}
                        }
                        console.log(res, 777)
                    }else{
                        this.pageShow = false
                        let msg = '详情页'
                        this.$dialog.alert({
                            message:  res.msg+'，返回'+msg
                        }).then(() => {  
                            this.$router.go(-1)
                        });

                    }
                }).catch(err=>{
                    
                })
            },

            checkCouponFun(item,index){ 
                if(!item.dis){
                    if(!item.checked){
                        item.checked = true
                        console.log(item, index)
                        let items = this.couponItemData.filter((couponItem,couponindex)=>{
                            if((item.store_id == 0 || item.store_id === couponItem.store_id || couponItem.store_id == 0) && index !== couponindex){
                                return item
                            }
                        })
                        items.forEach(item=>{
                            item.dis= true
                        })
                    }else {
                        item.checked = false
                        let items = this.couponItemData.filter((couponItem,couponindex)=>{
                            if((item.store_id == 0 || item.store_id === couponItem.store_id || couponItem.store_id == 0) && index !== couponindex){
                                return item
                            }
                        })
                        let status = false
                        this.couponItemData.filter(couponItem=>{
                            if(couponItem.checked) {
                                status = couponItem.checked
                            }
                        })
                        items.forEach(item=>{
                            if(!(status && item.store_id == 0)) {
                                item.dis= false
                            }  
                        })
                    }
                }
                this.checkCouponItem = this.couponItemData.filter(couponItem=>{
                    if(couponItem.checked){
                        return item
                    }
                })
            },

            checkInvoice(){
                // if(Object.keys(this.$store.state.invoice).length){
                //     this.invoice_id = this.$store.state.invoice.id
                //     this.invoice_txt = this.$store.state.invoice.txt
                // }
            },

            //查看商品失效原因
            viewReasons(props){
                this.currentFail = props;
                //sku不存在
                this.failCode = this.addressFlag ? 1239 : props.error_code
				this.failReasons = this.$mUtils.badStatus(this.failCode)
                // if(this.addressFlag){
                //     this.failCode = '1239'
                // }else{
                //     this.failCode = props.error_code
                //     if(props.goods_state!=5){ //spu不存在
                //     this.failReasons = "商品已下架";
                //     }else if(props.shipping_type==2&&props.shipping_region!=1){ //商品不在配送区域
                //     this.failReasons = "超出配送区域";
                //     }else if(parseInt(props.goods_stock)==0){ //无库存
                //     this.failReasons = "商品已售罄";
                //     }else if(parseInt(props.goods_num)>parseInt(props.goods_stock) && parseInt(props.goods_stock)!=0){ //商品库存不足
                //     this.failReasons = "商品库存不足";
                //     }
                // }
				this.$refs.popup.open()
                // this.failGoodsDialog = true;
            },
			failGoodsDialogFun(){
				this.$refs.popup.close()
			},
            addressList(){
                if(Object.keys(this.$store.state.address).length !== 0) {
                    this.addressObj = this.$store.state.address
                    this.confirmInfo()
                }else{
                    this.$api.addressList({//地址列表
                        cmd:{
                            member:"addressList"
                        },
                        data: {
                            member_id: this.member_id
                        }
                    }).then(res=>{
                        console.log(res,'adresslist')
                        if(res.code ===1){
                            if(res.data.length){
                                this.addressObj = res.data.filter(item=>{
                                    if(item.is_default == 1) return item
                                })
                                if(!this.addressObj.length){
									this.addressObj.address_id = ''
								} 
                                else {
									this.addressObj = this.addressObj[0]
								}
                            }else{
                                this.addressObj.address_id = ''
                            }
                            this.confirmInfo()
                        }
                    }).catch(err=>{
                        console.log(err)
                    })
                }
                
            },

            getSellerInfo(){
                this.$api.sellerInfoApi({
					cmd:{seller:'sellerInfo'},
					data:{
                        member_id: 0,
                        distribution_code: this.distribution_code
					}
				}).then(res=>{
					console.log(res, 'seller')
					if(res.code == 1){
						this.sellerInfo = res.data
					}
				}).catch(res=>{})
            }
        },
        onLoad(option){
			console.log(this.orderData,'userInfo')
			console.log(Object.keys(this.$store.state.address))
            this.userInfo =uni.getStorageSync('userInfo')
            this.member_id = this.userInfo.member_id
			this.order_goods = JSON.parse(option.goodsData)
			console.log(this.order_goods,'this.order_goods+++++++++')
            // this.order_goods = [{sku_id: 537, goods_num: 1}]//{"sku_id":552,"goods_num":2},{"sku_id":557,"goods_num":2},{sku_id: 1193, goods_num: 1}
            this.order_type = option.orderType
            this.payway = option.payway
            this.distribution_code =option.distribution_code || ''
            if(this.order_type == 3) {
                this.seckill_time_sku_id = option.seckill_time_sku_id || ''
            }
            if(this.order_type == 2){
                this.group_id = option.group_id || ''
                this.team_id = option.team_id || 0
            }
            this.checkInvoice()
            if(this.distribution_code) {
                if(this.order_type == 6) {
                    this.getSellerInfo()
                    this.confirmInfo()
                    return false
                }
            }else{
                if(this.order_type == 6) this.order_type = 0
            }
            this.addressList() 
        },


    }
</script>
<style lang="scss" type="text/scss">
    .orderConfirm-wrap{
        padding-bottom: 90upx;
    }
	img{
		width: 100%;
		height: 100%;
	}
    .submitOrder-inner{
        width: 100%;
        height: 100%;
        .content{
            height: 100%;
			width: 100%;
			flex-direction: column;
        }
        .address-box{
            position: relative;
            margin-bottom: 20upx;
            height: 164upx;
            .sel-address-box{
                // position: absolute;
                // left: 0;
                // top: 0;
                z-index: 10;
                background: transparent;
                display: flex;
                align-items: center;
                justify-content: space-between;
                font-size:28upx;
                color: #333;
                padding: 0 26upx;
                width: 100%;
                height: 100%;
                .location-icon{
                    width: 22upx;
                    height: 26upx;
                    margin-right:36upx;
					.img{
						opacity: 1; 
						/deep/img{
							width: 100%;
							height: 100%;
							opacity: 1 !important;
						}
						
					}
                }
                
                .address-info{
                    flex-grow: 1;
                    flex: 1;
					flex-direction: column;
                    &.no-address{
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
						flex-direction: row;
                        .txt{
                            font-size: 28upx;
                            color: #333;
                            line-height: 40upx;
                        }
                        // .arrow-icon{
                        //     /deep/.img{
                        //     	height: 26upx;
                        //     	width: 16upx;
						// 		img{
						// 			opacity: 1;	
						// 		}
                        //     }
                        // }
                    }
                }
                .info{
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 10upx;
                    font-size: 28upx;
                    line-height: 40upx;
					justify-content: flex-start;
                    .name{
                        // flex: 1;
                        display: -webkit-box;
                        white-space: normal;
                        word-break: break-all;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        -webkit-box-orient: vertical;
                        -webkit-line-clamp: 1;
                        margin-right: 20upx;
                        text-align: left;
                    }
                }
                .area{
                    font-size: 24upx;
                    line-height: 34upx;
                    display: -webkit-box;
                    white-space: normal;
                    word-break: break-all;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 2;
                    text-align: left;
                    max-height: 68upx;
					color: #999;
                }
            }
            &:after {
                content: '';
                left: 0;
                right: 0;
                bottom: 0;
                height: 100%;
                position: absolute;
                background: url('../../static/imgs/icons/pic_address@2x.png');
                background-size: cover;
                z-index: 1;
            }
        }
        .store-nodata{
            font-size:15px;
            color: #888;
            display: flex;
            flex-direction: column;
            align-items: center;
            background: white;
            margin-bottom: 20upx;
            padding: 40upx 20upx 20upx;
            .no-goods{
                background: url(../../static/imgs/default/default_goods.png) no-repeat;
            }
            .add{
                background: url(../../static/imgs/default/default_address.png) no-repeat;
            }
            .pic{
                width: 200upx;
                height: 174upx;
                background-size: cover;
                margin-bottom: 40upx;
            }
            .text-wrapper{
                text-align: center;
				flex-direction: column;
				align-items: center;
            }
            .text{
                font-size: 26upx;
            }
            .g-btn{
                height:60upx;
                line-height: 65upx;
                font-size: 26upx;
                padding: 0 22upx;
                color: #888888;
                text-align: center;
                background:#f8f8f8;
                border:2upx solid #888;
                border-radius:6upx;
                margin-top: 20upx;
            }
        }
        .fail-goods{
            background: white;
            width: 100%;
            font-size: 28upx;
            margin-bottom: 20upx;
            color: #333;
			flex-direction: column;
            &-header{
                text-align:left;
                padding-left:30upx;
                height: 80upx;
                line-height: 80upx;
                background: #fff;
				border-bottom: 2upx solid #e7e7e7
            }
        }
		.store-orderList{
			flex-direction: column;
		}
        .store-orderItem{
            margin-bottom: 20upx;
            background: #fff;
			flex-direction: column;
            .storeItem-hd{
                padding: 0 30upx;
				height: 80upx;
				border-bottom: 2upx solid #e7e7e7;
                .store-name{
                    text-align: left;
                    padding: 14upx 0;
                    display: flex;
                    align-items: center;
                    font-size: 24upx;
                }
                .name{
                    flex-grow: 1;
                    width: 480upx;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    white-space: nowrap;
                }
                .shop-icon{
                    background: url(../../static/imgs/icons/icon_shop.png) no-repeat;
                    width: 40upx;
                    height: 40upx;
                    background-size: contain;
                    margin-right: 16upx;
                }
            }
            .storedItem-ft{
                font-size: 22upx;
                color: #353535;
                padding: 20upx 30upx;
				flex-direction: column;
                .row1{
                    display: flex;
                    justify-content: space-between;
                    height: 40upx;
                    align-items: center;
                }
                .row2{
                    display: flex;
                    justify-content: flex-end;
                    align-items: center;
                    height: 40upx;
					.titlePrice{
						align-items: center;
					}
                    .num{
                        margin-right: 20upx;
                    }
                    .price{
                        line-height: 1;
                    }

                }
            }
            .storedItem-bd{
                .orderItem-item{
                    background: #F7F7F7;
                    &:not(:last-child){
                        margin-bottom: 10upx;
                    }
                }
            }
        }
        .invoice-box{
            margin-bottom: 20upx;
            text-align: left;
            .van-cell{
                font-size: 24upx;
                color: #333;
                // padding: 15px;
            }
            .right-icon{
                display: flex;
                align-items: center;
                color: #666;
                flex: 3;
                justify-content: flex-end;
                .value{
                    margin-right: 10upx;
                    display: -webkit-box;
                    white-space: normal;
                    word-break: break-all;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 1;
                }
            }
        }
        .sel-coupons{
            font-size: 25upx;
            // margin-bottom: 10px;
            .van-cell{
                // padding: 15px;
            }
            .label{
                font-size: 24upx;
                display: flex;
                align-items: center;
                color: #333;
                .c-tag{
                    border: 2upx solid #1FA76E;
                    border-radius: 10upx;
                    padding:0 6upx ;
                    font-size: 24upx;
                    color: #1FA76E;
                    margin-left: 10upx;
                    transform: scale(0.8);
                    transform-origin: left;
                }
            }
            .right-icon{
                display: flex;
                align-items: center;
                .van-icon{
                    font-size: 24upx;
                    color: #666;
                }
                .value{
                    font-size: 24upx;
                    color: #888;
                    margin-right: 10upx;
                }
            }
        }
        .total-box{
            padding: 20upx 30upx;
            background: #fff;
            font-size: 24upx;
            color: #353535;
            margin-bottom: 20upx;
			flex-direction: column;
            .cell{
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 20upx;
                &:last-child{
                    margin-bottom: 0;
                }
                .value{
                    text-align: right;
					color: #DF1222;
                }
            }
        }
        .submit-total{
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            position: fixed;
            height: 90upx;
            left: 0;
            bottom: 0;
            background: #fff;
            z-index: 99;
            padding-left:30upx;
            font-size: 32upx;
            color: #333;
            .red{
                color: #DF1222;
            }
            .submit-btn{
                width: 300upx;
                background: #DF1222;
                color: #fff;
                font-size: 32upx;
                text-align: center;
                height: 90upx;
                line-height: 90upx;
				justify-content: center;
                &.gray{
                    background: #ccc;
                }
            }
        }
    }
    .couponDialog_order{
        font-size: 28upx;
        color: #353535;
        .cube-popup-content{
            .inner{
                background: #fff;
            }    
        }
        .no-data{
            font-size:28upx;
            color: #999;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding-top: 60upx;
            padding-bottom: 60upx;
            .pic{
                background: url(../../static/imgs/default/default_message.png) no-repeat;
                width: 240upx;
                height: 220upx;
                background-size: cover;
                margin-bottom: 20upx;
            }
        }
        .hd{

            .cell{
                display: flex;
                justify-content: space-between;
                align-items: center;
                height: 90upx;
                padding: 0 30upx;
                .close-icon{
                    height: 90upx;
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    width: 90upx;
                    font-size: 40upx;
                    color: #888;
                    img {
						width: 26upx;
						height: 26upx;
					}
                }
                .tit{
                    font-size: 32upx;
                    color: #333;
                    font-weight: 900;
                }

            }
            .selCoupon-bar{

                .bar-inner{
                    position: relative;
                }
                .items{
                    display: flex;
                    align-items: center;
                    .item{
                        width: 50%;
                        height: 90upx;
                        text-align: center;
                        line-height: 90upx;
                        position: relative;
                        .txt{
                            margin-top: -8upx;
                        }
                        .line{
                            height: 4upx;
                            width: 50%;
                            margin: auto;
                            background: transparent;
                        }
                        &.active{
                            color: #1FA76E;
                            .line{
                                background: #1FA76E;
                            }
                        }
                    }

                }

            }
            .sub-txt{
                font-size: 24upx;
                color: #888;
                padding:  0 90upx;
                height: 60upx;
                line-height: 60upx;
            }

        }
        .bd{
            background: #f4f4f4;
            .cube-scroll-wrapper{
                max-height: 400upx;
                .coupon-item{
					&:last-child{
						margin-bottom: 20upx;
					}
				}
            }
        }
        .ft{
            display: flex;
            height: 100upx;
            font-size: 30upx;
            color: #353535;
            background: #fff;
            .l{
                flex-grow: 1;
                height: 100upx;
                line-height: 100upx;
                text-align: center;
                .p{
                    color: #F22A15;
                }

            }
            .r{
                width: 240upx;
                background: #1FA76E;
                color: #fff;
                height: 100upx;
                line-height: 100upx;
                text-align: center;

            }
        }
    }
    .failDialog{
		/deep/.uni-popup__wrapper.uni-custom.top .uni-popup__wrapper-box, .uni-popup__wrapper.uni-custom.bottom .uni-popup__wrapper-box {
			flex-direction: column !important;
		}
        .fail-reasons{
            width:750upx;
            height:80upx;
            font-size:28upx;
            text-align: center;
            line-height: 80upx;
            background: #FEFCEB;
            color: #DF1222;
			justify-content: center;
			flex-direction: column;
        }
        .fail-button{
            width:100%;
            height:88upx;
            background:#DF1222;
            font-size:32upx;
            color: white;
            padding: 0;
            margin: 0;
            border-radius: 0;
			border: 0;
        }
		/deep/.uni-custom .uni-popup__wrapper-box{
			flex-direction: column !important;
		}
    }
</style>

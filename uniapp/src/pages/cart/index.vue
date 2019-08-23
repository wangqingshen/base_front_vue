<template>
	<view class="container shop" :class="!noData?'bg':''">
		<view class="shopCar-inner">
			<view class="shop-list" v-if="!noData">
				<!-- 购物车头部 -->
				<view class="shop-list-header">
					<view class="shop-list-header-handle" @tap="handleEdit">{{isEdit ? '完成': '编辑商品'}}</view>
				</view>
				<view class="scroll-wrapper">
					<view class="shop-store-list">
						<!-- 门店列表 -->
						<view class="shop-store-item" v-for="(storeItem,index) in shopCarData" :key="index">
							<view class="store">
								<!-- 店铺头部 -->
								<view class="store-hd">
									<view class="check-box" @tap="storeAllCheckFun(index,storeItem)">
										<checkbox-group class="check-box-wrapper">
											<label class="check-box-label">
												<checkbox value="cb" class="input-box" :checked="storeItem.checked" />
												<view class="show-box" :class="storeItem.checked?'checked':''"></view>
											</label>
										</checkbox-group>
									</view>
									<view class="store-name">
										<view class="shop-icon"></view>
										<view class="name">{{storeItem.store_name}}</view>
									</view>
								</view>
								<!-- 单店铺商品 -->
								<view class="store-bd">
									<view class="store-goods-list">
										<view class="store-goods-list-spu" v-for="(spuItem,index2) in storeItem.spu" :key="index2">
											<view class="store-goods-item" v-for="(goodsItem,index3) in spuItem.sku" :key="index3">
												<view class="check-box"  @tap="checkItemFun(index,goodsItem)">
													<checkbox-group class="check-box-wrapper">
														<label class="check-box-label">
															<checkbox value="cb" class="input-box" :checked="goodsItem.checked" />
															<view class="show-box" :class="goodsItem.checked?'checked':''"></view>
														</label>
													</checkbox-group>
												</view>
												<!-- 单个商品展示信息 -->
												<cart-goods-item class="cart-goods-item" :goodsItem="goodsItem"></cart-goods-item>
											</view>
										</view>
									</view>
								</view>

							</view>
						</view>
						<!-- 失效商品列表 -->
						<view v-if="badGoods.length" class="invalid-wrap">
							<view class="unBuy">以下商品暂时无法购买</view>
							<view style="background:#fff">
								<view class="bad-goods-item" v-for="(goodsItem,index2) in badGoods" :key="index2">
									<cart-goods-item class="cart-goods-item" :type="2" :goodsItem="goodsItem"></cart-goods-item>
								</view>
							</view>
							<view class="clear-bad-goods">
								<button v-if="badGoods.length" class="unbtn" @tap="clearBadGoods">清空失效商品</button>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="no-shop" v-else>
				<view class="inner">
					<noData :imgPath="imgPath" :msg="hasLogin?'购物车是空的':'您还未登录'" />
					<text class="g-btn" @tap="goGoodsList">{{hasLogin?'去逛逛':'去登录'}}</text>
				</view>
			</view>
			<view v-if="!noData" class="shopCarBar-wrapper">
				<view class="fixed-shopCarBar" v-if="!isEdit">
					<view class="bar-l">
						<view class="all-check" @tap="allCheckFun">
							<view class="check-box">
								<checkbox-group class="check-box-wrapper">
									<label class="check-box-label">
										<checkbox value="cb" class="input-box" :checked="allChecked" />
										<view class="show-box" :class="allChecked?'checked':''"></view>
										<text class="check-box-label-text">全选</text>
									</label>
								</checkbox-group>
							</view>
						</view>
						<view class="total-price">
							<view class="txt">总计:<span class="price">￥{{total}}</span></view>
							<!-- <view class="desc">不含运费</view> -->
						</view>
					</view>
					<view class="bar-r">
						<view class="pay-btn" @tap='goPayFun' :class="[submitIsTotal ? '' : 'dis']">去结算</view>
					</view>
				</view>
				<view class="fixed-shopCarBar" v-else>
					<view class="bar-l">
						<view class="all-check" @tap="allCheckFun">
							<view class="check-box">
								<checkbox-group class="check-box-wrapper">
									<label class="check-box-label">
										<checkbox value="cb" class="input-box" :checked="allChecked" />
										<view class="show-box" :class="allChecked?'checked':''"></view>
										<text class="check-box-label-text">全选</text>
									</label>
								</checkbox-group>
							</view>
						</view>
					</view>
					<view class="bar-r">
						<view class="pay-btn" @tap="removeArrFun" :class="[isTotalComputed ? '' : 'dis']">删除</view>
					</view>
				</view>
			</view>
		</view>
		<!-- #ifdef MP-WEIXIN -->
		<authorizePopup ref="authorize"></authorizePopup>
		<!-- #endif -->
	</view>
</template>
<script>
	import noData from '@/components/noData';
	import CartGoodsItem from '@/components/cart/CartGoodsItem';
    export default{
        name:'shopCar',
        data(){
            return{
                member_id:'',
                allChecked:false,	//是否全选
                isTotal:false,		
                isEdit:false,		//是否编辑模式
                submitIsTotal: false,
                userInfo:'',		//用户信息
                shopCarData:[],		//购物车信息
                badGoods: [],
                noData:true,
                imgPath: require('@/static/imgs/default/default_goods.png'),
            }
        },
        components:{
			noData,
			CartGoodsItem
		},
        computed:{
            isTotalComputed(){
				const _this = this;
                let allGoodsItemArr = []
                let allGoodsItem = this.shopCarData.map(item=>{
                    for(var i in item.spu) {
                        item.spu[i].sku.map((item, index)=>{
                            allGoodsItemArr.push(item)
                        })
                    }
                })
                let someCheckItem = allGoodsItemArr.some((item,index)=>{
                    return item.checked
                })

                if(someCheckItem){
                    _this.isTotal = true
                    return true
                }else {
                    _this.isTotal = false
                    return false
                }
            },
			// 计算总价
            total(){
				const _this = this;
                let allGoodsItemArr = []
                _this.submitIsTotal = this.mergePrice()
                let allGoodsItem = this.shopCarData.map(item=>{
                    for(var i in item.spu) {
                        item.spu[i].sku.map((item, index)=>{
                            allGoodsItemArr.push(item)
                        })
                    }
                })
                let checkItem = allGoodsItemArr.filter((item,index)=>{
                    if(item.checked){
                        return item
                    }
                })

                let price = checkItem.reduce((prev, curr) => {
                    return curr.goods_price * curr.goods_num + prev
                }, 0)
				console.log("55555",price.toFixed(2));
                return price.toFixed(2)
            },
			hasLogin(){
				if(this.$store.getters.hasLogin){
					return true;
				}else{
					return false;
				}
			}
        },
        watch:{

        },
        methods:{
            mergePrice(){
                let allGoodsItemArr = [],
                    arr = [],
                    arr1 = [],
                    status = true
                this.shopCarData.map(item=>{
                    for(var i in item.spu) {
                        item.spu[i].sku.map((item, index)=>{
                            allGoodsItemArr.push(item)
							return item;
                        })
                    }
                })
                allGoodsItemArr.filter((item,index)=>{
                    if(item.checked){
                        let spuId = item.spu_id
                        let flag = true 
                        this.shopCarData.map((_item,_index)=>{
                            if(_item.spu[spuId] != undefined && Object.keys(_item.spu[spuId].wholesale_set).length){
                                let flag = true 
                                for(var i in arr) {
                                    if(arr[i].id == spuId) {
                                        arr[i].num += item.goods_num
                                        return false
                                    }
                                }
                                if(flag == true) {
                                    let obj = {}
                                    obj.id = spuId
                                    obj.num = item.goods_num
                                    obj.wholesale_set = _item.spu[spuId].wholesale_set
                                    arr.push(obj)
                                }
                            }else if(_item.spu[spuId] != undefined && !Object.keys(_item.spu[spuId].wholesale_set).length){
                                arr1.push(item)
                            }   
                        })
                    }
                })
                if(arr.length) {
                    arr.map((item, index)=>{
                        let num = item.num,
                            id = item.id,
                            mode = item.wholesale_set.price_mode,
                            wholesaleNum = item.wholesale_set.wholesale_set
                        if(mode == 1) {
                            let price
                            wholesaleNum.forEach((item, index)=>{
                                if(num>= item.num) {
                                    price = item.price
                                }
                            })
                            if(num < wholesaleNum[0].num) {
                                price =  wholesaleNum[0].price   
                                status = false
                            }
                            this.shopCarData.map((_item,_index)=>{
                                if(_item.spu[id] != undefined) {
                                    _item.spu[id].sku.map((skuItem,skuIndex)=>{
                                        skuItem.goods_price = price
                                    })
                                }
                                
                            })

                        }else if(mode == 2){
                            if(num<wholesaleNum) status = false
                        }
                    })
                }else if(!arr1.length) {
                    status = false
                }
                return status
            },
			// 前往指定页面
            goGoodsList(){
				console.log(this.$store.getters.hasLogin);
                if(this.$store.getters.hasLogin) {
                    this.$mRouter.switchTab({
                        route: this.$mRoutesConfig.category,
                        query: {}
                    })
                }else{
                    this.$mRouter.push({
                        route: this.$mRoutesConfig.login,
                        query: {}
                    })
                }
            },
            storeAllCheckFun(index, storeItem){
                this.shopCarData[index].checked = !storeItem.checked;
                for(var i in this.shopCarData[index].spu){
                    this.shopCarData[index].spu[i].sku.map(item =>{
                        item.checked = storeItem.checked
                    })
                }
                this.isStoreAllCheck()
            },
			// 验证是否全选
            isStoreAllCheck(){
				console.log(this.shopCarData)
                let storeAllCheck = true
                this.shopCarData.map(item=>{
                    for(var i in item.spu) {
                        item.spu[i].sku.map(_item=>{
                            if(!_item.checked) {
                                storeAllCheck = false
                                return
                            }
							return _item;
                        })
                    }
					return item;
                })
                this.allChecked = storeAllCheck
            },
			// 选择单个商品
            checkItemFun(index,goodsItem){
                goodsItem.checked = !goodsItem.checked;
                let isAllCheck = true;
                for(let i in this.shopCarData[index].spu){
                    this.shopCarData[index].spu[i].sku.map(item=>{
                        if(item.checked === false) isAllCheck = false
						return item;
                    })
                }
                this.shopCarData[index].checked = isAllCheck;
                this.isStoreAllCheck()
            },
			// 全选
            allCheckFun(){
                this.allChecked = !this.allChecked
                this.shopCarData.map(item=>{
                    item.checked = this.allChecked
                    for(var i in item.spu) {
                        item.spu[i].sku.map(_item=>{
                            _item.checked = this.allChecked
							return _item;
                        })
                    }
					return item;
                })
				console.log(this,this.shopCarData,"改变后");
            },
			// 获取购物车数据
            getCarList(props){
                this.$api.cartList({
                    cmd:{
                        cart:"cartlist"
                    },
                    data:{
                        member_id: this.member_id,
						// member_id:112
                    }
                }).then(res=>{
                    console.log(res)
                    if(res.code === 1){
						res.data.goods.map((item,index)=>{
							item.checked = false;
						    for(var i in item.spu) {
						        item.spu[i].sku.map((_item, index)=>{
									_item.checked = false;
									return _item;
						        })
						    }
							return item;
						})
						this.shopCarData = res.data.goods;
                        this.badGoods = res.data.bad
						console.log(res.data.goods,this.shopCarData,"数据对比");
                        if(res.data.goods.length === 0 && res.data.bad.length === 0){
                            this.noData = true
                        }else{
                            this.noData = false
                        }
						if(props===1){
							setTimeout(()=>{
								uni.stopPullDownRefresh();
								uni.showToast({
								    title: '刷新成功',
								    icon:  'none',
								    duration: 1500
								})
							},300)
						}
                    }else{
						setTimeout(()=>{
							uni.showToast({
							    title: res.msg,
							    icon:  'none',
							    duration: 1500
							})
						},300)
						if(props===1){
							uni.stopPullDownRefresh();
						}
					}
                }).catch(err=>{
					if(props===1){
						setTimeout(()=>{
							uni.stopPullDownRefresh();
							uni.showToast({
							    title: '刷新失败',
							    icon:  'none',
							    duration: 1500
							})
						},300)
					}
                })
            },
			// 去结算事件
            goPayFun(){
				console.log('去结算');
                if(!this.submitIsTotal) return
                let allGoodsItemArr = []
                let allGoodsItem = this.shopCarData.forEach(item=>{
                    for(var i in item.spu) {
                        item.spu[i].sku.map((item, index)=>{
                            allGoodsItemArr.push(item)
                        })
                    }
                })

                let privateItem = allGoodsItemArr.filter((item,index)=>{
                    if(item.checked && item.is_private_goods){
                        return item
                    }
                })

                let checkItem = allGoodsItemArr.filter((item,index)=>{
                    if(item.checked){
                        return item
                    }
                }).map(item=>{
                    return {
                        sku_id:item.sku_id,
                        goods_num:item.goods_num
                    }
                })

                let order_type = 1
                if(privateItem.length && privateItem.length != checkItem.length){
					// uni.showToast({
					// 	title: '标题',
					// 	duration: 2000
					// });
                    this.$toast({message: '自提商品与平台商品不能同时下单'})
                    return
                }else if(privateItem.length && privateItem.length == checkItem.length) {
                    order_type = 6
                }

                let order_goods = JSON.stringify(checkItem)
				this.$mRouter.push({
					route: this.$mRoutesConfig.orderConfirm, 
					query:{
						goodsData: order_goods,
						payway: 2,
						orderType: order_type,
					},
				})
      //           let second = 2;
      //           const timer = setInterval(() => {
      //               second--;
      //               if (!second){
      //                   clearInterval(timer)
						// uni.hideLoading();
      //                   this.$store.dispatch('setSelAddress',false)
      //                   this.$store.commit('SET_SEL_ADDRESS_INDEX','-1')
      //                   localStorage.removeItem('isSelIndex')
      //                   this.$router.push({name:'orderConfirm', params:{goodsData:order_goods, payway: 2, orderType: order_type}})
      //               }
      //           }, 1000)

            },
			// 改变购物车数量
            changeCarNum() {
                let allGoodsItemArr = []
                let allGoodsItem = this.shopCarData.forEach(item=>{
                    for(var i in item.spu) {
                        item.spu[i].sku.map((item, index)=>{
                            allGoodsItemArr.push(item)
                        })
                    }
                })

                let checkItem = allGoodsItemArr.map(item=>{
                    return {
                        sku_id:item.sku_id,
                        goods_num:item.goods_num
                    }
                })
                return checkItem
            },
			// 删除事件
            removeArrFun(){
				console.log('点击删除');
                let allGoodsItemArr = []
                this.shopCarData.map(item=>{
                    for(var i in item.spu) {
                        item.spu[i].sku.map((item, index)=>{
                            allGoodsItemArr.push(item)
                        })
                    }
                })
                let checkItemIdArr = allGoodsItemArr.filter((item)=>{
                    if(item.checked){
                        return item
                    }
                }).map((item)=>{
                    return item.cart_id
                })
                if(this.isTotal){
					uni.showModal({
						title: '',
						content: `确定删除所选${checkItemIdArr.length}件商品吗？`,
						success: (res)=>{
							if (res.confirm) {
								console.log('用户点击确定');
								this.$api.removeShopItem({
								    cmd:{
								        cart:"delcart"
								    },
								    data:{
								        cart_id:checkItemIdArr
								    },
								    method:'POST'
								}).then(res=>{
								    this.getCarList()
								    console.log(res)
								}).catch(err=>{
								
								})
							} else if (res.cancel) {
								console.log('用户点击取消');
							}
						}
					});
                }

            },
			// 清空失效商品
            clearBadGoods(){
                let arr = []
                arr = this.badGoods.map(res=>{
                    return res.cart_id
                })
                this.$api.removeShopItem({
                    cmd:{cart:"delcart"},
                    data:{cart_id:arr},
                    method:'POST'
                }).then(res=>{
                    this.getCarList()
                }).catch(err=>{})
            },
			//编辑按钮处理
			handleEdit(){
				this.isEdit = !this.isEdit;
				// this.shopCarData.map(item=>{
				//     item.checked = false;
				//     for(var i in item.spu) {
				//         item.spu[i].sku.map(_item=>{
				//             _item.checked = false;
				// 			return _item;
				//         })
				//     }
				// 	return item;
				// })
			}
        },

        //页面相关事件处理函数--监听用户下拉动作
        onPullDownRefresh: function() {
            //延时为了看效果
            if(this.$store.getters.hasLogin) {
                this.getCarList(1)    
            }else{
				uni.stopPullDownRefresh();
			}
        },
        async onLoad(options){
            if(this.$store.getters.hasLogin) {
                this.userInfo = this.$store.state.userInfo
                this.member_id = this.userInfo.member_id
            }
			switch(uni.getSystemInfoSync().platform){
				case 'devtools':
					console.log('运行在开发者工具上')
					break;
				default:
					console.log('运行H5端上')
				break;
			}
        },
		onShow(){
			if(this.$store.getters.hasLogin) {
				this.isEdit = false;
			    this.getCarList();
				this.allChecked = false;
			}
			// #ifdef MP-WEIXIN
			this.$refs.authorize.checkIsAuthorize()
			// #endif
		},
		onHide(){
			let carIdArr = this.changeCarNum()
			this.$api.changeCarGoodsNum({
			    cmd:{
			        cart:"changegoodsnum"
			    },
			    data:{
			        member_id: this.member_id,
			        goods:carIdArr
			    },
			}).then(res=>{
			    console.log(res)
			}).catch(err=>{
			})
		},
        onUnload(){
            let carIdArr = this.changeCarNum()
            this.$api.changeCarGoodsNum({
                cmd:{
                    cart:"changegoodsnum"
                },
                data:{
                    member_id: this.member_id,
                    goods:carIdArr
                },
            }).then(res=>{
                console.log(res)
            }).catch(err=>{
            })
        },


    }
</script>
<style lang="scss" type="text/scss">
	.animation-enter-active, .animation-leave-active {
        transition: all .5s;
    }
    .animation-enter,.animation-leave-to{
        transform: translateY(200%);
        opacity: 0;
    }
    .animation-enter-to,.animation-leave{
        transform: translateY(0);
        opacity: 1;
    }
    .shop{
        min-height: 100%;
        background: #fff;
		overflow: hidden;
        &.bg{
            background: #f5f5f5;
        }
        .shopCar-inner{
            position: relative;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            .loading{
                position: absolute;
            }
            .shop-list{
                width: 100%;
				flex: 1;
                flex-direction: column;
				&-header{
					position: fixed;
					width: 100%;
					height: 88upx;
					padding: 0 24upx;
					flex-shrink: 0;
					background: white;
					justify-content: flex-end;
					align-items: center;
					font-size: 28upx;
					&-handle{
						color: $site-default-color;
					}
				}
				.scroll-wrapper{
					padding-top: 108upx;
					padding-bottom: 100upx;
				}
				.shop-store-list{
					width: 100%;
					flex-direction: column;
				}
            }
			// 有效商品
            .shop-store-item{
                margin-bottom: 24upx;
                background: #fff;
                color: #000;
				.store{
					flex-direction: column;
					width: 100%;
					.store-hd{
						height: 80upx;
						align-items: center;
						justify-content: space-between;
						padding: 0 24upx;
						font-size: 28upx;
						border-bottom: 2upx solid #E7E7E7;
						.shop-icon{
						    background: url(../../static/imgs/icons/icon_shop.png) no-repeat;
						    width: 40upx;
						    height: 40upx;
						    background-size: contain;
						}
						.store-name{
						    font-weight: 700;
						    display: flex;
						    align-items: center;
						    margin-left: 10upx;
						    flex-grow: 1;
						    .name{
						        margin-left: 12upx;
						        overflow: hidden;
						        text-overflow: ellipsis;
						        white-space: nowrap;
						        width: 480upx;
						        text-align:left;
						    }
						}
					}
					.store-bd{
						.store-goods-list{
							flex-direction: column;
							width: 100%;
							&-spu{
								padding: 0 24upx;
								width: 100%;
								flex-direction: column;
							}
							.store-goods-item{
							    align-items: center;
								width: 100%;
								.check-box{
									margin-right: 24upx;
								}
							    &:not(:last-child) {
							        border-bottom: 2upx solid #f5f5f5;
							    }
								.cart-goods-item{
									flex: 1;
								}
							}
						}
					}
				}
            }
			// 失效商品
			.invalid-wrap{
			    margin-bottom: 40upx;
				flex-direction: column;
				.unBuy{
					margin-top: 14upx;
					justify-content: center;
					margin-bottom: 24upx;
					color: #353535;
					line-height: 40upx;
					font-size: 28upx;
				}
				.bad-goods-item{
					width: 100%;
					padding: 0 24upx;
					.cart-goods-item{
						width: 100%;
					}
				}
				.clear-bad-goods{
					background:#f5f5f5;
					padding: 20upx 0;
					border-top: 2upx solid #f5f5f5;
					.unbtn{
						width: 340upx;
						height: 76upx;
						background: white;
						border-radius: 4px;
					    font-size: 28upx;
						line-height: 76upx;
					    border: none;
					    color: #666666;
					}
				}
			}
			.no-shop{
			    height: 100%;
			    display: flex;
			    flex-direction: column;
			    justify-content: center;
			    align-items: center;
			    .inner{
			        display: block;
			        width: 100%;
			        text-align: center;
			    }
			    .no-data{
			        height: auto;
			    }
			    .g-btn{
			        display: block;
			        width:300upx;
			        height:80upx;
			        font-size: 32upx;
			        line-height: 80upx;
			        text-align: center;
			        background:#fff;
			        border:1px solid $site-default-color;
			        color: $site-default-color;
			        border-radius:4upx;
			        margin: auto;
			        margin-top: 40upx;
			    }
			}
        }
		.shopCarBar-wrapper{
			position: fixed;
			bottom:var(--window-bottom);
			left: 0;
			width: 100%;
			&-wx{
				bottom: 0upx;
			}
		}
        .fixed-shopCarBar{
			width: 100%;
            background: #fff;
            height: 100upx;
            border-top: 2upx solid #f5f5f5;
			z-index: 99999;
            .bar-l{
                padding: 0 16upx 0 30upx;
                font-size: 24upx;
                color: #999999;
                display: flex;
                align-items: center;
                justify-content: space-between;
                flex-grow: 1;
                .all-check{
                    height: 100upx;
                    display: flex;
                    align-items: center;
                }
            }
            .total-price{
                display: flex;
				flex-direction: column;
				align-items: flex-end;
                .txt{
                    font-size: 32upx;
                    color: #000;
                    font-weight: 500;
                }
                .price{
                    color: #D0021B;
                    font-size: 34upx;
                }
                .desc{
                    font-size: 22upx;
                    color: #353535;
                }
            }
            .bar-r{
                .pay-btn{
                    width: 200upx;
                    height: 100upx;
                    background: $site-default-color;
                    color: #FFF;
                    font-size: 32upx;
					display: flex;
					justify-content: center;
					align-items: center;
                    &.dis{
                        background: #CCCCCC;
						color: #666666;
                    }
                }
            }
        }
		.check-box{
			&-wrapper{
				display: flex;
				align-items: center;
			}
			&-label{
				display: flex;
				align-items: center;
				.input-box{
					display: none;
				}
				.show-box{
					width: 40upx;
					height: 40upx;
					background: red;
					border-radius: 50%;
					transition: background .2s;
					background: url("../../static/imgs/icons/icon_check.png") no-repeat center center;
					background-size: 100% 100%;
				}
				.checked{
					background-image: url("../../static/imgs/icons/icon_selected.png");
				}
				.normal{
					/deep/.uni-checkbox-input{
						transition: all .2s;
						border-radius: 50%;
						background: white;
						color: white;
					}
					/deep/.uni-checkbox-input-checked{
						background: $site-default-color;
					}
				}
				&-text{
					margin-left: 20upx;
				}
			}
		}
        // .check-box{
        //     display: flex;
        //     justify-content: center;
        //     align-items: center;
        //     input[type="checkbox"]{
        //         display: inline-block;
        //         width: 20px;
        //         height: 20px;
        //         color: transparent;
        //         text-align: center;
        //         line-height: inherit;
        //         box-sizing: border-box;
        //         border: 1px solid #e5e5e5;
        //         -webkit-transition: .2s;
        //         transition: .2s;
        //         border-radius: 100%;
        //         &:checked{
        //             position: relative;
        //             background-color: $site-default-color;
        //             border-color: $site-default-color;
        //             font: 14px/1 vant-icon;
        //             font-size: inherit;
        //             text-rendering: auto;
        //             -webkit-font-smoothing: antialiased;
        //             
        //         }
        //     }
        //     >span{
        //         color: #323233;
        //         margin-left: 10px;
        //     }
        // }
        
    }


</style>

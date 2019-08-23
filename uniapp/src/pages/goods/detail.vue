<template>
    <view class="goodsDetail-wrapper container">
		<!--header-->
			<view class="tui-header-box" :style="{height:height+'px',background:'rgba(255,255,255,'+opcity+')'}">
				<view class="tui-header" :style="{marginTop:top+'px',opacity:opcity}">
					商品详情
				</view>
				<view class="tui-header-icon" :style="{marginTop:top+'px'}">
					<view class="tui-icon tui-icon-arrowleft tui-icon-back" :style="{background:'rgba(0, 0, 0,'+iconOpcity+')'}"
					@tap="back">
						<tui-icon name="arrowleft" :color="opcity>=1?'#000':'#fff'"></tui-icon>
					</view>
					<!-- <view class="tui-icon tui-icon-more-fill  tui-icon-ml" :style="{color:opcity>=1?'#000':'#fff',background:'rgba(0, 0, 0,'+iconOpcity+')',fontSize:'20px'}"
					@tap.stop="openMenu"></view>
					<tui-badge type="red" size="small">5</tui-badge> -->
				</view>
			</view>
		<!--header-->
		<!--banner-->
			<view class="tui-banner-swiper">
				<swiper class="tui-banner-inner" autoplay="true" interval="5000" duration="150" :circular="true" :style="{height:scrollH + 'px'}" @change="bannerChange">
					<block v-for="(item,index) in banner" :key="index">
						<swiper-item :data-index="index" @tap.stop="previewImage">
							<image :src="item" class="tui-slide-image" :style="{height:scrollH+'px'}" />
						</swiper-item>
					</block>
				</swiper>
				<tui-tag type="translucent" shape="circleLeft" size="small">{{bannerIndex}}/{{banner.length}}</tui-tag>
			</view>

		<!--banner-->

		<!-- content -->
			<view class="goodsDetail-inner">
				<view class="top">
					<view class="spell-bar" v-if="goodsActivityType === 1 ">
						<view class="l">
							<view class="l-cell">
								<view class="price">
									<text class="num">{{betweenPrice}}</text>
								</view>
								<view class="desc">
									<text class="txt">优惠拼团价</text>
									<text class="num-tag">单独购买价￥{{originalPrice}}</text>
								</view>
							</view>
						</view>
						<view class="r">{{group_people_num}}人团</view>
					</view>
					<view class="secKill-bar" v-if="goodsActivityType == 2" :class="{green:goodsInfo.is_start_seckill===0}">
						<view class="l">
							<text class="sec-price">{{betweenPrice}}</text>
							<text class="old-price">￥{{originalPrice}}</text>
						</view>
						<view class="r">
							<!-- <count-down temp="3" :timeProps="goodsInfo.seckill_residue_time*1000" :isStart="goodsInfo.is_start_seckill"></count-down> -->
						</view>
					</view>
					<view class="goods-cell-box">
						<view class="cell-name">
							{{goods_name}}
						</view>
						<view v-if="goodsActivityType != 1 && goodsActivityType != 2">
							<view class="cell-price" v-if="goodsType == 2 && price_mode == 1" :class="interval_price.length == 2 ? 'special' : '' ">
								<view class="cell-price-item" v-for="(item, index) in interval_price" :key="index">
									<view class="cell-price-sku" v-if="index == 0">{{item.num}}件起批</view>
									<view class="cell-price-sku" v-else-if="interval_price.length == (index+1)">≥{{item.num}}件</view>
									<view class="cell-price-sku" v-else>{{item.num}}-{{interval_price[index+1].num-1}}件</view>
									<view class="cell-price-amount">￥{{item.price|toFixedTwo}}</view>
								</view>
							</view>
							<view class="cell-price special" v-else-if="goodsType == 2 && price_mode == 2">
								<view class="cell-special-num">{{interval_price}}件起批</view>
								<view class="cell-special-price">{{betweenPrice}}</view>
							</view>
							<view class="cell-price normal" v-else>
								<text class="goods-price">{{betweenPrice}}</text>
								<view class="goods-label" v-if="goodsLabel.length">
									<view class="tags" v-for="(labelItem, index) in goodsLabel" :key="index">
										<image :src="labelItem.label_icon" />
									</view>
								</view>
							</view>
						</view>
						
						<view class="cell-le">
							<view class="li">库存：{{totalStockNum}}</view>
							<view class="li" v-if="simple_address != ''">{{simple_address.province.name}} {{simple_address.city!=undefined?simple_address.city.name:''}}</view>
							<view class="li">销量：{{total_sold_out}}</view>
						</view>
					</view>
				</view>
				<view class="standard" v-if="goodsActivityType == 0 && goodsType == 1 && couponItemData.length">
					<view class="standard-item">
						<view class="label">优惠券</view>
						<view class="txt">满100减10</view>
					</view>
					<!-- <van-cell title="优惠券" @click="couponDialogEvt" >
                        <div slot="right-icon" class="right-icon">
                            <div class="value">{{couponItemData.length}}张可选</div>
                            <van-icon name="arrow" />
                        </div>
                    </van-cell> -->
				</view>
				<view class="standard">
					<view class="standard-item">
						<view class="label">配送至</view>
						<view class="txt">{{curCity}}</view>
					</view>
					<view class="standard-item">
						<view class="label">运费</view>
						<view class="txt">{{fareTip}}</view>
					</view>
					<!-- <view class="standard-item">
						<view class="label">规格</view>
						<view class="txt">{{selectedGG}}</view>
						<tui-icon name="arrowright" :color="'#999'" :size="iconSize"></tui-icon>
					</view> -->
					<!-- <van-cell class="regeo-cell" title="配送至" @click="geoAreaDialog">
						<div class="value">{{curCity}}</div>
						<van-icon name="arrow" />
					</van-cell>
					<van-cell class="free-cell" title="运费信息">
						<div class="value">{{fareTip}}</div>
					</van-cell> -->
				</view>
				<evaluate :spu_id="Number(spu_id)"></evaluate>
				<view class="bottom">
					<view class="detail-bar">
						<view class="items">
							<view class="item" v-for="(item, index) in detailTab" :key="index" :class="[detailTabIndex == index?'active':'']"
							@tap="changeDetailTab" :data-index="index">
								<view class="txt">{{item}}</view>
							</view>
						</view>
					</view>
					<view class="detail-desc">
						<view v-if="detailTabIndex == 0" :style="{width: '100%'}">
							<rich-text class="desc-list" :nodes="goods_detail" v-if="goods_detail"></rich-text>
							<view v-else class="no-desc">暂无详情介绍</view>
						</view>
						<view v-else :style="{width: '100%'}">
							<view class="attr-list" v-if="goods_attr.length">
								<view class="attr-cell" v-for="(item,index) in goods_attr" :key="index">
									<view class="attr-cell-name">{{item.name}}</view>
									<view class="attr-cell-txt">{{item.value}}</view>
								</view>
				
							</view>
							<view class="no-attr" v-else>暂无规格参数</view>
						</view>
					</view>
				</view>
			</view>
		<!-- content -->

		<!-- footer -->
			<view class="fixed-tool">
				<view class="fixed-tool-left tui-col-5">
					<!-- #ifdef H5 || APP-PLUS -->
					<view class="fixed-tool-item" hover-class="opcity" :hover-stay-time="hoverStayTime" @tap="$mUtils.toast('功能开发中')">
						<tui-icon name="kefu" :size="footerIconSize" color='#888'></tui-icon>
						<view class="fixed-tool-text tui-scale-small">联系客服</view>
					</view>
					<!-- #endif -->
					<view class="fixed-tool-item" hover-class="opcity" :hover-stay-time="hoverStayTime" @tap="$mUtils.toast('功能开发中')">
						<tui-icon name="shop" :size="footerIconSize" color='#888'></tui-icon>
						<view class="fixed-tool-text tui-scale-small">店铺</view>
					</view>
					<view class="fixed-tool-item" hover-class="opcity" :hover-stay-time="hoverStayTime" @tap="gotoShop">
						<tui-icon name="cart" :size="footerIconSize" color='#888'></tui-icon>
						<view class="fixed-tool-text tui-scale-small">购物车</view>
						<view v-show="shopping_dot">
							<tui-badge type="danger" size="small" >{{shopNum}}</tui-badge>
						</view>	
					</view>
				</view>
				<view class="fixed-tool-right tui-right-flex tui-col-7 tui-btnbox-4">
					<view class="tui-flex-1" v-if="goodsActivityType == 2">
						<view class="nowPay-btn tui-flex-1" hover-class="opcity" :hover-stay-time="hoverStayTime" v-if="goodsInfo.is_start_seckill == 1 && totalStockNum" @tap="selGoods(2)">立即抢购</view>
						<view class="noSale-btn tui-flex-1" v-if="!totalStockNum">已被抢空</view>
						<view class="nowPay-btn tui-flex-1" hover-class="opcity" :hover-stay-time="hoverStayTime" v-if="goodsInfo.is_start_seckill == 0" @tap="$mUtils.toast('活动还没开始')">即将开始</view>
					</view>
					<view class="tui-flex-1" v-else-if="goodsActivityType == 1">
						<view class="alone-btn tui-flex-1" @tap="selGoods(3, 1)" hover-class="opcity" :hover-stay-time="hoverStayTime">
							<view class="txt">单独购买</view>
							<view class="num">￥{{originalPrice}}</view>
						</view>
						<view class="spell-btn tui-flex-1" @tap="selGoods(4, 2)" v-if="!isAddGroup && totalStockNum" hover-class="opcity" :hover-stay-time="hoverStayTime">
							<view class="txt">{{group_people_num}}人团</view>
							<view class="num">{{betweenPrice}}</view>
						</view>
						<view class="spell-btn tui-flex-1" @tap="selGoods(4, 2)" v-if="isAddGroup && totalStockNum" hover-class="opcity" :hover-stay-time="hoverStayTime">
							<view class="txt">立刻参团</view>
							<view class="num">{{betweenPrice}}</view>
						</view>
						<view class="noSale-btn tui-flex-1" v-if="!totalStockNum">已抢完</view>
					</view>
					<view class="tui-flex-1" v-else>
						<view class="addCar-btn tui-flex-1" @tap="selGoods(1)" v-if="isSale" hover-class="opcity" :hover-stay-time="hoverStayTime">加入购物车</view>
						<view class="nowPay-btn tui-flex-1" @tap="selGoods(2)" v-if="isSale" hover-class="opcity" :hover-stay-time="hoverStayTime">立即购买</view>
						<view class="noSale-btn tui-flex-1" v-if="!isSale">商品已下架</view>
					</view> 
				</view>   
			</view>
		<!-- footer -->

		<!--底部选择层-->
			<tui-bottom-popup class="standardPopup" :show="standardPopup" @close="hideStandardPopup">
				<view class="standardWrap" v-if="standardPopup">
					<tui-icon name="close-fill" color="#333" :size="20" @tap="hideStandardPopup" class="close-icon"></tui-icon>
					<view class="standardTop">
						<view class="standardImg lazy-img">
							<image :src="banner[0]"/>
						</view>
						<view class="standardGoodsInfo">
							<view class="goodsName">{{goods_name}}</view>
							<view class="goodsPrice">{{(goodsActivityType == 1 && (isGroupBtn == 1 || btnType == 1)) ? originalPrice : betweenPrice}}</view>
						</view>
					</view>
					<view class="standardInner" v-if="goodsType == 1">
						<view class="standardMiddle" v-if="Object.keys(sku.tree).length">
							<view class="standardItem" v-for="(item,index) in sku.tree" :key="index">
								<text class="h1">{{item.label}}</text>
								<view class="section">
									<view class="standardAttr" :class="_item.checked?'checked':''" v-for="(_item, _index) in item.value" :key="_index" @click="chooseSku(index, _item)">
										<text>{{_item.name}}</text>
									</view>
								</view>
							</view>
						</view>
						<view class="standardNum">
							<view class="standardNumItem">
								<text class="label">购买数量</text>
								<view class="txt">最多可购{{(goodsActivityType == 1 && (isGroupBtn == 1 || btnType == 1)) ? originalStock : totalStockNum}}件</view>
							</view>
							<tui-numberbox :iconsize="stepIconSize" :max="(goodsActivityType == 1 && (isGroupBtn == 1 || btnType == 1)) ? originalStock : totalStockNum" :min="minNum" :value="goods_num" @change="changeSteper" :disabled="(goodsActivityType == 1 && (isGroupBtn == 1 || btnType == 1)) ? originalStock==0 : totalStockNum==0"></tui-numberbox>
							<!-- <van-stepper :integer="true" v-model="goods_num" :min="minNum" :max="(goodsActivityType == 1 && (isGroupBtn == 1 || btnType == 1)) ? originalStock : totalStockNum" :disabled="(goodsActivityType == 1 && (isGroupBtn == 1 || btnType == 1)) ? originalStock==0 : totalStockNum==0"/> -->
						</view>
					</view>
					<view class="wholesale" v-else>
						<view class="wholesaleInner">
							<view class="wholesaleHeader" v-if="Object.keys(sku.tree).length">
								<view class="wholesaleHeaderItem" v-for="(item, index) in sku.tree" :key="index">
									{{item.label}}
								</view>
								<view class="wholesaleHeaderItem">
									数量
								</view>
							</view>
							<view v-if="Object.keys(sku.tree).length">
								<view class="wholesale-selector" v-for="(item, index) in sku.tree" :key="index" :class="(index+1)==sku.tree.length && sku.tree.length>1?'right':''">
									<view>
										<view :class="_item.actived? 'active':''" v-for="(_item, _index) in item.value" :key="_index" @click="changeAttrEvt(index, _item)">
											<text v-if="_item.flag && index == 0"></text>                               
											{{_item.name}}
										</view>
									</view>
									<view class="wholesale-selector-stock" v-if="(index+1)==sku.tree.length">
										<view class="stock-div" v-for="(_item, _index) in sku.list" :key="_index" v-if="_item.s1 == curSkuId">
							
											<!-- <van-stepper :integer="true" v-model="_item.stockNum" :max="_item.stock_num" min="0" :disabled="_item.stock_num==0"/> -->
											<view class="wholesale-stock"><text>库存 {{_item.stock_num}}</text></view>
											<view class="wholesale-price"><text>价格 {{_item.price}}</text></view>
											
										</view>
									</view>
								</view>
							</view>
							<view v-else>
								<view class="wholesale-no-attr" v-for="(item, index) in sku.list" :key="index">
									<view>
										<text>购买数量</text>
										<view>最多可购买{{item.stock_num}}件</view>
									</view>
									<!-- <van-stepper :integer="true" v-model="item.stockNum" :max="item.stock_num" min="0" :disabled="item.stock_num==0"/> -->
								</view>	
							</view>
							<view class="wholesaleBottom">
								<text class="selectTotal">共{{specialSelectNum}}件</text>
								<text class="selectPrice">￥{{specialSelectAmount}}</text>
							</view>
						</view>
					</view>
					<view class="standardBottom" v-if="goodsActivityType == 1">
						<view class="group-standard " v-if="isGroupBtn == 1 || btnType == 1">
							<view class="btn addCar-btn tui-flex-1" @click="goodConfirmEvt(1)" v-if="originalStock">加入购物车</view>
							<view class="btn tui-flex-1" v-if="originalStock"  @click="goodConfirmEvt(2)">立即购买</view>
							<view class="btn tui-flex-1 noStockBtn" v-if="originalStock == 0">库存不足</view>
							<!-- <van-button v-if="originalStock" class="addCar-btn" type="primary" @click="goodConfirmEvt(1)">加入购物车</van-button>
							<van-button v-if="originalStock" type="primary" @click="goodConfirmEvt(2)">立即购买</van-button>
							<van-button v-if="originalStock == 0" block type="primary" class="noStockBtn">库存不足</van-button> -->
						</view>
						<view class="group-standard" v-if="isGroupBtn == 2 || btnType == 2">
							<view class="btn tui-flex-1" v-if="totalStockNum" @click="goodConfirmEvt">下一步</view>
							<view class="btn tui-flex-1 noStockBtn" v-else>已抢完</view>
							<!-- <van-button v-if="totalStockNum" block type="primary" @click="goodConfirmEvt">下一步</van-button>
							<van-button v-else block type="primary" class="noStockBtn">已抢完</van-button> -->
						</view>
		
					</view>
					<view class="standardBottom" v-else-if="goodsActivityType == 2">
						<!-- <van-button v-if="totalStockNum != 0" block type="primary" @click="goodConfirmEvt">立刻秒杀</van-button>
						<van-button v-else block type="primary" class="noStockBtn">秒杀完</van-button> -->
					</view>
					<view class="standardBottom" v-else>
						<view class="btn tui-flex-1" :class="btnType==1?'addCar-btn':''" v-if="totalStockNum" @click="goodConfirmEvt">{{btnType==1?'加入购物车':'立即购买'}}</view>
						<view class="btn tui-flex-1 noStockBtn" v-else>库存不足</view>
						<!-- <van-button v-if="totalStockNum != 0" block type="primary" :class="btnType==1?'addCar-btn':''" @click="goodConfirmEvt">{{btnType==1?'加入购物车':'立即购买'}}</van-button>
						<van-button v-else block type="primary" class="noStockBtn">库存不足</van-button> -->
					</view>
				</view>
			</tui-bottom-popup>
		<!--底部选择层-->
		<!-- 初始化地理位置 -->
		<geoMap @emitMap="emitMap"></geoMap>
		<!-- 初始化地理位置 -->
		<!-- <div class="goodsDetail-inner">
				<div class="goodsDetail-top">
					<div class="banner">
						<div class="banner-pic">
							<van-swipe :autoplay="3000" :show-indicators="false" :duration="1000" @change="bannerChange">
								<van-swipe-item v-for="(item, index) in banner" :key="index" class="lazy-img">
									<img v-lazy="item" />
								</van-swipe-item>
							</van-swipe>
							<div class="num">{{bannerIndex}} / {{banner.length}}</div>
						</div>
						<div class="share-icon" v-if="$parent.isWx" @click="shareEvt"></div>
					</div>
					<div class="spell-bar" v-if="goodsActivityType === 1 ">
						<div class="l">
							<div class="l-cell">
								<div class="price">
									<div class="num">{{betweenPrice}}</div>
								</div>
								<div class="desc">
									<div class="txt">优惠拼团价</div>
									<div class="num-tag">单独购买价￥{{originalPrice}}</div>
								</div>
							</div>
						</div>
						<div class="r">{{group_people_num}}人团</div>
					</div>
					<div class="secKill-bar" v-if="goodsActivityType == 2" :class="{green:goodsInfo.is_start_seckill===0}">
						<div class="l">
							<div class="sec-price">{{betweenPrice}}</div>
							<div class="old-price">￥{{originalPrice}}</div>
						</div>
						<div class="r">
							<count-down temp="3" :timeProps="goodsInfo.seckill_residue_time*1000" :isStart="goodsInfo.is_start_seckill"></count-down>
						</div>
					</div>
					<div class="goods-cell-box">
						<div class="cell-name">
							<span class="goods-desc">{{goods_name}}</span>
						</div>
						<div v-if="goodsActivityType != 1 && goodsActivityType != 2">
							<div class="cell-price" v-if="goodsType == 2 && price_mode == 1" :class="interval_price.length == 2 ? 'special' : '' ">
								<div class="cell-price-item" v-for="(item, index) in interval_price" :key="index">
									<div class="cell-price-sku" v-if="index == 0">{{item.num}}件起批</div>
									<div class="cell-price-sku" v-else-if="interval_price.length == (index+1)">≥{{item.num}}件</div>
									<div class="cell-price-sku" v-else>{{item.num}}-{{interval_price[index+1].num-1}}件</div>
									<div class="cell-price-amount">￥{{item.price|toFixedTwo}}</div>
								</div>
							</div>
							<div class="cell-price special" v-else-if="goodsType == 2 && price_mode == 2">
								<div class="cell-special-num">{{interval_price}}件起批</div>
								<div class="cell-special-price">{{betweenPrice}}</div>
							</div>
							<div class="cell-price normal" v-else>
								<div class="goods-price">{{betweenPrice}}</div>
								<div class="goods-label" v-if="goodsLabel.length">
									<div class="tags" v-for="(labelItem, index) in goodsLabel" :key="index">
										<img :src="labelItem.label_icon" />
									</div>
								</div>
							</div>
						</div>
						
						<div class="cell-le">
							<div class="li">库存 {{totalStockNum}}</div>
							<div class="li" v-if="simple_address != ''">{{simple_address.province.name}} {{simple_address.city!=undefined?simple_address.city.name:''}}</div>
							<div class="li">销量 {{total_sold_out}}</div>
						</div>
					</div>
				</div>
				<div class="standard" v-if="goodsActivityType == 0 && goodsType == 1 && couponItemData.length">
					<van-cell title="优惠券" @click="couponDialogEvt" >
                        <div slot="right-icon" class="right-icon">
                            <div class="value">{{couponItemData.length}}张可选</div>
                            <van-icon name="arrow" />
                        </div>
                    </van-cell>
				</div>
				<div class="standard">
					<van-cell class="regeo-cell" title="配送至" @click="geoAreaDialog">
						<div class="value">{{curCity}}</div>
						<van-icon name="arrow" />
					</van-cell>
					<van-cell class="free-cell" title="运费信息">
						<div class="value">{{fareTip}}</div>
					</van-cell>
				</div>

				<div class="spell-box" v-if="goodsActivityType == 1 ">
					<div class="spell-flow">
						<div class="hd">
							<div class="txt">拼团流程</div>
							<div class="txt-r" @click="ins_dialog = !ins_dialog">
								<div class="">详细说明</div>
								<van-icon name="arrow"/>
							</div>
						</div>
						<div class="bd">
							<div class="spell-stepList">
								<div class="spell-stepItem">
									<div class="cir">1</div>
									<div class="txt">选择商品</div>

								</div>
								<div class="spell-stepItem">
									<div class="cir">2</div>
									<div class="txt">开团参团</div>

								</div>
								<div class="spell-stepItem">
									<div class="cir">3</div>
									<div class="txt">邀请好友</div>

								</div>
								<div class="spell-stepItem">
									<div class="cir">4</div>
									<div class="txt">人满开团</div>
								</div>
							</div>
						</div>
					</div>
					<div class="spell-infoBox" v-if="noGroup" >
						<div class="desc vux-1px-b">
							<span>有{{groupTeam.total}}人正在参加拼单，您可以直接参与</span>
							<span class="seeMore" @click="group_list_dialog = true">查看更多<i class="van-icon van-icon-arrow"></i></span>
						</div>
						<div class="go-spell" v-for="(item, index) in groupTeam.list" :key="index" v-if="item.remain_time">
							<div class="l">
								<div class="spell-user">
									<div class="user-pic lazy-img">
										<img v-lazy="item.member_avatar" alt="">
									</div>
									<div class="user-name">{{item.member_nick_name}}</div>
								</div>
								<div class="timer">
									<div class="t">还差{{item.remain_num}}人成团</div>
									<countDown  ref='timeC' :timeProps="item.remain_time" temp="2" @emitCountDownFun="emitCountDownFun"></countDown>    
								</div>
							</div>
							<div class="r" @click="goGroup(item.team_id)">去参团</div>
						</div>

					</div>
            	</div>
			
				<div class="goodsDetail-middle">
					<div class="goodsDetail-desc">
						<van-tabs v-model="detailTabIndex" class="reset" :line-width=110 >
							<van-tab v-for="(item,index) in detailTab" :key="index" :title='item'>
								<div class="tabcard-item" v-if="index===0">
									<div class="goods-img-list" v-if="goods_detail.length" v-html="goods_detail">
										
									</div>
									<div class="no-goods-img" v-else>
										<div class="pic"></div>
										<div class="">暂无详情介绍</div>
									</div>
								</div>
								<div class="tabcard-item" v-else>
									<div class="cell-list" v-if="goods_attr.length">
										<div class="attr-cell" v-for="(item,index) in goods_attr" :key="index">
											<div class="attr-cell-name">{{item.name}}</div>
											<div class="attr-cell-txt">{{item.value}}</div>
										</div>
				
									</div>
									<div class="no-attr" v-else>
										<div class="pic"></div>
										<div class="">暂无规格参数</div>
									</div>
								</div>
							</van-tab>
						</van-tabs>
					</div>
				</div>
		</view> -->
		<!-- <div class="fixed-tool">
			<div class="c-btn">
				<router-link :to="toolHome.path" class="tag-a">
                    <img :src="toolHome.icon" />
                    <div class="txt">{{toolHome.name}}</div>
                </router-link>
            </div>
			<div class="c-btn">
				<router-link :to="toolShop.path" class="tag-a">
					<span class="shopDot" v-if="shopping_dot"></span>
                    <img :src="toolShop.icon" />
                    <div class="txt">{{toolShop.name}}</div>
                </router-link>
            </div>
			<div v-if="goodsActivityType == 2">
				<div class="nowPay-btn" v-if="goodsInfo.is_start_seckill == 1 && totalStockNum" @click="selGoods(2)">立即抢购</div>
				<div class="noSale-btn" v-if="!totalStockNum">已被抢空</div>
				<div class="nowPay-btn" v-if="goodsInfo.is_start_seckill == 0" @click="$toast('活动还没开始')">即将开始</div>
			</div>
			<div v-else-if="goodsActivityType == 1">
				<div class="alone-btn" @click="selGoods(3, 1)">
					<div class="txt">单独购买</div>
					<div class="num">￥{{originalPrice}}</div>
				</div>
				<div class="spell-btn" @click="selGoods(4, 2)" v-if="!isAddGroup && totalStockNum">
					<div class="txt">{{group_people_num}}人团</div>
					<div class="num">{{betweenPrice}}</div>
				</div>
				<div class="spell-btn" @click="selGoods(4, 2)" v-if="isAddGroup && totalStockNum">
					<div class="txt">立刻参团</div>
					<div class="num">{{betweenPrice}}</div>
				</div>
				<div class="noSale-btn" v-if="!totalStockNum">已抢完</div>
			</div>
			<div v-else>
				<div class="addCar-btn" @click="selGoods(1)" v-if="isSale">加入购物车</div>
				<div class="nowPay-btn" @click="selGoods(2)" v-if="isSale">立即购买</div>
				<div class="noSale-btn" v-if="!isSale">商品已下架</div>
			</div>    
		</div> -->
		<!-- <transition name="fade">
			<cube-popup v-show="standardPopup" class="standardPopup" position="bottom" :maskClosable=false :zIndex=1000>
				<transition name="move">
					<div class="standardWrap" v-if="standardPopup">
						<div class="standardClose">
							<van-icon name="cross" @click="standardPopup = false"/>
						</div>
						<div class="standardTop">
							<div class="standardImg lazy-img">
								<img v-lazy="banner[0]"/>
							</div>
							<div class="standardGoodsInfo">
								<div class="goodsName">{{goods_name}}</div>
								<div class="goodsPrice">{{(goodsActivityType == 1 && (isGroupBtn == 1 || btnType == 1)) ? originalPrice : betweenPrice}}</div>
							</div>
						</div>
						<div class="standardInner" v-if="goodsType == 1">
							<cube-scroll v-if="standardPopup">
								<div class="standardMiddle" v-if="Object.keys(sku.tree).length">
									<div class="standardItem" v-for="(item,index) in sku.tree" :key="index">
										<h1>{{item.label}}</h1>
										<section>
											<div class="standardAttr" :class="_item.checked?'checked':''" v-for="(_item, _index) in item.value" :key="_index" @click="chooseSku(index, _item)">
												<span>{{_item.name}}</span>
											</div>
										</section>
									</div>
								</div>
								<div class="standardNum">
									<div class="standardNumItem">
										<span>购买数量</span>
										<p>最多可购{{(goodsActivityType == 1 && (isGroupBtn == 1 || btnType == 1)) ? originalStock : totalStockNum}}件</p>
									</div>
									<van-stepper :integer="true" v-model="goods_num" :min="minNum" :max="(goodsActivityType == 1 && (isGroupBtn == 1 || btnType == 1)) ? originalStock : totalStockNum" :disabled="(goodsActivityType == 1 && (isGroupBtn == 1 || btnType == 1)) ? originalStock==0 : totalStockNum==0"/>
								</div>
							</cube-scroll>	
						</div>
						<div class="wholesale" v-else>
							<div class="wholesaleInner">
								<div class="wholesaleHeader" v-if="Object.keys(sku.tree).length">
									<div class="wholesaleHeaderItem" v-for="(item, index) in sku.tree" :key="index">
										{{item.label}}
									</div>
									<div class="wholesaleHeaderItem">
										数量
									</div>
								</div>
								<section v-if="Object.keys(sku.tree).length">
									<div class="wholesale-selector" v-for="(item, index) in sku.tree" :key="index" :class="(index+1)==sku.tree.length && sku.tree.length>1?'right':''">
										<ul>
											<cube-scroll>
												<li :class="_item.actived? 'active':''" v-for="(_item, _index) in item.value" :key="_index" @click="changeAttrEvt(index, _item)">
													<span v-if="_item.flag && index == 0"></span>                               
													{{_item.name}}
												</li>
											</cube-scroll>	
										</ul>
										<div class="wholesale-selector-stock" v-if="(index+1)==sku.tree.length">
											<cube-scroll>
												<div class="stock-div" v-for="(_item, _index) in sku.list" :key="_index" v-if="_item.s1 == curSkuId">
								
													<van-stepper :integer="true" v-model="_item.stockNum" :max="_item.stock_num" min="0" :disabled="_item.stock_num==0"/>
													<div class="wholesale-stock"><span>库存 {{_item.stock_num}}</span></div>
													<div class="wholesale-price"><span>价格 {{_item.price|toFixedTwo}}</span></div>
													
												</div>
											</cube-scroll>
										</div>
									</div>
								</section>
								<section v-else>
									<div class="wholesale-no-attr" v-for="(item, index) in sku.list" :key="index">
										<div>
											<span>购买数量</span>
											<p>最多可购买{{item.stock_num}}件</p>
										</div>
										<van-stepper :integer="true" v-model="item.stockNum" :max="item.stock_num" min="0" :disabled="item.stock_num==0"/>
									</div>	
								</section>
								<div class="wholesaleBottom">
									<span class="selectTotal">共{{specialSelectNum}}件</span>
									<span class="selectPrice">￥{{specialSelectAmount|toFixedTwo}}</span>
								</div>
							</div>
						</div>
						<div class="standardBottom" v-if="goodsActivityType == 1">
							<div class="group-standard" v-if="isGroupBtn == 1 || btnType == 1">
								<van-button v-if="originalStock" class="addCar-btn" type="primary" @click="goodConfirmEvt(1)">加入购物车</van-button>
								<van-button v-if="originalStock" type="primary" @click="goodConfirmEvt(2)">立即购买</van-button>
								<van-button v-if="originalStock == 0" block type="primary" class="noStockBtn">库存不足</van-button>
							</div>
							<div class="group-standard" v-if="isGroupBtn == 2 || btnType == 2">
								<van-button v-if="totalStockNum" block type="primary" @click="goodConfirmEvt">下一步</van-button>
								<van-button v-else block type="primary" class="noStockBtn">已抢完</van-button>
							</div>
		
						</div>
						<div class="standardBottom" v-else-if="goodsActivityType == 2">
							<van-button v-if="totalStockNum != 0" block type="primary" @click="goodConfirmEvt">立刻秒杀</van-button>
							<van-button v-else block type="primary" class="noStockBtn">秒杀完</van-button>
						</div>
						<div class="standardBottom" v-else>
							<van-button v-if="totalStockNum != 0" block type="primary" :class="btnType==1?'addCar-btn':''" @click="goodConfirmEvt">{{btnType==1?'加入购物车':'立即购买'}}</van-button>
							<van-button v-else block type="primary" class="noStockBtn">库存不足</van-button>
						</div>
					</div>
				</transition>
			</cube-popup>
		</transition> -->
		<!-- 城市地址首字母排序 -->
		<!-- <transition name="fade">
			<cube-popup v-show="region_show" class="region-popup" :maskClosable=false :zIndex=1000>
				<div class="region-close" @click="region_show=false"><van-icon name="cross"/></div>
				<div class="region-inner">
					<div class="region-title">
						<div class="address-icon"></div>
						<div class="txt">{{curCity}}</div>
					</div>
					<div class="city-wrapper">
						<cube-scroll>
							<div class="scroller-hook">
								<div class="cities">
									<ul>
										<li v-for="(city, index) in areaList" @click="touchUp(city)" :key="index" class="item city-click" :data-name="city.cityName" :data-id="city.adcode">
											<span class="border-1px name">{{city.cityName}}</span>
										</li>
									</ul>
								</div>
							</div>
						</cube-scroll>
					</div>
				</div>
			</cube-popup>
		</transition> -->
		<!-- 优惠券选择弹出层 -->
		<!-- <transition name="fade">
			<cube-popup v-show="couponIsDialog" class="couponDialog" position="bottom" :maskClosable=false :zIndex=1000>
				<transition name="move">
					<div class="popup-inner" v-if="couponIsDialog">
						<div class="hd">
							<div class="">可领取优惠券</div>
							<div class="close-icon" @click="couponIsDialog = false">
								<img src="../../assets/images/icons/icon-select@2x.png" />
							</div>
						</div>
						<div class="bd" >
							<cube-scroll v-if="!couponNoData">
								<couponItem type="1" :couponItemData="couponData" @emitGetCoupon="getCoupon" ></couponItem>
							</cube-scroll>
							<div class="no-data" v-if="couponNoData">
								<div class="pic"></div>
								<div class="">暂无可领取优惠券~</div>
							</div>
						</div>
					</div>
					
				</transition>
			</cube-popup>
		</transition> -->
		<!-- 拼团流程 -->
		<!-- <transition name="fade">
			<cube-popup v-show="ins_dialog" class="ins-dialog" :zIndex=1000>
				<div class="ins-box">
					<p><span>1、</span>开团：在商城内选择喜欢的商品，点击“去开团”，付款成功后即为开团成功</p>
					<p><span>2、</span>参团：进入朋友分享的页面，点击“立即参团”，付款后即为参团成功，若多人同时支付，按先支付成功的用户获得参团资格，参团订单未支付不计入参团数量，团过期未支付订单失效，但参团人信息也会显示在团里面</p>
					<p><span>3、</span>成团：在开团或参团之后,可以点击“分享出去”，在有效时间凑齐成团人数即拼团成功</p>
					<p><span>4、</span>组团失败：在有效时间内未凑齐人数，即为组团失败，此时商城会将原款分别退回</p>
				</div>
				<i class="ico-close" @click="ins_dialog = false"></i>
			</cube-popup>
		</transition> -->
		<!-- 拼团团队信息 -->
		<!-- <transition name="fade">
			<cube-popup v-show="group_list_dialog" class="group-list-dialog" :zIndex=1000>
				<div class="group-box" v-if="group_list_dialog">
					<h1>正在拼团<span @click="group_list_dialog = false"><van-icon name="cross" @click="standardPopup = false"/></span></h1>
					<div class="group-inner" >
						<cube-scroll ref="scroll"  @pulling-up="loadMore" :options="options">
							<div class="group-item" v-for="(item,index) in groupingList" :key="index">
								<div class="group-item-inner">
									<div class="group-user-img lazy-img">
										<img v-lazy="item.member_avatar" />
									</div>
									<div class="group-other-info">
										<div class="group-user-info">
											<div><span class="group-nick-name">{{item.member_nick_name}}</span><span class="remain-num">还差{{item.remain_num}}人</span></div>
											<countDown :timeProps="item.remain_time" temp="2" @emitCountDownFun="emitCountDownFun"></countDown>
										</div>
										<div class="group-btn" @click="goGroup(item.team_id)">去拼单</div>
									</div>
								</div>
							</div>
							<noMore :finished="finished"></noMore>
						</cube-scroll>
					</div>
				</div>
			</cube-popup>
		</transition> -->
		<!-- <shareIcon />
		<sellIcon v-if="isSeller" :type="2" :wholeNum="Number(wholeNum)" :sellData="sellData" :distributionCode="distributionCode" :goodsActivityType="Number(goodsActivityType)" :minPrice="minPrice" :maxPrice="maxPrice" :is_private_goods="is_private_goods"/>
		<FastNav v-show="fastNavShow"/> -->
    </view>
</template>
<script>
	// import MapLoader from '@/lib/AMap.js'
	// import couponItem from '@/components/couponItem'
	// import sellIcon from '@/components/sellIcon'
	// import shareIcon from '@/components/shareIcon'
	// import countDown from '@/components/CountDown'
	import merge from 'webpack-merge'
	// import noMore from '@/components/NoMore'
	import tuiIcon from "@/components/tui/icon/icon"
	import tuiTag from "@/components/tui/tag/tag"
	import tuiBadge from "@/components/tui/badge/badge"
	import tuiBottomPopup from "@/components/tui/bottom-popup/bottom-popup"
	import tuiNumberbox from "@/components/tui/numberbox/numberbox"
	import evaluate from "@/components/goods/evaluate"
	import geoMap from "@/components/map/index"
	import { setTimeout } from 'timers';
    export default{
        name:'goodsDetail',
        components: {
			// couponItem,
			// sellIcon,
			// shareIcon,
			// countDown,
			// noMore
			tuiIcon,
			tuiTag,
			tuiBadge,
			tuiBottomPopup,
			tuiNumberbox,
			evaluate,
			geoMap
        },
        data(){
        	return {
				height: 64, //header高度
				top: 0, //标题图标距离顶部距离
				scrollH: 0, //滚动总高度
				opcity: 0,
				iconOpcity: 0.5,
        		isloading: true,
        		store_id: '',
				is_tomorrow: 0,
				goods_name: '',
				spu_id: '',
				sku_id: '',
				shopping_dot: 0,
				shopNum: 0,
				goodsType: 0, //1普通商品 2批发商品
				goodsActivityType: '', //-1商品异常 0普通商品 1团购商品 2秒杀商品 3 个人发布商品 4分销商商品
				minPrice: 0,
				maxPrice: 0,
        		bannerIndex: 1,
        		banner: [], //商品轮播图
        		interval_price: [], //批发阶梯价格
        		goods_body_img: [], //商品详情介绍图
        		goods_detail: '', //商品详情描述
        		goods_attr: [], //商品参数配置
        		goodsLabel: [], //商品标签
        		sku: {
        			tree: [],
        			list: []
        		},
        		simple_address: {
        			province: {},
        			city: {},
        			district: {}
        		},
        		goodsInfo: {},
        		detailTabIndex: 0,
        		detailTab: ['商品详情','规格参数'],
				standardPopup: false,
				goods_num: 0,
				totalStockNum: 0,
				minNum: 1,
				betweenPrice: '', //价格区间
				btnType: '',
				isSale: '', //商品上下架
				price_mode: '', //批发1 混批2
				curSkuId: '',
				curCity: '四川省 成都市', //当前城市名
				curCityCode: '510100', //当前城市code, 默认成都
				fareTip: '￥0.00',
				region_show: false,
				isSeller: false, //是否为分销商
				fastNavShow: false,
				sellData: {},
				is_private_goods: false, //是否为自有商品
				goodBill: [],
				areaList: [],
                cityList: [],
                districtList: [],
                selectAdCode: 0,
				selectLevel: 'province',
				provinceName: '',
				cityName: '',
				couponItemData: [],
				couponData: [],
				couponIsDialog: false,
				couponNoData: false,
				// toolHome: {name: '首页', path: '/index', icon: require('@/assets/images/fast_nav/fast-icon-home.png')},
				// toolShop: {name: '购物车', path: '/shopCar', icon: require('@/assets/images/fast_nav/fast-icon-shop.png')},
				originalPrice: '',
				originalStock: '',
				distributionCode: '',
				distribution_code: '',
				group_people_num: 0, //拼团人数
				ins_dialog: false,
				isAddGroup: false,
				noGroup: false,
				team_id: 0,
				group_id: '',
				groupTeam:{},
				group_list_dialog: false,
				page: 1,
                pagesize: 10,
                loading: false,
                finished: false,
                offset: 50,
				isMore: false,
				groupingList: [],
				total_sold_out: 0,
				wholeNum: 1,
				seckill_time_sku_id: '', //秒杀时间段id
				isGroupBtn: '', //拼团按钮状态 1 直接购买 2拼团购买
				selectedGG: '已选‘均码’    颜色分类‘深蓝色’', //已选规格
				iconSize: 20,
				footerIconSize: 22,
				stepIconSize: 26,
				hoverStayTime: 120,
				imgurl: this.$mConfig.imgUrl
			}
        },
        computed:{
        	specialSelectNum(){
        		let num = 0
				this.sku.list.map((item, index)=>{
					num += item.stockNum
				})
				return num
        	},
        	specialSelectAmount(){
				let amount = 0,
					arr = []
				if(this.price_mode == 1) {
					let price = Number(this.goodsInfo.maxPrice)
					this.interval_price.forEach((item, index)=>{
						if(this.specialSelectNum >= item.num) {
							price = item.price
						}
					})
					amount = this.specialSelectNum * price
				}else if(this.price_mode == 2) {
					this.sku.list.map((item, index)=>{
						amount += item.stockNum*item.price
					})
				}
				if(this.sku.tree.length) {
					this.sku.list.map((item, index)=>{
						let flag = true 
						for(var i in arr) {
							if(arr[i].id == item.s1) {
								arr[i].num += item.stockNum
								return false
							}
						}
						if(flag == true) {
							let obj = {}
							obj.id = item.s1
							obj.num = item.stockNum
							arr.push(obj)
						}
					})
					this.sku.tree[0].value.filter((item, index)=>{
						let state = false
						for(var i in arr) {
							if(arr[i].id == item.id && arr[i].num) {
								state = true
							}
						}
						setTimeout(res=>{
							item.flag = state
						},0)
						
					})
				}

				return amount
			}
        },
        methods:{
            changeAttrEvt(index, item){
                if(item.actived || index) return
        		this.sku.tree[0].value.forEach((_it, _index)=>{
        			_it.actived = false
        		})
				item.actived = true
				this.curSkuId = item.id
            },
        	bannerChange(e){
        		this.bannerIndex = e.detail.current+1
			},
			previewImage(e) {
				let index = e.currentTarget.dataset.index,
					urls = JSON.parse(JSON.stringify(this.banner))
				uni.previewImage({
					current: urls[index],
					urls: urls
				})
			},
			changeDetailTab(e) {
				let index = e.currentTarget.dataset.index;
				if(this.detailTabIndex == index) return
				this.detailTabIndex = index
			},
			changeSteper(e) {
				this.goods_num = e.value
			},
			back() {
				this.$mRouter.back(1)
			},
			shareEvt(){
                let shareState = this.$store.state.share_icon;
                this.$store.commit('SET_SHARE_ICON',!shareState)
            },
        	gotoShop(){
				this.$mRouter.switchTab({
					route: this.$mRoutesConfig.shopCar,
					query: {}
				})
        	},
        	selGoods(type, isGroupBtn){
        		this.standardPopup = true
				this.btnType = type
				if(this.goodsActivityType == 1) this.isGroupBtn = isGroupBtn
			},
			hideStandardPopup(){
				this.standardPopup = false
			},
        	combinationBasisDetail(){
        		this.$api.combinationBasisDetail({
                    cmd:{
                        "goods":"combinationBasisDetail"
                    },
                    data:{
						spu_id:this.spu_id,
						member_id: this.$store.state.userInfo.member_id || 0
                    }
                }).then(res=>{
                	console.log(res)
                    if(res.code === 1){
                        // setTimeout(()=>{
						// 	this.isloading = false
						// 	this.fastNavShow = true
                        // },500)
						// this.store_id = res.data.store_id
						this.total_sold_out = res.data.total_sold_out
						this.banner = res.data.album
						this.goods_name = res.data.goods_name
                        this.goods_body_img = res.data.goods_img
						this.goods_detail = res.data.goods_detail
						this.goods_detail = this.$mUtils.rplaceRichImg(this.goods_detail)
                        this.goods_attr = res.data.goods_attr
                        this.goodsLabel = res.data.goods_lable
                        this.goodsType = res.data.goods_type
                        this.simple_address = res.data.simple_address
						this.isSale = res.data.is_sale
						// this.goodsActivityType = res.data.goods_activity_type
						this.combinationSku()
						// if(this.member_id) {
						// 	this.sellData = res.data
						// 	this.checkIsSeller()
						// }else if(this.$parent.isWx) {
						// 	this.shareInfo()
						// }
                    }
                }).then(res=>{
					// if(this.goodsType == 1) this.getCouponList()
				}).catch(err=>{

                })
			},
			combinationSku(){
        		this.$api.combinationSku({
                    cmd:{
                        "goods":"combinationSku"
                    },
                    data:{
						'spu_id':this.spu_id,
						'member_id': this.$store.state.userInfo.member_id || 0,
						'distribution_code': this.distribution_code,
						'sku_id': this.sku_id,
						'is_tomorrow': this.is_tomorrow
                    }
                }).then(res=>{
					console.log(res,555)
					if(res.code == 1){
						this.goodsInfo = res.data
						this.sku = res.data.sku
						this.goodsActivityType = res.data.goods_activity_type
						this.minPrice = Number(res.data.minPrice)
						this.maxPrice = Number(res.data.maxPrice)
						this.is_private_goods = res.data.is_private_goods
						// this.price_mob = `tel:${res.data.store_mobile}`
                        // this.server_mobile = 'http://wpa.qq.com/msgrd?v=3&uin='+res.data.store_contact+'&site=qq&menu=yes'
                        if(this.goodsType == 2) {
                        	this.interval_price = res.data.wholesale.interval_price
							this.price_mode = res.data.wholesale.price_mode
							this.wholeNum = res.data.wholesale.wholesale_num	
                        }   
                        if(res.data.maxPrice == res.data.minPrice) {
	                    	this.betweenPrice = '￥'+Number(res.data.minPrice).toFixed(2)
	                    }else{
	                    	this.betweenPrice = '￥'+Number(res.data.minPrice).toFixed(2) + '-' + '￥'+Number(res.data.maxPrice).toFixed(2)
						}
						if(this.goodsActivityType == 1 || this.goodsActivityType == 2) {
							this.originalPrice = res.data.original_price
						}
						if(this.goodsActivityType == 2){
							this.seckill_time_sku_id = res.data.seckill_time_sku_id
						}
						if(this.goodsActivityType == 1){
							this.originalStock = res.data.original_stock
							this.groupGoodsTeamInfo()
							this.group_id = res.data.group_id
							this.group_people_num = res.data.group_people_num
						}
						this.totalStockNum = this.goodsInfo.stock_num
					}
				}).then(res=>{
					if(this.goodsType == 1) {
                		if(this.sku.tree.length) {
							this.sku.tree.map((item,index)=>{
								let k_s = item.k_s
								item.value.forEach((_item,_index)=>{
									this.$set(_item,'checked',false)
									this.$set(_item,'k_s',k_s)
								})
							})
							this.changeBtwPrice()
                		}else{
                			// this.betweenPrice = '￥'+Number(this.sku.list[0].price).toFixed(2)
							this.sku_id = this.sku.collection_id
							if(this.sku.list[0].stock_num) {
								this.minNum = this.goods_num = 1
							}else{
								this.minNum = this.goods_num = 0
							}
                			// this.totalStockNum = this.sku.list[0].stock_num
                		}
                		
                	}else if(this.goodsType == 2) {
                		if(this.sku.tree.length) {
                			this.sku.tree.map((item,index)=>{
		                    	let k_s = item.k_s
		                        item.value.forEach((_item,_index)=>{
		                        	if(index == 0) {
		                        		this.$set(_item,'actived',false)
		                        		this.$set(_item,'flag', false)
		                        		if(_index == 0) {
		                        			this.$set(_item,'actived',true)
		                        		}
		                        	}
		                            this.$set(item,'k_s',k_s)
		                        })
		                    })
		                    this.curSkuId = this.sku.tree[0].value[0].id
                		}
                		this.sku.list.map((item, index)=>{
		                	this.$set(item, 'stockNum',0)
		                })
                	}
				}).catch(res=>{

				})
			},
			getCouponList(){	
                this.$api.storeCoupon({
                    cmd:{
                        discount:'storealldiscount'
                    },
                    data:{
                        store_id:1,
                        ids:this.spu_id,
                        member_id:this.$store.state.userInfo.member_id || 0
                    }
                }).then(res=>{
                    console.log(res,'店铺优惠券')
                    if(res.code === 1){
                        this.couponItemData = res.data
                        if(this.couponItemData.length === 0){
                            this.couponNoData = true
                        }
                    }
                }).catch(err=>{

                })
			},
			groupGoodsTeamInfo(){
				this.$api.groupGoodsTeamInfo({
                    cmd:{
                        group:'GroupGoodsTeamInfo'
                    },
                    data:{
                        spu_id:this.spu_id,
                        team_id:this.team_id
                    }
                }).then(res=>{
					if(res.code == 1){
						let total = res.data.total,
							list = res.data.list
						if(list.length) {
							this.groupTeam = res.data
							this.groupTeam.list.map(item=>{
                                item.remain_time = item.remain_time*1000
                            })
							this.noGroup = true
							this.getGroupUser()
						}else{
							this.noGroup = false
						}
					}else{
						this.noGroup = false
					}
				}).catch(res=>{
					this.noGroup = false
				})
			},
			getGroupUser(){
                this.$api.getGroupUser({
                    cmd:{
                        group:'getGroupUser'
                    },
                    data:{
                        group_id:this.group_id,
                        page: this.page,
                        page_size: this.pagesize
                    }
                }).then(res=>{
                    console.log(res, 'getGroupUser')
                    if(res.code == 1){
                        let d = []
                        if(res.data.data.length) {
                            res.data.data.map(item=>{
                                item.remain_time = item.remain_time*1000
                                d.push(item)
                            })
                        }
                        if(this.page == 1) {
                            this.groupingList = d
                        }else{
                            this.groupingList = [...this.groupingList,...d]
						}
                        //更多
                        this.isMore = true
                        //关闭加载提示
                        this.loading = false
                        //返回空数据
                        if(res.data.data.length < this.pagesize){
							this.finished = true
                        }
                    }
                }).then(res=>{

                })
			},
			goGroup(team_id){
                this.$router.push({name:'groupDetails',params:{team_id:team_id,spu_id:this.spu_id}})
            },
			loadMore() {
                //加载未完 有更多
                if(!this.finished && this.isMore){
                    // 数据<10
                    if(this.groupingList.length<this.pagesize){
                        // 关闭加载提示
                        this.loading = false
                        return
                    }else{
                        // 页数+
                        this.page++
                        setTimeout(() => {
                            this.getGroupUser()
                        }, 500);
                    }
                }
			},
			emitCountDownFun(){
                this.groupGoodsTeamInfo()
            },
			couponDialogEvt(){
				this.couponData = this.couponItemData
				this.couponIsDialog = true
			},
			getCoupon(item){
				if(!this.$store.getters.hasLogin) {
					this.$mRouter.push({
						route: this.$mRoutesConfig.login,
						query: {}
					})
					return
				}
                this.$api.getCoupon({
                    cmd:{
                        discount:'usergetdiscount'
                    },
                    data:{
                        member_id:this.$store.state.userInfo.member_id || 0,
                        discount_id:item.discount_id

                    }
                }).then(res=>{
                    console.log(res)
                    if(res.code===1){
                        this.$mUtils.toast('领取成功')
                        setTimeout(()=>{
                            this.getCouponList()
                        },1000)

                    }else {
                        this.$mUtils.toast(res.msg)
                    }
                })
            },
        	chooseSku(index, item){
        		if(item.checked) return
        		this.sku.tree[index].value.forEach((_it, _index)=>{
        			_it.checked = false
        		})
				item.checked = true
				this.getCurSkuId()
			},

			getCurSkuId(){
				let obj = {}
				if(this.sku.tree.length == 1) {
					this.$set(obj, 's2', 0)
					this.$set(obj, 's3', 0)
				}else if(this.sku.tree.length == 2){
					this.$set(obj, 's3', 0)
				}
				this.sku.tree.map((item,index)=>{
                    item.value.filter((item,index)=>{
                    	if(item.checked) {
                    		this.$set(obj, item.k_s, item.id)
                    	}
                    })
				})
				this.sku.list.map((item, index)=>{
               		if(item.s1 == obj.s1 && item.s2 == obj.s2 && item.s3 == obj.s3) {
						this.sku_id = item.id
               		}
				})
				this.$mRouter.redirectTo({
					route: this.$mRoutesConfig.goodsDetail,
					query: {spuId: this.spu_id, skuId: this.sku_id}
				})
				// this.$router.replace({
				// 	params: merge(this.$route.params,{'sku_id':this.sku_id})
				// })
				// if(this.distribution_code) this.$router.replace({query: merge(this.$route.query, {'distribution_code': this.distribution_code})})
				this.combinationSku()
			},
			
        	changeBtwPrice(){
				let curItem = this.sku.list.filter((item, index)=>{
					if(item.id == this.sku_id){
						this.betweenPrice = '￥'+item.price.toFixed(2)
						this.totalStockNum = item.stock_num
						if(item.stock_num == 0) {
							this.minNum = this.goods_num = 0
						}else{
							this.minNum = this.goods_num = 1
						}
						return item
					}
				})
				this.sku.tree.map((item,index)=>{
					item.value.map((_item,_index)=>{
						if((_item.k_s == 's1' && _item.id == curItem[0].s1) || (_item.k_s == 's2' && _item.id == curItem[0].s2) || (_item.k_s == 's3' && _item.id == curItem[0].s3)){
							_item.checked = true
						}
					})
				})
        	},
        	checkShopDot(){
        		this.$api.cartList({
	                cmd:{cart:"cartlist"},
	                data:{member_id:this.$store.state.userInfo.member_id || 0,distribution_code:this.distribution_code}
	            }).then(res=>{
					console.log(res, 'shop')
	                if(res.code === 1){
						let shopCarData = res.data.goods,
							num = 0
	                    if(shopCarData.length === 0){
	                        this.shopping_dot = 0
	                    }else{
							this.shopping_dot = 1
							shopCarData.map(item=>{
								for(var i in item.spu) {
									item.spu[i].sku.map(_item=>{
										num += _item.goods_num
									})
								}	
							})
						}	
						this.shopNum = num
	                    // this.$store.commit('SET_SHOPPING_STATUS',this.shopping_dot)
	                }
	            }).catch(err=>{
	                this.shopping_dot = 0
	            })
        		
			},
			
			checkIsSeller(){
				this.$api.sellerInfoApi({
					cmd:{seller:'sellerInfo'},
					data:{
						member_id: this.$store.state.userInfo.member_id || 0
					}
				}).then(res=>{
					console.log(res, 'seller')
					if(res.code == 1){
						if(res.data.length || Object.keys(res.data).length){
							this.isSeller = res.data.status == 1 ? true : false
							this.distributionCode = res.data.distribution_code
						}else{
							this.isSeller = false
						}
						if(this.$parent.isWx) this.shareInfo()
					}
				}).catch(res=>{})
			},

			shareInfo(){
				let shareData = {},
					imgUrl = this.banner[0]
                if(this.distributionCode){
                    shareData.linkName = `/goods/goodsDetails/${this.spu_id}/${this.sku_id}?distribution_code=${this.distributionCode}`
                }else{
                    shareData.linkName = `/goods/goodsDetails/${this.spu_id}/${this.sku_id}`
                }
                shareData.desc = '我在中华园林机械网上发现许多好东西，赶紧来看看'
                shareData.title = `${this.goods_name}`
                shareData.imgUrl = `${imgUrl}`
                this.$share.api(shareData)
			},

            goodConfirmEvt(type){
            	if(this.$store.getters.hasLogin) {
            		if(this.goodsType == 2 && this.price_mode == 2 && this.specialSelectNum < Number(this.interval_price)) {
	            		this.$mUtils.toast('未达到'+this.interval_price+'起批量')
	            		return false
	            	}else if(this.goodsType == 2 && this.price_mode == 1 && this.specialSelectNum < Number(this.interval_price[0].num)) {
	            		this.$mUtils.toast('未达到最低'+this.interval_price[0].num+'批发量')
	            		return false
	            	}
	            	let goodsData = []
	            	if(this.goodsType == 1) {
						let obj = {
							sku_id: this.sku_id,
							goods_num: this.goods_num
						}
						goodsData.push(obj)
	            	}else{
	            		this.sku.list.map((item, index)=>{
		            		if(item.stockNum) {
		            			let obj = {}
								this.$set(obj, 'sku_id', item.id)
								this.$set(obj, 'goods_num', item.stockNum)
								goodsData.push(obj)
		            		}
		            	})
					}
					if(this.goodsActivityType == 1) {
						if(this.isGroupBtn == 2 || this.btnType == 2){
							this.onBuyClicked(goodsData)
						}else if(this.isGroupBtn == 1 || this.btnType == 1){
							type == 1 ? this.onAddCartClicked(goodsData):this.onBuyClicked(goodsData)
						}
					}else{
						this.btnType == 1?this.onAddCartClicked(goodsData):this.onBuyClicked(goodsData)
					}
            		
            	}else{
					this.$mRouter.push({
						route: this.$mRoutesConfig.login,
						query: {}
					})
            	}
            },

            onBuyClicked(goodsData){
				uni.showLoading({
					mask: true,
					title: '提交订单中'
				})
				let order_type = 1 
				if(this.goodsActivityType == 1) {
					if(this.isGroupBtn == 1 || this.btnType == 1) {
						order_type = 1
					}else if(this.isGroupBtn == 2 || this.btnType == 2){
						order_type = 2
					}
				}else if(this.goodsActivityType == 2){
					order_type = 3
				}else if(this.goodsActivityType == 4 && this.distribution_code){
					order_type = 6
				}
                let second = 2;
                const timer = setInterval(() => {
                    second--;
                    if (second) {

                    } else {
                        clearInterval(timer)
                        uni.hideLoading()
                        // this.$store.dispatch('setSelAddress',false)
                        // this.$store.dispatch('setInvoice',{})
                        // this.$store.commit('SET_SEL_ADDRESS_INDEX','-1')
						// localStorage.removeItem('isSelIndex')
						if(this.goodsActivityType == 1) {
							localStorage.setItem('group_id', this.group_id)
							localStorage.setItem('team_id', this.team_id)
						}else if(this.goodsActivityType == 2){
							localStorage.setItem('seckill_time_sku_id',this.seckill_time_sku_id)
						}
						this.$mRouter.push({
							route: this.$mRoutesConfig.orderConfirm,
							query: {
								goodsData: JSON.stringify(goodsData),
								payway: 2,
								orderType: order_type
							}
						})
                    }
                }, 1000)
            },

            onAddCartClicked(goodsData) {
				uni.showLoading({
					mask: true,
					title: '商品添加中',
				})
                this.$api.addCart({
                    cmd:{
                        "cart":"addcart"
                    },
                    data:{
                        member_id:this.$store.state.userInfo.member_id || 0,
						goods: goodsData,
						distribution_code: this.distribution_code
                    }
                }).then(res=>{
                    uni.hideLoading()
                    if(res.code===1){
                        this.checkShopDot()
                        this.standardPopup = false
                      	if(this.goodsType == 2) {
							this.sku.list.map((item, index)=>{
								item.stockNum = 0
			                })
                        }
                        this.$mUtils.toast(`商品已加入购物车,快去结算吧!`)
                        
                    }else {
                        this.$mUtils.toast(res.msg)
                    }
                }).catch(err=>{

                })
			},

			emitMap(res){
				this.curCity = res.city
				this.curCityCode = res.code
				this.goodsLogisticsBilling()
			},

			standardPopupClose(){
				let goodsData = []
	            if(this.goodsType == 1) {
					let obj = {
						sku_id: this.sku_id,
						sku_num: this.goods_num
					}
					goodsData.push(obj)
	            }else{
	            	this.sku.list.map((item, index)=>{
		        		if(item.stockNum) {
		        			let obj = {}
							this.$set(obj, 'sku_id', item.id)
							this.$set(obj, 'sku_num', item.stockNum)
							goodsData.push(obj)
		        		}
		        	})
				}
				this.goodBill = goodsData
				this.goodsLogisticsBilling()
			},

			// 获取运费
			goodsLogisticsBilling(){
				this.$api.goodsLogisticsBilling({
                    cmd:{
                        "logistics":"goodsLogisticsBilling"
                    },
                    data:{
                    	city_adcode:this.curCityCode,
						goods: this.goodBill,
						spu_id: this.spu_id
                    }
                }).then(res=>{
					console.log(res)
					if(res.code == 1) {
						this.fareTip = '￥'+ Number(res.data.shipping_fee).toFixed(2)
					}else{
						this.fareTip = res.msg
					}
				}).catch(res=>{

				})
			},

			geoAreaDialog(){
				this.selectAdCode = 0
				this.selectLevel = 'province'
				this.cityList.length ? this.areaList = this.cityList : this.getRegionList()
                this.region_show = true
            },
            getRegionList(){
                this.$api.cityRegion({//城市三联
                    cmd:{
                        "region":"getCityRegion"
                    },
                    data:{
                        adcode: this.selectAdCode,
                        level: this.selectLevel
                    }
                }).then(res=>{
                    if(res.code === 1){
						if(!res.data.length) {
							this.curCityCode = this.selectAdCode
							this.curCity = this.provinceName 
							this.goodsLogisticsBilling()
							this.region_show = false
						}
						this.areaList = []
						this.areaList = res.data
						this.selectAdCode ? this.districtList = res.data : this.cityList = res.data
                    }
                }).catch(err=>{
    
                })
            },
            touchUp(item){
                if(this.selectAdCode) {
					this.curCityCode = item.adcode
					this.curCity = this.provinceName + ' ' + item.cityName
					this.goodsLogisticsBilling()
                    this.region_show = false
                }else{
					this.provinceName = item.cityName
                    this.selectAdCode=item.adcode
					this.selectLevel = 'city'
					this.cityName = ''
                    this.getRegionList()
                }
            },
        },
        mounted(){

		},
		onLoad(options){
			console.log(options)
			let obj = {};
			// #ifdef MP-WEIXIN
			obj = wx.getMenuButtonBoundingClientRect();
			// #endif
			// #ifdef MP-BAIDU
			obj = swan.getMenuButtonBoundingClientRect();
			// #endif
			// #ifdef MP-ALIPAY
			my.hideAddToDesktopMenu();
			// #endif

			uni.getSystemInfo({
				success: (res) => {
					this.width = obj.left || res.windowWidth;
					this.height = obj.top ? (obj.top + obj.height + 8) : (res.statusBarHeight + 44);
					this.top = obj.top ? (obj.top + (obj.height - 32) / 2) : (res.statusBarHeight + 6);
					this.scrollH = res.windowWidth
				}
			})

			this.spu_id = options.spuId
			this.sku_id = options.skuId
		},
		onShow(){
			if(this.$store.getters.hasLogin) {
				this.checkShopDot()
			}
			this.combinationBasisDetail()
		},
		onPageScroll(e) {
			let scroll = e.scrollTop <= 0 ? 0 : e.scrollTop;
			let opcity = scroll / this.scrollH;
			if (this.opcity >= 1 && opcity >= 1) {
				return;
			}
			this.opcity = opcity;
			this.iconOpcity = 0.5 * (1 - opcity < 0 ? 0 : 1 - opcity)
		},
        created(){
        	// if(localStorage.getItem('userInfo') != undefined) this.member_id = JSON.parse(localStorage.getItem('userInfo')).member_id
			// this.spu_id = this.$route.params.spu_id
			// this.sku_id = this.$route.params.sku_id
			// this.distribution_code = this.$route.query.distribution_code || ''
			// this.is_tomorrow = this.$route.query.is_tomorrow || 0
			// this.team_id = this.$route.query.team_id || 0
			// this.isAddGroup = this.$route.query.isAddGroup || false
        	// this.combinationBasisDetail()
			// this.checkShopDot()
			// this.initGeo()
        }
    }
</script>

<style lang="scss" type="text/scss">
	.goodsDetail-wrapper{
		padding-bottom: 100upx;
		.tui-header-box {
			width: 100%;
			position: fixed;
			left: 0;
			top: 0;
			z-index: 9998;
		}

		.tui-header {
			width: 100%;
			font-size: 36upx;
			font-weight: 500;
			height: 64upx;
			align-items: center;
			justify-content: center;
		}

		.tui-header-icon {
			position: fixed;
			top: 0;
			left: 10px;
			display: flex;
			align-items: flex-start;
			justify-content: space-between;
			height: 32px;
			transform: translateZ(0);
			z-index: 99999;
		}
		.tui-header-icon .tui-badge {
			background: #e41f19 !important;
			position: absolute;
			right: -4px;
		}

		.tui-icon-ml {
			margin-left: 20upx;
		}

		.tui-icon {
			border-radius: 16px;
		}


		.tui-icon-back {
			height: 32px !important;
			width: 32px !important;
			align-items: center;
    		justify-content: center;
		}
		.tui-banner-swiper {
			position: relative;
			background: #f0f0f0;
			.tui-banner-inner{
				width: 100%;
			}
		}

		.tui-banner-swiper .tui-tag-class {
			position: absolute;
			color: #fff;
			bottom: 30upx;
			right: 0;
		}

		.tui-slide-image {
			width: 100%;
			display: block;
		}
        .goodsDetail-inner{
			flex-direction: column;
			.top{
				background: #fff;
				padding: 20upx 24upx 30upx;
				.goods-cell-box{
					width: 100%;
					flex-direction: column;
					.cell-name{
						font-size: 28upx;
						color: #333;
						line-height: 40upx;
					}
					.cell-price {
						.goods-price{
							font-size: 32upx;
							color: $site-default-color;
							line-height: 44upx;
							padding: 10upx 0 20upx;
						}
					}
					.cell-le {
						width: 100%;
						align-items: center;
						justify-content: space-between;
						font-size:24upx;
						color: #999;
						box-sizing: border-box;
						.li{
							display: block;
							flex: 1;
							text-align: center;
							&:first-child{
								text-align: left;
							}
							&:last-child{
								text-align: right;
							}
							
						}
					}
				}
			}
			.standard{
				flex-direction: column;
				width: 100%;
				background: #fff;
				padding: 0 24upx;
				box-sizing: border-box;
				margin-top: 20upx;
				.standard-item{
					width: 100%;
					height: 80upx;
					align-items: center;
					justify-content: space-between;
					font-size: 28upx;
					.label{
						width: 84upx;
						color: #999;
						margin-right: 10upx;
					}
					.txt{
						flex: 1;
						color: #333;
					}
				}
			}
			.bottom{
				width: 100%;
				flex-direction: column;
				padding: 0 24upx;
				background: #fff;
				margin-top: 20upx;
				.detail-bar{
					width: 100%;
					height: 80upx;
					justify-content: center;
					.items{
						width: 100%;
						height: 100%;
						.item{
							flex: 1;
							height: 100%;
							justify-content: center;
							.txt{
								height: 100%;
								align-items: center;
								font-size: 26upx;
								color: #333;
							}
							&.active{
								.txt{
									color: $site-default-color;
									border-bottom: 4upx solid $site-default-color;
								}
								
							}
						}
					}
				}
				.detail-desc{
					padding: 20upx 0;
					.desc-list{
						font-size: 24upx;
						color: #666;
						width: 100%;
						img{
							display: block;
							width: 100%;
						}
					}
					.attr-list{
						width: 100%;
						flex-direction: column;
						border: 1px solid #E7E7E7;
						.attr-cell{
							height: 60upx;
							font-size: 24upx;
							color: #666;
							&:not(:last-child){
								border-bottom: 1px solid #E7E7E7;
							}
							.attr-cell-name{
								width: 200upx;
								height: 100%;
								padding-left: 30upx;
								align-items: center;
								border-right: 1px solid #E7E7E7;
							}
							.attr-cell-txt{
								flex: 1;
								height: 100%;
								padding-left: 30upx;
								align-items: center;
							}
						}
					}
					.no-attr, .no-desc{
						width: 100%;
						font-size: 26upx;
						color: #ccc;
						padding: 50upx 0;
						justify-content: center;
						align-items: center;
	            	}
				}
			}
        }
		/*底部操作栏*/

		.tui-col-7 {
			width: 58.33333333%;
		}

		.tui-col-5 {
			width: 41.66666667%;
		}

		.fixed-tool {
			width: 100%;
			height: 100upx;
			/* box-sizing: border-box; */
			background: rgba(255, 255, 255, 0.98);
			position: fixed;
			display: flex;
			align-items: center;
			justify-content: space-between;
			z-index: 10;
			bottom: 0;
			left: 0;
			padding-bottom: env(safe-area-inset-bottom);
		}

		.tui-safearea-bottom {
			width: 100%;
			height: env(safe-area-inset-bottom);
		}

		.fixed-tool::before {
			content: '';
			position: absolute;
			top: 0;
			right: 0;
			left: 0;
			border-top: 1upx solid #eaeef1;
			-webkit-transform: scaleY(0.5);
			transform: scaleY(0.5);
		}

		.fixed-tool-left {
			height: 100%;
			align-items: center;
		}

		.fixed-tool-item {
			flex: 1;
			height: 100%;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			position: relative;
		}

		.fixed-tool-text {
			font-size: 22upx;
			color: #999;
		}

		.tui-opacity {
			opacity: 0.5;
		}

		.tui-scale-small {
			transform: scale(0.9);
			transform-origin: center center;
		}

		.fixed-tool-right {
			height: 100upx;
			/* box-sizing: border-box; */
			padding-top: 0;
		}

		.tui-right-flex {
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.tui-btnbox-4 .tui-btn-class {
			width: 90% !important;
			display: block !important;
			font-size: 28upx !important;
		}

		.fixed-tool .tui-badge-class {
			position: absolute;
			top: 0;
			right: 10upx;
		}

		.tui-flex-1 {
			flex: 1;
		}

		/*底部操作栏*/
		.goodsDetail-top {
			.spell-bar{
				height: 40px;
				background: #F22A15;
				color: #fff;
				font-size: 12px;
				display: flex;
				justify-content: space-between;
				padding: 0 15px;
				align-items: center;
				.l-cell{
					display: flex;
					align-items: center;
				}
				.price{
					display: flex;
					.num{
						font-size: 20px;
						line-height: 1;
						align-self: flex-end;
					}
					.char{
						font-size: 10px;
						margin-right: 2px;
						align-self: flex-end;
						line-height: 1;
					}
				}
				.desc{
					margin-left:10px;
				}
				.num-tag{
					background: #BE2616;
					padding: 2px 4px;
					line-height: 1;
				}
			}
			.secKill-bar{
				height: 40px;
				background: #F22A15;
				color: #fff;
				font-size: 12px;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.l{
					width: calc(100% - 130px);
					display: flex;
					align-items: flex-end;
					padding: 0 15px;
					.sec-price{
						font-size: 20px;
						font-weight: 600;
					}
					.old-price{
						font-size: 12px;
						text-decoration: line-through;
						margin-left: 3px;
					}
				}
				.r{
					display: flex;
					justify-content: center;
					align-items: center;
					flex-shrink:0;
					width: 130px;
					height: 100%;
					background: #fff;
				}
			}
	        .goods-cell-box {
	        	background: #fff;
	        	padding-top: 8px;
	        	.cell-name{
	        		width: 100%;
	        		max-height: 40px;
	        		padding: 0 15px;
	        		box-sizing: border-box;
					text-align:left;
					display: -webkit-box;
                    white-space: normal;
                    word-break: break-all;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 2;
                    overflow: hidden;
                    text-overflow: ellipsis;
					.goods-desc{
	                    font-size: 14px;
	                    line-height: 20px;
	                    color: #000;
	                }
	                .tag{
	                	display: inline-block;
                        width: 26px;
                        height: 12px;
                        margin-right: 4px;
                        line-height: 20px;
                        img{
                            width: 100%;
                            height: 100%;
                            margin-top: 1px;
                        }
                            
				    }
	        	}
	        	.cell-price{
	        		display: flex;
	        		justify-content: space-between;
	        		align-items: center;
	        		padding: 15px;
	        		box-sizing: border-box;
	        		border-bottom: 1px solid #f2f2f2;
	        		.cell-price-item{
	        			text-align: center;
	        			.cell-price-sku{
	        				font-size: 12px;
	        				color: #999;
	        				line-height: 12px;
	        				margin-bottom: 8px;
	        			}
	        			.cell-price-amount{
	        				font-size: 16px;
	        				color: #D0021B;
	        				line-height: 12px;
	        			}
	        		}
	        		.goods-price{
	        			font-size: 16px;
	        			color: #DF1222;
	        			line-height: 22px;
	        		}
	        		&.normal {
	        			padding-top: 11px;
						padding-bottom: 2px;
						border: 0;
	        		}
	        		&.special{
	        			justify-content: flex-start;
	        			.cell-special-num {
	        				font-size: 12px;
	        				color: #434343;
	        			}
	        			.cell-special-price{
	        				font-size: 16px;
		        			color: #DF1222;
		        			margin-left: 10px;
	        			}
	        			.cell-price-item {
	        				text-align: left;
	        				&:first-child{
	        					flex: 2;
	        				}
	        				&:last-child{
	        					flex: 3;
	        				}
	        			}
	        		}
	        	}
	        	.cell-le {
	        		display: flex;
		            align-items: center;
		            justify-content: space-between;
		            font-size:12px;
		            color: #999;
		            padding: 9px 15px;
		            box-sizing: border-box;
		          	.li{
		          		flex: 1;
		          		&:first-child{
		          			text-align: left;
		          		}
		          		&:last-child{
		          			text-align: right;
		          		}
						
		           	}
	        	}
	        }
		}
		.standard{
			margin-top: 10px;
			border-bottom: 1px solid #f2f2f2;
			border-top: 1px solid #f2f2f2;
			text-align: left;
			.van-cell{
				padding: 15px;
				&.regeo-cell{
					.van-cell__title{
						flex:inherit;
						width: 80px;
					}
					.van-cell__value{
						display: flex;
						justify-content: space-between;
	            		align-items: center;
						color: #999;
						// padding-left: 30px;
						.value{
							font-size: 13px;
						}
						
					}
				}
				&.free-cell{
					.van-cell__title{
						flex:inherit;
						width: 80px;
					}
					.van-cell__value{
						font-size: 13px;
						color: #999;
						// padding-left: 15px;
						text-align: left;
					}
				}
			}
			.right-icon{
	            display: flex;
	            align-items: center;
				justify-content: flex-end;
	            color: #999;
	            .value{
					font-size: 13px;
	                margin-right: 5px;
	            }
	        }
		}
		.spell-box{
			margin-top: 10px;
            margin-bottom: 10px;
            .spell-flow{
                color: #353535;
                font-size: 13px;
                background: #fff;
                margin-bottom: 10px;
                padding: 0 15px;
                .hd{
                    height: 44px;
                    display: flex;
                    align-items: center;
                    font-size: 14px;
                    justify-content: space-between;
                    .txt-r{
                        display: flex;
                        align-items: center;
						font-size: 13px;
						color: #999;
                        .van-icon{
                            margin-left: 5px;
                        }
                    }
                }
                .bd{

                    .spell-stepList{
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        height: 65px;
                        .spell-stepItem{
                            position: relative;
							color: #666;
                            .cir{
                                width: 20px;
                                height: 20px;
                                margin: 0 auto 5px;
                                border: 1px dashed #B2B2B2;
                                border-radius: 100%;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                position: relative;
                                &:after{
                                    position: absolute;
                                    top: 50%;
                                    left: 22px;
                                    content: '';
                                    width:70px;
                                    height: 1px;
                                    background: #B2B2B2;
                                    transform: translateY(-50%) scaleY(0.5);
                                }

                            }
							.txt{
								font-size: 12px;	
							}
                            &:last-child{
                                .cir:after{
                                    content: normal;
                                }
                            }

                        }
                    }
                }
            }
            .spell-infoBox{
                background: #fff;
                font-size: 14px;
                color: #353535;
                padding-bottom: 5px;
                .desc{
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0 15px;
                    height: 44px;
                    line-height: 44px;
                    span{
                        &:first-child{
                            flex: 1;
                            height: 100%;
                            display: -webkit-box;
                            white-space: normal;
                            word-break: break-all;
                            -webkit-box-orient: vertical;
                            -webkit-line-clamp: 1;
                            overflow: hidden;
                            text-overflow: ellipsis;
                        }
                        &:last-child{
                            display: flex;
                            align-items: center;
                            color: #999;
							font-size: 13px;
                            i{
                                margin-top: -2px;
								margin-left: 5px;
                            }
                        }
                    }
                }
                .go-spell{
                    display: flex;
                    // padding-left: 15px;
                    margin: 0 15px;
                    margin-bottom: 15px;
                    .l{
                        border: 1px solid #ccc;
                        border-radius: 2px;
                        flex-grow: 1;
                        display: flex;
                        justify-content: space-between;
                        height: 35px;
                    }
                    .spell-user{
                        position: relative;
                        display: flex;
                        align-items: center;
                        flex: 1;
                        .user-pic{
                            height:30px;
                            width: 30px;
                            // border-radius: 100%;
                            overflow: hidden;
        
                        }
                        .user-name{
							flex: 1;
                            margin-left: 5px;
                            display: -webkit-box;
                            white-space: normal;
                            word-break: break-all;
                            -webkit-box-orient: vertical;
                            -webkit-line-clamp: 1;
                            overflow: hidden;
                            text-overflow: ellipsis;
                        }
                    }
                    .timer{
                        flex: 1;
						display: flex;
						flex-direction: column;
						justify-content: space-around;
						padding: 5px 0;
                        padding-right: 5px;
                        .t{
                            font-size: 12px;
                            transform: scale(0.9);
                            transform-origin: right;
                            color: #888;
                            text-align: right;
                        }
                        .countDown-component{
                            .countDown-temp {
                                .countDown-box{
                                    justify-content: flex-end;
                                    .countDown-inner{
                                        margin: 0;
                                    }
                                    .txt, .box{
                                        font-size: 12px;
                                        transform: scale(0.9);
                                        transform-origin: right;
                                        color: #353535;
                                    }
                                    .box{
                                        background: transparent;
                                        width: auto;
                                        margin: 0;
                                    }
                                }
                            }
                            
                        }
                    }
                    .r{
                        width: 70px;
                        height: 35px;
                        line-height: 35px;
                        background: #F22A15;
                        color: #fff;
                        font-size:14px;
                        text-align: center;
                        border-top-right-radius: 2px;
						border-bottom-right-radius: 2px;
                    }
                }
            }
        }
		.countDown-inner{
            margin-left: 0;
            .box{
                &:not(.box2){
                    background: #423F4E!important;
                    border-radius: 2px;
                    width: 15px!important;
                    height: 15px;
                    color: #fff!important;
                    font-size: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
            }
        }
		.goodsDetail-middle{
			background: #fff;
			min-height: 160px;
			margin-top: 10px;
			margin-bottom: 20px;
			padding: 0 15px;
			.reset{
	            .van-tabs__line{
	                background: $site-default-color;
	            }
	            .van-tab--active{
	                color: #333333;
	            }
	            .van-tab__pane{
	            	padding: 20px 0;
	            	.cell-list{
	            		.attr-cell{
	            			display: flex;
	            			justify-content: flex-start;
	            			align-items: center;
	            			font-size: 14px;
	            			text-align: left;
	            			margin-bottom: 15px;
	            			padding-bottom: 15px;
	            			border-bottom: 1px solid #f2f2f2;
	            			.attr-cell-name{
								color: #666;
								margin-right: 20px;
	            			}
	            			.attr-cell-text{
	            				color: #333;
	            			}
	            		}
	            	}
	            	.goods-img-list{
						text-align: left;
						font-size: 13px;
						color: #666;
						word-break: break-word;
						video{
							width: 100%;
						}
	            	}
	            	.no-attr, .no-goods-img{
						font-size: 13px;
						color: #ccc;
						padding-top: 25px;
						text-align: center;
	            	}
	            }
	        }
		}
		.store-desc{
			position: relative;
			background: #fff;
			padding: 0 15px 15px;
			box-sizing: border-box;
			text-align: left;
			h1{
				width: 100%;
				height: 40px;
				line-height: 40px;
				font-size: 14px;
				color: #333;
				border-bottom: 1px solid #f2f2f2;
			}
			ul{
				padding-top: 15px;
				li{
					
					font-size: 12px;
					color: #333;
					//line-height: 14px;
                    &:nth-child(1), &:nth-child(2){
                    	display: -webkit-box;
	                    white-space: normal;
	                    word-break: break-all;
	                    -webkit-box-orient: vertical;
	                    -webkit-line-clamp: 1;
	                    overflow: hidden;
	                    text-overflow: ellipsis;
	                    width: calc(100% - 100px);
                    }
					&:not(:last-child){
						margin-bottom: 5px;
					}
					a{
						color: #4A90E2;
					}
				}
			}
			.store_btn {
				position: absolute;
				top: 60px;
				right: 15px;
				margin: 0;
				font-size: 14px;
			}
		}
		.fixed-tool{
	        // display: flex;
	        // position: fixed;
	        // left: 0;
	        // bottom: 0;
	        // width: 100%;
	        // height: 45px;
	        // background: #EDEDED;
	        // align-items: center;
	        // border-top:1px solid #eee;
	        // z-index: 99;
	        .c-btn{
	            position: relative;
	            width: 100px;
	            display: flex;
	            flex-direction: column;
	            align-items: center;
	            justify-content: center;
	            height: 50px;
	            padding: 8px 0 4px;
	            font-size:10px ;
	            color: #333;
	            .tag-a{
					position: relative;
	                display: flex;
	                flex-direction: column;
	                align-items: center;
	                justify-content: center;
	                color: #333;
	                height: 50px;
					>img{
						display: inline-block;
						width: 21px;
	                	height: 21px;
					}
	            	.txt{
	            		font-size: 12px;
                        transform: scale(0.8);
                        transform-origin: center;
	            	}
					.shopDot {
						position: absolute;
						display: inline-block;
						width: 6px;
						height: 6px;
						top: 2px;
						right: 5px;
						border-radius: 50%;
						background: #D0021B;
					}
	            }
	            
	        }
	        .disabled-btn{
	            width: 100%;
	            height: 100%;
	            line-height: 100upx;
	            background: #ededed;
	            text-align: center;
	            font-size: 30upx;
	            color: #333;
	        }
	        .addCar-btn{
				display: block;
	            background: #F5A623;
	            font-size: 32upx;
	            color: #fff;
	            line-height: 100upx;
	            text-align: center;
	        }
	        .nowPay-btn{
	            display: block;
	            background: $site-default-color;
	            font-size: 32upx;
	            color: #fff;
	           	line-height: 100upx;
	            text-align: center;
	        }
			.spell-btn{
                background: $site-default-color;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                color: #fff;
                height: 100upx;
                // width: 152px;
                .txt{
                    font-size: 32upx;
                }
                .num{
                    font-size: 28upx;
                }

            }
			.alone-btn{
                background: #F5A623;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                color: #fff;
                height: 100upx;
                .txt{
                    font-size: 32upx;
                }
                .num{
                    font-size: 28upx;
                }
            }
	        .noSale-btn{
				display: block;
	        	width: 100%;
	        	background: #ddd;
	        	font-size: 32upx;
	            color: #999;
	            line-height: 100upx;
	            text-align: center;
	        }
	    }
	    .shopCar-inner{
	    	position: fixed;
	    	bottom: 30%;
	    	right: 15px;
	    	width: 54px;
	    	height: 54px;
	    	z-index: 100;
	    	.shopDot {
	            position: absolute;
	            display: inline-block;
	            width: 6px;
	            height: 6px;
	            top: 13px;
	            right: 10px;
	            border-radius: 50%;
	            background: #D0021B;
	        }
	    }
		.ins-dialog{
			.cube-popup-content{
				.ins-box{
					background: #fff;
					padding: 15px;
					font-size: 13px;
					color: #666;
					width: 300px;
					p{
						margin-bottom: 5px;
						span{
							font-size: 14px;
							font-weight: 600;
						}
					}
				}
				.ico-close{
					display: block;
					// background: url(../../assets/images/icons/ic_close.png);
					background-size: cover;
					width: 25px;
					height: 25px;
					margin: 15px auto;
				}
			}
			
		}
		.group-list-dialog{
			.cube-popup-content{
				width: 325px;
				background: #fff;
			}
			.group-box{
				h1{
					position:relative;
					width: 100%;
					height: 40px;
					font-size: 16px;
					color: #333;
					line-height: 40px;
					text-align: center;
					position: relative;
					border-bottom: 1px solid #e5e5e5;
					>span{
						position: absolute;
						display: flex;
						align-items:center;
						top: 17px;
						right: 15px;
						color: #666;
						width: 10px;
						height: 10px;
						font-size: 15px;
					}
				}
				.group-inner{
					max-height: 300px;
					.cube-scroll-wrapper{
						max-height: 300px;
					}
					.group-item{
						width: 100%;
						height: 60px;
						.group-item-inner{
							display: flex;
							width: 100%;
							height: 100%;
							justify-content: space-between;
							align-items:center;
							.group-user-img{
								display: flex;
								align-items: center;
								justify-content: center;
								width: 60px;
								height: 100%;
								img{
									width: 45px;
									height: 45px;
									border-radius: 50%;
								}
							}
							.group-other-info{
								width: calc(100% - 66px);
								height: 100%;
								border-bottom: 1px solid #D2D3D5;
								display: flex;
								align-items: center;
								justify-content: space-between;
								padding-right: 10px;
								.group-user-info{
									>div {
										font-size: 12px;
										color: #666;
										&:first-child{
											margin-bottom: 7px;
											display: flex;
											align-items:center;
										}
										.group-nick-name{
											font-size: 14px;
											color: #333;
											margin-right: 10px;
											max-width: 100px;
											display: -webkit-box;
											white-space: normal;
											word-break: break-all;
											-webkit-box-orient: vertical;
											-webkit-line-clamp: 1;
											overflow: hidden;
											text-overflow: ellipsis;
										}
									}
									.countDown-component{
										.countDown-temp {
											.countDown-box{
												.countDown-inner{
													margin: 0;
												}
												.txt, .box{
													font-size: 12px;                                              
													color: #666;
												}
												.box{
													background: transparent;
													width: auto;
													margin: 0;
												}
											}
										}
										
									}
								}
								.group-btn{
									width: 68px;
									height: 30px;
									background: #F22A15;
									color: #fff;
									border-radius: 2px;
									font-size: 13px;
									text-align: center;
									line-height: 30px;
								}
							}
						}
					}
				}
			}
		}
	    .standardPopup{
	    	.standardWrap{
				flex-direction: column;
				background: #fff;
	    		padding: 30upx 30upx 0;
				position: relative;
				.close-icon{
					position: absolute;
					top: 30upx;
					right: 30upx;
				}
		    	.standardTop{
		    		display: flex;
		    		justify-content: flex-start;
		    		padding: 30upx 0 40upx;
		    		border-bottom: 1px solid #f2f2f2;
		    		.standardImg{
						width: 140upx;
						height: 140upx;
						margin-right: 20upx;
						background: #ccc;
		    		}
		    		.standardGoodsInfo{
		    			flex: 1;
		    			text-align: left;
						flex-direction: column;
		    			.goodsName {
							width: 80%;
		    				font-size: 28upx;
		    				line-height: 42upx;
		    				letter-spacing: 2upx;
		    				color: #252525;
		    				height: 84upx;
		    				display: -webkit-box;
						    white-space: normal;
						    word-break: break-all;
						    -webkit-box-orient: vertical;
						    -webkit-line-clamp: 2;
						    overflow: hidden;
						    text-overflow: ellipsis;
						    // margin-bottom: 14px;
		    			}
						.goodsPrice{
							flex: 1;
							align-items: flex-end;
							font-size: 32upx;
							color:$site-default-color;
						}
		    		}
		    	}
		    	.standardInner{
					flex-direction: column;
		    		box-sizing: border-box;
					max-height: 600upx;
		    		.standardMiddle{
						flex-direction: column;
		    			padding: 20upx 0;
		    			border-bottom: 1px solid #f2f2f2;
		    			.standardItem{
							flex-direction: column;
		    				text-align: left;
		    				.h1{
		    					font-size: 28upx;
		    					color: #999999;
		    				}
		    				.section{
		    					padding-top: 20upx;
		    					.standardAttr{
		    						display: inline-block;
								    padding: 5px 9px;
								    margin: 0 10px 10px 0;
								    height: 28px;
								    min-width: 55px;
								    line-height: 16px;
								    font-size: 12px;
								    color: #353535;
								    text-align: center;
								    border: 1px solid #B2B2B2;
								    border-radius: 3px;
								    box-sizing: border-box;
								    &.checked{
								    	transition: all 0.3s ease;
								    	color: #fff;
								    	border-color: $site-default-color;
								    	background: $site-default-color;
								    }
		    					}
		    				}
		    			}
		    		}
		    		.standardNum{
						width: 100%;
						justify-content: space-between;
						align-items: center;
						padding: 40upx 0 30upx;
						.standardNumItem{
							flex-direction: column;
							.label{
								font-size: 28upx;
			    				color: #232323;
							}
							.txt{
								font-size: 20upx;
								color: #999;
							}
						}
		    		}

		    	}
		    	.wholesale {
		    		padding: 0 15px;
		    		box-sizing: border-box;
		    		.wholesaleInner{
		    			.wholesaleHeader{
		    				display: flex;
		    				justify-content: space-between;
		    				align-items: center;
		    				height: 50px;
		    				.wholesaleHeaderItem{
								font-size: 14px;
								color: #333;
                                flex: 1;
		    				}
		    			}
		    			section{
                            display: flex;
							.cube-scroll-wrapper{
								max-height: 300px;
							}
                            .wholesale-selector{
                            	display: flex;
                                overflow: auto;
                                flex: 1;
                                ul{
                                	flex: 1;
                                    li{
                                    	display: flex;
                                    	justify-content: center;
                                    	align-items: center;
                                        height: 60px;
                                        font-size: 14px;
                                        color: #333;
                                        padding: 0 5px;
                                        &.active{
                                            transition: all 0.3s ease;
                                            background: #F2F2F2;
                                        }
                                        span{
                                        	display: inline-block;
                                        	width: 16px;
                                        	height: 16px;
                                        	// background: url(../../assets/images/icons/icon_checked.png);
                                        	background-size: cover;
                                        	margin-right: 5px;
                                        }
                                    }
                                }
                                .wholesale-selector-stock{
                                	flex: 1;
                                	background: #F2F2F2;
                                	padding-right: 10px;
                                	>.stock-div{
                                		height: 60px;
                                     	padding: 5px 0;
                                        border-bottom: 1px solid #eee;
                                        text-align: right;
                                        .wholesale-stock{
	                                        margin-top: 4px;
	                                    }
	                                    .wholesale-stock,.wholesale-price{
	                                        font-size:12px;
	                                        color: #999;
	                                  
	                                        line-height: 12px;
	                                        span{
	                                            display: inline-block;
	                                            transform: scale(0.8);
	                                            transform-origin: right;
	                                        }
	                                    }
                                	}
                                }
                                &.right{
                                	flex: 2;
                                	background: #F2F2F2;
                                	ul {
                                		li{
		                                    border-bottom: 1px solid #eee;
                                		}
                                	}
                                }
                            }
                    		.wholesale-no-attr{
                    			display: flex;
                    			flex: 1;
                    			justify-content: space-between;
                    			align-items: center;
                    			padding-top: 20px;
                    			>div{
                    				&:first-child{
                    					text-align: left;
                    					span{
                    						font-size: 14px;
                    						color: #232323;
                    					}
                    					p{
                    						font-size: 10px;
    										color: #999;
                    					}
                    				}
                    				
                    			}
                    		}

		    			}
                        .wholesaleBottom{
                            width: 100%;
                            height: 55px;
                            text-align: right;
                            line-height: 55px;
                            font-size: 14px;
                            .selectTotal{
                                color: #333;
                                margin-right: 5px;
                            }
                            .selectPrice{
                                color: #D0021B;
                            }
                        }
		    		}
		    	}

		    	.standardBottom{
		    		// width: 100%;
					margin-left: -30upx;
					margin-right: -30upx;
					height: 100upx;
		    		.btn{
		    			height: 100%;
		    			margin: 0;
		    			background: $site-default-color;
		    			color: #fff;
		    			border-radius:0;
		    			border: 0;
		    			font-size: 32upx;
						align-items: center;
						justify-content:center;
		    			&.addCar-btn{
		    				background: #FFB30D;
		    			}
		    			&.noStockBtn{
		    				background: #ddd;
		    				color: #999;
		    			}
		    		}
		    	}
	    	}
	    	
	    }
		.region-popup {
            width: 100%;
            height: 100%; 
			.cube-popup-content{
				width: 100%;
				background: #f7f7f7;
			}
            .region-close {
                position: absolute;
                right: 10px;
                top: 15px;
                z-index: 10;
                font-size: 20px;
            }
            .region-inner {
                width: 100%;
                height: 100%;
                position: relative;
                padding-top: 60px;
                box-sizing: border-box;
                .region-title {
                    display: flex;
                    align-items: center;
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 50px;
                    line-height: 50px;
                    padding: 0 15px;
                    box-sizing: border-box;
                    background-color: #fff;
                    border-bottom: 1px solid #EDEDED;
                    .address-icon {
                        width: 10px;
                        height: 15px;
                        background-size: contain;
                        background-repeat: no-repeat;
                        background-position: center;
                        // background-image: url(../../assets/images/icons/icon_location@2x.png);
                    }
                    .txt {
                        font-size: 14px;
                        color: #333;
                        margin-left: 5px;
                    }
                }
                .city-wrapper {
                    width: 100%;
                    height: calc(100vh - 50px);
                    background-color: #fff;
                    // overflow: auto;
                    .cities {
                        .title, ul>li{
                            font-size: 14px;
                            color: #333;
                            height: 50px;
                            line-height: 50px;
                            border-top: 1px solid #EDEDED;
                            padding: 0 15px;
                            box-sizing: border-box;
                        }
						ul>li{
							text-align: left;
						}
                    }
                }
                .shortcut {
                    position: absolute;
                    z-index: 30;
                    right: 15px;
                    top: 70px;
                    text-align: center;
                    ul {
                        li {
                            font-size: 13px;
                            line-height: 18px;
                            color:#F32D16;
                        }
                    }
                }
            }
        }
		.couponDialog{
			.no-data{
				font-size:15px;
				color: #888;
				display: flex;
				flex-direction: column;
				align-items: center;
				padding-top: 60px;
				.pic{
					// background: url(../../assets/images/icons/pic_supply@2x.png) no-repeat;
					width: 160px;
					height: 120px;
					background-size: 100%;
					margin-bottom: 15px;
				}
			}
			.hd{
				display: flex;
				justify-content: space-between;
				align-items: center;
				height: 45px;
				padding: 0 15px;
				font-size: 14px;
				color: #353535;
				background: #fff;
				.close-icon{
					height: 45px;
					display: flex;
					align-items: center;
					justify-content: flex-end;
					width: 45px;
					font-size: 20px;
					color: #888;
					img {
						width: 13px;
						height: 13px;
					}
				}
			}
			.bd{
				background: #f4f4f4;
				.cube-scroll-wrapper{
					max-height: 300px;
					.coupon-item{
						&:last-child{
							margin-bottom: 10px;
						}
					}
				}
			}
		}
	}
</style>

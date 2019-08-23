<template>
  <view class="fail-goods-item" :class="type===1?'vux-1px-t':'vux-1px-b'">
    <view class="lazy-img">
      <image class="img" :src="badData.goods_img" alt=""></image>
    </view>
    <view class="info">
			<view class="infotop">
				<view class="dsc">{{badData.goods_name}}</view>
				<view class="price">￥{{badData.goods_price}}</view>
			</view>
      <view class="type">
        <p>规格名称：{{badData.sku_name || '无'}}</p>
        <span v-if="type===1" class="show-type">x{{badData.goods_num}}</span>
        <span v-if="type===2">x{{badData.goods_num}}</span>
      </view>
      <!-- <view class="price">￥{{badData.goods_price|toFixedTwo}}</view> -->
      <!-- <view class="arrow" v-if="type===1"><img src="../../static/imgs/icons/btn_youjiantou copy8@2x.png" alt=""></view> -->
    </view>
  </view>
</template>

<script>
  export default {
    name:'FailGoodsItem',
    props:{
      type:{
        type: Number,
        default: 1
      },
      badData:{
        type: Object,
      }
    }
  }
</script>

<style scoped lang='scss'>
  .fail-goods-item{
    padding: 30upx 28upx 28upx 30upx;
    display: flex;
    .lazy-img{
      min-width: 166upx;
      height: 166upx;
      margin-right: 20upx;
      border-radius: 10upx;
			background: #F5F5F5;
			
    }
    .info{
      display: flex;
      flex-grow: 1;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
      text-align: left;
			.infotop{
				justify-content: space-between;
			}
      .dsc{
        font-size: 26upx;
        color: #999;
        display: -webkit-box;
        white-space: normal;
        word-break: break-all;
        -webkit-box-orient: vertical;
        -webkit-line-clamp:2;
        overflow: hidden;
        text-overflow:ellipsis;
        margin-bottom: 6upx;
        height: 70upx;
      }
      .type{
        color: #999;
        font-size: 22upx;
        margin-bottom: 20upx;
        display: flex;
        justify-content: space-between;
        span{
          margin-right: 2upx;
        }
        .show-type{
          margin-right: 24upx;
        }
      }
      .price{
        color: #999999;
        font-size: 28upx;
        font-family:SourceHanSansCN-Medium;
      }
      .arrow{
        position: absolute;
        right: 0;
        top: 80upx;
				img{
					height: 26upx;
					width: 16upx;
				}
      }
    }
  }
</style>
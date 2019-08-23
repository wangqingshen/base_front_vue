<template>
    <view class="top-banner" :style="{height:$mUtils.px(val.height)}">
        <swiper class="top-swiper" circular=true :autoplay="val.autoplay ? true : false" :duration="val.duration" :loop="val.loop" :indicator-dots="showDots"
        :vertical="val.vertical" :touchable="val.touchable" @change="change">
            <swiper-item v-for="(item, index) in val.list" :key="index" class="lazy-img" @tap="goLink(item)">
                <image :src="item.src"></image>
                <text class="banner-desc" v-if="val.textShow">{{item.desc}}</text>
            </swiper-item>
        </swiper>
        <view class="swiper-dots" v-if="val['show-indicators']">
            <view :class="['dot-item', current == index ? 'actived':'']" v-for="(item, index) in val.list" :key="index"></view>
        </view>
    </view>
</template>

<script>
export default {
    props: ['val', 'type'],
    data(){
        return {
            showDots: false,
            current: 0
        }
    },
    methods:{
        change(e){
            this.current = e.detail.current
        },
        goLink(item){
            this.$mUtils.goLink(item)
        }
    }
}
</script>


<style lang="scss">
.top-banner {
    position: relative;
    width: 100%;
    background: #fff;
    .top-swiper{
        width: 100%;
        height: 100%;
        .lazy-img{
            position: relative;
            width: 100%;
            height: 100%;
            background: #f5f5f5;
            display: flex;
            justify-content: center;
            align-items: center;
            .banner-desc{
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                height: 30px;
                line-height: 30px;
                background: rgba(0,0,0,.5);
                font-size: 12px;
                color:#fff;
                padding: 0 10px;
            }
			.pic{
				width: 100%;
				height: 100%;
			}
            &:after{
                content: '';
                padding-top: 100%;
                display: block;
            }
            image{
                width: 100%;
                height: 100%;
            }
        }
        a{
            display: block;
            width: 100%;
            height: 100%;
            position: absolute;
        }
    }
    .swiper-dots{
        position: absolute;
        right: 20upx;
        bottom: 24upx;
        .dot-item{
            opacity: 1;
            width: 10upx;
            height: 10upx;
            border-radius: 50%;
            background: #fff;
            &:not(:last-child){
                margin-right: 10upx;
            }
            &.actived{
                width: 32upx;
                background: #f73737;
                border-radius: 40upx;
            }
        }
    }
}
</style>


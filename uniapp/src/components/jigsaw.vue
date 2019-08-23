<template>
    <view class="jigsaw">
        <ul class="jigsaw-one" v-if="val.displayType == 1">
            <li class="lazy-img" @tap="goLink(val.list[0])" :style="{float: val.positionType, width: Number(val.ratio.split(':')[0])/(Number(val.ratio.split(':')[0])+Number(val.ratio.split(':')[1]))*100+'%', height: jigsawHeight(val.list[0])+'px'}">
                <image :src="val.list[0].src" class="jigsaw-img"></image>
				<text class="jigsaw-txt" v-if="val.list[0].desc">{{val.list[0].desc}}</text>
            </li>
            <li :style="{float: val.positionType, width: Number(val.ratio.split(':')[1])/(Number(val.ratio.split(':')[0])+Number(val.ratio.split(':')[1]))*100+'%'}">
                <ul class="sec-ul">
                    <li class="lazy-img" @tap="goLinkOther" :data-id="index" v-for="(item, index) in val.list.slice(1)" :key="index" :style="{width: 1/val.scale*100+'%', height: (jigsawHeight(item)/val.scale)+'px'}">
                        <image :src="item.src" class="jigsaw-img"></image>
                        <text class="jigsaw-txt" v-if="item.desc">{{item.desc}}</text>
                    </li>
                </ul>
            </li>
        </ul>
        <ul class="jigsaw-two" v-else>
            <li class="lazy-img" @tap="goLink(item)" v-for="(item, index) in val.list" :key="index" :style="{width: index == 0 ? Number(val.ratio.split(':')[0])/(Number(val.ratio.split(':')[0])+Number(val.ratio.split(':')[1]))*100+'%':index == 1 ? Number(val.ratio.split(':')[1])/(Number(val.ratio.split(':')[0])+Number(val.ratio.split(':')[1]))*100+'%': '100%', height: jigsawHeight(item)+'px'}">
                <image :src="item.src" class="jigsaw-img"></image>
                <text class="jigsaw-txt" v-if="item.desc">{{item.desc}}</text>
            </li>
        </ul>
    </view>
</template>

<script>
export default {
    props: ['val', 'type'],
    data(){
        return {
            imgurl: this.type == 0 ? this.$mConfig.imgUrl : ''
        }
    },
    methods: {
        goLink(item){
            this.$mUtils.goLink(item)
        },
        goLinkOther(e){
            let id = e.currentTarget.dataset.id,
                item = this.val.list.slice(1)[id]
            this.goLink(item)
        }
    },
	computed:{
		jigsawHeight() {
			return function (d) {
                try {
                    console.log(d)
                    const res = uni.getSystemInfoSync()
                    let w = res.windowWidth,
                        radio = Number(this.val.ratio.split(':')[0])/(Number(this.val.ratio.split(':')[0])+Number(this.val.ratio.split(':')[1])),
                        h = w*radio*(d.height/d.width).toFixed(2)
                    return h
                }catch(e){}
			}	
		}
	}
}
</script>


<style lang="scss">
.jigsaw{
    position: relative;
    ul{
        display:block;
		width: 100%;
        overflow: hidden;
        clear: both;
        background: rgb(231,231,231);
        li{
            position: relative;
        }
        &.jigsaw-two, &.sec-ul{
            li{
                float: left;
            }
        }
        .lazy-img{
            a{
                position: absolute;
                display: block;
                width: 100%;
                height: 100%;
            }
            &:after{
                // display: block;
                // content: '';
                // padding-top: 100%;
            }
        }
    }
    .jigsaw-txt{
        color: #fff;
        font-size:26upx;
        position: absolute;
        width: 100%;
        bottom: 0;
        left: 0;
        padding: 10upx 20upx;
        background: rgba(0,0,0,.5);
    }
    img{
        display: block;
        width: 100%;
    }
    image{
        width: 100%;
        height: 100%;
    }
}
</style>


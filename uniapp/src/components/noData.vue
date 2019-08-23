<template>
    <!-- 缺省图 -->
    <view class="no-data">
        <view class="image">
            <image :src="imgPath" ></image>
        </view>
        <text class="txt">{{msg}}</text>
    </view>
</template>

<script>
    export default{
        name: 'NoData',
        props:{
            imgPath:{

            },
            msg:{
                type: String
            }
        },
        data(){
            return {

            }
        }
    }
</script>

<style lang="scss">
    no-data,.no-data{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        flex: 1;
        .image{
            width: 196upx;
            height: 140upx;
            overflow: hidden;
            uni-image, image{
                width: 100%;
                height: 100%;
            }
        }
        .txt{
            padding-top: 20upx;
            color: #999;
            font-size: 24upx;
            text-align: center;
        }
    }
</style>

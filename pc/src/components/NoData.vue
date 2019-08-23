<template>
    <!-- 缺省图 -->
    <div class="no-data">
        <div class="image">
            <img :src="imgPath" >
        </div>
        <div class="txt">{{msg}}</div>
    </div>
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
    .no-data{
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-top: 130px;
        animation: jump 1000ms both;
        .image{
            width: 122px;
            height: 106px;
            overflow: hidden;
            img{
                width: 100%;
                height: 100%;
            }
        }
        .txt{
            padding-top: 20px;
            // width: 140px;
            color: #666;
            font-size: 14px;
            text-align: center;
        }
    }
</style>

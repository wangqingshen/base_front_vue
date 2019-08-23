<template>
    <div class="page-404">
        <component :pageTitle="pageTitle" :style="item.style" v-for="(item, index) in baseData" :key="index" :is="item.name"></component>
    	<div class="inner">
    		<NoData :imgPath="imgPath" msg="网络连接超时" />
    		<div class="g-btn" @click="goHome">返回首页</div>
    	</div>
    </div>
</template>
<script>
    export default{
        name:'noFound',
        data(){
        	return {
                baseData: [{name: 'NavBar', style: 'color:red;background:#f5f5f5;z-index:1001;'}, {name: 'NavBar'}, {name: 'NavBar'}],
        		pageTitle: '404',
        		imgPath: require('../../assets/images/icons/404@2x.png')
        	}
        },
        methods:{
        	goHome(){
        		this.$router.push({name: 'index'})
        	}
        }
    }
</script>
<style lang="scss" type="text/scss">
.page-404 {
	.g-btn{
        width:120px;
        height:40px;
        font-size: 16px;
        line-height: 40px;
        text-align: center;
        border:1px solid #D0021B;
        color: #D0021B;
        border-radius:20px;
        margin: auto;
        margin-top: 20px;
    }
}
</style>

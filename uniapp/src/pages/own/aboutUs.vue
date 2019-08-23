<template>
	<view class="wsy-about-us-page">
		<rich-text :nodes="content" class="content-box"></rich-text>
	</view>
</template>

<script>
	export default {
		data(){
			return {
				content: ""
			}
		},
		onShow(){
			//注册协议
			this.$api.getArticle({
				cmd: {"member" : "getArticle"},
				data:{"article_id": 5}
			}).then(res=>{
				console.log(res,"注册协议")
				if(res.code == 1){
					this.content = res.data.article_text
					this.content = this.$mUtils.rplaceRichImg(this.content)
				}else{
					this.$mUtils.toast(res.msg);
				}
			}).catch(err=>{console.log(err)})
		}
	}
</script>

<style lang="scss" type="text/scss" scoped>
	.wsy-about-us-page{
		background: #FFF;
		flex: 1;	
		width: 100%;
		padding: 0 20upx;
		.content-box{
			img{
				display: block;
				width: 100%;
			}
		}
	}
</style>

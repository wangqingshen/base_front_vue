<script>
	export default {
		onLaunch: function(o) {
			console.log('onLauch', o)
			this.$AppEntryController.getWeChatOpenId();
			// #ifdef H5
			this.$AppEntryController.handleH5BrowserAddressBarAuth();
			// #endif
			this.siteconfig()
		},
		onShow: function() {
			console.log('App Show')
			// #ifdef  H5
			// 	let elements = document.getElementsByClassName('uni-tabbar__icon');
			// 	console.log(elements,"elelelelelel");
			// 	for(let i=0;i<elements.length;i++){
			// 		console.log(elements[i].getElementsByTagName('img'));
			// 	}	
			// #endif
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
			siteconfig(){
				this.$api.siteconfig({
					cmd:{"member": "siteconfig"},
					data:{}
				}).then(res=>{
					if(res.code == 1) {
						this.$store.commit('SITE_CONFIG', res.data)
					}
				}).catch(res=>{})
			}
		}
	}
</script>

<style>
	/*每个页面公共css */
	@import './common/common.css';
	*{
		box-sizing: border-box;
	}
	image{
		width: 100%;
		height: 100%;
	}
	page{
		position: relative;
		color: #333333;
	}
	page,
	view {
		display: flex;
		box-sizing: border-box;
	}

	page {
		display: flex;
		min-height: 100%;
		background-color: #f5f5f5;
	}
</style>

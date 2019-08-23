import $mRoutesConfig from '@/config/routes.config.js'
import $mRouter from './router.js'
import store from '@/store'
export default {

	/* 
	 * obj 转 params字符串参数  
	 * 例子：{a:1,b:2} => a=1&b=2
	 */
	objParseParam(obj) {
		let paramsStr = "";
		if (obj instanceof Array) return paramsStr;
		if (!(obj instanceof Object)) return paramsStr;
		for (let key in obj) {
			paramsStr += `${key}=${obj[key]}&`;
		}
		return paramsStr.substring(0, paramsStr.length - 1);
	},

	/* 
	 * obj 转 路由地址带参数
	 * 例子：{a:1,b:2} => /pages/index/index?a=1&b=2
	 */
	objParseUrlAndParam(path, obj) {
		let url = path || "/";
		let paramsStr = "";
		if (obj instanceof Array) return url;
		if (!(obj instanceof Object)) return url;
		paramsStr = this.objParseParam(obj);
		paramsStr && (url += "?");
		url += paramsStr;
		return url;
	},

	/* 
	 * 获取url字符串参数
	 */
	getRequestParameters(locationhref) {
		let href = locationhref || "";
		let theRequest = new Object();
		let str = href.split("?")[1];
		if (str != undefined) {
			let strs = str.split("&");
			for (let i = 0; i < strs.length; i++) {
				theRequest[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
			}
		}
		return theRequest;
	},


	/**
	 * 乘法，解决js精度损失问题
	 * @param {*} arg1 
	 * @param {*} arg2 
	 */
	accMul(arg1, arg2) {
		arg1 = arg1 || 0;
		var m = 0,
			s1 = arg1.toString(),
			s2 = arg2.toString();
		try {
			m += s1.split(".")[1].length
		} catch (e) {}
		try {
			m += s2.split(".")[1].length
		} catch (e) {}
		return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
	},

	isChecked(list, string) {
		let a = list.filter(item=>{
			if(item == string) return item
		  })
		console.log(a)
		return a
	},

	// 组件化装修跳转
	goLink(item){
		console.log(item, $mRouter)
		var type = item.link_type
		if(type == 0){
			return false
		}else if(type == 1){
			$mRouter.push({
				route: $mRoutesConfig.goodsDetail,
				query: {spuId: item.spu_id, skuId: item.sku_id}
			})
		}else if(type == 2){
			let data = {},
				gc_level = '',
				gc_id = ''
			gc_id = item.gc_id_3 ? item.gc_id_3 : (item.gc_id_2 ? item.gc_id_2 : item.gc_id_1)
			gc_level = item.gc_id_3 ? 3 : (item.gc_id_2 ? 2 : 1)
			data.sort_type = 0
			data.sort_val = false
			data.price_between = []
            data.goods_label = []
            data.gc_id_type = gc_level
            data.gc_id_value = gc_id
            data.search_gc_name = ''
			if(item.searchList.length){
				if(this.isChecked(item.searchList, 'goods_label').length){
					data.goods_label = item.goods_label
				}
				if(this.isChecked(item.searchList, 'price_between').length){
					let arr = [item.price_between.min_price, item.price_between.max_price]
					data.price_between = arr
				}
				if(this.isChecked(item.searchList, 'goods_sort').length){
					let sort = item.goods_sort
					if(sort == 0 || sort == 2 || sort == 4){
						data.sort_val = false
					}else{
						data.sort_val = true
					}
					if(sort == 0 || sort == 1){
						data.sort_type = 0
					}else if(sort == 2 || sort == 3){
						data.sort_type = 1
					}else if(sort == 4 || sort == 5){
						data.sort_type = 2
					}
				}
			}
			store.commit('SET_FILTERSEARCH',data)
			$mRouter.push({
                route: $mRoutesConfig.goodsList,
				query: {}
            })
		}else if(type == 3){
			let url = (item.link_url_type == 1 ? 'http://' : 'https://') + item.link_url
			// #ifdef H5
			window.location.href = url
			// #endif
			// #ifdef MP-WEIXIN
			console.log(url, encodeURIComponent(url))
			$mRouter.push({
				route: $mRoutesConfig.webView,
				query: {url: encodeURIComponent(url)}
			})
			// #endif
		}else if(type == 4){
			// router.push({name: 'groupList'})
		}else if(type == 5){
			// router.push({name: 'secKill'})
		}else if(type == 6){
			$mRouter.switchTab({
				route: $mRoutesConfig.shopCar,
				query: {}
			})
		}else if(type == 7){
			$mRouter.switchTab({
				route: $mRoutesConfig.own,
				query: {}
			})
		}else if(type == 8){
			$mRouter.switchTab({
				route: $mRoutesConfig.category,
				query: {}
			})
		}
	},
	
	// 随机生成n位随机数
    getRandStr(n){
        let str = ''
        for (let i = 0; i < n; i++) {
            str += Math.floor(Math.random() * 10).toString()
        }
        return str
	},
	// 获取当前时间
    getCurTime(){
        let date = new Date(),
            y = date.getFullYear().toString().substr(2),
            m = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1).toString(),
            d = date.getDate() < 10 ? '0' + date.getDate() : date.getDate().toString(),
            h = date.getHours() % 12 < 10 ? '0' + date.getHours() % 12 : (date.getHours() % 12).toString(),
            i = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes().toString(),
            s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds().toString();
        return (y + m + d + h + i + s)
	},
	// 提示组件
	toast(text, duration, success) {
		uni.showToast({
			title: text,
			icon: success ? 'success' : 'none',
			duration: duration || 2000
		})
	},
	// upx转px
	px(num){
		return 2*uni.upx2px(num)+'px';
	},
	addImgUrl(props){
		if(props.indexOf('http://') === -1 && props.indexOf('https://') === -1){
			let url = process.env.VUE_APP_PLATFORM == "h5" ? "" : "https://shopbase.wsyjcs.cn";
			return url + props;
		}else{
			return props
		}
	},
	// 处理图片,去掉后缀加密
	handleImg(val){
		// let str = val.split('?')[0];
		return val;
	},
	badStatus (value) {
		switch(value){
			case 1203: 
				return '商品库存不足'
			case 1204: 
				return '商品已下架'
			case 1223: 
				return '超过拼团购买数量限制'
			case 1212: 
				return '商品不存在'
			case 1229: 
				return '秒杀活动实效'
			case 1230: 
				return '超出单人限购数量'
			case 1239: 
				return '订单商品超出配送范围'
			case 1232: 
				return '购买批发商品的数量必须超过起批量'
			case 1242: 
				return '不在销售时间内'
			case 1244: 
				return '已超过最大购买数量'
			case 1228: 
				return '不存在此秒杀商品'
			case 1901: 
				return '分销商信息不存在'
			case 1903: 
				return '分销商信息不完整'
		}
	},
	formatMsgDate (value1, value2) {
		var now = new Date(value1 * 1000);
		var date = new Date(value2.replace(/-/g, "/"));
		//计算时间间隔，单位为分钟
		var inter = parseInt((now.getTime() - date.getTime()) / 1000 / 60);
		if (inter == 0) {
			return "刚刚";
		}
		//多少分钟前
		else if (inter < 60) {
			return inter.toString() + "分钟前";
		}
		//多少小时前
		else if (inter < 60 * 24) {
			return parseInt(inter / 60).toString() + "小时前";
		} else if (now.getFullYear() == date.getFullYear()) {
			return (date.getMonth() + 1).toString() + "-" +
				date.getDate().toString() + " " +
				date.getHours() + ":" +
				date.getMinutes();
		} else {
			return date.getFullYear().toString().substring(2, 3) + "-" +
				(date.getMonth() + 1).toString() + "-" +
				date.getDate().toString() + " " +
				date.getHours() + ":" +
				date.getMinutes();
		}
	},

	rateInfo (value) {
		switch (value) {
			case 1:
				return '非常差'
			case 2:
				return '差'
			case 3:
				return '一般'
			case 4:
				return '好'
			case 5:
				return '非常好'
		}
	},

	rplaceRichImg(content){
		let str = content.replace(/<img[^>]*>/gi, function (match, capture) {
			console.log(match,match.indexOf('style'), 'replace')
			if(match.indexOf('style') != -1) {
				return match.replace(/style\s*?=\s*?([‘"])[\s\S]*?\1/ig, 'style="max-width:100%;height:auto;"') // 替换style
			}else{
				return match.replace(/<img/ig, '<img style="max-width:100%;height:auto;"')
			}
			
		})
		return str
	},

	stopScroll(){
		// #ifdef MP-WEIXIN
		// #endif
		// #ifdef APP-PLUS || H5
		document.body.style.overflow='hidden';
		document.body.style.height="100%";        
        document.addEventListener("touchmove",function(event){
			event.preventDefault();
		},false)//禁止页面滑动
		// #endif
	},

	startScroll(){
		// #ifdef MP-WEIXIN
		// #endif
		// #ifdef APP-PLUS || H5
		document.body.removeAttribute('style')
		document.removeEventListener("touchmove",function(event){
			event.preventDefault();
		},false)
		// #endif
	},
	checkIsWx(){
		var u = navigator.userAgent.toLowerCase()
		if (u.match(/MicroMessenger/i)) {
			return true
		}
		return false
	},

	async compressImage(src, platform){
		const imageInfo = await this.getImageInfo(src);
		const orientation = imageInfo.orientation;
		if(!orientation){
			return src
		}
		console.log(imageInfo, orientation, platform)
		let rotate = 0;
		let quality = 80;
		if (platform === 'ios') {
			rotate = 90;
			quality = 25;
		} else {
			switch (orientation) {
				case 'up': //exif:1 不旋转
					rotate = 180;
					break;
				case 'down': //exif:3 旋转180度
					rotate = 180;
					break;
				case 'right': //exif:6 旋转90度
					rotate = 90;
					break;
				case 'left': //exif:8 旋转270度
					rotate = 270;
					break;
				default:
					rotate = 0;
					break;
			}
		}
		return new Promise(function(resolve, reject) {
			uni.compressImage({
				src: src,
				quality: quality,
				rotate: rotate,
				success: res => {  
					let tempPath = res.tempFilePath;
					resolve(tempPath)
				},  
				fail: (e) => {  
					reject(e) 
				}  
			})
			
		})
	},
	getImageInfo(path){
		return new Promise(function(resolve, reject) {
			// #ifdef APP-PLUS
			plus.io.getImageInfo({
				src: path,
				success: function(image) {
					resolve(image)
				},
				fail: function(err) {
					console.log("getImageInfoErr: " + JSON.stringify(err));
					reject(err)
				}
			});
			// #endif
			// #ifdef H5 || MP-WEIXIN	
			uni.getImageInfo({
				src: path,
				success: function(image) {
					resolve(image)
				},
				fail: function(err) {
					console.log("getImageInfoErr: " + JSON.stringify(err));
					reject(err)
				}
			});
			// #endif
		})
	}
}
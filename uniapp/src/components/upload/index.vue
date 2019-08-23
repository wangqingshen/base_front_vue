<template>
    <view class="upload-item" @tap="upload" v-if="lists.length < maxLength && type == 1">
        <tui-icon :name="uploadIconName" :size="size" color="#999"></tui-icon>
        <view class="txt" v-if="txtShow">
            <text v-if="!lists.length">{{addTxt}}</text>
            <text v-else>{{lists.length}}/{{maxLength}}</text>    
        </view>
    </view>
</template>
<script>
    const device = uni.getSystemInfoSync()
    import tuiIcon from "@/components/tui/icon/icon"
	import EXIF from '@/common/utils.js'
    export default{
        name: 'upload',
        components: {tuiIcon},
        props: {
            uploadIconName: {
                type: String,
                default: 'camera-add'
            },
            size: {
                type: Number,
                default: 35
            },
            txtShow: {
                type: Boolean,
                default: true
            },
            maxLength: {
                type: Number,
                default: 4
            },
            type: {
                type: Number,
                default: 1
            },
            lists: {
                type: Array,
            },
            index: {
                type: Number,
                default: 1
            },
			addTxt: {
				type: String,
				default: "添加照片"
			}
        },
        data() {
            return {
              
            }
        },
        methods: {
          upload(){
                if (this.lists.length > this.maxLength) {
					this.$mUtils.toast('最多上传'+this.maxLength+'张图片');
					return
				}
                wx.chooseImage({
                    count: this.maxLength - this.lists.length,
                    sizeType: ['original'],
                    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                    success: async (res) => {
                        const tempFilePaths = res.tempFilePaths
                        if(this.lists.length + tempFilePaths.length > this.maxLength) {
                            this.$mUtils.toast('最多上传'+this.maxLength+'张图片');
					        return
                        }
                        uni.showLoading({
                            mask: true,
                            title: '图片上传中'
                        })
                        for (let i = 0; i < tempFilePaths.length; i++) {
							const path = tempFilePaths[i]
							const src = await this.compressImageHandler(path)
							// #ifdef APP-PLUS || H5
                            this.completeEvt(src)
                            // #endif
                            // #ifdef MP-WEIXIN
                            this.urlTobase64(src)
                            // #endif
						}
                    }
                })
            },
            urlTobase64(url){
               this.$toBase64(url)
					.then(async (base64) => {
						this.uploadImg(base64)
					})
					.catch(error => {
						console.error(error)
						this.$mUtils.toast('上传图片失败，请稍后再试')
						return false;
					})
     //            wx.request({
     //            url:url,
     //            responseType: 'arraybuffer', //最关键的参数，设置返回的数据格式为arraybuffer
     //            success:res=>{
     //                //把arraybuffer转成base64
					// let base64 = wx.arrayBufferToBase64(res.data); 
					// //不加上这串字符，在页面无法显示的哦
					// base64　= 'data:image/jpeg;base64,' + base64　
					// //打印出base64字符串，可复制到网页校验一下是否是你选择的原图片呢
					// // console.log(base64)　
					// this.uploadImg(base64)
     //                }
     //            })
            },
            completeEvt(src){
                var image = new Image()
                image.src = src
                image.setAttribute("crossOrigin",'Anonymous')
                image.onload = res=>{
                    this.getBase64Image(res.target)
                }
            },
            async compressImageHandler(src){
				console.log('platform==='+device.platform)
				const tempPath = await this.$mUtils.compressImage(src,device.platform);
				return tempPath
			},
            getBase64Image(img) {
				var myorientation = 6;
				console.log(EXIF)
				EXIF.getData(function() {
					console.log(11)
					//图片方向角  
					var Orientation = null;
					// alert(EXIF.pretty(this));  
					EXIF.getAllTags(this);
					//alert(EXIF.getTag(this, 'Orientation')); 
					myorientation = EXIF.getTag(this, 'Orientation');
					//return;  
					console.log(EXIF.getTag(this, 'Orientation'),'myorientation myorientation myorientation')
					
					var mpImg = new MegaPixImage(img);
					mpImg.render(canvas, {
						maxWidth: 700,
						maxHeight: 700,
						quality: 1,
						orientation: myorientation,
					});
					
				});
				
				// alert(myorientation);
				var canvas = document.createElement("canvas");
				var w = img.width,
				    h = img.height;
				var toSize = 700;
				canvas.width = toSize;
				canvas.height = toSize;
				var w2 = toSize*w/h, h2 = toSize;
				var ctx = canvas.getContext("2d");
				if(myorientation != "" && myorientation != 1){  
				        alert('旋转处理');  
				        switch(myorientation){  
				            case 6://需要顺时针（向左）90度旋转  
				                alert('需要顺时针（向左）90度旋转');  
				                this.rotateImg(img,'left',canvas);  
				                break;  
				            case 8://需要逆时针（向右）90度旋转  
				                alert('需要顺时针（向右）90度旋转');  
				                this.rotateImg(img,'right',canvas);  
				                break;  
				            case 3://需要180度旋转  
				                alert('需要180度旋转');  
				                this.rotateImg(img,'right',canvas);//转两次  
				                this.rotateImg(img,'right',canvas);  
				                break;  
				        }         
				    }else{
						ctx.drawImage(img, 0, 0, w, h, 0, 0, w2, h2);
						var ext = img.src.substring(img.src.lastIndexOf(".")+1).toLowerCase();
						var dataURL = canvas.toDataURL("image/"+ext, 1);
						this.uploadImg(dataURL)
						// return dataURL;
					} 
				
				
                
            },
			rotateImg(img, direction,canvas) {    
				//alert(img);  
				//最小与最大旋转方向，图片旋转4次后回到原方向    
				var min_step = 0;    
				var max_step = 3;    
				//var img = document.getElementById(pid);    
				if (img == null)return;    
				//img的高度和宽度不能在img元素隐藏后获取，否则会出错    
				var height = img.height;    
				var width = img.width; 
			   // var toSize = 700;
			   // canvas.width = toSize;
			   // canvas.height = toSize;
			   // var w2 = toSize*w/h, h2 = toSize;
				//var step = img.getAttribute('step');    
				var step = 2;    
				if (step == null) {    
					step = min_step;    
				}    
				if (direction == 'right') {    
					step++;    
					//旋转到原位置，即超过最大值    
					step > max_step && (step = min_step);    
				} else {    
					step--;    
					step < min_step && (step = max_step);    
				}     
				//旋转角度以弧度值为参数    
				var degree = step * 90 * Math.PI / 180;    
				var ctx = canvas.getContext('2d');
				var toSize = 600;
				canvas.width = toSize;
				canvas.height = toSize;
				var w2 = toSize*width/height, h2 = toSize; 
				switch (step) {    
					case 0:     
						ctx.drawImage(img, 0, 0);  
						var ext = img.src.substring(img.src.lastIndexOf(".")+1).toLowerCase();
						var dataURL = canvas.toDataURL("image/"+ext, 1);
						console.log(dataURL,'dataURL','0')
						this.uploadImg(dataURL)
						break;    
					case 1: 
						ctx.rotate(degree);  
						ctx.drawImage(img, 0, 0,height, width, 0, 0,w2,-h2);
						// ctx.drawImage(img, 0, -height);  
						var ext = img.src.substring(img.src.lastIndexOf(".")+1).toLowerCase();
						var dataURL = canvas.toDataURL("image/"+ext, 1);
						console.log(dataURL,img,'dataURL','1')
						this.uploadImg(dataURL)
						break;    
					case 2:   
						ctx.rotate(degree); 
						// ctx.drawImage(img, 0, 0, -width, -height, 0, 0, w2, h2);
						ctx.drawImage(img, 0, 0,height, width, 0, 0,-w2,-h2);
						// ctx.drawImage(img, -width, -height);
						var ext = img.src.substring(img.src.lastIndexOf(".")+1).toLowerCase();
						var dataURL = canvas.toDataURL("image/"+ext, 1);
						console.log(dataURL,'dataURL','2')
						this.uploadImg(dataURL)
						break;    
					case 3:    
						ctx.rotate(degree);  
						// ctx.drawImage(img, 0, 0, -width, 0, 0, 0, w2, h2);
						ctx.drawImage(img, 0, 0,height, width, 0, 0,-w2,h2);
						// ctx.drawImage(img, -width, 0);   
						var ext = img.src.substring(img.src.lastIndexOf(".")+1).toLowerCase();
						var dataURL = canvas.toDataURL("image/"+ext, 1);
						console.log(dataURL,'dataURL','3')
						this.uploadImg(dataURL)
						break;    
				}  
			},
            uploadImg(imgPath){
                this.$api.uploadImg({
                    cmd:{
                        sys:'uploadImg'
                    },
                    data:{
                        img:imgPath
                    }
                }).then(res=>{
                    uni.hideLoading()
                    if(res.code == 1) {
                        this.$emit('emitUpload', {index: this.index, showPath: imgPath, path: res.data})
                    }
                    
                })
            },

        },
        created() {
          
        }        
    }
</script>
<style lang="scss">
   .upload-item{
        width: 128upx;
        height: 128upx;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #333;
        font-size: 28upx;
        border: 1upx dashed #999;
        .txt{
            font-size: 24upx;
            color: #999;
        }
    } 
</style>
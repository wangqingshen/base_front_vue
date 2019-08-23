<template>
	<view class="lazy-load">
		<image class="image" :class="{lazy:!lazyShow}" :data-index="index" @load="imageLoad" :src="item.show?item.src:''" />
		<image class="image placeholder" :class="{loaded:item.loaded}" :src="placeholderSrc" />
	</view>
</template>

<script>
	export default {
        name: 'lazy-load',
        props: {
            lazyShow: {
                type: Boolean,
                default: true
            },
            loadedShow: {
                type: Boolean,
                default: false
            },
            loadedSrc: {
                type: String
            },
            placeholderSrc: {
                type: String,
                default: require('@/static/imgs/default/default-pic.png')
            }
        },
		data() {
			var imgs = ['shuijiao', 'muwu', 'cbd']
			var list = []

			for (let i = 0; i < 20; i++) {
				list.push({
					src: `https://img-cdn-qiniu.dcloud.net.cn/uniapp/images/${imgs[i%3]}.jpg`,
					show: false,
					loaded: false
				})
			}

			return {
				windowHeight: 0,
				placeholderSrc: '../../../static/60x60.png',
				list: list,
				show: false
			}
		},
		methods: {
			load() {
				uni.createSelectorQuery().selectAll('.lazy').boundingClientRect((images) => {
					images.forEach((image, index) => {
						if (image.top <= this.windowHeight) {
							this.list[image.dataset.index].show = true;
						}
					})
				}).exec()
			},
			imageLoad(e) {
				this.list[e.target.dataset.index].loaded = true
			}
		},
		onLoad() {
			this.windowHeight = uni.getSystemInfoSync().windowHeight
		},
		onShow() {
			if (!this.show) {
				this.show = true
				setTimeout(() => {
					this.load()
				}, 100)
			}
		},
		onPageScroll() {
			this.load()
		}
	}
</script>

<style>
	.placeholder {
		opacity: 1;
		transition: opacity 0.4s linear;
	}

	.placeholder.loaded {
		opacity: 0;
	}

	.uni-media-list-logo {
		position: relative;
	}

	.uni-media-list-logo .image {
		position: absolute;
	}
</style>

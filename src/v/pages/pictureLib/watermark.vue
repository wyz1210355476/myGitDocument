<template>
	<div class="contents pics waterContent">
		<page-title title="图片列表"></page-title>
		<!-- tab -->
		<div class="tabs">
			<ul>
				<li @click="getFilterParam(options[0].name)" class="wmItem1">
					全部图片<i class="el-icon-arrow-down arrowDown"></i>
				</li>
				<li @click="getFilterParam(options[1].name)" class="wmItem2">水印图片</li>
			</ul>
		</div>
		<div class="content-table">
			<water-part></water-part>
		</div>
	</div>
</template>

<script>
	import pageTitle from '@components/pageTitle';
	import waterPart from '@components/waterPart';
	export default {
		data(){
			return{
				activeName: "first",
				type: this.$route.query.type,
				isFrame:true,
				options: [{
                    label: "全部图片",
                    name: "pics"
                }, {
                    label: "水印图片",
                    name: "watermark"
				}],
				isLoading:false,// loading层
				
			}
		},
		mounted() {
			this.getFilterParam();
		},
		methods: {
			// 初始化tab
			getFilterParam(type){
				if(type == 'pics'){
					this.$router.push({
                        path:'./pics',
                        query: {type: "pics"}
					})
				}else{
					this.$router.push({
                        path:'./watermark',
                        query: {type: "watermark"}
                    })
				}
			},
		},
		components: {
			pageTitle,
			waterPart
		}
	}
</script>

<style>
	.pics .tabs{
		height: 40px;
		border-bottom: 1px solid #eee;
		margin-bottom: 10px;
	}
	.pics .tabs ul,
	.pics .tabs li{
		list-style: none;
		padding: 0;
		margin: 0;
	}
	.pics .tabs li{
		float: left;
		padding: 0 20px;
		height: 41px;
		box-sizing: border-box;
		line-height: 41px;
		display: inline-block;
		list-style: none;
		font-size: 14px;
		font-weight: 500;
		color: #303133;
		position: relative;
		cursor: pointer;
		border: 1px solid #e4e7ed;
		border-bottom: none;
	}
	.pics .tabs li:nth-of-type(1){
		border-right: 0;
		padding: 0;
		border-top-left-radius: 4px;
	}
	.pics .tabs li:nth-of-type(2){
		border-top-right-radius: 4px;
	}
	.pics .tabs li:nth-of-type(1).wmItem1{
		padding: 0 11px 0 15px;
	}
	.pics .tabs li:nth-of-type(2).wmItem2{
		color: #409EFF;
		background: #fff;
	}
	.arrowDown{
		margin-left: 18px;
	}
</style>
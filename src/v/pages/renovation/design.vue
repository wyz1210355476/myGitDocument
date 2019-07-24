<template>
<div class="contents">
	<page-title :title="'页面设计'" goback>
		<el-button type="text" size="small" class="mr10" slot="backBtn" @click="backToList">返回</el-button>
	</page-title>
	<div :style="{height:height+'px'}">
		<iframe :src="stylePath+'/html/index.html?fileName='+page" id="frame" name="frame" scrolling="auto" class="frame" frameborder="0"></iframe>
	</div>
</div>
</template>
<script>
	import pageTitle from '@components/pageTitle'

	export default {
		data() {
			return {
				stylePath:__ce.designImgURL,
				height:window.screen.availHeight-220,
				page:'',
				id:''
			}
		},
		mounted() {
			document.domain = 'yun300.cn'
			this.id = this.$route.query.id || ''
			this.page = this.$route.query.fileName || ''
			//frame.conetnWindow.M.Editor.loadPage('/'+this.page+'.html');
		},
		methods: {
			backToList(){
				this.$router.push({
					name:'renovationList'
				})
			}
		},
		components: {
			pageTitle,
		}
	}
</script>
<style>
.frame{width: 100%; height: 100%}
</style>

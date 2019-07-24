<template>
	<div class="content-title">
		<el-button v-if="backStatus" type="text" size="mini" @click="gobackFun()" class="goback">返回</el-button>
		<span class="title">{{title}}</span>
		<span class="subtitle"><slot name="subtitle"></slot></span>
	</div>
</template>
<script>
	import router from '@c/router';
	export default {
		data() {
			return {
				backStatus:false
			}
		},
		methods:{
			gobackFun(){
				router.go(-1)
			}
		},
		mounted(){
			this.backStatus = this.goback !== undefined ? true : false
		},
		props: ['title','goback']
	}
</script>
<style>
.content-title{line-height: 24px; border-bottom:1px solid #eee; padding-bottom: 10px; margin-bottom: 10px;}
.content-title .goback{margin-right: 10px;}
.content-title .title{font-size:16px; color: #333; display: inline-block;}
.content-title .subtitle{font-size:12px; color: #999; display: inline-block; padding-left: 5px;}
</style>
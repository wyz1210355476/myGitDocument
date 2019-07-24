<template>
	<div class="contents">
		<page-title :title="'添加角色'"></page-title>
		<el-form ref="form" :model="form" label-width="80px">
		  <el-form-item label="角色名称" class="roleName">
		    <el-input v-model="form.name"></el-input>不超过30个字
		  </el-form-item>
		  <el-form-item label="权限资源">
				<el-checkbox-group v-model="form.type">
			      <el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
			      <el-checkbox label="地推活动" name="type"></el-checkbox>
			      <el-checkbox label="线下主题活动" name="type"></el-checkbox>
			      <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
			    </el-checkbox-group>
		  </el-form-item>
		</el-form>
		<div class="content-table">

		</div>

	</div>
</template>
<script>
	import pageTitle from '@components/pageTitle';
	import pages from '@components/pages';

	export default {
		data() {
			return {
				form:{
					name:'',
					type:[]
				}
			}
		},
		mounted() {

		},
		methods: {

		},
		components: {
			pageTitle,
			pages
		}
	}
</script>
<style>
.roleName .el-input{width: 200px;}


</style>

<template>
	<div class="contents">
		<page-title title="网站状态"></page-title>
		<el-alert
		title=""
		type="success"
		:closable="false">
		<div><i class="el-icon-warning"></i> 网站状态为前台网站的访问状态，网站暂停后不影响网站管理功能，网站暂停期仍记在运营期内。</div>
	</el-alert>
	<div class="order-form" v-loading="isLoading">
		<el-form ref="form1" label-width="150px" size="small">
			<el-form-item label="PC门户状态：" prop="mode">
				<el-radio-group v-model="status.pcStatus">
					<el-radio-button label="1">开启</el-radio-button>
					<el-radio-button label="0">暂停</el-radio-button>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="移动门户状态：" prop="mode">
				<el-radio-group v-model="status.moStatus">
					<el-radio-button label="1">开启</el-radio-button>
					<el-radio-button label="0">暂停</el-radio-button>
				</el-radio-group>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" :loading="btnLoading" @click="submitForm()" size="small">保存</el-button>
			</el-form-item>
		</el-form>
	</div>
</div>
</template>
<script>
import pageTitle from '@components/pageTitle';
import * as validator from '@c/util/validator';
export default {
	data() {
		return {
			isLoading:false,
			btnLoading:false,
			status:{
				pcStatus:'',
				moStatus:''
			}
		}
	},
	mounted() {
		this.getWebStatus()
	},
	methods: {
		getWebStatus(){
			this.isLoading = true;
			this.$api("systemSetup.getWebStatus", {}).then((result) => {
				this.isLoading = false;
				this.status.pcStatus = result.pcStatus;
				this.status.moStatus = result.moStatus;
			}, (result)=>{
				this.isLoading = false;
				this.$message({
					message: result.data.msg,
					type: 'error'
				});
			})
		},
		submitForm(){
			this.btnLoading = true;
			this.$api("systemSetup.saveWebStatus", this.status).then((result) => {
				this.$message({
					message: '保存成功',
					type: 'success'
				});
				this.btnLoading = false;
			}, (result)=>{
				this.$message({
					message: result.data.msg,
					type: 'error'
				});
				this.btnLoading = false;
			})
		}
	},
	components: {
		pageTitle
	}
}
</script>
<style>
.order-form {margin-top: 20px;}
</style>
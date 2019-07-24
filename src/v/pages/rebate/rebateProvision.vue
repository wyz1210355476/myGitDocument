<template>
	<div class="contents">
		<page-title title="推荐返利协议条款"></page-title>
		<div class="order-form">
			<el-form ref="form1" :model="form1" label-width="75px" size="small" v-loading="isLoading">
				<el-form-item label="协议条款：" prop="content">
					<custom-editor v-model="form1.content"></custom-editor>
				</el-form-item>
			</el-form>
		</div>
		<div class="btn-area left">
			<el-button type="primary" @click="save" size="small" :loading="isBtnLoading">保存</el-button>
		</div>
	</div>
</template>
<script>
	import pageTitle from '@components/pageTitle';
	import customEditor from '@components/customEditor';
	export default {
		data() {
			return {
				form1: {
					content: ''
				},
				isLoading: false,
				isBtnLoading: false
			}
		},
		mounted() {
			this.getProvisionSet();
		},
		methods: {
			//获取注册条款
			getProvisionSet() {
				this.isLoading = true;
				this.$api("rebate.getRebateProtocol").then((result) => {
					this.isLoading = false;
					this.form1.content = decodeURIComponent( result );
				}, (error) => {
					this.isLoading = false;
					if (error && error.data && error.data.status == 102) {

					} else {
						this.$message({
		                    type: 'error',
		                    message: '获取注册协议失败！'
		                });
					}
				});
			},
			//保存
			save() {
				if (this.form1.content == '') {
					this.$message({
	                    type: 'error',
	                    message: '注册协议不能为空！'
	                });
	                return;
				}
				this.isBtnLoading = true;
				this.$api("rebate.saveRebateProtocol", {protocol: encodeURIComponent( this.form1.content )}).then((result) => {
					this.isBtnLoading = false;
					this.$message({
                        type: 'success',
                        message: '保存成功!'
                    });
				}, (error) => {
					this.isBtnLoading = false;
					this.$message({
	                    type: 'error',
	                    message: '保存失败'
	                });
				});
			}
		},
		components: {
			pageTitle,
			customEditor
		}
	}
</script>
<style scoped>
	.btn-area.left {
		padding-left: 75px;
	}
</style>
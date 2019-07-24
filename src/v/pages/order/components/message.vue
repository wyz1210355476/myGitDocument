<template>
	<div class="order-form window-order-form">
		<div class="order-info info-sku">
			<div class="infos">
				<div class="info-value">
					<el-table :data="goodInfo" style="width: 100%" size="mini" v-loading="isLoading1">
						<el-table-column label="货品名称" prop="sku_name">
	            		</el-table-column>
	            		<el-table-column label="购买数量" prop="quantity">
	            		</el-table-column>
					</el-table>
				</div>
			</div>
		</div>
		<div class="order-info info-message">
			<div class="infos">
				<el-form ref="form1" :model="form1" :rules="rules" label-width="100px" size="small">
	  				<el-form-item label="给顾客内容：" prop="content" class="item-message">
	    				<el-input v-model="form1.content"></el-input>
		  				<el-button type="text" @click="submitForm('form1')" :loading="isBtnLoading">提交</el-button>
	  				</el-form-item>
	  			</el-form>
			</div>
		</div>
		<div class="order-info">
			<div class="info-title">留言记录</div>
			<div class="infos" v-loading="isLoading2">
				<ul class="remark-list" v-if="messageList.length != 0">
					<li v-for="message in messageList" :key="message.client_name">
						<span>{{message.create_time}}</span>
						<span>{{message.client_name}}</span>
						<span>留言：<span class="orange">{{message.content}}</span></span>
					</li>
				</ul>
				<div v-if="messageList.length == 0" style="line-height: 60px; text-align: center;">暂无数据</div>
			</div>
		</div>
	</div>
</template>
<script>
	import orderApi from '@c/mixins/orderApi'
	export default {
		data() {
			return {
				goodInfo: [],
				messageList: [],
				messageDialog: false,
				form1: {
					content: ''
				},
				rules: {
					// title: [
					// 	{ required: true, message: '请输入标题', trigger: 'blur' }
					// ],
					content: [
						{ required: true, message: '请输入内容', trigger: 'blur' },
						{ max: 200, message: '最多可输入200个字', trigger: 'blur'}
					]
				},
				isBtnLoading: false,
				isLoading1: false,
				isLoading2: false
			}
		},
		mixins: [orderApi],
		props: ['id'],
		mounted() {
			this.getGoodInfo();
			this.getMessageList();
		},
		methods: {
			getGoodInfo() {
				this.isLoading1 = true;
				this.$api(this.orderApi[this.$version] + ".getGoods", {orderId: this.id}).then((result) => {
					this.goodInfo = result;
					this.isLoading1 = false;
				}, (error) => {
					this.isLoading1 = false;
		          	if (error && error.data && error.data.status == 102) {

					} else {
						this.$message({
							type: 'error',
			            	message: '获取订单商品失败！'
						});
					}
				});
			},
			//获取留言信息
			getMessageList() {
				this.isLoading2 = true;
				this.$api(this.orderApi[this.$version] + ".getMessage", {orderId: this.id}).then((result) => {
					this.messageList = result;
					this.isLoading2 = false;
				}, (error) => {
					this.isLoading2 = false;
		          	if (error && error.data && error.data.status == 102) {

					} else {
						this.$message({
							type: 'error',
			            	message: '获取留言列表失败！'
						});
					}
				});
			},
			showMessageDialog() {
				this.messageDialog = true;
			},
			submitForm(formName) {
	        	this.$refs[formName].validate((valid) => {
		          	if (valid) {
		            	this.saveMessage();
		          	} else {
		            	console.log('error submit!!');
		            	return false;
		          	}
	        	});
	      	},
			saveMessage() {
				this.form1.order_id = this.id;
				this.isBtnLoading = true;
				let data = {
					message: this.form1
				}
				this.$api(this.orderApi[this.$version] + ".addMessage", data).then((result) => {
					this.$message({
		            	type: 'success',
		            	message: '留言成功!'
		        	});
					this.messageDialog = false;
					this.isBtnLoading = false;
					this.getMessageList();
				}, (error) => {
					this.$message({
		            	type: 'error',
		            	message: '留言失败！'
		          	});
		          	this.isBtnLoading = false;
				})
			}
		}
	}
</script>
<style scoped>
	.info-sku {margin-top: 20px; margin-bottom: 40px; margin-left: 20px;}
	.info-sku .info-value {margin-left: 11px; line-height: 30px; color: #999;}
	.info-message {margin-bottom: 40px;}
</style>
<style>
	.dialog-msg-customer .el-dialog__body {height: auto;}
</style>
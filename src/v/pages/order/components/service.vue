<template>
	<div class="order-form">
		<div class="order-info">
			<div class="info-title">申请售后服务的商品</div>
			<div class="infos">
				<el-table :data="goodInfo" style="width: 100%" size="mini">
					<el-table-column label="货品编号" prop="goods_no">
            		</el-table-column>
            		<el-table-column label="货品名称" prop="goods_name">
            		</el-table-column>
            		<el-table-column label="数量" prop="num">
            		</el-table-column>
				</el-table>
			</div>
		</div>
		<div class="order-info">
			<div class="info-title">详细信息</div>
			<div class="infos service-detail">
				<div class="info-left">
					<div class="info">
						<span class="info-label">订单单号：</span>
						<span class="info-value">{{order.order_number}}</span>
					</div>
					<div class="info">
						<span class="info-label">订单状态：</span>
						<span class="info-value">{{order.reply | getStatus}}</span>
					</div>
					<div class="info">
						<span class="info-label">申请售后时间：</span>
						<span class="info-value">{{order.create_time}}</span>
					</div>
					<div class="info">
						<span class="info-label">问题描述：</span>
						<span class="info-value">{{order.reason_memo}}</span>
					</div>
				</div>
				<div class="info-right floatR" v-if="order.pic && order.pic != ''">
					<div class="info">
						<span class="info-label">图片信息：</span>
						<span><img :src="order.pic" alt=""></span>
					</div>
				</div>
			</div>
		</div>
		<div class="info-box">
			<el-form ref="form1" :rules="rules" :model="form1" label-width="80px">
				<el-form-item label="店主反馈" prop="comment" class="feedback-form">
    				<el-input type="textarea" v-model="form1.comment"></el-input>
 		 		</el-form-item>
 		 		<el-button type="primary" @click="submitForm('form1')" size="small" class="btn-feedback">反馈</el-button>
			</el-form>
		</div>
		<div class="btn-area bottom">
			<el-button v-if="order.reply == '0'" type="primary" @click="showAcceptDialog" size="small">接受申请</el-button>
			<el-button v-if="order.reply != '3' && order.reply != '2'" type="primary" @click="showFinishDialog" size="small">完成</el-button>
			<el-button v-if="order.reply != '3' && order.reply != '2'" @click="showRefuseDialog" size="small" plain>拒绝</el-button>
			<el-button v-if="order.reply == '3' || order.reply == '2'" @click="cancel" size="small" plain>关闭</el-button>
		</div>
	</div>
</template>
<script>
	import orderApi from '@c/mixins/orderApi'
	export default {
		data() {
			return {
				goodInfo: [],
				order: {},
				form1: {
					id: this.id[1],
					comment: ''
				},
				rules: {
					comment: [
						{ required: true, message: '请填写反馈内容', trigger: 'blur' }
					]
				}
			}
		},
		mixins: [orderApi],
		props: ['id'],
		filters: {
			getStatus(v) {
				if (v == '0') { return '未审核'; }
				if (v == '1') { return '同意'; }
				if (v == '2') { return '拒绝'; }
				if (v == '3') { return '完成'; }
			}
		},
		mounted() {
			this.getServiceDetail();
		},
		methods: {
			getServiceDetail() {
				let data = {
					map: {
						order_id: this.id[0],
						apply_id: this.id[1]
					}
				}
				this.$api(this.orderApi[this.$version] + ".getServiceDetail", data).then((result) => {
					this.order = result;
					this.goodInfo = result.goods;
					this.form1.comment = result.comment;
				})
			},
			submitForm(formName) {
	        	this.$refs[formName].validate((valid) => {
		          	if (valid) {
		            	this.saveFeedback();
		          	} else {
		            	console.log('error submit!!');
		            	return false;
		          	}
	        	});
	      	},
			saveFeedback() {
				let data = {
					map: this.form1
				}
				this.$api(this.orderApi[this.$version] + ".addServiceFeedback", data).then((result) => {
					this.$message({
		            	type: 'success',
		            	message: '反馈成功!'
		        	});
				}, (error) => {
					this.$message({
		            	type: 'error',
		            	message: '反馈失败！'
		          	});
				});
			},
			//接受申请窗口
			showAcceptDialog() {
				this.$confirm('确定要接受申请吗？', '接受申请', {
		          	confirmButtonText: '确定',
		          	cancelButtonText: '取消',
		          	type: 'warning'
		        }).then(() => {
		        	this.acceptOrRefuseOrder(1);
		        });
			},
			//拒绝申请窗口
			showRefuseDialog() {
				this.$confirm('确定要拒绝申请吗？', '拒绝申请', {
		          	confirmButtonText: '确定',
		          	cancelButtonText: '取消',
		          	type: 'warning'
		        }).then(() => {
		        	this.acceptOrRefuseOrder(2);
		        });
			},
			//完成窗口
			showFinishDialog() {
				this.$confirm('完成后该订单将不能有任何操作,确认要执行吗?', '订单完成', {
		          	confirmButtonText: '确定',
		          	cancelButtonText: '取消',
		          	type: 'warning'
		        }).then(() => {
		        	this.acceptOrRefuseOrder(3);
		        });
			},
			//接受/拒绝/完成
			acceptOrRefuseOrder(status) {
				let msg = {
					1: {
						success: '接受申请成功!',
						error: '接受申请失败!'
					},
					2: {
						success: '拒绝申请成功!',
						error: '拒绝申请失败!'
					},
					3: {
						success: '订单完成成功!',
						error: '订单完成失败!'
					}
				}
				let data = {
					map: {
						order_id: this.id[0],
						reply: status
					}
				}
				this.$api(this.orderApi[this.$version] + ".modifyServiceOrder", data).then((result) => {
					this.$emit('close', true);
					this.$message({
		            	type: 'success',
		            	message: msg[status].success
		        	});
				}, (error) => {
					this.$message({
		            	type: 'error',
		            	message: msg[status].error
		          	});
				});
			},
			cancel() {
				this.$emit("close")
			}
		}
	}
</script>
<style>
	.feedback-form {
		display: inline-block;
		margin-left: 10px;
		width: 380px;
	}
	.feedback-form .el-textarea__inner {
		height: 90px;
	}
</style>
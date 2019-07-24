<template>
	<div class="window-order-form error-text-nowrap">
		<el-form ref="refundInfo" :model="refundInfo" :rules="rules" label-width="100px" class="order-form" size="small" v-loading="isLoading">
			<div class="info-inline">
				<el-form-item label="订单编号：">
		    		<span>{{orderInfo.no}}</span>
		  		</el-form-item>
		  		<el-form-item label="订单日期：">
		    		<span>{{orderInfo.create_time}}</span>
		  		</el-form-item>
		  		<el-form-item label="订单金额：">
		    		<span>{{orderInfo.sum_payable | toFixed(2)}}</span>
		  		</el-form-item>
		  		<el-form-item label="已付金额：">
		    		<span>{{orderInfo.paid_amount | toFixed(2)}}</span>
		  		</el-form-item>
		  		<el-form-item label="退款类型：" prop="return_type" class="return-type">
				    <el-radio-group v-model="refundInfo.return_type">
				      	<el-radio label="1">在线支付</el-radio>
				      	<el-radio label="2">线下支付</el-radio>
				      	<!-- <el-radio label="3">预存款支付</el-radio> -->
				    </el-radio-group>
				</el-form-item>
				<el-form-item label="退款平台：" prop="return_plat">
				    <el-input v-model="refundInfo.return_plat"></el-input>
				</el-form-item>
				<el-form-item label="退款账号：" prop="return_account">
				    <el-input v-model="refundInfo.return_account"></el-input>
				</el-form-item>
				<el-form-item label="手续费：" prop="fee">
				    <el-input v-model="refundInfo.fee"></el-input>
				</el-form-item>
				<el-form-item label="退款金额：" prop="money">
				    <el-input v-model="refundInfo.money"></el-input>
				</el-form-item>
				<el-form-item label="收款人：" prop="collector">
				    <el-input v-model="refundInfo.collector"></el-input>
				</el-form-item>
				<el-form-item label="收款账号：" prop="collect_account">
				    <el-input v-model="refundInfo.collect_account"></el-input>
				</el-form-item>
				<!-- <el-form-item label="扣除用户积分：" prop="deduction_integral">
				    <el-input v-model="refundInfo.deduction_integral"></el-input>
				</el-form-item> -->
				<el-form-item label="备注：" prop="remark" class="info-block">
	    			<el-input type="textarea" v-model="refundInfo.remark"></el-input>
	  			</el-form-item>
			</div>
		</el-form>
		<div class="btn-area bottom">
			<el-button @click="cancel" size="small" plain>取消</el-button>
			<el-button type="primary" @click="submitForm('refundInfo')" size="small" :loading="isBtnLoading">退款</el-button>
		</div>
	</div>
</template>
<script>
	import * as validator from '@c/util/validator';
	import orderApi from '@c/mixins/orderApi';
	export default {
		data() {
			let checkReturnMoney = (rule, value, callback) => {
        		if (parseFloat(value) > parseFloat(this.orderInfo.paid_amount)) {
        			callback(new Error());
        		} else {
        			callback();
        		}
      		};
			return {
				refundInfo: {
					return_type: '',
					fee: '',
					collector: '',
					collect_account: '',
					return_plat: '',
					return_account: '',
					money: '',
					remark: '',
					// deduction_integral: ''
				},
				orderInfo: {},
				rules: {
					return_type: [
						{ required: true, message: '请选择退款类型', trigger: 'change' }
					],
					fee: [
						{validator: validator.PositiveDecimal, message: '最多为11位数，小数点后两位', trigger: 'blur'}
					],
					collector: [
						{ required: true, message: '收款人不能为空', trigger: 'blur' },
						{ max: 30, message: '最多可输入30个字符', trigger: 'blur' },
						{ validator: validator.cnOrEnOrNumOrLineOrSpace, trigger: 'blur' }
					],
					collect_account: [
						{ required: true, message: '收款账号不能为空', trigger: 'blur' },
						{ max: 30, message: '最多可输入30个字符', trigger: 'blur' },
						{ validator: validator.cnOrEnOrNumOrLineOrSpace, trigger: 'blur' }
					],
					return_plat: [
						{ required: true, message: '退款平台不能为空', trigger: 'blur' },
						{ max: 30, message: '最多可输入30个字符', trigger: 'blur' },
						{ validator: validator.cnOrEnOrNumOrLineOrSpace, trigger: 'blur' }
					],
					return_account: [
						{ required: true, message: '退款账号不能为空', trigger: 'blur' },
						{ max: 30, message: '最多可输入30个字符', trigger: 'blur' },
						{ validator: validator.cnOrEnOrNumOrLineOrSpace, trigger: 'blur' }
					],
					money: [
						{ required: true, message: '退款金额不能为空', trigger: 'blur' },
						{ validator: validator.NotNegativeNum, message: '退款金额必须大于0', trigger: 'blur' },
						{ validator: checkReturnMoney, message: '退款金额不能大于订单实付金额', trigger: 'blur' },
						{validator: validator.Decimal, message: '最多为11位数，小数点后两位', trigger: 'blur'}
					],
					remark: [
						{max: 200, message: '最多可输入200个字符', trigger: 'blur'}
					],
					// deduction_integral: []
				},
				isLoading: false,
				isBtnLoading: false
			}
		},
		mixins: [orderApi],
		props: ['id'],
		mounted() {
			this.getRefundDetail();
		},
		methods: {
			//获取退款信息
			getRefundDetail() {
				// let order_id = {
				// 	"map[0][key]": "id",
				// 	"map[0][logic]": "eq",
				// 	"map[0][value]": this.id
				// }
				this.isLoading = true;
				this.$api(this.orderApi[this.$version] + ".getOrderDetail", {orderId: this.id}).then((result) => {
					this.orderInfo = result;
					this.isLoading = false;
				}, (error) => {
					this.isLoading = false;
					this.$message({
		            	type: 'error',
		            	message: '获取订单信息失败！'
		          	});
				});
			},
			submitForm(formName) {
	        	this.$refs[formName].validate((valid) => {
		          	if (valid) {
		            	this.submitRefundDetail();
		          	} else {
		            	console.log('error submit!!');
		            	return false;
		          	}
	        	});
	      	},
			//保存
			submitRefundDetail() {
				this.refundInfo.order_id = this.id;
				this.refundInfo.no = this.orderInfo.no;
				this.refundInfo.client_id = this.orderInfo.client_id;
				this.refundInfo.order_money = this.orderInfo.sum_payable;
				this.refundInfo.pay_money = this.orderInfo.paid_amount;
				this.isBtnLoading = true;
				this.$api(this.orderApi[this.$version] + ".addRefundOrder", this.refundInfo).then((result) => {
					this.$message({
		            	type: 'success',
		            	message: '退款成功!'
		        	});
		        	this.$emit('close', true);
		        	this.isBtnLoading = false;
				}, (error) => {
					this.$message({
		            	type: 'error',
		            	message: '退款失败！'
		          	});
		          	this.isBtnLoading = false;
				});
			},
			cancel() {
				this.$emit("close")
			}
		}
	}
</script>
<style>
	.return-type .el-radio {
		margin-right: 30px;
	}
	.return-type .el-radio+.el-radio {
		margin-left: 0;
		margin-right: 0;
	}
</style>
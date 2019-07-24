<template>
	<div class="window-order-form error-text-nowrap">
		<el-form ref="form1" :model="form1" :rules="rules" label-width="100px" class="order-form" size="small" v-loading="isLoading">
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
		  		<el-form-item label="已收金额：">
		    		<span>{{orderInfo.paid_amount | toFixed(2)}}</span>
		  		</el-form-item>
		  		<el-form-item label="收款方式：" prop="charged_bank"><!--收款银行-->
				    <el-input v-model="form1.charged_bank"></el-input>
				</el-form-item>
				<el-form-item label="收款账号：" prop="charged_account">
				    <el-input v-model="form1.charged_account"></el-input>
				</el-form-item>
				<el-form-item label="收款金额：" prop="charged_sum">
				    <el-input v-model="form1.charged_sum" readonly></el-input>
				</el-form-item>
				<el-form-item label="收款人：">
				    <span>{{orderInfo.charged_user}}</span>
				</el-form-item>
				<el-form-item label="付款方式：" prop="pay_type" class="radio-pay-type">
				    <el-radio-group v-model="form1.pay_type">
				      	<el-radio v-for="item in payTypeList" :label="item.id" :key="item.id">{{item.name}}</el-radio>
				    </el-radio-group>
				</el-form-item>
				<el-form-item label="支付方式：" prop="pay_way">
	    			<el-select v-model="form1.pay_way" placeholder="请选择支付方式">
	    				<el-option v-for="item in payWayList" :label="item.name" :value="item.id" :key="item.id"></el-option>
	    			</el-select>
	  			</el-form-item>
	  			<el-form-item label="付款人：" prop="pay_user">
				    <el-input v-model="form1.pay_user"></el-input>
				</el-form-item>
				<!-- <el-form-item label="是否开票：" class="info-block">
				    <span>{{invoice.title && invoice.title != '' ? '是' : '否'}}</span>
				</el-form-item>
				<el-form-item label="发票抬头：" v-if="invoice.title && invoice.title != ''">
				    <span>{{invoice.title}}</span>
				</el-form-item>
				<el-form-item label="发票内容：" v-if="invoice.name && invoice.name != ''">
				    <span>{{invoice.name}}</span>
				</el-form-item> -->
				<el-form-item label="收款单备注：" prop="remark" class="info-block">
	    			<el-input type="textarea" v-model="form1.remark"></el-input>
	  			</el-form-item>
			</div>
		</el-form>
		<div class="btn-area bottom">
			<el-button @click="cancel" size="small" plain>取消</el-button>
			<el-button type="primary" @click="submitForm('form1')" size="small" :loading="isBtnLoading">确认</el-button>
		</div>
	</div>
</template>
<script>
	import * as validator from '@c/util/validator';
	import orderApi from '@c/mixins/orderApi';
	export default {
		data() {
			return {
				orderInfo: {},
				invoice: {},
				payWayList: [],
				payTypeList: [
					{id: '1', name: '在线支付'},
					{id: '2', name: '线下支付'}
				],
				form1: {
					charged_bank: '',
					charged_sum: '',
					charged_account: '',
					pay_type: '1',
					pay_way: '',
					pay_user: '',
					remark: ''
				},
				rules: {
					charged_bank: [
						{ required: true, message: '收款方式不能为空', trigger: 'blur' },
						{ max: 30, message: '最多可输入30个字符', trigger: 'blur' },
						{ validator: validator.cnOrEnOrNumOrLineOrSpace, trigger: 'blur' }
					],
					// charged_sum: [
					// 	{ required: true, message: '收款金额不能为空', trigger: 'blur' },
					// 	{ validator: validator.NotNegativeNum, message: '收款金额必须大于0', trigger: 'blur' }
					// ],
					charged_account: [
						{ required: true, message: '收款账号不能为空', trigger: 'blur' },
						{ max: 30, message: '最多可输入30个字符', trigger: 'blur' },
						{ validator: validator.cnOrEnOrNumOrLineOrSpace, trigger: 'blur' }
					],
					pay_type: [
						{ required: true, message: '请选择付款方式', trigger: 'change' }
					],
					// pay_way: [
					// 	{ required: true, message: '请选择支付方式', trigger: 'change' }
					// ],
					pay_user: [
						{ required: true, message: '付款人不能为空', trigger: 'blur' },
						{ max: 30, message: '最多可输入30个字符', trigger: 'blur' },
						{ validator: validator.cnOrEnOrNumOrLineOrSpace, trigger: 'blur' }
					],
					remark: [
						{ max: 200, message: '最多可输入200个字符', trigger: 'blur' }
					]
				},
				isLoading: false,
				isBtnLoading: false
			}
		},
		mixins: [orderApi],
		props: ['id'],
		mounted() {
			this.getOrderInfo();
			this.getPayType();
		},
		methods: {
			//获取付款信息
			getOrderInfo() {
				// let order_id = {
				// 	"map[0][key]": "id",
				// 	"map[0][logic]": "eq",
				// 	"map[0][value]": this.id
				// }
				this.isLoading = true;
				this.$api(this.orderApi[this.$version] + ".getOrderDetail", {orderId: this.id}).then((result) => {
					result.charged_user = '';
					this.orderInfo = result;
					this.form1.pay_way = parseInt(result.payment_type_id);
					this.form1.charged_sum = result.sum_payable;
					// this.invoice = result.invoice_info == null ? {title: '', name: ''} : result.invoice_info;
					this.getLoginInfo();
					this.isLoading = false;
				}, (error) => {
					this.isLoading = false;
					this.$message({
		            	type: 'error',
		            	message: '获取订单信息失败！'
		          	});
				});
			},
			//获取支付方式
			getPayType() {
				this.$api(this.orderApi[this.$version] + ".getPayType").then((result) => {
					this.payWayList = result.list;
				}, (error) => {
		          	if (error && error.data && error.data.status == 102) {

					} else {
						this.$message({
			            	type: 'error',
			            	message: '获取支付方式失败！'
			          	});
					}
				});
			},
			//获取管理员信息
			getLoginInfo() {
				this.$api(this.orderApi[this.$version] + ".getLoginInfo").then((result) => {
					this.orderInfo.charged_user = result.user;
				}, (error) => {
					this.$message({
		            	type: 'error',
		            	message: '获取管理员信息失败！'
		          	});
				});
			},
			submitForm(formName) {
	        	this.$refs[formName].validate((valid) => {
		          	if (valid) {
		            	this.submitPayDetail();
		          	} else {
		            	console.log('error submit!');
		            	return false;
		          	}
	        	});
	      	},
			//提交
			submitPayDetail() {
				this.form1.order_id = this.id;
				this.form1.client_id = this.orderInfo.client_id;
				this.form1.no = this.orderInfo.no;
				this.form1.order_sum = parseFloat(this.orderInfo.sum_payable);
				// this.form1.pay_time = Date.parse(new Date());
				// console.log(this.form1.pay_time)
				// this.form1.paid_amount = parseFloat(this.orderInfo.paid_amount);
				this.form1.charged_user = this.orderInfo.charged_user;
				let index = this.payWayList.findIndex(n => n.id == this.form1.pay_way);
				if (index > -1) {
					this.form1.pay_way_name = this.payWayList[index].name;
				}
				this.isBtnLoading = true;
				this.$api(this.orderApi[this.$version] + ".addPayOrder", this.form1).then((result) => {
					this.$message({
		            	type: 'success',
		            	message: '确认收款成功!'
		        	});
		        	this.$emit('close', true);
		        	this.isBtnLoading = false;
				}, (error) => {
					this.$message({
		            	type: 'error',
		            	message: '确认收款失败！'
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
	.radio-pay-type .el-radio {margin-right: 30px;}
	.radio-pay-type .el-radio+.el-radio {margin-left: 0;}
</style>
<template>
	<div class="order-form window-order-form">
		<div class="info-inline" v-loading="isLoading">
			<div class="info">
				<span class="info-label">收款单号：</span>
				<span class="info-value">{{orderInfo.trade_no}}</span>
			</div>
			<div class="info">
				<span class="info-label">订单号：</span>
				<span class="info-value">{{orderInfo.no}}</span>
			</div>
			<div class="info">
				<span class="info-label">支付方式：</span>
				<span class="info-value">{{orderInfo.pay_way_name}}</span>
			</div>
			<div class="info">
				<span class="info-label">生成时间：</span>
				<span class="info-value">{{orderInfo.create_time}}</span>
			</div>
			<div class="info">
				<span class="info-label">收款银行：</span>
				<span class="info-value">{{orderInfo.charged_bank}}</span>
			</div>
			<div class="info">
				<span class="info-label">收款账号：</span>
				<span class="info-value">{{orderInfo.charged_account}}</span>
			</div>
			<div class="info">
				<span class="info-label">付款时间：</span>
				<span class="info-value">{{orderInfo.pay_time}}</span>
			</div>
			<div class="info">
				<span class="info-label">付款金额：</span>
				<span class="info-value">{{orderInfo.payment_sum | toFixed(2)}}</span>
			</div>
			<div class="info">
				<span class="info-label">付款人：</span>
				<span class="info-value">{{orderInfo.pay_user}}</span>
			</div>
			<div class="info">
				<span class="info-label">操作员：</span>
				<span class="info-value">{{orderInfo.charged_user}}</span>
			</div>
			<!-- <div class="info">
				<span class="info-label">操作员：</span>
				<span class="info-value">{{orderInfo.charged_user}}</span>
			</div> -->
			<div class="info info-block">
				<span class="info-label">备注：</span>
				<span class="info-value">{{orderInfo.remark}}</span>
			</div>
		</div>
		<div class="btn-area bottom">
			<el-button @click="cancel" size="small" plain>关闭</el-button>
		</div>
	</div>
</template>
<script>
	import * as validator from '@c/util/validator';
	import orderApi from '@c/mixins/orderApi';
	// let allPayTypeList = [];
	export default {
		data() {
			return {
				orderInfo: {},
				isLoading: false
			}
		},
		mixins: [orderApi],
		props: ['id'],
		// filters: {
		// 	getPayType(v) {
		// 		let index = allPayTypeList.findIndex((n) => n.id === parseInt(v));
		// 		if (index > -1) {
		// 			return allPayTypeList[index].name;
		// 		} else {
		// 			return '';
		// 		}
		// 	}
		// },
		mounted() {
			this.getPayDetail();
			// this.getPayTypeList();
		},
		methods: {
			//获取退款信息
			getPayDetail() {
				this.isLoading = true;
				this.$api(this.orderApi[this.$version] + ".getPayDetail", {orderId: this.id}).then((result) => {
					this.orderInfo = result;
					this.isLoading = false;
				}, (error) => {
					this.isLoading = false;
					this.$message({
		            	type: 'error',
		            	message: '获取收款单信息失败!'
		        	});
				});
			},
			//获取支付方式
			// getPayTypeList() {
			// 	this.$api(this.orderApi[this.$version] + ".getPayType").then((result) => {
			// 		allPayTypeList = result;
			// 	}, (error) => {

			// 	});
			// }
			cancel() {
				this.$emit("close")
			}
		}
	}
</script>
<style>

</style>
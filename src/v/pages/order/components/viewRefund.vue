<template>
	<div class="order-form window-order-form">
		<div class="info-inline" v-loading="isLoading">
			<div class="info">
				<span class="info-label">订单编号：</span>
				<span class="info-value">{{orderInfo.no}}</span>
			</div>
			<div class="info">
				<span class="info-label">订单日期：</span>
				<span class="info-value">{{orderInfo.create_time}}</span>
			</div>
	  		<div class="info">
				<span class="info-label">订单金额：</span>
				<span class="info-value">{{orderInfo.order_money | toFixed(2)}}</span>
			</div>
	  		<div class="info">
				<span class="info-label">已付金额：</span>
				<span class="info-value">{{orderInfo.pay_money | toFixed(2)}}</span>
			</div>
	  		<div class="info">
				<span class="info-label">退款类型：</span>
				<span class="info-value">{{orderInfo.return_type | getReturnType}}</span>
			</div>
	  		<div class="info">
				<span class="info-label">退款平台：</span>
				<span class="info-value">{{orderInfo.return_plat}}</span>
			</div>
			<div class="info">
				<span class="info-label">手续费：</span>
				<span class="info-value">{{orderInfo.fee | toFixed(2)}}</span>
			</div>
			<div class="info">
				<span class="info-label">退款账号：</span>
				<span class="info-value">{{orderInfo.return_account}}</span>
			</div>
			<div class="info">
				<span class="info-label">退款金额：</span>
				<span class="info-value">{{orderInfo.money | toFixed(2)}}</span>
			</div>
			<div class="info">
				<span class="info-label">收款人：</span>
				<span class="info-value">{{orderInfo.collector}}</span>
			</div>
			<div class="info">
				<span class="info-label">收款账号：</span>
				<span class="info-value">{{orderInfo.collect_account}}</span>
			</div>
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
	export default {
		data() {
			return {
				orderInfo: {},
				isLoading: false
			}
		},
		filters: {
			getReturnType(v) {
				if (v == '1') { return '在线支付'; }
				if (v == '2') { return '线下支付'; }
				// if (v == '3') { return '预存款支付'; }
			}
		},
		props: ['id'],
		mixins: [orderApi],
		mounted() {
			this.getRefundDetail();
		},
		methods: {
			//获取退款信息
			getRefundDetail() {
				this.isLoading = true;
				this.$api(this.orderApi[this.$version] + ".getRefundDetailById", {id: this.id}).then((result) => {
					this.orderInfo = result;
					this.isLoading = false;
				}, (error) => {
					this.isLoading = false;
					this.$message({
		            	type: 'error',
		            	message: '获取退款单信息失败!'
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

</style>
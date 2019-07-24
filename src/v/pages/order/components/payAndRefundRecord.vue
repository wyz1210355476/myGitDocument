<template>
	<div class="order-form">
		<div class="order-info" v-loading="isLoading1">
			<div class="info-title">付款记录</div>
			<div class="infos info-inline" v-if="payRecord.payment_sum">
				<div class="info">
					<span class="info-label">单据日期：</span>
					<span class="info-value">{{payRecord.create_time}}</span>
				</div>
				<div class="info">
					<span class="info-label">支付金额：</span>
					<span class="info-value">{{payRecord.payment_sum | toFixed(2)}}</span>
				</div>
	            <div class="info">
					<span class="info-label">支付方式：</span>
					<span class="info-value">{{payRecord.pay_way_name}}</span>
				</div>
	            <div class="info">
					<span class="info-label">状态：</span>
					<span class="info-value orange">{{payRecord.pay_status | getPayStatus}}</span>
				</div>
			</div>
			<div class="no-record-tip" v-if="!payRecord.payment_sum">
				暂无支付记录
			</div>
		</div>
		<div class="order-info" v-loading="isLoading2">
			<div class="info-title">退款记录</div>
			<div class="infos info-inline" v-if="refundRecord.money">
				<div class="info">
					<span class="info-label">单据日期：</span>
					<span class="info-value">{{refundRecord.create_time}}</span>
				</div>
				<div class="info">
					<span class="info-label">退款金额：</span>
					<span class="info-value">{{refundRecord.money | toFixed(2)}}</span>
				</div>
	            <div class="info">
					<span class="info-label">退款方式：</span>
					<span class="info-value">{{refundRecord.return_type | getRefundType}}</span>
				</div>
	           <div class="info">
					<span class="info-label">状态：</span>
					<span class="info-value orange">{{refundRecord.return_status | getRefundStatus}}</span>
				</div>
			</div>
			<div class="no-record-tip" v-if="!refundRecord.money">
				暂无退款记录
			</div>
		</div>
	</div>
</template>
<script>
	import orderApi from '@c/mixins/orderApi'
	export default {
		data() {
			return {
				payRecord: {},
				refundRecord: {},
				isLoading1: false,
				isLoading2: false
			}
		},
		mixins: [orderApi],
		props: {
			id: {
				type: [String, Number],
				required: true
			}
		},
		filters: {
			getPayStatus(v) {
				if (v == "0") { return '支付失败'; }
				if (v == "1") { return '支付成功'; }
			},
			getRefundStatus(v) {
				if (v == "0") { return '退款失败'; }
				if (v == "1") { return '退款成功'; }
			},
			getRefundType(v) {
				if (v == "1") { return '在线支付'; }
				if (v == "2") { return '线下支付'; }
				if (v == "3") { return '预存款支付'; }
			}
		},
		mounted() {
			this.getPayDetail();
			this.getRefundDetail();
		},
		methods: {
			getPayDetail() {
				this.isLoading1 = true;
				this.$api(this.orderApi[this.$version] + ".getPayDetail", {orderId: this.id}).then((result) => {
					this.payRecord = result;
					this.isLoading1 = false;
				}, (error) => {
					this.isLoading1 = false;
					if (error && error.data && error.data.status == 102) {

					} else {
						this.$message({
			            	type: 'error',
			            	message: '获取支付记录出错'
			          	});
					}
				});
			},
			getRefundDetail() {
				this.isLoading2 = true;
				this.$api(this.orderApi[this.$version] + ".getRefundDetail", {orderId: this.id}).then((result) => {
					this.refundRecord = result;
					this.isLoading2 = false;
				}, (error) => {
					this.isLoading2 = false;
					if (error && error.data && error.data.status == 102) {

					} else {
						this.$message({
			            	type: 'error',
			            	message: '获取退款记录出错'
			          	});
					}
				});
			}
		}
	}
</script>
<style scoped>
	.no-record-tip {
		height: 72px;
		text-align: center;
		line-height: 72px;
	}
</style>
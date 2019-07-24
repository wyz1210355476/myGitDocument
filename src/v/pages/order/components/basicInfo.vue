<template>
	<div class="order-form">
		<div class="order-info">
			<div class="info-title">订单信息</div>
			<div class="infos info-inline">
				<div class="info">
					<span class="info-label">商品总额：</span>
					<span class="info-value">{{orderInfo.sku_sum_payable | toFixed(2)}}</span>
				</div>
				<div class="info">
					<span class="info-label">配送费用：</span>
					<span class="info-value">{{orderInfo.freight | toFixed(2)}}</span>
				</div>
            	<div class="info">
					<span class="info-label">订单调整金额：</span>
					<span class="info-value">{{orderInfo.derate_expenses | toFixed(2)}}</span>
				</div>
				<div class="info" v-if="$appList.CESHOP_RETURN && orderInfo.usedRebate == 0">
					<span class="info-label">获取返利：</span>
					<span class="info-value">{{orderInfo.rebate_total || 0}}</span>
				</div>
				<div class="info">
					<span class="info-label">活动立减：</span>
					<span class="info-value">{{orderInfo.promotion_money | toFixed(2)}}</span>
				</div>
				<div class="info">
					<span class="info-label">优惠券：</span>
					<span class="info-value">{{orderInfo.coupon_money | toFixed(2)}}</span>
				</div>
				<div class="info" v-if="$appList.CESHOP_RETURN && orderInfo.usedRebate != 0">
					<span class="info-label">使用返利：</span>
					<span class="info-value">{{orderInfo.usedRebate}}</span>
				</div>
            	<div class="info">
					<span class="info-label">订单总额：</span>
					<span class="info-value orange">{{orderInfo.sum_payable | toFixed(2)}}</span>
				</div>
			</div>
		</div>
		<div class="order-info">
			<div class="info-title">收货人信息</div>
			<div class="infos">
				<div class="info info-address-invoice">
					<span class="info-value">
						<span>{{orderInfo.consignee_name}}</span>
						<span v-if="$version === 'neimao'">{{orderInfo.consignee_province | tranToAddr(orderInfo.consignee_city, orderInfo.consignee_county)}}</span>
						<span v-if="$version === 'waimao'">{{orderInfo.consignee_state_name}}</span>
						<span>{{orderInfo.consignee_addr}}</span>
						<span>{{orderInfo.consignee_zip}}</span>
						<span>{{orderInfo.consignee_email}}</span>
					</span>
				</div>
			</div>
		</div>
		<div class="order-info">
			<div class="info-title">配送信息</div>
			<div class="infos info-inline">
				<div class="info">
					<span class="info-label">配送方式：</span>
					<span class="info-value">{{orderInfo.logistics_name}}</span>
				</div>
				<div class="info">
					<span class="info-label">商品重量：</span>
					<span class="info-value">{{orderInfo.weight}}kg</span>
				</div>
            	<div class="info">
					<span class="info-label">支付方式：</span>
					<span class="info-value">{{orderInfo.payment_type_name}}</span>
				</div>
			</div>
		</div>
		<div class="order-info">
			<div class="info-title">购买人信息</div>
			<div class="infos info-inline">
				<div class="info">
					<span class="info-label">客户名称：</span>
					<span class="info-value">{{clientInfo.loginid}}</span>
				</div>
				<div class="info">
					<span class="info-label">姓名：</span>
					<span class="info-value">{{clientInfo.truename}}</span>
				</div>
            	<div class="info">
					<span class="info-label">电话：</span>
					<span class="info-value">{{clientInfo.mobile}}</span>
				</div>
            	<!-- <div class="info">
					<span class="info-label">地区：</span>
					<span class="info-value"></span>
				</div> -->
            	<div class="info">
					<span class="info-label">Email：</span>
					<span class="info-value">{{clientInfo.email}}</span>
				</div>
			</div>
		</div>
		<!-- <div class="order-info">
			<div class="info-title">发票信息</div>
			<div class="infos">
				<div class="info info-address-invoice">
					<span class="info-value" v-if="!braceInfo.title || !braceInfo.name">
						<span>不开发票</span>
					</span>
					<span class="info-value" v-if="braceInfo.title && braceInfo.name">
						<span>普通发票</span>
						<span>{{braceInfo.title}}</span>
						<span>{{braceInfo.name}}</span>
					</span>
				</div>
			</div>
		</div> -->
		<remark :id="id" :addable="false" type="customer" :showCancelBtn="false"></remark>
	</div>
</template>
<script>
	import remark from './remark.vue';
	import orderApi from '@c/mixins/orderApi'
	let shipTypeList = [];
	export default {
		data() {
			return {
				orderInfo: {},
				braceInfo: {},
				clientInfo: {},
				remarkList: []
			}
		},
		mixins: [orderApi],
		props: ['id'],
		// filters: {
		// 	getShipType(v) {
		// 		let index = shipTypeList.findIndex((n) => n.id == v);
		// 		if (index > -1) {
		// 			return shipTypeList[index].name;
		// 		} else {
		// 			return '';
		// 		}
		// 	}
		// },
		mounted() {
			this.getOrderInfo();
			// this.getShipType();
		},
		methods: {
			//获取基本信息
			getOrderInfo() {
				// let order_id = {
				// 	"map[0][key]": "id",
				// 	"map[0][logic]": "eq",
				// 	"map[0][value]": this.id
				// }
				this.$api(this.orderApi[this.$version] + ".getOrderDetail", {orderId: this.id}).then((result) => {
					result.usedRebate = result.usedRebate ? Math.abs(result.usedRebate) : 0;
					this.orderInfo = result;
					let promotionInfo = result.promotion_info;
					let isHasPromotion = promotionInfo && JSON.parse(promotionInfo);
					this.orderInfo.promotion_money = isHasPromotion ? JSON.parse(promotionInfo).promotion_money : 0;
					this.orderInfo.coupon_money = isHasPromotion ? JSON.parse(promotionInfo).coupon_money : 0;
					this.orderInfo.proFreight = isHasPromotion ? JSON.parse(promotionInfo).freight : 0;
					
					var sku_sum_payable = 0;
					result.goods.forEach((good) => {
						sku_sum_payable += parseFloat(good.sku_price) * parseInt(good.quantity);
					});
					this.orderInfo.sku_sum_payable = sku_sum_payable;
					// let promotionInfo = JSON.parse(result.promotion_info);
					// if (promotionInfo && promotionInfo.sku_sum_price && promotionInfo.sku_sum_price.sku_sum_price) {
					// 	this.orderInfo.sku_sum_payable = promotionInfo.sku_sum_price.sku_sum_price;
						// this.orderInfo.already_derate_expenses = parseFloat(promotionInfo.sku_sum_price.discount) + parseFloat(promotionInfo.freight.discount);
					// } else {
					// this.orderInfo.sku_sum_payable = parseFloat(this.orderInfo.sum_payable) - parseFloat(this.orderInfo.freight) + parseFloat(this.orderInfo.derate_expenses) + parseInt(this.orderInfo.usedRebate);
					// }
					// this.braceInfo = result.invoice_info == null ? {title: '', name: ''} : result.invoice_info;
					this.getClientInfo();
					// this.getUsedRebate();
				}, (error) => {

				});
			},
			//获取消费的返利金额
			// getUsedRebate() {
			// 	this.$api(this.orderApi[this.$version] + ".getUsedRebate", {orderId: this.id, bapatypeId: 2}).then((result) => {
			// 		if (result && result.length) {
			// 			this.orderInfo.usedRebate = result[0].history_balance;
			// 		}
			// 	}, (error) => {
			// 		if (error && error.data && error.data.status == 102) {
			// 			this.orderInfo.usedRebate = 0;
			// 		} else {
			// 			this.$message({
			// 				type: 'error',
			//             	message: '获取消费的返利金额失败'
			// 			});
			// 		}
			// 	});
			// },
			//获取购买人（客户）信息
			getClientInfo() {
				this.$api("member.viewMember", {uid: ""+this.orderInfo.client_id}).then((result) => {
					this.clientInfo = result;
				}, (error) => {

				});
			},
			//获取配送方式
			// getShipType() {
			// 	this.$api(this.orderApi[this.$version] + ".getShipType").then((result) => {
			// 		shipTypeList = result.list;
			// 	}, (error) => {

			// 	});
			// }
		},
		components: {
			remark
		}
	}
</script>
<style scoped>
	.info.info-address-invoice {margin-left: 30px;}
	.info.info-address-invoice .info-value span {margin-right: 5px;}
</style>
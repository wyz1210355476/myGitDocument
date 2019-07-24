<template>
	<div class="order-form">
		 <!-- <page-title :title="'查看订单'"></page-title> -->
		 <tab-filter :options="options" @click="getTypeParam" param="tab" norouter="true"></tab-filter>
		 <div class="order-info">
		 	<basic-info :id="id" v-if="activeOption == '1'"></basic-info>
		 	<order-goods :id="id" v-if="activeOption == '2'"></order-goods>
		 	<pay-refund :id="id" v-if="activeOption == '3'"></pay-refund>
		 	<deliv-return :id="id" v-if="activeOption == '4'"></deliv-return>
		 	<remark :id="id" v-if="activeOption == '5'" :showCancelBtn="false"></remark>
		 	<order-logs :id="id" v-if="activeOption == '6'"></order-logs>
		 	<message :id="id" v-if="activeOption == '7'"></message>
		 </div>
		 <div class="btn-area bottom">
			<el-button @click="cancel" size="small" plain>关闭</el-button>
		</div>
	</div>
</template>
<script>
	import pageTitle from '@components/pageTitle';
	import tabFilter from '@components/tabFilter';
	import basicInfo from './basicInfo';
	import remark from './remark';
	import message from './message';
	import payRefund from './payAndRefundRecord';
	import delivReturn from './delivAndReturnRecord';
	import orderGoods from './orderGoods';
	import orderLogs from './orderLogs';
	export default {
		data() {
			return {
				options: [
					{label: "基本信息", name: "1"},
					{label: "商品信息", name: "2"},
					{label: "支付记录", name: "3"},
					{label: "发退货记录", name: "4"},
					{label: "订单备注", name: "5"},
					{label: "订单日志", name: "6"},
					{label: "顾客留言", name: "7"}
				],
				activeOption: '1',
				record: []
			}
		},
		props: ['id'],
		mounted() {
			console.log(this.id);
			debugger
			this.getTypeParam("1");
		},
		methods: {
			getTypeParam(msg) {
				this.activeOption = msg;
			},
			cancel() {
				this.$emit("close")
			}
		},
		components: {
			basicInfo,
			remark,
			message,
			pageTitle,
			tabFilter,
			payRefund,
			delivReturn,
			orderGoods,
			orderLogs
		}
	}
</script>
<style>

</style>
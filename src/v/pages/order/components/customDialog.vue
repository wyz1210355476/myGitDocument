<template>
	<div>
		<el-dialog
		  	:title="activeTitle"
		  	:visible.sync="visible"
		  	width="800px">
		  	<div v-if="visible" :is="activeModule" :id="id" @close="closeCustomDialog"></div><!--  :type='activeType' -->
		</el-dialog>
	</div>
</template>
<script>
	import remark from './remark';
	import delivery from './delivery';
	import viewDelivery from './viewDelivery';
	import returnM from './return';
	import viewReturn from './viewReturn';
	import refund from './refund';
	import viewRefund from './viewRefund';
	import pay from './pay';
	import viewPay from './viewPay';
	import viewDetail from './view';
	import service from './service';
	import dialogVisibility from '@c/mixins/dialogVisibility';

	let configure = {
		view: {
			title: '查看',
			module: 'viewDetail'
		},
		pay: {
			title: '确认收款',
			module: 'pay'
		},
		payDetail: {
			title: '查看支付单',
			module: 'viewPay'
		},
		refund: {
			title: '退款',
			module: 'refund'
		},
		refundDetail: {
			title: '查看退款单',
			module: 'viewRefund'
		},
		delivery: {
			title: '发货',
			module: 'delivery',
			// type: 'delivery'
		},
		deliveryDetail: {
			title: '查看发货单',
			module: 'viewDelivery',
			// type: 'viewDelivery'
		},
		return: {
			title: '退货',
			module: 'returnM',
			// type: 'return'
		},
		returnDetail: {
			title: '查看退货单',
			module: 'viewReturn',
			// type: 'viewReturn'
		},
		remark: {
			title: '订单备注',
			module: 'remark'
		},
		service: {
			title: '查看售后单',
			module: 'service'
		}
	}

	export default {
		data() {
			return {

			}
		},
		mixins: [dialogVisibility],
		props: ['id', 'module'],
		computed: {
			activeTitle() {
				return configure[this.module].title;
			},
			activeModule() {
				return configure[this.module].module;
			},
			// activeType() {
			// 	return configure[this.module].type ? configure[this.module].type : '';
			// }
		},
		methods: {
			closeCustomDialog(msg) {
				this.visible = false;
				if (msg) {
					this.$emit('update');
				}
			}
		},
		components: {
			remark,
			delivery,
			viewDelivery,
			returnM,
			viewReturn,
			refund,
			viewRefund,
			pay,
			viewPay,
			viewDetail,
			service
		}
	}
</script>
<style>

</style>
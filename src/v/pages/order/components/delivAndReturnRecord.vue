<template>
	<div class="order-form">
		<div class="order-info">
			<div class="info-title">发货记录</div>
			<div class="infos">
				<el-table :data="deliveryRecord" style="width: 100%" size="mini" v-loading="isLoading1">
			 		<el-table-column label="单据日期" prop="create_time">
	            	</el-table-column>
	            	<el-table-column label="发货单号" prop="no">
	            	</el-table-column>
	            	<el-table-column label="物流单号" prop="tracking_number">
	            	</el-table-column>
	            	<el-table-column label="收件人" prop="consignee_name">
	            	</el-table-column>
	            	<el-table-column label="配送方式" prop="logistics_name">
	            	</el-table-column>
			 	</el-table>
			</div>
		</div>
		<div class="order-info">
			<div class="info-title">退货记录</div>
			<div class="infos">
				<el-table :data="returnRecord" style="width: 100%" size="mini" v-loading="isLoading2">
			 		<el-table-column label="单据日期" prop="create_time">
	            	</el-table-column>
	            	<el-table-column label="退货单号" prop="no">
	            	</el-table-column>
	            	<el-table-column label="物流单号" prop="tracking_number">
	            	</el-table-column>
	            	<el-table-column label="退货人" prop="consigner_name">
	            	</el-table-column>
	            	<el-table-column label="配送方式" prop="logistics_name">
	            	</el-table-column>
			 	</el-table>
			</div>
		</div>
	</div>
</template>
<script>
	import orderApi from '@c/mixins/orderApi'
	export default {
		data() {
			return {
				deliveryRecord: [],
				returnRecord: [],
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
		mounted() {
			this.getDeliveryDetail();
			this.getReturnDetail();
		},
		methods: {
			getDeliveryDetail() {
				let where = [{
					key: 'order_id',
					logic: 'eq',
					value: this.id
				}]
				let data = {
					sendGoods: encodeURIComponent(JSON.stringify(where))
				}
				this.isLoading1 = true;
				this.$api(this.orderApi[this.$version] + ".getDeliveryList", data).then((result) => {
					this.deliveryRecord = result.list;
					this.isLoading1 = false;
				}, (error) => {
					this.deliveryRecord = [];
					this.isLoading1 = false;
					if (error && error.data && error.data.status == 102) {

					} else {
						this.$message({
			            	type: 'error',
			            	message: '加载数据出错'
			          	});
					}
				});
			},
			getReturnDetail() {
				let where = [{
					key: 'order_id',
					logic: 'eq',
					value: this.id
				}]
				let data = {
					returnGoods: encodeURIComponent(JSON.stringify(where))
				}
				this.isLoading2 = true;
				this.$api(this.orderApi[this.$version] + ".getReturnList", data).then((result) => {
					this.returnRecord = result.list;
					this.isLoading2 = false;
				}, (error) => {
					this.returnRecord = [];
					this.isLoading2 = false;
					if (error && error.data && error.data.status == 102) {

					} else {
						this.$message({
			            	type: 'error',
			            	message: '加载数据出错'
			          	});
					}
				});
			},
		}
	}
</script>
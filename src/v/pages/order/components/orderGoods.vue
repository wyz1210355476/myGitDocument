<template>
	<div>
		<el-table :data="goodInfo" style="width: 100%" size="mini" v-loading="isLoading" class="table-one-line">
	 		<el-table-column label="货品编号" width="100">
	 			<template slot-scope="scope">
            		<div class="one-line" :title="scope.row.sku_bn">{{scope.row.sku_bn}}</div>
            	</template>
        	</el-table-column>
        	<el-table-column label="货品名称">
        		<template slot-scope="scope">
            		<div class="one-line" :title="scope.row.sku_name">{{scope.row.sku_name}}</div>
            	</template>
        	</el-table-column>
        	<el-table-column label="单价" width="100">
        		<template slot-scope="scope">
					{{scope.row.sku_price | toFixed(2)}}
				</template>
        	</el-table-column>
        	<el-table-column label="购买数量" prop="quantity" width="100">
        	</el-table-column>
        	<el-table-column label="合计金额" width="100">
        		<template slot-scope="scope">
					{{scope.row.aggregate_amount | toFixed(2)}}
				</template>
        	</el-table-column>
	 	</el-table>
	</div>
</template>
<script>
	import orderApi from '@c/mixins/orderApi';
	export default {
		data() {
			return {
				goodInfo: [],
				isLoading: false
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
			this.getGoodInfo();
		},
		methods: {
			//获取商品信息
			getGoodInfo() {
				this.isLoading = true;
				this.$api(this.orderApi[this.$version] + ".getGoods", {orderId: this.id}).then((result) => {
					this.goodInfo = result;
					this.goodInfo.forEach(function(item,index){
						JSON.parse(item.sku_spec).forEach(function(_item,i){
							item.sku_name += "  " + _item.specValue;
						})
						
					})
					this.isLoading = false;
				}, (error) => {
					this.isLoading = false;
					this.$message({
		            	type: 'error',
		            	message: '获取订单商品失败'
		          	});
				});
			}
		}
	}
</script>
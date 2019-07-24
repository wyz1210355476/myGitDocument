<template>
	<div>
		<el-table :data="logger" style="width: 100%" size="mini" v-loading="isLoading">
	 		<el-table-column type="index" width="50">
			</el-table-column>
        	<el-table-column label="时间" prop="create_time">
        	</el-table-column>
        	<el-table-column label="操作人" prop="client_name">
        		<template slot-scope="scope">
        			{{scope.row.client_id == '-1' ? '系统自动作废' : scope.row.client_name}}
        		</template>
        	</el-table-column>
        	<el-table-column label="行为" prop="action">
        		<template slot-scope="scope">
        			{{scope.row.action | actionDesc}}
        		</template>
        	</el-table-column>
        	<el-table-column label="结果">
				<template slot-scope="scope">
        			{{scope.row.status | statusDesc}}
        		</template>
        	</el-table-column>
        	<el-table-column label="备注" prop="remark">
        	</el-table-column>
	 	</el-table>
	</div>
</template>
<script>
	import orderApi from '@c/mixins/orderApi'
	export default {
		data() {
			return {
				logger: [],
				isLoading: false
			}
		},
		filters: {
			actionDesc(v) {
				if (v == "0") { return '订单创建'; }
				if (v == "1") { return '订单支付'; }
				if (v == "2") { return '订单发货'; }
				if (v == "3") { return '订单退货'; }
				if (v == "4") { return '订单换货'; }
				if (v == "5") { return '订单退款'; }
				if (v == "6") { return '订单完成'; }
				if (v == "7") { return '订单作废'; }
			},
			statusDesc(v) {
				if (v == "0") { return '失败'; }
				if (v == "1") { return '成功'; }
				if (v == "2") { return '进行中'; }
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
			this.getLogDetail();
		},
		methods: {
			//获取日志信息
			getLogDetail() {
				this.isLoading = true;
				this.$api(this.orderApi[this.$version] + ".getLogs", {orderId: this.id}).then((result) => {
					this.logger = result;
					this.isLoading = false;
				}, (error) => {
					this.isLoading = false;
					if (error && error.data && error.data.status == 102) {

					} else {
						this.$message({
			            	type: 'error',
			            	message: '获取订单日志失败'
			          	});
					}
				});
			}
		}
	}
</script>
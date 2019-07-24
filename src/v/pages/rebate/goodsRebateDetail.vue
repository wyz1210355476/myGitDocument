<template>
	<div>
		<el-dialog
		  	title="返利明细"
		  	:visible.sync="visible">
		  	<div class="order-form" v-loading="isLoading">
		  		<div class="sum-box">
		  			<div class="sum">
		  				<span class="sum-title">累计返利：</span>
		  				<span class="sum-value">{{total.rebate || 0}}</span>
		  			</div>
		  			<div class="sum">
		  				<span class="sum-title">累计订单金额：</span>
		  				<span class="sum-value">{{total.price || 0}}</span>
		  			</div>
		  			<div class="sum">
		  				<span class="sum-title">累计销售数量：</span>
		  				<span class="sum-value">{{total.num || 0}}</span>
		  			</div>
		  		</div>
		  		<el-table :data="dataList" style="width: 100%" size="mini" class="table-one-line" height="350">
					<el-table-column type="index" width="50" label=" ">
    				</el-table-column>
    				<el-table-column label="日期" prop="create_time" width="150">
                	</el-table-column>
                	<el-table-column label="订单号" prop="order_no" width="160">
                	</el-table-column>
                	<el-table-column label="客户名称">
						<template slot-scope="scope">
	                		<div class="one-line" :title="scope.row.client_name">{{scope.row.client_name}}</div>
	                	</template>
                	</el-table-column>
                	<el-table-column label="客户分组">
						<template slot-scope="scope">
	                		<div class="one-line" :title="scope.row.levelName">{{scope.row.levelName}}</div>
	                	</template>
                	</el-table-column>
                	<el-table-column label="订单金额">
						<template slot-scope="scope">
	                		<div class="one-line" :title="scope.row.total_price">{{scope.row.total_price}}</div>
	                	</template>
                	</el-table-column>
                	<el-table-column label="购买数量">
						<template slot-scope="scope">
	                		<div class="one-line" :title="scope.row.total_num">{{scope.row.total_num}}</div>
	                	</template>
                	</el-table-column>
                	<el-table-column label="返利额度">
						<template slot-scope="scope">
	                		<div class="one-line" :title="scope.row.rebate">{{scope.row.rebate}}</div>
	                	</template>
                	</el-table-column>
		  		</el-table>
		  	</div>
		  	<div slot="footer">
			  	<el-button plain size="small" @click="cancel">关闭</el-button>
		  	</div>
		</el-dialog>
	</div>
</template>
<script>
	import dialogVisibility from '@c/mixins/dialogVisibility';
	export default {
		data() {
			return {
				dataList: [],
				total: {},
				isLoading: false
			}
		},
		props: {
			id: {
				type: [String, Number],
				required: true
			}
		},
		mixins: [dialogVisibility],
		mounted() {
			this.getGoodsRebateDetail();
		},
		methods: {
			getGoodsRebateDetail() {
				this.isLoading = true;
				this.$api("rebate.getRebateGoodsDetail", {goodsIds: this.id}).then((result) => {
					this.isLoading = false;
					this.dataList = result.list;
					this.total = result.total[0];
				}, (error) => {
					this.isLoading = false;
					if (error && error.data && error.data.status == 102) {
                    	this.dataList = [];
                    	this.total = {};
                    } else {
                    	this.$message({
                            type: 'error',
                            message: '加载数据出错'
                        });
                    }
				});
			},
			//关闭
			cancel() {
				this.visible = false;
			}
		},
		components: {

		}
	}
</script>
<style scoped>
	.sum-box {margin-bottom: 20px;}
	.sum-box .sum {display: inline-block; vertical-align: middle; margin-right: 20px; font-size: 14px;}
	.sum-box .sum .sum-value {color: red; font-size: 16px;}
</style>
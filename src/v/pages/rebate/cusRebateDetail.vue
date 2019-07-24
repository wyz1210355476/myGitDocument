<template>
	<div>
		<el-dialog
		  	title="返利明细"
		  	:visible.sync="visible">
		  	<div v-loading="isLoading">
		  		<el-table :data="dataList" style="width: 100%" size="mini" class="table-one-line" height="400">
					<el-table-column type="index" width="50" label=" ">
    				</el-table-column>
    				<el-table-column label="日期" prop="create_time" width="150">
                	</el-table-column>
                	<el-table-column label="收支类型">
                		<template slot-scope="scope">
                        	<div class="one-line" :title="scope.row.bapatype_name">{{scope.row.bapatype_name}}</div>
                    	</template>
                	</el-table-column>
                	<el-table-column label="额度">
                		<template slot-scope="scope">
                        	<div class="one-line" :title="scope.row.history_balance">{{scope.row.history_balance}}</div>
                    	</template>
                	</el-table-column>
                	<el-table-column label="订单号" prop="order_no" width="160">
                	</el-table-column>
                	<el-table-column label="业务说明">
                		<template slot-scope="scope">
	                		<div class="one-line" :title="scope.row.reference">{{scope.row.reference}}</div>
	                	</template>
                	</el-table-column>
                	<el-table-column label="操作人">
                		<template slot-scope="scope">
	                		<div class="one-line" :title="scope.row.operating_personnel">{{scope.row.operating_personnel}}</div>
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
			this.getCusRebateDetail();
		},
		methods: {
			getCusRebateDetail() {
				this.isLoading = true;
				this.$api("rebate.getBaccountHistory", {accountId: this.id, page: 1, pageSize: 9999}).then((result) => {
					this.dataList = result.list;
					this.isLoading = false;
				}, (error) => {
					this.isLoading = false;
					if (error && error.data && error.data.status == 102) {
                    	this.dataList = [];
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
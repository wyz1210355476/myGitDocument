	<template>
	<div class="contents">
		<page-title :title="'退款单列表'"></page-title>
		<!-- <tab-filter :total="totalCount" :options="options" @click="getTypeParam" param="type"></tab-filter> -->
		<operation ref="operation" module="order_refund_list" @search="getSearchParam">
		</operation>
		<div class="content-table">
			<el-table :data="refundList" style="width: 100%" size="mini" v-loading="isLoading" class="table-one-line">
            	<el-table-column label="订单号" width="160">
            		<template slot-scope="scope">
                        <div class="one-line" :title="scope.row.no">{{scope.row.no}}</div>
                    </template>
            	</el-table-column>
           		<el-table-column label="订单金额">
           			<template slot-scope="scope">
                        <div class="one-line" :title="scope.row.order_money | toFixed(2)">{{scope.row.order_money | toFixed(2)}}</div>
                    </template>
            	</el-table-column>
            	<el-table-column label="已支付金额">
            		<template slot-scope="scope">
                        <div class="one-line" :title="scope.row.pay_money | toFixed(2)">{{scope.row.pay_money | toFixed(2)}}</div>
                    </template>
            	</el-table-column>
            	<el-table-column label="收款人">
            		<template slot-scope="scope">
                        <div class="one-line" :title="scope.row.collector">{{scope.row.collector}}</div>
                    </template>
            	</el-table-column>
            	<el-table-column label="退款类型">
            		<template slot-scope="scope">
                        <div class="one-line" :title="scope.row.return_type | getReturnType">{{scope.row.return_type | getReturnType}}</div>
                    </template>
            	</el-table-column>
            	<el-table-column label="退款平台">
            		<template slot-scope="scope">
                        <div class="one-line" :title="scope.row.return_plat">{{scope.row.return_plat}}</div>
                    </template>
            	</el-table-column>
            	<el-table-column label="退款账号">
            		<template slot-scope="scope">
                        <div class="one-line" :title="scope.row.return_account">{{scope.row.return_account}}</div>
                    </template>
            	</el-table-column>
            	<el-table-column label="退款金额">
            		<template slot-scope="scope">
                        <div class="one-line" :title="scope.row.money | toFixed(2)">{{scope.row.money | toFixed(2)}}</div>
                    </template>
            	</el-table-column>
            	<el-table-column label="手续费">
            		<template slot-scope="scope">
                        <div class="one-line" :title="scope.row.fee | toFixed(2)">{{scope.row.fee | toFixed(2)}}</div>
                    </template>
            	</el-table-column>
            	<!-- <el-table-column label="扣除积分" prop="deduction_integral">
            	</el-table-column> -->
            	<el-table-column label="操作" width="70">
                	<template slot-scope="scope">
                		<div class="table-operation">
            				<el-button type="text" @click="showCustomDialog(scope.row.id, 'refundDetail')" size="small">查看</el-button>
            			</div>
                	</template>
            	</el-table-column>
            </el-table>
		</div>
		<pages :total.sync="totalCount" @change="getFilterParam()"></pages>
		<custom-dialog :visibility.sync="customDialogParam.visibility" :id="activeId" :module="customDialogParam.module"></custom-dialog>
	</div>
</template>
<script>
	import pageTitle from '@components/pageTitle';
	import pages from '@components/pages';
	import operation from '@components/operation';
	import tabFilter from '@components/tabFilter';
	import customDialog from './components/customDialog';
	import orderApi from '@c/mixins/orderApi';

	export default {
		data() {
			return {
				refundList: [],
				totalCount: 0,
				filterParam: {},
				// options: [
				// 	{label: "退款中", name: "1"},
				// 	{label: "成功", name: "2"},
				// 	{label: "取消", name: "3"},
				// 	{label: "全部", name: "0"}
				// ],
				activeId: '',
				customDialogParam: {
					visibility: false,
					module: 'view'
				},
				isLoading: false
			}
		},
		mixins: [orderApi],
		mounted() {
			this.getFilterParam();
		},
		filters: {
			getReturnType(v) {
				if (v == '1') { return '在线支付'; }
				if (v == '2') { return '线下支付'; }
				if (v == '3') { return '预存款支付'; }
			}
		},
		methods: {
			getFilterParam(type) {
				this.filterParam.page = this.$route.query.currentPage ? parseInt(this.$route.query.currentPage) : 1;
                this.filterParam.pageSize = this.$route.query.pageSize ? parseInt(this.$route.query.pageSize) : 10;
				this.getRefundList();
			},
			getSearchParam(msg) {
				this.$router.push({
					query: {
						currentPage: 1,
                        pageSize: 10
					}
				});
				let where = [{
                    key: msg.search_select,
                    logic: 'like',
                    value: msg.search_select == 'return_type' ? (msg.search_value == '在线支付' ? '1' : (msg.search_value == '线上支付' ? '2' : '')) : msg.search_value
                }]
                this.filterParam.refund = encodeURIComponent(JSON.stringify(where));
				this.getFilterParam('search');
			},
			getRefundList() {
				let sort = [{
                    "create_time":"desc"
                }]
                this.filterParam.sort = encodeURIComponent(JSON.stringify(sort));
                this.isLoading = true;
				this.$api(this.orderApi[this.$version] + ".getRefundList", this.filterParam).then((result) => {
					this.refundList = result.list;
					this.totalCount = result.page.total;
					this.isLoading = false;
				}, (error) => {
					this.refundList = [];
					this.totalCount = 0;
					this.isLoading = false;
					if (error && error.data && error.data.status != 102) {
						this.$message({
			            	type: 'error',
			            	message: '加载数据出错'
			          	});
					}
				});
			},
			//自定义窗
			showCustomDialog(id, module) {
				this.customDialogParam.visibility = true;
				this.customDialogParam.module = module;
				this.activeId = id;
			}
		},
		components: {
			pageTitle,
			pages,
			operation,
			tabFilter,
			customDialog
		}
	}
</script>
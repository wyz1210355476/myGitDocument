<template>
	<div class="contents">
		<page-title :title="'支付单列表'"></page-title>
		<!-- <tab-filter :total="totalCount" :options="options" @click="getFilterParam" param="type"></tab-filter> -->
		<operation ref="operation" module="order_pay_list" @search="getSearchParam">
			<!-- <div slot="btn">
				<el-button size="small">导出</el-button>
			</div> -->
		</operation>
		<div class="content-table">
			<el-table :data="payList" style="width: 100%" size="mini" v-loading="isLoading" class="table-one-line">
            	<el-table-column label="订单号" width="160">
            		<template slot-scope="scope">
                        <div class="one-line" :title="scope.row.no">{{scope.row.no}}</div>
                    </template>
            	</el-table-column>
            	<el-table-column label="收款方式">
            		<template slot-scope="scope">
                        <div class="one-line" :title="scope.row.charged_bank">{{scope.row.charged_bank}}</div>
                    </template>
            	</el-table-column>
            	<el-table-column label="收款账号">
            		<template slot-scope="scope">
                        <div class="one-line" :title="scope.row.charged_account">{{scope.row.charged_account}}</div>
                    </template>
            	</el-table-column>
            	<el-table-column label="收款金额">
            		<template slot-scope="scope">
                        <div class="one-line" :title="scope.row.charged_sum | toFixed(2)">{{scope.row.charged_sum | toFixed(2)}}</div>
                    </template>
            	</el-table-column>
            	<el-table-column label="收款人">
            		<template slot-scope="scope">
                        <div class="one-line" :title="scope.row.charged_user">{{scope.row.charged_user}}</div>
                    </template>
            	</el-table-column>
            	<el-table-column label="付款人">
            		<template slot-scope="scope">
                        <div class="one-line" :title="scope.row.pay_user">{{scope.row.pay_user}}</div>
                    </template>
            	</el-table-column>
            	<el-table-column label="支付方式">
            		<template slot-scope="scope">
                        <div class="one-line" :title="scope.row.pay_way_name">{{scope.row.pay_way_name}}</div>
                    </template>
            	</el-table-column>
            	<el-table-column label="操作" width="70">
                	<template slot-scope="scope">
                		<div class="table-operation">
            				<el-button type="text" @click="showCustomDialog(scope.row.order_id, 'payDetail')" size="small">查看</el-button>
            			</div>
                	</template>
            	</el-table-column>
            </el-table>
		</div>
		<pages :total.sync="totalCount" @change="getFilterParam('page')"></pages>
		<custom-dialog :visibility.sync="customDialogParam.visibility" :id="activeId" :module="customDialogParam.module"></custom-dialog>
	</div>
</template>
<script>
	import pageTitle from '@components/pageTitle';
	import pages from '@components/pages';
	import tabFilter from '@components/tabFilter';
	import operation from '@components/operation';
	import customDialog from './components/customDialog';
	import orderApi from '@c/mixins/orderApi';
	// let allPayTypeList = [];

	export default {
		data() {
			return {
				payList: [],
				totalCount: 0,
				filterParam: {},
				// options: [
				// 	{label: "成功", name: "1"},
				// 	{label: "取消", name: "2"},
				// 	{label: "全部", name: "0"}
				// ]
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
			// this.getPayTypeList();
		},
		// filters: {
		// 	getPayType(v) {
		// 		let index = allPayTypeList.findIndex((n) => n.id === parseInt(v));
		// 		if (index > -1) {
		// 			return allPayTypeList[index].name;
		// 		} else {
		// 			return '';
		// 		}
		// 	}
		// },
		methods: {
			getFilterParam(type) {
				// for (var i in this.$route.query) {
				// 	if (i === 'currentPage' || i === 'pageSize') {
				// 		continue;
				// 	}
				// 	this.filterParam[i] = this.$route.query[i];
				// }
				this.filterParam.page = this.$route.query.currentPage ? parseInt(this.$route.query.currentPage) : 1;
                this.filterParam.pageSize = this.$route.query.pageSize ? parseInt(this.$route.query.pageSize) : 10;
				this.getPayList();
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
                    value: msg.search_value
                }]
                this.filterParam.receipt = encodeURIComponent(JSON.stringify(where));
				this.getFilterParam('search');
			},
			getPayList() {
				let sort = [{
                    "create_time":"desc"
                }]
                this.filterParam.sort = encodeURIComponent(JSON.stringify(sort));
                this.isLoading = true;
				this.$api(this.orderApi[this.$version] + ".getPayList", this.filterParam).then((result) => {
					this.payList = result.list;
					this.totalCount = result.page.total;
					this.isLoading = false;
				}, (error) => {
					this.payList = [];
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
			//获取支付方式
			// getPayTypeList() {
			// 	this.$api(this.orderApi[this.$version] + ".getPayType").then((result) => {
			// 		allPayTypeList = result;
			// 	}, (error) => {

			// 	});
			// },
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
			tabFilter,
			operation,
			customDialog
		}
	}
</script>
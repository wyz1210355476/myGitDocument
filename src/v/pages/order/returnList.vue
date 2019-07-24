<template>
	  <div class="contents">
		<page-title :title="'退货单列表'"></page-title>
		<!-- <tab-filter :total="totalCount" :options="options" @click="getTypeParam" param="type"></tab-filter> -->
		<operation ref="operation" module="order_return_list" @search="getSearchParam">
			<!-- <div slot="btn">
				<el-button size="small">导出</el-button>
			</div> -->
		</operation>
		<div class="content-table">
			<el-table :data="returnList" style="width: 100%" size="mini" v-loading="isLoading" class="table-one-line">
           		<!-- <el-table-column label="配送方式" prop="">
           			<template slot-scope="scope">
           				{{scope.row.logistics_type | getShipType}}
           			</template>
            	</el-table-column> -->
            	<el-table-column label="订单号" width="160">
            		<template slot-scope="scope">
                        <div class="one-line" :title="scope.row.order_no">{{scope.row.order_no}}</div>
                    </template>
            	</el-table-column>
            	<el-table-column label="退货单号" width="160">
            		<template slot-scope="scope">
                        <div class="one-line" :title="scope.row.no">{{scope.row.no}}</div>
                    </template>
            	</el-table-column>
            	<el-table-column label="物流单号">
            		<template slot-scope="scope">
                        <div class="one-line" :title="scope.row.tracking_number">{{scope.row.tracking_number}}</div>
                    </template>
            	</el-table-column>
            	<el-table-column label="物流公司">
            		<template slot-scope="scope">
                        <div class="one-line" :title="scope.row.logistics_name">{{scope.row.logistics_name}}</div>
                    </template>
            	</el-table-column>
            	<el-table-column label="物流费用">
            		<template slot-scope="scope">
                        <div class="one-line" :title="scope.row.freight | toFixed(2)">{{scope.row.freight | toFixed(2)}}</div>
                    </template>
            	</el-table-column>
            	<el-table-column label="收货人">
            		<template slot-scope="scope">
                        <div class="one-line" :title="scope.row.consigner_name">{{scope.row.consigner_name}}</div>
                    </template>
            	</el-table-column>
            	<el-table-column label="创建时间">
            		<template slot-scope="scope">
                        <div class="one-line" :title="scope.row.create_time">{{scope.row.create_time}}</div>
                    </template>
           		</el-table-column>
           		<el-table-column label="操作" width="70">
                	<template slot-scope="scope">
                		<div class="table-operation">
            				<el-button type="text" @click="showCustomDialog(scope.row.id, 'returnDetail')" size="small">查看</el-button>
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
	import operation from '@components/operation';
	import tabFilter from '@components/tabFilter';
	import customDialog from './components/customDialog';
	import orderApi from '@c/mixins/orderApi';
	// let shipTypeList = [];
	export default {
		data() {
			return {
				returnList: [],
				totalCount: 0,
				filterParam: {},
				activeId: '',
				customDialogParam: {
					visibility: false,
					module: 'view'
				},
				isLoading: false
			}
		},
		mixins: [orderApi],
		// filters: {
		// 	getShipType(v) {
		// 		let index = shipTypeList.findIndex((n) => n.id === parseInt(v));
		// 		if (index > -1) {
		// 			return shipTypeList[index].name;
		// 		} else {
		// 			return '';
		// 		}
		// 	}
		// },
		mounted() {
			this.getFilterParam();
			// this.getLogiticType();
		},
		methods: {
			getFilterParam(type) {
				this.filterParam.page = this.$route.query.currentPage ? parseInt(this.$route.query.currentPage) : 1;
                this.filterParam.pageSize = this.$route.query.pageSize ? parseInt(this.$route.query.pageSize) : 10;
				this.getReturnList();
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
                this.filterParam.returnGoods = encodeURIComponent(JSON.stringify(where));
				this.getFilterParam('search');
			},
			getReturnList() {
				let sort = [{
                    "create_time":"desc"
                }];
                this.filterParam.sort = encodeURIComponent(JSON.stringify(sort));
                this.isLoading = true;
				this.$api(this.orderApi[this.$version] + ".getReturnList", this.filterParam).then((result) => {
					// debugger;
					this.returnList = result.list;
					this.totalCount = result.page.total;
					this.isLoading = false;
				}, (error) => {
					this.returnList = [];
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
			//获取配送方式
			// getLogiticType() {
			// 	this.$api(this.orderApi[this.$version] + ".getShipType").then((result) => {
			// 		shipTypeList = result.list;
			// 	}, (error) => {

			// 	});
			// },
			//自定义窗
			showCustomDialog(id, module) {
				this.customDialogParam.visibility = true;
				this.customDialogParam.module = module;
				this.activeId = id;
			},
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
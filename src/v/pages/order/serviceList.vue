<template>
	<div class="contents">
		<page-title :title="'售后服务管理'"></page-title>
		<tab-filter :options="options" @click="getFilterParam()" param="reply"></tab-filter>
		<operation ref="operation" module="order_service_list" @search="getSearchParam">
			<!-- <div slot="btn">
				<el-button size="small">标签</el-button>
			</div> -->
		</operation>
		<div class="content-table">
			<el-table :data="serviceList" style="width: 100%" size="mini" v-loading="isLoading">
            	<el-table-column label="售后服务标题" prop="reason">
            	</el-table-column>
            	<el-table-column label="订单号" prop="order_number">
            	</el-table-column>
            	<el-table-column label="申请人" prop="nickname">
            	</el-table-column>
            	<el-table-column label="售后单流水号" prop="number">
            	</el-table-column>
            	<el-table-column label="售后服务状态">
            		<template slot-scope="scope">
            			{{scope.row.reply | getStatus}}
            		</template>
            	</el-table-column>
            	<el-table-column label="售后服务类型">
            		<template slot-scope="scope">
            			{{scope.row.type | getType}}
            		</template>
            	</el-table-column>
            	<el-table-column label="创建时间" prop="create_time">
           		</el-table-column>
            	<el-table-column label="操作" fixed="right" width="300">
            		<template slot-scope="scope">
            			<div class="table-operation">
            				<el-button type="text" @click="showCustomDialog(scope.row.order_id, scope.row.id, 'service')" size="small">查看</el-button>
            				<el-button v-if="scope.row.reply == '0'" type="text" @click="showAcceptDialog(scope.row.order_id)" size="small">接受申请</el-button>
	        				<el-button v-if="scope.row.reply == '1' && scope.row.type == 2" type="text" @click="showCustomDialog(scope.row.order_id, '', 'delivery')" size="small">发货</el-button>
	        				<el-button v-if="scope.row.reply == '1' && scope.row.type == 1"  type="text" @click="showCustomDialog(scope.row.order_id, '', 'refund')" size="small">退款</el-button>
	        				<el-button v-if="scope.row.reply != '3' && scope.row.reply != '2'" type="text" @click="showFinishDialog(scope.row.order_id)" size="small">完成</el-button>
	        				<el-button v-if="scope.row.reply != '3' && scope.row.reply != '2'" type="text" @click="showRefuseDialog(scope.row.order_id)" size="small">拒绝</el-button>
            			</div>
            		</template>
            	</el-table-column>
            </el-table>
		</div>
		<pages :total="totalCount" @change="getFilterParam('page')"></pages>
		<custom-dialog :visibility.sync="customDialogParam.visibility" :id="activeId" :module="customDialogParam.module" @update="getFilterParam"></custom-dialog>
	</div>
</template>
<script>
	import pageTitle from '@components/pageTitle';
	import operation from '@components/operation';
	import pages from '@components/pages';
	import tabFilter from '@components/tabFilter';
	import customDialog from './components/customDialog';
	import orderApi from '@c/mixins/orderApi';

	export default {
		data() {
			return {
				serviceList: [],
				totalCount: 0,
				options: [
					{label: "全部", name: "-1"},
					{label: "审核中", name: "0"},
					{label: "接受申请", name: "1"},
					{label: "完成", name: "3"},
					{label: "拒绝", name: "2"}
				],
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
		filters: {
			getStatus(v) {
				if (v == '0') { return '未审核'; }
				if (v == '1') { return '同意'; }
				if (v == '2') { return '拒绝'; }
				if (v == '3') { return '完成'; }
			},
			getType(v) {
				if (v == '1') { return '退货'; }
				if (v == '2') { return '换货'; }
			}
		},
		mounted() {
			this.getFilterParam();
		},
		methods: {
			getFilterParam(type) {
				if (!type) {
					this.filterParam = {};
					this.$refs.operation.clear();
				}
				if (this.$route.query.reply != '-1') {
					this.filterParam.reply = this.$route.query.reply;
				}
				let currentPage = this.$route.query.currentPage ? parseInt(this.$route.query.currentPage) : 1;
				let pageSize = this.$route.query.pageSize ? parseInt(this.$route.query.pageSize) : 10;
				this.filterParam.limit = {
					page: currentPage,
					pageSize: pageSize
				}
				this.getServiceList();
			},
			getSearchParam(msg) {
				this.$router.push({
					query: {
						reply: this.filterParam.reply,
						currentPage: 1,
                        pageSize: 10
					}
				});
				if (msg.search_select == 'type') {
					if (msg.search_value == '退货') {
						this.filterParam[msg.search_select] = '2';
					}
					if ((msg.search_value == '退款')) {
						this.filterParam[msg.search_select] = '1';
					}
				} else {
					this.filterParam[msg.search_select] = msg.search_value;
				}
				this.getFilterParam('search');
			},
			getServiceList() {
				let data = {
					map: this.filterParam
					// map: encodeURIComponent(JSON.stringify(this.filterParam))
				}
				this.isLoading = true;
				this.$api(this.orderApi[this.$version] + ".getServiceList", data).then((result) => {
					this.serviceList = result.list;
					this.totalCount = parseInt(result.total);
					this.isLoading = false;
				}, (error) => {
					this.serviceList = [];
					this.isLoading = false;
					this.totalCount = 0;
					if (error && error.data && error.data.status == 102) {

					} else {
						this.$message({
			            	type: 'error',
			            	message: '加载数据出错'
			          	});
					}
				});
			},
			//自定义窗
			showCustomDialog(id, applyId, module) {
				this.customDialogParam.visibility = true;
				this.customDialogParam.module = module;
				if (applyId == '') {
					this.activeId = id;
				} else {
					this.activeId = [id, applyId];
				}
			},
			//接受申请窗口
			showAcceptDialog(id) {
				this.activeId = id;
				this.$confirm('确定要接受申请吗？', '接受申请', {
		          	confirmButtonText: '确定',
		          	cancelButtonText: '取消',
		          	type: 'warning'
		        }).then(() => {
		        	this.acceptOrRefuseOrder('1');
		        });
			},
			//拒绝申请窗口
			showRefuseDialog(id) {
				this.activeId = id;
				this.$confirm('确定要拒绝申请吗？', '拒绝申请', {
		          	confirmButtonText: '确定',
		          	cancelButtonText: '取消',
		          	type: 'warning'
		        }).then(() => {
		        	this.acceptOrRefuseOrder('2');
		        });
			},
			//完成窗口
			showFinishDialog(id) {
				this.activeId = id;
				this.$confirm('完成后该订单将不能有任何操作,确认要执行吗?', '订单完成', {
		          	confirmButtonText: '确定',
		          	cancelButtonText: '取消',
		          	type: 'warning'
		        }).then(() => {
		        	this.acceptOrRefuseOrder('3');
		        });
			},
			//接受/拒绝/完成
			acceptOrRefuseOrder(status) {
				let msg = {
					1: {
						success: '接受申请成功!',
						error: '接受申请失败!'
					},
					2: {
						success: '拒绝申请成功!',
						error: '拒绝申请失败!'
					},
					3: {
						success: '订单完成成功!',
						error: '订单完成失败!'
					}
				}
				let data = {
					map: {
						order_id: this.activeId,
						reply: status
					}
				}
				this.$api(this.orderApi[this.$version] + ".modifyServiceOrder", data).then((result) => {
					this.getFilterParam();
					this.$message({
		            	type: 'success',
		            	message: msg[status].success
		        	});
				}, (error) => {
					this.$message({
		            	type: 'error',
		            	message: msg[status].error
		          	});
				});
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
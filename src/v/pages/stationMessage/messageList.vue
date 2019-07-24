<template>
	<div class="contents">
		<page-title title="站内消息"></page-title>
		<tab-filter :options="options" param="type" @click="getFilterParam()"></tab-filter>
		<operation ref="operation" :module="type == 'in' ? 'iMessage_list' : 'oMessage_list'" @search="getSearchParam">
			<div slot="btn">
				<el-button size="small" @click="sendDialog = true" type="primary">发消息</el-button>
			</div>
		</operation>
		<div class="content-table">
			<el-table ref="messageTable" :data="messageList" style="width: 100%" @selection-change="handleSelectionChange" size="mini" class="table-one-line" v-loading="isLoading">
				<el-table-column type="selection" width="55">
                </el-table-column>
                <el-table-column :label="type == 'out' ? '收件人' : '发件人'">
                	<template slot-scope="scope">
                		<span :class="{notRead: scope.row.is_read == 0}">{{type == 'out' ? scope.row.to_uname : scope.row.from_uname}}</span>
                	</template>
            	</el-table-column>
            	<el-table-column label="标题">
            		<template slot-scope="scope">
            			<div class="one-line" :title="scope.row.title" :class="{notRead: scope.row.is_read == 0}">
            				{{scope.row.title}}
            			</div>
            		</template>
            	</el-table-column>
            	<el-table-column label="内容">
            		<template slot-scope="scope">
            			<div class="one-line" :title="scope.row.content" :class="{notRead: scope.row.is_read == 0}">
            				{{scope.row.content}}
            			</div>
            		</template>
            	</el-table-column>
            	<el-table-column label="时间">
            		<template slot-scope="scope">
            			<span :class="{notRead: scope.row.is_read == 0}">{{scope.row.send_time}}</span>
            		</template>
           		</el-table-column>
            	<el-table-column label="操作">
            		<template slot-scope="scope">
            			<div class="table-operation">
            				<el-button  type="text" @click="showViewDialog(scope.row.id)" size="small">查看</el-button>
            				<el-button v-if="type == 'in'" type="text" @click="showReplyDialog(scope.row.id)" size="small">回复</el-button>
            				<el-popover
					        	placement="top"
					        	width="200"
					        	trigger="click"
					        	v-model="scope.row.popover"
				        		>
								<p>是否删除这条信息吗？</p>
								<div style="text-align: right; margin: 0">
								    <el-button size="mini" type="text" @click="scope.row.popover = false">取消</el-button>
								    <el-button type="primary" size="mini" @click="delMessage(scope.row.id)">确定</el-button>
								</div>
								<el-button slot="reference" type="text" size="small">删除</el-button>
							</el-popover>
            			</div>
            		</template>
            	</el-table-column>
			</el-table>
		</div>
		<pages :total="totalCount" @change="getFilterParam('page')">
			<div slot="leftop">
				<el-checkbox @change="seleceAll" size="small" >全选</el-checkbox>
				<span class="op_project"><el-button type="text" size="small" @click="getDelMessage">删除</el-button></span>
			</div>
		</pages>
		<view-message :id="activeId" :type="type" :visibility.sync="viewDialog" v-if="viewDialog" @close="sortData"></view-message>
		<send-message :visibility.sync="sendDialog" v-if="sendDialog" @save="getFilterParam('out')"></send-message>
		<reply-message :id="activeId" :visibility.sync="replyDialog" v-if="replyDialog"></reply-message>
	</div>
</template>
<script>
	import pageTitle from '@components/pageTitle';
	import pages from '@components/pages';
	import tabFilter from '@components/tabFilter';
	import operation from '@components/operation';
	import viewMessage from './viewMessage';
	import sendMessage from './sendMessage';
	import replyMessage from './replyMessage';
	export default {
		data() {
			return {
				type: this.$route.query.type,
				totalCount: 0,
				filterParam: {},
				options: [
					{label: "发件箱", name: "out"},
					{label: "收件箱", name: "in"},
				],
				messageList: [],
				selection: [],
				activeId: '',
				viewDialog: false,
				replyDialog: false,
				sendDialog: false,
				isLoading: false
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
				this.filterParam.page = this.$route.query.currentPage ? parseInt(this.$route.query.currentPage) : 1;
				this.filterParam.pageSize = this.$route.query.pageSize ? parseInt(this.$route.query.pageSize) : 10;
				this.filterParam.sort = [{send_time: "desc"}];
				this.sortData();
			},
			getSearchParam(msg) {
				this.$router.push({
					query: {
						type: this.type
					}
				});
				this.filterParam.search = [{
					"key": msg.search_select,
					"logic": "like",
					"value": msg.search_value
				}]
				this.getFilterParam('search');
			},
			sortData() {
				this.type = this.$route.query.type;
				let data = {
					page: this.filterParam.page,
					pageSize: this.filterParam.pageSize,
					sort: encodeURIComponent(JSON.stringify(this.filterParam.sort))
				}
				if (this.type == 'out') {
					if (this.filterParam.search) {
						data.outbox = encodeURIComponent(JSON.stringify(this.filterParam.search));
					}
					this.getOmessageList(data);
				}
				if (this.type == 'in') {
					if (this.filterParam.search) {
						data.inbox = encodeURIComponent(JSON.stringify(this.filterParam.search));
					}
					this.getImessageList(data);
				}
			},
			//获取收件箱列表
			getImessageList(data) {
				this.isLoading = true;
				this.$api("stationM.inList", data).then((result) => {
					this.messageList = result.list;
					this.totalCount = result.page.total;
					this.isLoading = false;
				}, (error) => {
					this.totalCount = 0;
					this.messageList = [];
					this.isLoading = false;
					if (error && error.data && error.data.status == 102) {

					} else {
						this.$message({
			            	type: 'error',
			            	message: '加载数据出错'
			          	});
					}
				});
			},
			//获取发件箱列表
			getOmessageList(data) {
				this.isLoading = true;
				this.$api("stationM.outList", data).then((result) => {
					this.messageList = result.list;
					this.totalCount = result.page.total;
					this.isLoading = false;
				}, (error) => {
					this.totalCount = 0;
					this.messageList = [];
					this.isLoading = false;
					if (error && error.data && error.data.status == 102) {

					} else {
						this.$message({
			            	type: 'error',
			            	message: '加载数据出错'
			          	});
					}
				});
			},
			//全选
			seleceAll(val){
				if(val && this.messageList.length > 0){
					this.messageList.forEach(row => {
			            this.$refs.messageTable.toggleRowSelection(row);
			        });
				}else{
					this.$refs.messageTable.clearSelection();
				}
			},
			//选择项变更
			handleSelectionChange(selection) {
				this.selection = selection;
			},
			//发消息
			sendMessage() {
				this.$router.push({name: 'stationM_send'});
			},
			//查看
			showViewDialog(id) {
				this.activeId = id;
				this.viewDialog = true;
			},
			showReplyDialog(id) {
				this.activeId = id;
				this.replyDialog = true;
			},
			//获取要删除的信息
			getDelMessage() {
				if (this.selection.length == 0) {
					this.$message({
		            	type: 'error',
		            	message: '请选择要删除的项'
		          	});
		          	return;
				}
				let id = '';
				this.selection.forEach((v, i) => {
					id += v.id;
					if (i != this.selection.length) {
						id += ',';
					}
				});
				this.showDelDialog(id);
			},
			//删除弹窗
			showDelDialog(id) {
				this.$confirm('是否删除这些信息？', '删除提示', {
		          	confirmButtonText: '确定',
		          	cancelButtonText: '取消',
		          	type: 'warning'
		        }).then(() => {
		        	this.delMessage(id);
		        });
			},
			//删除
			delMessage(id) {
				let data = {}
				if (this.type == 'in') {
					data.inbox = {
						ids: id
					}
					this.$api("stationM.delInMessage", data).then((result) => {
						this.sortData();
						this.$message({
			            	type: 'success',
			            	message: '删除成功!'
			        	});
					}, (error) => {
						this.$message({
			            	type: 'error',
			            	message: '删除失败！'
			          	});
					});
				}
				if (this.type == 'out') {
					data.outbox = {
						ids: id
					}
					this.$api("stationM.delOutMessage", data).then((result) => {
						this.sortData();
						this.$message({
			            	type: 'success',
			            	message: '删除成功!'
			        	});
					}, (error) => {
						this.$message({
			            	type: 'error',
			            	message: '删除失败！'
			          	});
					});
				}

			}
		},
		components: {
			pageTitle,
			pages,
			tabFilter,
			operation,
			viewMessage,
			replyMessage,
			sendMessage
		}
	}
</script>
<style>
	.notRead {
		font-weight: bold !important;
	}
</style>
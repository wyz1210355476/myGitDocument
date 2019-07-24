<template>
	<div style="display: inline-block">
    	<el-button size="small" @click="showDialog">选择客户</el-button>
		<el-dialog
		  	title="选择客户"
		  	:visible.sync="showMemberDialog">
		  	<div>
		  		<div class="content-table">
					<el-table ref="memberList" :data="memberList" style="width: 100%" :highlight-current-row="mod===0" @current-change="handleCurrentChange" @selection-change="handleSelectionChange">
						<el-table-column type="selection" width="55" v-if="mod===1" :selectable="isSelectable">
		                </el-table-column>
		                <el-table-column label="用户名" prop="loginid">
		            	</el-table-column>
		            	<el-table-column label="客户姓名" prop="businessname">
		            	</el-table-column>
		            	<el-table-column label="邮箱" prop="email">
		            	</el-table-column>
		            	<el-table-column label="手机号" prop="mobile">
		            	</el-table-column>
		            	<el-table-column label="客户状态">
		            		<template slot-scope="scope">
		            			{{scope.row.stat | getStatus}}
		            		</template>
		            	</el-table-column>
		            	<el-table-column label="客户分组" prop="level_name">
		            	</el-table-column>
					</el-table>
				</div>
				<pages :total.sync="totalCount" @change="getPageParam" :route="false" class="hide-page-size"></pages>
				<div class="btn-area">
		  			<el-button type="primary" @click="chooseSelectGood">提交</el-button>
		  		</div>
		  	</div>
		</el-dialog>
	</div>
</template>
<script>
	import pageTitle from '@components/pageTitle';
	import pages from '@components/pages';
	import {deepCopy} from '@c/util'
	export default {
		data() {
			return {
				memberList: [],
				totalCount: 0,
				pageParam: {
					pageSize: 10,
					currentPage: 1
				},
				showMemberDialog: false,
				selection: [],
				selectionSortByPage: {},
				lostMemberList: []
			}
		},
		props: ['type', 'selectList', 'needParam'],
		computed: {
			mod() {
				let m = {
					single: 0,
					multi: 1
				}
				return m[this.type];
			}
		},
		filters: {
			getStatus(v) {
				if (v === '1') { return '禁用'; }
				if (v === '2') { return '启用'; }
			}
		},
		methods: {
			isSelectable(row, index) {
                if (row === false) {
                    return false;
                }
                if (row.stat === "2" && (!this.needParam || row[this.needParam] !== '')) {
                	return true;
                } else {
                	return false;
                }
            },
			showDialog() {
				this.showMemberDialog = true;
				if (this.mod ===1) {
					this.selectionSortByPage = {};
					this.lostMemberList = deepCopy(this.selectList);
					console.log('start: lostMemberList', this.lostMemberList);
					console.log('start: selectionSortByPage', this.selectionSortByPage)
				}
				this.getMemberList();
			},
			getPageParam(msg) {
				this.pageParam = msg;
				this.getMemberList();
				// this.pageParam.page_index = msg.currentPage;
				// this.pageParam.page_size = msg.pageSize;
			},
			getMemberList() {
				let data = {
					'data[page_index]': this.pageParam.currentPage,
					'data[page_size]': this.pageParam.pageSize
				};
				this.$api("user.getMemberList", data).then((result) => {
					this.memberList = result.list;
					this.totalCount = parseInt(result.total);
					if (this.mod === 1) {
						this.$nextTick(() => {
							console.log('lostMemberList.length', this.lostMemberList.length)
							if (this.selectionSortByPage[this.pageParam.currentPage] && this.selectionSortByPage[this.pageParam.currentPage].length !== 0) {
								console.log(1)
								this.selectionSortByPage[this.pageParam.currentPage].forEach((v) => {
									let index = this.memberList.findIndex((n) => n.loginid === v.loginid);
									if (index > -1) {
										this.$refs.memberList.toggleRowSelection(this.memberList[index], true);
									}
								});
							} else if (this.lostMemberList.length !== 0) {
								console.log(2)
								this.selectionSortByPage[this.pageParam.currentPage] = [];
								this.lostMemberList.forEach((v, i) => {
									let index = this.memberList.findIndex((n) => n.loginid === v.loginid);
									if (index > -1) {
										this.selectionSortByPage[this.pageParam.currentPage].push(v);
										this.$refs.memberList.toggleRowSelection(this.memberList[index], true);
										setTimeout(() => {
											let indexin = this.lostMemberList.findIndex((value) => value.loginid === v.loginid);
											if (indexin > -1) {
												this.lostMemberList.splice(indexin, 1);
											}
										})
									}
								});
								console.log('update:lostMemberList', this.lostMemberList)
							} else {
								console.log(3)
								this.selectionSortByPage[this.pageParam.currentPage] = [];
							}
							console.log('update: selectionSortByPage', this.selectionSortByPage);
						})
					}
				}, (error) => {

				});
			},
			handleCurrentChange(selection) {
				if (this.mod === 1) {
					return;
				}
				this.selection = selection;
			},
			handleSelectionChange(selection) {
				// this.selection = selection;
				this.selectionSortByPage[this.pageParam.currentPage] = deepCopy(selection);
				console.log('selection:selectionSortByPage', this.selectionSortByPage)
			},
			chooseSelectGood() {//单选情况下返回当前选中行（非数组），多选情况下返回选中行数组
				if (this.mod === 0) {
					if (this.selection.stat === '1') {
						this.$message({
			            	type: 'error',
			            	message: '该客户已禁用！'
			          	});
			          	return;
					}
					this.showMemberDialog = false;
					this.$emit("select", this.selection);
				}
				if (this.mod === 1) {
					let selection = [];
					for (var i in this.selectionSortByPage) {
						if (this.selectionSortByPage[i].length !== 0) {
							selection.push(...this.selectionSortByPage[i]);
						}
					}
					if (this.lostMemberList.length !==0) {
						selection.push(...this.lostMemberList);
					}
					console.log('selection', selection)
					this.showMemberDialog = false;
					this.$emit("select", selection);
				}
			}
		},
		components: {
			pageTitle,
			pages
		}
	}
</script>
<style>

</style>
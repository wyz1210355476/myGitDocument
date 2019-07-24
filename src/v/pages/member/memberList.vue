<template>
	<div class="contents">
		<page-title title="客户列表"></page-title>
		<operation ref="operation" module="member_list" @search="getSearchParam">
            <div slot="btn">
                <el-button type="primary" size="small" @click="addNewMember">新增</el-button>
				<el-button type="primary" size="small" @click="openImportDialog">导入</el-button>
				<el-button type="primary" size="small" @click="showExportDialog = true">导出</el-button>
            </div>
        </operation>
        <div class="content-table">
            <el-table :data="memberList" ref="memberTable" style="width: 100%" size="mini" @selection-change="handleSelectionChange" v-loading="isLoading" class="table-one-line">
            	<el-table-column type="selection" width="35">
                </el-table-column>
                <el-table-column label="客户名称">
                	<template slot-scope="scope">
                		<div class="one-line" :title="scope.row.loginid">{{scope.row.loginid}}</div>
                	</template>
                </el-table-column>
                <el-table-column label="联系人姓名">
                	<template slot-scope="scope">
                		<div class="one-line" :title="scope.row.truename">{{scope.row.truename}}</div>
                	</template>
                </el-table-column>
                <el-table-column label="邮箱">
                	<template slot-scope="scope">
                		<div class="one-line" :title="scope.row.email">{{scope.row.email}}</div>
                	</template>
                </el-table-column>
                <el-table-column label="手机号">
                	<template slot-scope="scope">
                		<div class="one-line" :title="scope.row.mobile">{{scope.row.mobile}}</div>
                	</template>
                </el-table-column>
                <el-table-column label="客户状态">
                	<template slot-scope="scope">
                		<span>{{scope.row.stat == '2' ? '启用' : '停用'}}</span>
                	</template>
                </el-table-column>
                <el-table-column label="客户分组">
                	<template slot-scope="scope">
                		<div class="one-line" :title="scope.row.level_name">{{scope.row.level_name}}</div>
                	</template>
                </el-table-column>
                <!-- <el-table-column label="客户标签">
                	<template slot-scope="scope">
                		<div class="one-line">
                			<span v-for="(tag,index) in scope.row.tags">{{tag.name}}{{index == scope.row.tags.length-1 ? '' : ','}}</span>
                		</div>
                	</template>
                </el-table-column> -->
                <el-table-column label="操作" width="175">
            		<template slot-scope="scope">
            			<div class="table-operation">
            				<el-button  type="text" @click="viewMember(scope.row.uid,scope.row.bankroll_info ? scope.row.bankroll_info.id : '')" size="small">查看</el-button>
            				<el-button type="text" @click="editMember(scope.row.uid)" size="small">编辑</el-button>
            				<el-button type="text" v-if="scope.row.stat == '1'" @click="turnMember(scope.row.uid, 2)" size="small">启用</el-button>
            				<el-button type="text" v-if="scope.row.stat == '2'" @click="turnMember(scope.row.uid, 1)" size="small">停用</el-button>
            				<el-popover
					        	placement="top"
					        	width="200"
					        	trigger="click"
					        	v-model="scope.row.popover"
				        		>
								<p>确定删除该客户吗？</p>
								<div style="text-align: right; margin: 0">
								    <el-button size="mini" type="text" @click="scope.row.popover = false">取消</el-button>
								    <el-button type="primary" size="mini" @click="delMember(scope.row.uid)">确定</el-button>
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
                <el-checkbox @change="seleceAll" :indeterminate="selection.length !== 0 && selection.length !== memberList.length" v-model="selectAllStatus" size="small">全选</el-checkbox>
                <span class="op_project"><el-button type="text" size="small" @click="delAll">删除</el-button></span>
                <span class="op_project"><el-button type="text" size="small" @click="startMember">启用</el-button></span>
                <span class="op_project"><el-button type="text" size="small" @click="stopMember">停用</el-button></span>
                <el-popover
				  	ref="popover4"
				  	placement="top-start"
				  	width="200"
				  	trigger="hover"
				  	popper-class="member-level-popover">
				  	<div class="member-level-area">
				  		<el-radio-group v-model="selectedLevelList" @change="selectLevelChange">
	    					<el-radio v-for="level in levelList" :label="level.id" :key="level.id" :title="level.name">{{level.name}}</el-radio>
	  					</el-radio-group>
	  					<div class="member-level-btn"><el-button type="text" size="small" @click="showLevelListTable = true">+新增分组</el-button></div>
				  	</div>
				  	<el-button slot="reference" type="text" size="small" style="margin-left: 10px;">指定分组</el-button>
				</el-popover>
			</div>
        </pages>
        <el-dialog title="" :visible.sync="showLevelListTable" @close="closeLevelListTable" custom-class="dialog-tag-list">
		  	<level-list-table style="margin-bottom: 10px" v-if="showLevelListTable"></level-list-table>
		  	<div class="btn-area bottom">
		  		<el-button plain size="small" @click="showLevelListTable = false">关闭</el-button>
		  	</div>
		</el-dialog>
		<view-member-dialog :id="view.viewId" :accountId="view.accountId" :visibility.sync="view.showViewDialog" v-if="view.showViewDialog"></view-member-dialog>
		<import-member :visibility.sync="showImportDialog" v-if="showImportDialog" @importSuccess="getFilterParam()"></import-member>
		<export-member :visibility.sync="showExportDialog" v-if="showExportDialog"></export-member>
	</div>
</template>
<script>
	import pageTitle from '@components/pageTitle';
	import pages from '@components/pages';
	import operation from '@components/operation';
	import levelListTable from './levelList';
	import viewMemberDialog from './viewMember';
	import importMember from './importMember';
	import exportMember from './exportMember';
	export default {
		data() {
			return {
				memberList: [],
				totalCount: 0,
				filterParam: {},
				selection: [],
				levelList: [],
				selectedLevelList: '',
				showLevelListTable: false,
				showImportDialog: false,
				selectAllStatus: false,
				view: {
					viewId: '',
					showViewDialog: false,
					accountId:''
				},
				isLoading: false,
				showExportDialog: false
			}
		},
		watch: {
			selection: {
				handler(v) {
					this.setSelectedLevelList(v);
				}
			}
		},
		mounted() {
			this.getFilterParam();
			this.getLevelList();
		},
		methods: {
			getFilterParam(type) {
				if (!type) {
                    this.filterParam = {};
                    this.$refs.operation.clear();
                }
                this.filterParam.page_index = this.$route.query.currentPage ? parseInt(this.$route.query.currentPage)-1 : 0;
                this.filterParam.page_size = this.$route.query.pageSize ? parseInt(this.$route.query.pageSize) : 10;
				this.getMemberList();
			},
			getSearchParam(msg) {
				this.$router.push({
					query: {
						currentPage: 1,
                        pageSize: 10
					}
				});
				this.filterParam = {};
                this.filterParam[msg.search_select] = msg.search_value;
                this.getFilterParam('search');
			},
			//获取客户列表
			getMemberList(setProSelection = false, uids = '') {
				this.isLoading = true;
				// this.filterParam.neo = "1";
				this.$api("member.getMemberList", this.filterParam).then((result) => {
					this.memberList = result.list;
					this.totalCount = result.total;
					this.isLoading = false;
					if (setProSelection) {
						this.$nextTick(() => {
							let allIds = uids.split(",");
							allIds.forEach((v) => {
		                		let index = this.memberList.findIndex(n => n.uid == v);
		                		if (index > -1) {
		                			this.$refs.memberTable.toggleRowSelection(this.memberList[index], true);
		                		}
		                	});
						});
					}
				}, (error) => {
					this.isLoading = false;
					if (error && error.data && error.data.status == 102) {
                    	this.memberList = [];
                    	this.totalCount = 0;
                    } else {
                    	this.$message({
                            type: 'error',
                            message: '加载数据出错'
                        });
                    }
				});
			},
			//标签列表
			getLevelList() {
				this.$api("member.getLevelList").then((result) => {
					this.levelList = result;
				}, (error) => {
                    if (error && error.data && error.data.status == 102) {
                    	this.levelList = [];
                    } else {
                    	this.$message({
                            type: 'error',
                            message: '获取客户分组列表失败！'
                        });
                    }
				});
			},
			//新增客户
			addNewMember() {
				this.$router.push({
                    name: 'member_add',
                    query: {
                        id: '-1'
                    }
                });
			},
			//查看客户
			viewMember(id,accountId) {
				this.view.viewId = id;
				this.view.accountId = accountId;
				this.view.showViewDialog = true;
			},
			//编辑客户
			editMember(id) {
				this.$router.push({
                    name: 'member_add',
                    query: {
                        id: id
                    }
                });
			},
			//全部删除
			delAll() {
				if (this.selection.length == 0) {
                    this.$message.error('请选择要删除的客户');
                    return;
				}
				this.$confirm('是否删除这些客户？', '删除客户', {
		          	confirmButtonText: '确定',
		          	cancelButtonText: '取消',
		          	type: 'warning'
		        }).then(() => {
		        	this.delMember(this.selection);
		        });
			},
			//删除客户
			delMember(id) {
				if (Object.prototype.toString.call(id) =='[object Array]') {
					let ids = '';
					id.forEach((v, i) => {
						ids += v.uid;
						if (i != id.length-1) {
							ids += ',';
						}
					});
					id = ids;
				}
				this.$api("member.delMember", {uid: id}).then((result) => {
					this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    this.getMemberList();
				}, (error) => {
					if (error && error.data && error.data.status == 301) {
						this.$message({
	                        type: 'error',
	                        message: error.data.msg
	                    });
					} else {
						this.$message({
	                        type: 'error',
	                        message: '删除失败！'
	                    });
					}
				});
			},
			//启用客户
			startMember() {
				if (this.selection.length == 0) {
                    this.$message.error('请选择要启用的客户');
                    return;
				}
		        this.turnMember(this.selection, '2');
			},
			//停用客户
			stopMember() {
				if (this.selection.length == 0) {
                    this.$message.error('请选择要停用的客户');
                    return;
				}
		       	this.turnMember(this.selection, '1');
			},
			//启用/停用客户  1停用2启用
			turnMember(id, type) {
				let ids = '';
				if (Object.prototype.toString.call(id)=='[object Array]') {
					id.forEach((v, i) => {
						ids += v.uid;
						if (i != id.length-1) {
							ids += ',';
						}
					});
				} else {
					ids = id;
				}
				let data = {
					uids: ids,
					stat: type
				}
				this.$api("member.turnMember", data).then((result) => {
					if (Object.prototype.toString.call(id)=='[object Array]') {
						this.$message({
	                        type: 'success',
	                        message: type == '1' ? ('停用成功，停用数量' + id.length + '。') : ('启用成功，启用数量' + id.length + '。')
	                    });
					} else {
						this.$message({
	                        type: 'success',
	                        message: type == '1' ? '停用成功！' : '启用成功！'
	                    });
					}
                    this.getMemberList();
				}, (error) => {
					this.$message({
                        type: 'error',
                        message: type == '1' ? '停用失败！' : '启用失败！'
                    });
				});
			},
			//根据所选客户勾选客户分组
			setSelectedLevelList(selection) {
				if (this.selectedLevelList === '') {
					return;
				}
				for (let i=0; i < selection.length; i++) {
					if (selection[i].level_id != this.selectedLevelList) {
						this.selectedLevelList = '';
						break;
					}
				}
			},
			//指定标签
			selectLevelChange() {
				if (this.selection.length == 0) {
                    this.$message.error('请选择要指定分组的客户');
                    this.selectedLevelList = '';
                    return;
				}
				let ids = '';
				this.selection.forEach((v, i) => {
					ids += v.uid;
					if (i != this.selection.length-1) {
						ids += ',';
					}
				});
				let data = {
					levelId: this.selectedLevelList,
					uids: ids
				}
				this.$api("member.setMemberLevel", data).then((result) => {
					this.$message({
                        type: 'success',
                        message: '指定分组成功!'
                    });
                    this.getMemberList(true, ids);
				}, (error) => {
					this.$message({
                        type: 'error',
                        message: '指定分组失败！'
                    });
				});
			},
			//关闭新增标签回调
			closeLevelListTable() {
				this.getLevelList();
			},
			//选择项变更
			handleSelectionChange(selection) {
				this.selection = selection;
				if (this.selection.length === this.memberList.length) {
					this.selectAllStatus = true;
				} else {
					this.selectAllStatus = false;
				}
			},
			//全选
            seleceAll(val) {
                this.memberList.forEach(row => {
                    this.$refs.memberTable.toggleRowSelection(row, val);
                });
			},
			//导入弹窗
			openImportDialog() {
				this.showImportDialog = true;
			}
		},
		components: {
			pageTitle,
			pages,
			operation,
			levelListTable,
			viewMemberDialog,
			importMember,
			exportMember
		}
	}
</script>
<style>
	.member-level-popover {padding: 0;}
	.member-level-area .el-radio-group {padding: 10px; border-bottom: 1px solid #ddd; display: block;}
	.member-level-area .el-radio{ display: block; }
	.member-level-area .el-radio+.el-radio {margin-left: 0; margin-top: 5px;}
	.member-level-area .el-radio__label {font-size: 12px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; word-break: break-all; width: 160px; vertical-align: middle; display: inline-block; height: 14px;}
	.member-level-area .member-level-btn {padding-left: 10px;}
	.member-level-area .member-level-btn .el-button--small {padding: 8px 0;}
	.dialog-tag-list {min-width: 700px;}
</style>
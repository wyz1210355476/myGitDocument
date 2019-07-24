<template>
	<div class="contents">
		<page-title title="子账号授权" goback></page-title>
		<div class="anthority-box" v-loading="isLoading">
	        <div class="all-box">
	          	<div class="anthority">
	            	<el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange"></el-checkbox>
	            	<span class="authority-text">全部权限</span>
	          	</div>
	          	<!-- <el-button type="text" class="btn-copy" @click="copyOtherAccount" size="small">复用已添加子账号权限</el-button> -->
	        </div>
	        <div class="item-box">
	          	<anthority-check v-for="(authority, index) in authorityList" ref="anthorityCheck" v-model="selections[index]" :key="authority.id" :data="authority" border @change="handleSelectChange($event, index)"></anthority-check>
	        </div>
		</div>
		<div class="btn-area left">
			<el-button type="primary" @click="save" class="btn-send" size="small" :loading="isBtnLoading">保存</el-button>
			<el-button @click="cancel" size="small" plain>取消</el-button>
		</div>
		<!-- <copy-list :visibility.sync="showCopyDialog" v-if="showCopyDialog" @copy="getCopyAccoutDetail"></copy-list> -->
	</div>
</template>
<script>
	import pageTitle from '@components/pageTitle';
	import copyList from './copyAccountList';
	import anthorityCheck from './components/anthority-check';
	export default {
		data() {
			return {
				id: this.$route.query.id,
				checkAll: false,
				checkItem: [],
				isIndeterminate: false,
				showCopyDialog: false,
				authorityList: [],
				selections: [],
				isLoading: false,
				isBtnLoading: false
			}
		},
		mounted() {
			this.getAuthorityList();
		},
		methods: {
			//获取权限列表
			getAuthorityList() {
				this.isLoading = true;
				this.$api("authority.getAuthorityList", {memberCode: this.id}).then((result) => {
					this.sortAuthorityData(result.childrens);
					this.isLoading = false;
				}, (error) => {
					this.$message({
                        type: 'error',
                        message: '获取权限列表出错'
                    });
                    this.isLoading = false;
				});
			},
			//整理权限数据
			sortAuthorityData(authoritys) {
				let authorityList = [];
				let selections = [];
				let checkItem = [];
				authoritys.forEach((v, i) => {
					authorityList.push({
						id: v.action,
						name: v.name,
						childrens: []
					});
					selections.push([]);
					checkItem.push({
						id: v.action,
						name: v.name,
						checked: 0
					});
					if (v.childrens && v.childrens.length && v.childrens.length != 0) {
						v.childrens.forEach((val) => {
							if (val.childrens && val.childrens.length && val.childrens.length != 0) {
								val.childrens.forEach((value) => {
									authorityList[i].childrens.push({
										id: value.action,
										name: value.name
									});
								});
								if (value.check) {
									selections[i].push(value.action);
								}
							} else {
								authorityList[i].childrens.push({
									id: val.action,
									name: val.name
								});
								if (val.check) {
									selections[i].push(val.action);
								}
							}

						});
						if (selections[i].length == authorityList[i].childrens.length) {
							checkItem[i].checked = 2;
						} else if (selections[i].length != 0) {
							checkItem[i].checked = 1;
						}
					}
				});
				this.authorityList = authorityList;
				this.selections = selections;
				this.checkItem = checkItem;
				this.isCheckAll();
			},
			//判断是否勾选全选
			isCheckAll() {
				let count = 0;
				let isCheckPart = false;
				this.checkItem.forEach((value) => {
					if (value.checked == 2) {
						count += 1;
					} else if (value.checked == 1) {
						isCheckPart = true;
					}
				});
				if (count == 0 && !isCheckPart) {
					this.checkAll = false;
					this.isIndeterminate = false;
				} else if (count == this.checkItem.length) {
					this.checkAll = true;
					this.isIndeterminate = false;
				} else {
					this.checkAll = false;
					this.isIndeterminate = true;
				}
			},
			//选项变更处理
			handleSelectChange(msg, index) {
				this.checkItem[index].checked = msg.checkState;
				this.isCheckAll();
			},
			//全选
			handleCheckAllChange(val) {
				this.selections.forEach((v, i) => {
					this.$refs.anthorityCheck[i].toggleAllItem(val);
				});
			},
			//复用子账号权限窗口
			copyOtherAccount() {
				this.showCopyDialog = true;
			},
			//复用子账号权限信息
			getCopyAccoutDetail(msg) {
				this.sortAuthorityData(msg);
			},
			//保存
			save() {
				let data = {
					permissionJson: []
				}
				this.selections.forEach((v) => {
					v.forEach((value) => {
						data.permissionJson.push({
							userId: this.id,
							action: value
						})
					});
				});
				this.checkItem.forEach((v) => {
					if (v.checked == 1 || v.checked == 2) {
						data.permissionJson.push({
							userId: this.id,
							action: v.id
						})
					}
				});
				this.isBtnLoading = true;
				this.$api("authority.saveAnthoritySet", data).then((result) => {
					this.$message({
		            	type: 'success',
		            	message: '保存成功!'
		        	});
		        	this.isBtnLoading = false;
		        	this.$router.push({
						name: 'authority_accountList'
					});
				}, (error) => {
					this.isBtnLoading = false;
					this.$message({
		            	type: 'error',
		            	message: '保存失败!'
		        	});
				});
			},
			//取消
			cancel() {
				this.$router.push({
					name: 'authority_accountList'
				});
			}
		},
		components: {
			pageTitle,
			copyList,
			anthorityCheck
		}
	}
</script>
<style scoped>
	.anthority-box {margin-top: 20px; margin-bottom: 20px;}
	.all-box {padding-left: 10px; padding-right: 10px; background: #f4f4f4; border: 1px solid #e0e0e0;}
	.anthority-box .anthority {width: 150px; margin-right: 30px; margin-left: 0; display: inline-block;}
	.btn-copy { float: right;}
	.btn-area.left {padding-left: 48px;}
</style>
<style>
	.anthority-box .anthority-title .anthority {width: auto;}
	.all-box .anthority .el-checkbox__label,
	.anthority-box .anthority .el-checkbox__label {display: none;}
	.all-box .anthority .authority-text,
	.anthority-box .anthority .authority-text {font-size: 12px; color: #666; height: 38px; line-height: 38px; margin-left: 20px; display: inline-block;}
	.anthority-box .anthority-title .anthority .authority-text {font-weight: bold;}
	.anthority-box .check-all-box.border .check-title-box {border-top: none;}
</style>
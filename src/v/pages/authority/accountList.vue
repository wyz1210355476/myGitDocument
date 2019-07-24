<template>
	<div class="contents">
		<page-title title="权限设置"></page-title>
		<el-button type="primary" size="small" @click="addNewAccount">创建子账号</el-button>
		<div class="content-table">
			<el-table :data="accountList" style="width: 100%" size="mini" v-loading="isLoading">
				<el-table-column label="账号" prop="alias">
		        </el-table-column>
		        <el-table-column label="名称" prop="memName">
		        </el-table-column>
		        <el-table-column label="权限">
		            <template slot-scope="scope">
		                <span v-for="(item, index) in scope.row.menuList" :key="item.id">{{item}}<span v-if="index!=(scope.row.menuList.length-1)"> / </span></span>
		            </template>
		        </el-table-column>
		        <el-table-column label="状态" align="center">
		            <template slot-scope="scope">
		                <span :class="{green: scope.row.state == 0, red: scope.row.state != 0}">{{scope.row.state == 0 ? "开通" : "已暂停"}}</span>
		            </template>
		        </el-table-column>
		        <el-table-column label="操作">
		            <template slot-scope="scope">
		                <el-button type="text" class="btn-authorize" @click="goToAuthorization(scope.row.memberCode)" size="small">授权</el-button>
		            </template>
		       	</el-table-column>
			</el-table>
		</div>
		<add-account :visibility.sync="showAddAccountDialog" v-if="showAddAccountDialog" @save="getAccountList"></add-account>
	</div>
</template>
<script>
	import pageTitle from '@components/pageTitle';
	import addAccount from './addAccount';
	import customEditor from '@components/customEditor';
	export default {
		data() {
			return {
				accountList: [],
				showAddAccountDialog: false,
				isLoading: false
			}
		},
		mounted() {
			this.getAccountList();
		},
		methods: {
			//获取账号列表
			getAccountList() {
				this.isLoading = true;
				this.$api("authority.getAccountList").then((result) => {
					this.accountList = result;
					this.isLoading = false;
				}, (error) => {
					this.isLoading = false;
                    if (error && error.data && error.data.status == 102) {
                    	this.accountList = [];
                    } else {
                    	this.$message({
                            type: 'error',
                            message: '加载数据出错'
                        });
                    }
				});
			},
			//创建子账号
			addNewAccount() {
				this.showAddAccountDialog = true;
			},
			//授权
			goToAuthorization(id) {
				this.$router.push({
					name: 'authority_set',
					query: {
						"id": id
					}
				});
			}
		},
		components: {
			pageTitle,
			addAccount,
			customEditor
		}
	}
</script>
<style>

</style>
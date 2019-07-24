<template>
	<div>
		<el-dialog
		  	title="复用子账号权限"
		  	:visible.sync="visible">
		  	<div class="order-form">
		  		<el-table :data="accountList" size="mini" style="width: 100%;">
          			<el-table-column label="账号">
			            <template slot-scope="scope">
			                <el-radio class="radio-authority" v-model="accountSelected" :label="scope.row.memberCode" name="accountSelected">{{scope.row.alias}}</el-radio>
			            </template>
		          	</el-table-column>
		          	<el-table-column label="名称">
			            <template slot-scope="scope">
			              	{{scope.row.memName}}
			            </template>
		          	</el-table-column>
		          	<el-table-column label="权限">
			            <template slot-scope="scope">
			              	<span v-for="(item, index) in scope.row.menuList" :key="index">{{item}}<span v-if="index!=(scope.row.menuList.length-1)"> / </span></span>
			            </template>
		          	</el-table-column>
		        </el-table>
		  		<div class="btn-area bottom">
					<el-button @click="cancel" size="small" plain>取消</el-button>
					<el-button type="primary" @click="sureSelectedAccount" class="btn-send" size="small" :loading="isLoading">保存</el-button>
				</div>
		  	</div>
		</el-dialog>
	</div>
</template>
<script>
	import dialogVisibility from '@c/mixins/dialogVisibility';
	export default {
		data() {
			return {
				accountList: [],
				accountSelected: '',
				isLoading: false
			}
		},
		mixins: [dialogVisibility],
		mounted() {
			this.getAccountList();
		},
		methods: {
			//获取账号列表
			getAccountList() {
				this.$api("authority.getAccountList").then((result) => {
					this.accountList = result;
				}, (error) => {
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
			//确定
			sureSelectedAccount() {
				this.isLoading = true;
				this.$api("authority.getAuthorityList", {memberCode: this.accountSelected}).then((result) => {
					this.isLoading = false;
					this.visible = false;
					this.$emit('copy', result.childrens);
				}, (error) => {
					this.$message({
                        type: 'error',
                        message: '获取权限列表出错'
                    });
				});
			},
			//取消
			cancel() {
				this.visible = false;
			}
		}
	}
</script>
<style scoped>
	.order-form {margin-bottom: 40px;}
</style>
<style>

</style>
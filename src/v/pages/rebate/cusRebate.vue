<template>
	<div class="contents">
		<page-title title="返利明细"></page-title>
		<operation ref="operation" module="cus_rebate" @search="getSearchParam">
            <div slot="btn">
            	<div class="rebate-filter-item">
            		<span>客户分组：</span>
            		<el-select v-model="cusFilter.levelName" size="small" @change="filterValueChange">
					    <el-option label="全部" value=""></el-option>
					    <el-option v-for="level in levelList" :label="level.name" :value="level.id" :key="level.id"></el-option>
					</el-select>
            	</div>
            	<!-- <div class="rebate-filter-item">
            		<el-select v-model="cusFilter.filterName" size="small">
					    <el-option label="剩余返利" value="1"></el-option>
					    <el-option label="累计返利" value="2"></el-option>
					    <el-option label="已使用返利" value="3"></el-option>
					</el-select>
					<span>：</span>
					<div class="rebate-filter-value">
						<el-col :span="11">
      						<el-input v-model="cusFilter.filterValue1" size="small"></el-input>
    					</el-col>
    					<el-col class="line" :span="2">-</el-col>
    					<el-col :span="11">
      						<el-input v-model="cusFilter.filterValue2" size="small"></el-input>
    					</el-col>
					</div>
					<el-button type="primary" size="mini" class="rebate-filter-btn" @click="filterValueChange">确定</el-button>
            	</div> -->
            </div>
        </operation>
        <div class="content-table">
			<el-table :data="memberList" style="width: 100%" size="mini" v-loading="isLoading" class="table-one-line">
				<el-table-column label="客户账号">
					<template slot-scope="scope">
                        <div class="one-line" :title="scope.row.loginid">{{scope.row.loginid}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="姓名">
                	<template slot-scope="scope">
                        <div class="one-line" :title="scope.row.truename">{{scope.row.truename}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="客户分组">
                	<template slot-scope="scope">
                        <div class="one-line" :title="scope.row.level_name">{{scope.row.level_name}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="手机号码" prop="mobile" v-if="$version === 'neimao'" width="100">
                </el-table-column>
                <el-table-column label="邮箱" v-if="$version === 'waimao'">
                	<template slot-scope="scope">
                        <div class="one-line" :title="scope.row.email">{{scope.row.email}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="剩余返利" prop="bankroll_info.left_balance">
                </el-table-column>
                <el-table-column label="累计返利" prop="bankroll_info.accumulated_balance">
                </el-table-column>
                <el-table-column label="已使用返利" prop="bankroll_info.used_balance">
                </el-table-column>
                <el-table-column label="明细" width="90">
                    <template slot-scope="scope">
                    	<el-button type="text" @click="viewDetail(scope.row.bankroll_info ? scope.row.bankroll_info.id : '')" size="small">查看明细</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="90">
                    <template slot-scope="scope">
                    	<el-button type="text" @click="manualIncreaseAndDecrease(scope.row.bankroll_info ? scope.row.bankroll_info.id : '')" size="small">手工增减</el-button>
                    </template>
                </el-table-column>
			</el-table>
		</div>
		<pages :total="totalCount" @change="getFilterParam('page')"></pages>
		<cus-rebate-detail :visibility.sync="showCusRebateDetail" :id.sync="viewDetailId" v-if="showCusRebateDetail"></cus-rebate-detail>
		<adjust-rebate :visibility.sync="showAdjustRebate" :id.sync="adjustId" v-if="showAdjustRebate" @update="getMemberList"></adjust-rebate>
	</div>
</template>
<script>
	import pageTitle from '@components/pageTitle';
	import operation from '@components/operation';
	import cusRebateDetail from './cusRebateDetail';
	import adjustRebate from './adjustRebate';
	import pages from '@components/pages';
	export default {
		data() {
			return {
				memberList: [],
				levelList: [],
				totalCount: 0,
				filterParam: {
					page_index: 1,
					page_size: 10
				},
				isLoading: false,
				viewDetailId: '',
				showCusRebateDetail: false,
				adjustId: '',
				showAdjustRebate: false,
				cusFilter: {
					levelName: '',
					// filterName: '',
					// filterValue1: '',
					// filterValue2: ''
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
				this.cusFilter = {
					levelName: '',
					// filterName: '',
					// filterValue1: '',
					// filterValue2: ''
				}
                this.filterParam[msg.search_select] = msg.search_value;
                this.getFilterParam('search');
			},
			filterValueChange() {
				// if (this.cusFilter.filterName === '' && (this.cusFilter.filterValue1 !== '' || this.cusFilter.filterValue2 !== '')) {
				// 	this.$message({
    //                     type: 'error',
    //                     message: '请选择要筛选的项！'
    //                 });
				// 	return;
				// }
				this.$router.push({
					query: {}
				});
				this.filterParam = {};
				this.$refs.operation.clear();
				this.getFilterParam('filter');
			},
			//获取客户返利列表
			getMemberList() {
				this.isLoading = true;
				let data = this.cusFilter.levelName === '' ? {neo: 1} : {level_id: this.cusFilter.levelName, neo: 1};
				Object.assign(data, this.filterParam);
				this.$api("member.getMemberList", data).then((result) => {
					this.memberList = result.list;
					this.totalCount = result.total;
					this.isLoading = false;
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
			//获取客户分组列表
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
			//查看明细
			viewDetail(id) {
				this.viewDetailId = id;
				this.showCusRebateDetail = true;
			},
			//手工增减
			manualIncreaseAndDecrease(id) {
				this.adjustId = id;
				this.showAdjustRebate = true;
			}
		},
		components: {
			pageTitle,
			operation,
			cusRebateDetail,
			adjustRebate,
			pages
		}
	}
</script>
<style scoped>
	.rebate-filter-item {display: inline-block; vertical-align: middle; margin-right: 30px; height: 32px;}
	.rebate-filter-item .rebate-filter-value {display: inline-block; vertical-align: bottom; width: 200px; margin-left: 10px;}
	.rebate-filter-item .rebate-filter-value .line {text-align: center; line-height: 32px;}
</style>
<style>
	.rebate-filter-item .el-select {width: 130px;}
	.rebate-filter-item .rebate-filter-btn {margin-left: 10px;}
</style>
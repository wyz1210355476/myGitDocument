<template>
	<div class="contents">
		<page-title :title="'物流公司'"></page-title>
		<div class="content-table">
			<el-table :data="companyList" style="width: 100%">
                <el-table-column prop="logisticsCompany" label="物流公司" sortable>
            	</el-table-column>
            	<el-table-column prop="sort" label="排序" sortable>
            	</el-table-column>
            	<el-table-column prop="logisticsCompanyWebsite" label="物流公司网址" sortable>
            	</el-table-column>
            	<el-table-column prop="queryWebsite" label="查询接口网址" sortable>
            	</el-table-column>
            	<el-table-column prop="companyCode" label="物流公司代码" sortable>
           		</el-table-column>
           		<el-table-column label="操作" prop="operation">
           			<template slot-scope="scope">
				        <el-button
				          @click.native.prevent="disable(scope.$index, companyList[scope.$index].operation)"
				          type="text"
				          size="">
				          {{companyList[scope.$index].operation}}
				        </el-button>
			      </template>
            	</el-table-column>
			</el-table>
		</div>
		<pages :total="totalCount" @change="getPagesParam"></pages>
	</div>
</template>
<script>
	import pageTitle from '@components/pageTitle';
	import pages from '@components/pages';

	export default {
		data() {
			return {
				companyList: [],
				totalCount: 10
			}
		},
		mounted() {
			this.getCompanyList();
		},
		methods: {
			getTypeParam(tab) {
				this.filterParam.type = tab;
				this.filterParam.currentPage = 1;
				this.filterParam.pageSize = 10;
				this.getCompanyList();
			},
			getPagesParam(page) {
				this.filterParam.currentPage = page.currentPage;
				this.filterParam.pageSize = page.pageSize;
				this.getCompanyList();
			},
			getCompanyList() {
				this.$api("order.logisticsCompany", {}).then(() => {
					alert("0")
				}, ()=>{
					alert("1")
				})
				this.companyList = [{
					logisticsCompany: '精英速运',
					sort: '0',
					logisticsCompanyWebsite: 'http://www.core.com/',
					queryWebsite: 'http://www.core.com/query',
					companyCode: 'jysy',
					operation:"停用"
				},{
					logisticsCompany: '精英速运',
					sort: '0',
					logisticsCompanyWebsite: 'http://www.core.com/',
					queryWebsite: 'http://www.core.com/query',
					companyCode: 'jysy',
					operation:"启用"
				}]
			},
			disable(a,b){
				if(b === "启用"){
					this.companyList[a].operation = "停用"
				}else{
					this.companyList[a].operation = "启用"
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
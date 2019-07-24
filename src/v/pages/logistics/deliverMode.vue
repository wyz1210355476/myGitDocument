<template>
	<div class="contents">
		<page-title :title="'配送方式'"></page-title>

		<div slot="btn">
			<el-button type="primary" size="small" @click="addDeliverMode">新增</el-button>
		</div>

		<div class="content-table">
			<el-table :data="deliverModeList" style="width: 100%" size="mini" v-loading="isLoading" empty-text="没有相关信息" class="table-one-line">
                <el-table-column prop="name" label="配送方式">
                	<template slot-scope="scope">
            			<span class="one-line">{{scope.row.name}}</span>
            		</template>
            	</el-table-column>
            	<el-table-column prop="corp_name" label="物流公司">
            	</el-table-column>
            	<el-table-column prop="index" label="排序" sortable>
            	</el-table-column>
            	<el-table-column prop="cod_enable" label="货到付款">
            		<template slot-scope="scope">
            			<span v-if="scope.row.cod_enable == '1'">是</span>
            			<span v-else>否</span>
            		</template>
            	</el-table-column>
            	<el-table-column prop="disabled" label="状态">
            		<template slot-scope="scope">
            			<span v-if="scope.row.disabled == '1'">启用</span>
            			<span v-else>停用</span>
            		</template>
           		</el-table-column>
           		<el-table-column label="操作" prop="operation">
           			<template slot-scope="scope">
				        <el-button
				          @click.native.prevent="$edit(scope.$index)"
				          type="text"
				          size="small">
				          编辑
				        </el-button>
				        <el-button
				          @click.native.prevent="$ceDelete(scope.$index)"
				          type="text"
				          size="small">
				          删除
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
	import router from '@c/router';
	export default {
		data() {
			return {
				isLoading:false,
				deliverModeList: [],
				totalCount: 0
			}
		},
		mounted() {
			var pageSize = this.$route.query.pageSize ? parseInt(this.$route.query.pageSize) : 10,
				// recordFrom = ((this.$route.query.currentPage ? parseInt(this.$route.query.currentPage) : 1)-1)*pageSize;
				recordFrom = this.$route.query.currentPage ? parseInt(this.$route.query.currentPage) : 1;

			this.getDeliverModeList({'recordFrom':recordFrom,'pageSize':pageSize});
		},
		methods: {
			getPagesParam(page) {
				var currentPage = page.currentPage,
					pageSize = page.pageSize,
					recordFrom = (currentPage-1)*pageSize;
				this.getDeliverModeList({'recordFrom':currentPage,'pageSize':pageSize});
			},
			getDeliverModeList(pageParam) {
				this.isLoading = true;
				this.$api("logistics.deliverModeList", {map:{'page':pageParam.recordFrom,'pageSize':pageParam.pageSize,sort:[{'index':'asc'}]}}).then((result) => {
					this.isLoading = false;
					this.deliverModeList = result.list;
					this.totalCount = result.page.total;
				}, (result)=>{
					this.isLoading = false;
					if(result.data.status != '102'){
						this.$message({
							message: result.data.msg,
							type: 'error'
						});
					}
				})


			},
			$edit(index){
				router.push({name: 'addOrEditDeliverMode', query: {page: "edit",id:this.deliverModeList[index].id}});
			},
			$ceDelete(index){
				let state = this.deliverModeList[index].disabled;
				if(state == 1){
					this.$message({
						message: '请先停用配送方式，再执行删除操作！',
						type: 'warning'
					});
				}else{
					this.$confirm('是否确认删除此配送方式？', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						var delId = this.deliverModeList[index].id;
						console.log(delId)
						this.$api("logistics.deleteLogistics", {map:{id:delId}}).then((result) => {
							this.deliverModeList.splice(index,1);
							this.totalCount--;
							this.$message({
								message: '操作成功！',
								type: 'success'
							});
						}, (result)=>{
							this.$message({
								message: result.data.msg,
								type: 'error'
							});
						})
					}).catch(() => {

					});
				}
			},
			addDeliverMode(state){
				router.push({name: 'addOrEditDeliverMode', query: {page: "add"}});
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
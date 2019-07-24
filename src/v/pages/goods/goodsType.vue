<template>
	<div class="contents">
		<page-title :title="'商品类型'"></page-title>
		<div class="topOp">
			<el-button type="primary" size="small" @click="addGoddsType()">新增</el-button>
		</div>
		<el-table :data="typeData" size="mini" ref="multipleTable" @selection-change="handleSelectionChange" v-loading="loading" class="table-one-line">
		  	<el-table-column type="selection" width="35"></el-table-column>
	      	<el-table-column label="类型名称" >
				<template slot-scope="scope">
		    		<span class="one-line" :title="scope.row.templateName">{{scope.row.templateName}}</span>
		    	</template>
	      	</el-table-column>
	      	<el-table-column prop="updateTime" label="最近修改时间" width="180"> </el-table-column>
	      	<el-table-column label="操作" width="120">
				<template slot-scope="scope">
					<el-button type="text" size="small" @click="addGoddsType(scope.row.id)">编辑</el-button>
					<el-popover
			        	class="ml10"
				        placement="top"
				        width="200"
				        trigger="click"
				        v-model="scope.row.popover" v-if="scope.row.defaulted != '1'">
						<p>是否删除"{{ scope.row.templateName }}"这个商品类型？</p>
						<div style="text-align: right; margin: 0">
						    <el-button size="mini" type="text" @click="scope.row.popover = false">取消</el-button>
						    <el-button type="primary" size="mini" @click="deleteGoodsType(scope.row.id,scope.$index)">确定</el-button>
						</div>
						<el-button slot="reference" type="text" size="small" :disabled="scope.row.useCount > 0">删除</el-button>
					</el-popover>
				</template>
	      	</el-table-column>
	    </el-table>
	    <pages :total="totalCount" @change="getParams('page')">
			<div slot="leftop">
				<el-checkbox @change="seleceAll" size="small" :indeterminate="multipleSelection.length!=0&&multipleSelection.length!=typeData.length" v-model="selectStatus">全选</el-checkbox>
				<span class="op_project"><el-button type="text" size="small" @click="deleteGoodsType()" >删除</el-button></span>
			</div>
		</pages>
	</div>
</template>
<script>
	import pageTitle from '@components/pageTitle'
	import pages from '@components/pages'

	export default {
		data() {
			return {
				selectStatus:false,
				loading:true,
				multipleSelection:[],
				totalCount:0,
				page:1,
				pageSize:10,
				typeData:[]
			}
		},
		mounted() {
			this.getType()
		},
		methods: {
			getType(obj){
				let params = {
					page:this.$route.query.currentPage || this.page,
					pageSize:this.$route.query.pageSize || this.pagesize
				}
				if(obj){Object.assign(params, obj)}
				this.$api("goods.getGoodsTypeByPage",params).then((result) => {
					this.loading = false
					this.totalCount = result.page.total
					this.typeData = result.list
				}, (error) => {
					this.loading = false
					if(error.data.status!=102){
						this.$message({ message: '查询商品类型出错', type: 'error' });
					}
				});
			},
			addGoddsType(id){
				let query = {}
				if(id != undefined){
					query.id = id
				}
				this.$router.push({name:'addGoodsType',query:query})
			},
			seleceAll(val){
				if(val && this.typeData.length > 0){
					this.typeData.forEach(row => {
			            this.$refs.multipleTable.toggleRowSelection(row,true);
			        });
				}else{
					this.$refs.multipleTable.clearSelection();
				}
			},
			handleSelectionChange(val) {
		        this.multipleSelection = val;
		        if(val.length == this.typeData.length){
		        	this.selectStatus = true
		        }else{
		        	this.selectStatus = false
		        }
		    },
			getParams(){
				let params = {
					'pagesize':this.$route.query.pageSize,
					'page':this.$route.query.currentPage,
				}
				this.getType(params)
			},
			deleteGoodsType(id,params){
				let paramsArr = []
				if(id == undefined){
					if(this.multipleSelection.length == 0){
						this.$message({ message: '请选择要删除的类型', type: 'warning' });
					}else{
						let flag = true;
						this.multipleSelection.forEach( (element) => {
							let useCount = this.typeData.find((n)=>n.id==element.id).useCount;
							if(useCount>0){
								flag = false
							}
							paramsArr.push(element.id)
						})
						if(!flag){
							this.$message({ message: '选中的商品类型有不可删除的', type: 'error' });return
						}


						this.$confirm('是否删除选中的商品类型?', '提示', {
					        confirmButtonText: '确定',
					        cancelButtonText: '取消',
					        type: 'warning'
				        }).then(() => {
				        	this.delecOp(paramsArr)
				        }).catch(() => {});
					}
				}else{
					paramsArr.push(id)
					this.delecOp(paramsArr)
				}
			},
			delecOp(paramsArr){
				this.$api("goods.deleteGoodsTypeById",{ids:paramsArr.join(',')}).then((result) => {
					this.$message({ message: '删除商品类型成功', type: 'success' });
					this.getType()
				}, (error) => {
					if(error.data.status=='202'){
						this.$message({ message: '类型被分类使用，无法删除', type: 'error' });
					}else{
						this.$message({ message: '删除商品类型出错', type: 'error' });
					}
				});
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

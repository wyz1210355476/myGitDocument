<template>
	<div class="contents">
		<page-title :title="'商品列表'"></page-title>
		<div class="topOp">
			<el-button type="primary" size="small" @click="addGoods()">新增</el-button>
			<operation ref="operation" class="floatR" module="goods_list" @search="getSearchParam"></operation>
		</div>
		<el-table :data="goodsData" size="mini" ref="multipleTable" @selection-change="handleSelectionChange" v-loading="loading" class="table-one-line">
		  	<el-table-column type="selection" width="35"></el-table-column>
	      	<el-table-column label="商品名称" >
				<template slot-scope="scope">
		    		<span class="one-line" :title="scope.row.name">{{scope.row.name}}</span>
		    	</template>
	      	</el-table-column>
	      	<el-table-column prop="code" label="商品编号" width="100"> </el-table-column>
			<el-table-column label="商品分类" width="150">
				<template slot-scope="scope">
		    		<span class="one-line" :title="scope.row.categoryName">{{scope.row.categoryName}}</span>
		    	</template>	
			</el-table-column>
			<el-table-column label="商品类型" width="150">
				<template slot-scope="scope">
		    		<span class="one-line" :title="scope.row.templateName">{{scope.row.templateName}}</span>
		    	</template>	
			</el-table-column>
			<el-table-column label="排序码" width="80">
				<template slot-scope="scope">
		    		<span class="one-line" :title="scope.row.sequence">{{scope.row.sequence}}</span>
		    	</template>	
			</el-table-column>
	      	<!-- <el-table-column prop="date" label="是否上架" width="100">
				<template slot-scope="scope">
					{{scope.row.status == 1 ? '是' : '否'}}
				</template>
	      	</el-table-column> -->
	      	<!-- <el-table-column label="销售价" width="100">
				<template slot-scope="scope">
					{{scope.row.retailPrice | toFixed(2)}}起
				</template>
	      	</el-table-column> -->
	      	<!-- <el-table-column label="市场价" width="100">
				<template slot-scope="scope">
					{{scope.row.price | toFixed(2)}}
				</template>
	      	</el-table-column> -->
	      	<el-table-column prop="weight" label="重量" width="100"> </el-table-column>
	      	<!-- <el-table-column prop="stock" label="库存" width="100"> </el-table-column> -->
	      	<el-table-column prop="unit" label="单位" width="100"> </el-table-column>
	      	<el-table-column label="图片标签" width="140">
				<template slot-scope="scope">
					<span class="one-line" v-if="scope.row.goodsMarkList!=null" v-for="(item,index) in scope.row.goodsMarkList" :key="item.id">{{item.markName}}
						<span v-if="index != scope.row.goodsMarkList.length-1">，</span>
					</span>
				</template>
	      	</el-table-column>
	      	<el-table-column label="操作" width="120">
				<template slot-scope="scope">
					<el-button type="text" size="small" @click="addGoods(scope.row.id)">编辑</el-button>
					<el-popover
			        	class="ml10"
				        placement="top"
				        width="200"
				        trigger="click"
				        v-model="scope.row.popover">
						<p>是否删除"{{ scope.row.name }}"这个商品？</p>
						<div style="text-align: right; margin: 0">
						    <el-button size="mini" type="text" @click="scope.row.popover = false">取消</el-button>
						    <el-button type="primary" size="mini" @click="scope.row.popover = false;deleteGoods(scope.row.id,scope.$index)">确定</el-button>
						</div>
						<el-button slot="reference" type="text" size="small" :disabled="scope.row.status == 1">删除</el-button>
					</el-popover>
				</template>
	      	</el-table-column>
	    </el-table>
	    <pages :total="totalCount" @change="getParams('page')">
			<div slot="leftop">
				<el-checkbox @change="seleceAll" size="small" :indeterminate="multipleSelection.length!=0&&multipleSelection.length!=goodsData.length" v-model="selectStatus">全选</el-checkbox>
				<span class="op_project"><el-button type="text" size="small" :disabled="multipleSelection.length==0" @click="deleteGoods()">删除</el-button></span>
				<span class="op_project">
					<el-popover placement="top-start" width="100" trigger="hover">
						<el-checkbox-group v-model="checkList" class="setLabel">
						    <el-checkbox class="item"
						    v-for="item in labelData" :key="item.id"
						    :indeterminate="checkIndeter(item.id)"
						    @change="setLabel($event,item)"
						    :label="item.id">{{item.markName}}</el-checkbox>
						</el-checkbox-group>
						<el-button type="text" size="small" slot="reference" :disabled="multipleSelection.length==0">添加标签</el-button>
					</el-popover>
				</span>
			</div>
		</pages>
	</div>
</template>
<script>
	import pageTitle from '@components/pageTitle'
	import pages from '@components/pages'
	import operation from '@components/operation'

	export default {
		data() {
			return {
				indeterList:[],
				checkList:[],
				selectStatus:false,
				loading:true,
				multipleSelection:[],
				totalCount:0,
				goodsData:[],
				labelData:[],
				page:1,
				pagesize:10,
				key:'',
				key_value:'',
			}
		},
		mounted() {
			this.getGoods()
			this.getLabel()
		},
		methods: {
			setMarkSelect(){
				this.indeterList=[]
				this.checkList=[]
				let markArr = {}
				this.multipleSelection.forEach( (el, index) => {
					if(el.goodsMarkList){
						el.goodsMarkList.forEach( (ele, index) => {
							if(markArr[ele.id]){
								markArr[ele.id] += 1
							}else{
								markArr[ele.id] = 1
							}
						});
					}
				});
				let len = this.multipleSelection.length
				for(var i in markArr){
					if(markArr[i] < len){
						this.indeterList.push(Number(i))
					}else{
						this.checkList.push(Number(i))
					}
				}
			},
			checkIndeter(id){
				return this.indeterList.findIndex((n)=>n==id) > -1 ? true : false
			},
			setLabel(val,item){
				let id = item.id
				if(this.multipleSelection.length == 0){
					this.$message({ message: '请选择商品', type: 'warning' });
					return
				}
				if(val && this.checkIndeter(id)){
					let index = this.indeterList.findIndex((n)=>n==id)
					this.indeterList.splice(index,1)
				}
				let ids = [];
				this.multipleSelection.forEach( (el, index) => {
					if(!el.goodsMarkList){el.goodsMarkList=[]}
					let index1 = el.goodsMarkList.findIndex((n)=>n.id==id)
					if(val && index1 == -1){
						ids.push(el.id)
					}else if(!val && index1 > -1){
						ids.push(el.id)
					}
				});
				let params = {
					ids:ids.join(","),
					markIds:id,
					operateType:val?'add':'delete'
				}
				this.$api("goods.addLabelToGoods",params).then((result) => {
					this.refreshLabel(ids,item,val);
					this.$message({ message: '设置商品标签成功', type: 'success' });
				}, (error) => {
					if(error.data.status!=102){
						this.$message({ message: '设置商品标签失败', type: 'error' });
					}
				});
			},
			refreshLabel(ids,item,val){
				ids.forEach( (el, index) => {
					let good = this.goodsData.find((n)=>n.id==el)
					if(!good.goodsMarkList){good.goodsMarkList=[]}
					let goodLabel = good.goodsMarkList.findIndex((n)=>n.id==item.id);
					if(val && goodLabel == -1){
						good.goodsMarkList.push(item)
					}else if(!val && goodLabel != -1){
						good.goodsMarkList.splice(goodLabel,1)
					}
				});
			},
			getLabel(){
				this.$api("goods.getGoodsLabel").then((result) => {
					this.labelData = result.list
				}, (error) => {
					if(error.data.status!=102){
						this.$message({ message: '查询商品标签出错', type: 'error' });
					}
				});
			},
			getGoods(obj){
				this.loading = true
				let params = {
					page:this.$route.query.currentPage || this.page,
					pageSize:this.$route.query.pageSize || this.pagesize
				}
				if(obj){Object.assign(params, obj)}
				this.$api("goods.getGoods",params).then((result) => {
					this.totalCount = result.page.total
					this.goodsData = result.list
					this.loading = false
				}, (error) => {
					this.loading = false
					if(error.data.status!=102){
						this.$message({ message: '查询商品列表出错', type: 'error' });
					}else{
						this.totalCount = 0
						this.goodsData = []
					}
				});
			},
			addGoods(id){
				let query = {}
				if(id != undefined){
					query.id = id
				}
				this.$router.push({name:'addGoods',query:query})
			},
			handleSelectionChange(val) {
		        this.multipleSelection = val;
		        if(val.length == this.goodsData.length){
		        	this.selectStatus = true
		        }else{
		        	this.selectStatus = false
		        }
		        this.setMarkSelect()
		    },
			seleceAll(val){
				if(val && this.goodsData.length > 0){
					this.goodsData.forEach(row => {
			            this.$refs.multipleTable.toggleRowSelection(row,true);
			        });
				}else{
					this.$refs.multipleTable.clearSelection();
				}
			},
			getSearchParam(val){
				console.log(val)
				// if(val.search_value==''){
				// 	this.$message({ message: '请输入关键字', type: 'error' });return
				// }
				this.key = val.search_select
				this.key_value = val.search_value
				this.getParams('search')
			},
			getParams(key){
				let params = {
					page:this.$route.query.currentPage || this.page,
					pageSize:this.$route.query.pageSize || this.pagesize
				}
				if(key == 'search'){
					params[this.key] = this.key_value
					this.$router.push({query:{currentPage:this.page,pageSize:this.pagesize}})
					params.page = this.page
					params.pageSize = this.pagesize
				}
				this.getGoods(params)
			},
			deleteGoods(id){
				let paramsArr = []
				if(id == undefined){
					if(this.multipleSelection.length == 0){
						this.$message({ message: '请选择要删除的商品', type: 'warning' });
					}else{
						let flag = true
						this.multipleSelection.forEach( (element) => {
							paramsArr.push(element.id)
							if(element.status == '1'){
								flag = false
							}
						})
						if(!flag){
							this.$message({ message: '所选商品有不可删除的', type: 'error' });return
						}
						this.$confirm('是否删除选中的商品?', '提示', {
					        confirmButtonText: '确定',
					        cancelButtonText: '取消',
					        type: 'warning'
				        }).then(() => {
				        	this.$api("goods.deleteGoods",{ids:paramsArr.join(',')}).then((result) => {
								this.$message({ message: '删除商品成功', type: 'success' });
								this.getGoods()
							}, (error) => {
								this.$message({ message: '删除商品出错', type: 'error' });
							});
				        }).catch(() => {});
					}
				}else{
					paramsArr.push(id)
					this.$api("goods.deleteGoods",{ids:paramsArr.join(',')}).then((result) => {
						this.$message({ message: '删除商品成功', type: 'success' });
						this.getGoods()
					}, (error) => {
						this.$message({ message: '删除商品出错', type: 'error' });
					});
				}
			},
		},
		components: {
			pageTitle,
			pages,
			operation
		}
	}
</script>
<style>
.setLabel{max-height: 130px; overflow-y:auto }
.setLabel .item{display: block; line-height: 26px; height: 26px; overflow: hidden;}
.setLabel .item+.item{margin-left: 0}
</style>

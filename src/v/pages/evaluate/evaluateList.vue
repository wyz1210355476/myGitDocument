<template>
	<div class="contents">
		<page-title :title="'评价列表'"></page-title>
		<div style="overflow:hidden">
		  	<div class="search_con">
		  		<div class="eva_auditing">
				  	管理员审核：
					<el-switch
				    v-model="needAuditing"
				    active-value="1"
				    inactive-value="0"
				    @change="changeAuditing()">
				  	</el-switch>
				</div>
				<div class="search-input">
					<operation ref="operation" module="evaluate_list" @search="getSearchParam"></operation>
		  		</div>
			</div>
		</div>
		<div class="content-table">
			<el-table :data="evaluteData" ref="multipleTable" @selection-change="handleSelectionChange" size="mini" v-loading="loading" class="table-one-line">
				<el-table-column type="selection" width="35"></el-table-column>
				<el-table-column label="商品名称" width="160">
					<template slot-scope="scope">
			    		<span class="one-line" :title="scope.row.object_name">{{scope.row.object_name}}</span>
			    	</template>
				</el-table-column>
			    <el-table-column prop="object_code" label="商品编号" width="100"></el-table-column>
			    <el-table-column label="发表人" width="100">
			    	<template slot-scope="scope">
			    		<span class="one-line" :title="scope.row.appraiser_name">{{scope.row.appraiser_name}}</span>
			    	</template>
			    </el-table-column>
			    <el-table-column prop="appraiser_contact" label="联系方式" width="160"></el-table-column>
			    <el-table-column prop="judgement_date" label="时间" width="160"></el-table-column>
			    <el-table-column label="内容" >
			    	<template slot-scope="scope">
			    		<span class="one-line" :title="scope.row.content">{{scope.row.content}}</span>
			    	</template>
			    </el-table-column>
				<el-table-column prop="display" label="前台是否显示" width="100">
					<template slot-scope="scope">
			    		{{scope.row.display == 0 ? '否' : '是'}}
			    	</template>
				</el-table-column>
			    <el-table-column label="操作" width="200">
			    	<template slot-scope="scope">
			    		<el-button type="text" size="small" @click="toDetail(scope.row.id)">查看</el-button>
			    		<el-button type="text" size="small" @click="auditing(scope.row.id)" v-if="scope.row.auditing == 0">审核</el-button>

			    		<el-popover
			    			class="ml10"
					        placement="top"
					        width="200"
					        trigger="click"
					        v-model="scope.row.popover">
							<p>是否删除"{{ scope.row.appraiser_name }}"发表的评论？</p>
							<div style="text-align: right; margin: 0">
							    <el-button size="mini" type="text" @click="scope.row.popover = false">取消</el-button>
							    <el-button type="primary" size="mini" @click="deleteEvaluate(scope.row.id)">确定</el-button>
							</div>
							<el-button slot="reference" type="text" size="small">删除</el-button>
						</el-popover>
			    	</template>
			    </el-table-column>
			</el-table>
		</div>

		<pages :total="totalCount" @change="getParams('page')">
			<div slot="leftop">
				<el-checkbox @change="selectAll" size="small" :indeterminate="multipleSelection.length!=0&&multipleSelection.length!=evaluteData.length" v-model="selectStatus">全选</el-checkbox>
				<span class="op_project"><el-button type="text" size="small" @click="deleteEvaluate()">删除</el-button></span>
			</div>
		</pages>

		<el-dialog title="商品评论" :visible.sync="detailVisible" :before-close="handleClose" width="800px">
			<detail :detailid="detailid" @close="getClose"></detail>
			<span slot="footer" class="dialog-footer">
			    <el-button @click="detailVisible = false" size="small">关闭</el-button>
			</span>
		</el-dialog>
	</div>
</template>
<script>
	import pageTitle from '@components/pageTitle'
	import pages from '@components/pages'
	import operation from '@components/operation'
	import detail from './evaluateDetail'

	export default {
		data() {
			return {
				selectStatus:false,
				loading:true,
				detailid:'',
				detailVisible:false,
				initAuditing:0,
				needAuditing:0,
				key:'name',
				key_value:'',

				evaluteData: [],
			    pagesize:10,
			    page:1,
			    totalCount:0,
			    multipleSelection:[]
			}
		},
		mounted() {
			this.getEvalute();
			this.getAutiding();
		},
		methods: {
			handleClose(){
				this.getEvalute()
				this.detailVisible = false
			},
			getClose(key){
				if(key){
					this.detailVisible = false
					this.getEvalute();
				}
			},
			getSearchParam(val){
				this.key = val.search_select
				this.key_value = val.search_value
				this.getParams('search')
			},
			selectAll(val){
				if(val && this.evaluteData.length > 0){
					this.evaluteData.forEach(row => {
			            this.$refs.multipleTable.toggleRowSelection(row,true);
			        });
				}else{
					this.$refs.multipleTable.clearSelection();
				}
			},
			auditing(id){
				this.$api("evalute.auditing",{id:id,audite:1}).then((result) => {
					this.getEvalute();
					this.$message({ message: '审核成功', type: 'success' });
				}, (error) => {
					this.$message({ message: '审核失败', type: 'error' });
				});
			},
			changeAuditing(){
				if(this.needAuditing == this.initAuditing){
					return;
				}
				let type = this.needAuditing == 0 ? '关闭' : '开启';
				this.$api("evalute.changeAuditing",{auditing:this.needAuditing}).then((result) => {
					this.initAuditing = this.needAuditing;
					this.$message({ message: type+'审核成功', type: 'success' });
				}, (error) => {
					this.$message({ message: type+'审核失败', type: 'error' });
				});
			},
			getAutiding(){
				this.$api("evalute.needAuditing").then((result) => {
					this.needAuditing = result.auditing.toString();
					this.initAuditing = result.auditing.toString();
				}, (error) => {
					this.$message({ message: '获取审核状态接口报错', type: 'error' });
				});
			},
			deleteEvaluate(id){
				let ids = []
				let prop = '是否删除选中的评论？'
				if(id != undefined){
					ids.push(id);
					this.$api("evalute.deleteEvalute",{ids:ids.join(",")}).then((result) => {
						this.getEvalute();
						this.$message({ message: '删除成功', type: 'success' });
					}, (error) => {
						this.$message({ message: '删除失败', type: 'error' });
					});
				}else{
					if(this.multipleSelection.length > 0){
						for(let i in this.multipleSelection){
							ids.push(this.multipleSelection[i].id)
						}
					}else{
						this.$message({ message: '请选择要删除的数据', type: 'warning' });return
					}
					this.$confirm(prop, '提示', {confirmButtonText: '确定',cancelButtonText: '取消',type: 'warning'}).then(() => {
						this.$api("evalute.deleteEvalute",{ids:ids.join(",")}).then((result) => {
							this.getEvalute();
							this.$message({ message: '删除成功', type: 'success' });
						}, (error) => {
							this.$message({ message: '删除失败', type: 'error' });
						});
			        }).catch(() => {});
				}
			},
			handleSelectionChange(val) {
		        this.multipleSelection = val;
		        console.log(val.length,this.evaluteData.length)
		        if(val.length == this.evaluteData.length){
		        	this.selectStatus = true
		        }else{
		        	this.selectStatus = false
		        }
		        console.log(this.selectStatus)
		    },
			getParams(key){
				let obj = {
					'size':this.$route.query.pageSize || this.pagesize,
					'page':this.$route.query.currentPage || this.page,
				}
				if(key == 'search'){
					if(this.key_value.trim() == ''){
						this.$message({ message: '请输入关键字', type: 'warning' });
						return
					}
					obj.search = {}
					obj.search[this.key] = this.key_value
				}
				this.getEvalute(obj)
			},
			getEvalute(obj){
				let params = {
					'size':this.$route.query.pageSize || this.pagesize,
					'page':this.$route.query.currentPage || this.page,
				}
				if(obj){Object.assign(params, obj)}
				this.$api("evalute.getEvalute",params).then((result) => {
					this.loading = false
					this.evaluteData = result.list;
					this.totalCount = Number(result.page.total);
				}, (error) => {
					this.loading = false
					if(error.data.status != '102'){
						this.$message({ message: '查询评价列表出错', type: 'error' });
					}
				});
			},
			toDetail(id){
				this.detailid = id
				this.detailVisible = true
				// this.$router.push({name:"evaluateDetail",query:{id:id}})
			},
		},
		components: {
			pageTitle,
			pages,
			operation,
			detail
		}
	}
</script>
<style>
.search_con{float: right; overflow: hidden;}
.eva_auditing{float: left; margin-right: 20px; line-height: 26px;}
.search-input{float: left; width: 360px}
.search_con .el-select .el-input {width: 110px;}

</style>

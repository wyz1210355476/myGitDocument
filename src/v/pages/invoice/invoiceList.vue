<template>
	<div class="contents">
		<page-title :title="'发票内容'"></page-title>
		<!-- <tab-filter :options="options" param="type" @click="getFilterParam()"></tab-filter> -->
		<!-- <div v-if="type === 'setIsEnable'" v-loading="isLoading">
			<div class="content-table ce-content-style">
				<el-form :model="ruleForm" ref="ruleForm" label-width="120px" class="demo-ruleForm">
					<el-form-item label="是否启用发票：" prop="time">
						<el-radio-group v-model="ruleForm.enable">
							<el-radio label="1">是</el-radio>
							<el-radio label="0">否</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" size="small" @click="confirm()">确定</el-button>
					</el-form-item>
				</el-form>
			</div>
		</div> -->
		<div v-loading="isLoading">
			<div slot="btn">
				<el-button type="primary" size="small" @click="addinvoice('add')">新增发票</el-button>
			</div>

			<div class="content-table">
				<el-table :data="invoiceList" style="width: 100%" size="mini" empty-text="没有相关信息">
	                <el-table-column prop="ic_content" label="发票名称">
	                	<template slot-scope="scope">
	                		<el-input v-model="scope.row.ic_content" placeholder="请输入内容" v-if="scope.row.ic_id === ''" size="small" style="width:50%;font-size:12px;"></el-input>
	                		<span v-else>{{scope.row.ic_content}}</span>
	                	</template>
	            	</el-table-column>
	           		<el-table-column label="操作" prop="operation">
	           			<template slot-scope="scope">
	           				<div v-if="scope.row.ic_content == '商品明细'">
	           					<el-button
						          @click.native.prevent="$cancel(scope.$index)"
						          size="small"
						          v-if="scope.row.ic_id == ''"
						          >
						          取消
						        </el-button>
						        <el-button
						          @click.native.prevent="$save(scope.$index)"
						          type="primary"
						          size="small"
						          v-if="scope.row.ic_id == ''"
						          >
						          保存
						        </el-button>
	           				</div>
	           				<div v-else>
						        <el-button
						          @click.native.prevent="$edit(scope.$index)"
						          type="text"
						          size="small"
						          v-if="scope.row.ic_id !== ''"
						          >
						          编辑
						        </el-button>
						        <el-button
						          @click.native.prevent="$cancel(scope.$index)"
						          size="small"
						          v-else
						          >
						          取消
						        </el-button>
						        <el-button
						          @click.native.prevent="$delete_(scope.$index)"
						          type="text"
						          size="small"
						          v-if="scope.row.ic_id !== ''"
						          >
						          删除
						        </el-button>
						        <el-button
						          @click.native.prevent="$save(scope.$index)"
						          type="primary"
						          size="small"
						          v-else
						          >
						          保存
						        </el-button>
					        </div>
				      </template>
	            	</el-table-column>
				</el-table>	
			</div>
		</div>
	</div>
</template>
<script>
	import pageTitle from '@components/pageTitle';
	import tabFilter from '@components/tabFilter';
	import operation from '@components/operation';
	import router from '@c/router';
	export default {
		data() {
			return {
				isLoading:false,
				type:this.$route.query.type,
				options: [
					{label: "发票内容设置", name: "setContent"},
					{label: "发票启用设置", name: "setIsEnable"}
				],
				ruleForm:{
					enable:""
				},
				invoiceList: [],
				totalCount: 10,
				oldInvoiceList:[],
				isShowHandler:true
			}
		},
		mounted() {
			this.getInvoiceList();
			// this.getFilterParam(true);
		},
		methods: {
			// 切换发票设置标签
			// getFilterParam(isReq){
			// 	this.isLoading = true;
			// 	this.type = this.$route.query.type;
			// 	if(this.type === 'setIsEnable' || isReq){
			// 		this.$api("invoice.enableInvoice",{}).then((result) => {
			// 			this.isLoading = false;
			// 			this.ruleForm.enable = String(result.enable);
			// 		}, (result)=>{
			// 			this.isLoading = false;
			// 			this.$message({
			// 				message: result.data.msg,
			// 				type: 'error'
			// 			});
			// 		})
			// 	}

			// },
			// 获取发票列表
			getInvoiceList() {
				this.isLoading = true;
				this.$api("invoice.invoiceList", {}).then((result) => {
					this.isLoading = false;
					this.invoiceList = result;
					this.oldInvoiceList = JSON.parse(JSON.stringify(this.invoiceList));
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
			// 新增发票
			addinvoice(){
				var lastItem = this.invoiceList[this.invoiceList.length-1];
				if (lastItem !== undefined && lastItem.ic_id === '') {
					return;
				}
				this.invoiceList.push({
					ic_id:'',
					ic_content:''
				});
				this.oldInvoiceList.push({
					ic_id:'',
					ic_content:''
				});
			},
			// 编辑
			$edit(index){
				this.oldInvoiceList.splice(index,1,{
					ic_id:this.invoiceList[index].ic_id,
					ic_content:this.invoiceList[index].ic_content
				})
				this.invoiceList[index].ic_id = '';
			},
			// 删除
			$delete_(index){
				this.$confirm('是否继续删除？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$api("invoice.delInvoice", {ids:this.invoiceList[index].ic_id}).then((result) => {
						this.$message({
							message: '操作成功！',
							type: 'success'
						});
						this.invoiceList.splice(index,1)
						this.oldInvoiceList.splice(index,1);
					}, (result)=>{
						this.$message({
							message: result.data.msg,
							type: 'error'
						});
					})
				}).catch(() => {

				});      
			},
			// 保存
			$save(index){
				var pattern = /^[\u4e00-\u9fa5a-zA-Z0-9_\-]{1,30}$/;
				if(!pattern.test(this.invoiceList[index].ic_content)){
					this.$message({
						message: '请输入1-30以内的中文,英文,数字,-或_的组合',
						type: 'warning'
					});
				}else{
					if(this.oldInvoiceList[index].ic_id === ''){//新增保存
						this.$api("invoice.addInvoice", {ic_content:this.invoiceList[index].ic_content}).then((result) => {
							this.$message({
								message: '操作成功！',
								type: 'success'
							});
							// this.invoiceList[index].ic_id = this.oldInvoiceList[index].ic_id = result.ic_id;
							// this.oldInvoiceList[index].ic_content = this.invoiceList[index].ic_content;
							this.getInvoiceList();
						}, (result)=>{
							this.$message({
								message: result.data.msg,
								type: 'error'
							});
						})
					}else{//编辑保存
						this.$api("invoice.editInvoice", {ic_content:this.invoiceList[index].ic_content,id:this.oldInvoiceList[index].ic_id}).then((result) => {
							this.$message({
								message: '操作成功！',
								type: 'success'
							});
							// this.invoiceList[index].ic_id = this.oldInvoiceList[index].ic_id;
							// this.oldInvoiceList[index].ic_content = this.invoiceList[index].ic_content;
							this.getInvoiceList();
						}, (result)=>{
							this.$message({
								message: result.data.msg,
								type: 'error'
							});
						})
					}
				}
			},
			// 取消
			$cancel(index){
				if (this.oldInvoiceList[index].ic_id === '') {
					this.invoiceList.splice(index,1)
					this.oldInvoiceList.splice(index,1);
				}else{
					this.invoiceList[index].ic_id = this.oldInvoiceList[index].ic_id;
					this.invoiceList[index].ic_content = this.oldInvoiceList[index].ic_content;
				}
			},
			confirm(){
				this.$api("invoice.enableInvoice", this.ruleForm).then((result) => {
					this.$message({
						message: '设置成功！',
						type: 'success'
					});
				}, (result)=>{
					this.$message({
						message: result.data.msg,
						type: 'error'
					});
				})
			}
		},
		components: {
			pageTitle,
			operation,
			tabFilter
		}
	}
</script>
<style>
.ce-content-style{
	padding: 10px 0;
}
</style>
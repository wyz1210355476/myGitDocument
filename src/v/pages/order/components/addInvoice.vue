<template>
	<div class="order-form">
		<el-dialog
		  	title="添加发票抬头"
		  	:visible.sync="visible">
		  	<div>
		  		<el-form ref="form1" :model="form1" :rules="rules" label-width="150px" size="small">
					<el-form-item label="发票抬头：" prop="title">
						<div>
							<radio-input v-for="item in invoiceTitleList" v-model="form1.tId" :lab="item.title" :val="item.id" :key="item.id" @delete="deleteTitle" @save="saveTitle"></radio-input>
						</div>
						<el-button type="text" @click="addNewInvoice = true" size="small">新增单位发票</el-button>
						<el-form ref="form2" :model="form2" :rules="rules2" label-width="100px" v-if="addNewInvoice" size="small">
							<el-form-item label="发票抬头：" prop="title2">
							    <el-input v-model="form2.title"></el-input>
							</el-form-item>
							<el-form-item label="纳税人识别号：" prop="taxId2">
							    <el-input v-model="form2.taxId"></el-input>
							</el-form-item>
							<div class="btn-area left">
								<el-button type="primary" @click="addTitle" size="mini">保存</el-button>
								<el-button @click="addNewInvoice = false" size="mini">取消</el-button>
							</div>
						</el-form>
					</el-form-item>
					<el-form-item label="纳税人识别号：" prop="taxId" v-if="form1.titleType == '2'">
					    <el-input v-model="form1.taxId" readonly></el-input>
					</el-form-item>
					<el-form-item label="发票内容：" prop="cId">
					    <el-radio-group v-model="form1.cId" class="radio-order">
					      	<el-radio v-for="option in invoiceContentList" :label="option.id" :key="option.id" border>{{option.name}}</el-radio>
					    </el-radio-group>
					</el-form-item>
				</el-form>
				<div class="btn-area">
					<el-button @click="cancel" size="small">取消</el-button>
					<el-button type="primary" @click="submitForm('form1')" size="small">保存</el-button>
				</div>
		  	</div>
		</el-dialog>
	</div>
</template>
<script>
	import dialogVisibility from '@c/mixins/dialogVisibility';
	import radioInput from '@components/radioInput';
	import orderApi from '@c/mixins/orderApi';
	export default {
		data() {
			let required = (rule, value, callback) => {
      			if (value == '') {
          			callback(new Error());
        		} else {
          			callback();
        		}
      		};
			return {
				invoiceTitleList: [],
				invoiceContentList: [],
				addNewInvoice: false,
				form1: {
					clientId: this.id,
					tId: '',
					title: '',
					cId: '',
					content: '',
					taxId: '',
					titleType: '1'
				},
				form2: {
					title: '',
					taxId: '',
					titleType: '2',
					clientId: this.id
				},
				rules: {
					title: [
						{ validator: required, message: '请选择抬头名称', trigger: 'blur' }
					],
					taxId: [
						{ required: true, message: '请输入纳税人识别号', trigger: 'blur' }
					],
					cId: [
						{ required: true, message: '请选择发票内容', trigger: 'blur' }
					]
				},
				rules2: {
					// title2: [
					// 	{ required: true, message: '请输入抬头名称', trigger: 'blur' }
					// ],
					// taxId2: [
					// 	{ required: true, message: '请输入纳税人识别号', trigger: 'blur' }
					// ]
				}
			}
		},
		props: {
			id: {
				type: [String, Number],
				required: true
			},
			tId: {
				type: [String, Number]
			},
			cId: {
				type: [String, Number]
			}
		},
		mixins: [dialogVisibility, orderApi],
		watch: {
			'form1.tId': {
				handler(v) {
					let index = this.invoiceTitleList.findIndex(n => v == n.id);
					if (index > -1) {
						this.form1.title = this.invoiceTitleList[index].title;
						this.form1.taxId = this.invoiceTitleList[index].taxId;
						this.form1.titleType = this.invoiceTitleList[index].title_type;
					} else {
						this.form1.title = '';
						this.form1.taxId = '';
						this.form1.titleType = '2';
					}
				},
				deep: true
			},
			'form1.cId': {
				handler(v) {
					let index = this.invoiceContentList.findIndex(n => v == n.id);
					if (index > -1) {
						this.form1.content = this.invoiceContentList[index].name;
					}
				},
				deep: true
			}
		},
		mounted() {
			this.getInvoiceTitleList();
			this.getInvoiceContentList();
		},
		methods: {
			//获取发票抬头列表
			getInvoiceTitleList(id) {
				this.$api(this.orderApi[this.$version] + ".getInvoiceTitleList", {clientId: this.id}).then((result) => {
					this.invoiceTitleList = result.list;
					this.form1.tId = this.invoiceTitleList[0].id;
					if (this.tId) {
						this.form1.tId = this.tId;
					}
					if (id) {
						this.form1.tId = id;
					}
				}, (error) => {
					if (error && error.data && error.data.status == 102) {
						this.invoiceTitleList = [];
					} else {
						this.$message({
							type: 'error',
			            	message: '获取发票抬头列表出错'
						});
					}
				});
			},
			//获取发票名称列表
			getInvoiceContentList() {
				this.$api(this.orderApi[this.$version] + ".getInvoiceContentList").then((result) => {
					this.invoiceContentList = result.list;
					this.form1.cId = this.invoiceContentList[0].id;
					if (this.cId) {
						this.form1.cId = this.cId;
					}
				}, (error) => {
					if (error && error.data && error.data.status == 102) {
						this.invoiceContentList = [];
					} else {
						this.$message({
							type: 'error',
			            	message: '获取发票名称列表出错'
						});
					}
				});
			},
			//新增发票保存
			addTitle() {
				this.$refs['form2'].validate((valid) => {
		          	if (valid) {
		            	this.$api(this.orderApi[this.$version] + ".addInvoiceTitle", this.form2).then((result) => {
			      			this.$message({
				            	type: 'success',
				            	message: '添加成功!'
				        	});
				        	this.getInvoiceTitleList(result.id);
				        	this.addNewInvoice = false;
				        	this.form2.title = '';
				        	this.form2.taxId = '';
			      		}, (error) => {
			      			this.$message({
				            	type: 'error',
				            	message: '添加失败！'
				          	});
			      		});
		          	} else {
		            	console.log('error submit!!');
		            	return false;
		          	}
	        	});
			},
			//编辑发票保存
			saveTitle(invoice) {
				let data ={
					id: invoice.value,
					title: invoice.label,
					taxId: this.form1.taxId ? this.form1.taxId : '',
					titleType: '2',
					clientId: this.id
				}
				this.$api(this.orderApi[this.$version] + ".editInvoiceTitle", data).then((result) => {
					this.$message({
		            	type: 'success',
		            	message: '保存成功!'
		        	});
		        	this.getInvoiceTitleList();
				}, (error) => {
					this.$message({
		            	type: 'error',
		            	message: '保存失败！'
		          	});
				});
			},
			//删除发票抬头
			deleteTitle(tId) {
				this.$api(this.orderApi[this.$version] + ".delInvoiceTitle", {clientId: this.id, id: tId}).then((result) => {
					this.$message({
		            	type: 'success',
		            	message: '删除抬头成功!'
		        	});
		        	this.getInvoiceTitleList();
				}, (error) => {
					this.$message({
		            	type: 'error',
		            	message: '删除抬头失败！'
		          	});
				})
			},
			//表单校验
			submitForm(formName) {
	        	this.$refs[formName].validate((valid) => {
		          	if (valid) {
		            	this.save();
		          	} else {
		            	console.log('error submit!!');
		            	return false;
		          	}
	        	});
	      	},
	      	//保存
	      	save() {
	      		this.$emit("save", {
	      			title: this.form1.title,
	      			tId: this.form1.tId,
	      			cId: this.form1.cId,
	      			content: this.form1.content,
	      			taxId: this.form1.taxId ? this.form1.taxId : ''
	      		})
	      	},
	      	//取消
			cancel() {
				this.visible = false;
			}
		},
		components: {
			radioInput
		}
	}
</script>
<style scoped>
	.btn-area.left {padding-left: 100px;}
</style>
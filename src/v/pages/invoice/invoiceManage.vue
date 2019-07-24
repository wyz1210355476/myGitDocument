<template>
	<div class="contents">
		<page-title title="发票管理"></page-title>
		<tab-filter :options="options" @click="getFilterParam()" param="pageTag"></tab-filter>
		<div style="overflow:hidden">
		  	<div class="search_con">
		  		<operation ref="operation" module="invoice_manage" @search="getSearchParam"></operation>
			</div>
		</div>
		<div class="content-table">
			<el-table :data="invoiceManageData" size="mini" v-loading="loading" class="table-one-line">
			    <el-table-column label="订单号">
			    	<template slot-scope="scope">
						<div class="one-line btnStyle" :title="scope.row.order_num" @click="showCustomDialog(scope.row.order_id, 'view')">
							{{ scope.row.order_num }}
						</div>
			      	</template>
			    </el-table-column>
				<el-table-column label="订单日期">
					<template slot-scope="scope">
						<div class="one-line" :title="scope.row.order_create_time"> {{ scope.row.order_create_time }}</div>
			      	</template>
				</el-table-column>
				<el-table-column prop="ich_invoice_title" label="发票抬头">
					<template slot-scope="scope">
						<div class="one-line" :title="scope.row.ich_invoice_title"> {{ scope.row.ich_invoice_title }}</div>
			      	</template>
				</el-table-column>
				<el-table-column prop="ic_content" label="发票内容">
					<template slot-scope="scope">
						<div class="one-line" :title="scope.row.ic_content"> {{ scope.row.ic_content }}</div>
			      	</template>
				</el-table-column>
			    <el-table-column prop="ich_ratepaying_num" label="纳税人识别号">
					<template slot-scope="scope">
						<div class="one-line" :title="scope.row.ich_ratepaying_num"> {{ scope.row.ich_ratepaying_num }}</div>
			      	</template>
				</el-table-column>
				<el-table-column prop="it_type_name" label="发票类型">
					<template slot-scope="scope">
						<div class="one-line" :title="scope.row.it_type_name"> {{ scope.row.it_type_name }}</div>
			      	</template>
				</el-table-column>
                <el-table-column prop="ich_money" label="发票金额">
					<template slot-scope="scope">
						<div class="one-line" :title="scope.row.ich_money"> {{ scope.row.ich_money }}</div>
			      	</template>
				</el-table-column>
                <el-table-column prop="ich_invoice_num" label="发票号码">
					<template slot-scope="scope">
						<div class="one-line" :title="scope.row.ich_invoice_num"> {{ scope.row.ich_invoice_num }}</div>
			      	</template>
				</el-table-column>
				<el-table-column label="状态">
			    	<template slot-scope="scope">
						 <div class="one-line" :title="scope.row.ich_status | ichState">{{scope.row.ich_status | ichState}}</div>
			      	</template>
			    </el-table-column>
			    <el-table-column label="操作" width="200">
			      	<template slot-scope="scope">
                        <el-button type="text" size="small" @click="makeInvoice('1',scope.row)">{{scope.row.ich_status == 1 ? "开票" : "重开"}}</el-button>
			      		<el-button type="text" size="small" @click="makeInvoice('2',scope.row)">查看</el-button>
			      	</template>
			    </el-table-column>
			</el-table>
		</div>
		<pages :total="totalCount" @change="getPagesParam('page')"></pages>

        <el-dialog :title="isView | toTitle" :visible.sync="invoiceDialog" >
			<div>
				<div class="info">
					<div class="item">
						发票类型：
						<span class="itemCon">{{showInfo.it_type_name}}</span>
					</div>
					<div class="item">
						发票状态：
						<span class="itemCon">{{showInfo.ich_status | ichState}}</span>
					</div>
					<div class="item">
						发票号码：
						<span class="itemCon">{{showInfo.ich_invoice_num}}</span>
					</div>
					
					<div class="item">
						发票抬头：
						<span class="itemCon">{{showInfo.ich_invoice_title}}</span>
					</div>
					<div class="item">
						纳税人识别号：
						<span class="itemCon">{{showInfo.ich_ratepaying_num}}</span>
					</div>
					<div class="item">
						发票金额：
						<span class="itemCon">{{showInfo.ich_money}}</span>
					</div>
					<!-- 电子发票begin -->
					<div class="item" v-if="invoiceType == 2">
						收票人邮箱：
						<span class="itemCon">{{showInfo.ich_collect_email}}</span>
					</div>
					<div class="item" v-if="invoiceType == 2">
						收票人手机/电话：
						<span class="itemCon">{{showInfo.ich_collect_mobile}}</span>
					</div>
					<!-- 电子发票end -->
					<!-- 增值税专用发票begin -->
					<div class="item" v-if="invoiceType == 3">
						注册地址：
						<span class="itemCon">{{showInfo.ich_reg_address}}</span>
					</div>
					<div class="item" v-if="invoiceType == 3">
						注册电话：
						<span class="itemCon">{{showInfo.ich_reg_tel}}</span>
					</div>
					<div class="item" v-if="invoiceType == 3">
						开户银行：
						<span class="itemCon">{{showInfo.ich_open_bank}}</span>
					</div>
					<div class="item" v-if="invoiceType == 3">
						银行账户：
						<span class="itemCon">{{showInfo.ich_bank_account}}</span>
					</div>
					<!-- 增值税专用发票end -->
					<!-- 查看时begin -->
					<div class="item" v-if="isView == 2">
						开票日期：
						<span class="itemCon">{{showInfo.ich_create_time}}</span>
					</div>
					<div class="item" v-if="isView == 2">
						备注：
						<span class="itemCon">{{showInfo.ich_remark}}</span>
					</div>
					<!-- 查看时end -->
				</div>
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="70px" size="small" class="demo-ruleForm" v-if="isView == 1">
                    <el-form-item label="开票日期" prop="create_time" class="formInput" :key="ruleForm.id">
                        <el-date-picker type="date" placeholder="年/月/日" v-model="ruleForm.create_time" style="width:200px;"></el-date-picker>
                    </el-form-item>      
                    <el-form-item label="发票号码" prop="invoice_num" class="formInput" :key="ruleForm.id">
                        <el-input v-model="ruleForm.invoice_num"></el-input>
                    </el-form-item>
                    <el-form-item label="备注" prop="remark" :key="ruleForm.id">
						<el-input
							type="textarea"
							:rows="2"
							placeholder="请输入内容"
							v-model="ruleForm.remark"
							class="areaWidth"
						>
						</el-input>
                    </el-form-item>
                     
                </el-form>
            </div>
			<span slot="footer" class="dialog-footer">
                <el-button @click="invoiceDialog = false" size="mini">{{isView == 1 ? "取消" : "关闭"}}</el-button>
                <el-button @click="save" size="mini" type="primary" v-if="isView == 1">保存</el-button>
			</span>
		</el-dialog>
		<custom-dialog :visibility.sync="customDialogParam.visibility" :id="activeId" :module="customDialogParam.module" class="custom-dialog" @update="getFilterParam"></custom-dialog>
	</div>
</template>
<script>
	import pageTitle from '@components/pageTitle'
	import pages from '@components/pages'
	import operation from '@components/operation'
	import tabFilter from '@components/tabFilter'
	import customDialog from '../order/components/customDialog';
	import * as utilFun from '@c/util/index.js';
	export default {
		data() {
			var checkInvoiceNum = (rule, value, callback) => {
				if(/^[\da-zA-Z]{0,20}$/.test(value)){
					callback();
				}else{
					callback(new Error('请输入数字，字母或其组合'));
				}	
			}
			
			return {
                options: [{
                    label: "待开发票",
                    name: "1"
                }, {
                    label: "已开发票",
                    name: "2"
                },{
                    label: "全部",
                    name: "0"
				}],
                invoiceManageData:[],// 列表数据
                loading:false,
                totalCount:0,
                ruleForm:{
                    create_time:"",
                    "invoice_num":"",
					remark:"",
					key:Date.now()
				},
				showInfo:{},
				invoiceType:"",//发票类型
				isView:"1",//是否是查看发票信息 1 不是 2是
                rules:{
                    "invoice_num":[
						// { required: true, message: '请输入客户名称', trigger: 'blur' },
						{ validator: checkInvoiceNum , trigger: 'blur' }
					],
					"remark":[
						// { required: true, message: '请输入客户名称', trigger: 'blur' },
						{ max: 200 , message: '最长200个字符', trigger: 'blur' }
					]
                },
				tag:"1",
				invoiceDialog:false,
				customDialogParam: {
                    visibility: false,
                    module: 'view'
				},
				activeId: '', //当前操作id
			}
		},
		mounted() {
			if(this.$route.query.pageTag){
				this.tag = this.$route.query.pageTag
			}
			this.getDataList();	
		},
		filters:{
			ichState(value){
				switch (value+"") {
					case '1':
						return "待开"
						break;
					case '2':
						return "已开"
						break;
					case '3':
						return "作废"
						break;
				}
            },
            toTitle(value){
                switch (value){
                    case '1':
						return "开票"
						break;
					case '2':
						return "查看"
						break;
                }
            }
		},
		methods: {
			//搜索查询
			getSearchParam(val){
				let data;
				switch (val.search_select+""){
					case "1":
						data = {
							orderNum:val.search_value
						}
						break;
					case "2":
						data = {
							title:val.search_value
						}
						break;
					case "3":
						data = {
							invoiceNum:val.search_value
						}
						break;
				}
				// 渲染列表
				this.getDataList(data);
			},
			// 标签切换
			getFilterParam(val){
				this.tag = this.$route.query.pageTag;
				// 渲染列表
				this.getDataList();
			},
			//分页
			getPagesParam(){
				// 渲染列表
				this.getDataList();
			},
			// 渲染推荐审核列表
			getDataList(obj){
				let params = {
					'status':this.tag,
					'pageSize':this.$route.query.pageSize ? this.$route.query.pageSize : 10,
					'page':this.$route.query.currentPage ? this.$route.query.currentPage : 1
				};
				if(obj){Object.assign(params, obj)};
				this.$api("invoice.getInvoiceMamageList",params).then((result) => {
					this.invoiceManageData = result.list;
                	this.totalCount = result.page.total;
				},(error) => {
					if(error.data.status == 102){
						this.invoiceManageData = [];
						this.totalCount = 0;
					}else{
						this.$message({
							message: error.data.msg,
							type: 'error'
						});
					}
				})
			},
			// 查看发票信息
			getInvoiceInfo(id){
				this.$api("invoice.getInvoiceInfo",{id:id}).then((result) => {
					this.showInfo = result[0];
				},(error) => {
					this.$message({
						message: error.data.msg,
						type: 'error'
					});
				})
			},  
			//查看订单详情
            showCustomDialog(id, module) {
				debugger
                this.customDialogParam.visibility = true;
                this.customDialogParam.module = module;
                this.activeId = id;
            }, 
			// 开发票
            makeInvoice(type,obj){
				/**
				 * type 窗口类型
				 * 1 开票或重开
				 * 2 查看*/
				this.isView = type;

				// 窗口类型不同执行不同的操作
				switch(type+""){
					case "1":
						this.ruleForm = {
							create_time:"",
							invoice_num:"",
							remark:"",
							id:obj.ich_id,
						}
						break;
					case "2":

						break;
				}
				// 根据发票类型渲染不同的信息
				switch(obj.it_type_name){
					case "普通发票":
						this.invoiceType = "1"
						break;
					case "电子发票":
						this.invoiceType = "2"
						break;
					case "增值税发票":
						this.invoiceType = "3"
						break;
				}
				// 发票信息
				this.getInvoiceInfo(obj.ich_id);
				this.invoiceDialog = true;
			},
			// 保存
			save(){
				this.$refs.ruleForm.validate((valid) => {
					if(valid){
						let params = {
							id:this.ruleForm.id,
							invoice_num:this.ruleForm.invoice_num,
							remark:this.ruleForm.remark,
							create_time:utilFun.formatDate(this.ruleForm.create_time.getTime(),'yyyy-MM-dd'),
							status:"2"
						}

						this.$api("invoice.updateInvoice",params).then((result) => {
							this.invoiceDialog = false;
							this.$message({
								message: "开票成功",
								type: 'success'
							});
							
							this.getDataList();
						},(error) => {
							this.$message({
								message: error.data.msg,
								type: 'error'
							});
						})
					}
				})	
			}
		},
		components: {
			pageTitle,
			pages,
			operation,
			tabFilter,
			customDialog
		}
	}
</script>
<style scoped>
	.areaWidth{
		width: 70%;
	}
	.info{
		overflow: hidden;
	}
	.info .item{
		margin: 0 10px 20px 0;
		float: left;
		width: 290px;
	}
	.info .item .itemCon{
		color: #999;
	}
	.btnStyle{
		color: #409eff;
		cursor: pointer;
	}
</style>

<style>
.search_con{float: right;}
.search_con .el-select .el-input {width: 110px;}
.dropdown-link{font-size: 12px; color: #409EFF; margin-left: 10px;}
</style>

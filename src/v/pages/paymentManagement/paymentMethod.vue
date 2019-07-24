<template>
	<div class="contents">
		<page-title :title="'支付设置'"></page-title>
		<div slot="btn">
			<el-button type="primary" size="small" @click="addPayWay('add')">新增</el-button>
		</div>
		<div class="content-table">
			<el-table :data="paymentMethodList" style="width: 100%" size="mini" v-loading="isLoading" empty-text="没有相关信息" class="table-one-line">
				<el-table-column prop="name" label="支付方式">
					<template slot-scope="scope">
	            		<span class="one-line">{{scope.row.name}}</span>
		            </template>
            	</el-table-column>
				<!-- <el-table-column prop="version" label="应用程序版本">
				</el-table-column> -->
            	<!-- <el-table-column prop="sort" label="排序" sortable>
            	</el-table-column> -->
            	<el-table-column prop="status" label="状态">
            	</el-table-column>
	            <el-table-column label="操作" prop="operation">
	            	<template slot-scope="scope">
	            		<el-button
	            		@click.native.prevent = "editPayWay(scope)"
	            		type="text" size="small">
	            		{{paymentMethodList[scope.$index].config}}
		            	</el-button>
		            	<el-button
		            	@click.native.prevent="disable(scope.$index, paymentMethodList[scope.$index].operation,paymentMethodList[scope.$index].payTypeId)"
		            	type="text"
		            	size="small">
		            	{{paymentMethodList[scope.$index].operation}}
		            	</el-button>
		            </template>
		        </el-table-column>
		    </el-table>
		</div>

<el-dialog :title="(status=='add'?'新增':'配置')+'支付方式'" :visible.sync="dialogNewPay" :closeOnClickModal="false" width="800px">
	<el-form :model="payRuleForm" :rules="rules" ref="payRuleForm" label-width="220px" class="demo-ruleForm">
		<el-form-item label="支付方式名称：" prop="name"  size="small" >
			<el-input v-model="payRuleForm.name" class="ce-width-p" auto-complete="off"></el-input>
		</el-form-item>
		<el-form-item label="支付类型：" prop="typeVal">
			<el-select v-model="typeVal" placeholder="请选择" size="small" style="font-size:12px;max-width:130px" @change="payWayChange" :disabled="disabled">
			    <el-option v-for="item in options" :label="item.label" :value="item.value" :key="item.value" style="font-size:12px"></el-option>
			</el-select>
			<el-select v-if="isHasH5Pay" v-model="sonTypeVal" placeholder="请选择" size="small" style="font-size:12px;max-width:130px" @change="sonPayWayChange">
			    <el-option v-for="item in sonOptions" :label="item.label" :value="item.value" :key="item.value" style="font-size:12px"></el-option>
			</el-select>
			<el-button v-if="isBank" type="text" @click="newBank">+增加银行信息</el-button>
		</el-form-item>
		<div style="max-height:461px;overflow:auto;">
			<div :class="{bankStyle:isBank}">
				<el-form-item :label="item.name" :prop="item.key" v-for="item in payRuleForms" :key="item.key" size="small" :rules="[
					{ required: item.isRequire, message: '请输入此字段'},
					{ max: item.max,message: '最多输入'+item.max+'个字符'},
					{ validator: conversion(item.ruleName), trigger: 'blur'}
				]">
					<el-input v-if="item.dataType == '1'" v-model="payRuleForm[item.key]" class="ce-width-p" auto-complete="off"></el-input>
					<el-upload
						v-else-if="item.dataType == '3'"
						class="upload-demo"
						:action="url"
						:show-file-list="true"
						:on-success="handleSuccess"
						:on-error="handleError"
						:on-change="handleChange"
						:on-remove="removeFile"
						:with-credentials="true"
						:data="dataParams"
						:file-list="fileList"
						v-model="payRuleForm[item.key]"
						accept=".txt">
						<el-button size="small" type="primary" @click="getUploadKey(item.key)">点击上传</el-button>&nbsp;&nbsp;
						<span slot="tip" class="el-upload__tip">只能上传txt文件</span>
					</el-upload>
				</el-form-item>
				<el-popover
				 	v-if="isBank && payRuleForm['id']"
					placement="top"
					width="160"
					class='delete-bank-config'
					v-model="hintVisible">
					<p>删除后将无法恢复，确定删除吗？</p>
					<div style="text-align: right; margin: 0">
					<el-button size="mini" type="text" @click="hintVisible = false">取消</el-button>
					<el-button type="primary" size="mini" @click="delBankConfig('id')">确定</el-button>
					</div>
					<el-button slot="reference" size='small'>删除</el-button>
				</el-popover>
				<el-button v-else-if="bankConfig.length > 0" slot="reference" class='delete-bank-config' size='small' @click="delBankConfig('id')">删除</el-button>
			</div>
			<div class="bankStyle" v-if="isBank" v-for="(parent,index) in bankConfig" :key="index">
				<el-form-item :label="item.name" :prop="index+'-'+item.key" v-for="item in parent" :key="item.key" size="small" :rules="[
					{ required: item.isRequire, message: '请输此字段'},
					{ max: item.max,message: '最多输入'+item.max+'个字符'},
					{ validator: conversion(item.ruleName), trigger: 'blur'}
				]">
					<el-input v-if="item.dataType == '1'" v-model="payRuleForm[index+'-'+item.key]" class="ce-width-p" auto-complete="off"></el-input>
				</el-form-item>
				<el-popover class='delete-bank-config' placement="top" width="160" trigger="click" v-model='parent.hintVisible' v-if="payRuleForm[index+'-id']">
					<p>删除后将无法恢复，确定删除吗？</p>
					<div style="text-align: right; margin: 0">
					    <el-button size="mini" type="text" @click="parent.hintVisible = false">取消</el-button>
					    <el-button type="primary" size="mini" @click="delBankConfig(index+'-id',index)">确定</el-button>
					</div>
					<el-button slot="reference" size='small'>删除</el-button>
				</el-popover>
				<el-button v-else slot="reference" class='delete-bank-config' size='small' @click="delBankConfig(index+'-id',index)">删除</el-button>

			</div>
			<div id="scrollToBottom" style="height:1px"></div>
		</div>
		<el-form-item label="是否开启此支付方式：" prop="isDisable">
			<el-radio-group v-model="payRuleForm.status">
				<el-radio label="1">是</el-radio>
				<el-radio label="0">否</el-radio>
			</el-radio-group>
		</el-form-item>
	</el-form>
	<div style="text-align:right;margin-top:20px;">
		<el-button @click="dialogNewPay = false" size="small">取消</el-button>
		<el-button type="primary" @click="savePaymentConfig" size="small">保存</el-button>
	</div>
</el-dialog>
</div>
</template>
<script>
import pageTitle from '@components/pageTitle';
	// import pages from '@components/pages';

	export default {
		data() {
			var checkPayName = (rule,value,callback) => {
				if(!(/^[\s\u4e00-\u9fa5a-zA-Z0-9_\-]*$/).test(value)){
					return callback(new Error('输入格式不符合要求'));
				}else{
					callback();
				}
			}
			return {
				url:__ce.baseURL+'/manager/payway/config/uploadOpenFile.do',
				dataParams:{},
				uploadKey:'',
				isLoading:false,
				paymentMethodList: [],
				totalCount: 10,
				dialogAggregatePay:false,
				dialogNewPay:false,
				status:'',
				editId:"",
				disabled:false,
				payTypeList:[],
				options: [],
				sonOptions:[],
				typeVal:"",
				sonTypeVal:"",
				cacheSonTypeVal:"",
				isHasH5Pay:false,
				isSonType:false,
				// aggregatePayRuleForm: {
				// 	msgSrc:'',
				// 	msgSrcId:"",
				// 	md5Key:'',
				// 	instMid:'',
				// 	mid:'',
				// 	tid:'',
				// 	walletOption:'',
				// 	expireMinute:''
				// },
				payRuleForm:{
					name:"",
					status:"1"
				},
				objRuleForms:{

				},
				bankConfig:[],
				bankNum:0,//记录添加银行转账的数量
				payRuleForms:[],
				rules: {
					name:[
						{ max: 30,message: '最多输入30个字符'},
						{ validator:checkPayName}
					],
				},
				paymentMethod: {
					4:'dialogAggregatePay'
				},
				fileList: [
					{
						name: '',
						url: ''
					}
				],
				isBank:false,
				hintVisible:false,
				nameObj: {
					'mid':'checkBank',
					'tid':'checkAccountName',
					'instMid':'checkBank',
					'account':'checkAccountNumber'
				}
			}
		},
		mounted() {
			this.getPaymentList();
			if(sessionStorage.getItem('token')){
				this.dataParams.TOKEN=sessionStorage.getItem('token')
			}
		},
		methods: {
			conversion(val){//将特殊验证的方法字符串转为可执行的方法
				return this[val];
			},
			checkBank(rule,value,callback){
				if((/^[\u4e00-\u9fa5a-zA-Z0-9]+$/).test(value)) {
					callback();
				}else{
					return callback(new Error('只能输入中文、英文或数字'));
				}
			},
			checkAccountName(rule,value,callback){
				if((/^[\u4e00-\u9fa5a-zA-Z0-9()]+$/).test(value)) {
					callback();
				}else{
					return callback(new Error('只能输入中文、英文,数字或括号'));
				}
			},
			checkAccountNumber(rule,value,callback){
				if((/^\d+$/).test(value)) {
					callback();
				}else{
					return callback(new Error('只能输入数字值'));
				}
			},
			getUploadKey(key){//存储文件上传表单的key
				this.uploadKey = key;
			},
			handleChange(file, fileList) {
				this.fileList = fileList.slice(-1);
			},
			handleError(){
				this.$message({
					message: "文件上传失败！",
					type: 'error'
				});
			},
			removeFile(){
				this.payRuleForm[this.uploadKey] = '';
			},
			handleSuccess(response, file, fileList){//上传成功的回调
				this.payRuleForm[this.uploadKey] = response.data.path;//将上传文件的路径保存到表单数据对象中
				this.$message({
					message: "文件上传成功",
					type: 'success'
				});
			},
			newBank(){//新增银行信息
				console.log(this.payRuleForm)
				let len = this.bankConfig.length;
				if(len >= 4){
					this.$message({
						message: "最多只能新增5条",
						type: 'warning'
					});
				}else{
					let formInf = JSON.stringify(this.payRuleForms)
					this.bankConfig.push(JSON.parse(formInf))

					this.bankNum++;//新增银行转账的数量
				}

				this.$nextTick(function(){//每新增一条，滚动条就滑到底部
					document.getElementById("scrollToBottom").scrollIntoView({block: "start", behavior: "smooth"});
				})
				
			},
			delBankConfig(id,index){//删除银行信息
				let delId =  this.payRuleForm[id];
				let quantity = this.bankConfig.length;

				if(!delId){//删除新增的表单
					if(index != undefined){
						for(let key in this.payRuleForm){//删除表单数据
							let keyArray = key.split('-');
							if(keyArray.length>1 && keyArray[0] < (quantity-1) && keyArray[0] >= index){
								let nextVal = this.payRuleForm[(parseInt(keyArray[0])+1)+'-'+keyArray[1]];
								this.payRuleForm[key] = nextVal ? nextVal+"" : "";

							}else if(keyArray[0] == (quantity-1)){
								delete this.payRuleForm[key];
							}
						}
						this.bankConfig[index].hintVisible = false;
						//this.bankConfig.length = quantity-1;
						this.bankNum--;
					}else{

						for(let key in this.payRuleForm){//删除表单数据
							if(key == 'name' || key == 'status'){
								continue;
							}
							let keyArray = key.split('-');
							console.log(keyArray[0])
							if(keyArray[0] != (quantity-1)){
								if(keyArray.length>1){
									let nextVal = this.payRuleForm[(parseInt(keyArray[0])+1)+'-'+keyArray[1]];
									this.payRuleForm[key] = nextVal ? nextVal+"" : "";

								}else if(keyArray.length == 1){
									this.payRuleForm[key] = this.payRuleForm[0+'-'+key] ? this.payRuleForm[0+'-'+key] : "";
								}
								

							}else if(keyArray[0] == (quantity-1)){
								delete this.payRuleForm[key];
							}
						}

						this.hintVisible = false;
						//this.bankConfig.length = quantity-1;
						this.bankNum--;
						console.log(this.payRuleForm)	
					}
					this.bankConfig.splice(index,1)
					return;
				}
				this.$api("paymentManagement.delBankConfig", {id:delId}).then((result) => {
					// debugger
					if(index != undefined){
						for(let key in this.payRuleForm){//删除表单数据
							let keyArray = key.split('-');
							if(keyArray.length>1 && keyArray[0] < (quantity-1) && keyArray[0] >= index){
								this.payRuleForm[key] = this.payRuleForm[(parseInt(keyArray[0])+1)+'-'+keyArray[1]]+"";

							}else if(keyArray[0] == (quantity-1)){
								delete this.payRuleForm[key];
							}
						}
						this.bankConfig[index].hintVisible = false;
						this.bankConfig.length = quantity-1;
						this.bankNum--;
					}else{

						for(let key in this.payRuleForm){//删除表单数据
							if(key == 'name' || key == 'status'){
								continue;
							}
							let keyArray = key.split('-');
							if(keyArray[0] != (quantity-1)){
								if(keyArray.length>1){
									this.payRuleForm[key] = this.payRuleForm[(parseInt(keyArray[0])+1)+'-'+keyArray[1]]+"";
								}else if(keyArray.length == 1){
									this.payRuleForm[key] = this.payRuleForm[0+'-'+key]+"";
								}
								

							}else if(keyArray[0] == (quantity-1)){
								delete this.payRuleForm[key];
							}
						}

						this.hintVisible = false;
						this.bankConfig.length = quantity-1;
						this.bankNum--;
						console.log(this.payRuleForm)	
					}
				},(result) => {
					this.hintVisible = false;
					this.$message({
							message: result.data.msg,
							type: 'error'
						});
				})		
			},
			getPaymentList() {
				this.isLoading = true;
				// 获取支付列表
				this.$api("paymentManagement.getPaymentList", {}).then((result) => {
					// this.payRuleForm = {
					// 	name:'微信扫码支付',
					// Appid:"",
					// AppSecret:'134564343',
					// MCHID:'34567',
					// PartnerKey:'67890453',
					// currency:'人民币',
					// describe:'傻哈哈',
					// isOnlinePayment:'0',
					// status:'1'
					// }
					this.isLoading = false;
					result.list.forEach((item) => {
						/*item.status  = item.status == 1 ? '启用' : '停用';
						item.operation = item.type != 1 ? item.status == '启用' ? '停用' : '启用' : '';
						item.config = item.payTypeId == 1 ? '' : '配置';*/
						item.status  = item.status == 1 ? '启用' : '停用';
						item.operation = item.status == '启用' ? '停用' : '启用';
						item.config = '配置';
					})
					this.paymentMethodList = result.list;
				}, (result)=>{
					this.isLoading = false;
					if(result.data.status != "102"){
						this.$message({
							message: result.data.msg,
							type: 'error'
						});
					}
				})
			},
			editPayWay(scope){
				// console.log(scope);
				this.status = 'edit';
				this.editId = scope.row.id;
				this.disabled = true;
				//银行转账
				this.isBank = false;
				this.bankConfig = [];
				this.bankNum = 0;
				this.isDelBankConfig = true;
				// 获取聚合支付配置信息
				this.isHasH5Pay = false;
				this.$api("paymentManagement.getPayWayById", {id:scope.row.id,detailFlag:true}).then((result) => {
					this.payRuleForms = [];
					this.options = [];
					this.sonOptions = [];
					this.payRuleForm = {name:"",status:""};
					// console.log(result)	
					this.options.push({
						value:result.type,
						label:result.payType.name
					})
					this.typeVal = result.type;
					let isSonType = this.isSonType = !!result.payType.payTypeList;
					let firstType;
					// 判断是否有子支付类
					if(isSonType){
						this.isHasH5Pay = true;
						result.payType.payTypeList.forEach((item,index) => {
							this.objRuleForms[item.type] = result.merchantConfigList.find((i) => i.type == item.type);
							if(index == 0){
								this.payRuleForm.type = this.cacheSonTypeVal = this.sonTypeVal = item.type;
								firstType = item.type;
								this.objRuleForms[item.type] = this.payRuleForm;
							}
							this.sonOptions.push({
								value:item.type,
								label:item.name
							})
						})
					}
				
					// 渲染配置信息
					(result.payType.payTypeConfigList || []).forEach((item,index) => {
						if(item.status == 1){
							
							// 配置信息名称
							this.payRuleForms.push({
								name:item.name+":",
								key:item.paramKey,
								val:"",
								isRequire:!!item.required,
								max:item.maxLength,
								dataType:item.dataType,
								ruleName:result.type == 7 ? this.nameObj[item.paramKey] : ""
							})
							// 配置信息值
							if(isSonType){
								// console.log(result.merchantConfigList.find((i) => i.type == firstType))
								// debugger
								this.payRuleForm[item.paramKey] = result.merchantConfigList.find((i) => i.type == firstType)[item.paramKey];
							}else{
								this.payRuleForm[item.paramKey] = result.merchantConfigList[0][item.paramKey];
								if(result.type == 7 && !this.payRuleForm.id){
									this.payRuleForm.id = result.merchantConfigList[0].id+"";
								}
								if(item.dataType == '3'){//当数据项为上传文件时
									//获取文件上传的key名
									this.uploadKey = item.paramKey;
									//给文件名赋值
									this.fileList = [{
										name:result.merchantConfigList[0][item.paramKey]
									}]
								}
							}
							
						}
						
					})
					//判断是否是银行转账支付
					if(result.type == 7){
						this.isBank = true;
						let len = result.merchantConfigList.length;
						for(let i = 1;i < len;i++){
							let formInf = JSON.stringify(this.payRuleForms)
							this.bankConfig.push(JSON.parse(formInf))
							this.bankNum++;//新增银行转账的数量
							result.payType.payTypeConfigList.forEach((item,index) => {
								this.payRuleForm[(i-1)+'-'+item.paramKey] = result.merchantConfigList[i][item.paramKey];
								if(!this.payRuleForm[(i-1)+'-'+'id']){
									this.payRuleForm[(i-1)+'-'+'id'] = result.merchantConfigList[i].id+"";
								}
							})
						}
						
					}
					console.log(this.payRuleForm)
					this.payRuleForm.status = result.status+"";
					this.payRuleForm.name = result.name ? result.name : "";
					this.dialogNewPay = true;
				}, (result)=>{
					if(result.data.status != '102'){
						this.$message({
							message: result.data.msg,
							type: 'error'
						});
					}else{
						this.dialogNewPay = true;
					}

				})
			},
			disable(index,state,payTypeId){
				// debugger
				if (state == '停用') {//停用
					this.$confirm('停用后，此支付方式将无法使用，是否继续？', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						this.operationIsEnable(index,state);
					}).catch(() => {
						
					});      
				}else{//启用
					// switch(payTypeId){
					// 	case 4:
					// 		this.$api("paymentManagement.getMerchantConfig", {}).then((result) => {
								this.operationIsEnable(index,state);
							// }, (result)=>{
							// 	if(result.data.status != '102'){
							// 		this.$message({
							// 			message: result.data.msg,
							// 			type: 'error'
							// 		});
							// 	}else{
							// 		this.$message({
							// 			message: '请先完成配置参数后，再次操作！',
							// 			type: 'warning'
							// 		});    
							// 	}

							// })
							// break;
					// }
				}
			},
			operationIsEnable(index,state){
				let paymentMethodObj = this.paymentMethodList[index];
				var data = {
						'status':state === "启用" ? 1 : 0,
						'id':paymentMethodObj.id
					}
				this.$api("paymentManagement.enableOrStopPayment", data).then((result) => {
					this.$message({
						message: '操作成功！',
						type: 'success'
					});
					paymentMethodObj.status = state === "启用" ? "启用" : "停用";
					paymentMethodObj.operation = state === "启用" ? "停用" : "启用";
				}, (result)=>{
					this.$message({
						message: result.data.msg,
						type: 'error'
					});
				})
			},
			savePaymentConfig(formName,payTypeId){
				this.$refs.payRuleForm.validate((valid) => {
					if (valid) {
						let isHasTypeList = this.status === "add" ? !!this.payTypeList.find((item) => item.type == this.typeVal).payTypeList : this.isSonType;
						
						let aryData = [];
						if(isHasTypeList){//判断是否是银联支付
							let flagObj = {};
							let sonType;
							let objRuleForms = this.objRuleForms;
	
							for(let key in objRuleForms){
								flagObj[key] = true;
								
								if(objRuleForms[key]){
									for(let i in objRuleForms[key]){
										// 去除前后空格
										objRuleForms[key][i] = objRuleForms[key][i] ? (objRuleForms[key][i] +"").trim() : "";
										// 标记是否有没填写的参数项
										if(i !== "name" && objRuleForms[key][i] == ""){	
											flagObj[key] = false
											sonType = key;
											break;
										}
									}
								}else{
									flagObj[key] = false;
									sonType = key;
								}
								
								if(flagObj[key]){
									aryData.push(objRuleForms[key])
								}
							}
							// 检测是否所有参数都填写
							let flag = true;
							for(let key in flagObj){
								if(!flagObj[key]){
									flag = false;
								}
							}
							if(flag){//所有参数都填写
								ajaxSave(this);
							}else{//所有参数没有都填写
								let message = {
										"41":'"银联扫码支付"',
										"42":'"银联H5支付"'
									}
									this.$confirm(message[sonType]+'的配置信息没有填写，会存在无法支付的风险,是否继续？', '提示', {
										confirmButtonText: '继续',
										cancelButtonText: '返回',
										type: 'warning'
									}).then(() => {
										ajaxSave(this);
									}).catch(() => {
										return;
									});     
							}
						}else{
							console.log(this.payRuleForm)
							for(let key in this.payRuleForm){//去除前后空格
								this.payRuleForm[key] = this.payRuleForm[key].trim();
							}
							if(this.typeVal == 7){//银行转账
								let ary = [{type:7},{type:7},{type:7},{type:7},{type:7}];
								for(let key in this.payRuleForm){
									let splitAry = key.split('-');
									if(splitAry.length > 1){
										ary[parseInt(splitAry[0])+1][splitAry[1]] = this.payRuleForm[key]
									}else{
										if(key == 'name' || key == 'status'){
											continue;
										}
										ary[0][key] = this.payRuleForm[key]
									}
								}
								ary.length = (this.bankNum+1);
								aryData = ary;
							}else{//其他方式
								aryData.push(this.payRuleForm)
							}
							
							ajaxSave(this);//保存新怎支付方式的方法
						}
						
						function ajaxSave(that){
							// debugger
							// console.log(that.payRuleForm)
							let data = {
								name:that.payRuleForm.name,
								type:that.typeVal,
								status:that.payRuleForm.status,
								merchantConfig:JSON.stringify(aryData)
							}
							console.log(data)
						if (that.status === 'add') {
							that.$api("paymentManagement.addPayWay", data).then((result) => {
								that.dialogNewPay = false;
								that.$message({
									message: '新增成功！',
									type: 'success'
								});
								that.getPaymentList();
							}, (result)=>{
								if(result.data.status != '102'){
									that.$message({
										message: result.data.msg,
										type: 'error'
									});
								}

							})
						}else{
							data.id = that.editId;
							that.$api("paymentManagement.editPayWay",data).then((result) => {
								that.dialogNewPay = false;
								that.$message({
									message: '保存成功！',
									type: 'success'
								});
								that.getPaymentList();
							},(result) => {
								if(result.data.status != '102'){
									that.$message({
										message: result.data.msg,
										type: 'error'
									});
								}
							})
						}

						}
						
					}else{
						return;
					}
				})
			},
			addPayWay(){//新增支付方式
				// debugger
				let flag = this.$version == "neimao" ? 1 : 2;
				this.status = "add";
				this.disabled = false;
				this.payRuleForms = [];
				this.options = [];
				this.sonOptions = [];
				this.isHasH5Pay = false;
				this.bankConfig = [];
				// debugger;
				this.$api("paymentManagement.getPayWay",{filterFlag:1,tag:flag}).then((result) => {
					this.payRuleForms = [];
					this.options = [];
					this.sonOptions = [];
					this.payTypeList = result.list;
					result.list.forEach((item,index) => {
						if (index == 0) {
							this.typeVal = item.type;
						}

						if(item.payTypeList){
							if (index == 0) {
								this.isHasH5Pay = true;
							}
							item.payTypeList.forEach((sonItem,sonIndex) => {
								if(sonIndex == 0){
									if(index == 0){
										this.payRuleForm.type  = sonItem.type;
									}
									this.cacheSonTypeVal = this.sonTypeVal = sonItem.type;
									this.objRuleForms[sonItem.type] = this.payRuleForm;
								}else{
									this.objRuleForms[sonItem.type] = null;
								}
								// debugger;
								this.sonOptions.push({
									value:sonItem.type,
									label:sonItem.name
								})
							})

						}else{
							//是否是银行转账
							this.isBank = (index == 0 && item.type == 7) ? true : false;


							for(let key in this.payRuleForm){
								if(key != "status"){
									this.payRuleForm[key] = "";
								}
							}
							this.isHasH5Pay = false;//是否是H5支付方式
						}
						// }
						this.options.push({
							value:item.type,
							label:item.name
						})
					});
					(result.list[0].payTypeConfigList || []).forEach((item,index) => {
						if(item.status == 1){
							this.payRuleForms.push({
								name:item.name+":",
								key:item.paramKey,
								val:"",
								isRequire:!!item.required,
								max:item.maxLength,
								dataType:item.dataType,
								ruleName:result.type == 7 ? this.nameObj[item.paramKey] : ""
							})
						}
						
					})
					this.dialogNewPay = true;
					console.log(this.payRuleForm)
				},(result) => {
					if(result.data && result.data.status){
						switch(result.data.status+""){
							case '102':
							this.$message({
								message: '已无可新增的支付方式！',
								type: 'warning'
							});
							break;
							default:
							this.$message({
								message: result.data.msg,
								type: 'error'
							});
							break;
						}
					}else{
						this.$message({
							message: '网络错误！',
							type: 'error'
						});
					}

				})
			},
			payWayChange(val){
				this.payRuleForms = [];
				let selectedItem = this.payTypeList.find((item) => item.type == val);
				let payTypeConfigList = selectedItem.payTypeConfigList;
				// if(!selectedItem.payTypeList){
				// 	this.isHasH5Pay = false;
				// }else{
				// 	this.isHasH5Pay = true;
				// }
				this.isHasH5Pay = selectedItem.payTypeList ? true : false;//银联H5支付
				this.isBank = val == 7 ? true : false;
				payTypeConfigList.forEach((item,index) => {
					if(item.status == 1){
						this.payRuleForms.push({
							name:item.name+":",
							key:item.paramKey,
							val:"",
							isRequire:!!item.required,
							max:item.maxLength,
							dataType:item.dataType,
							ruleName:val == 7 ? this.nameObj[item.paramKey] : ""
						})
					}
				})
				for(let key in this.payRuleForm){
					if(key != "status"){
						this.payRuleForm[key] = "";
					}
				}
				if(!this.isHasH5Pay){
					delete this.payRuleForm.type;
				}else{
					this.payRuleForm.type = this.cacheSonTypeVal;
				}
				console.log(this.payRuleForm)
			},
			sonPayWayChange(val){
				let objRuleForms = this.objRuleForms;
				let current = objRuleForms[val];
				let payRuleForm = this.payRuleForm;
				payRuleForm.type = this.cacheSonTypeVal;
				objRuleForms[this.cacheSonTypeVal] = JSON.parse(JSON.stringify(this.payRuleForm));
				for(let key in payRuleForm){
					if(key != "name" && key != "status"){
						payRuleForm[key] = current && current[key] ? current[key] : "";
					}
				}
				payRuleForm.type = val;
				objRuleForms[val] = payRuleForm;
				this.cacheSonTypeVal = val;
			}
		},
		components: {
			pageTitle
			// pages
		}
	};
	</script>
	<style>
	ul,li,dl,dt,dt{
		list-style-type: none;
		margin: 0;
		padding: 0;
	}
	.ce-width-p{
		max-width: 300px
	}
	.ce-textarea{
		width: 500px;
	}
	.setSomeAreasFreight{
		margin: 0 0 22px 155px;
		padding: 10px;
		border-radius: 4px;
		border: 1px solid #eaeefb;
		max-width: 850px;
		min-width: 800px;
		overflow: hidden;
	}
	.ce-hint{
		padding-left: 20px;
		color: #999;
		font-size: 12px;
	}
	.ce-selectAreas{
		padding: 10px 0;
		font-size: 14px;
		overflow: hidden;
	}
	.ce-selectAreas li{
		width: 800px;
		overflow: hidden;
	}
	.ce-fl{
		float: left;
	}
	.ce-showSelectedAreas{
		border: 1px solid #eaeefb;
		display: inline-block;
		width: 180px;
		line-height: 26px;
		margin-right: 10px;
		padding-left: 5px;
	}
	.margin-r20{
		margin-right: 20px;
	}
	.margin-r10{
		margin-right: 10px;
	}
	.ce-marginBottom-18{
		margin-bottom: 18px;
	}
	.ce-input{ margin-right: 20px;}
	.bankStyle{
		background-color:#f4f4f4;
		padding:19px 0 1px 0;
		margin-bottom:10px;
		position:relative;
	}
	.delete-bank-config{
		position:absolute;
		bottom:18px;
		right:10px;
	}
	</style>
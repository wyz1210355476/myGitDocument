<template>
	<div class="contents">
		<page-title :title="$version == 'neimao' ?'短信设置' : '邮件设置'"></page-title>
		<div class="content-table">
			<el-table :data="messageList" style="width: 100%" size="mini" v-loading="isLoading" empty-text="没有相关信息">
				<el-table-column prop="number" label="序号">
				</el-table-column>
            	<el-table-column prop="name" label="模板名称">
            	</el-table-column>
            	<el-table-column prop="type" label="模板类型">
            	</el-table-column>
            	<el-table-column prop="status" label="状态">
            	</el-table-column>
	            <el-table-column label="操作" prop="operation">
	            	<template slot-scope="scope">
	            		<el-button
	            		@click.native.prevent = "checkModel(scope)"
	            		type="text" size="small">
	            		{{messageList[scope.$index].config}}
		            	</el-button>
		            	<el-button
		            	@click.native.prevent="disable(messageList[scope.$index].id, messageList[scope.$index].operation,scope.$index)"
		            	type="text"
		            	 size="small">
		            	{{messageList[scope.$index].operation}}
		            	</el-button>
		            </template>
		        </el-table-column>
		    </el-table>
		</div>
<!-- <pages :total="totalCount" @change="getPagesParam"></pages> -->
<el-dialog :title="title" :visible.sync="dialogMsgModel" width="500px">
	<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="125px" class="demo-ruleForm">
		<el-form-item label="通知项：" prop="title">
			{{ruleForm.title}}
		</el-form-item>
		<el-form-item label="短信通知模板：" prop="content">
			<el-input type="textarea" v-model="ruleForm.content" class="ce-width-p" auto-complete="off" size="medium" rows="4" :disabled="true"></el-input>
		</el-form-item>
		<el-form-item  v-if='ruleForm.isConfigurable' label="管理员手机号：" prop="number">
			<el-input type="text" v-model="ruleForm.number" class="ce-width-p" size="small"></el-input>
		</el-form-item>
	</el-form>
	<div style="text-align:right;margin-top:20px;">
		<el-button @click="dialogMsgModel = false" size="small">关闭</el-button>
		<el-button v-if='ruleForm.isConfigurable' type="primary" @click="saveConfig('ruleForm')" size="small">保存</el-button>
	</div>
</el-dialog>
</div>
</template>
<script>
import pageTitle from '@components/pageTitle';
import * as validator from '@c/util/validator';
	// import pages from '@components/pages';

	export default {
		data() {
			return {
				isLoading:false,
				messageList: [],
				dialogMsgModel:false,
				ruleForm:{
					title:'客户注册获取验证码',
					content:"亲您正在通过手机号注册成为{商城名称}客户，短信验证码为：{验证码}，请务必注意保密，感谢您的注册！",
					number:'',
					status:'',
					isConfigurable:false
				},
				rules:{
					number:[
						{required: true,message: '请输入手机号'},
						{ validator: validator.phone, message: '请输入正确的手机号', trigger: 'blur' }
					]
				},
				title:""
			}
		},
		mounted() {
			this.title = this.$version == "neimao" ? "短信通知模板" : "邮件通知模板";
			this.getMsgTemplate();
		},
		methods: {
			getMsgTemplate() {
				this.isLoading = true;
				console.log(this.$version)
				let data = {
					parentType:this.$version == "neimao" ? "SMS" : "MAIL"
				}
				// 获取支付列表
				this.$api("msgSet.getAllMsgTemplate", data).then((result) => {
					console.log(result);
					this.messageList = [];
					let num = 1;
					this.isLoading = false;
					let configBtn;
					result.forEach((item) => {
						configBtn = (item.id == 18 || item.id == 19) ? '编辑' : '查看';
						this.messageList.push({
							number:num++,
							name:item.name,
							id:item.id,
							type:item.type,
							status:item.status == 1 ? '启用' : '停用',
							config:configBtn,
							operation:item.status == 1 ? '停用' : '启用'
						})
					})
				}, (result)=>{
					this.isLoading = false;
					this.$message({
						message: result.data.msg,
						type: 'error'
					});
				})
			},
			checkModel(scope){
				// debugger
				console.log(scope.row)
				this.ruleForm = {};
				this.dialogMsgModel = true;
				this.$api("msgSet.getMsgTemplate",{id:scope.row.id}).then((result) => {
					console.log(result)
					this.ruleForm = {
						title:result.name,
						content:result.config,
						status:result.status,
						number:result.ruleContent,
						id:result.id,
						isConfigurable:(scope.row.id == 18 || scope.row.id == 19) ? true : false
					}
				},(error) => {
					this.isLoading = false;
					this.$message({
						message: result.data.msg,
						type: 'error'
					});
				})

			},
			disable(id,state,index){
				// debugger
				if (state == '停用') {//停用
					this.$confirm('停用后，此模板将无法使用，是否继续？', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						this.operationIsEnable(id,state,index);
					}).catch(() => {

					});
				}else{//启用
					this.operationIsEnable(id,state,index);
				}
			},
			operationIsEnable(id,state,index){
				let messageObj = this.messageList[index]
				var data = {
						'status':state === "启用" ? 1 : -1,
						'id':id
					}
				this.$api("msgSet.editMsgTemplate", data).then((result) => {
					this.$message({
						message: '操作成功！',
						type: 'success'
					});
					messageObj.status = state === "启用" ? "启用" : "停用";
					messageObj.operation = state === "启用" ? "停用" : "启用";
				}, (result)=>{
					this.$message({
						message: result.data.msg,
						type: 'error'
					});
				})
			},
			saveConfig(formName){
				this.$refs[formName].validate((valid) => {
					if(valid){
						let data = {
							id:this.ruleForm.id,
							status:this.ruleForm.status,
							ruleContent:this.ruleForm.number+""
						}
						console.log(data)
						this.$api('msgSet.editMsgTemplate',data).then((result) => {
							this.$message({
								message: '更新模板配置成功！',
								type: 'success'
							});
							this.dialogMsgModel = false;
						},(error) => {
							
						})
					}else{
						return false;
					}
				})
			}
		},
		components: {
			pageTitle
			// pages
		}
	}
	</script>
	<style>
	ul,li,dl,dt,dt{
		list-style-type: none;
		margin: 0;
		padding: 0;
	}
	.ce-width-p{
		width: 300px
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
	</style>
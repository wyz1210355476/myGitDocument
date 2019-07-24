<template>
	<div class="contents">
		<page-title title="基本设置"></page-title>
		<el-alert
	    	title=""
	    	type="success"
	    	:closable="false">
	    	<div><i class="el-icon-warning"></i> 系统会利用此功能，发送业务提醒等信息邮件，请正确填写邮箱信息，以保证本系统通过邮箱的发送的信息能够成功发送。</div>
	  	</el-alert>
		<div class="order-form">
			<el-form ref="form1" :model="setupInfo" :rules="rules" label-width="150px" size="small" v-loading="isLoading">
				<el-form-item label="邮箱地址：" prop="mailaddress" class="item-input-inline">
				    <el-input v-model="setupInfo.mailaddress"></el-input>
				    <span class="input-prompt" v-if="/^\w+([-+.]\w+)*@qq.com$/.test(setupInfo.mailaddress)">QQ邮箱的密码为授权码，<a href="http://www.300.cn/service/1213.html" target="_blank">如何获取</a></span>
				</el-form-item>
				<el-form-item label="密码：" prop="password">
				    <el-input v-model="setupInfo.password" type="password"></el-input>
				</el-form-item>
				<el-form-item label="发信名称：" prop="sendname">
				    <el-input v-model="setupInfo.sendname"></el-input>
				</el-form-item>
				<el-form-item label="发送服务器(SMTP)：" prop="stmpserver" class="item-input-inline">
				    <el-input v-model="setupInfo.stmpserver"></el-input>
				    <el-button type="text" size="small" :disabled="setupInfo.mailaddress == '' || !checkEmailRegexs.test(setupInfo.mailaddress)" @click="autoGetServicer">自动获取</el-button>
				</el-form-item>
			</el-form>
			<div class="btn-area left">
				<el-button type="primary" @click="submitForm('form1')" size="small" :loading="isBtnLoading">保存</el-button>
				<el-button @click="showEmailTest = true" size="small" plain>邮件测试</el-button>
			</div>
		</div>
		<el-dialog
		  	title="邮件测试"
		  	:visible.sync="showEmailTest"
		  	custom-class="emailTestDialog">
		  	<div>
				<el-form  ref="form2" :model="emailTest" :rules="rules2" label-width="100px" class="order-form" size="small" v-if="showEmailTest">
					<el-form-item label="邮箱地址：" prop="mailaddress">
					    <el-input v-model="emailTest.mailaddress"></el-input>
					</el-form-item>
				</el-form>
				<div class="btn-area">
					<el-button @click="showEmailTest = false" size="small" plain>取消</el-button>
					<el-button type="primary" @click="submitForm('form2')" size="small">确定</el-button>
				</div>
			</div>
		</el-dialog>
	</div>
</template>
<script>
	import pageTitle from '@components/pageTitle';
	import * as validator from '@c/util/validator';
	export default {
		data() {
			return {
				setupInfo: {
					mailaddress: '',
					password: '',
					sendname: '',
					stmpserver: ''
				},
				emailTest: {
					mailaddress: ''
				},
				showEmailTest: false,
				checkEmailRegexs: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
				rules: {
					mailaddress: [
						{ required: true, message: '请输入邮箱地址', trigger: 'blur' },
						{ validator: validator.checkEmai, message: '请输入正确的邮箱地址', trigger: 'blur'}
					],
					password: [
						{ required: true, message: '请输入密码', trigger: 'blur' }
					],
					sendname: [
						{ required: true, message: '请输入发信名称', trigger: 'change' }
					],
					stmpserver: [
						{ required: true, message: '请输入发送服务器', trigger: 'change' }
					]
				},
				rules2: {
					mailaddress: [
						{ required: true, message: '请输入邮箱地址', trigger: 'blur' },
						{ validator: validator.checkEmai, message: '请输入正确的邮箱地址', trigger: 'blur'}
					]
				},
				isLoading: false,
				isBtnLoading: false
			}
		},
		mounted() {
			this.getMailSet();
		},
		methods: {
			//获取邮箱设置信息
			getMailSet() {
				this.isLoading = true;
				this.$api("systemSetup.getMailSet").then((result) => {
					this.setupInfo = result;
					this.isLoading = false;
				}, (error) => {
					if (error && error.data && error.data.status == 102) {

					} else {
						this.$message({
			            	type: 'error',
			            	message: '获取基本设置信息失败！'
			          	});
					}
					this.isLoading = false;
				});
			},
			//自动获取发送服务器
			autoGetServicer() {
				let email = this.setupInfo.mailaddress.split('@')[1];
				this.setupInfo.stmpserver = 'smtp.' + email;
			},
			submitForm(formName) {
	        	this.$refs[formName].validate((valid) => {
		          	if (valid) {
		          		if (formName == 'form1') {
		            		this.saveSetup();
		          		}
		          		if (formName == 'form2') {
		          			this.testEmail();
		          		}
		          	} else {
		            	console.log('error submit!!');
		            	return false;
		          	}
	        	});
	      	},
	      	//保存
	      	saveSetup() {
	      		let data = {
					mailaddress: this.setupInfo.mailaddress,
					password: this.setupInfo.password,
					sendname: this.setupInfo.sendname,
					stmpserver: this.setupInfo.stmpserver
				}
				if (this.setupInfo.id && this.setupInfo.id != '') {
					data.id = this.setupInfo.id;
				}
				this.isBtnLoading = true;
	      		this.$api("systemSetup.saveMailSet", data).then((result) => {
	      			this.$message({
		            	type: 'success',
		            	message: '保存邮箱设置信息成功！'
		        	});
		        	this.isBtnLoading = false;
	      		}, (error) => {
	      			this.$message({
		            	type: 'error',
		            	message: '保存邮箱设置信息失败！'
		          	});
		          	this.isBtnLoading = false;
	      		});
	      	},
	      	//邮件测试
	      	testEmail() {
	      		this.$api("systemSetup.saveMailTest", this.emailTest).then((result) => {
	      			if (result.sendResult) {
	      				this.$message({
			            	type: 'success',
			            	message: '邮件发送成功！'
			        	});
			        	this.showEmailTest = false;
	      			} else {
	      				this.$message({
			            	type: 'error',
			            	message: '发送邮件失败！'
			          	});
	      			}
	      		}, (error) => {
	      			this.$message({
		            	type: 'error',
		            	message: '发送邮件失败！'
		          	});
	      		});
	      	}
		},
		components: {
			pageTitle
		}
	}
</script>
<style scoped>
	.order-form {margin-top: 20px;}
	.input-prompt {font-size: 12px; color: #999;}
	.input-prompt a {color: #409EFF; cursor: pointer; text-decoration: none;}
</style>
<style>
	.emailTestDialog {width: 480px;}
</style>
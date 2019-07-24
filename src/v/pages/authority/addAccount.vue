<template>
	<div class="order-form">
		<el-dialog
		  	title="创建子账号"
		  	:visible.sync="visible">
		  	<div>
				<el-form  ref="form1" :model="form1" :rules="rules" label-width="150px" class="order-form new-account-form" size="small">
					<el-form-item label="登录账号：" prop="alias" class="item-relative">
             			<el-input placeholder="建议格式:企业简称_子账号简称，如：cc_zq_xxd" v-model="form1.alias">
					    	<template slot="prepend">CC_</template>
					  	</el-input>
             			<el-tooltip class="item iconButtonTooltip" effect="light" content="4-12个字符，允许输入英文字母、数字及“_”" placement="bottom-end">
                			<i class="el-icon-question green"></i>
             			</el-tooltip>
        			</el-form-item>
        			<el-form-item label="密码：" prop="custPassword" class="item-relative">
					    <el-input placeholder="输入子账号登录密码" v-model="form1.custPassword" type="password"></el-input>
					    <el-tooltip class="item iconButtonTooltip" effect="light" content="8-32个字符，支持大小写英文字母、数字、“@”、“.”、“_”及“-”" placement="bottom-end">
                			<i class="el-icon-question green"></i>
             			</el-tooltip>
					</el-form-item>
					<el-form-item label="显示名称：" prop="memName">
					    <el-input placeholder="不超过12个字符" v-model="form1.memName"></el-input>
					</el-form-item>
					<el-form-item label="备注：" prop="comment">
					    <el-input placeholder="不超过50个字符" type="textarea" v-model="form1.comment"></el-input>
					</el-form-item>
					<el-form-item label="邮箱：" prop="custMail">
					    <el-input placeholder="输入邮箱" v-model="form1.custMail"></el-input>
					</el-form-item>
					<el-form-item label="联系电话：" prop="custTel" class="item-multi-input">
						<el-select v-model="form1.telZone" placeholder="请选择">
						    <el-option v-for="(code, i) in countryCodeList" :key="code" :label="code" :value="i"></el-option>
						</el-select>
					    <el-input placeholder="手机号或12位以内固定电话" v-model="form1.custTel"></el-input>
					</el-form-item>
				</el-form>
				<div class="btn-area bottom">
					<el-button @click="cancel" size="small" plain>取消</el-button>
					<el-button type="primary" @click="submitForm('form1')" class="btn-send" size="small" :loading="isBtnLoading">保存</el-button>
				</div>
			</div>
		</el-dialog>
	</div>
</template>
<script>
	import dialogVisibility from '@c/mixins/dialogVisibility';
	import * as validator from '@c/util/validator';
	export default {
		data() {
			let custTel = (rule, value, callback) => {
				if (/^[0-9]{0,12}$/.test(value)) {
				  	callback();
				} else {
				  	callback(new Error(''));
				}
			};
			return {
				countryCodeList: {},
				form1: {
					alias: '',
					custPassword: '',
					memName: '',
					comment: '',
					custMail: '',
					telZone: '',
					custTel: ''
				},
				rules: {
					 alias: [
	                    { required: true, message: '请输入登录账号', trigger: 'blur' },
	                    { min:4, max:12, message:'4-12个字符，允许输入英文字母、数字及“_”', trigger: 'blur'},
	                    { validator: validator.enOrNumOrUnderline, message:'4-12个字符，允许输入英文字母、数字及“_”', trigger: 'blur'}
	                ],
	                custPassword: [
	                    { required: true, message: '请输入子账号登录密码', trigger: 'blur' },
	                    { min: 8, max: 32, message: '8-32个字符，支持大小写英文字母、数字、“@”、“.”、“_”及“-”', trigger:'blur'},
	                    { validator: validator.pwdOfEnOrNum, message: '8-32个字符，支持大小写英文字母、数字、“@”、“.”、“_”及“-”', trigger: 'blur'}
	                ],
	                memName: [
	                    {min: 0, max: 12, message: '不超过12个字符', trigger: 'blur'}
	                ],
	                comment: [
	                    {min: 0, max: 50, message: '不超过50个字符', trigger: 'blur'}
	                ],
	                custMail: [
	                    { validator: validator.checkEmai, message:'邮箱格式不正确', trigger: 'blur'}
	                ],
	                custTel: [
	                    { validator: custTel, message:'联系方式格式不正确', trigger: 'blur'}
	                ]
				},
				isBtnLoading: false
			}
		},
		mixins: [dialogVisibility],
		mounted() {
			this.getTelZone();
		},
		methods: {
			//获取国际区号
			getTelZone() {
				this.$api("authority.getCountryCode").then((result) => {
					this.countryCodeList = result;
				}, (error) => {
					this.$message({
                        type: 'error',
                        message: '获取国际区号出错'
                    });
				})
			},
			submitForm(formName) {
	        	this.$refs[formName].validate((valid) => {
		          	if (valid) {
		            	this.saveNewAccount();
		          	} else {
		            	console.log('error submit!!');
		            	return false;
		          	}
	        	});
	      	},
	      	saveNewAccount() {
	      		let data = {
					alias: 'CC_' + this.form1.alias,
					custPassword: this.form1.custPassword,
					memName: this.form1.memName,
					comment: this.form1.comment,
					custMail: this.form1.custMail,
					telZone: this.form1.telZone,
					custTel: this.form1.custTel
				}
				this.isBtnLoading = true;
	      		this.$api("authority.addNewAccount", data).then((result) => {
	      			this.$message({
		            	type: 'success',
		            	message: '保存成功!'
		        	});
		        	this.$emit("save");
		        	this.visible = false;
		        	this.isBtnLoading = false;
	      		}, (error) => {
	      			this.$message({
		            	type: 'error',
		            	message: '保存失败!'
		        	});
		        	this.isBtnLoading = false;
	      		});
	      	},
			cancel() {
				this.visible = false;
			}
		}
	}
</script>
<style scoped>
	.iconButtonTooltip {position: absolute; top: 7px; right: 7px; font-size: 18px;}
</style>
<style>
	.order-form.new-account-form .el-form-item .el-input__inner,
	.order-form.new-account-form .el-form-item .el-textarea__inner{max-width: 365px;}
	.order-form.new-account-form .item-relative .el-form-item__content {max-width: 365px;}
</style>
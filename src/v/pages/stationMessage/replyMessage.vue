<template>
	<div>
		<el-dialog
		  	title="回复消息"
		  	:visible.sync="visible">
		  	<div class="order-form">
		  		<message-info type="in" :id="id" @getTitle="getReplyTitle"></message-info>
		  		<el-form ref="form1" :model="form1" :rules="rules" label-width="150px" size="small">
					<el-form-item label="回复标题：" prop="title">
					    <el-input v-model="form1.title"></el-input>
					</el-form-item>
					<el-form-item label="内容：" prop="content">
					    <el-input type="textarea" v-model="form1.content"></el-input>
					</el-form-item>
				</el-form>
				<div class="btn-area bottom">
					<el-button @click="cancel" size="small" plain>取消</el-button>
					<el-button type="primary" @click="submitForm('form1')" size="small" :loading="isBtnLoading">回复</el-button>
				</div>
		  	</div>
		</el-dialog>
	</div>
</template>
<script>
	import messageInfo from './messageInfo';
	import dialogVisibility from '@c/mixins/dialogVisibility';
	export default {
		data() {
			return {
				messageInfo: {},
				form1: {
					title: '',
					content: ''
				},
				rules: {
					title: [
						{ max: 30, message: '标题长度最多为30个字符', trigger: 'blur' }
					],
					content: [
						{ required: true, message: '请输入邮件内容', trigger: 'blur' },
						{ max: 500, message: '内容长度最多为500个字符', trigger: 'blur' }
					]
				},
				isBtnLoading: false
			}
		},
		props: ['id'],
		mixins: [dialogVisibility],
		methods: {
			//获取回复标题
			getReplyTitle(msg) {
				this.messageInfo = msg;
				this.form1.title = 'Re:' + msg.title;
			},
			submitForm(formName) {
	        	this.$refs[formName].validate((valid) => {
		          	if (valid) {
		            	this.replyMessage();
		          	} else {
		            	console.log('error submit!!');
		            	return false;
		          	}
	        	});
	      	},
			//回复信息
			replyMessage() {
				this.form1.id = this.id;
				this.isBtnLoading = true;
				this.$api("stationM.reMessage", this.form1).then((result) => {
					this.$message({
		            	type: 'success',
		            	message: '回复成功!'
		        	});
		        	this.visible = false;
		        	this.isBtnLoading = false;
				}, (error) => {
					this.$message({
		            	type: 'error',
		            	message: '回复失败！'
		          	});
		          	this.isBtnLoading = false;
				});
			},
			cancel() {
				this.visible = false;
			}
		},
		components: {
			messageInfo
		}
	}
</script>
<style scoped>
	.order-form { margin-bottom: 40px;}
	.order-form .order-form {margin-bottom: 32px;}
</style>
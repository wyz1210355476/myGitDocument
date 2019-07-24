<template>
	<div class="order-form">
		<el-dialog
		  	title="发送信息"
		  	:visible.sync="visible">
		  	<div>
				<el-form  ref="form1" :model="form1" :rules="rules" label-width="150px" class="order-form" size="small">
					<el-form-item label="收件人：" prop="loginid">
						<el-select v-model="form1.loginid" filterable multiple :multiple-limit="10" placeholder="请选择" style="width: 300px;" class="item-dropdown-select" popper-class="item-dropdown-option">
						    <el-option
						      	v-for="item in memberList"
						      	:key="item.value"
						      	:label="item.loginid"
						      	:value="item.loginid+','+item.uid"
						      	v-if="item.stat == 2"
						      	:title="item.loginid"
						      	>
						    </el-option>
						</el-select>
						<!-- <el-input v-model="form1.loginid" readonly></el-input>
						<choose-member @select="getSelectMember" :selectList="memberSelection" needParam="email" type="multi"></choose-member> -->
					</el-form-item>
					<el-form-item label="标题：" prop="title">
						<el-input v-model="form1.title"></el-input>
					</el-form-item>
					<el-form-item label="内容：" prop="content">
					    <el-input type="textarea" v-model="form1.content"></el-input>
					</el-form-item>
				</el-form>
				<div class="btn-area bottom">
					<el-button @click="cancel" size="small" plain>取消</el-button>
					<el-button type="primary" @click="submitForm('form1')" class="btn-send" size="small" :loading="isBtnLoading">发送</el-button>
				</div>
			</div>
		</el-dialog>
	</div>
</template>
<script>
	import dialogVisibility from '@c/mixins/dialogVisibility';
	export default {
		data() {
			let checkMemberExist = (rule, value, callback) => {
				let data = {
					'data[loginid]': value
				};
        		this.$api("stationM.checkMemberExist", data).then((result) => {
        			if (result) {
        				callback();
        			} else {
        				callback(new Error('您新添加的用户不存在，请重新添加'));
        			}
        		}, (error) => {
        			callback(new Error('校验用户失败'));
        		})
      		};
			return {
				form1: {
					loginid: '',
					title: '',
					content: '',
				},
				// memberSelection: [],
				memberList: [],
				rules: {
					loginid: [
						{ required: true, message: '请选择收件人', trigger: 'change' },
						// { validator: checkMemberExist, trigger: 'blur' }
					],
					title: [
						// { required: true, message: '请输入邮件标题', trigger: 'blur' }
						{max: 30, message: '标题长度最多为30个字符', trigger: 'blur'}
					],
					content: [
						{ required: true, message: '请输入邮件内容', trigger: 'blur' },
						{ max: 500, message: '内容长度最多为500个字符', trigger: 'blur' }
					]
				},
				isBtnLoading: false
			}
		},
		mixins: [dialogVisibility],
		mounted() {
			this.getMemberList();
		},
		methods: {
			//获取客户列表
			getMemberList() {
				this.$api("member.getMemberList", {page_size: '10000'}).then((result) => {
					this.memberList = result.list;
				}, (error) => {
					if (error && error.data && error.data.status == 102) {
						this.memberList = [];
					} else {
						this.$message({
							type: 'error',
			            	message: '获取客户列表失败'
						});
					}
				});
			},
			submitForm(formName) {
	        	this.$refs[formName].validate((valid) => {
		          	if (valid) {
		            	this.saveReturnDetail();
		          	} else {
		            	console.log('error submit!!');
		            	return false;
		          	}
	        	});
	      	},
	  //     	getSelectMember(msg) {
	  //     		this.memberSelection = msg;
	  //     		let loginid = '';
	  //     		let getemail = '';
	  //     		let stringuid = '';
	  //     		msg.forEach((v, i) => {
	  //     			loginid += v.loginid;
	  //     			stringuid += v.uid;
	  //     			getemail += v.email;
	  //     			if (i != msg.length-1) {
	  //     				loginid += '|';
	  //     				stringuid += '|';
	  //     				getemail += '|';
	  //     			}
	  //     		});
	  //     		this.form1.loginid = loginid;
	  //     		this.form1.getemail = getemail;
	  //     		this.form1.stringuid = stringuid;
			// },
			saveReturnDetail() {
				let data = {};
				let names = '';
	      		let ids = '';
	      		this.form1.loginid.forEach((v, i) => {
	      			let value = v.split(',');
	      			names += value[0];
	      			ids += value[1];
	      			if (i != this.form1.loginid.length-1) {
	      				names += ',';
	      				ids += ',';
	      			}
	      		});
	      		data.names = names;
	      		data.ids = ids;
	      		data.title = this.form1.title;
	      		data.content = this.form1.content;
	      		this.isBtnLoading = true;
  	  			this.$api("stationM.addMessage", data).then((result) => {
					this.$message({
		            	type: 'success',
		            	message: '发送成功!'
		        	});
		        	this.$emit("save");
		        	this.visible = false;
		        	this.isBtnLoading = false;
				}, (error) => {
					this.$message({
		            	type: 'error',
		            	message: '发送失败!'
		        	});
		        	this.isBtnLoading = false;
				})
			},
			cancel() {
				this.visible = false;
			}
		},
		// components: {
		// 	pageTitle,
		// 	chooseMember
		// }
	}
</script>
<style scoped>
</style>
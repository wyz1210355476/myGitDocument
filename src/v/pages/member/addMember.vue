<template>
	<div class="contents">
		<page-title :title="id=='-1'?'新增客户':'编辑客户'" goback></page-title>
		<el-tabs v-model="tab">
	    	<el-tab-pane label="客户信息" name="0">
				<el-form ref="form1" :model="memberInfo" :rules="rules" label-width="150px" size="small" class="order-form"  v-loading="isLoading">
	    			<el-form-item label="客户名称：" prop="loginid" class="item-input-inline">
					    <el-input v-model="memberInfo.loginid"></el-input><!-- :readonly="id != '-1'" -->
					    <span class="input-prompt">支持中文、英文、数字、"-"、"_"的组合，2-20个字符<!--，不能为纯数字--></span>
					</el-form-item>
					<el-form-item label="密码：" prop="pwd" class="item-input-inline">
					    <el-input v-model="memberInfo.pwd" type="password"></el-input>
					    <span class="input-prompt">建议使用字母、数字和符号两种及以上的组合，6-20个字符</span>
					</el-form-item>
					<el-form-item label="姓名：" prop="truename">
					    <el-input v-model="memberInfo.truename"></el-input>
					</el-form-item>
					<el-form-item label="性别：" prop="sex">
    					<el-radio-group v-model="memberInfo.sex">
      						<el-radio :label="1">男</el-radio>
      						<el-radio :label="2">女</el-radio>
    					</el-radio-group>
  					</el-form-item>
  					<el-form-item label="出生日期：" prop="birthday" class="item-input-inline">
      					<el-date-picker type="date" v-model="memberInfo.birthday" style="width: 100%;" value-format="yyyy-MM-dd"></el-date-picker>
      					<span class="input-prompt">日期格式：yyyy-MM-dd</span>
  					</el-form-item>
  					<el-form-item label="身份证号：" prop="idcard" v-if="$version === 'neimao'">
					    <el-input v-model="memberInfo.idcard"></el-input>
					</el-form-item>
					<el-form-item label="手机：" prop="mobile" class="item-input-inline">
					    <el-input v-model="memberInfo.mobile"></el-input>
					    <el-checkbox v-model="memberInfo.is_receive_mobile" :true-label="1" :false-label="0">接收企业短信</el-checkbox>
					</el-form-item>
					<el-form-item label="邮箱：" prop="email" class="item-input-inline">
					    <el-input v-model="memberInfo.email"></el-input>
					    <el-checkbox v-model="memberInfo.is_receive_email" :true-label="1" :false-label="0">接收企业邮箱</el-checkbox>
					</el-form-item>
				</el-form>
				<div class="btn-area left">
					<el-button type="primary" @click="submitForm('form1')" size="small" :loading="isBtnLoading">保存</el-button>
				</div>
    		</el-tab-pane>
    		<el-tab-pane label="收货地址" name="1" v-if="id !== '-1'">
				<add-address :client_id="id" :address_id="address_id" @save="saveAddress" v-if="tab == '1'"></add-address>
				<address-list ref="addressList" :client_id="id" @operate="editAddress" inline_operation showDefaultAddress v-if="tab == '1'"></address-list>
    		</el-tab-pane>
  		</el-tabs>
	</div>
</template>
<script>
	import * as validator from '@c/util/validator';
	import addAddress from '@v/pages/address/addAddress';
	import addressList from '@v/pages/address/addressList';
	import pageTitle from '@components/pageTitle';
	export default {
		data() {
			return {
				id: this.$route.query.id,
				address_id: '',
				tab: '0',
				tagList: [],
				oldPwd: '',
				memberInfo: {
					loginid: '',
					pwd: '',
					truename: '',
					sex: 1,
					birthday: '',
					idcard: '',
					mobile: '',
					is_receive_mobile: 1,
					email: '',
					is_receive_email: 1
				},
				rules: {
					loginid: [
						{ required: true, message: '请输入用户名', trigger: 'blur' },
						{ min: 2, max: 20, message: '2-20个字符', trigger: 'blur' },
						{ validator: validator.cnOrEnOrNumOrLine, message: '仅支持输入中英文、数字、-、_，且必须含有中英文、数字', trigger: 'blur' }
					],
					pwd: [
						{ required: true, message: '请输入密码', trigger: 'blur' },
						{ min: 6, max: 20, message: '6-20个字符', trigger: 'blur' },
						{ validator: validator.pwdOfEnOrNumOrOther, message: '仅支持输入英文、数字以及特殊字符', trigger: 'blur'}
					],
					truename: [
						{ min: 2, max: 20, message: '2-20个字符', trigger: 'blur' },
						{ validator: validator.cnOrEnOrNumOrLineOrSpace, message: '仅支持输入中英文、数字、-、_、空格，且必须含有中英文、数字', trigger: 'blur' }
					],
					// birthday: [
					// 	{ validator: validator.dateCheck, message: '请输入正确的日期', trigger: 'blur' }
					// ],
					idcard: [
						{ validator: validator.ChinaIDCard, message: '仅支持输入正确的身份证号码', trigger: 'blur' }
					],
					mobile: this.$version === 'neimao' ? [
						{ required: true, message: '请输入手机号', trigger: 'blur' },
						{ validator: validator.phone, message: '请输入正确的手机号', trigger: 'blur' }
					] : [],
					email: this.$version === 'neimao' ? [
						// { required: true, message: '请输入邮箱', trigger: 'blur' },
						{ max: 100, message: '邮箱长度不能超过100', trigger: 'blur' },
						{ validator: validator.checkEmai, message: '请输入正确的邮箱', trigger: 'blur' }
					] : [
						{ required: true, message: '请输入邮箱', trigger: 'blur' },
						{ max: 100, message: '邮箱长度不能超过100', trigger: 'blur' },
						{ validator: validator.checkEmai, message: '请输入正确的邮箱', trigger: 'blur' }
					]
				},
				isLoading: false,
				isBtnLoading: false
			}
		},
		mounted() {
			// this.getTagList();
			if (this.id != '-1') {
				this.getMemberInfo();
			}
		},
		methods: {
			//获取客户信息
			getMemberInfo() {
				this.isLoading = true;
				this.$api("member.viewMember", {uid: parseInt(this.id)}).then((result) => {
					let keys = ['loginid', 'truename', 'sex', 'birthday', 'idcard', 'mobile', 'is_receive_mobile', 'email', 'is_receive_email'];
					for (var i in keys) {
						this.memberInfo[keys[i]] = result[keys[i]];
					}
					let tags = [];
					if (result.tags.length) {
						result.tags.forEach((v) => {
							tags.push(v.id);
						});
					}
					this.memberInfo.tags = tags;
					this.memberInfo.pwd = '12345678901234567890';
					this.oldPwd = '12345678901234567890';
					this.isLoading = false;
				}, (error) => {
					this.isLoading = false;
					this.$message({
	                    type: 'error',
	                    message: '获取客户信息失败！'
	                });
				});
			},
			//标签列表
			// getTagList() {
			// 	this.$api("member.getTagList").then((result) => {
			// 		this.tagList = result;
			// 	}, (error) => {
   //                  if (error && error.data && error.data.status == 102) {
   //                  	this.tagList = [];
   //                  } else {
   //                  	this.$message({
   //                          type: 'error',
   //                          message: '获取标签列表失败！'
   //                      });
   //                  }
			// 	});
			// },
			submitForm(formName) {
	        	this.$refs[formName].validate((valid) => {
		          	if (valid) {
		            	this.sortData();
		          	} else {
		            	console.log('error submit!!');
		            	return false;
		          	}
	        	});
	      	},
	      	//整理数据
	      	sortData() {
	      		this.isBtnLoading = true;
	      		let data = {};
	      		for (var i in this.memberInfo) {
	      			if (i != 'tags' && i != 'pwd') {
	      				data[i] = this.memberInfo[i];
	      			}
	      		}
				if (this.id == '-1') {
					data.pwd = this.memberInfo.pwd;
					this.saveNewMember(data);
				}
				if (this.id != '-1') {
					data.uid = this.id;
					if (this.memberInfo.pwd != this.oldPwd) {
						data.pwd = this.memberInfo.pwd;
					}
					this.saveEditMember(data);
				}
	      	},
	      	//保存新增客户
	      	saveNewMember(data) {
	      		this.$api("member.addMember", data).then((result) => {
	      			this.$message({
                        type: 'success',
                        message: '保存成功!'
                    });
                    this.isBtnLoading = false;
	      			this.$router.push({name: 'member_list'});
	      		}, (error) => {
	      			this.isBtnLoading = false;
	      			if (error && error.data && error.data.status == 301) {
	      				this.$message({
	                        type: 'error',
	                        message: error.data.msg
	                    });
	      			} else {
	      				this.$message({
	                        type: 'error',
	                        message: '保存失败！'
	                    });
	      			}
	      		});
	      	},
	      	//保存编辑客户
	      	saveEditMember(data) {
	      		this.$api("member.editMember", data).then((result) => {
	      			this.$message({
                        type: 'success',
                        message: '保存成功!'
                    });
                    this.isBtnLoading = false;
	      			this.$router.push({name: 'member_list'});
	      		}, (error) => {
	      			this.isBtnLoading = false;
	      			if (error && error.data && error.data.status == 301) {
	      				this.$message({
	                        type: 'error',
	                        message: error.data.msg
	                    });
	      			} else {
	      				this.$message({
	                        type: 'error',
	                        message: '保存失败！'
	                    });
	      			}
	      		});
	      	},
	      	//编辑地址
	      	editAddress(id) {
	      		this.address_id = '';
	      		this.$nextTick(() => {
	      			this.address_id = id;
	      		});
	      	},
	      	//保存地址
	      	saveAddress() {
				this.$refs.addressList.getShipAddress();
	      		// this.$router.push({name: 'member_list'});
	      	}
		},
		components: {
			pageTitle,
			addAddress,
			addressList
		}
	}
</script>
<style scoped>
.input-prompt {font-size: 12px; color: #ccc;}
.order-form {margin-top: 10px;}
</style>
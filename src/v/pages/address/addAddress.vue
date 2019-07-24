<template>
	<div class="order-form">
		<el-form ref="form1" :rules="rules" :model="form1" label-width="150px" size="small" v-loading="isLoading">
			<el-form-item label="收货人：" prop="name">
			    <el-input v-model="form1.name"></el-input>
			    <span class="input-prompt">支持中文、英文、数字、"-"、"_"的组合，2-20个字符</span>
			</el-form-item>
			<el-form-item label="所在地区：" prop="aid">
			    <region-cascader v-model="form1.aid" :version="$version" @change="handleAreaChange"></region-cascader>
			</el-form-item>
			<el-form-item label="详细地址：" prop="detail">
			    <el-input type="textarea" :maxlength="200" v-model="form1.detail"></el-input>
			</el-form-item>
			<el-form-item label="手机号码：" prop="phone">
			    <el-input v-model="form1.phone"></el-input>
			</el-form-item>
			<el-form-item label="固定电话：" prop="tel" v-if="$version === 'neimao'">
			    <el-input v-model="form1.tel"></el-input>
			</el-form-item>
			<el-form-item label="邮箱：" prop="email">
			    <el-input v-model="form1.email"></el-input>
			</el-form-item>
			<el-form-item label="邮政编码：" prop="code">
			    <el-input v-model="form1.code"></el-input>
			</el-form-item>
			<el-form-item label="" prop="sets">
				<el-checkbox-group v-model="form1.sets">
			    	<el-checkbox label="设为默认地址"></el-checkbox>
			    </el-checkbox-group>
			</el-form-item>
		</el-form>
		<div class="btn-area" :class="{left: !showAsDialog}">
  			<el-button v-if="showAsDialog" @click="cancelDetail" size="small" plain>取消</el-button>
  			<el-button type="primary" @click="submitForm('form1')" size="small" :loading="isBtnLoading">保存</el-button>
  			<el-button v-if="!showAsDialog" @click="resetData" size="small" plain>重置</el-button>
  		</div>
	</div>
</template>
<script>
	// import RegionPicker from '@components/RegionPicker';
	import RegionCascader from '@components/RegionCascader';
	import * as validator from '@c/util/validator';
	import {deepCopy} from '@c/util';
	export default {
		data() {
			let checkRegion = (rule, value, callback) => {
        		if (this.form1.areaid != '') {
        			callback();
        		} else if (this.form1.cityid != '' && (this.form1.pid == '810000' || this.form1.pid == '820000')) {
        			callback();
        		} else if (this.form1.pid == '710000') {
        			callback();
        		} else {
        			callback(new Error());
        		}
      		};
			return {
				form1: {
					name: '',
					areaid: '',
					pid: '',
					cityid: '',
					detail: '',
					phone: '',
					tel: '',
					code: '',
					sets: '',
					email: '',
					country: '',
					aid: []
				},
				areaid: [],
				countryList: [],
				oldForm: {},
				rules: {
					name: [
						{ required: true, message: '请输入收货人姓名', trigger: 'blur' },
						{ min: 2, max: 20, message: '2-20个字符', trigger: 'blur' },
						{ validator: validator.cnOrEnOrNumOrLine, message: '仅支持输入中英文、数字、-、_，且必须含有中英文、数字', trigger: 'blur' }
					],
					aid: [
						{ required: true, message: '请选择所在地区', trigger: 'change' }
					],
					detail: [
						{ required: true, message: '请输入收货人地址', trigger: 'blur' },
					],
					country: [
						{ required: true, message: '请选择国家', trigger: 'blur' },
					],
					phone: this.$version === 'neimao' ? [
						{ validator: validator.phone, message: '请输入正确的手机号', trigger: 'blur' }
					] : [],
					tel: [
						{ validator: validator.telAll, message: '请输入正确的电话号码', trigger: 'blur' }
					],
					code: this.$version === 'neimao' ? [
						{ validator: validator.ChinaPostCode, message: '请输入正确的邮政编码', trigger: 'blur' }
					] : [],
					email: this.$version === 'neimao' ? [
						{ validator: validator.checkEmai, message: '请输入正确的邮箱', trigger: 'blur' }
					] : [
						{ required: true, message: '请输入邮箱', trigger: 'blur' },
						{ validator: validator.checkEmai, message: '请输入正确的邮箱', trigger: 'blur' }
					]
				},
				isLoading: false,
				isBtnLoading: false
			}
		},
		props: {
			client_id: {
				type: [String, Number],
				required: true
			},
			address_id: {
				type: [String, Number]
			},
			showAsDialog: {
				type: [Boolean],
				default: false
			}
		},
		watch: {
			address_id: {
				handler(v) {
					if (v != '') {
						this.getAddressDetail();
					} else {
						this.resetData();
					}
				},
				deep: true
			}
		},
		mounted() {
			if (this.address_id && this.address_id != '') {
				this.getAddressDetail();
			}
		},
		methods: {
			getAddressDetail() {
				this.isLoading = true;
				this.$api("address.getShipAddress", {clientId: this.client_id, id: this.address_id}).then((result) => {
					this.form1 = result[0];
					this.form1.country = result[0].country ? parseInt(result[0].country) : '';
					this.form1.tel = result[0].tel ? result[0].tel : '';
					this.form1.code = result[0].code ? result[0].code : '';
					this.form1.sets = result[0].sets == '2' ? true : false;
					this.form1.aid = this.$version === 'waimao' ? (result[0].country ? [parseInt(result[0].country)] : []) : [result[0].pid, result[0].cityid, result[0].areaid];
					this.oldForm = deepCopy(this.form1);
					this.isLoading = false;
				}, (error) => {
					this.isLoading = false;
					this.$message({
						type: 'error',
		            	message: '获取收货地址信息失败'
					});
				})
			},
			handleAreaChange(area) {
				if (this.$version === 'neimao') {
					this.form1.pid = area[0];
					this.form1.cityid = area[1];
					this.form1.areaid = area[2];
				}
				if (this.$version === 'waimao') {
					this.form1.country = area[0];
				}
			},
			submitForm(formName) {
	        	this.$refs[formName].validate((valid) => {
		          	if (valid) {
		          		if (this.$version === 'neimao' && this.form1.phone == '' && this.form1.tel == '') {
		          			this.$message({
				            	type: 'error',
				            	message: '手机号码与固定电话不能同时为空!'
				        	});
				        	return;
		          		}
		            	this.saveDetail();
		          	} else {
		            	console.log('error submit!!');
		            	return false;
		          	}
	        	});
	      	},
			saveDetail() {
				let data = {
					client_id: this.client_id,
					name: this.form1.name,
					detail: this.form1.detail,
					code: this.form1.code ? this.form1.code : '',
					phone: this.form1.phone ? this.form1.phone : '',
					email: this.form1.email ? this.form1.email : '',
					tel: this.form1.tel ? this.form1.tel : '',
					sets: this.form1.sets ? '2' : '1'
				};
				if (this.$version === 'neimao') {
					data.pid = this.form1.pid;
					data.cityid = this.form1.cityid;
					data.areaid = this.form1.areaid;
				}
				if (this.$version === 'waimao') {
					data.country = this.form1.country;
				}
				this.isBtnLoading = true;
				if (this.address_id && this.address_id != '') {
					data.id = this.address_id;
					this.$api("address.editShipAddress", data).then((result) => {
						this.$message({
			            	type: 'success',
			            	message: '编辑收货地址成功!'
			        	});
			        	this.isBtnLoading = false;
			        	this.$emit('save', this.address_id);
					}, (error) => {
						this.isBtnLoading = false;
						this.$message({
			            	type: 'error',
			            	message: '编辑收货地址失败！'
			          	});
					});
				} else {
					this.$api("address.addShipAddress", data).then((result) => {
						this.$message({
			            	type: 'success',
			            	message: '添加收货地址成功!'
			        	});
			        	this.isBtnLoading = false;
			        	this.$emit('save', result.address_id);
					}, (error) => {
						this.isBtnLoading = false;
						this.$message({
			            	type: 'error',
			            	message: '添加收货地址失败！'
			          	});
					});
				}
			},
			cancelDetail() {
				this.$emit("cancel");
			},
			resetData() {
				this.form1 = this.address_id && this.address_id != '' ? deepCopy(this.oldForm) : {
					name: '',
					areaid: '',
					pid: '',
					cityid: '',
					detail: '',
					phone: '',
					tel: '',
					code: '',
					sets: '',
					country: '',
					aid: []
				}
			}
		},
		components: {
			RegionCascader
		}
	}
</script>
<style scoped>
.add-address-area {width: 608px;}
.input-prompt {font-size: 12px; color: #ccc;}
</style>
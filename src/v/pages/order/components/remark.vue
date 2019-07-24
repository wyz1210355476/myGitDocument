<template>
	<div class="order-form window-order-form">
		<div class="order-info" v-if="showRemarkList" v-loading="isLoading">
			<div class="info-title">备注记录</div>
			<div class="infos">
				<ul class="remark-list" v-if="remarkList.length != 0">
					<li v-for="remark in remarkList" v-if="typeOfComp == remark.is_admin" :key="remark.id">
						<span>{{remark.create_time}}</span>
						<span>{{remark.client_name}}</span>
						<span>添加备注：<i class="el-icon-star-on" :class="remark.tag | getColor"></i> <span class="orange">{{remark.content}}</span></span>
					</li>
				</ul>
				<div v-if="remarkList.length == 0" style="line-height: 60px; text-align: center;">暂无记录</div>
			</div>
		</div>
		<div class="order-info" v-if="addable">
			<div class="info-title">添加备注</div>
			<div class="infos">
				<el-form ref="form1" :model="form1" :rules="rules" label-width="80px" size="small" style="margin-top: 10px;">
					<el-form-item label="备注标记">
					    <el-radio-group v-model="form1.tag">
					      	<el-radio label="0"><i class="el-icon-star-on red"></i></el-radio>
					      	<el-radio label="1"><i class="el-icon-star-on green"></i></el-radio>
					      	<el-radio label="2"><i class="el-icon-star-on yellow"></i></el-radio>
					      	<el-radio label="3"><i class="el-icon-star-on blue"></i></el-radio>
					      	<el-radio label="4"><i class="el-icon-star-on purple"></i></el-radio>
					    </el-radio-group>
					</el-form-item>
					<el-form-item label="订单备注" prop="content" class="item-remark">
					    <el-input v-model="form1.content"></el-input>
						<el-button type="text" @click="submitForm('form1')" size="small" :loading="isBtnLoading">提交</el-button>
					</el-form-item>
				</el-form>
			</div>
		</div>
		<div v-if="showCancelBtn" class="btn-area bottom">
			<el-button @click="cancel" size="small" plain>关闭</el-button>
		</div>
	</div>
</template>
<script>
	import orderApi from '@c/mixins/orderApi'
	export default {
		data() {
			return {
				remarkList: [],
				showRemarkList: false,
				form1: {
					tag: '0',
					content: ''
				},
				rules: {
					content: [
						{ required: true, message: '请输入标记内容', trigger: 'blur' },
						{ max: 200, message: '最多可输入200个字符', trigger: 'blur'}
					]
				},
				isLoading: false,
				isBtnLoading: false
			}
		},
		mixins: [orderApi],
		props: {
			id: {
				type: [String, Number],
				required: true
			},
			type: {
				type: String,
				default: 'admin',
			},
			addable: {
				type: Boolean,
				default: true
			},
			showCancelBtn: {
				type: Boolean,
				default: true
			}
		},
		computed: {
			typeOfComp() {
				if (this.type == 'customer') { return '0'; }
				if (this.type == 'admin') { return '1'; }
			}
		},
		filters: {
			getColor(v) {
				if (v == "0") { return 'red'; }
				if (v == "1") { return 'green'; }
				if (v == "2") { return 'yellow'; }
				if (v == "3") { return 'blue'; }
				if (v == "4") { return 'purple'; }
			}
		},
		mounted() {
			this.getRemark();
		},
		methods: {
			//获取备注信息
			getRemark() {
				this.isLoading = true;
				this.$api(this.orderApi[this.$version] + ".getRemark", {orderId: this.id}).then((result) => {
					this.remarkList = result;
					let index = this.remarkList.findIndex(v => v.is_admin == this.typeOfComp);
					if (index > -1) {
						this.showRemarkList = true;
					} else {
						this.showRemarkList = false;
					}
					this.isLoading = false;
				}, (error) => {
					this.isLoading = false;
					if (error && error.data && error.data.status == 102) {

					} else {
						this.$message({
			            	type: 'error',
			            	message: '获取备注信息失败'
			          	});
					}
				});
			},
			submitForm(formName) {
	        	this.$refs[formName].validate((valid) => {
		          	if (valid) {
		            	this.saveRemark();
		          	} else {
		            	console.log('error submit!!');
		            	return false;
		          	}
	        	});
	      	},
			//保存备注
			saveRemark() {
				this.form1.order_id = this.id;
				let data = {
					orderMemo: this.form1
				}
				this.isBtnLoading = true;
				this.$api(this.orderApi[this.$version] + ".addRemark", data).then((result) => {
					this.$message({
		            	type: 'success',
		            	message: '添加备注成功!'
		        	});
					this.getRemark();
					//清除数据
					this.form1.tag = '';
					this.form1.content = '';
					this.isBtnLoading = false;
				}, (error) => {
					this.$message({
		            	type: 'error',
		            	message: '添加备注失败！'
		          	});
		          	this.isBtnLoading = false;
				});
			},
			cancel() {
				this.$emit("close")
			}
		}
	}
</script>
<style>
</style>
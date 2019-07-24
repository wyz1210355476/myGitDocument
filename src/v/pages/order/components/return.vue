<template>
	<div class="window-order-form error-text-nowrap">
		<el-form ref="form1" :model="form1" :rules="rules" label-width="100px" class="order-form" size="small" v-loading="isLoading">
			<div class="info-inline">
				<el-form-item label="订单编号：">
		    		<span>{{orderInfo.no}}</span>
		  		</el-form-item>
		  		<el-form-item label="订单日期：">
		    		<span>{{orderInfo.create_time}}</span>
		  		</el-form-item>
		  		<el-form-item label="退货原因：" prop="reason">
				    <el-select v-model="form1.reason" placeholder="请选择退货原因">
				      	<el-option label="质量原因" value="质量原因"></el-option>
				      	<el-option label="无理由" value="无理由"></el-option>
				      	<el-option label="其他" value="其他"></el-option>
				    </el-select>
				</el-form-item>
				<!-- <el-form-item label="配送方式：" prop="logistics_type">
				    <el-select v-model="form1.logistics_type" placeholder="请选择配送方式">
				      	<el-option  v-for="option in shipTypeList"  v-if="option.disabled == '1'" :label="option.name" :key="option.id" :value="option.id"></el-option>
				    </el-select>
				</el-form-item> -->
				<el-form-item label="物流公司：" prop="logistics_name">
				    <el-input v-model="form1.logistics_name"></el-input>
				</el-form-item>
				<el-form-item label="配送单号：" prop="tracking_number">
				    <el-input v-model="form1.tracking_number"></el-input>
				</el-form-item>
				<!-- <el-form-item label="物流公司：" prop="logistics_id">
				    <el-select v-model="form1.logistics_id" placeholder="请选择物流公司">
				      	<el-option v-for="item in companyList"  v-if="item.disabled == '1'" :key="item.code" :label="item.name" :value="item.code"></el-option>
				    </el-select>
				</el-form-item> -->
				<el-form-item label="配送费用：" prop="freight">
		    		<el-input v-model="form1.freight"></el-input>
		  		</el-form-item>
		  		<el-form-item label="退货人姓名：" prop="consigner_name">
				    <el-input v-model="form1.consigner_name"></el-input>
				</el-form-item>
				<el-form-item label="联系电话：" prop="consigner_tel">
				    <el-input v-model="form1.consigner_tel"></el-input>
				</el-form-item>
				<el-form-item label="退货地区：" prop="aid" class="info-block">
				    <region-cascader v-model="form1.aid" :version="$version" @change="handleAreaChange"></region-cascader>
				</el-form-item>
				<el-form-item label="退货地址：" prop="consigner_address" class="info-block">
		    		<el-input type="textarea" v-model="form1.consigner_address"></el-input>
		  		</el-form-item>
		  		<!-- <el-form-item label="固定电话：" prop="phone">
				    <el-input v-model="form1.phone"></el-input>
				</el-form-item>
	  			<el-form-item label="邮政编码：" prop="mail">
				    <el-input v-model="form1.mail"></el-input>
				</el-form-item> -->
				<el-form-item label="退货单备注：" prop="memo" class="info-block">
		    		<el-input type="textarea" v-model="form1.memo"></el-input>
		  		</el-form-item>
			</div>
			<el-form-item prop="goods_num" class="table-item" size="mini">
		  		<el-table :data="goodsList" style="width: 100%" class="table-one-line">
					<el-table-column label="货品编号">
						<template slot-scope="scope">
	                		<div class="one-line" :title="scope.row.sku_bn">{{scope.row.sku_bn}}</div>
	                	</template>
			        </el-table-column>
			        <el-table-column label="货品名称">
			        	<template slot-scope="scope">
	                		<div class="one-line" :title="scope.row.sku_name">{{scope.row.sku_name}}</div>
	                	</template>
			        </el-table-column>
			        <el-table-column label="当前库存" prop="store">
			        </el-table-column>
			        <el-table-column label="购买数量" prop="quantity">
			        </el-table-column>
			        <el-table-column label="已发货数量" prop="quantity">
			        </el-table-column>
			        <el-table-column label="已退货数量" prop="returnedNum">
			        </el-table-column>
			        <el-table-column label="退货数量">
			        	<template slot-scope="scope">
			        		<el-input v-model="scope.row.goods_num"></el-input>
			        	</template>
			        </el-table-column>
				</el-table>
			</el-form-item>
		</el-form>
		<div class="btn-area bottom">
			<el-button @click="cancel" plain size="small">取消</el-button>
			<el-button type="primary" @click="submitForm('form1')" size="small" :loading="isBtnLoading">退货</el-button>
		</div>
	</div>
</template>
<script>
	// import RegionPicker from '@components/RegionPicker'
	import RegionCascader from '@components/RegionCascader'
	import * as validator from '@c/util/validator'
	import {formatDate} from '@c/util'
	import orderApi from '@c/mixins/orderApi'
	export default {
		data() {
			let checkRegion = (rule, value, callback) => {
        		if (this.form1.consigner_area != '') {
        			callback();
        		} else if (this.form1.consigner_city != '' && (this.form1.consigner_province == '810000' || this.form1.consigner_province == '820000')) {
        			callback();
        		} else if (this.form1.consigner_province == '710000') {
        			callback();
        		} else {
        			callback(new Error());
        		}
      		};
      		let checkNum = (rule, value, callback) => {
        		this.goodsList.forEach((v) => {
        			if (!/^[0-9]+$/.test(v.goods_num) || parseInt(v.goods_num) < 0) {
        				callback(new Error());
        			}
        		});
        		callback();
      		};
      		let checkReturnNum = (rule, value, callback) => {
        		this.goodsList.forEach((v) => {
        			if (parseInt(v.quantity) < parseInt(v.returnedNum) + parseInt(v.goods_num)) {
        				callback(new Error());
        			}
        		});
        		callback();
      		};
			return {
				form1: {
					reason: '',
					// logistics_id: '',
					// logistics_type: '',
					logistics_name: '',
					tracking_number: '',
					consigner_name: '',
					consigner_tel: '',
					consigner_country: '',
					consigner_province: '',
					consigner_city: '',
					consigner_area: '',
					consigner_address: '',
					memo: '',
					order_id: '',
					freight: '',
					aid: []
				},
				orderInfo: {},
				rules: {
					// logistics_type: [
					// 	{ required: true, message: '请选择配送方式', trigger: 'change' }
					// ],
					// logistics_id: [
					// 	{ required: true, message: '请选择物流公司', trigger: 'change' }
					// ],
					logistics_name: [
						{ required: true, message: '物流公司不能为空', trigger: 'blur' },
						{ max: 30, message: '最多可输入30个字符', trigger: 'blur' },
						{ validator: validator.cnOrEnOrNumOrLineOrSpace, trigger: 'blur' }
					],
					freight: [
						{validator: validator.PositiveDecimal, message: '最多为11位数，小数点后两位', trigger: 'blur'}
					],
					consigner_name: [
						{ required: true, message: '退货人不能为空', trigger: 'blur' },
						{ min: 2, max: 20, message: '只能输入2-20个字符', trigger: 'blur' }
					],
					tracking_number: [
						{ required: true, message: '请输入配送单号', trigger: 'blur' },
						{ max: 30, message: '最多可输入30个字符', trigger: 'blur' },
						{ validator: validator.enOrNumOrSpace, message: '只可输入英文、数字和空格', trigger: 'blur' }
					],
					reason: [
						{ required: true, message: '请选择退货原因', trigger: 'blur' }
					],
					aid: [
						{ required: true, message: '请选择所属地区', trigger: 'blur' }
					],
					consigner_address: [
						{ required: true, message: '详细地址不能为空', trigger: 'blur' },
						{max: 200, message: '最多可输入200个字符', trigger: 'blur'}
					],
					consigner_tel: this.$version === 'neimao' ? [
						{ required: true, message: '请输入联系电话', trigger: 'blur' },
						{ validator: validator.phoneOrTel, message: '请输入正确的联系电话', trigger: 'blur' }
					] : [],
					// mail: [
					// 	{ validator: validator.ChinaPostCode, message: '请输入正确的邮政编码', trigger: 'blur' }
					// ],
					// phone: [
					// 	{ validator: validator.telAll, message: '请输入正确的电话号码', trigger: 'blur' }
					// ],
					memo: [
						{max: 200, message: '最多可输入200个字符', trigger: 'blur'}
					],
					goods_num: [
						{ validator: checkNum, message: '请填写非负整数', trigger: 'blur' },
						{ validator: checkReturnNum, message: '退货数量不能大于已发货数量', trigger: 'blur' }
					]
				},
				goodsList: [],
				companyList: [],
				shipTypeList: [],
				isLoading: false,
				isBtnLoading: false,
				sku_spec:""
			}
		},
		mixins: [orderApi],
		props: ['id'],
		mounted() {
			this.getReturnDetail();
			// this.getShipCompany();
			// this.getShipType();
		},
		methods: {
			//获取退货单信息
			getReturnDetail() {
				this.isLoading = true;
				this.$api(this.orderApi[this.$version] + ".getOrderDetail", {orderId: this.id}).then((result) => {
					this.orderInfo = result;
					this.form1.order_id = result.id;
					// this.form1.logistics_type = result.logistics_id;
					this.form1.consigner_name = result.consignee_name;
					this.form1.consigner_tel = result.consignee_mob ? result.consignee_mob : result.consignee_tel;
					this.form1.consigner_address = result.consignee_addr;
					this.form1.consigner_country = result.consignee_state;
					this.form1.consigner_province = result.consignee_province;
					this.form1.consigner_city = result.consignee_city;
					this.form1.consigner_area = result.consignee_county;
					this.form1.aid = this.$version === 'waimao' ? [result.consignee_state] : [result.consignee_province, result.consignee_city, result.consignee_county];
					// debugger;
					this.goodsList = result.goods;
					this.goodsList.forEach(function(item,index){
						JSON.parse(item.sku_spec).forEach(function(_item,i){
							item.sku_name += "  " + _item.specValue;
						})
						
					})
					this.goodsList.forEach((v) => {
						this.$set(v, 'store', 0);
						this.$set(v, 'returnedNum', 0)
						this.$set(v, 'goods_num', 0)
					});
					this.getStore();
					this.getReturnNum();
					this.isLoading = false;
				}, (error) => {
					this.isLoading = false;
					this.$message({
		            	type: 'error',
		            	message: '获取订单信息失败！'
		          	});
				});
			},
			getStore() {
				if (this.goodsList.length == 0) {
					return;
				}
				let goodsIds = [];
				this.goodsList.forEach((v, i) => {
					goodsIds.push({
						goods_id: v.sku_id
					});
				});
				let data = {
					map: encodeURIComponent(JSON.stringify(goodsIds))
				}
				this.$api(this.orderApi[this.$version] + ".getGoodsStore", data).then((result) => {
					result.forEach((v) => {
						let index = this.goodsList.findIndex((n) => n.sku_id == v.goods_id);
						if (index > -1) {
							this.goodsList[index].store = v.store;
						}
					})
				},(error) => {
					if(error.data.status != 102){
						this.$message({
			            	type: 'error',
			            	message: '获取库存失败！'
			          	});
					}
				});
			},
			//获取已退货数量
			getReturnNum() {
				this.$api(this.orderApi[this.$version] + ".getReturnNum", {orderId: this.id}).then((result) => {
					if (result.length && result.length != 0) {
						result.forEach((v) => {
							let index = this.goodsList.findIndex(n => n.sku_id == v.sku_id);
							if (index > -1) {
								this.goodsList[index].returnedNum = v.num;
							}
						});
					} else {
						this.$message({
			            	type: 'error',
			            	message: '获取已退货数量失败'
			          	});
					}
				}, (error) => {
					if (error && error.data && error.data.status == 102) {

					} else {
						this.$message({
			            	type: 'error',
			            	message: '获取已退货数量失败'
			          	});
					}
				});
			},
			handleAreaChange(area) {
				if (this.$version === 'neimao') {
					this.form1.consigner_province = area[0];
					this.form1.consigner_city = area[1];
					this.form1.consigner_area = area[2];
				}
				if (this.$version === 'waimao') {
					this.form1.consigner_country = area[0];
				}
			},
			// //获取物流公司
			// getShipCompany() {
			// 	this.$api(this.orderApi[this.$version] + ".getShipCompany").then((result) => {
			// 		this.companyList = result;
			// 	}, (error) => {

			// 	});
			// },
			// //获取配送方式
			// getShipType() {
			// 	this.$api(this.orderApi[this.$version] + ".getShipType").then((result) => {
			// 		this.shipTypeList = result.list;
			// 	}, (error) => {

			// 	});
			// },
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
			//保存
			saveReturnDetail() {
				let data = {};
				let goods_num = '';
				let goods_skuid = '';
				this.goodsList.forEach((v, i) => {
					if (v.goods_num != 0) {
						goods_skuid += v.sku_id;
						goods_num += v.goods_num;
						goods_skuid += ',';
						goods_num += ',';
					}
				});
				goods_num = goods_num.substring(goods_num.length-1) == ',' ? goods_num.substring(0,goods_num.length-1) : goods_num;
				goods_skuid = goods_skuid.substring(goods_skuid.length-1) == ',' ? goods_skuid.substring(0,goods_skuid.length-1) : goods_skuid;
				// let logistics = this.shipTypeList.find((v) => {
				// 	return v.id == this.form1.logistics_type;
				// });
				// this.form1.logistics_name = logistics.name;
				data.goods_num = goods_num;
				data.goods_skuid = goods_skuid;
				data.create_time = formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss');
				for (let i in this.form1) {
					if (i === 'aid') {
						continue;
					}
					if (i === 'freight') {
						data[i] = this.form1[i] === '' ? 0 : this.form1[i];
						continue;
					}
					data[i] = this.form1[i] ? this.form1[i] : '';
				}
				this.isBtnLoading = true;
				this.$api(this.orderApi[this.$version] + ".addReturnOrder", data).then((result) => {
					this.$message({
		            	type: 'success',
		            	message: '退货成功!'
		        	});
		        	this.$emit('close', true);
		        	this.isBtnLoading = false;
				}, (error) => {
					this.$message({
		            	type: 'error',
		            	message: '退货失败！'
		          	});
		          	this.isBtnLoading = false;
				})
			},
			cancel() {
				this.$emit("close")
			}
		},
		components: {
			RegionCascader
			// RegionPicker
		}
	}
</script>
<style>

</style>
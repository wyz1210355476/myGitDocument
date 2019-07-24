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
		  		<el-form-item label="配送方式：" prop="logistics_type">
				    <el-select v-model="form1.logistics_type" placeholder="请选择配送方式">
				      	<el-option  v-for="option in shipTypeList"  v-if="option.disabled == '1'" :label="option.name" :key="option.id" :value="option.id"></el-option>
				    </el-select>
				</el-form-item>
				<el-form-item label="配送费用：">
		    		<span>{{orderInfo.freight | toFixed(2)}}</span>
		  		</el-form-item>
				<el-form-item label="收货人：" prop="consignee_name">
				    <el-input v-model="form1.consignee_name"></el-input>
				</el-form-item>
				<el-form-item label="手机号码：" prop="consignee_mobile">
				    <el-input v-model="form1.consignee_mobile"></el-input>
				</el-form-item>
				<el-form-item label="配送单号：" prop="tracking_number">
				    <el-input v-model="form1.tracking_number"></el-input>
				</el-form-item>
				<el-form-item label="固定电话：" prop="consignee_tel" v-if="$version === 'neimao'">
				    <el-input v-model="form1.consignee_tel"></el-input>
				</el-form-item>
				<el-form-item label="邮政编码：" prop="consignee_zip">
				    <el-input v-model="form1.consignee_zip"></el-input>
				</el-form-item>
				<el-form-item label="所在地区：" prop="aid" class="info-block">
				    <region-cascader v-model="form1.aid" :version="$version" @change="handleAreaChange"></region-cascader>
				</el-form-item>
				<el-form-item label="详细地址：" prop="consignee_address" class="info-block">
		    		<el-input type="textarea" v-model="form1.consignee_address" :maxlength="200"></el-input>
		  		</el-form-item>
		  		<el-form-item label="发货单备注：" prop="memo" class="info-block">
		    		<el-input type="textarea" v-model="form1.memo" :maxlength="200"></el-input>
		  		</el-form-item>
			</div>
	  		<el-table :data="goodsList" style="width: 100%" size="mini" class="table-one-line">
				<el-table-column label="货品编号">
					<template slot-scope="scope">
                		<div class="one-line" :title="scope.row.sku_bn">
							{{scope.row.sku_bn}}
							<el-popover
							placement="top"
							trigger="click">
								<div class="viewPicBox">
									<img :src="scope.row.sku_picture | doImg('0')" class="viewPic">
								</div>
								<el-button slot="reference" type="text">&nbsp;&nbsp;&nbsp;<img :src="scope.row.sku_picture | doImg('1')" class="member-level-coin"></el-button>
							</el-popover>	
						</div>
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
		        <!-- <el-table-column label="已发货数量" prop="alSendNum">
		        </el-table-column>
		        <el-table-column label="换货数量" prop="tranferNum">
		        </el-table-column>
		        <el-table-column label="发货数量" prop="sendNum">
		        </el-table-column> -->
			</el-table>
		</el-form>
		<div class="btn-area bottom">
			<el-button @click="cancel" size="small" plain>取消</el-button>
			<el-button type="primary" @click="submitForm('form1')" size="small" :loading="isBtnLoading">发货</el-button>
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
        		if (this.form1.consignee_area != '') {
        			callback();
        		} else if (this.form1.consignee_city != '' && (this.form1.consignee_province == '810000' || this.form1.consignee_province == '820000')) {
        			callback();
        		} else if (this.form1.consignee_province == '710000') {
        			callback();
        		} else {
        			callback(new Error());
        		}
      		};
			return {
				form1: {
					logistics_type: '',
					tracking_number: '',
					consignee_name: '',
					consignee_tel: '',
					consignee_country: '',
					consignee_province: '',
					consignee_city: '',
					consignee_area: '',
					consignee_address: '',
					memo: '',
					order_id: '',
					aid: []
				},
				orderInfo: {},

				rules: {
					// logistics_type : [
					// 	{ required: true, message: '请选择配送方式', trigger: 'change' }
					// ],
					consignee_name: [
						{ required: true, message: '收货人不能为空', trigger: 'blur' },
						{ min: 2, max: 20, message: '只能输入2-20个字符', trigger: 'blur' }
					],
					tracking_number: [
						{ required: true, message: '请输入配送单号', trigger: 'blur' },
						{ max: 30, message: '最多可输入30个字符', trigger: 'blur' },
						{ validator: validator.enOrNumOrSpace, message: '只可输入英文、数字和空格', trigger: 'blur' }
					],
					aid: [
						{ required: true, message: '请选择所属地区', trigger: 'blur' }
					],
					consignee_address: [
						{ required: true, message: '详细地址不能为空', trigger: 'blur' }
					],
					consignee_mobile: this.$version === 'neimao' ? [
						{ validator: validator.phone, message: '请输入正确的手机号', trigger: 'blur' }
					] : [],
					consignee_zip: [
						{ validator: validator.ChinaPostCode, message: '请输入正确的邮政编码', trigger: 'blur' }
					],
					consignee_tel: [
						{ validator: validator.telAll, message: '请输入正确的电话号码', trigger: 'blur' }
					],
					memo: [
						{max: 200, message: '最多可输入200个字符', trigger: 'blur'}
					]
				},
				goodsList: [],
				shipTypeList: [],
				isLoading: false,
				isBtnLoading: false
			}
		},
		mixins: [orderApi],
		props: ['id'],
		mounted() {
			this.getDeliveryDetail();
			this.getShipType();
			// this.getGoodsStore();
		},
		filters:{
			doImg(value,isTailoring){
				if(value){
					switch(isTailoring){
						case '1':
							return value.replace(/(\.[^_]+)_.+\.[^\.]+$/,function($,$1){
								return $1+"_20xa.jpg";
							})
						break;
						case '0':
							return value.replace(/\..+_.+\./,".")
						break;
					}
				}else{
					return "";
				}	
			}
		},
		methods: {
			//获取收货单信息
			getDeliveryDetail() {
				// let order_id = {
				// 	"map[0][key]": "id",
				// 	"map[0][logic]": "eq",
				// 	"map[0][value]": this.id
				// }
				this.isLoading = true;
				this.$api(this.orderApi[this.$version] + ".getOrderDetail", {orderId: this.id}).then((result) => {
					this.orderInfo = result;
					this.form1.order_id = result.id;
					this.form1.logistics_type = result.logistics_id;
					this.form1.consignee_name = result.consignee_name;
					this.form1.consignee_mobile = result.consignee_mob;
					this.form1.consignee_tel = result.consignee_tel;
					this.form1.consignee_zip = result.consignee_zip;
					this.form1.consignee_address = result.consignee_addr;
					this.form1.consignee_country = result.consignee_state;
					this.form1.consignee_province = result.consignee_province;
					this.form1.consignee_city = result.consignee_city;
					this.form1.consignee_area = result.consignee_county;
					this.form1.aid = this.$version === 'waimao' ? [result.consignee_state] : [result.consignee_province, result.consignee_city, result.consignee_county];
					this.goodsList = result.goods;
					this.goodsList.forEach(function(item,index){
						(item.sku_spec ? JSON.parse(item.sku_spec) : []).forEach(function(_item,i){
							item.sku_name += "  " + _item.specValue;
						})
						
					})
					this.goodsList.forEach((v) => {
						this.$set(v, 'store', '');
					});
					this.getStore();
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
				});
			},
			//获取配送方式
			getShipType() {
				this.$api(this.orderApi[this.$version] + ".getShipType", {map: {pageSize: 10000}}).then((result) => {
					this.shipTypeList = result.list;
				}, (error) => {
					if (error && error.data && error.data.status == 102) {

					} else {
						this.$message({
			            	type: 'error',
			            	message: '获取配送方式失败'
			          	});
					}
				});
			},
			handleAreaChange(area) {
				if (this.$version === 'neimao') {
					this.form1.consignee_province = area[0];
					this.form1.consignee_city = area[1];
					this.form1.consignee_area = area[2];
				}
				if (this.$version === 'waimao') {
					this.form1.consignee_country = area[0];
				}
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
			//保存
			saveReturnDetail() {
				if (this.$version === 'neimao' && (!this.form1.consignee_mobile || this.form1.consignee_mobile == '') && (!this.form1.consignee_tel || this.form1.consignee_tel == '')) {
					this.$message({
		            	type: 'error',
		            	message: '手机号码和固定电话不能同时为空'
		          	});
		          	return;
				}
				let data = {};
				let logistics = this.shipTypeList.find((v) => {
					return v.id == this.form1.logistics_type;
				});
				console.log(logistics)
				data.logistics_name = logistics.name;
				data.corp_code = logistics.corp_code;
				data.create_time = formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss');
				for (let i in this.form1) {
					if (i === 'aid') {
						continue;
					}
					data[i] = this.form1[i] ? this.form1[i] : '';
				}
				this.isBtnLoading = true;
				this.$api(this.orderApi[this.$version] + ".addDeliveryOrder", data).then((result) => {
					this.$message({
		            	type: 'success',
		            	message: '发货成功!'
		        	});
		        	this.$emit('close', true);
		        	this.isBtnLoading = false;
				}, (error) => {
					this.$message({
		            	type: 'error',
		            	message: '发货失败！'
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
<style scoped>
.viewPicBox{
	height: 150px;
	width: 150px;
}
.viewPic{
	width: 100%;
	height: 100%;
}
</style>
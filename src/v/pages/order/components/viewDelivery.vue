<template>
	<div class="order-form window-order-form" v-loading="isLoading">
		<div class="info-inline">
			<div class="info">
				<span class="info-label">订单编号：</span>
				<span class="info-value">{{form1.order_no}}</span>
			</div>
			<div class="info">
				<span class="info-label">订单日期：</span>
				<span class="info-value">{{form1.create_time}}</span>
			</div>
	  		<div class="info">
				<span class="info-label">配送方式：</span>
				<span class="info-value">{{form1.logistics_name}}</span>
			</div>
	  		<div class="info">
				<span class="info-label">配送费用：</span>
				<span class="info-value">{{form1.freight | toFixed(2)}}</span>
			</div>
			<div class="info">
				<span class="info-label">收货人：</span>
				<span class="info-value">{{form1.consignee_name}}</span>
			</div>
			<div class="info">
				<span class="info-label">配送单号：</span>
				<span class="info-value">{{form1.tracking_number}}</span>
			</div>
			<div class="info" v-if="$version == 'neimao'">
				<span class="info-label">所在地区：</span>
				<span class="info-value">{{form1.consignee_province | tranToAddr(form1.consignee_city, form1.consignee_area)}}</span>
			</div>
			<div class="info" v-if="$version == 'waimao'">
				<span class="info-label">所在地区：</span>
				<span class="info-value">{{form1.country}}</span>
			</div>
			<div class="info info-block">
				<span class="info-label">详细地址：</span>
				<span class="info-value">{{form1.consignee_address}}</span>
			</div>
			<div class="info">
				<span class="info-label">手机号码：</span>
				<span class="info-value">{{form1.consignee_mobile && form1.consignee_mobile != 'null' ? form1.consignee_mobile : ''}}</span>
			</div>
	  		<div class="info">
				<span class="info-label">邮政编码：</span>
				<span class="info-value">{{form1.consignee_zip && form1.consignee_zip != 'null' ? form1.consignee_zip : ''}}</span>
			</div>
			<div class="info">
				<span class="info-label">固定电话：</span>
				<span class="info-value">{{form1.consignee_tel && form1.consignee_tel != 'null' ? form1.consignee_tel : ''}}</span>
			</div>
			<div class="info info-block">
				<span class="info-label">发货单备注：</span>
				<span class="info-value">{{form1.memo}}</span>
			</div>
		</div>
  		<el-table :data="goodsList" style="width: 100%" size="mini" class="table-one-line">
			<el-table-column label="货品编号" width="150">
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
            		<div class="one-line" :title="scope.row.commodity_name">{{scope.row.commodity_name}}</div>
            	</template>
	        </el-table-column>
	        <el-table-column label="当前库存" prop="store" width="100">
	        </el-table-column>
	        <el-table-column label="购买数量" prop="quantity" width="100">
	        </el-table-column>
	        <!-- <el-table-column label="已发货数量" prop="alSendNum">
	        </el-table-column>
	        <el-table-column label="换货数量" prop="tranferNum">
	        </el-table-column>
	        <el-table-column label="发货数量" prop="sendNum">
	        </el-table-column> -->
		</el-table>
		<div class="btn-area bottom">
			<el-button @click="cancel" size="small" plain>关闭</el-button>
		</div>
	</div>
</template>
<script>
	import orderApi from '@c/mixins/orderApi';
	// let allShopTypeList = [];
	export default {
		data() {
			return {
				form1: {},
				goodsList: [],
				isLoading: false
			}
		},
		mixins: [orderApi],
		props: ['id'],
		
		mounted() {
			this.getDeliveryDetail();
			// this.getLogisticsType();
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
			//获取发货单信息
			getDeliveryDetail() {
				this.isLoading = true;
				this.$api(this.orderApi[this.$version] + ".getDeliveryDetail", {id: this.id}).then((result) => {
					this.form1 = result;
					this.goodsList = result.goodsList;
					this.goodsList.forEach(function(item,index){
						(item.sku_spec ? JSON.parse(item.sku_spec) : []).forEach(function(_item,i){
							item.commodity_name += "  " + _item.specValue;
						})
						
					})
					this.isLoading = false;
				}, (error) => {
					this.isLoading = false;
					this.$message({
		            	type: 'error',
		            	message: '获取发货单信息失败!'
		        	});
				})
			},
			//获取配送方式
			// getLogisticsType() {
			// 	this.$api(this.orderApi[this.$version] + ".getShipType").then((result) => {
			// 		allShopTypeList = result.list;
			// 	}, (error) => {

			// 	});
			// }
			cancel() {
				this.$emit("close")
			}
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
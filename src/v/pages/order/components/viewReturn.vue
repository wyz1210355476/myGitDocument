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
				<span class="info-label">退货原因：</span>
				<span class="info-value">{{form1.reason}}</span>
			</div>
	  		<div class="info">
				<span class="info-label">物流公司：</span>
				<span class="info-value">{{form1.logistics_name}}</span>
			</div>
			<div class="info">
				<span class="info-label">物流单号：</span>
				<span class="info-value">{{form1.tracking_number}}</span>
			</div>
	  		<div class="info">
				<span class="info-label">配送费用：</span>
				<span class="info-value">{{form1.freight | toFixed(2)}}</span>
			</div>
			<div class="info">
				<span class="info-label">退货人姓名：</span>
				<span class="info-value">{{form1.consigner_name}}</span>
			</div>
	  		<div class="info">
				<span class="info-label">手机号码：</span>
				<span class="info-value">{{form1.consigner_tel}}</span>
			</div>
			<div class="info" v-if="$version == 'neimao'">
				<span class="info-label">退货地区：</span>
				<span class="info-value">{{form1.consigner_province | tranToAddr(form1.consigner_city, form1.consigner_area)}}</span>
			</div>
			<div class="info" v-if="$version == 'waimao'">
				<span class="info-label">退货地区：</span>
				<span class="info-value">{{form1.country}}</span>
			</div>
			<div class="info info-block">
				<span class="info-label">退货地址：</span>
				<span class="info-value">{{form1.consigner_address}}</span>
			</div>
			<div class="info info-block">
				<span class="info-label">退货单备注：</span>
				<span class="info-value">{{form1.memo}}</span>
			</div>
		</div>
  		<el-table :data="goodsList" style="width: 100%" size="mini" class="table-one-line">
			<el-table-column label="货品编号">
				<template slot-scope="scope">
            		<div class="one-line" :title="scope.row.sku_bn">{{scope.row.sku_bn}}</div>
            	</template>
	        </el-table-column>
	        <el-table-column label="货品名称">
	        	<template slot-scope="scope">
            		<div class="one-line" :title="scope.row.commodity_name">{{scope.row.commodity_name}}</div>
            	</template>
	        </el-table-column>
	        <el-table-column label="当前库存" prop="store">
	        </el-table-column>
	        <el-table-column label="购买数量" prop="quantity">
	        </el-table-column>
	        <el-table-column label="已发货数量" prop="shippedNum">
	        </el-table-column>
	        <el-table-column label="已退货数量" prop="returnedGoodsNum">
	        </el-table-column>
	        <el-table-column label="退货数量" prop="returnGoodsNum">
	        </el-table-column>
		</el-table>
		<div class="btn-area bottom">
			<el-button @click="cancel" size="small" plain>关闭</el-button>
		</div>
	</div>
</template>
<script>
	import orderApi from '@c/mixins/orderApi'
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
			this.getReturnDetail();
			// this.getLogisticsType();
		},
		methods: {
			//获取退货单信息
			getReturnDetail() {
				this.isLoading = true;
				this.$api(this.orderApi[this.$version] + ".getReturnDetail", {id: this.id}).then((result) => {
					this.form1 = result;
					this.goodsList = result.goodsList;
					// debugger
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
		            	message: '获取退货单信息失败!'
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
<style>

</style>
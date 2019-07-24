<template>
	<div class="contents">
		<page-title :title="id=='-1'?'新增订单':'编辑订单'" goback></page-title>
		<el-steps :active="parseInt(step)" finish-status="success" process-status="finish" simple style="margin-top: 20px; margin-bottom: 20px">
		  	<el-step title="选择客户用户名、货品信息" ></el-step>
		  	<el-step title="确认订单结算信息" ></el-step>
		</el-steps>
		<el-form ref="order" :model="order" :rules="rules" label-width="150px" class="order-form" size="small">
			<div v-if='step == 0'>
				<el-form-item label="用户名：" prop="client_id">
	    			<el-select
					 	v-model="order.client_id"
						filterable
						remote
						reserve-keyword
						placeholder="请输入会员名称的关键词" 
						:remote-method="searchMember"
    					:loading="memberLoading"
						v-if="id == '-1'" 
						popper-class="item-dropdown-option">
					    <el-option
					      	v-for="item in memberList"
					      	:key="item.value"
					      	:label="item.loginid"
					      	:value="item.uid"
					      	:title="item.loginid"
					      	>
					    </el-option>
					</el-select>
					<span v-if="id != '-1'" style="font-size: 12px">{{order.client_name}}</span>
	  			</el-form-item>
	  			<!-- 我是标记 -->
	  			<el-form-item label="订单包含的物品：">
	  				<choose-goods @select="getSelectGoods" :selectList="goodSelection" :disabled="id != '-1'" size="small"></choose-goods>
	    			<div class="content-table">
	    				<el-table :data="goodInfo" style="width: 100%" size="mini" class="table-one-line">
		    				<el-table-column label="商品名">
		    					<template slot-scope="scope">
			                		<span class="one-line" :title="scope.row.goods_name">{{scope.row.goods_name}}</span>
			                	</template>
		            		</el-table-column>
		            		<el-table-column label="规格">
		            			<template slot-scope="scope">
			            			<span v-if="scope.row.specFlag">{{'已选' + scope.row.skuNum + '种'}}</span>
			            			<span v-if="!scope.row.specFlag">无规格</span>
			            		</template>
		            		</el-table-column>
		            		<!-- <el-table-column label="物品描述" prop="sku_des">
		            		</el-table-column> -->
		            		<el-table-column label="销售价格" width="120">
		            			<template slot-scope="scope">
		            				<el-form-item prop="changePrice" style="margin-bottom: 0">
		                				{{$unit}}<el-input v-model="scope.row.changePrice" style="width: 80px;" size="mini" @change="onPriceChange($event, scope.row.goods_id, scope.$index)"></el-input>
		                			</el-form-item>
		            			</template>
		            		</el-table-column>
		            		<el-table-column label="单位" prop="unit">
		            		</el-table-column>
		            		<el-table-column label="可售库存" prop="store" v-if="id == '-1'">
		            		</el-table-column>
		            		<el-table-column label="购买数量">
		            			<template slot-scope="scope">
		            				<span v-if="scope.row.specFlag">{{scope.row.num}}</span>
									<el-input v-if="!scope.row.specFlag" v-model="scope.row.num" :readonly="id!='-1'" style="width: 100px;" size="mini" @change="onNumChange($event, scope.row.goods_id, scope.$index)"></el-input>
		            			</template>
		            		</el-table-column>
		            		<el-table-column label="操作">
		            			<template slot-scope="scope">
		            				<el-button type="text" @click="showSkuDialog(scope.row.goods_id, scope.row.templateId, scope.$index)" v-if="id == '-1' && scope.row.specFlag">选择规格</el-button>
		            				<el-button type="text" @click="showSkuDialog(scope.row.goods_id, scope.row.templateId, scope.$index)" v-if="id != '-1' && scope.row.specFlag">查看规格</el-button>
		            				<el-button type="text" @click="removeSelectGood(scope.row.goods_id)" v-if="id == '-1'">删除</el-button>
		            			</template>
		            		</el-table-column>
		    			</el-table>
	    			</div>
	  			</el-form-item>
			</div>
			<choose-sku :visibility.sync="skuSelectDialog.show" :id="skuSelectDialog.id" :templateId="skuSelectDialog.templateId" :selection="skuSelectDialog.selection" @select="onSelectSkuChange" :isEditing="id != '-1'"></choose-sku>
			<div v-if="step == 1">
	  			<!-- <div class="order-info">
					<div class="info-title"><span>收货人信息</span></div>
					<div class="infos">
						<el-form-item lable="收货人信息：" prop="consignee_id">
							<el-button type="text" class="btn-show-address" @click="showAddAddressWindow()">新增收货地址</el-button>
						    <el-radio-group v-model="order.consignee_id" class="address-area">
						      	<div v-for="(option, index) in receiverList" :key="option.id" v-show="showAllAddress == true || option.id == order.consignee_id || (!order.consignee_id && (index == 0 || index == 1)) || (order.consignee_id && index == 0) || (order.consignee_id && order.consignee_id == receiverList[0].id && index == 1)" class="address">
						      		<el-radio v-if="$version === 'neimao'" :label="option.id"><span class="radio-info"> <span>{{option.name}}</span> <span>{{option.pid | tranToAddr(option.cityid, option.areaid)}}</span> <span class="address-detail">{{option.detail}}</span> <span>{{option.phone ? option.phone : option.tel}}</span></span></el-radio>
						      		<el-radio v-if="$version === 'waimao'" :label="option.id"><span class="radio-info"> <span>{{option.name}}</span> <span>{{option.country_name}}</span> <span class="address-detail">{{option.detail}}</span> <span>{{option.email}}</span></span></el-radio>
						      		<span class="address-btn-area">
						      			<el-button type="text" @click="showAddAddressWindow(option.id)">编辑</el-button>
										<el-button type="text" @click="delAddress(option.id)">删除</el-button>
										<el-button type="text" @click="setDefaultAddress(option.id)" v-if="option.sets != '2'">设为默认地址</el-button>
						      		</span>
						      	</div>
						    </el-radio-group>
						    <el-button type="text" @click="showAllAddress = true" v-if="showAllAddress == false && receiverList.length > 2" class="btn-show-address grey">更多<i class="el-icon-arrow-down"></i></el-button>
							<el-button type="text" @click="showAllAddress = false" v-if="showAllAddress == true" class="btn-show-address grey">收起<i class="el-icon-arrow-up"></i></el-button>
						</el-form-item>
					</div>
					<add-address v-if="showAddAddress" :visibility.sync="showAddAddress" :client_id="order.client_id" :address_id="edit_address_id" @save="saveAddress"></add-address>
	  			</div> -->
	  			<el-form-item label="收货人信息：" prop="consignee_id">
					<el-button type="text" class="btn-show-address" @click="showAddAddressWindow()">新增收货地址</el-button>
				    <el-radio-group v-model="order.consignee_id" class="address-area">
				      	<div v-for="(option, index) in receiverList" :key="option.id" v-show="showAllAddress == true || option.id == order.consignee_id || (!order.consignee_id && (index == 0 || index == 1)) || (order.consignee_id && index == 0) || (order.consignee_id && order.consignee_id == receiverList[0].id && index == 1)" class="address">
				      		<el-radio v-if="$version === 'neimao'" :label="option.id"><span class="radio-info"> <span>{{option.name}}</span> <span>{{option.pid | tranToAddr(option.cityid, option.areaid)}}</span> <span class="address-detail">{{option.detail}}</span> <span>{{option.phone ? option.phone : option.tel}}</span></span></el-radio>
				      		<el-radio v-if="$version === 'waimao'" :label="option.id"><span class="radio-info"> <span>{{option.name}}</span> <span>{{option.country_name}}</span> <span class="address-detail">{{option.detail}}</span> <span>{{option.email}}</span></span></el-radio>
				      		<span class="address-btn-area">
				      			<el-button type="text" @click="showAddAddressWindow(option.id)">编辑</el-button>
								<el-popover
									class="ml10"
									placement="top"
									width="200"
									trigger="click"
									v-model="option.popover">
									<p>是否删除"{{ option.name }}"这个地址？</p>
									<div style="text-align: right; margin: 0">
										<el-button size="mini" type="text" @click="option.popover = false">取消</el-button>
										<el-button type="primary" size="mini" @click="option.popover = false; delAddress(option.id)">确定</el-button>
									</div>
									<el-button slot="reference" type="text" style="margin-right: 8px;">删除</el-button>
								</el-popover>
								<el-button type="text" @click="setDefaultAddress(option.id)" v-if="option.sets != '2'">设为默认地址</el-button>
				      		</span>
				      	</div>
				    </el-radio-group>
				    <el-button type="text" @click="showAllAddress = true" v-if="showAllAddress == false && receiverList.length > 2" class="btn-show-address grey">更多<i class="el-icon-arrow-down"></i></el-button>
					<el-button type="text" @click="showAllAddress = false" v-if="showAllAddress == true" class="btn-show-address grey">收起<i class="el-icon-arrow-up"></i></el-button>
				</el-form-item>
				<add-address v-if="showAddAddress" :visibility.sync="showAddAddress" :client_id="order.client_id" :address_id="edit_address_id" @save="saveAddress"></add-address>
	  			<!-- <div class="order-info">
					<div class="info-title">配送方式</div>
					<div class="infos">
						<el-form-item prop="logistics_id">
						    <el-radio-group v-model="order.logistics_id" class="radio-order">
						      	<el-radio v-for="option in shipTypeList" :label="option.id" :key="option.id" v-if="option.disabled == '1'" border>{{option.name}}</el-radio>
						    </el-radio-group>
						</el-form-item>
					</div>
	  			</div> -->
	  			<el-form-item label="配送方式：" prop="logistics_id">
				    <el-radio-group v-model="order.logistics_id" class="radio-order">
				      	<el-radio v-for="option in shipTypeList" :label="option.id" :key="option.id" v-if="option.disabled == '1'" border>{{option.name}}</el-radio>
				    </el-radio-group>
				</el-form-item>
	  			<!-- <div class="order-info">
					<div class="info-title">支付方式</div>
					<div class="infos">
						<el-form-item prop="payment_type_id">
						    <el-radio-group v-model="order.payment_type_id" class="radio-order">
						      	<el-radio v-for="option in payTypeList" :label="option.id" :key="option.id" v-if="cod_enable == 1 || (cod_enable == 0 && option.type != '1')" border>{{option.name}}</el-radio>
						    </el-radio-group>
						</el-form-item>
					</div>
	  			</div> -->
	  			<el-form-item label="支付方式：" prop="payment_type_id">
				    <el-radio-group v-model="order.payment_type_id" class="radio-order">
				      	<el-radio v-for="option in payTypeList" :label="option.id" :key="option.id" v-if="cod_enable == 1 || (cod_enable == 0 && option.type != '1')" border>{{option.name}}</el-radio>
				    </el-radio-group>
				</el-form-item>
	  			<!-- <div class="order-info" v-if="invoiceOnOrOff && invoiceContentList.length != 0">
					<div class="info-title">发票内容</div>
					<div class="infos">
						<el-form-item>
						    <el-radio-group v-model="isDrawInvoice">
						    	<el-radio label="0">不开发票</el-radio>
						    	<el-radio label="1">普通发票</el-radio>
						    </el-radio-group>
						    <div v-if="isDrawInvoice == '1'" class="invoice-info">
						    	<span>普通发票</span>
						    	<span>{{order.invoice_tit}}</span>
						    	<span>{{order.invoice_cont}}</span>
						    	<el-button type="text" @click="showAddInvoice = true">修改</el-button>
						    </div>
						</el-form-item>
  						<add-invoice :id="order.client_id" :tId="order.invoice_tit_id" :cId="order.invoice_cont_id" :visibility.sync="showAddInvoice" v-if="showAddInvoice" @save="saveInvoice"></add-invoice>
					</div>
	  			</div> -->
	  			<!-- <div class="order-info">
	  				<div class="info-title">订单备注</div>
	  				<div class="infos">
	  					<el-form-item>
							<el-input type="textarea" v-model="order.remark"></el-input>
	  					</el-form-item>
	  				</div>
	  			</div> -->
	  			<el-form-item label="订单备注：" prop="remark">
					<el-input type="textarea" v-model="order.remark"></el-input>
				</el-form-item>
	  			<!-- <div class="order-info">
	  				<div class="info-title">订单信息</div>
	  				<div class="infos sum-info">
	  					<el-form-item>
	  						<div class="info-inline" v-if="id == '-1'">
	  							<div class="info">
				  					<span class="info-label">商品总额：</span>
				  					<span class="info-value">{{goodInfo | calGoodSum | toFixed(2)}}</span>
				  				</div>
	  							<div class="info">
				  					<span class="info-label">配送费用：</span>
				  					<span class="info-value">{{order.freight | toFixed(2)}}</span>
				  				</div>
				  				<div class="info">
				  					<span class="info-label">调整返利：</span>
				  					<el-form-item class="info-value item-derate-expenses" prop="rebate_total">
				  						<el-input v-model="order.rebate_total"></el-input>
				  					</el-form-item>
				  				</div>
				  				<div class="info">
				  					<span class="info-label">订单总额：</span>
				  					<span class="info-value orange">{{goodInfo | calGoodSum | calOrderSum(order.freight) | toFixed(2)}}</span>
				  				</div>
	  						</div>
		  					<div class="info-inline" v-if="id != '-1'">
		  						<div class="info">
				  					<span class="info-label">订单编号：</span>
				  					<span class="info-value">{{order.no}}</span>
				  				</div>
				  				<div class="info">
				  					<span class="info-label">下单日期：</span>
				  					<span class="info-value">{{order.create_time}}</span>
				  				</div>
				  				<div class="info">
				  					<span class="info-label">商品重量：</span>
				  					<span class="info-value">{{order.weight}}kg</span>
				  				</div>
				  				<div class="info">
				  					<span class="info-label">配送费用：</span>
				  					<span class="info-value">{{order.freight | toFixed(2)}}</span>
				  				</div>
				  				<div class="info">
				  					<span class="info-label">商品总额：</span>
				  					<span class="info-value">{{goodInfo | calGoodSum | toFixed(2)}}</span>
				  				</div>
				  				<div class="info">
				  					<span class="info-label">订单调整金额：</span>{{$unit}}
				  					<el-form-item class="info-value item-derate-expenses" prop="derate_expenses">
				  						<el-input v-model="order.derate_expenses"></el-input>
				  					</el-form-item>
				  				</div>
				  				<div class="info" v-if="!usedRebate">
				  					<span class="info-label">调整返利：</span>
				  					<el-form-item class="info-value item-derate-expenses" prop="rebate_total">
				  						<el-input v-model="order.rebate_total"></el-input>
				  					</el-form-item>
				  				</div>
				  				<div class="info">
				  					<span class="info-label">订单总额：</span>
				  					<span class="info-value orange">{{goodInfo | calGoodSum | calOrderSum(order.freight, order.derate_expenses) | toFixed(2)}}</span>
				  				</div>
		  					</div>
	  					</el-form-item>
	  				</div>
	  			</div> -->
				<!-- 促销活动 begin -->
				<!-- 新增订单时 -->
				<!-- <el-form-item label="优惠券：" prop="" v-if="id == '-1' && isCpupon">
					<el-select v-model="coupon" placeholder="请选择">
						<el-option
						v-for="item in couponOptions"
						:key="item.value"
						:label="item.label"
						:value="item.value">
						</el-option>
					</el-select>
				</el-form-item> -->
				<!-- 编辑订单时 -->
				<!-- <el-form-item label="优惠券：" prop="" v-if="id != '-1' && isCpupon">
						<div class="info">
							<span class="info-value">满100减20</span>
						</div>		
				</el-form-item> -->
				<!-- 促销活动 end -->
	  			<el-form-item label="订单信息：" class="info-order-inline">
					<!-- 新增订单 -->
					<div class="info-inline" v-if="id == '-1'">
						<div class="info">
		  					<span class="info-label">商品总额：</span>
		  					<span class="info-value">{{goodInfo | calGoodSum | toFixed(2)}}</span>
		  				</div>
		  				<!-- <div class="info">
		  					<span class="info-label">优惠金额：</span>
		  					<span class="info-value">{{order.add_derate_expenses | toFixed(2)}}</span>
		  				</div> -->
							<div class="info">
		  					<span class="info-label">配送费用：</span>
		  					<span class="info-value">{{order.freight | toFixed(2)}}</span>
		  				</div>
		  				<div class="info" v-if="$appList.CESHOP_RETURN">
		  					<span class="info-label">调整返利：</span>
		  					<el-form-item class="info-value item-derate-expenses" prop="rebate_total">
		  						<el-input v-model="order.rebate_total"></el-input>
		  					</el-form-item>
		  				</div>
		  				<div class="info">
		  					<span class="info-label">订单总额：</span>
		  					<span class="info-value orange">{{goodInfo | calGoodSum | calOrderSum(order.freight) | toFixed(2)}}</span>
		  				</div>
					</div>
					<!-- 编辑订单 -->
  					<div class="info-inline" v-if="id != '-1'">
  						<div class="info">
		  					<span class="info-label">订单编号：</span>
		  					<span class="info-value">{{order.no}}</span>
		  				</div>
		  				<div class="info">
		  					<span class="info-label">下单日期：</span>
		  					<span class="info-value">{{order.create_time}}</span>
		  				</div>
		  				<div class="info">
		  					<span class="info-label">商品重量：</span>
		  					<span class="info-value">{{order.weight}}kg</span>
		  				</div>
		  				<div class="info">
		  					<span class="info-label">配送费用：</span>
		  					<span class="info-value">{{order.freight | toFixed(2)}}</span>
		  				</div>
		  				<div class="info">
		  					<span class="info-label">商品总额：</span>
		  					<span class="info-value">{{goodInfo | calGoodSum | toFixed(2)}}</span>
		  				</div>
		  				<div class="info">
		  					<span class="info-label">调整金额：</span>{{$unit}}
		  					<el-form-item class="info-value item-derate-expenses" prop="derate_expenses">
		  						<el-input v-model="order.derate_expenses"></el-input>
		  					</el-form-item>
		  				</div>
		  				<div class="info" v-if="$appList.CESHOP_RETURN && order.usedRebate>=0">
		  					<span class="info-label">调整返利：</span>
		  					<el-form-item class="info-value item-derate-expenses" prop="rebate_total">
		  						<el-input v-model="order.rebate_total"></el-input>
		  					</el-form-item>
		  				</div>
						<!-- 编辑订单时显示活动立减 -->
						<div class="info" v-if="id != '-1'">
		  					<span class="info-label">活动立减：</span>
		  					<span class="info-value">{{order.activity_reduction | toFixed(2)}}</span>
		  				</div>
						<div class="info" v-if="isCpupon">
		  					<span class="info-label">优惠券：</span>
		  					<span class="info-value">{{order.cpupon_reduction | toFixed(2)}}</span>
		  				</div>
		  				<div class="info">
		  					<span class="info-label">订单总额：</span>
		  					<span class="info-value orange">{{goodInfo | calGoodSum | calOrderSum(order.freight, order.derate_expenses) | calIntegralSum( order.usedRebate) | calActiveSum(order.activity_reduction,order.cpupon_reduction) | toFixed(2)}}</span>
		  				</div>
  					</div>
				</el-form-item>
			</div>
  		</el-form>
  		<div class="btn-area left">
  			<el-button v-if="step == 0" @click="goToNext" size="small" :disabled="order.client_id == '' || goodInfo.length == 0">下一步</el-button>
  			<el-button v-if="step ==1" @click="goToPrev" size="small">上一步</el-button>
  			<el-button v-if="step ==1" type="primary" @click="submitForm('order')" size="small" :loading="isBtnLoading">保存</el-button>
  		</div>
	</div>
</template>
<script>
	import pageTitle from '@components/pageTitle';
	import addAddress from './components/addAddress';
	import chooseGoods from './components/chooseGoods';
	import addInvoice from './components/addInvoice';
	import chooseSku from './components/chooseSku';
	import merge from 'webpack-merge';
	import {minOfNums} from '@c/util';
	import * as validator from '@c/util/validator';
	import orderApi from '@c/mixins/orderApi'
	export default {
		data() {
      		let requireClientName = (rule, value, callback) => {
        		if (this.order.client_id == '') {
        			callback(new Error());
        		} else {
        			callback();
        		}
      		};
      		let checkInvoice = (rule, value, callback) => {
        		if ((this.order.invoice_tit_id == '' && this.order.invoice_cont_id == '') || (this.order.invoice_tit_id != '' && this.order.invoice_cont_id != '')) {
        			callback();
        		} else {
        			callback(new Error());
        		}
      		};
      		let required = (rule, value, callback) => {
      			if (value == '') {
          			callback(new Error());
        		} else {
          			callback();
        		}
      		};
      		let checkDerateExpenses = (rule, value, callback) => {
      			if (parseFloat(value) > (parseFloat(this.order.sum_payable) + parseFloat(this.old_derate_expenses))) {
          			callback(new Error());
        		} else {
          			callback();
        		}
      		};
			return {
				id: this.$route.query.id,
				step: this.$route.query.step || 0,
				order: {
					client_id: '',
					client_name: '',
					payment_type_id: '',
					logistics_id: '',
					consignee_id: '',
					derate_expenses: '0',  //编辑时优惠金额
					freight: 0,
					invoice_tit_id: '',
					invoice_cont_id: '',
					invoice_tit: '',
					invoice_cont: '',
					weight: 0,
					//add_derate_expenses: 0, //添加时优惠金额
					//add_sum_price: 0, //添加优惠时订单总额
					remark: '',
					rebate_total: '0',  //返利
					activity_reduction: '0',//活动立减
					cpupon_reduction: '0'//优惠券优惠
				},
				level_id: '', //客户分组id
				remark: '', //用于编辑时比对用
				remark_id: '', //用于编辑时
				memberList: [],
				goodInfo: [],
				skuInfo: [],
				goodSelection: [],
				couponOptions:[
					{
						value:"1",
						label:"满100减20"
					},
					{
						value:'2',
						label:'满200减50'
					}
				],
				coupon:'2',
				isCpupon:true,
				shipTypeList: [],
				payTypeList: [],
				receiverList: [],
				invoiceContentList: [],
				invoiceOnOrOff: false,
				edit_address_id: '',
				showAddAddress: false,
				showAllAddress: false,
				showAddInvoice: false,
				isDrawInvoice: '0', //是否开发票，0为不开，1为开
				cod_enable: 0,  //所选配送方式是否支持货到付款，默认不支持
				rules: {
					client_id: [
						// { required: true, message: '请选择客户', trigger: 'change' },
						{ validator: requireClientName, message: '请选择客户', trigger: 'change' }
					],
					derate_expenses: [
						{ validator: validator.Decimal6, message: '小数点前6位，小数点后2位，可输入负数', trigger: 'blur' },
						{ validator: checkDerateExpenses, message: '订单调整金额不能大于订单总额', trigger: 'blur' }
					],
					consignee_id: [
						{ validator: required, message: '请选择收货人', trigger: 'change' },
					],
					logistics_id: [
						{ validator: required, message: '请选择配送方式' }
					],
					payment_type_id: [
						{ validator: required, message: '请选择支付方式', trigger: 'change' }
					],
					remark: [
						{ max: 200, message: '最多可输入200个字符', trigger: 'blur'}
					],
					rebate_total: [
						{ validator: validator.Int6, message: '请输入6位数以内的整数', trigger: 'blur'}
					]
				},
				isBtnLoading: false,
				skuSelectDialog: {
					id: '',
					index: '',
					selection: [],
					show: false
				},
				store: {},  //用于存储库存
				usedRebate: false,    //是否已使用返利
				old_derate_expenses: 0, //编辑订单时记录原调整金额
				memberLoading:false
			}
		},
		mixins: [orderApi],
		filters: {
			calGoodSum(v) {
				let sum = 0;
				v.forEach((x) => {
					sum += parseFloat(x.changePrice) * parseInt(x.num);
				});
				return sum;
			},
			calOrderSum(v, x, y = 0, z = 0) {
				if (y === '' || y == 0) {
					return parseFloat(v) + parseFloat(x);
				} else {
			 		return parseFloat(v) + parseFloat(x) - parseFloat(y);
				}
			},
			calIntegralSum(v, x = 0) {
				if (!x || x === '' || x == 0) {
					x = 0
				} 
				return parseFloat(v) + parseFloat(x);
				
			},
			calActiveSum(v,x = 0,y = 0){
				if (!x || x === '' || x == 0) {
					x = 0
				} 
				if(!y || y === '' || y == 0){
					y = 0
				}
				return parseFloat(v) - parseFloat(x) - parseFloat(y);
			}
		},
		watch: {
			//根据配送地址、配送方式以及重量计算配送费用
			'order.logistics_id': {
				handler(v) {
					if (this.id == '-1') {
						this.getShipCost();
					}
					this.setCodEnable();
				},
				deep: true
			},
			'order.consignee_id': {
				handler(v) {
					if (this.id == '-1') {
						this.getShipCost();
					}
				},
				deep: true
			},
			'order.weight': {
				handler(v) {
					if (this.id == '-1') {
						this.getShipCost();
					}
				},
				deep: true
			},
			//根据所选商品和用户获取返利
			'order.client_id': {
				handler(v) {
					if (this.id == '-1') {
						this.getBatchPrice();
					}
				},
				deep: true
			}
		},
		mounted() {
			// if (this.step == 0) {
			// 	this.getMemberList();
			// }
			if (this.step == 1) {
				this.getPayType();
				this.getShipType();
				// this.checkInvoiceTurn();
			}
			if (this.id != "-1") {
				this.getOrderDetail();
				// this.getGoodInfo();
			}
		},
		methods: {
			//获取客户列表
			searchMember(query) {
				// debugger
				// if (this.memberList.length !== 0) {
				// 	return;
				// }
				this.memberLoading = true;
				this.$api("member.searchMemberList", {loginid: query}).then((result) => {
					this.memberLoading = false;
					this.memberList = result;
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
			//获取选中的商品
			getSelectGoods(msg) {
				//我是标记
				this.goodSelection = msg;
				this.goodInfo = [];
				let goods = [];
				let list = msg;
				if (list.length == 0) { //如果选择货品为空，返回
					return;
				}
				list.forEach((v, i) => {
					let good = {};
					good.goods_id = v.id;
					good.selectSkuList = v.selectSkuList.length === 0 ? [{
						goods_id: v.id,
						sku_id: v.noSpecSku.id,
						sku_weight: v.weight,
						num: v.num
					}] : v.selectSkuList;
					good.skuNum = v.selectSkuList.length;
					good.specFlag = v.specFlag;
					good.templateId = v.templateId;
					// if (!good.specFlag) {
					// 	good.sku_id = v.noSpecSku.id;
					// }
					good.unit = v.unit;
					// good.category_id = v.categoryId;
					good.goods_name = v.name;
					good.changePrice = v.changedPrice ? v.changedPrice : v.retailPrice;
					if (v.changedPrice) {
						good.changedPrice = v.changedPrice;
					}
					good.store = v.stock;
					good.num = v.num;
					// good.goods_weight = v.weight;
					goods.push(good);
				});
				this.goodInfo = goods;
				this.setSkuInfo();
			},
			//移除选中的商品
			removeSelectGood(id) {
				let i = this.goodInfo.findIndex((v) => v.goods_id == id);
				let index = this.goodSelection.findIndex((v) => v.id == id);
				if (i > -1) {
					this.goodInfo.splice(i, 1);
				}
				if (index > -1) {
					this.goodSelection.splice(index, 1);
				}
				this.setSkuInfo('del');
			},
			//选择规格
			showSkuDialog(id, templateId, index) {
				this.skuSelectDialog.show = true;
				this.skuSelectDialog.id = id;
				this.skuSelectDialog.index = index;
				this.skuSelectDialog.templateId = templateId;
				this.skuSelectDialog.selection = this.goodInfo[this.skuSelectDialog.index].selectSkuList;
			},
			onSelectSkuChange(selection) {
				this.goodInfo[this.skuSelectDialog.index].selectSkuList = selection.list;
				this.goodInfo[this.skuSelectDialog.index].skuNum = selection.list.length;
				this.goodInfo[this.skuSelectDialog.index].num = selection.total;
				this.setSkuInfo();
				this.setGoodSelection('selectSkuList', selection.list[0].goods_id, selection.list);
			},
			//根据所选商品列表得出货品列表
			setSkuInfo(type = 'sku', id = '', value = '') {
				if (type === 'sku' || type === 'del') {
					let skuInfo = [];
					this.goodInfo.forEach((v) => {
						v.selectSkuList.forEach((val) => {
							skuInfo.push({
								goods_id: val.goods_id,
								sku_id: val.sku_id,
								sku_weight: val.sku_weight,
								changePrice: v.changePrice,
								num: v.specFlag ? val.num : v.num
							});
						});
					});
					this.skuInfo = skuInfo;
				} else {
					this.skuInfo.forEach((v) => {
						if (v.goods_id === id) {
							v[type] = value;
						}
					});
				}
				//若为编辑订单，则返回
				if (this.id != '-1') {
					return;
				}
				switch (type) {
					case 'sku':
						this.getStore();
						this.getBatchPrice();
						this.calcGoodWeight();
						break;
					case 'del':
						this.calcGoodWeight();
						if (this.$appList.CESHOP_RETURN) {
							this.getRebateMoney();
						}
						break;
					case 'num':
						this.getBatchPrice();
						this.calcGoodWeight();
						break;
					case 'changePrice':
						if (this.$appList.CESHOP_RETURN) {
							this.getRebateMoney();
						}
						break;
					default:
						break;
				}
			},
			//价格改变
			onPriceChange(value, id, index) {
				let i = this.goodInfo.findIndex(n => n.goods_id === id);
				if (i > -1) {
					this.goodInfo[i].changedPrice = value;
				}
				this.setSkuInfo('changePrice', id, value);
				//若为编辑，返回
				if (this.id != '-1') {
					return;
				}
				this.setGoodSelection('changedPrice', id, value);
			},
			//数量改变
			onNumChange(value, id, index) {
				if (this.id != '-1') {
					return;
				}
				if (value === '' || !/^\d+$/.test(value) || parseInt(value) <= 0) {
					this.$message({
						type: 'error',
						message: '商品购买数量只能输入正整数'
					})
					return;
				}
				this.setSkuInfo('num', id, value);
				this.setGoodSelection('num', id, value);
			},
			//更新选中商品的数据
			setGoodSelection(type, id, value) {
				let index = this.goodSelection.findIndex(n => n.id === id);
				if (index > -1) {
					this.goodSelection[index][type] = value;
				}
			},
			//获取阶梯定价
			getBatchPrice() {
				if (this.order.client_id == '' || this.goodInfo.length === 0) {
					return;
				}
				let data = {
					clientId: this.order.client_id,
					goodsIds: '',
					nums: ''
				}
				this.goodInfo.forEach((v, i) => {
					data.goodsIds += v.goods_id;
					data.nums += v.num;
					if (i !== this.goodInfo.length-1) {
						data.goodsIds += ',';
						data.nums += ',';
					}
				});
				this.$api(this.orderApi[this.$version] + ".getBatchPrice", data).then((result) => {
					result.forEach((v) => {
						let index = this.goodInfo.findIndex(n => n.goods_id == v.product_id);
						if (index > -1) {
							this.goodInfo[index].changePrice = this.goodInfo[index].changedPrice ? this.goodInfo[index].changedPrice : v.price;
							this.setSkuInfo('changePrice', v.product_id, this.goodInfo[index].changePrice);
							if (!this.goodInfo[index].minNum) {
								//获取最低购买数量
								let min = '';
								if (v.wholesale_price && v.wholesale_price.length) {
									v.wholesale_price.forEach((val) => {
										if (min === '') {
											min = val.min;
										}
										if (parseInt(val.min) < parseInt(min)) {
											min = val.min;
										}
									});
								}
								this.goodInfo[index].minNum = min;
							}
						}
					});
					if (this.$appList.CESHOP_RETURN) {
						this.getRebateMoney();
					}
				}, (error) => {
					this.$message({
						type: 'error',
		            	message: '获取阶梯定价失败'
					});
				});
			},
			//获取库存
			getStore() {
				if (this.id != '-1') {
					return;
				}
				let goodsIds = [];
				this.skuInfo.forEach((v, i) => {
					if (!this.store[v.sku_id]) {
						goodsIds.push({
							goods_id: v.sku_id
						});
					}
				});
				if (goodsIds.length === 0) {
					return;
				}
				let data = {
					map: encodeURIComponent(JSON.stringify(goodsIds))
				}
				this.$api(this.orderApi[this.$version] + ".getGoodsStore", data).then((result) => {
					result.forEach((v) => {
						let index = this.skuInfo.findIndex((n) => n.sku_id == v.goods_id);
						if (index > -1) {
							this.store[v.goods_id] = v.store;
						}
					});
				}, (error) => {
					this.$message({
						type: 'error',
		            	message: '获取货品库存失败'
					});
				});
			},
			//计算重量
			calcGoodWeight() {
				if (this.goodInfo.length == 0) {
					this.order.weight = 0;
					return;
				}
				let weight = 0;
				this.skuInfo.forEach((v) => {
					if (parseInt(v.num) != 0) {
						weight += parseInt(v.num) * parseFloat(v.sku_weight);
					}
				});
				this.order.weight = weight/1000;
			},
			//获取返利金额
			getRebateMoney() {
				if (this.order.client_id === '' || this.goodInfo.length === 0) {
					return;
				}
				let goods = [];
				this.goodInfo.forEach((v) => {
					let index = goods.findIndex(n => n.goods_id === v.goods_id);
					if (index > -1) {
						goods[index].num += parseInt(v.num);
						goods[index].total_money += parseFloat(v.changePrice) * parseInt(v.num);
					} else {
						goods.push({
							goods_id: v.goods_id,
							num: parseInt(v.num),
							total_money: parseFloat(v.changePrice) * parseInt(v.num)
						});
					}
				});
				let data = {
					where: JSON.stringify(goods),
					uid: this.order.client_id
				}
				this.$api(this.orderApi[this.$version] + ".getRebateMoney", data).then((result) => {
					let rebate = 0;
					for (let i in result) {
						rebate += parseInt(result[i].money);
					}
					this.order.rebate_total = rebate;
				}, (error) => {
					if (error && error.data && error.data.status == 102) {
                        this.order.rebate_total = 0;
                    } else {
                        this.$message({
                            type: 'error',
                            message: '获取用户返利失败'
                        });
                    }
				});
			},
			//下一步
			goToNext() {
				if (this.goodInfo.length == 0) {
					this.$message({
						type: 'error',
		            	message: '请选择货品'
					});
					return;
				}
				let checkGoods = false;
				this.goodInfo.forEach((v) => {
					if (parseInt(v.num) < parseInt(v.minNum)) {
						this.$message({
							type: 'error',
			            	message: '商品 ' + v.goods_name + ' 的购买数量不能少于' + v.minNum
						});
						checkGoods = true;
        				return;
					}
				});
				if (checkGoods) {
					return;
				}
				this.skuInfo.forEach((v) => {
					if (v.changePrice === '' || !/^[0-9]{1,8}([.]{1}[0-9]{1,2})?$/.test(v.changePrice)) {
						this.$message({
							type: 'error',
			            	message: '销售价格小数点前最多8位，小数点后最多2位，且必须为正数'
						});
						checkGoods = true;
        				return;
					}
					if (!/^\d+$/.test(v.num)) {
						this.$message({
							type: 'error',
			            	message: '商品数量只允许输入正整数'
						});
						checkGoods = true;
        				return;
					}
					if (!/^[0-9]*[1-9][0-9]*$/.test(v.num) || parseInt(v) <= 0) {
						this.$message({
							type: 'error',
			            	message: '货品数量不能小于0'
						});
						checkGoods = true;
        				return;
        			}
        			if (v.num > this.store[v.sku_id]) {
        				this.$message({
							type: 'error',
			            	message: '您所填写的商品数量超过库存'
						});
						checkGoods = true;
        				return;
        			}
				})
				if (checkGoods) {
					return;
				}
				this.step = 1;
				this.getPayType();
				this.getShipType();
				// this.checkInvoiceTurn();
				this.getShipAddress();
			},
			//上一步
			goToPrev() {
				this.step = 0;
				if (this.id == '-1') {
					this.getMemberList();
				}
			},
			getOrderDetail() {
				this.$api(this.orderApi[this.$version] + ".getOrderDetail", {orderId: this.id}).then((result) => {
					this.order = result;
					// 增加活动立减项
					var promotionInfo = result.promotion_info;
					var isHasPromotion = result.promotion_info && JSON.parse(result.promotion_info);
					this.order.activity_reduction = isHasPromotion ? JSON.parse(promotionInfo).promotion_money : 0;
					// this.order.freight = isHasPromotion ? this.order.freight - JSON.parse(promotionInfo).freight : this.order.freight;
					this.order.cpupon_reduction = isHasPromotion ? JSON.parse(promotionInfo).coupon_money : 0;
					// this.order.freight = 5;
					//记录调整金额，用于校验
					this.old_derate_expenses = result.derate_expenses;
					//商品处理
					let goodInfo = [];
					result.goods.forEach((v) => {
						let sku_spec = v.sku_spec == '' || v.sku_spec == '[]' ? [] : JSON.parse(v.sku_spec);
						let specFlag = sku_spec.length !== 0;
						let specList = [];
						if (sku_spec.length && sku_spec.length != 0) {
					        for (var i in sku_spec) {
					        	specList.push({
					        		specName: sku_spec[i].specName,
					        		specValue: sku_spec[i].specValue
					        	});
					        }
					    }
						let index = goodInfo.findIndex(n => n.goods_id == v.goods_id);
						if (index > -1) {
							goodInfo[index].num = parseInt(goodInfo[index].num) + parseInt(v.quantity);
							goodInfo[index].skuNum += 1;
							goodInfo[index].selectSkuList.push({
								goods_id: v.goods_id,
								sku_id: v.sku_id,
								sku_weight: v.sku_weight,
								changePrice: v.sku_price,
								num: v.quantity,
								specList: specList
							});
						} else {
							v.detail = v.detail.replace(/\\/g, '');
							console.log('detail', v.detail)
							let detail = v.detail ? JSON.parse(v.detail) : {};
							let good = {
								goods_id: v.goods_id,
								unit: detail.unit,
								goods_name: v.sku_name,
								changePrice: v.sku_price,
								num: v.quantity,
								// goods_weight: v.sku_weight,
								specFlag: specFlag,
								selectSkuList: [{
									goods_id: v.goods_id,
						        	sku_id: v.sku_id,
									sku_weight: v.sku_weight,
									changePrice: v.sku_price,
									num: v.quantity,
									specList: specList
						        }]
							}
							good.skuNum = specFlag ? 0 : 1;
						    goodInfo.push(good);
						}
					});
					this.goodInfo = goodInfo;
					this.setSkuInfo();
					//发票整理
					let isArray = Object.prototype.toString.call(result.invoice) == '[object Array]';
					this.isDrawInvoice = isArray ? '0' : '1';
					if (this.order.invoice_cont_id != '' && this.order.invoice_tit_id != '') {
						this.isDrawInvoice = '1';
						this.order.invoice_tit = result.invoice_info.title;
						this.order.invoice_cont = result.invoice_info.name;
					}
					//订单备注
					let index = result.remarks.findIndex(n => n.is_admin == 0);
					if (index > -1) {
						this.order.remark = result.remarks[index].content;
						this.remark = result.remarks[index].content;
						this.remark_id = result.remarks[index].id;
					} else {
						this.order.remark = '';
						this.remark = '';
						this.remark_id = '';
					}
					//获取收货地址
					this.getShipAddress();
					//获取消费的返利金额
					if (this.$appList.CESHOP_RETURN) {
						// this.getUsedRebate();
					}
				}, (error) => {
					if (error && error.data && error.data.status == 102) {

					} else {
						this.$message({
							type: 'error',
			            	message: '获取订单信息失败'
						});
					}
				});
			},
			//获取消费的返利金额
			getUsedRebate() {
				this.$api(this.orderApi[this.$version] + ".getUsedRebate", {order_no: this.order.no, bapatypeId: 2}).then((result) => {
					if (result && result.length && result[0].history_balance != 0) {
						this.usedRebate = true;
					}
				}, (error) => {
					if (error && error.data && error.data.status == 102) {
						this.usedRebate = false;
					} else {
						this.$message({
							type: 'error',
			            	message: '获取消费的返利金额失败'
						});
					}
				});
			},
			//获取配送地址
			getShipAddress() {
				this.$api("address.getShipAddress", {clientId: this.order.client_id}).then((result) => {
					this.receiverList = result;
					//若为新增订单，勾选默认地址
					if (this.id == "-1" && this.order.consignee_id == '') {
						let index = this.receiverList.findIndex((n) => n.sets == "2");
						if (index > -1) {
							this.order.consignee_id = this.receiverList[index].id;
						} else {
							this.order.consignee_id = this.receiverList[0] ? this.receiverList[0].id : '';
						}
					}
				}, (error) => {
					if (error && error.data.status == 102) {
						this.receiverList = [];
						this.order.consignee_id = '';
					} else {
						this.$message({
							type: 'error',
			            	message: '获取配送地址失败'
						});
					}
				});
			},
			//添加配送地址弹窗
			showAddAddressWindow(id) {
				this.edit_address_id = id ? id : '';
				this.showAddAddress = true;
			},
			//保存配送地址
			saveAddress(msg) {
				this.showAddAddress = false;
				this.order.consignee_id = msg;
				this.getShipAddress();
			},
			//删除配送地址
			delAddress(id) {
				this.$api("address.delShipAddress", {id: id, clientId: this.order.client_id}).then((result) => {
					this.$message({
		            	type: 'success',
		            	message: '配送地址删除成功!'
		        	});
		        	this.getShipAddress();
				}, (error) => {
					this.$message({
		            	type: 'error',
		            	message: '配送地址删除失败！'
		          	});
				})
			},
			//设置默认地址
			setDefaultAddress(id) {
				this.$api("address.setDefaultShipAddress", {id: id, clientId: this.order.client_id}).then((result) => {
					this.$message({
		            	type: 'success',
		            	message: '设置默认地址成功！'
		        	});
		        	this.order.consignee_id = id;
		        	this.getShipAddress();
				}, (error) => {
					this.$message({
		            	type: 'error',
		            	message: '设置默认地址失败！'
		          	});
				});
			},
			//获取配送方式
			getShipType() {
				let data = {
					map: {
						sort: [{
							"index":"asc"
						}]
					}
				}
				this.$api(this.orderApi[this.$version] + ".getShipType", data).then((result) => {
					this.shipTypeList = result.list;
					if (result.list.length == 0) {
						this.$message({
			            	type: 'error',
			            	message: '尚未配置配送方式，请先添加配送方式'
			          	});
						return;
					}
				}, (error) => {
					if (error && error.data && error.data.status == 102) {
						this.shipTypeList = [];
						this.order.logistics_id = '';
						this.$message({
			            	type: 'error',
			            	message: '尚未配置配送方式，请先添加配送方式'
			          	});
					} else {
						this.$message({
							type: 'error',
			            	message: '获取配送方式出错'
						});
					}
				});
			},
			//设置是否支持货到付款
			setCodEnable() {
				if (this.shipTypeList.length == 0 || this.payTypeList.length == 0) {
					setTimeout(this.setCodEnable, 100);
				} else {
					let index = this.shipTypeList.findIndex(v => {
						return v.id == this.order.logistics_id;
					});
					if (index > -1) {
						this.cod_enable = this.shipTypeList[index].cod_enable;
					} else {
						this.cod_enable = 0;
						this.order.logistics_id = '';
					}
					//如果不支持货到付款且所选支付方式为货到付款，置空
					if (this.cod_enable == 0) {
						let i = this.payTypeList.findIndex(v => v.id == this.order.payment_type_id);
						if (i > -1) {
							if (this.payTypeList[i].type == "1") {
								this.order.payment_type_id = '';
							}
						} else {
							this.order.payment_type_id = '';
						}
					}
				}
			},
			//获取配送费用
			getShipCost() {
				if (!this.order.consignee_id || !this.order.logistics_id || this.order.consignee_id == '' || this.order.logistics_id == '') {
					this.order.freight = '0';
					return;
				}
				let data = {};
				let map = {};
				let consignee = this.receiverList.find((v) => {
					return v.id == this.order.consignee_id;
				});
				if (this.$version === 'neimao') {
					map.p = consignee.pid;
					map.c = consignee.cityid;
					map.a = consignee.areaid;
				} else if (this.$version === 'waimao') {
					map.g = consignee.country;
				}
				map.id = this.order.logistics_id;
				map.weight = this.order.weight;
				data.map = encodeURIComponent(JSON.stringify(map));
				this.$api(this.orderApi[this.$version] + ".getShipCost", data).then((result) => {
					this.order.freight = result.cost;
				}, (error) => {
					if (error && error.data && error.data.status == 102) {
						this.$message({
							type: 'error',
			            	message: '当前配送地区不在配送范围内，请选择其他配送方式或修改地址'
						});
						this.order.logistics_id = '';
					}
				});
			},
			//获取支付方式
			getPayType() {
				this.$api(this.orderApi[this.$version] + ".getPayType").then((result) => {
					this.payTypeList = result.list;
				}, (error) => {
					if (error && error.data && error.data.status == 102) {
						this.payTypeList = [];
					} else {
						this.$message({
							type: 'error',
			            	message: '获取支付方式出错'
						});
					}
				});
			},
			//获取发票是否开启
			// checkInvoiceTurn() {
			// 	this.$api(this.orderApi[this.$version] + ".checkInvoiceTurn").then((result) => {
			// 		if (result.enable == "1") {
			// 			this.invoiceOnOrOff = true;
			// 			this.getInvoiceContentList();
			// 		}
			// 	}, (error) => {
			// 		this.$message({
			// 			type: 'error',
		 //            	message: '获取发票开启设置出错'
			// 		});
			// 	});
			// },
			//获取选中的发票
			saveInvoice(invoice) {
				this.order.invoice_tit_id = invoice.tId;
				this.order.invoice_tit = invoice.title;
				this.order.invoice_cont_id = invoice.cId;
				this.order.invoice_cont = invoice.content;
				this.order.taxId = invoice.taxId;
				this.showAddInvoice = false;
			},
			//获取发票名称列表
			getInvoiceContentList() {
				this.$api(this.orderApi[this.$version] + ".getInvoiceContentList").then((result) => {
					this.invoiceContentList = result.list;
				}, (error) => {
					if (error && error.data && error.data.status == 102) {
						this.invoiceContentList = [];
					} else {
						this.$message({
							type: 'error',
			            	message: '获取发票名称列表出错'
						});
					}
				});
			},
			submitForm(formName) {
	        	this.$refs[formName].validate((valid) => {
		          	if (valid) {
		            	this.sortOrderDetail();
		          	} else {
		            	console.log('error submit!!');
		            	return false;
		          	}
	        	});
	      	},
			//整合数据
			sortOrderDetail() {
				let data = {};
				let order = {};
				// if (this.invoiceOnOrOff && this.isDrawInvoice && this.order.invoice_tit_id != '' && this.order.invoice_cont_id != '') {
				// 	order.invoice_tit_id = this.order.invoice_tit_id;
				// 	order.invoice_cont_id = this.order.invoice_cont_id;
				// 	order.invoice_info = {
				// 		invoice_tit_id: this.order.invoice_tit_id,
				// 		title: this.order.invoice_tit,
				// 		invoice_cont_id: this.order.invoice_cont_id,
				// 		name : this.order.invoice_cont,
				// 		taxId: this.order.taxId
				// 	}
				// }
				order.payment_type_id = this.order.payment_type_id;
				let payType = this.payTypeList.find((v) => {
					return v.id == this.order.payment_type_id;
				});
				order.payment_type_name = payType.name;
				order.payment_type = payType.type;
				order.logistics_id = this.order.logistics_id;
				let logistics = this.shipTypeList.find((v) => {
					return v.id == this.order.logistics_id;
				});
				order.logistics_name = logistics.name;
				order.corp_code = logistics.corp_code;
				if (this.$appList.CESHOP_RETURN && this.order.rebate_total != '') {
					order.rebate_total = this.order.rebate_total;
				}
				if (this.id != '-1') {
					let consignee = this.receiverList.find((v) => {
						return v.id == this.order.consignee_id;
					});
					order.consignee_id = this.order.consignee_id;
					order.consignee_name = consignee.name;
					if (this.$version === 'neimao') {
						order.consignee_province = consignee.pid;
						order.consignee_city = consignee.cityid;
						order.consignee_county = consignee.areaid;
					} else if (this.$version === 'waimao') {
						order.consignee_email = consignee.email;
						order.consignee_state = consignee.country;
						order.consignee_state_name = consignee.country_name;
					}
					order.consignee_addr = consignee.detail;
					order.consignee_zip = consignee.code;
					order.consignee_tel = consignee.tel;
					order.consignee_mob = consignee.phone;
					if (this.remark != this.order.remark) {
						order.remark = this.order.remark;
						if (this.remark_id != '') {
							order.remark_id = this.remark_id;
						}
					}
					order.derate_expenses = this.order.derate_expenses;
					order.order_id = this.id;
					order.orderGood = {
						skuIds: '',
						nums: '',
						changePrice: ''
					}
					this.skuInfo.forEach((v, i) => {
						order.orderGood.skuIds += v.sku_id;
						order.orderGood.nums += v.num;
						order.orderGood.changePrice += v.changePrice;
						if (i != this.skuInfo.length-1) {
							order.orderGood.skuIds += ',';
							order.orderGood.nums += ',';
							order.orderGood.changePrice += ',';
						}
					})
					data.orderInfo = encodeURIComponent(JSON.stringify(order));
					this.modifyOrderDetail(data);
				}
				if (this.id == "-1") {
					order.client_id = this.order.client_id;
					let client = this.memberList.find((v) => {
						return v.uid == this.order.client_id;
					});
					order.client_name = client.loginid;
					order.consignee_id = this.order.consignee_id;
					if (this.order.remark != '') {
						order.remark = this.order.remark;
					}
					data.order = encodeURIComponent(JSON.stringify(order));
					let orderGoods = [];
					this.skuInfo.forEach((v, i) => {
						orderGoods.push({
							sku_id: v.sku_id,
							changePrice: v.changePrice,
							quantity: v.num
						});
					});
					data.orderGoods = encodeURIComponent(JSON.stringify(orderGoods));
					this.addOrderDetail(data);
				}
			},
			//添加订单
			addOrderDetail(data) {
				this.isBtnLoading = true;
				this.$api(this.orderApi[this.$version] + ".addOrder", data).then((result) => {
					this.$message({
		            	type: 'success',
		            	message: '订单添加成功!'
		        	});
		        	this.$router.push({name: 'order_list'});
		        	this.isBtnLoading = false;
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
			            	message: '订单添加失败！'
			          	});
					}
				});
			},
			//修改订单
			modifyOrderDetail(data) {
				this.isBtnLoading = true;
				this.$api(this.orderApi[this.$version] + ".modifyOrder", data).then((result) => {
					this.$message({
		            	type: 'success',
		            	message: '订单修改成功!'
		        	});
		        	this.$router.push({name: 'order_list'});
		        	this.isBtnLoading = false;
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
			            	message: '订单修改失败！'
			          	});
					}
				});
			},
			//取消
			cancelOrderDetail() {
				this.$router.push({
					name: 'order_list'
				});
			}
		},
		components: {
			pageTitle,
			addAddress,
			chooseGoods,
			addInvoice,
			chooseSku
		}
	}
</script>
<style>
	.radio-block .el-radio-button {margin-right: 20px; border: 1px solid #d1d1d1; border-radius: 2px;}
	.radio-block .el-radio-button__inner {border: none;}
	.radio-block .el-radio-button:first-child .el-radio-button__inner {border-left: none; border-radius: 0;}
	.radio-block .el-radio-button:last-child .el-radio-button__inner {border-right: none; border-radius: 0;}

	.invoice-info {font-size: 12px;}
	.invoice-info span {margin-right: 7px; vertical-align: middle;}
</style>
<style scoped>
	.address-detail {display: inline-block; max-width: 300px; overflow: hidden; vertical-align: bottom; text-overflow: ellipsis; white-space: nowrap;}
	.order-form .sum-info {width: 800px;}
	.order-form .sum-info .info {max-width: 300px;}
</style>
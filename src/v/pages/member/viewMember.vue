<template>
	<div>
		<el-dialog
		  	title="查看客户信息"
		  	:visible.sync="visible"
			custom-class="view-member-dialog">
		  	<div class="order-form">
		  		<el-tabs v-model="tab" v-loading="isLoading">
	    			<el-tab-pane label="客户信息" name="0">
	    				<div class="info-inline">
	    					<div class="info info-block">
								<div class="info-left">
									<img :src="memberInfo.headimg | setHeadimg" width="80" height="80">
								</div>
								<div class="info-right">
									<div>{{memberInfo.truename}}</div>
									<div><span>{{memberInfo.sex == '1' ? '男' : '女'}}</span><span>{{memberInfo.birthday}}</span></div>
									<el-button type="text" size="small" @click="editMember">编辑客户信息</el-button>
								</div>
	    					</div>
	    					<div class="info">
								<span class="info-label">手机号码：</span>
								<span class="info-value">{{memberInfo.mobile}}</span>
							</div>
							<div class="info" v-if="$version === 'neimao'">
								<span class="info-label">固定电话：</span>
								<span class="info-value">{{memberInfo.telphone}}</span>
							</div>
							<div class="info">
								<span class="info-label">邮箱：</span>
								<span class="info-value">{{memberInfo.email}}</span>
							</div>
							<div class="info">
								<span class="info-label">邮政编码：</span>
								<span class="info-value">{{memberInfo.postalcode}}</span>
							</div>
							<div class="info" v-if="$version === 'neimao'">
								<span class="info-label">所在地区：</span>
								<span class="info-value">{{memberInfo.province | tranToAddr(memberInfo.city, memberInfo.district)}}</span>
							</div>
							<div class="info" v-if="$version === 'waimao'">
								<span class="info-label">所在地区：</span>
								<span class="info-value">{{memberInfo.country}}</span>
							</div>
							<div class="info">
								<span class="info-label">详细地址：</span>
								<span class="info-value info-oneline" :title="memberInfo.address">{{memberInfo.address}}</span>
							</div>
	    				</div>
	    				<div class="info-inline">
							<div class="info">
								<span class="info-label">客户名称：</span>
								<span class="info-value">{{memberInfo.loginid}}</span>
							</div>
							<div class="info">
								<span class="info-label">客户状态：</span>
								<span class="info-value">{{memberInfo.stat == '2' ? '启用' : '停用'}}</span>
							</div>
							<!-- <div class="info">
								<span class="info-label">客户标签：</span>
								<span class="info-value">
									<span v-for="(tag,index) in memberInfo.tags">{{tag.name}}{{index == memberInfo.tags.length-1 ? '' : ','}}</span>
								</span>
							</div> -->
							<div class="info">
								<span class="info-label">客户分组：</span>
								<span class="info-value">{{memberInfo.level_name}}</span>
							</div>
							<!-- <div class="info">
								<span class="info-label">客户来源：</span>
								<span class="info-value">{{memberInfo.from_name}}</span>
							</div> -->
							<!-- <div class="info">
								<span class="info-label">推荐人用户名：</span>
								<span class="info-value">{{memberInfo.recomLoginid}}</span>
							</div> -->
							<div class="info">
								<span class="info-label">累计购物次数：</span>
								<span class="info-value">{{memberInfo.bought_times}}</span>
							</div>
							<div class="info">
								<span class="info-label">累计消费金额：</span>
								<span class="info-value">{{memberInfo.paid_money | toFixed(2)}}</span>
							</div>
							<!-- <div class="info">
								<span class="info-label">商品评价：</span>
								<span class="info-value">{{memberInfo.evaluates}}</span>
							</div> -->
							<div class="info">
								<span class="info-label">注册时间：</span>
								<span class="info-value">{{memberInfo.addtime}}</span>
							</div>
							<!-- <div class="info">
								<span class="info-label">上次登录：</span>
								<span class="info-value">{{memberInfo.logintime | formatDate('yyyy-MM-dd')}}</span>
							</div>
							<div class="info">
								<span class="info-label">登录次数：</span>
								<span class="info-value">{{memberInfo.logins}}</span>
							</div> -->
	    				</div>
	    			</el-tab-pane>
	    			<el-tab-pane label="收货地址" name="1">
						<address-list :client_id="id" v-if="tab == '1'"></address-list>
	    			</el-tab-pane>
					<!-- 推荐会员 -->
					<el-tab-pane label="推荐会员" name="4">
	    				<el-table :data="recommendList" size="mini" class="table-one-line boxHeight">
	    					<el-table-column label="注册时间" prop="addtime">
								<template slot-scope="scope">
			                        <div class="one-line" :title="scope.row.addtime">{{scope.row.addtime}}</div>
			                    </template>
               				</el-table-column>
               				<el-table-column label="推荐类型">
               					<template slot-scope="scope">
			                        <div class="one-line" :title="scope.row.recommend">{{scope.row.recommend | recommendStatus}}</div>
			                    </template>
               				</el-table-column>
               				<el-table-column label="账户名称">
               					<template slot-scope="scope" :title="scope.row.loginid">
									<div class="one-line">
										{{scope.row.loginid}}
									</div>
			                    </template>
               				</el-table-column>
               				<el-table-column label="手机号码">
               					<template slot-scope="scope">
									<div class="one-line" :title="scope.row.mobile">{{scope.row.mobile}}</div>
			                    </template>
               				</el-table-column>
               				<el-table-column label="已返利次数" prop="rebate_count">
								<template slot-scope="scope">
									<div class="one-line" :title="scope.row.rebate_count">{{scope.row.rebate_count}}</div>
								</template> 
               				</el-table-column>
							<el-table-column label="返利状态" prop="rebateStatus">
								<template slot-scope="scope">
									<div class="one-line" :title="scope.row.rebateStatus | rebateStatus">{{scope.row.rebateStatus | rebateStatus}}</div>
								</template>   
               				</el-table-column>
	    				</el-table>
						<el-pagination
							layout="total, prev, pager, next"
							:total="totalCount"
							@current-change="getRecommend"
							class="page-order-history">
						</el-pagination>
	    			</el-tab-pane>
					<!-- 返利明细 -->
					<el-tab-pane label="返利明细" name="5">
	    				<el-table :data="rebateDetails" size="mini" class="table-one-line boxHeight">
	    					<el-table-column label="日期" prop="create_time">
								<template slot-scope="scope">
			                        <div class="one-line" :title="scope.row.create_time">{{scope.row.create_time}}</div>
			                    </template>
               				</el-table-column>
               				<el-table-column label="收支类型">
               					<template slot-scope="scope">
			                        <div class="one-line" :title="scope.row.bapatype_name">{{scope.row.bapatype_name | specCharacter}}</div>
			                    </template>
               				</el-table-column>
               				<el-table-column label="额度">
               					<template slot-scope="scope">
			                        <div class="one-line" :title="scope.row.history_balance">{{scope.row.history_balance}}</div>
			                    </template>
               				</el-table-column>
               				<el-table-column label="订单号">
               					<template slot-scope="scope">
									<div class="one-line" :title="scope.row.order_no">
										{{ scope.row.order_no }} 
									</div>
			                    </template>
               				</el-table-column>
               				<el-table-column label="业务说明">
               					<template slot-scope="scope">
									<div class="one-line" :title="scope.row.reference">{{scope.row.reference}}</div>
			                    </template>
               				</el-table-column>
               				<el-table-column label="操作人" prop="operating_personnel">
								<template slot-scope="scope">
									<div class="one-line" :title="scope.row.operating_personnel">{{scope.row.operating_personnel}}</div>
								</template> 
               				</el-table-column>
	    				</el-table>
						<el-pagination
							layout="total, prev, pager, next"
							:total="totalCount"
							@current-change="getRebateDetails"
							class="page-order-history">
						</el-pagination>
	    			</el-tab-pane>
					<!-- 历史订单 -->
	    			<el-tab-pane label="历史订单" name="2">
	    				<el-table :data="orderHistory" size="mini" class="table-one-line boxHeight">
	    					<el-table-column label="订单号" prop="no" width="160">
               				</el-table-column>
               				<el-table-column label="订单状态">
               					<template slot-scope="scope">
			                        <div class="one-line" :title="scope.row.order_status | getOrderStatus">{{scope.row.order_status | getOrderStatus}}</div>
			                    </template>
               				</el-table-column>
               				<el-table-column label="支付状态">
               					<template slot-scope="scope">
			                        <div class="one-line" :title="scope.row.payment_status | getPaymentStatus">{{scope.row.payment_status | getPaymentStatus}}</div>
			                    </template>
               				</el-table-column>
               				<el-table-column label="发货状态">
               					<template slot-scope="scope">
									<div class="one-line" :title="scope.row.shipments_status | getShipmentStatus">{{scope.row.shipments_status | getShipmentStatus}}</div>
			                    </template>
               				</el-table-column>
               				<el-table-column label="总金额">
               					<template slot-scope="scope">
									<div class="one-line" :title="scope.row.sum_payable | toFixed(2)">{{scope.row.sum_payable | toFixed(2)}}</div>
			                    </template>
               				</el-table-column>
               				<el-table-column label="下单日期" prop="create_time" width="160">   
               				</el-table-column>
	    				</el-table>
						<el-pagination
							layout="total, prev, pager, next"
							:total="totalCount"
							@current-change="getOrderHistory"
							class="page-order-history">
						</el-pagination>
	    			</el-tab-pane>
					
					<!-- 优惠券 -->
					<el-tab-pane label="优惠券" name="3">
	    				<el-table :data="couponList" size="mini" class="table-one-line boxHeight">
	    					<el-table-column label="优惠券券码" prop="coupon_generated_code">
               				</el-table-column>
               				<el-table-column label="优惠券名称">
               					<template slot-scope="scope">
			                        <div class="one-line" :title="scope.row.coupon_name">{{scope.row.coupon_name | specCharacter}}</div>
			                    </template>
               				</el-table-column>
               				<el-table-column label="面值（元）">
               					<template slot-scope="scope">
			                        <div class="one-line" :title="scope.row.coupon_value">{{scope.row.coupon_value}}</div>
			                    </template>
               				</el-table-column>
               				<el-table-column label="有效期">
               					<template slot-scope="scope">
									<div class="one-line" :title="scope.row.coupon_start_time +'至' + scope.row.coupon_end_time">
										{{ scope.row.coupon_start_time }} 
										至 
										{{scope.row.coupon_end_time}}
									</div>
			                    </template>
               				</el-table-column>
               				<el-table-column label="获取时间">
               					<template slot-scope="scope">
									<div class="one-line" :title="scope.row.create_time">{{scope.row.create_time}}</div>
			                    </template>
               				</el-table-column>
               				<el-table-column label="是否使用" prop="coupon_generated_status">
								<template slot-scope="scope">
									<div class="one-line" :title="scope.row.coupon_generated_status | couponStatus">{{scope.row.coupon_generated_status | couponStatus}}</div>
								</template> 
               				</el-table-column>
							<el-table-column label="关联订单" prop="coupon_use_order_no">
								<template slot-scope="scope">
									<div class="one-line" :title="scope.row.coupon_use_order_no">{{scope.row.coupon_use_order_no}}</div>
								</template>   
               				</el-table-column>
	    				</el-table>
						<el-pagination
							layout="total, prev, pager, next"
							:total="totalCount"
							@current-change="getCoupon"
							class="page-order-history">
						</el-pagination>
	    			</el-tab-pane>
	    		</el-tabs>
	    		<div class="btn-area bottom">
			  		<el-button plain size="small" @click="visible = false">关闭</el-button>
			  	</div>
		  	</div>
		 </el-dialog>
	</div>
</template>
<script>
	import dialogVisibility from '@c/mixins/dialogVisibility';
	import addressList from '@v/pages/address/addressList';
	import defaultImg from '@v/common/images/defaultHeadimg.jpg';
	import pages from '@components/pages';
	export default {
		data() {
			return {
				tab: '0',
				orderHistory: [],
				couponList:[],
				// 推荐会员
				recommendList:[],
				// 返利明细
				rebateDetails:[],
				memberInfo: {
					level_info: {
						name: ''
					}
				},
				totalCount: 0,
				page: {
					currentPage: 1,
					pageSize: 10
				},
				isLoading: false
			}
		},
		mixins: [dialogVisibility],
		props: {
			id: {
				type: [String, Number],
				required: true
			},
			accountId:{
				type: [String, Number],
				required: false
			}
		},
		filters: {
			//订单状态
			getOrderStatus(v) {
				if (v == '0') { return '正常'; }
                if (v == '1') { return '已作废'; }
                if (v == '2') { return '已完成'; }
                if (v == '3') { return '已取消'; }
                if (v == '4') { return '已删除'; }
			},
			//支付状态
			getPaymentStatus(v) {
				return v == '0' ? '未支付' : '已支付';
			},
			//发货状态
            getShipmentStatus(v) {
                if (v == '0') { return '待发货'; }
                if (v == '1') { return '已发货'; }
                if (v == '2') { return '部分发货'; }
            },
            //头像
            setHeadimg(v) {
            	return v && v != '' ? v : defaultImg;
			},
			// 优惠券使用状态
			couponStatus(v){
				let show;
				switch(v+""){
					case "1": 
						show = "未使用";
						break;
					case "2":
						show = "已使用";
						break;
					case "3":
						show = "已失效";
						break;
				}
				return show;
			},
			// 返利状态
			rebateStatus(v){
				let show;
				switch(v+""){
					case "1": 
						show = "返利中";
						break;
					case "2":
						show = "已结束";
						break;
				}
				return show;
			},
			// 推荐类型
			recommendStatus(v){
				let show;
				switch(v+""){
					case "1": 
						show = "直接推荐";
						break;
					case "2":
						show = "间接推荐";
						break;
				}
				return show;
			}
        },
        watch: {
        	tab: {
        		handler(v) {
					switch(v){
						case '0':
							this.getMemberDetail();
							break;
						case '2':
							this.totalCount = 0
							this.page =  {
								currentPage: 1,
								pageSize: 10
							}
							this.getOrderHistory();
							break;
						case '3'://优惠券
							this.totalCount = 0
							this.page =  {
								currentPage: 1,
								pageSize: 10
							}
							this.getCoupon();
							break;
						case "4"://推荐会员
							this.totalCount = 0;
							this.page =  {
								currentPage: 1,
								pageSize: 10
							}
							this.getRecommend();
							break;
						case "5"://推荐返利明细
							this.totalCount = 0;
							this.page =  {
								currentPage: 1,
								pageSize: 10
							}
							this.getRebateDetails();
							break;
					}
        		},
        		deep: true
        	}
        },
		mounted() {
			this.getMemberDetail();
		},
		methods: {
			//获取客户信息
			getMemberDetail() {
				this.isLoading = true;
				let data = {
					uid: this.id
				}
				if (this.$version === 'waimao') {
					data.waimao = 1;
				}
				this.$api("member.viewMember", data).then((result) => {
					this.memberInfo = result;
					this.isLoading = false;
					this.getTimesAndMoney();
				}, (error) => {
					this.isLoading = false;
					this.$message({
	                    type: 'error',
	                    message: '获取客户信息失败！'
	                });
				});
			},
			//获取客户消费金额以及购物次数
			getTimesAndMoney() {
				this.$api("member.getTimesAndMoney", {clientId: this.id}).then((result) => {
					this.$set(this.memberInfo, 'bought_times', result.times);
					this.$set(this.memberInfo, 'paid_money', result.total);
				}, (error) => {
					this.$message({
	                    type: 'error',
	                    message: '获取客户消费金额以及购物次数失败！'
	                });
				});
			},
			//获取历史订单
			getOrderHistory(page) {
				if (page) {
					this.page.currentPage = page;
					// this.page.pageSize = page.pageSize;
				}
				let where = [{
					key: 'client_id',
					logic: 'eq',
					value: this.id,
				}]
				let data = {
					where: encodeURIComponent(JSON.stringify(where)),
					page: this.page.currentPage,
					pageSize: this.page.pageSize
				}
				this.isLoading = true;
                this.$api('order.list', data).then((result) => {
					this.orderHistory = result.list;
					this.totalCount = result.page.total;
                    this.isLoading = false;
                }, (error) => {
					this.isLoading = false;
					this.totalCount = 0;
                    if (error && error.data && error.data.status == 102) {
                        this.orderHistory = [];
                    } else {
                        this.$message({
                            type: 'error',
                            message: '获取历史订单出错'
                        });
                    }
                });
			},
			// 获取优惠券
			getCoupon(page){
				if (page) {
					this.page.currentPage = page;
				}
				let param = {
					pagesize : 10,
					page : this.page.currentPage,
					uid: this.id
				}
				this.isLoading = true;
				this.$api("promotion.getCouponDetail",param).then((result) => {
					this.couponList = result.list;
					this.totalCount = result.page.total;
                    this.isLoading = false;
				},(error) => {
					this.isLoading = false;
					this.totalCount = 0;
                    if (error && error.data && error.data.status == 102) {
                        this.couponList = [];
                    } else {
                        this.$message({
                            type: 'error',
                            message: '获取优惠券出错'
                        });
                    }
				})
			},
			// 获取推荐会员
			getRecommend(page){
				if (page) {
					this.page.currentPage = page;
				}
				let param = {
					pageSize : 10,
					page : this.page.currentPage,
					uid: this.id
				}
				this.$api("rebate.recommendRebate",param).then((result) => {
					this.recommendList = result.list;
					this.totalCount = result.page.total;
				},(error) => {
					if(error.data.status == 102){
						this.recommendList = [];
						this.totalCount = 0;
					}else{
						this.$message({
							message: error.data.msg,
							type: 'error'
						});
					}
				})
			},
			// 获取返利明细
			getRebateDetails(page){
				if (page) {
					this.page.currentPage = page;
				}
				let param = {
					pageSize : 10,
					page : this.page.currentPage,
					accountId: this.accountId
				}
				this.$api("rebate.getBaccountHistory", param).then((result) => {
					this.rebateDetails = result.list;
					// this.isLoading = false;
					this.totalCount = result.page.total;
				}, (error) => {
					// this.isLoading = false;
					if (error && error.data && error.data.status == 102) {
						this.rebateDetails = [];
						this.totalCount = 0;
                    } else {
                    	this.$message({
                            type: 'error',
                            message: '加载数据出错'
                        });
                    }
				});
			},
			//编辑客户
			editMember() {
				this.$router.push({
                    name: 'member_add',
                    query: {
                        id: this.id
                    }
                });
			}
		},
		components: {
			addressList,
			pages
		}
	}
</script>
<style scoped>
	.order-form {margin-bottom: 35px;}
	.info-right {line-height: normal; margin-left: 20px;}
	.info-right div {margin-bottom: 10px;}
	.info-right div span {margin-right: 10px;}
	.boxHeight{
		width: 100%;
		height:450px;
		overflow-y:auto;
	}
</style>
<style>
	.view-member-dialog .el-dialog__body {height: 580px;}
	.page-order-history {float: right; margin-top: 10px;}
</style>

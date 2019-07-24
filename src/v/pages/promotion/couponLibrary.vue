<template>
	<div class="contents">
		<page-title :title="title" ></page-title>
		<tab-filter :options="options" @click="getFilterParam()" param="pageTag"></tab-filter>
		<div style="overflow:hidden">
			<el-button type="primary" size='small' @click="toEdit()">新增</el-button>
		  	<div class="search_con">
		  		<operation ref="operation" module="coupon_list" @search="getSearchParam"></operation>
			</div>
		</div>
		<div class="content-table">
			<el-table :data="discountData" size="mini" v-loading="loading">
			    <el-table-column label="优惠券名称">
			    	<template slot-scope="scope">
				        {{ scope.row.coupon_name | specCharacter}}
			      	</template>
			    </el-table-column>
				<el-table-column label="面值（元）">
					<template slot-scope="scope">
				        {{ scope.row.coupon_value}}
			      	</template>
				</el-table-column>
				<el-table-column label="总张数">
					<template slot-scope="scope">
				        {{ scope.row.coupon_start_num}}
			      	</template>
				</el-table-column>
				<el-table-column label="已使用/已发放">
					<template slot-scope="scope">
				        {{ scope.row.use_count + '/' + scope.row.grant_count}}
			      	</template>
				</el-table-column>
				<el-table-column prop="start_date" label="有效期" width="300">
					<template slot-scope="scope">
				        {{ scope.row.coupon_start_time | formatDate('yyyy-MM-dd hh:mm:ss',true) }} 至 {{scope.row.coupon_end_time | formatDate('yyyy-MM-dd hh:mm:ss',true)}}
			      	</template>
				</el-table-column>
				<el-table-column prop="create_time" label="创建时间">
					<template slot-scope="scope">
				        {{ scope.row.create_time | formatDate('yyyy-MM-dd hh:mm:ss',true)}}
			      	</template>
				</el-table-column>  
				<el-table-column label="生效状态" width="100">
			    	<template slot-scope="scope">
				        {{ scope.row.coupon_status | promotionState}}
			      	</template>
			    </el-table-column>
			    <el-table-column label="操作" width="180">
			      	<template slot-scope="scope">
			      		<el-button type="text" size="small" @click="toDetail( scope.row.coupon_id )">查看</el-button>
				        <el-button type="text" size="small" v-if="scope.row.coupon_status == 1 || scope.row.coupon_status == 2" @click="toEdit( scope.row.coupon_id, scope.row.coupon_status )">编辑</el-button>

				        <el-popover
				        	class="ml10"
					        placement="top"
					        width="200"
					        trigger="click"
					        v-model="scope.row.popover"
				        	v-if="scope.row.coupon_status == 1">
							<p>是否删除"{{ scope.row.coupon_name }}"这个优惠券？</p>
							<div style="text-align: right; margin: 0">
							    <el-button size="mini" type="text" @click="scope.row.popover = false">取消</el-button>
							    <el-button type="primary" size="mini" @click="toOperate(scope.row.coupon_id,'del')">确定</el-button>
							</div>
							<el-button slot="reference" type="text" size="small">删除</el-button>
						</el-popover>
						<el-button type="text" size="small" @click="viewDetail(scope.row.coupon_id)">明细</el-button>
			      	</template>
			    </el-table-column>
			</el-table>
		</div>
		<pages :total="totalCount" @change="getPagesParam('page')"></pages>
		<!-- 明细弹窗 -->
		<coupon-detail :visibility.sync="showCouponDetail" :id="viewDetailId" v-if="showCouponDetail"></coupon-detail>
		<!-- 查看弹窗 -->
		<coupon-check :visibility.sync="showCouponCheck" :id="viewDetailId" v-if="showCouponCheck"></coupon-check>
	</div>
</template>
<script>
	import pageTitle from '@components/pageTitle'
	import pages from '@components/pages'
	import couponDetail from './couponDetail'
	import couponCheck from './couponCheck'
	import operation from '@components/operation'
	import tabFilter from '@components/tabFilter'
	export default {
		data() {
			return {
				options: [{
                    label: "生效中",
                    name: "2"
                }, {
                    label: "未生效",
                    name: "1"
                },{
                    label: "已失效",
                    name: "3"
                }, {
                    label: "全部",
                    name: "0"
                }],
				loading:true,
				detailVisible:false,
				state:2,
				key:'name',
				key_value:'',
				totalCount: 0,
				page:1,
				pageSize:10,
				discountData:[],
				pro_type:1,
				title:'优惠券',
				viewDetailId:0,
				showCouponDetail:false,
				showCouponCheck:false
			}
		},
		mounted() {
			// this.pro_type = this.protype || 1;
			this.state = this.$route.query.pageTag;
			this.getPagesParam('page');
		},
		filters:{
			promotionState(value){
				switch (value+"") {
					case '1':
						return "未生效"
						break;
					case '2':
						return "生效中 "
						break;
					case '3':
						return "已失效"
						break;
					default:
						return  "未知"
						break;
				}
			}
		},
		methods: {
			getFilterParam(val){
				this.state = this.$route.query.pageTag;
				this.key = "";
				this.key_value = "";
				this.getPagesParam('state');
			},
			getSearchParam(val){
				this.key = val.search_select
				this.key_value = val.search_value
				this.getPagesParam('search')
			},
			toOperate(id,type){//活动操作
				let api = '';
				switch (type) {
					case 'del':
						api = 'promotion.delCoupon'
						break;
				}
				this.$api(api,{coupon_id:id}).then((result) => {
					this.$message({message: '操作成功',type: 'success'});
					console.log(this.$route.query.pageTag)
					this.getPagesParam("page");
				}, (error) => {
					let msg = error && error.data && error.data.msg ? error.data.msg : '操作失败，请稍后再试';
					this.$message({message: msg,type: 'warning'});
				});
			},
			toEdit(id,state){//新增/编辑操作
				let add = 'addCoupon';
				let params = {name:add}
				if(id){params.query = {id:id,state}}
				this.$router.push(params)
			},
			getPagesParam(key){//组合批量查询参数
				let params = {};
				if(key == 'state'){
					params.status = this.state;
					params.pageSize = 10
					params.page = 1
					// this.$router.push({query:{}})
				}
				if(key == 'search'){
					if(this.key_value.trim() == ''){
						return
					}
					params.key = this.key;
					params.value = this.key_value;
					params.status = this.state;
					params.pageSize = 10
					params.page = 1

					this.$router.push({
						query: {
							pageTag: this.state
						}
					});
				}
				if(key == 'page'){
					params.status = this.state;
					params.pageSize = this.$route.query.pageSize
					params.page = this.$route.query.currentPage
					if(this.key_value.trim() != '' && this.key.trim() != ''){
						params.key = this.key;
						params.value = this.key_value;
					}
					if(params.pageSize == undefined || params.page == undefined){
						params.pageSize = 10
						params.page = 1
					}
				}
				this.getDiscount(params);
			},
			//查看优惠券详情
			toDetail(id){
				this.showCouponCheck = true;
				this.viewDetailId = id;
			},
			//查看明细
			viewDetail(id) {
				this.viewDetailId = id;
				this.showCouponDetail = true;
			},
			//批量查询优惠券数据
			getDiscount(obj){
				this.loading = true;
				this.$api("promotion.getCouponList",obj).then((result) => {
					this.loading = false
					this.discountData = result.list || [];
					this.totalCount = Number(result.page.total);
				}, (error) => {
					this.loading = false
					if(error.data.status != '102'){
						this.$message({ message: '查询优惠券数据出错', type: 'error' });
					}else{
						this.discountData = [];
						this.totalCount = 0;
					}
				});
			}
		},
		components: {
			pageTitle,
			pages,
			couponDetail,
			couponCheck,
			operation,
			tabFilter
		}
	}
</script>
<style>
.search_con{float: right;}
.search_con .el-select .el-input {width: 110px;}
.dropdown-link{font-size: 12px; color: #409EFF; margin-left: 10px;}
</style>

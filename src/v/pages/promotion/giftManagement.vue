<template>
	<div class="contents">
		<page-title :title="title" ></page-title>
		<div style="overflow:hidden">
			<el-button type="primary" size='small' @click="toEdit()">新增</el-button>
		  	<!-- <div class="search_con">
		  		<operation ref="operation" module="coupon_list" @search="getSearchParam"></operation>
			</div> -->
		</div>
		<div class="content-table">
			<el-table :data="giftData" size="mini" v-loading="loading">
			    <el-table-column label="赠品名称">
			    	<template slot-scope="scope">
				        {{ scope.row.name}}
			      	</template>
			    </el-table-column>
				<el-table-column label="赠品编号">
					<template slot-scope="scope">
				        {{ scope.row.code}}
			      	</template>
				</el-table-column>
				<el-table-column label="价格（元）">
					<template slot-scope="scope">
				        {{ scope.row.price}}
			      	</template>
				</el-table-column>
				
				<el-table-column label="库存">
					<template slot-scope="scope">
				        {{ scope.row.stock}}
			      	</template>
				</el-table-column>
				<el-table-column prop="create_time" label="创建时间">
					<template slot-scope="scope">
				        {{ scope.row.createTime}}
			      	</template>
				</el-table-column>  
			    <el-table-column label="操作" width="180">
			      	<template slot-scope="scope">
				        <el-button type="text" size="small" @click="toEdit( scope.row.productId )">编辑</el-button>

				        <el-popover
				        	class="ml10"
					        placement="top"
					        width="200"
					        trigger="click"
					        v-model="scope.row.popover"
				        	>
							<p>是否删除"{{ scope.row.name }}"这个赠品？</p>
							<div style="text-align: right; margin: 0">
							    <el-button size="mini" type="text" @click="scope.row.popover = false">取消</el-button>
							    <el-button type="primary" size="mini" @click="toOperate(scope.row.productId,'del')">确定</el-button>
							</div>
							<el-button slot="reference" type="text" size="small">删除</el-button>
						</el-popover>
			      	</template>
			    </el-table-column>
			</el-table>
		</div>
		<pages :total="totalCount" @change="getPagesParam('page')"></pages>
		
	</div>
</template>
<script>
	import pageTitle from '@components/pageTitle'
	import pages from '@components/pages'
	// import operation from '@components/operation'
	export default {
		data() {
			return {
				loading:true,
				detailVisible:false,
				state:1,
				key:'name',
				key_value:'',
				totalCount: 0,
				page:1,
				pageSize:10,
				giftData:[],
				pro_type:1,
				title:'赠品管理',
				viewDetailId:0,
				showCouponDetail:false,
				showCouponCheck:false
			}
		},
		mounted() {
			// this.pro_type = this.protype || 1;
			// this.state = this.$route.query.pageTag;
			this.getPagesParam();
		},
		filters:{
		},
		methods: {
			toOperate(id,type){//活动操作
				let api = '';
				switch (type) {
					case 'del':
						api = 'promotion.delGift'
						break;
				}
				this.$api(api,{ids:id}).then((result) => {
					this.$message({message: '操作成功',type: 'success'});
					console.log(this.$route.query.pageTag)
					this.getPagesParam();
				}, (error) => {
					let msg = error && error.data && error.data.msg ? error.data.msg : '操作失败，请稍后再试';
					this.$message({message: msg,type: 'warning'});
				});
			},
			toEdit(id,state){//新增/编辑操作
				let add = 'addGift';
				let params = {name:add}
				if(id){params.query = {id:id}}
				this.$router.push(params)
			},
			getPagesParam(key){//组合批量查询参数
				let params = {};
				params.pageSize = this.$route.query.pageSize
				params.page = this.$route.query.currentPage
				if(!params.pageSize || !params.page){
					params.pageSize = 10;
					params.page = 1;
				}
				this.getDiscount(params);
			},
			
			//批量查询赠品数据
			getDiscount(obj){
				this.loading = true;
				this.$api("promotion.getGiftList",obj).then((result) => {
					this.loading = false
					this.giftData = result.list || [];
					// 获取赠品库存
					let productIds = [],goodsids = [];
					this.giftData.forEach((item,index) => {
						goodsids.push(item.productId);
						productIds.push({"product_id":item.productId})
					})
					// 批量获取商品库存
					this.$api("goods.plGetGoodsStock",{map:productIds}).then((result) => {
						result.forEach((item,index) => {
							this.giftData.find((n) => n.productId == item.product_id).stock = item.store;
						})		
					},(error) => {
						this.$message({
							type: 'error',
							message: '获取商品库存出错'
						});
					})
					// 获取赠品价格
					this.getPrice(goodsids.join(","));
					this.totalCount = Number(result.totalCount);
				}, (error) => {
					this.loading = false
					if(error.data.status != '102'){
						this.$message({ message: '查询赠品数据出错', type: 'error' });
					}else{
						this.giftData = [];
						this.totalCount = 0;
					}
				});
			},
			getPrice(goodsids){
				let params = {
					product_id:goodsids,
					minPrice:1
				}
				this.$api("goods.getRetailGoodsPrice",params).then((result) => {
					result.forEach((item,index) => {
						this.giftData.find((n) => n.productId == item.product_id).price = item.market_price;
					})	
				},(error) => {
					this.$message({
						type: 'error',
						message: '获取商品价格出错'
					});
				})
			}
		},
		components: {
			pageTitle,
			pages,
			// operation,
		}
	}
</script>
<style>
.search_con{float: right;}
.search_con .el-select .el-input {width: 110px;}
.dropdown-link{font-size: 12px; color: #409EFF; margin-left: 10px;}
</style>

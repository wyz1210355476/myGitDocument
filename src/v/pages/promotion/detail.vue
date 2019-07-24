<template>
	<div v-loading="pageloading">
		<div class="info-model">
			<h1 class="form_title">折扣信息</h1>
			<div class="info-content">
				<p class="basicinfo"><span>活动名称：</span>{{detail.name | specCharacter}}</p>
				<p class="basicinfo"><span>活动开始时间：</span>{{detail.start_date}}</p>
				<p class="basicinfo"><span>活动标签：</span>{{detail.lname | specCharacter}}</p>
				<p class="basicinfo"><span>活动结束时间：</span>{{detail.end_date}}</p>
			</div>
		</div>
		<div>
			<h1 class="form_title">规则说明</h1>
			<div class="info-content">
				<p class="basicinfo">{{detail.rule_declaration}}</p>
			</div>
			
		</div>
		<div class="info-model" v-if="type == 'goods'">
			<h1 class="form_title">活动商品<span>商品数量（{{productCount}}）</span></h1>
			<el-table :data="product" max-height="250" size="mini" class="dialogTable">
		    	<el-table-column label="商品名称" >
		    		<template slot-scope="scope">{{ scope.row.name }}</template>
		    	</el-table-column>
		    	<el-table-column label="市场价" >
		    		<template slot-scope="scope">{{ scope.row.price }}</template>
		    	</el-table-column>
		    	<el-table-column label="零售价" >
		    		<template slot-scope="scope">{{ scope.row.retailPrice }}</template>
		    	</el-table-column>
		    	<el-table-column label="库存" >
		    		<template slot-scope="scope">{{ scope.row.stock }}</template>
		    	</el-table-column>
		    	<el-table-column label="是否在售">
		    		<template slot-scope="scope">{{ scope.row.status == 1 ? "是" : '否' }}</template>
		    	</el-table-column>
		    </el-table>
		</div>
		<!-- 全部商品 begin -->
		<div class="info-model" v-if="type == 'allGoods'">
			<h1 class="form_title">活动商品<span>全部商品</span></h1>
		</div>
		<!-- 全部商品 end -->
		<div class="info-model" v-if="type == 'category'">
			<h1 class="form_title">活动分类<span>分类数量（{{productCount}}）</span></h1>
			<div class="catList"><span v-for="item in product" :key="item.id">{{item.categoryName}}</span></div>
		</div>
		<div class="info-model promotion_rule_detail" v-if="protype == 1">
			<h1 class="form_title">促销规则<span>{{rule.ruleType == 3 ? '商品折扣' : '商品减价'}}</span></h1>
			<div class="info-content">
				<span v-if="rule.ruleType == 3">打 {{rule.ruleVal}} 折</span>
				<span v-if="rule.ruleType == 4">减 {{rule.ruleVal}} 元</span>
				<!-- <span class="promptspan" v-if="rule.rule_type==3">(折扣大于0小于等于10)</span> -->
			</div>
		</div>
		<div class="info-model">
			<h1 class="form_title">
				促销规则
				<span v-if="detail.proc == 1">订单满赠</span>
				<span v-if="detail.proc == 2">订单免运费</span>
				<span v-if="detail.proc == 3">订单折扣</span>
				<span v-if="detail.proc == 4">订单满减</span>
			</h1>
			<h1 class="form_title" v-if="detail.proc == 1 && rule.give_coupon_type == 1">
				赠送时机
				<span>{{rule.give_coupon_time == 1 ? "支付成功" : "订单确认收货"}}</span>
			</h1>
			<h1 class="form_title" v-if="detail.proc == 1">
				规则设置
				<span>{{rule.buy_rule == 1 ? "按订单额" : "按购买量"}}</span>
			</h1>
			<div class="info-content" v-if="detail.proc == 3">
				<div v-for="item in rule.rule" :key="item.id">
					单笔满 {{item.rulePrice}} 元时：
					<span>打 {{item.ruleVal}} 折</span>
					<!-- <span v-if="item.ruleType == 4">减 {{item.ruleVal}} 元</span> -->
				</div>
			</div>
			<!-- 满减 -->
			<div class="info-content" v-if="detail.proc == 4">
				<div v-for="item in rule.rule" :key="item.id">
					单笔满 {{item.rulePrice}} 元时：
					<span>减 {{item.ruleVal}} 元</span>
				</div>
			</div>
			<!-- 满赠 -->
			<div class="info-content" v-if="detail.proc == 1">

				<div v-for="item in detail.giveInfo" :key="item.coupon_id">
					<p class="sendRule">单笔满 {{item.ruleNum}} {{rule.buy_rule == 1 ? "元" : "件"}}时：</p>
					<div class="sendInfo">
						<span v-for="(it,i) in item.obj_send_num.split(',')"  :key="it">送 {{it}} {{rule.give_coupon_type == 1 ? "张 " + "【" +  item.name.split(",")[i] + "】" : "个 " + "【" + item.name.split(",")[i] + "】"}} {{rule.give_coupon_type == 1 ? " 优惠券" : "赠品"}};</span>
					</div>
				</div>
			</div>
			<div class="info-content" v-if="detail.proc == '2'">
				<div>满{{rule.rulePrice}}元免运费，不包含以下城市：</div>
				<div class="cutarea" :class="{areaHeight:areaHeight}">
					<el-button
					type="text"
					class="areaBtn"
					:icon="areaHeight == true ? 'el-icon-arrow-down' : 'el-icon-arrow-up'"
					size="small"
					@click="areaHeight = areaHeight == true ? false : true"
					>展开</el-button>
					<span v-for="item in rule.barringRegion" :key="item.id">{{showArea(item)}}</span>
				</div>

			</div>
		</div>
	</div>
</template>
<script>
	import pageTitle from '@components/pageTitle';
	import pages from '@components/pages';
	import * as countryData from '@c/util/metaTreeCountryData'
	var areaData = countryData.formatData2();
	export default {
		data() {
			return {
				pageloading:true,
				areaHeight:true,
				loading:true,
				productCount:0,
				type:'',

				id:'',
				detail:'',
				label:'',
				rule:'',
				areasData:'',
				product: [],
			    areaD:'',
			}
		},
		watch:{
			detailid(){
				this.id = this.detailid;
				this.pageloading = true
				if(this.id != 0){
					this.loading = true
					this.product = []
					this.getDetail();
				}else{
					this.$message({ message: '查询活动数据出错', type: 'error' });
				}
			}
		},
		filters: {
			sum(str){
				let ary = str.split(","),sum = 0;
				ary.forEach(item => {
					sum += Number(item);
				});
				return sum;
			}
		},
		mounted() {
			this.id = this.detailid
			if(this.id != 0){
				this.getDetail();
			}else{
				this.$message({ message: '查询活动数据出错', type: 'error' });
			}
		},
		methods: {
			showArea(val){
				if(!this.area){
					this.area = {};
					for(let i in areaData){
						Object.assign(this.area,areaData[i])
					}
				}
				return this.area[val] || val
			},
			renderRull(){
				if(this.detail.proc == '2'){
					this.rule.barringRegion = this.rule.barringRegion.split(",")
				}
			},
			getDetail(){
				let params = {
					'id':this.id
				}
				this.$api("promotion.getPromotionDetail",params).then((result) => {
					this.detail = result;
					this.rule = JSON.parse(result.rule);
					this.type = this.rule.goods.type
					if(this.rule.goods.ids){
						this.goods = this.rule.goods.ids.split(",")
					}else{
						this.goods = []
					}
					this.productCount = this.goods.length
					if(this.type == 'goods' && this.productCount > 0 || this.type == 'allGoods'){
						this.getProducts(this.type);
					}else if(this.type == 'category' && this.productCount > 0){
						this.getCatgorys();
					}
					if(this.protype == 2){
						this.renderRull()
					}
					
				}, (error) => {
					this.pageloading = false
					this.$message({ message: '查询活动数据出错', type: 'error' });
				});
			},
			getProducts(type){
				if(type == "allGoods"){
					this.pageloading = false
				}else{
					this.$api("promotion.selectProductSkus",{ids:this.goods.join(",")}).then((result) => {
						this.pageloading = false
						this.product = result.list;
					}, (error) => {
						this.pageloading = false
						this.$message({ message: '获取商品列表失败', type: 'warning'});
					});
				}	
			},
			getCatgorys(){
				this.$api("promotion.findCategory",{ids :this.goods.join(",")}).then((result) => {
					this.pageloading = false
					this.product = result.list;
				}, (error) => {
					this.pageloading = false
					this.$message({ message: '获取分类失败', type: 'warning'});
				});
			}
		},
		components: {
			pageTitle,
			pages
		},
		props: ['detailid','protype'],
	}
</script>
<style scoped>
	.sendInfo{
		margin-left: 100px;
	}
	.sendRule{
		float: left;
		margin: 0;
	}
	.sendInfo>span{
		margin-right: 10px;
	}
</style>
<style>
.info-model{margin-bottom:30px; overflow: hidden;}
.info-content {overflow: hidden; color: #999;font-size: 12px;}
.info-content p.basicinfo{display: inline-block; width: 50%; float: left; margin:0; font-size: 12px; color: #999}
.info-content p.basicinfo span{margin-right: 5px;}

.form_title{font-size: 12px; line-height:20px; color: #333; font-weight: normal;}
.form_title span{font-size:12px; color: #999; font-weight: normal; margin-left: 10px;}

.promptspan{color: #999}
.cutarea{line-height: 30px; overflow: hidden; padding-right: 60px; position: relative; text-align: justify;}
.cutarea .areaBtn{position: absolute; right: 0; top:0;}
.areaHeight{height: 30px;}
.cutarea span{margin-right: 10px;}

.catList{font-size:12px; color: #999}
.catList span{margin-right: 10px;}

.product-sku{margin-right: 8px;}
</style>

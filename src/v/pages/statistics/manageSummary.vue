<template>
	<div class="contents">
		<page-title :title="'经营概况'"></page-title>
		<time-frame @confirm='getSelectTime' :ceLoading="isLoading"></time-frame>
		<div v-loading="isLoading">
			<div class="charts">
				<div class="manageDateBox">
					<div class="itemName">
						<div class="traffic nameBox">
							<img src="../../common/images/stream_amount.png">
							<div>流量</div>
						</div>
					</div>
					<ul class="dateItemBox">
						<li></li>
						<li>
							<div class="txt">浏览量</div>
							<div class="num ft6bcbca">{{traffic.browsingVolume}}</div>
						</li>
						<li>
							<div class="txt">访客数</div>
							<div class="num ft6bcbca">{{traffic.visitorsNumber}}</div>
						</li>
						<li>
							<div class="txt">新增客户</div>
							<div class="num ft6bcbca">{{traffic.newMembers}}</div>
						</li>
						<li>
							<div class="txt">客户总数</div>
							<div class="num ft6bcbca">{{traffic.totalMembers}}</div>
						</li>
					</ul>
				</div>
				<div class="manageDateBox">
					<div class="itemName">
						<div class="salesVolume">
							<img src="../../common/images/sale_amount.png">
							<div>销量</div>
						</div>
					</div>
					<ul class="dateItemBox">
						<li></li>
						<li>
							<div class="txt">新增订单</div>
							<div class="num ftfa8e74">{{salesVolume.newOrder}}</div>
						</li>
						<li>
							<div class="txt">有效订单</div>
							<div class="num ftfa8e74">{{salesVolume.validOrder}}</div>
						</li>
						<li>
							<div class="txt">已发货订单</div>
							<div class="num ftfa8e74">{{salesVolume.deliveryOrder}}</div>
						</li>
						<li>
							<div class="txt">已完成订单</div>
							<div class="num ftfa8e74">{{salesVolume.completedOrder}}</div>
						</li>
					</ul>
					<ul class="dateItemBox">
						<li></li>
						<li>
							<div class="txt">完成订单金额</div>
							<div class="num ftfa8e74">{{salesVolume.orderAmount}}</div>
						</li>
						<li>
							<div class="txt">完成订单量</div>
							<div class="num ftfa8e74">{{salesVolume.completedOrder}}</div>
						</li>
						<li>
							<div class="txt">完成订单客户数</div>
							<div class="num ftfa8e74">{{salesVolume.customerNumber}}</div>
						</li>
						<li>
							<div class="txt">完成订单客单价</div>
							<div class="num ftfa8e74">{{salesVolume.unitPrice}}</div>
						</li>
					</ul>
				</div>
				<div class="manageDateBox">
					<div class="itemName">
						<div class="revenue nameBox">
							<img src="../../common/images/revenue_amount.png">
							<div>营收</div>
						</div>
					</div>
					<ul class="dateItemBox">
						<li></li>
						<li>
							<div class="txt">收款额</div>
							<div class="num ft6bcbca">{{revenue.amountIncome}}</div>
						</li>
						<li>
							<div class="txt">退款额</div>
							<div class="num ft6bcbca">{{revenue.retreatsAmount}}</div>
						</li>
						<li>
							<div class="txt">收入</div>
							<div class="num ft6bcbca">{{revenue.income}}</div>
						</li>
						<li>
						</li>
					</ul>
				</div>
			</div>
			<div class="ce-title">商品排行</div>
			<el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
				<el-tab-pane label="销售量" name="salesVolume"></el-tab-pane>
				<el-tab-pane label="销售额" name="salesAmount"></el-tab-pane>
				<div class="ce-chartBox">
					<dl class="column" v-show="topStatus" v-for="(item,index) in CommodityRankings">
						<dt><img :src="item.imgSrc"></dt>
						<dd>
							<p>{{item.name}}</p>
							<div>
								<div style="{transition: width 2s;-moz-transition: width 2s;-webkit-transition: width 2s;-o-transition: width 2s;}" :style="{width:endWidths[index]}" class="common-dh donghua" :class='bgCol'></div>
								<p>{{item.number}}</p>
							</div>
						</dd>
					</dl>
					<div class="no-data" v-show="!topStatus">该时间段内没有商品销售数据！</div>
				</div>
			</el-tabs>
		</div>

	</div>
</template>
<script>
	import pageTitle from '@components/pageTitle';
	import timeFrame from './components/timeFrame';
	export default {
		data() {
			return{
				isLoading:false,
				activeName:'salesVolume',
				traffic:{
					browsingVolume:'',
					visitorsNumber:'',
					newMembers:'',
					totalMembers:''
				},
				salesVolume:{
					newOrder:'',
					validOrder:'',
					deliveryOrder:'',
					completedOrder:'',
					orderAmount:'',
					customerNumber:'',
					unitPrice:''
				},
				revenue:{
					amountIncome:'',
					retreatsAmount:'',
					income:''
				},
				cacheTimeFrame:{},
				tabName:'salesVolume',
				bgCol:'bgCol_22b5bf',
				colorData:{
					salesVolume:'bgCol_22b5bf',
					salesAmount:'bgCol_9ae0e5'
				},
				CommodityRankings:[],
				topStatus:true,
				endWidths:["0","0","0","0","0","0","0","0","0","0"]
			}
		},
		mounted() {
		},
		methods: {
			getSelectTime(msg){
				this.isLoading = true;
				// 缓存时间范围
				this.cacheTimeFrame = msg;
				// 获取客户注册量
				let promise01 = this.$api("memberSummary.getMemberRegistrationAmount", {start:msg.timeStart,end:msg.timeEnd}).then((result) => {
					let newMembers = 0;
					for(let key in result){
						newMembers += result[key];
					}
					this.traffic.newMembers = newMembers;
				}, (result)=>{
					if(result.data.status == "102"){
						this.traffic.newMembers = 0;
					}else{
						this.$message({
							message: result.data.msg,
							type: 'error'
						});
					}

				});
				// 获取客户总数
				let promise02 = this.$api("memberSummary.getTotalMember").then((result) => {

					this.traffic.totalMembers = result.count;
				}, (result)=>{
					if(result.data.status == "102"){
						this.traffic.totalMembers = 0;
					}else{
						this.$message({
							message: result.data.msg,
							type: 'error'
						});
					}

				});

				// 获取新增订单
				let promise03 = this.ajax({
					api:'getOrder',
					condition:{
						start:msg.timeStart,
						end:msg.timeEnd,
						action:0
					},
					module:'salesVolume',
					val:'newOrder'
				});

				// 获取有效订单
				let promise04 = this.ajax({
					api:'getOrder',
					condition:{
						start:msg.timeStart,
						end:msg.timeEnd,
						action:1
					},
					module:'salesVolume',
					val:'validOrder'
				});

				// 获取已发货订单
				let promise05 = this.ajax({
					api:'getOrder',
					condition:{
						start:msg.timeStart,
						end:msg.timeEnd,
						action:2
					},
					module:'salesVolume',
					val:'deliveryOrder'
				});

				// 获取已完成订单
				let promise06 = this.ajax({
					api:'getOrder',
					condition:{
						start:msg.timeStart,
						end:msg.timeEnd,
						action:6
					},
					module:'salesVolume',
					val:'completedOrder'
				});
				// 获取订单金额，完成订单客户数，完成订单客单价
				let promise07 = this.$api("manageSummary.getOrderList", {start:msg.timeStart,end:msg.timeEnd}).then((result) => {
					this.salesVolume.orderAmount = result.paid_amount;
					this.salesVolume.customerNumber = result.client;
					this.salesVolume.unitPrice = result.single;
				}, (result)=>{
					if(result.data.status == "102"){
						this.salesVolume.orderAmount = '0';
						this.salesVolume.customerNumber = '0';
						this.salesVolume.unitPrice = '0';
					}else{
						this.$message({
							message: result.data.msg,
							type: 'error'
						});
					}

				});
				// 获取营收数据
				let promise08 = this.$api("manageSummary.getIncome", {start:msg.timeStart,end:msg.timeEnd}).then((result) => {
					this.revenue.amountIncome = result.payMoney;
					this.revenue.retreatsAmount = result.returnMoney;
					this.revenue.income = result.actualMoney;
				}, (result)=>{
					if(result.data.status == "102"){
						this.revenue.amountIncome = '0';
						this.revenue.retreatsAmount = '0';
						this.revenue.income = '0';
					}else{
						this.$message({
							message: result.data.msg,
							type: 'error'
						});
					}

				});

				// top10销售量
				let promise09 = this.topTen(this.tabName,msg);

				// 加载状态
				let that = this;
				Promise.all([promise01,promise02,promise03,promise04,promise05,promise06,promise07,promise08,promise09]).then(function(msg){
					that.isLoading = false;
				}).catch(function(msg){
					that.isLoading = false;
				})

			},
			handleClick(tab){//top10标签切换

				// 缓存tab
				this.tabName = tab.name;
				// 切换销售量销售额
				this.bgCol = this.colorData[tab.name]
				this.topTen(tab.name,this.cacheTimeFrame)
			},
			topTen(tab,timeFrame){//top10渲染
				let promiseObj;
				if(tab === "salesVolume"){//销量top10
					let endWidths = [];
					promiseObj = this.$api("manageSummary.getOrderQuantity", {start:timeFrame.timeStart,end:timeFrame.timeEnd}).then((result) => {
						this.topStatus = true;
						let CommodityRankings = this.CommodityRankings = [];
						result.forEach(function(item,index){
							CommodityRankings.push({
								imgSrc:item.image,
								name:item.name,
								number:item.total
							})
							if(index == 0){
								endWidths = ['80%'];
							}else if(index > 0){
								endWidths.push((parseInt(item.total)/parseInt(result[0].total))*0.8*100+"%");
							}
						})
						console.log(endWidths)
						let that = this;
						setTimeout(function(){
							that.endWidths = endWidths;
						},0)
					}, (result)=>{
						if(result.data.status == "102"){
							this.endWidths = [];
							this.topStatus = false;
						}else{
							this.$message({
								message: result.data.msg,
								type: 'error'
							});
						}

					})
				}else if(tab === "salesAmount"){//销售额top10
					let endWidths = [];
					promiseObj = this.$api("manageSummary.getOrderAmount", {start:timeFrame.timeStart,end:timeFrame.timeEnd}).then((result) => {
						this.topStatus = true;
						let CommodityRankings = this.CommodityRankings = [];
						result.forEach(function(item,index){
							CommodityRankings.push({
								imgSrc:item.image,
								name:item.name,
								number:item.total+"元"
							})
							if(index == 0){
								endWidths = ['80%'];
							}else if(index > 0){
								endWidths.push((parseInt(item.total)/parseInt(result[0].total))*0.8*100+"%");
							}
						})
						let that = this;
						setTimeout(function(){
							that.endWidths = endWidths;
						},0)
					}, (result)=>{
						if(result.data.status == "102"){
							this.endWidths = [];
							this.topStatus = false;

						}else{
							this.$message({
								message: result.data.msg,
								type: 'error'
							});
						}

					})
				}

				return promiseObj;
			},
			ajax(obj){//抽象ajax
				let promiseObj = this.$api("manageSummary."+obj.api, obj.condition).then((result) => {
					this[obj.module][obj.val] = result.total;
				}, (result)=>{
					if(result.data.status == "102"){
						this[obj.module][obj.val] = '0';
					}else{
						this.$message({
							message: result.data.msg,
							type: 'error'
						});
					}

				})
				return promiseObj;
			}
		},
		components: {
			pageTitle,
			timeFrame
		}
	}
</script>
<style>
li,ul,dl,dt,dd,p{
	list-style-type: none;
	margin: 0;
	padding: 0;
}
.charts{
	margin-top: 27px;
}
.manageDateBox{
	margin-top: 27px;
	position: relative;
}
.itemName{
	float: left;
	width: 20%;
	position: absolute;
	left: 0;
	top: 0;
}
.itemName>div{
	width: 50%;
	height: 100%;
	background-color: #6bcbca;
	position: relative;
}
.traffic{

}
.nameBox>img{
	position: absolute;
    left: 50%;
    top: 18px;
    margin-left: -26px;
}
.nameBox>div{
	line-height: 55px;
    padding-top: 55px;
    text-align: center;
    font-weight: bold;
    color: #fff;
	font-size: 20px;
}
.dateItemBox{
	height: 110px;
	background-color: #fafafa;
}
.dateItemBox>li{
	float: left;
	width: 20%;
	height: 110px;
	border-bottom: 1px solid #f0f0f0;
}
.dateItemBox .txt{
	font-size: 14px;
	line-height: 55px;
	color: #666;
}
.dateItemBox .num{
	line-height: 55px;
	font-size: 20px;
}
.ft6bcbca{
    color: #6bcbca;
}
.ftfa8e74 {
    color: #fa8e74;
}
.itemName>.salesVolume{
	height: 222px;
	background-color: #fa8e74;
}
.itemName>.salesVolume>img{
	top: 52px;
	position: absolute;
    left: 50%;
    margin-left: -26px;
}
.itemName>.salesVolume>div{
	line-height: 110px;
    padding-top: 98px;
    text-align: center;
    font-weight: bold;
    color: #fff;
    font-size: 20px;
}
.itemName>.revenue{
	background-color: #97ce68;
}
.ce-title{
	font-size: 16px;
	line-height: 74px;
	color:#666;
}
.ce-chartBox{
	min-height: 300px;
}
.column{
	padding-left: 5px;
	height: 50px;
	position: relative;
	margin-bottom: 10px;
}
.column>dt{
	position: absolute;
	height: 50px;
	width: 50px;
	padding-right: 17px;
}
.column>dt>img{
	height: 50px;
	width: 50px;
}
.column>dd{
	height: 50px;
	/*background-color: #333;*/
	padding-left: 67px;
}
.column>dd>p{
	font-size: 12px;
	color: #999;
	height: 33px;
	padding-top: 5px
}
.column>dd>div{
	height: 12px;
	width: 100%;
	position: relative;
}
.column>dd>div>div{
	height: 12px;
	width: 0%;
}
.column>dd>div>p{
	color: #666;
	font-size: 12px;
	position: absolute;
	top: -4px;
	left: 81%;
}
.bgCol_22b5bf{
	background-color: #22b5bf;
}
.bgCol_9ae0e5{
	background-color: #9ae0e5;
}
.no-data{
	text-align: center;
	line-height: 100px;
	color:#999;
}
/*.common-dh{
	transition: width 2s;
	-moz-transition: width 2s;
	-webkit-transition: width 2s;
	-o-transition: width 2s;
}
.column>dd>div>.donghua{
	width:80%;
}*/
</style>
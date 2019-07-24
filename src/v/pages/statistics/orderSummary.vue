<template>
	<div class="contents">
		<page-title :title="'订单分析'"></page-title>
		<time-frame @confirm='getSelectTime' :ceLoading="isLoading"></time-frame>
		<div v-loading="isLoading">
			<div class="charts">
				<el-tabs v-model="activeName" type="border-card" @tab-click="handleClick" empty-text="没有相关信息">
					<el-tab-pane label="订单量" name="orderQuantity"></el-tab-pane>
					<el-tab-pane label="订单金额" name="orderAmount"></el-tab-pane>
					<el-tab-pane label="平均订单金额" name="averageOrderAmount"></el-tab-pane>
					<div class="chartBox" id="lineChart"></div>
				</el-tabs>
			</div>
			<div class="charts">
				<el-table :data="orderSummaryData" border style="width: 100%" size="mini">
					<el-table-column prop="date" label="时间"></el-table-column>
					<el-table-column prop="orderQuantity" label="订单量"></el-table-column>
					<el-table-column prop="orderAmount" label="订单金额"></el-table-column>
					<el-table-column prop="averageOrderAmount" label="平均订单金额"></el-table-column>
				</el-table>
				<pages :total="totalCount" @change="getPagesParam"></pages>
			</div>
		</div>
	
	</div>
</template>
<script>
import pageTitle from '@components/pageTitle';
import timeFrame from './components/timeFrame';
import chartsConfig from './components/chartsConfig';
import echarts from 'echarts';
import pages from '@components/pages';
import router from '@c/router';
export default {
	data() {
		return{
			isLoading:false,
			activeName: 'orderQuantity',
			orderSummaryData:[],
			chartOrderSummaryData:{
				dates:[],
				orderQuantity:[],
				orderAmount:[],
				averageOrderAmount:[]
			},
			color:{
				orderQuantity:{
					"lineCol":"#69c2e2",
					"pointCol":"#6fc6e1"
				},
				orderAmount:{
					"lineCol":"#f49167",
					"pointCol":"#ff7336"
				},
				averageOrderAmount:{
					"lineCol":"#ebe17f",
					"pointCol":"#e9e079"
				}
			},
			tabName:'orderQuantity',
			cacheTimeFrame:{},
			day:'',
			cachePageSize:'10',
			totalCount: 0
		}
	},
	mounted() {
		this.cachePageSize = this.$route.query.pageSize ? this.$route.query.pageSize : '10';
	},
	methods: {
		getSelectTime(msg){
			this.isLoading = true;
			// 缓存时间
			let day = this.day = (new Date(msg.timeEnd)-new Date(msg.timeStart))/(24*60*60*1000)+1;
			this.cacheTimeFrame = msg;
			this.totalCount = day;
			let promise01 = this.$api("orderSummary.getAllOrderList", {start:msg.timeStart,end:msg.timeEnd}).then((result) => {
				let data = result.list;
				// 图表数据
				this.chartOrderSummaryData.dates = [];
				this.chartOrderSummaryData.orderQuantity = [];
				this.chartOrderSummaryData.orderAmount = [];
				this.chartOrderSummaryData.averageOrderAmount = [];

				// 列表数据
				this.orderSummaryData = [];
				// 记录循环次数
				let recordNum = 0;
				for(let key in data){
					recordNum++;
					this.chartOrderSummaryData.dates.push(key);
					if(data[key] == "0"){
						// 图表数据
						this.chartOrderSummaryData.orderQuantity.push(0);
						this.chartOrderSummaryData.orderAmount.push(0);
						this.chartOrderSummaryData.averageOrderAmount.push(0);
						// 列表数据
						// debugger;
						if(recordNum <= this.cachePageSize){
							this.orderSummaryData.push({
								date:key,
								orderQuantity:'0',
								orderAmount:'0',
								averageOrderAmount:'0'
							})
						}
						
					}else{
						// 图表数据
						this.chartOrderSummaryData.orderQuantity.push(data[key].quantity);
						this.chartOrderSummaryData.orderAmount.push(data[key].paid_amount);
						this.chartOrderSummaryData.averageOrderAmount.push(data[key].ave);
						// 列表数据
						// debugger;
						if(recordNum <= this.cachePageSize){
							this.orderSummaryData.push({
								date:key,
								orderQuantity:data[key].quantity,
								orderAmount:data[key].paid_amount,
								averageOrderAmount:data[key].ave
							})
						}
						
					}
				}
				
				this.setChart({
					color:this.color[this.tabName],
					xAxis:this.chartOrderSummaryData.dates,
					datas:this.chartOrderSummaryData[this.tabName]
				})
			}, (result)=>{
				this.$message({
					message: result.data.msg,
					type: 'error'
				});
			})
			// 加载状态
				let that = this;
				Promise.all([promise01]).then(function(msg){
					that.isLoading = false;
				}).catch(function(msg){
					that.isLoading = false;
				})
		},
		handleClick(tab){
			this.tabName = tab.name;
			this.setChart({
					color:this.color[tab.name],
					xAxis:this.chartOrderSummaryData.dates,
					datas:this.chartOrderSummaryData[this.tabName]
			})
		},
		getPagesParam(page){
			var currentPage = page.currentPage,
				pageSize = page.pageSize;
				this.cachePageSize = page.pageSize;
			this.$api("orderSummary.getPageOrderList", {start:this.cacheTimeFrame.timeStart,end:this.cacheTimeFrame.timeEnd,'page':currentPage,'pageSize':pageSize}).then((result) => {
					this.orderSummaryData = [];
					this.totalCount = this.day;
					let data = result.list;
					for(let key in data){
						if(data[key] == "0"){
						// 列表数据
							this.orderSummaryData.push({
								date:key,
								orderQuantity:'0',
								orderAmount:'0',
								averageOrderAmount:'0'
							})
						
						}else{
							// 列表数据
							this.orderSummaryData.push({
								date:key,
								orderQuantity:data[key].quantity,
								orderAmount:data[key].paid_amount,
								averageOrderAmount:data[key].ave
							})
						}
					}
				}, (result)=>{
					if(result.data.status != '102'){
						this.$message({
							message: result.data.msg,
							type: 'error'
						});
					}
				})	
		},
		setChart(obj){
			chartsConfig.lineOption.xAxis[0].data = obj.xAxis;
			chartsConfig.lineOption.series[0].data = obj.datas;
			chartsConfig.lineOption.color[0] = obj.color.pointCol;
			chartsConfig.lineOption.series[0].lineStyle.normal.color = obj.color.lineCol;

			let lineDom = document.getElementById('lineChart');
			let lineChart = echarts.init(lineDom);
			lineChart.setOption(chartsConfig.lineOption);
		}
	},
	components: {
		pageTitle,
		timeFrame,
		pages
	}
}
</script>
<style>
.charts{
	margin-top: 27px;
}
.chartBox{
	width:100%;
	height: 250px;
}
.charts .el-table thead tr{
	background-color: #f5f7fa;
}
.charts .el-tabs__nav{
	z-index: 0;
}
</style>
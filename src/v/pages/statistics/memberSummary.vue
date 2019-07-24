<template>
	<div class="contents">
		<page-title :title="'客户分析'"></page-title>
		<time-frame @confirm='getSelectTime' :ceLoading="isLoading"></time-frame>
		<div v-loading="isLoading">
			<div class="charts">
		<!-- 	<div class="chartsNav">客户注册量</div>
			<div class="chartBox" id="lineChart"></div> -->
			<el-tabs v-model="activeName" type="border-card">
				<el-tab-pane label="客户注册量" name="first"></el-tab-pane>
				<div class="chartBox" id="lineChart"></div>
			</el-tabs>
		</div>
		<div class="charts">
			<!-- <div class="chartsNav">客户分组分布图</div>
				<div class="chartBox" id="pieChart"></div> -->
				<el-tabs v-model="activeName" type="border-card">
					<el-tab-pane label="客户分组分布图" name="first"></el-tab-pane>
					<div class="chartBox" id="pieChart">暂无数据</div>
				</el-tabs>
			</div>
		</div>

	</div>
</template>
<script>
	import pageTitle from '@components/pageTitle';
	import timeFrame from './components/timeFrame';
	import chartsConfig from './components/chartsConfig';
	import echarts from 'echarts';
	export default {
		data() {
			return{
				isLoading:false,
				activeName:''
			}
		},
		mounted() {
			// this.setChart(msg);
		},
		methods: {
			getSelectTime(msg){
				this.setChart(msg);
			},
			setChart(msg){
				this.isLoading = true;
				// 获取客户注册量
				let lineX = chartsConfig.lineOption.xAxis[0].data = [];
				let lineY = chartsConfig.lineOption.series[0].data = [];
				let promise01 = this.$api("memberSummary.getMemberRegistrationAmount", {start:msg.timeStart,end:msg.timeEnd}).then((result) => {
					for(var key in result){
						lineX.push(key);
						lineY.push(result[key]);
					}
					chartsConfig.lineOption.color[0] = '#ebe180';
					chartsConfig.lineOption.series[0].lineStyle.normal.color = '#b8eee1';
					let lineDom = document.getElementById('lineChart');
					let lineChart = echarts.init(lineDom);
					lineChart.setOption(chartsConfig.lineOption);
				}, (result)=>{
					this.$message({
						message: result.data.msg,
						type: 'error'
					});
				})

				// 获取客户分组分布数据
				let pieLegend = chartsConfig.pieOption.legend.data = [];
				let pieSerie = chartsConfig.pieOption.series[0].data = [];
            	let promise02 = this.$api("memberSummary.getMemberGradeDistribution", {start:msg.timeStart,end:msg.timeEnd}).then((result) => {
            		console.log(result);
            		result.levelList.forEach(function(item,index){
            			pieLegend.push(item.name);
            			pieSerie.push({
            				value:result.pieChart[item.id],
            				name:item.name
            			})
            		})
					let pieDom = document.getElementById('pieChart');
					let pieChart = echarts.init(pieDom);
					pieChart.setOption(chartsConfig.pieOption);
				}, (result)=>{
					if(result.data.status == "102"){

					}else{
						this.$message({
							message: result.data.msg,
							type: 'error'
						});
					}

				})

				// 加载状态
				let that = this;
				Promise.all([promise01,promise02]).then(function(msg){
					that.isLoading = false;
				}).catch(function(msg){
					that.isLoading = false;
				})
			}
		},
		components: {
			pageTitle,
			timeFrame
		}
	}
</script>
<style>
	.charts{
	    margin-top: 27px;
	}
	.chartsNav{
		border-bottom: 1px solid #dfdfdf;
		height: 39px;
		line-height: 39px;
		background-color: #f5f7fa;
		padding-left:18px;
	}
	.chartBox{
		width:100%;
		height: 250px;
		text-align: center;
		color: #999;
	}
</style>
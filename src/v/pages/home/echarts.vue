<template>
<span>
	<div id="echarts" style='width：100%;height:100%'></div>
</span>
</template>

<script>
	import echarts from 'echarts';
	export default {
		data() {
			return {
				chart:'',

				lineOption : {//线图
					title: { show:false },
					tooltip: {trigger:'axis'},
					yAxis : {},
					grid: {
			        	top: '10',
			        	left: '10',
			        	right: '40',
			        	bottom: '10',
			        	containLabel: true
			        },
		            xAxis : {
		            	boundaryGap : false,
			        	data :[]
			        },
			        series : []
			    },
			    chartData:{
			    	ddxaxis:[],
			    	dddata:[]
			    }
			}
		},
		mounted() {
			this.chart = echarts.init(document.getElementById('echarts'))
			// if(this.type=='line'){
			// 	this.setLineChart()
			// }
		},
		watch: {
            dddata(v,ov) {
            	let xaxis = []
				let dd1 = {
						name:'已付款',
						color:'#f39661',
						area:'#ffebe2',
						data:[]
					}
				let dd2 = {
						name:'已发货',
						color:'#3cb6ef',
						area:'#d7f0fb',
						data:[]
					}
				v.forEach( (el, index) => {
					xaxis.push(el.date)
					dd1.data.push(el.paid)
					dd2.data.push(el.delivery)
				});
				this.chartData.ddxaxis = xaxis
				this.chartData.dddata.push(dd1)
				this.chartData.dddata.push(dd2)
            	if(this.type=='line'){
					this.setLineChart()
				}
            },
        },
		methods: {
			setLineChart(){
				this.lineOption.xAxis.data = this.chartData.ddxaxis
				this.chartData.dddata.forEach( (el, index) => {
					this.lineOption.series.push({
			        	name: el.name,
			        	type: 'line',
			        	smooth: true,
			        	itemStyle:{
			        		normal:{
			        			color:el.color,
					        	areaStyle:{color:el.area},
			        		}
			        	},
			        	data: el.data
					})
				});
				this.chart.setOption(this.lineOption);
			}
		},
		props: ['type','dddata'],
		components:{

        }
	}
</script>
<style>
.upload .el-upload-list{height: 335px; overflow-y:auto }
.upload .el-upload-list--picture .el-upload-list__item{width: 100px; height: 100px; border:1px solid #eee;
	float: left;
	box-sizing:border-box; margin:10px; overflow: hidden;
	padding: 0;
	position: relative;
}
.upload .el-upload-list--picture .el-upload-list__item:nth-child(5n+1){margin-left:0;}
.upload .el-upload-list--picture .el-upload-list__item:nth-child(5n){margin-right:0;}
.upload .el-upload-list--picture .el-upload-list__item-thumbnail{
	margin: 0;
    width: auto;
    height: auto;
	max-width: 100%;
	max-height: 100%;
	position: absolute;
	top: 50%;
	left: 50%;
	-webkit-transform: translate(-50%,-50%);
      	-ms-transform: translate(-50%,-50%);
          	transform: translate(-50%,-50%);
}
.upload .el-upload-list__item-name{display: none}
.upload .el-upload-list--picture .el-upload-list__item-status-label{
	z-index: 9
}
.upload .el-upload-list__item .el-icon-close{z-index: 9;}
.popContent .imgList span .label-img-check .el-icon-check {
	color: #fff;
	font-size: 12px;
    margin-top: 12px;
    -webkit-transform: rotate(-45deg);
    transform: rotate(-45deg);
}
.popContent .imgList span .el-icon-close {
	display: none;
    position: absolute;
    top: 5px;
    right: 5px;
    cursor: pointer;
    opacity: .75;
    color: #606266;
}
.popContent .imgList span:hover .el-icon-close {
	display: block;
}
</style>
<style scoped>
.popContent{height: 400px; overflow-y: auto }
.imgList{
	overflow-y: auto;
	height: 360px;
}
.nodata{line-height: 200px; text-align: center; color: #999}
.imgList span{
	border-radius:6px;
	display: inline-block;
	box-sizing:border-box;
	border:1px solid #ddd;
	float: left;
	width: 100px;
	height: 100px;
	margin:10px;
	overflow: hidden;
	position: relative;
}
.imgList span .label-img-check {
	position: absolute;
    right: -17px;
    top: -7px;
    width: 46px;
    height: 26px;
    background: #13ce66;
    text-align: center;
    -webkit-transform: rotate(45deg);
    transform: rotate(45deg);
    -webkit-box-shadow: 0 1px 1px #ccc;
    box-shadow: 0 1px 1px #ccc;
}
.internetImgList span:hover .label-img-check {
	display: none;
}
.imgList span:nth-child(5n+1){margin-left: 0}
.imgList span:nth-child(5n){margin-right: 0}
.imgList span img{
	max-width: 100%;
	max-height: 100%;
	position: absolute;
	top: 50%;
	left: 50%;
	-webkit-transform: translate(-50%,-50%);
      	-ms-transform: translate(-50%,-50%);
          	transform: translate(-50%,-50%);
}
</style>
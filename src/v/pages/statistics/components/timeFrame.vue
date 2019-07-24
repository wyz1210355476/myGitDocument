<template>
	<div class="time-frame">
		<span>时间范围：</span>
		<el-date-picker
		v-model="timeFrame.timeStart"
		type="date"
		placeholder="选择日期"
		size='small'
		class='date-picker-width'
		style='width:135px;'>
		</el-date-picker>
		<span>至</span>
		<el-date-picker
		v-model="timeFrame.timeEnd"
		type="date"
		placeholder="选择日期"
		size='small'
		style='width:135px;margin-right:10px'>
		</el-date-picker>
		<el-button size="mini" @click="timeVal('confirm')" :class="{selected:isSelected.confirm}">确定</el-button>
		<el-button size="mini" @click="timeVal('yesterday')" :class="{selected:isSelected.yesterday}">昨日</el-button>
		<el-button size="mini" @click="timeVal('today')" :class="{selected:isSelected.today}">今日</el-button>
		<el-button size="mini" @click="timeVal('thisWeek')" :class="{selected:isSelected.thisWeek}">本周</el-button>
		<el-button size="mini" @click="timeVal('lastWeek')" :class="{selected:isSelected.lastWeek}">上周</el-button>
		<el-button size="mini" @click="timeVal('thisMonth')" :class="{selected:isSelected.thisMonth}">本月</el-button>
		<el-button size="mini" @click="timeVal('lastMonth')" :class="{selected:isSelected.lastMonth}">上月</el-button>
		<div class="shadow" v-show="ceLoading"></div>
	</div>
</template>
<script>
	import router from '@c/router';
	export default {
		data() {
			return {
				timeFrame:{
					timeStart:"",
					timeEnd:""
				},
				isSelected:{
					confirm:false,
					yesterday:false,
					today:false,
					thisWeek:true,
					lastWeek:false,
					thisMonth:false,
					lastMonth:false
				}
			}
		},
		methods:{
			timeVal(val){
				//初始化快速日期选择的日期
				let todayDate = new Date(),//今日
				yesterdayDate = new Date(new Date().setDate(todayDate.getDate()-1)),//昨日

				thisDay = todayDate.getDay() == 0 ? 7 : todayDate.getDay(),//本周当前天（周几）

				thisWeekFirstDayDate = new Date(todayDate-(thisDay-1)*86400000),//本周第一天

				lastWeekFirstDayDate = new Date(thisWeekFirstDayDate-7*86400000),//上周第一天
				lastWeekLastDayDate = new Date(thisWeekFirstDayDate-86400000),//上周最后一天

				thisMonthFirstDayDate = new Date(new Date().setDate(1)),//本月第一天

				lastMonthFirstDayDate = new Date(new Date(thisMonthFirstDayDate).setMonth(todayDate.getMonth()-1)),//上个月第一天
				lastMonthLastDayDate = new Date(new Date().setDate(0));//上个月最后一天

				switch(val){
					case 'confirm':
						if (this.timeFrame.timeStart > this.timeFrame.timeEnd) {
							this.$message({
								type: 'error',
								message: '起始时间不能大于结束时间'
							});
							return;
						}else if((this.timeFrame.timeEnd-this.timeFrame.timeStart)/86400000 > 365){
							this.$message({
								type: 'error',
								message: '时间范围不能超过一年'
							});
							return;
						}
					break;
					case 'yesterday':
						this.timeFrame.timeStart = yesterdayDate;
						this.timeFrame.timeEnd = yesterdayDate;
					break;
					case 'today':
						this.timeFrame.timeStart = todayDate;
						this.timeFrame.timeEnd = todayDate;
					break;
					case 'thisWeek':
						this.timeFrame.timeStart = thisWeekFirstDayDate;
						this.timeFrame.timeEnd = todayDate;
					break;
					case 'lastWeek':
						this.timeFrame.timeStart = lastWeekFirstDayDate;
						this.timeFrame.timeEnd = lastWeekLastDayDate;
					break;
					case 'thisMonth':
						this.timeFrame.timeStart = thisMonthFirstDayDate;
						this.timeFrame.timeEnd = todayDate;
					break;
					case 'lastMonth':
						this.timeFrame.timeStart = lastMonthFirstDayDate;
						this.timeFrame.timeEnd = lastMonthLastDayDate;
					break;
				}
				//按钮选中状态
				for(let btn in this.isSelected){
					if(btn === val){
						this.isSelected[btn] = true
					}else{
						this.isSelected[btn] = false
					}
				}
				// 把开始和结束时间转为日期字符串格式
				let timeFrameObj = {
					timeStart: this.timeFrame.timeStart.toLocaleDateString(),
					timeEnd: this.timeFrame.timeEnd.toLocaleDateString()
				}
				this.$emit('confirm', timeFrameObj);
			}
		},
		mounted(){
			//默认本周
			this.timeVal('thisWeek');
		},
		props: ['ceLoading']
	}
</script>
<style>
.time-frame{line-height: 24px; padding: 10px; background-color: #f5f7fa;position: relative;}
.selected{
	color: #409eff;
    border-color: #c6e2ff;
    background-color: #ecf5ff;
}
.shadow{
	background-color: rgba(0, 0, 0, 0);
	position: absolute;
	width: 100%;
	left: 0;
	height: 52px;
	top:0;
}
</style>
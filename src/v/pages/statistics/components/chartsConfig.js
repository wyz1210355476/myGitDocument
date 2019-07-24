export default {
	lineOption : {//线图
		title: {
			text: ''
		},
		tooltip : {
			trigger: 'axis'
		},
        // legend: {
        //     data:['邮件营销','联盟广告','视频广告','直接访问','搜索引擎']
        // },
        toolbox: {
        	feature: {
        		saveAsImage: {}
        	}
        },
        grid: {
        	left: '3%',
        	right: '4%',
        	bottom: '3%',
        	containLabel: true
        },
        color:["#ebe180"],
        xAxis : [
        {
        	type : 'category',
        	boundaryGap : false,
        	data :[]
        }
        ],
        yAxis : [
        {
        	type : 'value'
        }
        ],
        series : [
        {
        	name:'',
        	type:'line',
        	smooth: true,
        	markPoint:{
        		symbol:'circle'
        	},
        	lineStyle:{
        		normal:{
        			color:"#b8eee1"
        		}
        	},
        	stack: false,
        	data:[]
        }
        ]
    },
    pieOption : {//饼图
    	tooltip: {
    		trigger: 'item',
    		formatter: "{a} <br/>{b}: {c} ({d}%)"
    	},
    	legend: {
    		orient: 'vertical',
    		x: 'left',
    		left: '25%',
    		y:'top',
    		top:'10%',
    		itemWidth:13,
    		itemHeight:13,
    		data:[],
    	},
    	series: [
    	{
    		name:'访问来源',
    		type:'pie',
    		radius: ['50%', '70%'],
    		center:['12%','50%'],
    		avoidLabelOverlap: false,
    		label: {
    			normal: {
    				show: false,
    				position: 'center'
    			},
    			emphasis: {
    				show: true,
    				textStyle: {
    					fontSize: '30',
    					fontWeight: 'bold'
    				}
    			}
    		},
    		labelLine: {
    			normal: {
    				show: false
    			}
    		},
    		data:[],
    	}
    	]
    }
}
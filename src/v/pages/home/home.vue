<template>
	<div class="homeCon">
		<div class="appInfo home-moudel" v-if="isHasTOKEN">
			<div class="appList">
				<span class="appBtn" @click="toggleApp">切换</span>
				<div class="app">
					<div class="web" :title="nowSite.domain">
						({{nowSite.trade=='Foreign_Trade'?'外贸':'内贸'}}){{nowSite.domain}}<span class="version">{{nowSite.language}}</span>
						<i class="el-icon-caret-bottom" style="cursor:pointer" @click="toggleApp"></i>
					</div>
					<div class="appCon" ref='applist' v-if="showAppList">
						<div class="web" :class="{'active':item.tenantId == nowSite.tenantId}" :title="item.domain" v-for="item in $siteList" @click="switchSite(item)" :key="item.id">({{item.trade=='Foreign_Trade'?'外贸':'内贸'}}){{item.domain}}<span class="version">{{item.language}}</span></div>
					</div>
				</div>

			</div>
			<div class="appPrompt floatL">
				<p class="warning" v-if="checkSta(nowSite.status,'showDate')"><i class="el-icon-warning"></i>产品服务周期：{{nowSite.startTime | formatDate('yyyy-MM-dd')}} - {{nowSite.endTime | formatDate('yyyy-MM-dd')}}（剩余{{nowSite.remainingDays}}天）</p>
				<p>{{checkSta(nowSite.status,'prompt')}}</p>
			</div>
			<div class="appOperate">
				<span v-if="[6,7,11,'6','7','11'].indexOf(nowSite.status)>-1">
				<!-- <span class="appBtn sxBtn" @click="toSiteSet" v-if="nowSite.status=='1'">域名绑定</span> -->
				<span class="appBtn sxBtn" @click="toSiteSet" v-if="nowSite.status=='11'">立即上线</span>
				<span class="appBtn sxBtn" @click="toSiteSet" v-if="nowSite.status=='6'">暂停运行</span>
				<span class="appBtn sxBtn" @click="toSiteSet" v-if="nowSite.status=='7'">开启运行</span>
				</span>
				<span class="appBtn xfBtn" @click="toRenew">续费</span>
			</div>
		</div>
		<div class="homeleft">
			<div class="zd pc home-moudel">
				<span class="status" :class="checkSta(siteInfo.status,'class')">{{checkSta(siteInfo.status,'label')}}</span>
				<div class="zdicon"></div>
				<div class="zdinfo">
					<h2>PC站</h2>
					<p :title="siteInfo.domain">{{siteInfo.domain}}</p>
				</div>
			</div>
			<div class="zd mb home-moudel" v-if="siteInfo.hasMo">
				<span class="status" :class="checkSta(siteInfo.mobileStatus,'class')">{{checkSta(siteInfo.mobileStatus,'label')}}</span>
				<div class="zdicon" :class="{'showewm':showmpqr}">
					<qrcode class="qrcode" v-if="siteInfo.mobileDomain!=''" :value="'http://'+siteInfo.mobileDomain" :options="{ size: 80 }"></qrcode>
				</div>
				<div class="zdinfo">
					<h2>移动站<i class="showqr" @mouseover="showmpqr = true" @mouseleave="showmpqr = false"></i></h2>
					<p :title="siteInfo.mobileDomain">{{siteInfo.mobileDomain}}</p>
				</div>
			</div>
			<div class="ywcl home-moudel">
				<h1 class="title">业务处理</h1>
				<div class="ywcon">
					<div class="yw">
						<i class="dfk"></i>
						<span>{{ywcl.paid}}</span>
						<p>待付款</p>
					</div>
					<div class="yw">
						<i class="dfh"></i>
						<span>{{ywcl.delivery}}</span>
						<p>待发货</p>
					</div>
					<div class="yw">
						<i class="ywc"></i>
						<span>{{ywcl.complete}}</span>
						<p>已完成</p>
					</div>
				</div>
			</div>
			<div class="fwqk home-moudel">
				<h1 class="title">网站访问情况</h1>
				<el-table :data="fwqk" style="width: 100%" size="mini" height="120">
			    	<el-table-column prop="name" label=" " ></el-table-column>
			    	<el-table-column prop="pv" label="浏览量（PV）" align="center"></el-table-column>
			    	<el-table-column prop="uv" label="访客数（UV）" align="center"></el-table-column>
			    	<el-table-column prop="ip" label="独立IP（IP）" align="center"></el-table-column>
			    </el-table>
			</div>
		</div>
		<div class="homeright">
			<div class="ddqs home-moudel">
				<h1 class="title">订单趋势</h1>
				<div class="ddcon">
					<div class="ddtitle">
						<span>最近7日流量趋势</span>
						<span class="floatR ml20"><i class="dot prompt"></i>已发货：{{yfh}}</span>
						<span class="floatR"><i class="dot warning"></i>已付款：{{yfk}}</span>
					</div>
					<div class="ddchart" id="ddchart">
						<echarts type="line" :dddata="chartData"></echarts>
					</div>
				</div>
			</div>
			<div class="xsph home-moudel">
				<h1 class="title">商品销售排行</h1>
				<div class="xscon">
					<div class="ddtitle">
						<span>最近7日销量趋势</span>
						<el-radio-group v-model="xsType" class="floatR noradio" size="small" @change="getXsData()">
							<el-radio label="1">按销量</el-radio>
							<el-radio label="2">按金额</el-radio>
						</el-radio-group>
					</div>
					<div style="height:246px; overflow:hidden">
						<el-table :data="xldata" style="width: 100%" size="mini" class="table-one-line" height="235px">
							<el-table-column type="index" label="排名" width="50" align="center"></el-table-column>
					    	<el-table-column prop="name" label="商品名称" width="200">
					    		<template slot-scope="scope">
					    			<span class="one-line">{{scope.row.name}}</span>
					    		</template>
					    	</el-table-column>
					    	<el-table-column prop="total" :label="xsType=='1'?'数量':'金额'" align="center" width="100"></el-table-column>
					    	<el-table-column label=" ">
					    		<template slot-scope="scope">
					    			<div :style="{width:scope.row.bar}">
					    				<span :class="{'xlbar':scope.row.bar!=''}"></span>
					    			</div>
					    		</template>
					    	</el-table-column>
					    </el-table>
					</div>
				</div>
			</div>
		</div>

	</div>
</template>
<script>
	import echarts from './echarts';
	import Qrcode from '@xkeshi/vue-qrcode';
	import Vue from 'vue';
	export default {
		data() {
			return {
				siteInfo:{},
				showAppList:false,
				showmpqr:false,
				xsType:'1',
				nowSite:{},
				ywcl:{
					paid:0,
					delivery:0,
					complete:0
				},
				ddqsData:[],
				fwqk:[
					{name:'昨日',pv:0,uv:0,ip:0},
					{name:'过去30天',pv:0,uv:0,ip:0}
				],
				chartData:[],
				xldata:[],
				yfh:0,
				yfk:0,
				isHasTOKEN:true
		    }
		},
		mounted() {
			//判断是否是从设计器进入的后台网站
			this.isHasTOKEN = !sessionStorage.getItem("token");
			document.domain = 'yun300.cn'
			if(this.$siteList.length == 0){
				this.$router.push({path:'/nosite'})
				return
			}
			this.nowSite = Vue.prototype.$nowSite
			this.getNowSite()
			this.getXsData()
			this.getYwcl()
			this.getDdqs()
			this.getSite()
			this.getVisitInfo()
		},
		methods: {
			//请求网站列表并获取当前网站
			getNowSite(){
				this.$api("home.getSiteList").then((result) => {
					//获取当前网站
					let site = result.list.find((n)=>n.tenantId == this.nowSite.tenantId)
					if(site){
						Vue.prototype.$nowSite = site
						this.nowSite.status = site.status
						console.log(this.nowSite)
					}
				}, (error) => {})
			},
			toSiteSet(){
				let wzsz = this.$menu.find((n) => n.name == '网站设置')
				if(wzsz){
					this.$router.push({path:'/iframe',query:{iframe:wzsz.url,hash:'#tagType=6'}})
				}
			},
			getArea(val){
				console.log(val)
			},
			checkSta(val=0,key){
				val = val.toString()
				let message
				switch(val){
					case '1':
						message = {
							label:'建设中',
							class:'jsz',
							prompt:'您的电商门户正在建设中，稍后精彩即将呈现 ....',
							showDate:false
						}
						break
					case '6':
						message = {
							label:'运行中',
							class:'ykt',
							prompt:'',
							showDate:true
						}
						break
					case '7':
						message = {
							label:'已暂停',
							class:'yzt',
							prompt:'',
							showDate:true
						}
						break
					case '9':
						message = {
							label:'已过期',
							class:'ygq',
							prompt:'您的产品因过期已关停，关停期间前台无法正常访问，管理后台可正常使用，续费开通流程请致电400-660-5555！',
							showDate:true
						}
						break
					case '11':
						message = {
							label:'建设中',
							class:'jsz',
							prompt:'您的电商门户已准备就绪，请执行上线操作 ....',
							showDate:false
						}
						break
					case '77':
						message = {
							label:'已关停',
							class:'ygt',
							prompt:'您的产品已被关停，关停期间前台无法正常访问，管理后台可正常使用，了解关停原因及开通流程请致电400-660-5555！',
							showDate:true
						}
						break
					default:
						message = {
							label:'建设中',
							class:'jsz',
							prompt:'您的电商门户正在建设中，稍后精彩即将呈现 ....',
							showDate:false
						}
				}
				return message[key]
			},
			//点击续费按钮
			toRenew(){
				if(window.top!=window){
					console.log('vue中点击续费')
					parent.toRenew()
				}else{
					console.log('需要嵌到会员中心点击')
				}
			},
			//点击切换网站按钮
			toggleApp(){
				this.showAppList = !this.showAppList
				document.addEventListener('click', (e) => {
					if (this.$refs.applist && !this.$refs.applist.contains(e.target)) {
		               this.showAppList = false
		            }
				}, false)
			},
			//获取商品销售排行数据
			getXsData(){
				this.$api("home.getXsph",{type:this.xsType}).then((result) => {
					if(result && result.length>0){
						let max = Number(result[0].total)
						result.forEach( (el, index) => {
							if((Number(el.total)/max*100) > 0 && (Number(el.total)/max*100) < 1){
								el.bar = '1%'
							}else if((Number(el.total)/max*100) > 100){
								el.bar = '100%'
							}else{
								el.bar = parseInt(Number(el.total) / max * 100) + '%'
							}
						});
						this.xldata = result
					}
				}, (error) => {
					if(error.data.status!=102){
						this.$message({ message: '查询商品销售排行出错', type: 'error' });
					}
				});
			},
			//获取业务处理数据
			getYwcl(){
				this.$api("home.getYwcl").then((result) => {
					this.ywcl = result
				}, (error) => {
					if(error.data.status!=102){
						this.$message({ message: '查询业务处理数据出错', type: 'error' });
					}
				});
			},
			//获取订单趋势数据
			getDdqs(){
				this.$api("home.getDdqs").then((result) => {
					this.chartData = result.list || []
					this.chartData.forEach( (el, index) => {
						this.yfh += Number(el.delivery)
						this.yfk += Number(el.paid)
					});
				}, (error) => {
					if(error.data.status!=102){
						this.$message({ message: '查询订单趋势出错', type: 'error' });
					}
				});
			},
			//获取当前网站数据信息
			getSite(){
				// if(!Vue.prototype.$siteInfo){
					this.$api("home.getSite",{siteTenantId:this.nowSite.tenantId}).then((result) => {
						this.siteInfo = result
						Vue.prototype.$siteInfo = result
					}, (error) => {
						this.$message({ message: '查询网站数据出错', type: 'error' });
					});
				// }else{
				// 	this.siteInfo = Vue.prototype.$siteInfo
				// }
			},
			//获取网站访问情况
			getVisitInfo(){
				this.$api("home.getVisitInfo",{siteTenantId:this.nowSite.tenantId}).then((result) => {
					this.fwqk.splice(0,1,{name:'昨日',pv:result.yestory.pvSum,uv:result.yestory.uvSum,ip:result.yestory.ipSum});
					this.fwqk.splice(1,1,{name:'过去30天',pv:result.last30Day.pvSum,uv:result.last30Day.uvSum,ip:result.last30Day.ipSum});
				}, (error) => {
					this.$message({ message: '查询网站访问情况出错', type: 'error' });
				});
			},
			//切换网站
			switchSite(item){
				this.showAppList = false
				if(item.tenantId == this.nowSite.tenantId){return}
				if(window.top!=window){
					let href = parent.location.href
					let xdm = href.indexOf("#")>-1 ? href.split("#")[1] : ''
					let uri = href.split("console/")[0] + 'console/'
					let parentUrl = uri + '?instanceCode=' +item.bossProductInstance + '#' + xdm
					parent.location.href = parentUrl
				}else{
					window.location.href = location.origin + location.pathname + '?tenantId='+item.tenantId
				}
			},
		},
		components: {
			echarts,
			Qrcode,
		}
	}
</script>
<style>
.noradio .el-radio__input{display: none}
.noradio .el-radio__label{padding-left: 0; line-height: 30px; font-size: 12px}
.noradio .el-radio+.el-radio{margin-left: 20px}
</style>
<style scoped>
.homeCon{overflow: hidden; padding:10px; padding-right:0}
.homeleft{float: left; width: 480px; padding: 5px; box-sizing:border-box;}
.homeright{overflow: hidden; padding: 5px; padding-left: 10px}

.home-moudel{background: #fff; box-shadow: 0px 0px 3px #ddd; margin-bottom: 15px;}
.home-moudel h1.title{font-size: 14px; color:#333; margin:0; margin-bottom: 5px}

.ddqs,.xsph,.ywcl,.fwqk{padding: 20px;}

.dot{ display: inline-block; background: #333; width: 8px; height: 8px; margin-top: -3px; border-radius: 999px; vertical-align: middle; margin-right: 5px}
.success{color: #2cc878}
.success .dot,.dot.success{background: #2cc878}
.error{color: #f64946}
.error .dot,.dot.error{background: #f64946}
.warning{color: #ff8b00}
.warning .dot,.dot.warning{background: #ff8b00}
.prompt{color: #3cb6ef}
.prompt .dot,.dot.prompt{background: #3cb6ef}

.zd{height: 186px; background-position:20px center; background-repeat: no-repeat; position: relative; overflow: hidden;}
.zd .status{position: absolute; width:100px; line-height: 40px; text-align: center; color: #fff; transform: rotate(45deg); right: -34px; top:-8px; padding-top: 10px; overflow: hidden;}

.zd .status.ykt{background: #2cc878}
.zd .status.ygq{background: #b1b1b1}
.zd .status.yzt{background: #f64946}
.zd .status.ygt{background: #c93532}
.zd .status.jsz{background: #ff8b00}

.zd.pc{background-image:url('../../common/images/pcBg.png');}
.zd.mb{background-image:url('../../common/images/mbBg.png');}
.zd .zdicon{width: 80px; height: 80px; position: absolute; left: 60px; top: 53px; overflow: hidden;}
.zd .zdicon .qrcode{width: 100%; height: 100%; position: absolute; left: 0; top: -100%; transition: all 0.2s}
.zd .zdicon.showewm .qrcode{top: 0}
.zd.pc .zdicon{background-image: url('../../common/images/pcIcon.png');}
.zd.mb .zdicon{background-image: url('../../common/images/mbIcon.png');}
.zdinfo{position: absolute; right: 20px; top: 58px; height: 70px; width: 220px}
.zd h2{margin:0; font-weight: normal; font-size: 18px; line-height:100%; padding-top: 17px}
.zd h2 span{margin-left: 5px; background: #c0d7ff; color:#fff; padding: 0 2px; border-radius: 4px}
.zd p{margin:0; line-height:100%; padding-top: 10px; overflow: hidden; text-overflow:ellipsis; white-space: nowrap;}
.zd .showqr{display:inline-block; width: 20px; height: 20px; margin-left: 5px; vertical-align: middle; margin-top: -4px; background: url(../../common/images/ewm.png) no-repeat center;}
.zd .qr{position: absolute; width: 100%; height: 100%; top: -100%; right: -100%; background: #fff; z-index: 99; transition: all 0.2s;}
.zd .qr img{width: 200px; margin:60px auto; display: block;}
.zd .qr.show{top:0; right: 0;}

.ddtitle{border-bottom: 1px solid #f4f4f4; line-height: 30px; margin-bottom: 20px}
.ddchart{height: 268px;}


.ywcon{display: flex;}
.ywcon .yw{flex: 1; margin:5px; border:1px solid #f4f4f4; border-top:none; position: relative; padding:20px 0}
.ywcon .yw:first-child{margin-left: 0}
.ywcon .yw:last-child{margin-right: 0}
.ywcon .yw i{float: left; display: inline-block; width:40px; height: 40px; margin:0px 10px 0 15px; background-size: 100%; background-repeat: no-repeat;}
.ywcon .yw .dfh{background-image: url(../../common/images/dfh.png);}
.ywcon .yw .dfk{background-image: url(../../common/images/dfk.png);}
.ywcon .yw .ywc{background-image: url(../../common/images/ywc.png);}
.ywcon .yw p{margin:0; color: #bbb}
.ywcon .yw span{font-size: 24px; line-height: 100%}

.xlbar{display: inline-block; height: 10px; background-color: #4daaf0; width: 100%; animation: barlength 1s; }
@keyframes barlength{ from {width: 0%} to {width: 100%} }

.appBtn{display:inline-block; padding: 0 20px;  background: #ddeefe; cursor: pointer;}
.appInfo{padding: 20px 200px 20px 420px; height:50px; margin:5px 5px 10px; font-size:14px; position: relative;}
.appInfo .appOperate{position: absolute; right: 20px; top: 20px; line-height: 50px}
.appInfo .appOperate .xfBtn{background:#fc361c; color: #fff }
.appInfo .appOperate .sxBtn{background:#f5f5f5; border:1px solid #e8e8e8; color:#3cb6ef;  box-sizing:border-box}

.appInfo .appList{line-height: 50px; margin-right: 80px; position: absolute; left: 20px;}
.appList .appBtn{width: 80px; padding:0; text-align: center;}
.appList .app{background: #f2f2f2; color: #000859; position: absolute; left: 82px; top: 0px; width: 300px; z-index: 9}
.app .web{height:50px; overflow: hidden; text-overflow:ellipsis; white-space: nowrap; padding-right: 90px; position: relative; padding-left: 20px}
.web .version{background: #9ed0f5; color: #fff; padding:3px 5px; border-radius: 99px; position: absolute; right: 40px; line-height: 100%; top: 16px}
.web i{position: absolute; right:20px; top: 18px;}
.appCon {max-height: 200px; overflow-y:auto;}
.appCon .web{border-top: 1px solid #fff; cursor: pointer; padding-right: 70px; box-sizing:border-box;}
.appCon .web:hover{background: #ddd}
.appCon .web.active{background: #ddd}
.appCon .web .version{right: 20px;}


.appInfo .appPrompt{font-size: 12px; line-height: 25px;}
.appInfo .appPrompt p{margin:0; padding-left: 20px; position:relative; overflow: hidden;}
.appInfo .appPrompt p i {position: absolute; left: 0; top: 7px}

</style>

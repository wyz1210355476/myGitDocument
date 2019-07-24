<template>
	<div class="contents" v-loading="loading">
		<page-title :title="'订单满减'" goback></page-title>
		<el-steps class="steps" :active="steps" simple finish-status="success" process-status="finish">
			<el-step :title="item.label" v-for="item in stepsData" :key="item.id"></el-step>
		</el-steps>
		<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px" size="small" v-show="steps == 0">
			<el-form-item label="折扣活动名称："  prop="name">
			    <el-input v-model="ruleForm.name" placeholder="请输入活动名称" class="formInput"></el-input>
			    <span class="formPrompt">最长30个字，只在后台活动列表中显示</span>
		    </el-form-item>
		    <el-form-item label="活动开始时间：" prop="startDate">
		      	<el-date-picker type="datetime" placeholder="自定义开始时间" class="formInput" v-model="ruleForm.startDate" @change="getEndDate"></el-date-picker>
		      	<span class="formPrompt">自定义开始时间</span>
		    </el-form-item>
		    <el-form-item label="活动结束时间：" prop="endDate">
		      	<el-date-picker type="datetime" placeholder="自定义结束时间" class="formInput" v-model="ruleForm.endDate" ></el-date-picker>
		      	<span class="formPrompt">自定义结束时间</span>
		 	</el-form-item>
		  	<el-form-item label="活动标签：" prop="label">
		    	<el-select v-model="ruleForm.label" placeholder="请选择活动区域" class="formInput">
		      		<el-option :key="item.id" :label="item.lname|specCharacter" :value="item.id|tranString" v-for="item in labelData"></el-option>
		      		<el-option value="custom" label="-自定义-" ></el-option>
		    	</el-select>
		    	<el-input v-model="customLabel" class="formInput-short" v-if="ruleForm.label=='custom'"></el-input>
		    	<span class="formPrompt">最长30个字，在商品详情页的价格旁显示</span>
		  	</el-form-item>
			<el-form-item label="规则说明：" prop="rule_declaration">
				<el-input
					type="textarea"
					:rows="2"
					placeholder="请输入内容"
					v-model="ruleForm.rule_declaration"
					class="areaWidth"
				>
				</el-input>
			</el-form-item>
		</el-form>
		<el-form :model="goods" label-width="140px" size="small" v-show="steps == 1">
		  	<el-form-item label="活动商品：" prop="ruleType">
				<el-radio class="radio" v-model="goods.type" label="allGoods">
					<el-button type="text" size="small">全部商品</el-button>
				</el-radio>
		  		<el-radio class="radio" v-model="goods.type" label="goods">
		  			<select-product :selectids="selectids" :button="'text'" @change="getSelect" :resets='resets' :orderSkuId="orderSkuId"></select-product>
		  		</el-radio>
		  		<el-radio class="radio" v-model="goods.type" label="category">
		  			<select-category :catids="catids" @change="getCategory" button="text"></select-category>
		  		</el-radio>
		  	</el-form-item>
		</el-form>
		<el-form label-width="140px" size="small" v-show="steps == 2">
		  	<el-form-item label="规则类型：">
		  		<div class="cuttype">
					<el-radio class="radio" v-model="ruleForm.proc" label="4">减价</el-radio>
			  		<el-radio class="radio" v-model="ruleForm.proc" label="3">打折</el-radio>
			  		<el-radio class="radio" v-model="ruleForm.proc" label="2">免运费</el-radio>
				</div>
			</el-form-item>
			<el-form-item label="规则详情：">
				<!-- ////////////////////////////////减价///////////////////////////////////// -->
				<div class='cutrull' v-if="ruleForm.proc == '4'">
					<div class="cutrulltitle">
						<el-button size="mini" @click="newCut('4')">新建规则</el-button>
						<span class="formPrompt">最多只能有5条规则</span>
					</div>
					<div class="cutrullLi" v-for="(item,index) in cutrull" :key="item.id">
					    <p>单笔购买满
					    	<el-input v-model="item.rulePrice" size="mini" class="smallinput"></el-input>元时
					    	<el-button size="mini" @click="delCut('4',index)">删除</el-button>
					    </p>
					    <p>
					    	减<el-input v-model="item.ruleVal" size="mini" class="smallinput"></el-input>元
					    </p>
					</div>
				</div>
				<!-- ////////////////////////////////折扣///////////////////////////////////// -->
		  		<div class='cutrull' v-if="ruleForm.proc == '3'">
					<div class="cutrulltitle">
						<el-button size="mini" @click="newCut('3')">新建规则</el-button>
						<span class="formPrompt">最多只能有5条规则</span>
					</div>
					<div class="cutrullLi" v-for="(item,index) in discountRull" :key="item.id">
					    <p>单笔购买满
					    	<el-input v-model="item.rulePrice" size="mini" class="smallinput"></el-input>元时
					    	<el-button size="mini" @click="delCut('3',index)">删除</el-button>
					    </p>
					    <!-- <p>
					    	<el-radio v-model="item.ruleType" label="4">减</el-radio>
					    	<el-input v-model="item.ruleCut" size="mini" class="smallinput"></el-input>元
					    </p> -->
					    <p>
					    	<!-- <el-radio v-model="item.ruleType" label="3">打</el-radio> -->
							打
					    	<el-input v-model="item.ruleVal" size="mini" class="smallinput"></el-input>折
					    	<span class="promptspan">(折扣大于0小于等于10)</span>
					    </p>
					</div>
				</div>
				<!-- //////////////////////////////////免运费/////////////////////////////////// -->
				<div class="discountrull" v-if="ruleForm.proc == '2'">
				    <p>单笔购买满<el-input v-model="rulePrice" size="mini" class="smallinput"></el-input>元减免，
				    不包含以下地区<select-area :areaids="barringRegion" @change="getArea"></select-area></p>
				    <p class="cutarea"><span v-for="item in barringRegion" :key="item.id">{{showArea(item)}}</span></p>
				</div>
		  	</el-form-item>
		</el-form>
		<div class="promotion_button">
		<el-button size="small" plain v-if="steps != 0" @click="prevStep()">上一步</el-button>
		<el-button size="small" plain v-if="steps != (stepsData.length-1)" @click="nextStep()">下一步</el-button>
		<el-button type="primary" v-if="steps == (stepsData.length-1)" size="small" @click="savePromtion('ruleForm')">保存</el-button>
		<!-- <el-button size="small"  @click="resetForm('ruleForm')">重置</el-button> -->
		</div>
	</div>

</template>
<script>
	import pageTitle from '@components/pageTitle';
	import * as utilFun from '@c/util/index.js';
	import * as vali from '@c/util/validator.js';
	import selectProduct from '@components/selectProduct';
	import selectArea from '@components/selectArea';
	import selectCategory from '@components/selectCategory';
	import * as countryData from '@c/util/metaTreeCountryData'
	var areaData = countryData.formatData2();
	export default {
		data() {
			var checkEndDate = (rule, value, callback) => {
		        if (this.ruleForm.startDate >= value) {
		          callback(new Error('活动结束时间要大于活动开始时间'));
		        } else {
		          callback();
		        }
			};
			var checkStartDate = (rule, value, callback) => {
				if(value < new Date(new Date().getTime()-2*60*1000)){
					callback(new Error('活动开始时间不能小于当前时间'));
				}else if(value > this.ruleForm.endDate){
					callback(new Error('活动开始时间不能大于活动结束时间'));
				}else{
					callback();
				}
			};
		    let now = new Date;
		    let dd = new Date;
			dd.setDate(dd.getDate()+7);
			return {
				loading:true,
				steps:0,
				stepsData:[
					{label:'设置折扣信息',id:1},
					{label:'设置活动商品',id:2},
					{label:'设置活动规则',id:3},
				],
				/*---------------------*/
				rulePrice:'',
				barringRegion:[],
				/*---------------------*/
				catids:[],
				pageCatids:[],
				/*---------------------*/
		        selectids:[],
		        pageSelectids:[],
		        resets:['reset'],
		        orderSkuId:[],
		        /*----------满减-----------*/
				cutrull:[
					{
						"ruleType": '4',
			            "rulePrice": '',
			            "ruleVal": '',
			            // "ruleCut": '',
			            // "ruleDiscount": ''
					}
				],
				/*-----------折扣----------*/
				discountRull:[
					{
						"ruleType": '3',
			            "rulePrice": '',
			            "ruleVal": '',
			            // "ruleDiscount": ''
					}
				],
				ruleForm: {
          			proType:2,
					name:'促销'+ Math.floor(Math.random()*9000+1000),
					startDate:now,
					endDate:dd,
					label:'',
					rule:'',
					rule_declaration:'',
					proc:'4'
        		},
        		ruleData:{
        			goods:'',
        			// proTemplate:'4',
        		},
        		goods:{
			        type:'goods',
			        ids:''
			    },

				labelData:[],
				customLabel:'',
				rules: {
		          name: [
		            { required: true, message: '请输入活动名称', trigger: 'blur' },
		            { min: 1, max: 30, message: '最长不能超过30个字符', trigger: 'blur' }
		          ],
		          startDate: [
					{ type: 'date', required: true, message: '请选择活动开始时间', trigger: 'change' },
					{ validator: checkStartDate , trigger: 'blur' }
		          ],
		          endDate: [
		            { type: 'date', required: true, message: '请选择活动结束时间', trigger: 'change' },
		            { validator: checkEndDate , trigger: 'blur' }
		          ],
		          label: [
					{ required: true, message: '请选择活动标签', trigger: 'change' }
				  ],
				  rule_declaration:[
					  { max: 100, message: '最长不能超过100个字符', trigger: 'blur' }
				  ]
		        },
			}
		},
		mounted() {
			this.getLabels();
			if(this.$route.query.id){
				this.id = this.$route.query.id
			}
		},
		filters:{
			tranString(val){
				return val.toString();
			}
		},
		methods: {
			// 上一步
			prevStep(){
				this.steps -= 1
			},
			// 下一步
			nextStep(){
				if(this.steps == 0){
					this.$refs.ruleForm.validate((valid) => {
			        	if (valid) {
				          	if(this.ruleForm.label == 'custom'){
				            	if(!this.customLabel.trim()){
				            		this.$message({ message: '请输入自定义活动标签', type: 'warning' }); return
				            	}
				            	if(this.customLabel.trim().length >30){
			            			this.$message({ message: '活动标签最长输入30个字符', type: 'warning'}); return
			            		}
				            }
				            this.steps += 1
				            console.log(this.ruleForm);
			        	}else{
			        		console.log('error validate');return
			        	}
			        });
				}else if(this.steps == 1){
					switch(this.goods.type){
						case 'goods':
							this.goods.ids = this.pageSelectids.join(',');
							break;
						case 'category':
							this.goods.ids = this.pageCatids.join(',');
							break;
						case 'allGoods':
							this.goods.ids = '';
							break;
					}
					// this.goods.ids = this.goods.type == 'goods' ? this.pageSelectids.join(',') : this.pageCatids.join(',')
					if((this.goods.type != 'allGoods' && this.goods.ids == '')){
		          		this.$message({ message: '请选择参与活动的商品或分类', type: 'warning' }); return
					  }
					this.ruleData.goods = this.goods
		          	this.steps += 1
				}
			},
			showArea(val){//根据地区id返回地区名称
				if(!this.area){
					this.area = {};
					for(let i in areaData){
						Object.assign(this.area,areaData[i])
					}
				}
				return this.area[val] || val
			},
			getEndDate(){//选择开始时间自动选择结束时间
				if(this.ruleForm.endDate == ''){
					let dd = new Date(this.ruleForm.startDate);
					dd.setDate(dd.getDate()+7);
					this.ruleForm.endDate = dd
				}
			},
			getArea(val){//选择地区回掉
				this.barringRegion  = val;
			},
			getSelect(val){//选择货品回掉
				this.goods.type = "goods"
				this.pageSelectids = val
			},
			getCategory(val){//选择分类回掉
				this.goods.type = "category"
				this.pageCatids = val
			},
			addPromotionLabel(params){// 创建活动标签
				this.$api("promotion.addPromotionLabel",{name:this.customLabel.trim()}).then((result) => {
					this.getLabels();
					params.label = result.id;
					this.addPromotion(params);
				}, (error) => {
					this.$message({ message: '创建活动标签出错', type: 'error' });
				});
			},
			addPromotion(params){// 创建促销活动
				let api = 'promotion.addPromotion';
				if(params.id){
					api = 'promotion.updatePromotionLabel';
				}
				this.$api(api,params).then((result) => {
					this.$message({ message: '新增促销活动成功', type: 'success' });
					this.$router.push({name:'fullcut'})
				}, (error) => {
					this.$message({ message: error.data.message, type: 'error' });
				});
			},
			getPromotion(reset){//获取促销详情
				this.$api("promotion.getPromotionDetail",{id:this.id}).then((result) => {
					this.loading = false
					this.promotionData = result;
					let rule = JSON.parse(this.promotionData.rule);
					this.ruleForm = {
						id:this.promotionData.id,
	          			proType:this.promotionData.type,
						name:this.promotionData.name.replace(/&lt;/g,"<").replace(/&gt;/g,">"),
						startDate:new Date(this.promotionData.start_date),
						endDate:new Date(this.promotionData.end_date),
						label:this.promotionData.lable_id+"",
						ruleId:this.promotionData.rule_id,
						rule_declaration:this.promotionData.rule_declaration,
						proc:this.promotionData.proc+""
					}
					this.ruleData = rule
					switch(this.promotionData.activity_type){
						case '1':
							rule.goods.type = "goods";
							break;
						case '2':
							rule.goods.type = "category";
							break;
						case '3':
							rule.goods.type = "allGoods";
							break;
					}
					this.goods = rule.goods

					if(this.ruleForm.proc == '3'){
						this.discountRull = rule.rule;
						// for(let i in this.discountRull){
						// 	if(this.discountRull[i].ruleType == '3'){
						// 		this.discountRull[i].ruleDiscount = this.discountRull[i].ruleVal
						// 		this.discountRull[i].ruleCut = ''
						// 	}else{
						// 		this.discountRull[i].ruleCut = this.discountRull[i].ruleVal
						// 		this.discountRull[i].ruleDiscount = ''
						// 	}
						// }
					}else if(this.ruleForm.proc == '4'){
						this.cutrull = rule.rule;
					}else{
						this.rulePrice = rule.rulePrice
						this.barringRegion = rule.barringRegion.split(",")
					}

					if(this.goods.type == 'goods'){
						this.pageSelectids = rule.goods.ids.split(",");
						this.selectids = rule.goods.ids.split(",");
						this.orderSkuId = rule.goods.ids.split(",");
						if(reset == 'reset'){
							this.resets = rule.goods.ids.split(",");
						}
					}else{
						this.pageCatids = rule.goods.ids.split(",");
						this.catids = rule.goods.ids.split(",");
					}
				}, (error) => {
					this.loading = false
					this.$message({ message: '查询活动数据出错', type: 'error' });
				});
			},
			getLabels(){// 查询活动标签
				this.$api("promotion.getPromotionLabel").then((result) => {
					this.labelData = result.list;
					// this.ruleForm.label = "2"
					if(this.id){
						this.getPromotion();
					}else{
						this.loading = false
					}
				}, (error) => {
					if(error.data.status!=102){
						this.$message({ message: '查询活动标签出错', type: 'error' });
					}
				});
			},
			newCut(rullState){//新建折扣规则
				let rull;
				let ruleType = rullState;
				switch(rullState){
						case '3':
							rull = this.discountRull;
							break;
						case '4':
							rull = this.cutrull;
							break;
					} 
				if(rull.length >= 5){
					this.$message({ message: '最多只能有5条规则', type: 'warning' });return
				}
				rull.push({
					"ruleType": rullState,
		            "rulePrice": '',
		            "ruleVal": ''
				})
			},
			delCut(rullState,index){//删除折扣规则
				let rull;
				switch(rullState){
					case '3':
						rull = this.discountRull;
						break;
					case '4':
						rull = this.cutrull;
						break;
				} 
				if(rull.length <= 1){
					this.$message({ message: '最少有1条规则', type: 'warning' });return
				}
				rull.splice(index,1)
			},
			savePromtion(formName){// 保存促销活动
				this.$refs.ruleForm.validate((valid) => {
			        if (valid) {
			          	let zhekou = /^\d\.\d{1,2}$|^([1-9]|10)$/;
						let jianqian = /^[1-9]\d{0,7}$/;
						let rull;
		          		if(this.ruleForm.proc != '2'){
							  let flag = true;
							switch(this.ruleForm.proc){
								case '3':
									rull = this.discountRull;
									break;
								case '4':
									rull = this.cutrull;
									break;
							} 
		          			for(let i in rull){
		          				console.log(i)
								let obj = rull[i]
								let prom = '第'+ (Number(i)+1) +'条规则'
								if(obj.rulePrice.trim() == '' || !jianqian.test(obj.rulePrice.trim())){
			          				this.$message({ message: '请正确填写'+prom+'购买金额', type: 'warning' });flag = false;return
			          			}
			          			// obj.ruleVal = obj.ruleType == '4' ? obj.ruleCut : obj.ruleDiscount;
			          			if(obj.ruleType == '4'){
			          				if(obj.ruleVal.trim() == '' || !jianqian.test(obj.ruleVal.trim())){
				          				this.$message({ message: '请正确填写'+prom+'满减金额', type: 'warning' });flag = false;return
				          			}
			          			}else if(obj.ruleType == '3'){
			          				if(obj.ruleVal.trim() == '' || !zhekou.test(obj.ruleVal.trim())){
				          				this.$message({ message: '请正确填写'+prom+'满减折扣', type: 'warning' });flag = false;return
				          			}
			          			}
							}
							if(!flag){return}
		          		}else{
		          			if(this.rulePrice.trim() == '' || !jianqian.test(this.rulePrice.trim())){
		          				this.$message({ message: '请正确填写满减金额', type: 'warning' });return
		          			}
		          		}
			          	var extend=function(o,n){
						    for (var p in n){
						        if(n.hasOwnProperty(p) && (!o.hasOwnProperty(p) ))
						            o[p]=n[p];
						    }
						    return o;
						};
						let params = extend({},this.ruleForm);
			            params.startDate = utilFun.formatDate(params.startDate.getTime(),'yyyy-MM-dd hh:mm:ss');
			            params.endDate = utilFun.formatDate(params.endDate.getTime(),'yyyy-MM-dd hh:mm:ss');
			            params.rule = this.ruleData
			            if(this.ruleForm.proc != '2'){
			            	params.rule.rule = rull;
			            	for(let i in  params.rule.rule){
				            	let obj =  params.rule.rule[i];
				            	delete obj.ruleCut;
								delete obj.ruleDiscount;
				            }
			            }else{
			            	params.rule.rulePrice = this.rulePrice;
			            	params.rule.barringRegion = this.barringRegion.join(",");
						}
						switch(this.goods.type){
							case 'goods':
								params.activity_type = "1";
								break;
							case 'category':
								params.activity_type = "2";
								break;
							case 'allGoods':
								params.activity_type = "3";
								break;
						}
						// params.activity_type = this.goods.type == 'goods' ? "1" : "2";
			            params.rule = JSON.stringify(params.rule)

			            if(params.label == 'custom'){
			            	if(!this.customLabel.trim()){
			            		this.$message({ message: '请输入自定义活动标签', type: 'warning' }); return
			            	}
			            	if(this.customLabel.trim().length < 1 || this.customLabel.trim().length >30){
		            			this.$message({ message: '活动标签限制1到30个字', type: 'warning'}); return
		            		}
			            	this.addPromotionLabel(params);
			            }else{
			            	this.addPromotion(params);
			            }
		            }else{
		        		this.steps = 0;
		        	}
		        });
			},
			resetForm(formName) {
		        if(this.id){
		        	this.getPromotion('reset');
		        }else{
		        	this.ruleForm = {
	          			proType:2,
						name:'促销'+ Math.floor(Math.random()*9000+1000),
						startDate:"",
						endDate:'',
						label:'',
						rule:{
							"goods":{
						         "type":"",
						         'ids':""
						    },
						    proTemplate:'',
						    rule:'',
		        		},
	        		}
	        		this.cutrull = [
						{
							"ruleType": '4',
				            "rulePrice": '',
				            "ruleVal": '',
				            "ruleCut": '',
				            "ruleDiscount": ''
						}
					],
					//重置选择货品
	        		this.selectids = []
	        		this.resets = []
	        		//重置选择分类
	        		this.catids = []
					//重置选择地区
	        		this.barringRegion = []
					this.rulePrice = ''
					//重置validate
	        		this.$refs[formName].resetFields();
		        }
		    }
		},
		components: {
			pageTitle,
			selectProduct,
			selectArea,
			selectCategory
		}
	}
</script>
<style scoped>
.areaWidth{
	width: 500px;
}
</style>
<style>


.formPrompt{padding-left: 20px; font-size: 12px; color: #999}
.customLabel{width: 200px;}
.form_con .el-form-item__label{font-size: 12px;}
.promptspan{color: #999}
.rule-select .el-input{width: 100px; margin-right: 40px;}
.smallinput {width: 60px; margin:0 5px;}


.cuttype{margin-bottom: 10px;}
.cutrull{border:1px solid #ccc; width: 600px;}
.cutrullLi{border-bottom: 1px solid #ccc; padding: 10px;}
.cutrullLi:last-child{border-bottom:0px}
.cutrullLi p{overflow: hidden;}
.cutrullLi p .el-button{float: right;}
.cutrullLi .promptspan{color: #ccc}
.form_con .cutrull .el-input{width: 60px; margin:0 10px;}
.cutrull p,.discountrull p{margin:0;}
.cutrulltitle{background: #efefef;border-bottom: 1px solid #ccc; padding:0 10px; }

.form_con .el-form-item__label{font-size: 12px;}

.cutarea{font-size: 12px; color: #999; position: relative; padding-right: 60px; text-align: justify;}
.cutarea span{margin-right: 10px;}

.pro_page{float: right;}
.pro_footer{overflow: hidden; padding: 10px 0}
</style>

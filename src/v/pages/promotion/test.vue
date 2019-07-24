<template>
	<active-common :step="step" @stepChange="stepChange" @rullChange="rullChange">
		<template slot="activeRull">
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
						<el-button size="mini" @click="newCut('4',slotProps)">新建规则</el-button>
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
						<p>
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
		</template>
		<template slot="saveBtn" slot-scope="{saveInfo}" :count="ruleForm">
			<el-button type="primary" size="small" @click="savePromtion(saveInfo)">保存</el-button>
		</template>
	</active-common>
</template>
<script>
	import activeCommon from './activeCommon';
	import * as utilFun from '@c/util/index.js';
	import selectArea from '@components/selectArea';
	import * as countryData from '@c/util/metaTreeCountryData'
	var areaData = countryData.formatData2();
	export default {
		data() {
			return {
				/*----------免邮-----------*/
				barringRegion:[],
				rulePrice:'',
				/*----------满减-----------*/
				cutrull:[
					{
						"ruleType": '4',
			            "rulePrice": '',
			            "ruleVal": ''
					}
				],
				/*-----------折扣----------*/
				discountRull:[
					{
						"ruleType": '3',
			            "rulePrice": '',
			            "ruleVal": ''
					}
				],
				ruleForm: {
					proc:'4'
				},
				step:0
			}
		},
		mounted() {
			
		},
		filters:{
			
		},
		methods: {
			stepChange(val){
				this.step = val;
			},
			rullChange(editInfo){
				this.ruleForm.proc = editInfo.proc+"";
				let rule = JSON.parse(editInfo.rule)
				if(this.ruleForm.proc == '3'){
						this.discountRull = rule.rule;
					}else if(this.ruleForm.proc == '4'){
						this.cutrull = rule.rule;
					}else{
						this.rulePrice = rule.rulePrice
						this.barringRegion = rule.barringRegion.split(",")
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
			getArea(val){//选择地区回掉
				this.barringRegion  = val;
			},
			newCut(rullState,scope){//新建折扣规则
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
			addPromotionLabel(params,customLabel){// 创建活动标签
				this.$api("promotion.addPromotionLabel",{name:customLabel}).then((result) => {
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
					this.$message({ message: '创建促销活动出错', type: 'error' });
				});
			},
			savePromtion(slotProps){
				let ruleForm = slotProps.ruleForm;
				let ruleData = slotProps.ruleData;
				let customLabel = slotProps.customLabel;
				ruleForm.proc = this.ruleForm.proc;
				let zhekou = /^\d\.\d{1,2}$|^([1-9]|10)$/;
				let jianqian = /^[1-9]\d{0,7}$/;
				let rull;
          		if(ruleForm.proc != '2'){
					  let flag = true;
					switch(ruleForm.proc){
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
				let params = extend({},ruleForm);
	            params.startDate = utilFun.formatDate(params.startDate.getTime(),'yyyy-MM-dd hh:mm:ss');
	            params.endDate = utilFun.formatDate(params.endDate.getTime(),'yyyy-MM-dd hh:mm:ss');
	            params.rule = ruleData
	            if(ruleForm.proc != '2'){
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
				switch(ruleData.goods.type){
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
	            	if(!customLabel.trim()){
	            		$message({ message: '请输入自定义活动标签', type: 'warning' }); return
	            	}
	            	if(customLabel.trim().length < 1 || customLabel.trim().length >30){
            			$message({ message: '活动标签限制1到30个字', type: 'warning'}); return
            		}
	            	this.addPromotionLabel(params,customLabel.trim());
	            }else{
	            	this.addPromotion(params);
	            }
			}
		},
		components: {
			activeCommon,
			selectArea,
		}
	}
</script>
<style scope>

</style>

<template>
	<active-common :step="step" @stepChange="stepChange" @rullChange="rullChange" @savePromtion="savePromtion" :btnLoading.sync="btnLoading" title="订单满赠">
		<template slot="activeRull">
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px" size="small">
				<el-form-item label="满赠类型：">
					<div class="cuttype">
						<el-radio-group v-model="ruleForm.give_coupon_type" @change="giveTypeChange">
							<el-radio class="radio" label="1">赠券</el-radio>
							<el-radio class="radio" label="2">赠品</el-radio>
						</el-radio-group>	
					</div>
				</el-form-item>
				<el-form-item label="赠送时机：" v-if="ruleForm.give_coupon_type == 1">
					<div class="cuttype">
						<el-radio class="radio" v-model="ruleForm.give_coupon_time" label="1">支付成功</el-radio>
						<el-radio class="radio" v-model="ruleForm.give_coupon_time" label="2">订单确认收货</el-radio>
					</div>
				</el-form-item>
				<el-form-item label="规则设置：">
					<div class="cuttype">
						<el-radio-group v-model="ruleForm.buy_rule" @change="typeChange">
							<el-radio class="radio" label="1">按订单额</el-radio>
							<el-radio class="radio" label="2">按购买量</el-radio>
						</el-radio-group>
						
					</div>
				</el-form-item>
				<el-form-item label="规则详情：">
					<!-- ////////////////////////////////减价///////////////////////////////////// -->
					<div class='cutrull'>
						<div class="cutrulltitle">
							<!-- <el-button size="mini" @click="newCut('4',slotProps)">新建规则</el-button> -->
							<span class="formPrompt">按单笔{{ruleForm.buy_rule == 1 ? '订单金额' : '购买数量'}}设置阶梯</span>
						</div>
						<div class="cutrullLi">
							<el-table :data="ruleForm.buy_rule == 1 ? priceRull : numRull" size="mini" class="xtggtable mt5" height="234">
								<el-table-column label="订单金额（元）" v-if="ruleForm.buy_rule == 1">
									<template slot-scope="scope">
										<!-- 订单金额 -->
										<el-form-item
										:prop="'rulePri-'+scope.$index"
										:rules="[
											{ required: true, message: '请输入购买金额'},
											{ validator:checkPrice,trigger:'blur'}
										]"
										style="margin:0"
										:inline-message="true">
										<span style="font-size:18px; line-height:100%" class="mr10">&ge;</span>
											<el-input v-model.trim="ruleForm['rulePri-'+scope.$index]" class="miniInput" size="mini" placeholder="请输入"></el-input>
										</el-form-item>	
									</template>
								</el-table-column>
								<el-table-column label="购买数量（件）" v-else>
									<template slot-scope="scope">
										<!-- 购买数量 -->
										<el-form-item
										:prop="'ruleNum-'+scope.$index"
										:rules="[
											{ required: true, message: '请输入购买数量'},
											{ validator:checkNumber,trigger:'blur'}
										]"
										style="margin:0"
										:inline-message="true">
										<span style="font-size:18px; line-height:100%" class="mr10">&ge;</span>
											<el-input v-model.trim="ruleForm['ruleNum-'+scope.$index]" class="miniInput" size="mini" placeholder="请输入"></el-input>
										</el-form-item>
									</template>
								</el-table-column>
								<el-table-column :label="ruleForm.give_coupon_type == 1 ? '优惠券' : '赠送货品'">
									<template slot-scope="scope">
										<el-button type="text" size="small"  @click="selectSome(ruleForm.give_coupon_type,scope.$index)">{{ruleForm.give_coupon_type == 1 ? "选择优惠券" : "选择赠品"}}（{{scope.row.num}}）</el-button>
									</template>
								</el-table-column>
								<el-table-column label="操作">
									<template slot-scope="scope">
										<el-button type="text" size="mini" @click="addRule(scope.$index,ruleForm.buy_rule)">增加</el-button>
										<el-button type="text" size="mini" @click="delRule(scope.$index,ruleForm.buy_rule)" v-if="scope.$index!=0">删除</el-button>
									</template>
								</el-table-column>
							</el-table>
						</div>
					</div>
				</el-form-item>
			</el-form>
            <select-coupon :visibility.sync="couponVisible" @callBack="couponBack" :backShow="backShow" :endTime="endTime"></select-coupon>
            <select-gift :visibility.sync="giftVistble" @callBack="couponBack" :backShow="backShow"></select-gift>
		</template>
	</active-common>
</template>
<script>
    import activeCommon from './activeCommon';
    import selectCoupon from './selectCoupon';
    import selectGift from './selectGift.vue';
	import * as utilFun from '@c/util/index.js';
	export default {
		data() {
			return {
				priceRull:[
					{
						rulePri:'',
						send_num:"",
						num:0,
						ids:""
					}
				],
				numRull:[
					{
						ruleNum:'',
						send_num:"",
						num:0,
						ids:""
					}
				],
				backShow:"",
				ruleForm: {
					give_coupon_type:'1',
					give_coupon_time:'1',
					buy_rule:'1',
					'ruleNum-0':'',
					'rulePri-0':''
                },
                rules:{
					
				},
                couponVisible:false,
                giftVistble:false,
				/*----------控制步骤-----------*/
				step:0,
				btnLoading:false,
				couponInfo:"",
				rullIndex:"",
				endTime:""
			}
		},
		mounted() {
			
		},
		filters:{
			
		},
		methods: {
			checkNumber(rule,value,callback){
				if(/^[1-9]\d*$/.test(value)){
					if(/^\d{1,8}$/.test(value)){
						callback()
					}else{
						callback(new Error('最大长度为8位'));
					}
				}else{
					callback(new Error('请输入大于0的正整数'));
				}
			},
			checkPrice(rule,value,callback){
				if(/^[1-9]\d*$/.test(value)){
					if(/^\d{1,8}$/.test(value)){
						callback()
					}else{
						callback(new Error('最大长度为8位'));
					}
				}else{
					callback(new Error('请输入大于0的正整数'));
				}
			},
			// 选择赠品或者优惠券的弹窗
			selectSome(type,index){
				this.rullIndex = index;
				if(this.ruleForm.buy_rule == '1'){
					this.backShow = {
						radio:this.priceRull[index].ids,
						send_num:this.priceRull[index].send_num
					}
				}else if(this.ruleForm.buy_rule == '2'){
					this.backShow = {
						radio:this.numRull[index].ids,
						send_num:this.numRull[index].send_num
					}
				}
                switch(type+""){
					case "1":
                        this.couponVisible = true;
                        break;
                    case "2":
                        this.giftVistble = true;
                        break;
                }
			},
			// 选择优惠券/赠品回调
			couponBack(val){
				let len = val.id.length;
				switch(this.ruleForm.buy_rule+""){
					case "1":
						this.priceRull.splice(this.rullIndex,1,{
							num:len,
							send_num:val.num.join(","),
							ids:val.id.join(",")
						})
						break;
					case "2":
						this.numRull.splice(this.rullIndex,1,{
							num:len,
							send_num:val.num.join(","),
							ids:val.id.join(",")
						})
						break;
				}
			},
			// 选择赠品回调
			giftBack(val){
				
			},
			// 满赠类型改变时
			giveTypeChange(val){
				this.priceRull = [
					{
						rulePri:'',
						send_num:"",
						num:0,
						ids:""
					}
				]
				this.numRull = [
					{
						ruleNum:'',
						send_num:"",
						num:0,
						ids:""
					}
				]

				for(let key in this.ruleForm){
					if(key.indexOf("ruleNum") > -1){
						if(key == "ruleNum-0"){
							this.ruleForm[key] = "";
						}else{
							delete this.ruleForm[key];
						}
					}else if(key.indexOf("rulePri") > -1){
						if(key == "rulePri-0"){
							this.ruleForm[key] = "";
						}else{
							delete this.ruleForm[key];
						}
					}
				}
			},
			// 规则改变时
			typeChange(val){
				
			},
			addRule(index,type){
				switch(type+""){
					case "1":
						this.priceRull.push({
							rulePri:'',
							send_num:"",
							num:0,
							ids:""
						});
						break;
					case "2":
						this.numRull.push({
							ruleNum:'',
							send_num:"",
							num:0,
							ids:""
						});;
						break;
				}
			},
			delRule(index,type){
				switch(type+""){
					case "1":
						let lenPri = this.priceRull.length;
						this.priceRull.splice(index,1);
						while(index < lenPri){
							if(this.ruleForm['rulePri-' + (index + 1)]){
								this.ruleForm['rulePri-' + index] = this.ruleForm['rulePri-' + (index + 1)]
							}else{
								this.ruleForm['rulePri-' + index] = ""
							}
							index++;
						}
						break;
					case "2":
						let lenNum = this.numRull.length;
						this.numRull.splice(index,1);
						while(index < lenNum){
							if(this.ruleForm['ruleNum-' + (index + 1)]){
								this.ruleForm['ruleNum-' + index] = this.ruleForm['ruleNum-' + (index + 1)]
							}else{
								this.ruleForm['ruleNum-' + index] = ""
							}
							index++;
						}
						break;
				}
			},
			/*----------共同部分 begin-----------*/
			stepChange(obj){
				this.endTime = utilFun.formatDate(obj.data.endDate.getTime(),'yyyy-MM-dd hh:mm:ss');
				this.step = obj.step;
			},
			rullChange(editInfo){//渲染促销规则
				let rule = JSON.parse(editInfo.rule);
				let sendObj = rule.rule.sendObj || [];
				this.ruleForm = {
					give_coupon_type:rule.give_coupon_type,
					give_coupon_time:rule.give_coupon_time,
					buy_rule:rule.buy_rule,
				}
				sendObj.forEach((item,index) => {
					switch(rule.buy_rule+""){
						case "1":
							this.priceRull[index] = {
								rulePri:item.ruleNum,
								send_num:item.obj_send_num,
								num:item.obj_send_num.split(",").length,
								ids:item.obj_id
							};
							this.ruleForm["rulePri-" + index] = item.ruleNum;
							break;
						case "2":
							this.numRull[index] = {
								ruleNum:item.ruleNum,
								send_num:item.obj_send_num,
								num:item.obj_send_num.split(",").length,
								ids:item.obj_id
							};
							this.ruleForm["ruleNum-" + index] = item.ruleNum;
							break;
					}
				})
			},
			/*----------共同部分 end-----------*/
			/*-----------共同的部分 begin----------*/
			addPromotion(params){// 创建促销活动
				let api = 'promotion.addPromotion';
				if(params.id){
					api = 'promotion.updatePromotionLabel';
				}
				this.$api(api,params).then((result) => {
					this.btnLoading = false;
					this.$message({ message: '新增促销活动成功', type: 'success' });
					this.$router.push({name:'fullGift'})
				}, (error) => {
					this.btnLoading = false;
					this.$message({ message: '创建促销活动出错', type: 'error' });
				});
			},
			savePromtion(slotProps){
				this.$refs.ruleForm.validate((valid) => {
					if (valid) {
						let ruleForm = slotProps.ruleForm;
						let ruleData = slotProps.ruleData;
						let customLabel = slotProps.customLabel;
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
						params.rule = ruleData;
						params.rule.give_coupon_type = this.ruleForm.give_coupon_type;
						params.rule.give_coupon_time = this.ruleForm.give_coupon_time;
						params.rule.buy_rule = this.ruleForm.buy_rule;
						params.proc = 1;
						params.proType = 4;
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
						let sendObj = [];
						let full_gift_ids = [];
						let flag = true,ruleIndex,giveType = this.ruleForm.give_coupon_type == 1 ? "优惠券" : "赠品";
						switch(this.ruleForm.buy_rule+""){
							case "1":
								this.priceRull.forEach((item,index) => {
									if(item.num == 0){
										flag = false;
										ruleIndex = index;
									};
									sendObj.push({
										obj_id:item.ids,
										obj_send_num:item.send_num,
										ruleNum:this.ruleForm['rulePri-' + index]
									})
									full_gift_ids.push(item.ids)
								})
								
								break;
							case "2":
								this.numRull.forEach((item,index) => {
									if(item.num == 0){
										flag = false;
										ruleIndex = index;
									};
									sendObj.push({
										obj_id:item.ids,
										obj_send_num:item.send_num,
										ruleNum:this.ruleForm['ruleNum-' + index]
									})
									full_gift_ids.push(item.ids)
								})
								break;
						}
						if(!flag){
							this.$message({ message: '请输入选择第' + (ruleIndex+1) +'条规则的' + giveType, type: 'warning'});
							setTimeout(() => {
								this.btnLoading = false;
							},0)
							return;
						}
						params.rule.rule = {
							sendObj:sendObj
						}
						params.full_gift_ids = full_gift_ids.join(",");
						params.full_gift_type = this.ruleForm.give_coupon_type;
						params.rule = JSON.stringify(params.rule);
						this.addPromotion(params);
					}else{
						setTimeout(() => {
							this.btnLoading = false;
						},0)	
						console.log('error validate');return
					}
				})
			}
			/*-----------共同的部分 end----------*/
		},
		components: {
            activeCommon,
            selectCoupon,
            selectGift
		}
	}
</script>
<style scope>

</style>

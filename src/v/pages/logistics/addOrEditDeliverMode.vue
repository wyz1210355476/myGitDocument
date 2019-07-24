<template>
	<div class="contents">
		<page-title :title="(id!=''?'编辑':'新增')+'配送方式'" goback></page-title>

		<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="155px" class="demo-ruleForm">
			<el-form-item label="排序码" prop="index">
				<el-input v-model="ruleForm.index" class="ce-width" auto-complete="off" size="small"></el-input><span class="formHint">数字小展示靠前(1-4位数字)</span>
			</el-form-item>
			<el-form-item label="是否启用" prop="disabled">
				<el-radio-group v-model="ruleForm.disabled" size="small">
					<el-radio label="1">启用</el-radio>
					<el-radio label="0">关闭</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="配送方式名称" prop="name">
				<el-input v-model="ruleForm.name" class="ce-width" size="small"></el-input><span class="formHint">最长30字符，支持汉字、英文、数字 ”-“、“_”空格</span>
			</el-form-item>
			<el-form-item label="选择默认的物流公司" prop="corp_name">
				<el-select v-model="ruleForm.corp_name" placeholder="请选择默认的物流公司" size="small">
					<el-option
					v-for="item in defaultCompanyOptions"
					:key="item.code"
					:label="item.name"
      				:value="item.code+'-'+item.name">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="类型" prop="cod_enable" v-if="$version == 'neimao'">
				<el-checkbox-group v-model="ruleForm.cod_enable" size="small">
					<el-checkbox label="支持货到付款" name="cod_enable" size="small"></el-checkbox>
				</el-checkbox-group>
			</el-form-item>

			<el-form-item label="重量设置">
				<el-col :span="7" class="ce-width">
					<el-form-item label="首重重量" prop="first_heavy" label-width="80px">
						<el-select v-model="ruleForm.first_heavy" placeholder="请选择" size="small">
							<el-option
							v-for="item in firstHeavyOptions"
							:key="item.value"
							:label="item.label"
      						:value="item.value">
      						</el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col class="line" :span="1">&nbsp;</el-col>
				<el-col :span="7" class="ce-width">
					<el-form-item label="续重重量" prop="continued_heavy" label-width="80px">
						<el-select v-model="ruleForm.continued_heavy" placeholder="请选择" size="small">
							<el-option
							v-for="item in continuedHeavyOptions"
							:key="item.value"
							:label="item.label"
      						:value="item.value">
      						</el-option>
						</el-select>
					</el-form-item>
				</el-col>
			</el-form-item>
			<el-form-item label="默认配送费用">
				<el-col :span="7" class="ce-width">
					<el-form-item label="首重费用" prop="first_heavy_price" label-width="80px">
						<el-input v-model="ruleForm.first_heavy_price" size="small"></el-input>
					</el-form-item>
				</el-col>
				<el-col class="line" :span="1">&nbsp;</el-col>
				<el-col :span="7" class="ce-width">
					<el-form-item label="续重费用" prop="continued_heavy_price" label-width="80px">
						<el-input v-model="ruleForm.continued_heavy_price" size="small"></el-input>
					</el-form-item>
				</el-col>
			</el-form-item>
			<el-form-item label="默认配送费用适用地区" prop="region_enable">
				<el-radio-group v-model="ruleForm.region_enable">
					<el-radio label="0">所有地区适用</el-radio>
					<el-radio label="1">指定部分地区城市设置运费</el-radio>
				</el-radio-group>
			</el-form-item>
			<div class="setSomeAreasFreight" v-if="ruleForm.region_enable == '1'">
				<el-checkbox v-model="ruleForm.def_region_fee"  size="small">
					除指定地区外，其余地区的运费采用“默认配送运费”
					<span class="ce-hint">注意：未勾选时，不在指定配送地区的顾客不能使用本配送方式下订单</span>
				</el-checkbox>
				<ul class="ce-selectAreas">
					<li v-for="(item,index) in ruleForm.setAreas" :key="item.id">
						<div class="ce-fl margin-r20">
							<span>配送地区:</span>
							<span class="ce-showSelectedAreas">{{item.show}}</span>
							<el-button type="text"   @click="selectAreasBtn(index)">地区选择</el-button>
							<el-dialog title="选择配送地区" :visible.sync="item.isTrigger">
								<el-tree
								style="height:500px;overflow-y:auto"
								:data="areasData"
								:load="loadNode"
								lazy
								show-checkbox
								node-key="id"
								size="small"
								:default-expanded-keys="item.expandedKeys"
								:default-checked-keys="[]"
								:ref="item.tree"
								>
								</el-tree>
								<div style="text-align:right;margin-top:20px;">
									<el-button type="primary" @click="saveSelectAreaData(index)" size="small">保存</el-button>
									<el-button @click="ruleForm.setAreas[index].isTrigger = false" size="small">取消</el-button>
								</div>
							</el-dialog>
						</div>
						<div class="ce-fl margin-r10">
							<el-col :span="7" class="ce-width margin-r10">
								<el-form-item
								label="首重费用"
								:key="item.key"
								:prop="'setAreas.' + index + '.first_heavy_price'"
								:rules="[
									{ required: true, message: '请输入首重费用'},
									{ validator:checkPrice,trigger:'blur'}
								]"
								label-width="80px"
								class="ce-marginBottom-18">
									<el-input v-model="item.first_heavy_price" size="small"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="7" class="ce-width">
								<el-form-item
								label="续重费用"
								:key="item.key"
								:prop="'setAreas.' + index + '.continued_heavy_price'"
								:rules="[
									{ required: true, message: '请输入续重费用'},
									{ validator:checkPrice,trigger:'blur'}
								]"
								label-width="80px"
								class="ce-marginBottom-18">
									<el-input v-model="item.continued_heavy_price" size="small"></el-input>
								</el-form-item>
							</el-col>
						</div>
						<div class="ce-fl">
							<el-button type="text" @click="deleteSetDeliverCharge(index)">删除</el-button>
						</div>
					</li>
				</ul>
			<el-button type="text" @click="addSetDeliverCharge">[+]为指定地区设置运费</el-button>
			</div>
			<el-form-item label="配送方式介绍" prop="detail">
				<el-input type="textarea" v-model="ruleForm.detail" class="ce-textarea"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button  size="small" @click="cancelForm">取消</el-button>
				<el-button type="primary" :loading="btnLoading" size="small"  @click="submitForm('ruleForm')">保存</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>
<script>
	import pageTitle from '@components/pageTitle';
	import router from '@c/router';
	import * as countryData from '@c/util/metaTreeCountryData'
	var areaData = countryData.formatData2();
	export default {
		data() {
			var checkOrderNum = (rule,value,callback) => {
				if((value+"").length > 4){
					return callback(new Error('最多输入四个数字'));
				}else if(!(/^\d+$/).test(value)){
					return callback(new Error('排序码必须为数字值'));
				}else{
					callback();
				}
			}
			var checkName = (rule,value,callback) => {
				if(!(/^[\s\u4e00-\u9fa5a-zA-Z0-9_\-]+$/).test(value)){
					return callback(new Error('输入格式不符合要求'));
				}else{
					callback();
				}
			}
			return {
				id:'',
				btnLoading:false,

				defaultCompanyOptions:[],
				firstHeavyOptions:[],
				continuedHeavyOptions:[],
				heavyOptions:{
					"neimao": [{
						value: '0.5',
						label: '0.5公斤'
					}, {
						value: '1',
						label: '1公斤'
					}, {
						value: '1.2',
						label: '1.2公斤'
					}, {
						value: '2',
						label: '2公斤'
					}, {
						value: '5',
						label: '5公斤'
					}, {
						value: '10',
						label: '10公斤'
					}, {
						value: '20',
						label: '20公斤'
					}, {
						value: '50',
						label: '50公斤'
					}],
					"waimao":[{
						value: '0.1',
						label: '0.1KG'
					}, {
						value: '0.2',
						label: '0.2KG'
					}, {
						value: '0.3',
						label: '0.3KG'
					}, {
						value: '0.5',
						label: '0.5KG'
					}, {
						value: '1',
						label: '1KG'
					}, {
						value: '2',
						label: '2KG'
					}, {
						value: '5',
						label: '5KG'
					}, {
						value: '10',
						label: '10KG'
					}, {
						value: '20',
						label: '20KG'
					}, {
						value: '50',
						label: '50KG'
					}, {
						value: '100',
						label: '100KG'
					}, {
						value: '200',
						label: '200KG'
					}]
				},
				dialogAreaVisible: false,
				dialogHint:false,
				deleteIndex:"",
				ruleForm: {
					index:"",
					disabled:"1",
					name:"",
					corp_code:"",
					corp_name:"",
					cod_enable:false,
					first_heavy:"",
					continued_heavy:"",
					first_heavy_price:"",
					continued_heavy_price:"",
					region_enable:"0",
					setAreas:[],
					def_region_fee:false,
					detail:""
				},
				rules: {
					index:[
						{ required: true, message: '请输入排序码'},
						{ validator:checkOrderNum}
					],
					name:[
						{ required: true,message: '请输入配送方式'},
						{ min: 1,max: 30,message: '最多输入30个字符'},
						{ validator:checkName}
					],
					corp_name:[
						{ required:true, message: '请选择默认物流公司', trigger: 'change'}
					],
					first_heavy:[
						{ required: true, message: '请选择首重重量', trigger: 'change'}
					],
					continued_heavy:[
						{ required: true, message: '请选择续重重量', trigger: 'change'}
					],
					first_heavy_price:[
						{ required: true, message: '请输入首重费用'},
						{ validator:this.checkPrice,trigger:'blur'}
					],
					continued_heavy_price:[
						{ required: true, message: '请输入续重费用'},
						{ validator:this.checkPrice,trigger:'blur'}
					],
					detail:[{ max: 200,message: '最多输入200个字符'}]
				},
				areasData:[],
				selectAreaIndex:'',
				count: 1,
				label:""//缓存最顶级的区域名
			}
		},
		mounted() {
			this.id=this.$route.query.id || ''
			this.getOptions();
		},
		methods: {
			// 首续重费用验证规则
			checkPrice(rule,value,callback){
				value = String(value);
				if((/^(\d+|\d+\.\d+)$/).test(value)){
					let ary = value.match(/^(\d+)(?:\.([\d]+))?$/)
					if(ary && ary[1].length > 4){
						if (!ary[2]) {
							return callback(new Error('最多输入四位整数'));
						}else{
							return callback(new Error('小数点前不超过4位'));
						}
					}else if(ary[2] && ary[2].length > 2){
						return callback(new Error('小数点后不超过2位'));
					}else{
						callback();
					}
				}else{
					return callback(new Error('价格必须为数字值'));
				}
			},
			// 为指定地区设置运费
			addSetDeliverCharge(){
				this.ruleForm.setAreas.push({
						first_heavy_price:'',
						continued_heavy_price:'',
						show:'请选择地区',
						areas:[],
						expandedKeys:[],
						checkedKeys:[],
						isTrigger:false,
						isDialogTrigger:false,
						tree:'tree'
					})
			},
			// 选择地区
			selectAreasBtn(index){
				var selectArea = this.ruleForm.setAreas[index];
				// 记录选择的区域对应的index
				this.selectAreaIndex = index;

				selectArea.isTrigger = true;

				if(selectArea.isDialogTrigger === false){
					selectArea.isDialogTrigger = true;
					setTimeout(() => {
						this.$refs.tree[index] = this.$refs.tree[this.$refs.tree.length-1];
						this.$refs.tree[index].setCheckedKeys(selectArea.checkedKeys)
					},0)
				}
			},
			// 删除指定地区设置的运费
			deleteSetDeliverCharge(index){
				this.$confirm('是否继续删除？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.ruleForm.setAreas.splice(index,1);
					this.$message({
						message: '操作成功！',
						type: 'success'
					});

				}).catch(() => {
					
				});      
			},
			// load area tree
			loadNode(node, resolve){
				// debugger
				if (node.level === 0) {
					return resolve(this.areasData);
				}
				if (node.level >= 3) return resolve([]);
				// debugger
				var id = node.data.id;
				if(node.level === 1){
					this.label = node.data.label;
				}
				
				var data = [];
				if(this.$version == "neimao"){
					if(node.level === 1){
						for(var key in areaData[id]){
							data.push({
								treeParent:id,
								id: key,
								topAreaName:this.label,
								label: areaData[id][key],
								children:[]
							})
						}
					}else if(node.level === 2){
						for(var key in areaData[id]){
							data.push({
								treeGrandparent:node.parent.data.id,
								provinceId:node.parent.data.id,
								topAreaName:this.label,
								cityId:id,
								id: key,
								label: areaData[id][key],
								children:[]
							})
						}
					}
					resolve(data);
				}else if(this.$version == "waimao"){
					if (node.level >= 2) return resolve([]);
					this.$api("logistics.getCountryByAreaId",{areaId:id}).then((result) => {
						result.forEach((item,index) => {
							data.push({
								treeParent:id,
								topAreaName:this.label,
								id: item.country_id,
								label: item.china_country_name,
								children:[]
							})
						})
						resolve(data);
					},(result) => {

					})
				}
			},
			// save area trea data
			saveSelectAreaData(index){
				var index = this.selectAreaIndex,
					selectArea = this.ruleForm.setAreas[index],
					checkedKeys = this.$refs.tree[index].getCheckedKeys(),
					checkedNodes = this.$refs.tree[index].getCheckedNodes(),
					treeTop,treeParentTop,treeParentSelf,treeGrandparentTop,
					province = areaData['0_cn'];

					selectArea.show = "";
					selectArea.checkedKeys = [];
					selectArea.expandedKeys = [];
					selectArea.areas = [];
				checkedNodes.forEach((checkedNode) => {
					// debugger;
					if (checkedNode.treeTop) {
						treeTop = checkedNode.treeTop;
						selectArea.show += checkedNode.label+"(全部地区)，";
						selectArea.checkedKeys.push(treeTop);
						selectArea.areas.push(checkedNode.id);
					}else if(checkedNode.treeParent){
						if (checkedNode.treeParent !== treeTop) {
							if(checkedNode.treeParent !== treeParentTop){
								treeParentTop = checkedNode.treeParent;
								if(selectArea.show.indexOf(province[checkedNode.treeParent]) === -1){
									selectArea.show += checkedNode.topAreaName+"(部分地区)，";
								}
								selectArea.expandedKeys.push(checkedNode.treeParent);
							}
							treeParentSelf = checkedNode.id;
							selectArea.checkedKeys.push(checkedNode.id);
							selectArea.areas.push(checkedNode.treeParent+checkedNode.id);
						}
					}else if(checkedNode.treeGrandparent){
						if(checkedNode.treeGrandparent !== treeTop && checkedNode.cityId !== treeParentSelf){
							if(checkedNode.treeGrandparent !== treeGrandparentTop && checkedNode.treeGrandparent !== treeParentTop){
								treeGrandparentTop = checkedNode.treeGrandparent;
								if(selectArea.show.indexOf(province[checkedNode.treeGrandparent]) === -1){
									selectArea.show += checkedNode.topAreaName+"(部分地区)，";
								}
								selectArea.expandedKeys.push(checkedNode.treeGrandparent);
								selectArea.expandedKeys.push(checkedNode.cityId);
							}else if(checkedNode.treeGrandparent === treeParentTop){
								selectArea.expandedKeys.push(checkedNode.cityId);
							}

							selectArea.checkedKeys.push(checkedNode.id);
							selectArea.areas.push(checkedNode.treeGrandparent+checkedNode.cityId+checkedNode.id);
						}
					}
				})
				selectArea.show = selectArea.show.replace(/，$/,"");
				selectArea.checkedKeys = checkedKeys;
				selectArea.isTrigger = false;
			},
			getOptions() {
				// this.$version = "neimao"
				var page = this.$route.query.page,
					editId = this.$route.query.id;
				// 获取物流公司
				if(this.$version == "neimao"){
					this.$api("logistics.logisticsCompanyList", {}).then((result) => {
						this.defaultCompanyOptions = result;
					}, (result)=>{
						this.$message({
							message: result.data.msg,
							type: 'error'
						});
					})
				}else if(this.$version == "waimao"){
					this.defaultCompanyOptions = [
						{status: 1, name: "DHL", code: "DHL"},
						{status: 1, name: "UPS", code: "UPS"},
						{status: 1, name: "Fedex", code: "Fedex"},
						{status: 1, name: "TNT", code: "TNT"},
						{status: 1, name: "EMS", code: "EMS"},
						{status: 1, name: "海运", code: "海运"},
						{status: 1, name: "中国代理", code: "中国代理"}
					]
				}
				

				// 首重&续重数据项
				this.firstHeavyOptions = this.continuedHeavyOptions = this.heavyOptions[this.$version];

				// 编辑页面or添加页面
				if(page === 'add'){
					this.ruleForm.setAreas = [{
						first_heavy_price:'',
						continued_heavy_price:'',
						show:'请选择地区',
						areas:[],
						expandedKeys:[],
						checkedKeys:[],
						isTrigger:false,
						isDialogTrigger:false,
						tree:'tree'
					}];
				}else if(page === 'edit'){
					this.$api("logistics.deliverModeList", {map:{id:{key:'id',value:editId,logic:'eq'}}}).then((result) => {
						// debugger;
						// console.log(result)
						if (result) {
							// 表单初始化数据
							result.list[0].cod_enable = result.list[0].cod_enable == 1 ? true : false;
							result.list[0].def_region_fee = result.list[0].def_region_fee == 1 ? true : false;
							for(var key in this.ruleForm){
								if(key !== "setAreas"){
									if(key === 'index'){
										result.list[0][key] = Number(result.list[0][key]);
									}else if(key !== 'def_region_fee' && key !== 'cod_enable'){

										if (key === 'detail' && (result.list[0][key] === null || result.list[0][key] === 'null') ) {
											result.list[0][key] = '';
										}else{
											result.list[0][key] = String(result.list[0][key]);
										}

									}
									this.ruleForm[key] = result.list[0][key];

								}
							}
							let areas = JSON.parse(result.list[0].region_fee_conf);
							if(areas && areas.length != 0){
								areas.forEach((area) => {
									this.ruleForm.setAreas.push({
										first_heavy_price: area.val.first_heavy_price,
										continued_heavy_price: area.val.continued_heavy_price,
										show: area.extend.show,
										areas:area.key,
										expandedKeys:area.extend.expandedKeys,
										checkedKeys:area.extend.checkedKeys,
										isTrigger:false,
										isDialogTrigger:false,
										tree:'tree'
									})
								})
							}

						}

					}, (result)=>{
						this.$message({
							message: result.data.msg,
							type: 'error'
						});
					})
				}


				// this.ruleForm.corp_code = undefined

				// area of tree data
				// debugger
				var arrayDatas = [];
				if(this.$version == "neimao"){
					for(var provinceKey in areaData["0_cn"]){
						arrayDatas.push({
							treeTop:provinceKey,
							id: provinceKey,
							label: areaData["0_cn"][provinceKey],
							children:[]
						})
					}
					this.areasData = arrayDatas;
				}else if(this.$version == "waimao"){
					this.$api("logistics.getCountryArea",{}).then((result) => {
						result.forEach((item,index) => {
							arrayDatas.push({
								treeTop:item.area_id,
								id: item.area_id,
								label: item.china_area_name,
								children:[]
							})
						})
					this.areasData = arrayDatas;
					},(result) => {
						this.$message({
							message: result.data.msg,
							type: 'error'
						});
					})
				}
				
				// console.log(arrayDatas)
				
			},
			submitForm(formName) {

				var page = this.$route.query.page,
					editId = this.$route.query.id,
					submitData = {};
					submitData.region_fee_conf = [];
					for(var key in this.ruleForm){
						if(key !== "setAreas"){
							submitData[key] = this.ruleForm[key];
							if(key === 'cod_enable' || key === 'def_region_fee'){
								submitData[key] = submitData[key] ? '1' : '0';
							}
						}
					}
					this.ruleForm.setAreas.forEach((area) => {
						submitData.region_fee_conf.push({
							key:area.areas,
							val:{"first_heavy_price":area.first_heavy_price,"continued_heavy_price":area.continued_heavy_price},
							extend:{
								show:area.show,
								expandedKeys:area.expandedKeys,
								checkedKeys:area.checkedKeys
							}
						})
					})
					// 处理corp_name
					if(submitData.corp_name.indexOf('-') !== -1){
						let ary = submitData.corp_name.split('-');
						submitData.corp_code = ary[0];
						submitData.corp_name = ary[1];
					}
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.btnLoading = true
						if(page === "add"){

							this.$api("logistics.addDeliverMode",{map:submitData}).then(() => {
								this.$message({
									message: '操作成功！',
									type: 'success'
								});
								router.back();
							},(result) => {
								this.$message({
									message: result.data.msg,
									type: 'error'
								});
								this.btnLoading = false
							})
						}else if(page === "edit"){
							console.log(submitData)
							submitData.id = editId;
							this.$api("logistics.editDeliverMode", {map:submitData}).then(() => {
								this.$message({
									message: '操作成功！',
									type: 'success'
								});
								router.back();
							},(result) => {
								this.$message({
									message: result.data.msg,
									type: 'error'
								});
								this.btnLoading = false
							})
						}
						//console.log(this.ruleForm)
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			cancelForm(){
				router.go(-1);
			}
		},
		components: {
			pageTitle
		}
	}
</script>
<style>
ul,li,dl,dt,dt{
	list-style-type: none;
	margin: 0;
	padding: 0;
}
.ce-width{
	width: 200px
}
.ce-textarea{
	width: 500px;
}
.setSomeAreasFreight{
	margin: 0 0 22px 155px;
	padding: 10px;
	border-radius: 4px;
	border: 1px solid #eaeefb;
	max-width: 850px;
	min-width: 800px;
	overflow: hidden;
}
.ce-hint{
	padding-left: 20px;
	color: #999;
	font-size: 12px;
}
.ce-selectAreas{
	padding: 10px 0;
	font-size: 14px;
	overflow: hidden;
}
.ce-selectAreas li{
	width: 800px;
	overflow: hidden;
}
.ce-fl{
	float: left;
}
.ce-showSelectedAreas{
	border: 1px solid #eaeefb;
	display: inline-block;
	width: 180px;
	line-height: 26px;
	margin-right: 10px;
	padding-left: 5px;
}
.margin-r20{
	margin-right: 20px;
}
.margin-r10{
	margin-right: 10px;
}
.ce-marginBottom-18{
	margin-bottom: 18px;
}
.formHint{
	padding-left: 15px;
	color: #999;
}
</style>
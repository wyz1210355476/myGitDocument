<template>
	<div class="contents">
		<page-title :title="(id!=''?'编辑':'新增')+'商品类型'" goback></page-title>
		<el-steps class="steps" :active="steps" simple finish-status="success" process-status="finish">
			<el-step :title="item.label" v-for="item in stepsData" :key="item.id"></el-step>
		</el-steps>
		<el-form :model="basicForm" ref="basicForm" label-width="140px" size="small" v-show="steps == 0">
			<el-form-item label="类型名称：">
				<el-input placeholder="请输入类型名称" class="formInput" v-model="basicForm.templateName"></el-input>
				<span class="formPrompt">最多15个字符 , 支持汉字、英文、数字及“-”、“_”的组合。</span>
			</el-form-item>
		</el-form>
		<el-form label-width="140px" size="small" v-show="steps == 1">
			<el-form-item label="拓展属性：">
				<el-button size="small" @click="addAttr">新增</el-button>
			</el-form-item>
			<el-form-item label="">
				<el-table :data="attrData" size="mini">
			    	<el-table-column label="属性名称" >
			    		<template slot-scope="scope">
			    			<el-input v-model="scope.row.attributeName" size="mini" class="smallInput" placeholder="请输入内容"></el-input>
			    		</template>
			    	</el-table-column>
					<el-table-column label="表现样式" >
						<template slot-scope="scope">
			    			<el-select v-model="scope.row.attrType" size="mini" class="smallInput" placeholder="请选择">
							    <el-option v-for="item in attrSelect" :key="item.id" :label="item.label" :value="item.id"></el-option>
							</el-select>
			    		</template>
					</el-table-column>
					<el-table-column label="属性值" >
						<template slot-scope="scope">
							<type-value :valueData='scope.row' :index="scope.$index" :usecount="useCount" :type="'attr'" @change="getAttrValue"></type-value>
						</template>
					</el-table-column>
					<el-table-column label="排序" >
						<template slot-scope="scope">
							<el-button type="text" icon="el-icon-sort-up" @click="upData('attr',scope.$index)" size="mini"></el-button>
							<el-button type="text" icon="el-icon-sort-down" @click="downData('attr',scope.$index)" size="mini"></el-button>
						</template>
					</el-table-column>
			    	<el-table-column label="操作" >
			    		<template slot-scope="scope">
			    			<el-button type="text" size="mini" @click="delData('attr',scope.$index)" :disabled="useCount>0">删除</el-button>
			    		</template>
			    	</el-table-column>
			    </el-table>
			</el-form-item>
		</el-form>
		<el-form label-width="140px" size="small" v-show="steps == 2">
			<el-form-item label="规格项：">
				<el-button size="small" @click="addSpec" :disabled="useCount>0 || specData.length>=3">新增</el-button>
			</el-form-item>
			<el-form-item label="">
				<el-table :data="specData" size="mini">
			    	<el-table-column label="规格名称" >
			    		<template slot-scope="scope">
			    			<el-input v-model="scope.row.name" size="mini" class="smallInput" placeholder="请输入内容"></el-input>
			    		</template>
			    	</el-table-column>
					<el-table-column label="表现样式" >
						<template slot-scope="scope">
			    			<el-select v-model="scope.row.imageFlag" size="mini" class="smallInput" placeholder="请选择" @change="checkSpecStyle(scope.row,scope.$index)">
							    <el-option v-for="item in specSelect" :key="item.id" :label="item.label" :value="item.id"></el-option>
							</el-select>
			    		</template>
					</el-table-column>
					<el-table-column label="规格值" >
						<template slot-scope="scope">
							<type-value :valueData='scope.row' :index="scope.$index" :usecount="useCount" :type="'spec'" @change="getSpecValue"></type-value>
						</template>
					</el-table-column>
					<el-table-column label="排序" >
						<template slot-scope="scope">
							<el-button type="text" icon="el-icon-sort-up" @click="upData('spec',scope.$index)" size="mini"></el-button>
							<el-button type="text" icon="el-icon-sort-down" @click="downData('spec',scope.$index)" size="mini"></el-button>
						</template>
					</el-table-column>
			    	<el-table-column label="操作" >
			    		<template slot-scope="scope">
			    			<el-button type="text" size="mini" @click="delData('spec',scope.$index)" :disabled="useCount>0">删除</el-button>
			    		</template>
			    	</el-table-column>
			    </el-table>
			</el-form-item>
		</el-form>

		<div class="promotion_button">
			<el-button size="small" plain v-if="steps != 0" @click="prevStep">上一步</el-button>
			<el-button size="small" plain v-if="steps != (stepsData.length-1)" @click="nextStep">下一步</el-button>
			<el-button type="primary" size="small" @click="saveTemplate()">保存</el-button>
		</div>


	</div>
</template>
<script>
	import pageTitle from '@components/pageTitle';
	import typeValue from './setTypeValue';

	export default {
		data() {
			return {
				id:'',
				useCount:0,
				steps:0,
				stepsData:[
					{id:1,label:'设置类型名称'},
					{id:2,label:'设置拓展属性'},
					{id:3,label:'设置规格项'},
				],
				attrSelect:[
					{id:1,label:'列表',attributeType:2,attributeTypeDetail:'checkbox',searched:0},
					{id:2,label:'下拉',attributeType:2,attributeTypeDetail:'select',searched:0},
					{id:3,label:'输入',attributeType:0,attributeTypeDetail:'text',searched:0},
					{id:4,label:'可筛选列表',attributeType:2,attributeTypeDetail:'checkbox',searched:1},
					{id:5,label:'可筛选下拉',attributeType:2,attributeTypeDetail:'select',searched:1},
				],
				specSelect:[
					{id:0,label:'文字'},
					{id:1,label:'图片'},
				],
				basicForm:{
					id:'',
					templateName:'',
					specListStr:'',
					attributeDetailListStr:''
				},
				attrData:[],
				specData:[],

			}
		},
		mounted() {
			this.id=this.$route.query.id || ''
			if(this.$route.query.id){
				this.getTypeData(this.$route.query.id)
			}
		},
		methods: {
			checkSpecStyle(row,index){
				console.log(row)
				if(row.imageFlag == '1'){
					let count = 0
					this.specData.forEach( (element, index) => {
						if(element.imageFlag == '1'){
							count += 1
						}
					});
					console.log(index,count)
					if(count>1){
						this.specData[index].imageFlag = 0
						this.$message({ message: '只能有一个图片规格', type: 'error' });
					}
				}
			},
			formatAttr(data){
				if(data){
					data.forEach( (element) => {
						let attrType = ''
						if(element.attributeType == '2' && element.attributeTypeDetail == 'checkbox' && element.searched == '0'){
							attrType = 1
						}else if(element.attributeType == '2' && element.attributeTypeDetail == 'select' && element.searched == '0'){
							attrType = 2
						}else if(element.attributeType == '0' && element.attributeTypeDetail == 'text' && element.searched == '0'){
							attrType = 3
						}else if(element.attributeType == '2' && element.attributeTypeDetail == 'checkbox' && element.searched == '1'){
							attrType = 4
						}else if(element.attributeType == '2' && element.attributeTypeDetail == 'select' && element.searched == '1'){
							attrType = 5
						}
						let attrOptions = []
						if(element.attributeOptionList){
							element.attributeOptionList.forEach( (el) =>{
								attrOptions.push({
									id:el.id,
									attributeOption:el.attributeOption,
								})
							})
						}
						this.attrData.push({
							id:element.id,
							attributeName:element.attributeName,
							attributeType:element.attributeType,
							attributeTypeDetail:element.attributeTypeDetail,
							searched:element.searched,
							attributeOptionList:attrOptions,
							attrType:attrType
						})
					})
				}
			},
			formatSpec(data){
				if(data){
					data.forEach( (element, index) => {
						let specValueList = []
						if(element.specValueList){
							element.specValueList.forEach( (el) =>{
								specValueList.push({
									id:el.id,
									imagePath:el.imagePath,
									name:el.name,
								})
							})
						}
						this.specData.push({
							id:element.id,
							name:element.name,
							imageFlag:Number(element.imageFlag),
							specValueList:specValueList
						})
					});
				}
			},
			getTypeData(id){
				this.$api("goods.getGoodsTypeAllById",{id:id}).then((result) => {
					this.useCount = result.useCount || 0
					this.basicForm = {
						id:result.id,
						templateName:result.templateName,
						defaulted:result.defaulted,
						specListStr:'',
						attributeDetailListStr:'',
					}
					this.formatAttr(result.attributeDetailList)
					this.formatSpec(result.specList)
				}, (error) => {
					this.$message({ message: '查询商品类型出错', type: 'error' });
				});
			},
			getAttrValue(val){
				this.attrData[val.index].attributeOptionList = val.data
			},
			getSpecValue(val){
				this.specData[val.index].specValueList = val.data
			},
			upData(key,index){
				let arr;
				if(key == "attr"){
					arr = this.attrData
				}else if(key == "spec"){
					arr = this.specData
				}
				if(index == 0) { return }
		    	arr[index] = arr.splice(index-1, 1, arr[index])[0]
			},
			downData(key,index){
				let arr;
				if(key == "attr"){
					arr = this.attrData
				}else if(key == "spec"){
					arr = this.specData
				}
				if(index == arr.length - 1) { return }
		    	arr[index] = arr.splice(index+1, 1, arr[index])[0]
			},
			prevStep(){
				let flag = true
				switch (this.steps) {
					case 0:
						flag = !this.checkTypeName() ? false : true
						break;
					case 1:
						flag = !this.checkAttr() ? false : true
						break;
					case 2:
						flag = !this.checkSpec() ? false : true
						break;
				}
				this.steps -= flag ? 1 : 0
			},
			nextStep(){
				let flag = true
				switch (this.steps) {
					case 0:
						flag = !this.checkTypeName() ? false : true
						break;
					case 1:
						flag = !this.checkAttr() ? false : true
						break;
				}
				this.steps += flag ? 1 : 0
			},
			delData(key,index){
				if(key == 'attr'){
					this.attrData.splice(index,1)
				}else if(key == 'spec'){
					this.specData.splice(index,1)
				}
			},
			addAttr(){
				this.attrData.push({
					attributeName:'',
					attrType:1,
					attributeOptionList:[]
				})
			},
			addSpec(){
				this.specData.push({
					name:'',
					imageFlag:0,
					specValueList:[]
				})
			},
			checkTypeName(){
				let typeNameReg = /^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z0-9_-]){1,15}$/
				this.basicForm.templateName = this.basicForm.templateName.trim()
		        if (!typeNameReg.test(this.basicForm.templateName)) {
		        	this.$message({ message: '类型名称格式不正确', type: 'error' });
		         	return false
		        }else{
		        	return true
		        }
			},
			checkAttr(){
				if(this.attrData.length == 0){
					return true
				}else{
					let flag = true
					let typeNameReg = /^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z0-9_-]){1,15}$/
					for(let element of this.attrData){
						element.attributeName = element.attributeName.trim()
						let attrTypeData = this.attrSelect.find( (n) => n.id == element.attrType )
						element.attributeType = attrTypeData.attributeType
						element.attributeTypeDetail = attrTypeData.attributeTypeDetail
						element.searched = attrTypeData.searched
						if(element.attributeName == ''){
							this.$message({ message: '拓展属性名称不能为空', type: 'error' })
							flag = false
							break
						}
						if(!typeNameReg.test(element.attributeName)){
							this.$message({ message: '拓展属性名称格式不正确', type: 'error' })
							flag = false
							break
						}
						if(element.attributeOptionList == 0 && element.attrType != 3){
							this.$message({ message: '拓展属性值不能为空', type: 'error' })
							flag = false
							break
						}
					}
					return flag
				}
			},
			checkSpec(){
				if(this.specData.length == 0){
					return true
				}else{
					let flag = true
					let typeNameReg = /^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z0-9_-]){1,15}$/
					for(let element of this.specData){
						element.name = element.name.trim()
						if(element.name == ''){
							this.$message({ message: '规格名称不能为空', type: 'error' })
							flag = false
							break
						}
						if(!typeNameReg.test(element.name)){
							this.$message({ message: '规格名称格式不正确', type: 'error' })
							flag = false
							break
						}
						if(element.specValueList == 0){
							this.$message({ message: '规格属性值不能为空', type: 'error' })
							flag = false
							break
						}
					}
					return flag
				}
			},
			saveTemplate(){
				if(!this.checkTypeName() || !this.checkAttr() || !this.checkSpec()){
					return
				}
				this.basicForm.specListStr = this.specData
				this.basicForm.attributeDetailListStr = this.attrData
				console.log(this.basicForm);
				let api = this.basicForm.id == '' ? 'goods.addGoodsType' : 'goods.updateGoodsType'
				this.$api(api,this.basicForm).then((result) => {
					this.$router.push({name:"goodsType"})
				}, (error) => {
					if(error.data.status == '202'){
						this.$message({ message: '商品类型名称重复', type: 'error' });
					}else{
						this.$message({ message: '保存商品类型出错', type: 'error' });
					}
				});
			},
		},
		components: {
			pageTitle,
			typeValue
		}
	}
</script>
<style>

</style>

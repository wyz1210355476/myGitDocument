<template>
	<span>
		<span @click="showDialog"><slot></slot></span>

		<el-dialog title="设置价格" :visible.sync="dialogVisible" width="640px" :append-to-body="true">
			<div style="max-height:396px; min-height:350px; overflow-y:auto" v-loading="loading">
				<div class="mb20">
					<span class="formPrompt">市场参考价（显示用市场建议价格）：</span>
					<div class="pt5">
						<span style="background:#fff2e9; display:inline-block; padding:0 10px">价格：<span style="text-decoration:line-through">{{scPrice | toFixed(2)}}</span></span>
						<el-input v-model.trim="scPrice" class="smallInput ml20" size="mini" placeholder="请输入"></el-input>
					</div>
				</div>
				<div class="padBot" v-if="!isFirmSale">
					<span class="formPrompt">销售定价方式（批发或零售）：</span>
					<div>
						<el-radio-group v-model="pricingMethod" @change="">
						    <el-radio :label="1">批发</el-radio>
						    <el-radio :label="2">零售</el-radio>
						</el-radio-group>
					</div>
				</div>
				<div v-if="pricingMethod == 1">
					<span class="formPrompt">价格（可设置阶梯定价）：</span>
					<el-table :data="priceData" size="mini" class="xtggtable mt5" height="234">
	      				<el-table-column label="数量">
	      					<template slot-scope="scope">
								<span style="font-size:18px; line-height:100%" class="mr10">&ge;</span><el-input v-model.trim="scope.row.number" class="miniInput" size="mini" placeholder="请输入数量"></el-input>
	      					</template>
	      				</el-table-column>
	      				<el-table-column label="销售价">
	      					<template slot-scope="scope">
	      						<el-input v-model.trim="scope.row.price" class="smallInput" size="mini" placeholder="请输入销售价"></el-input>
	      					</template>
	      				</el-table-column>
	      				<el-table-column label="操作">
	      					<template slot-scope="scope">
	      						<el-button type="text" size="mini" @click="addRule(scope.$index)">增加</el-button>
	      						<el-button type="text" size="mini" @click="delRule(scope.$index)" v-if="scope.$index!=0">删除</el-button>
	      					</template>
	      				</el-table-column>
	      			</el-table>
				</div>
				<div v-else>
					<div v-if="specLength==0">
						<span>设置货品销售价格：</span>
						<el-input v-model="noSpecPri" class="smallInput" size="mini" placeholder="请输入内容"></el-input>
					</div>
					<div v-if="specLength>0">
						<div style="line-height:30px">设置货品销售价格：</div>
						<el-table :data="skuList" size="mini" max-height="202" ref="skuTable" class="table-one-line" @selection-change="handleSkuList">
							<el-table-column type="selection" width="35"></el-table-column>
							<el-table-column label="货品编号" width="100" prop="code"></el-table-column>
							<el-table-column v-for="item in specData" :key="item.id" :label="item.name">
								<template slot-scope="scope">
									<span class="one-line">{{getSkuSpecValueName(item.id,scope.row.goodsSkuSpecList)}}</span>
								</template>
							</el-table-column>
							<el-table-column label="销售价" width="100">
								<template slot-scope="scope">
									<el-input placeholder="请输入" size="mini" class="miniInput" v-model="scope.row.price"></el-input>
								</template>
							</el-table-column>
						</el-table>
						<div class="pl10">
							<el-checkbox 
							@change="seleceAllsku" 
							:indeterminate="skuSelection.length!=0&&skuSelection.length!=skuList.length" 
							v-model="skuselectStatus" 
							class="mr10 font12" >全选</el-checkbox>
							<span class="op_project">
								<el-button type="text" size="small" :disabled="skuSelection.length==0" @click="plSetSkuPrice()" >批量设置货品价格</el-button>
							</span>
						</div>
					</div>
				</div>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button size="small" @click=" dialogVisible = false ">取 消</el-button>
				<el-button size="small" type="primary" @click="confirm">确 定</el-button>
			</span>
		</el-dialog>
	</span>
</template>
<script>

	export default {
		data() {
			return {
				loading:false,
				dialogVisible:false,
				priceData:[
					{number:1,price:''}
				],
				scPrice:'',
				isFirmSale:false,//是否确定了销售方式
				pricingMethod:1,//选择销售方式，1批发，2零售
				noSpecPri:"",
				//货品
				specData:[],
				skuList:[],
				noSpecSku:{},
				skuSelection:[],
				skuselectStatus:false,
				specLength:"null"
			}
		},
		methods: {
			//显示弹窗
			showDialog(){
				this.loading = true
				this.dialogVisible = true
				this.$api("goods.getGoodsPriceType",{product_id:this.goodsid}).then((result) => {
					// console.log(result)
					this.isFirmSale = result.type == 0 ? false : true;
					this.pricingMethod = result.type == 0 ? 1 : result.type;
					this.selectPriceMeth(result.type);
				},(error) => {
					this.$message({ message: '获取商品销售类型出错', type: 'error' });
				})
				
			},
			selectPriceMeth(val){
				switch(val)
				{
					case 1:
						this.getWholesalePrice();
						break;
					case 2:
						this.getRetailPrice();
						// this.getSkuPrice();
						break;
					default:
						this.getWholesalePrice();
						this.getRetailPrice();
				}
			},
			//获取商品价格
			getWholesalePrice(){
				let params = {
					goodsId:this.goodsid
				}
				this.$api("goods.getGoodsPrice",params).then((result) => {
					result = result[0]
					this.loading = false
					this.scPrice = result.market_price
					let wholesalePrice = JSON.parse(result.wholesale_price)
					this.priceData = []
					wholesalePrice.forEach((e)=>{
						this.priceData.push({
							number:e.min,
							price:e.price
						})
					})
				}, (error) => {
					this.loading = false
					if(error.data.status!=102){
						this.$message({ message: '获取商品价格出错', type: 'error' });
					}
				});
			},
			//查询商品详情
			getRetailPrice(){
				this.$api("goods.getGoodsById",{id:this.goodsid}).then((result) => {
					this.loading = false
					this.goodsDetail = result
					//规格项
					this.specData = result.attributeTemplate.specList || []
					// 绑定规格项数组长度
					this.specLength = this.specData.length;
					//货品列表
					this.skuList = result.goodsSkuList || []
					this.noSpecSku = result.noSpecSku || {}
					if(this.specData.length==0){
						this.skuList = []
					}
					let par=[]
					this.skuList.forEach((e)=>{
						e.price = "";
						par.push({goods_id:e.id})
					})
					if(this.specData.length==0){
						par.push({goods_id:this.noSpecSku.id})
					}
					this.getSkuPrice();
				}, (error) => {
					this.$message({ message: '查询商品详情出错', type: 'error' });
				});
			},
			// 获取每个货品的价格
			getSkuPrice(){
				this.$api("goods.getRetailGoodsPrice",{product_id:this.goodsid}).then((result) => {
					this.scPrice = result[0].market_price;
					if(this.specLength == 0){
						this.noSpecPri = JSON.parse(result[0].wholesale_price)[0].price;
						return;
					}
					
					this.skuList.forEach((e)=>{
						var _item = result.find((item) => item.sku_id == e.goodsSkuSpecList[0].skuId);
						e.price = JSON.parse(_item.wholesale_price)[0].price;
					})
				},(error) => {

				})
			},
			//批量设置货品价格
			plSetSkuPrice(){
				console.log(this)
				this.$prompt(' ', '批量设置货品价格', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
				  inputPattern: /^(([1-9]\d*(\.\d{1,2})?)|(0\.((0[1-9])|([1-9]\d?))))$/,
		          inputErrorMessage: '货品价格格式不正确',
		          customClass:'promptClass'
		        }).then(({ value }) => {
		        	console.log(this.skuSelection);
		          this.skuSelection.forEach( (element, index) => {
		          	element.price = parseFloat(value)
		          });
		        }).catch(() => {});
			},
			//全选货品
			seleceAllsku(val){
				if(val && this.skuList.length > 0){
					this.skuList.forEach(row => {
			            this.$refs.skuTable.toggleRowSelection(row,true);
			        });
				}else{
					this.$refs.skuTable.clearSelection();
				}
			},
			//选择货品复选框
			handleSkuList(val){
				 this.skuSelection = val;
				 if(val.length == this.skuList.length){
		        	this.skuselectStatus = true
		        }else{
		        	this.skuselectStatus = false
		        }
			},
			//根据规格id，规格值id，获取规格值名称
			getSkuSpecValueName(specId,goodsSkuSpecList){
				let specValue = goodsSkuSpecList.find((n)=>n.specId == specId)
				return this.getSpecValueName(specId,specValue.specValueId)
			},
			//根据规格id，规格值id，获取规格名称
			getSpecValueName(specId,specValueId){
				let valueList = this.specData.find((n)=> n.id == specId).specValueList
				let valueItem = valueList.find((n)=> n.id == specValueId)
				return valueItem.name
			},
			isRepeat(arr){
				var hash = {};
				for(var i in arr) {
					if(hash[arr[i]])
						return true;
					hash[arr[i]] = true;
				}
				return false;
			},
			compare(prop) {
			    return function (obj1, obj2) {
			        var val1 = obj1[prop];
			        var val2 = obj2[prop];
			        if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
			            val1 = Number(val1);
			            val2 = Number(val2);
			        }
			        if (val1 < val2) {
			            return -1;
			        } else if (val1 > val2) {
			            return 1;
			        } else {
			            return 0;
			        }
			    }
			},
			addRule(index){
				this.priceData.splice(Number(index) + 1, 0, {
					number:Number(this.priceData[index].number) + 1,
					price:''
				})
			},
			delRule(index){
				this.priceData.splice(index, 1)
			},
			confirm(){
				// let priceReg = /^\d*\.?\d{0,2}$/
				let priceReg = /^(([1-9]\d*(\.\d{1,2})?)|(0\.((0[1-9])|([1-9]\d?))))$/
				if(!priceReg.test(this.scPrice) || this.scPrice == ''){
					this.$message({ message: '请正确填写市场参考价', type: 'error' });return
				}
				if(this.pricingMethod == 1){//批发定价时保存
					let numberArr = []
					let numberFlag = true
					let priceFlag = true
					let numberReg = /^[1-9]\d*$/
					this.priceData.forEach( (el, index) => {
						numberArr.push(el.number)
						if(!numberReg.test(el.number) || el.number == ''){numberFlag = false}
						if(!priceReg.test(el.price) || el.price == ''){priceFlag = false}
					})
					if(this.isRepeat(numberArr)){
						this.$message({ message: '阶梯数量不能重复', type: 'error' });return
					}
					if(!numberFlag){
						this.$message({ message: '请正确填写阶梯数量', type: 'error' });return
					}
					if(!priceFlag){
						this.$message({ message: '请正确填写阶梯价格，小数点后两位', type: 'error' });return
					}
					this.priceData.sort(this.compare("number"))
					////////////////////////////////////////
					let finalArr = []
					for(let i in this.priceData){
						let thisArr = this.priceData[i]
						let nextArr = this.priceData[Number(i) + 1]
						finalArr.push({
							min:Number(thisArr.number),
							max:nextArr ? Number(nextArr.number) - 1 : '',
							price:thisArr.price,
						})
					}
					let priceArr = {
						price:this.scPrice,
						retailPrice:finalArr
					}
					this.getSkuids(priceArr)
				}else if(this.pricingMethod == 2){//零售定价时保存
					let priceFlag = true
					if(this.specLength == 0){
						if(!priceReg.test(this.noSpecPri) || this.noSpecPri == ''){priceFlag = false}
					}else{
						this.skuList.forEach( (el, index) => {
							if(!priceReg.test(el.price) || el.price == ''){priceFlag = false}
						})
					}
					
					if(!priceFlag){
						this.$message({ message: '请正确填写销售价，小数点后两位', type: 'error' });return
					}
					this.formSkuPrice(this.skuList)
				}
					
			},
			getSkuids(priceArr){
				let params = {
					goodsId:this.goodsid
				}
				this.$api("goods.getSkuids",params).then((result) => {
					let priceData = []
					result.skuIdList.forEach((e)=>{
						priceData.push({
							sku_id:e,
							product_id:this.goodsid,
							market_price:priceArr.price,
							wholesale_price:priceArr.retailPrice
						})
					})
					this.setWholesalePrice(priceData)
				}, (error) => {
					this.$message({ message: '保存商品价格出错', type: 'error' });
				});
			},
			formSkuPrice(priceList){
				let priceData = []
				if(this.specLength == 0){
					this.$api("goods.getSkuids",{goodsId:this.goodsid}).then((result) => {
						result.skuIdList.forEach((e)=>{
							priceData.push({
									sku_id:e,
									product_id:this.goodsid,
									market_price:this.scPrice,
									wholesale_price:[{"min":1,"max":"","price":this.noSpecPri}]
							})
						})
						this.setWholesalePrice(priceData)
					}, (error) => {
						this.$message({ message: '保存商品价格出错', type: 'error' });
					});
				}else{
					priceList.forEach((item) => {
						priceData.push({
								sku_id:item.id,
								product_id:this.goodsid,
								market_price:this.scPrice,
								wholesale_price:[{"min":1,"max":"","price":item.price}]
							})
					})
					this.setWholesalePrice(priceData)
				}
				
			},
			setWholesalePrice(params){
				this.$api("goods.setGoodsPrice",{priceData:params,productId:this.goodsid,product_type:this.pricingMethod}).then((result) => {
					this.$message({ message: '保存商品价格成功', type: 'success' });
					this.$emit("change",true);
					this.dialogVisible = false
				}, (error) => {
					this.$message({ message: '保存商品价格出错', type: 'error' });
				});
			}
		},
		components: {

		},
		props: ['goodsid'],
	}
</script>
<style scope>
.padBot{
	padding-bottom:10px;
}
</style>

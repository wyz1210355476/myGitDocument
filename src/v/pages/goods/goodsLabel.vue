<template>
	<div class="contents">
		<page-title :title="'商品标签'"></page-title>
		<div class="topOp">
			<el-button type="primary" size="small" @click="showAddGoodsLabel">新增</el-button>
		</div>
		<el-table :data="labelData" size="mini" v-loading="loading">
	      	<el-table-column prop="markName" label="标签名称" >
	      		<template slot-scope="scope">
					<el-input v-if="scope.row.id==''" v-model="scope.row.markName" placeholder="请输入标签名称" class="smallInput" size="small"></el-input>
					<span v-else>{{scope.row.markName}}</span>
				</template>
	      	</el-table-column>
	      	<el-table-column label="标签背景颜色" >
				<template slot-scope="scope">
					<color-picker v-model="scope.row.backgroundColor" :disabled="scope.row.id!=''"></color-picker>
				</template>
	      	</el-table-column>
	      	<el-table-column label="标签字体颜色" >
				<template slot-scope="scope">
					<color-picker v-model="scope.row.fontColor" :disabled="scope.row.id!=''"></color-picker>
				</template>
	      	</el-table-column>
	      	<el-table-column label="操作" >
				<template slot-scope="scope">
					<span v-if="scope.row.id==''">
						<el-button size="mini" @click="cancelAdd(scope.$index)">取消</el-button>
						<el-button type="primary" @click="saveGoodsLabel(scope.$index)" size="mini">保存</el-button>
					</span>
					<span v-else>
						<el-button type="text" size="small" @click="scope.row.id=''">编辑</el-button>
						<el-popover class="ml10" placement="top" width="200" trigger="click" v-model="scope.row.popover" >
							<p>是否删除"{{ scope.row.markName }}"这个标签？</p>
							<div style="text-align: right; margin: 0">
							    <el-button size="mini" type="text" @click="scope.row.popover = false">取消</el-button>
							    <el-button type="primary" size="mini" @click="delLabel(scope.row.id,scope.$index)">确定</el-button>
							</div>
							<el-button slot="reference" type="text" size="small">删除</el-button>
						</el-popover>
					</span>
				</template>
	      	</el-table-column>
	    </el-table>
	</div>
</template>
<script>
	import pageTitle from '@components/pageTitle'
	import colorPicker from '@components/colorPicker'

	export default {
		data() {
			return {
				loading:true,
				labelData:[],
				oldLabelData:[],
			}
		},
		mounted() {
			this.getGoodsLabel()
		},
		methods: {
			saveGoodsLabel(index){
				var extend=function(o,n){
				    for (var p in n){
				        if(n.hasOwnProperty(p) && (!o.hasOwnProperty(p) ))
				            o[p]=n[p];
				    }
				    return o;
				};
				let addData = extend({},this.labelData[index])
				delete(addData.popover)
				if(this.oldLabelData[index] != undefined){
					addData.id = this.oldLabelData[index].id
				}
				let markNameReg = /^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z0-9_-]){1,15}$/
				if(!markNameReg.test(addData.markName)){
					this.$message({ message: '标签名称请输入1-15内的中文，英文，数字，-和_', type: 'error' });return
				}
				if(addData.backgroundColor == null){
					this.$message({ message: '标签背景颜色不能为空', type: 'error' });return
				}
				if(addData.fontColor == null){
					this.$message({ message: '标签字体颜色不能为空', type: 'error' });return
				}
				this.$api("goods.saveGoodsLabel",addData).then((result) => {
					this.$message({ message: '操作成功', type: 'success' });
					this.labelData[index].id = result.id
					this.oldLabelData[index] = JSON.parse(JSON.stringify(this.labelData[index]))
				}, (error) => {
					if(error.data.status==202){
						this.$message({ message: '商品标签名称重复', type: 'error' });
					}else{
						this.$message({ message: '保存商品标签出错', type: 'error' });
					}

				});
			},
			cancelAdd(index){
				let tmp = this.oldLabelData[index]
				if(tmp == undefined){
					this.labelData.splice(index,1)
				}else{
					for(let i in tmp){
						this.labelData[index][i] = tmp[i]
					}
				}
			},
			showAddGoodsLabel(){
				let addId = this.labelData.find((n)=> n.id == '')
				if(addId){return}
				this.labelData.push({
					id:'',
					markName:'',
					backgroundColor:'#FF0000',
					fontColor:'#FFFF00',
					sequence:'1'
				})
			},
			delLabel(id,index){
				let params = {ids:id}
				this.$api("goods.delGoodsLabel",params).then((result) => {
					this.$message({ message: '操作成功', type: 'success' });
					this.labelData.splice(index,1)
					this.oldLabelData.splice(index,1)
				}, (error) => {
					this.$message({ message: '删除商品标签出错', type: 'error' });
				});
			},
			getGoodsLabel(){
				let params = {}
				this.$api("goods.getGoodsLabel",params).then((result) => {
					this.loading = false
					this.labelData = result.list
					this.oldLabelData = JSON.parse(JSON.stringify(this.labelData))
				}, (error) => {
					this.loading = false
					if(error.data.status!=102){
						this.$message({ message: '查询商品标签出错', type: 'error' });
					}
				});
			},
		},
		components: {
			pageTitle,
			colorPicker
		}
	}
</script>
<style>
.colorBlock{width: 16px; height: 16px; display: inline-block; border-radius: 4px}
</style>

<template>
	<div class="contents">
		<page-title :title="'设置商品计量单位'">
			<div slot="subtitle">勾选后即可在商品计量单位下拉选框中显示</div>
		</page-title>
		<div class="topOp">
			<add-unit @change="getSuccess"><el-button type="primary" size="small">新增</el-button></add-unit>
		</div>
		<div class="unitContent">
			<el-checkbox-group v-model="checkList">
			    <el-checkbox v-for="(item,index) in unitData" :key="item.id" :disabled="item.defaulted == '1'" :label="item.id" @change="selectUnit($event,item.id,index)">{{item.name}}</el-checkbox>
			</el-checkbox-group>
			<p v-if="unitData.length==0" style="text-align:center; color:#999; ">暂无相关信息</p>
		</div>
	</div>
</template>
<script>
	import pageTitle from '@components/pageTitle'
	import addUnit from './addUnit'

	export default {
		data() {
			return {
				unitData:[],
				checkList:[],
			}
		},
		mounted() {
			this.getUnit()
		},
		methods: {
			getSuccess(val){
				this.getUnit()
			},
			getUnit(){
				this.$api("goods.getUnitList").then((result) => {
					this.unitData = result.list
					this.unitData.forEach( (el, index) => {
						if(el.status == '1'){
							this.checkList.push(el.id)
						}
					});
				}, (error) => {
					if(error.data.status!=102){
						this.$message({ message: '查询计量单位失败', type: 'error' });
					}
				});
			},
			selectUnit(e,id,index){
				let p = {
					ids:id,
					status: e ? 1 : 0
				}
				this.$api("goods.updateUnit",p).then((result) => {
					console.log(result)
					this.$message({ message: '操作成功', type: 'success' });
				}, (error) => {
					this.$message({ message: '选中计量单位失败', type: 'error' });
				});
			},
		},
		components: {
			pageTitle,
			addUnit
		}
	}
</script>
<style>
.unitContent{padding: 20px 0}
</style>

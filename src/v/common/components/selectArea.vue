<template>
	<span>
		<el-button size="mini" @click="isTrigger = true" style="margin:0 5px;">选择地区</el-button>
		<el-dialog title="选择地区" :visible.sync="isTrigger">
			<el-tree style="height:300px;overflow-y:auto"
			:data="formatArea"
			:default-checked-keys="areaids"
			show-checkbox node-key="id" ref="tree" >
			</el-tree>
			<div style="text-align:center;margin-top:10px;">
				<el-button type="primary" @click="saveAreaData()" size="small">保存</el-button>
			</div>
		</el-dialog>
	</span>
</template>

<script>
	import * as countryData from '@c/util/metaTreeCountryData'
	var areaData = countryData.formatData2();
	export default {
		data() {
			return {
				isTrigger:false,
				formatArea:[],
				expandedKeys:[],
				selectData:[]
			}
		},
		methods: {
			renderData(){
				let area = {};
				function checkArea(area,id){
					if(areaData[id]){
						area.children = [];
						for(let i in areaData[id]){
							area.children.push({
								id: i,
								label: areaData[id][i]
							})
							checkArea(area.children[area.children.length-1],i);
						}
					}
				}
				if(this.formatArea.length == 0){
					checkArea(area,"0_cn");
					this.formatArea = area.children;
				}
			},
			saveAreaData(){
				this.selectData = this.$refs.tree.getCheckedKeys();
				this.isTrigger = false;
				this.$emit('change',this.selectData)
			},
		},
		watch: {
            areaids: {
                handler(v) {
                	if(this.$refs.tree){
						this.$refs.tree.setCheckedKeys(v);
					}
                },
            },
        },
		mounted() {
			this.renderData();
		},
		props: ['areaids','resets'],
		components:{

        },
	}
</script>
<style>
.pro_page{float: right;}
.pro_footer{overflow: hidden; padding: 10px 0}
.producttable{font-size:12px; width: 100%}
</style>
<template>
	<span>
		<el-cascader
    		:options="options"
    		:props="props"
    		filterable
    		v-model="selectedOptions">
  		</el-cascader>
	</span>
</template>
<script>
	// import areaData from 'china-area-data'
	import * as areaData from '@c/util/metaTreeCountryData';

	export default {
		data() {
			return {
				options: [],
				props: {
					value: 'id',
					label: 'name',
					children: 'children'
				}
			}
		},
		props: {
			value: {
				type: [Array],
				default: []
			},
			version: {
				type: [String]
			}
		},
		computed: {
			selectedOptions: {
				get() {
					return this.value;
				},
				set(v) {
					this.$emit("input", v);
					this.$emit("change", v);
				}
			}
		},
		mounted() {
			switch (this.version) {
				//外贸版本
				case 'waimao':
					this.getCountryList();
					break;
				//默认版本（默认为内贸）
				default:
					this.options = areaData.formatData();
					break;
			}
			// this.selectedOptions = this.selected;
		},
		methods: {
			//获取国家列表
			getCountryList() {
				this.$api("address.getCountryList").then((result) => {
					this.options = result;
					this.props = {
						value: 'country_id',
						label: 'china_country_name',
						children: 'children'
					}
				}, (error) => {
					this.$message({
						type: 'error',
		            	message: '获取国家列表失败'
					});
				});
			},
			// renderData(){
			// 	let area = {};
			// 	function checkArea(area,id){
			// 		if(areaData[id]){
			// 			area.children = [];
			// 			for(let i in areaData[id]){
			// 				if (i === '710000' || i === '810000' || i === '820000') {
			// 					continue;
			// 				}
			// 				area.children.push({
			// 					value: i,
			// 					label: areaData[id][i]
			// 				})
			// 				checkArea(area.children[area.children.length-1],i);
			// 			}
			// 		}
			// 	}
			// 	if (this.options.length == 0) {
			// 		checkArea(area,86);
			// 		this.options = area.children;
			// 	}
			// }
		}
	}
</script>
<style>

</style>
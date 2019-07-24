<template>
	<span>
		<el-button :type="buttontype" size="small" @click="selectCatgory">选择分类（{{typeCount}}）</el-button>

		<el-dialog title="选择分类" :visible.sync="catVisible">
			<el-tree style="height:300px;overflow-y:auto"
			  	:data="productCatgory"
			  	:default-checked-keys="catids"
			  	:props="defaultProps" show-checkbox node-key="id" ref="productCat">
			</el-tree>
			<div style="text-align:center;margin-top:10px;">
				<el-checkbox v-model="checked" @change="selectAll">全部分类</el-checkbox>
			  	<el-button type="primary" size="small" @click="confirmCat">确定</el-button>
			</div>
		</el-dialog>
	</span>
</template>

<script>
	export default {
		data() {
			return {
				checked:false,
				buttontype:'',
				typeCount:0,
				defaultProps: {
		          children: 'childrenList',
		          label: 'categoryName'
		        },
		        catVisible:false,
		        productCatgory:[],
		        selectCatData:[],
			}
		},
		methods: {
			selectAll(){
				if(this.checked){
					let Arra = []
					this.productCatgory.forEach((row)=>{
						Arra.push(row.id)
					})
					this.$refs.productCat.setCheckedKeys(Arra);
				}else{
					this.$refs.productCat.setCheckedKeys([]);
				}
			},
			selectCatgory(){
				if(this.isEdit === true){
					return;
				}
				if(this.productCatgory.length == 0){
					this.$api("promotion.findCategoryTree",{returnType:true}).then((result) => {
						this.catVisible = true
						this.productCatgory=result.list
					}, (error) => {
						this.$message({ message: '获取分类失败', type: 'warning'});
					});
				}else{
					this.catVisible = true
				}
			},
			confirmCat(){
				this.catVisible = false
				this.selectCatData = this.$refs.productCat.getCheckedKeys();
				this.typeCount = this.selectCatData.length
				this.$emit('change',this.selectCatData)
			},
		},
		watch: {
            catids: {
                handler(v) {
                	this.typeCount = v.length || 0
                	this.checked = false
                	if(this.$refs.productCat){
						this.$refs.productCat.setCheckedKeys(v);

					}
                },
            },
        },
		mounted() {
			this.buttontype = this.button || 'primary'
			this.typeCount = this.catids.length || 0
		},
		props: ['catids','button','resets','isEdit'],
		components:{

        },
	}
</script>
<style>
.pro_page{float: right;}
.pro_footer{overflow: hidden; padding: 10px 0}
.producttable{font-size:12px; width: 100%}
</style>
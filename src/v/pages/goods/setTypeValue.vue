<template>
	<span>
		<el-button type="text" v-if="options.length == 0 && valueData.attrType != 3" size="mini" @click="editAttrValue()">点击编辑</el-button>

		<span @click="editAttrValue()"
			v-if="options.length != 0 && valueData.attrType != 3"
			v-for="(item,index) in options"
			:key="item.id">
			{{type == "attr" ? item.attributeOption : item.name}}
			<span v-if="index != (options.length-1)">, </span>
		</span>


		<el-dialog title="编辑" :visible.sync="attrVisible" v-if="attrVisible" width="800px" :before-close="attrValueClose">
			<div class="topOp">
				<el-button size="small" @click="addAttrValue" :disabled="options.length>=10">新增</el-button>
			</div>
			<el-table :data="options" size="mini" style="width: 100%" ref="opTable">
		    	<el-table-column label="名称">
					<template slot-scope="scope">
						<el-input v-if="type=='attr'" v-model="scope.row.attributeOption" size="mini" class="smallInput" placeholder="请输入内容"></el-input>
						<el-input v-if="type=='spec'" v-model="scope.row.name" size="mini" class="smallInput" placeholder="请输入内容"></el-input>
					</template>
		    	</el-table-column>
		    	<el-table-column :label="valueData.imageFlag==1 ? '图片' : ''">
					<template slot-scope="scope">
						<add-img @confirm="addImg($event,scope.$index)" v-if="valueData.imageFlag==1"><el-button size="mini" type="text">上传图片</el-button></add-img>
						<span v-if="valueData.imageFlag==1"><img :src="scope.row.imagePath" style="width:20px; height:20px; vertical-align:middle"></span>
					</template>
		    	</el-table-column>
		    	<el-table-column label="排序">
					<template slot-scope="scope">
						<el-button type="text" icon="el-icon-sort-up" @click="upData(scope.$index)" size="mini"></el-button>
						<el-button type="text" icon="el-icon-sort-down" @click="downData(scope.$index)" size="mini"></el-button>
					</template>
		    	</el-table-column>
		    	<el-table-column label="操作">
					<template slot-scope="scope">
		    			<el-button type="text" size="mini" @click="delData(scope.$index)" :disabled="scope.row.id && usecount>0">删除</el-button>
		    		</template>
		    	</el-table-column>
		    </el-table>
		  	<span slot="footer" class="dialog-footer">
		    	<el-button type="primary" @click="confirmAttrValue">确 定</el-button>
		  	</span>
		</el-dialog>
	</span>
</template>
<script>
	import addImg from '@components/addImg'

	export default {
		data() {
			return {
				attrVisible:false,
				options:[],
			}
		},
		mounted() {
			if(this.type=="attr"){
				this.options = this.valueData.attributeOptionList || []
			}else if(this.type=="spec"){
				this.options = this.valueData.specValueList || []
			}
		},
		watch: {
            valueData: {
                handler(v) {
                	console.log(this.type)
                	if(this.type=="attr"){
						this.options = v.attributeOptionList || []
					}else if(this.type=="spec"){
						this.options = v.specValueList || []
					}

                },
            },
        },
		methods: {
			addImg(val,index){
				console.log(val)
				this.options[index].imagePath = val.imgUrl
			},
			upData(index){
				if(index == 0) { return }
		    	this.options[index] = this.options.splice(index-1, 1, this.options[index])[0]
			},
			downData(index){
				if(index == this.options.length - 1) { return }
		    	this.options[index] = this.options.splice(index+1, 1, this.options[index])[0]
			},
			editAttrValue(){
				this.attrVisible = true
			},
			attrValueClose(){
				var newAttrValue = this.options.filter((element) => {
					let name;
					let len = this.type=="attr" ? 25 : 15
					if(this.type=="attr"){
						name = element.attributeOption = element.attributeOption.trim().substr(0,len)
					}else if(this.type=="spec"){
						name = element.name = element.name.trim().substr(0,len)
					}
					return name != ''
				})
				this.options = newAttrValue
				this.attrVisible = false
				this.$emit("change",{data:this.options,index:this.index})
			},
			addAttrValue(){
				let attrValue = {
					attributeOption:''
				}
				let specValue = {
					"name": "",
					"imagePath": "",
				}
				if(this.type=="attr"){
					this.options.push(attrValue)
				}else if(this.type=="spec"){
					this.options.push(specValue)
				}
			},
			delData(index){
				this.options.splice(index,1)
			},
			checkAttrValue(){
				if(this.options.length == 0){
					return true
				}else{
					let flag = true
					for(let i = 0; i<this.options.length; i++){
						let element = this.options[i];
						let name;
						if(this.type=="attr"){
							name = element.attributeOption = element.attributeOption.trim()
						}else if(this.type=="spec"){
							name = element.name = element.name.trim()
						}
						let len = this.type=="attr" ? 25 : 15
						let nameTitle = this.type=="attr" ? '属性' : '规格'
						if(name == '' ){
							this.$message({ message: '第'+(i+1)+'条'+nameTitle+'值不能为空', type: 'error' })
							flag = false
							break
						}
						if(name.length > len){
							this.$message({ message: '第'+(i+1)+'条'+nameTitle+'值长度不能超过'+len, type: 'error' })
							flag = false
							break
						}
					}
					return flag
				}
			},
			confirmAttrValue(){
				if(this.checkAttrValue()){
					this.attrVisible = false
					this.$emit("change",{data:this.options,index:this.index})
				}
			},
		},
		components: {
			addImg
		},
		props: ['valueData','index','type','usecount'],
	}
</script>
<style>

</style>

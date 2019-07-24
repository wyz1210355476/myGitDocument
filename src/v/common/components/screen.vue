<!-- 筛选表单部分 -->
<template>
<span>
<el-button type="primary" size='small' @click="dialogVisible = true">高级筛选</el-button>
<el-dialog title="高级筛选" :visible.sync="dialogVisible" class="screen">
  	<div class="filters">
		<el-form ref="form" :model="form" label-width="110px" class="screenform">

	        <el-form-item :label="item.title" v-for="item in configData" :key="item.key" :class="item.className">
	        	<!-- 输入框 -->
	            <screenInput :config="item" v-if="item.type=='input'" v-model="form[item.key]"></screenInput>
	            <!-- 下拉框 -->
	            <screenSelect :config="item" v-if="item.type=='select'" v-model="form[item.key]"></screenSelect>
	            <!-- 单个日期 -->
	            <screenDate :config="item" v-if="item.type=='date'" v-model="form[item.key]"></screenDate>
	            <!-- 远程搜索 -->
	            <screenAutocomplete :config="item" v-if="item.type=='autocomplete'" v-model="form[item.key]" @name='setAutoName'></screenAutocomplete>
	            <!-- 树形结构 -->
	            <screenTree :config="item" v-if="item.type=='tree'" v-model="form[item.key]" @name='treeName'></screenTree>
	        </el-form-item>

	        <el-form-item class="filter-button">
	            <el-button type="primary" @click="fncallback()">立即筛选</el-button>
	            <el-button type="primary" @click="reset()">重置条件</el-button>
	        </el-form-item>
	    </el-form>
	</div>
</el-dialog>
</span>
</template>



<script>
	import * as config from '@components/screenForms/config.js';
	import screenInput from '@components/screenForms/screenInput';
	import screenSelect from '@components/screenForms/screenSelect';
	import screenDate from '@components/screenForms/screenDate';
	import screenAutocomplete from '@components/screenForms/screenAutocomplete';
	import screenTree from '@components/screenForms/screenTree';
	export default {
		data() {
			return {
				dialogVisible:false,
                form:{},
                configData:[],
			}
		},
		methods: {
			reset(){},
			setAutoName(val){
				this.form.autoName=val;
			},
			treeName(val){
				this.form.treeName=val;
			},
			fncallback(){
				for(let i in this.form){
					if(this.form[i] == ''){
						delete this.form[i];
					}
				}
				// this.$router.push({
		  //          query: this.form
		  //      	});
				this.$emit('change',this.form);
			},
			init(){
				for(let i in this.keys){
					let tmpConfig = config.screenConfig.find( (n) => n.key == this.keys[i] );
					if(tmpConfig){
						this.configData.push(tmpConfig);
			            if(this.$route.query[tmpConfig.key]){
			            	this.form[tmpConfig.key] = this.$route.query[tmpConfig.key]
			            }
					}
				}
				if(this.$route.query.autoName){
					this.form.autoName = this.$route.query.autoName
				}
				if(this.$route.query.treeName){
					this.form.treeName = this.$route.query.treeName
				}
			}
		},
		mounted() {
			this.init();
		},
		props: ['keys','fun'],
		components:{
            screenInput,
            screenSelect,
            screenDate,
            screenAutocomplete,
            screenTree
        },
	}
</script>
<style>
.screenform .el-input{width: 200px;}
.el-date-editor.el-input{width: 200px;}
.search_con .screenform .el-select .el-input{width: 200px;}
.screen .el-dialog{width: 400px;  }
</style>
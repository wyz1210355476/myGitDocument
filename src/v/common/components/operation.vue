<template>
	<div class="content-operation">
		<div class="content-btn">
			<slot name="btn"></slot>
		</div>
		<div class="search_con" @keyup.enter="handleIconClick">
			<el-input placeholder="输入后直接回车确认" v-model="search.search_value" size='small' style="font-size:12px" class="search_input">
	  			<el-select v-model="search.search_select" slot="prepend" placeholder="请选择" size="small" style="font-size:12px">
			      	<el-option v-for="item in items" :label="item.label" :value="item.key" :key="item.key" style="font-size:12px"></el-option>
			    </el-select>
			    <el-button slot="append" size="small" type="primary" style="font-size:12px" @click="handleIconClick">查询</el-button>
	  		</el-input>
		</div>
	</div>
</template>
<script>
	import * as config from './operationConfig'
	import {trim} from '@c/util'
	export default {
		data() {
			return {
				search: {
					search_select: '',
					search_value: ''
				},
				rules: {
					search_value: []
				}
			}
		},
		props: ['module'],
		computed: {
			items() {
				return config.modules[this.module].options;
			}
		},
		mounted () {
			this.$nextTick(() => {
				this.search.search_select = this.items[0].key+"";
			})
			
		},
		methods: {
			handleIconClick() {
				this.search.search_value = trim(this.search.search_value);
				if (this.search.search_select == '') {
					this.$message({ type: 'error', message: '请选择类型' });
		          	return;
				}
				if (config.modules[this.module].rules && config.modules[this.module].rules[this.search.search_select]) {
					let valid = config.validate(config.modules[this.module].rules[this.search.search_select], this.search.search_value);
					if (!valid) {
						return;
					}
					// let validators = config[this.module].rules[this.search.search_select];
					// validators.forEach((v) => {
					// 	if (!v.validator(this.search.search_value)) {
					// 		valid = false;
					// 		this.$message({ type: 'error', message: v.message });
					// 		return;
					// 	}
					// });
				}
				this.$emit('search', this.search);
			},
			//清空数据
			clear() {
				this.search.search_select = '';
				this.search.search_value = '';
			}
		}
	}
</script>
<style>
.content-operation{overflow: hidden;}
.content-btn{float: left;}
.search_con{float: right;}
.search_con .el-select .el-input {width: 110px;}
.search_input .el-input-group__prepend {background-color: #fff; }
.search_con .el-form-item__error {left: 112px;}
</style>
<template>
	<div class="check-all-box" :class="{border: border}">
		<div class="check-title-box">
            <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckTitleChange">{{itemTitle.name}}</el-checkbox>
            <i class="el-icon-caret-right" v-show="tabActive == '1' && itemList.length > 0 && border" @click.self="tabActive = '0'"></i>
          	<i class="el-icon-caret-top" v-show="tabActive == '0' && itemList.length > 0 && border" @click.self="tabActive = '1'"></i>
        </div>
        <div class="check-item-box" v-if="itemList.length > 0" v-show="tabActive == '0'">
        	<el-checkbox-group v-model="checkItem" @change="handleCheckItemChange">
        		<el-checkbox  v-for="item in itemList" :key="item.id" :label="item.id">{{item.name}}</el-checkbox>
        	</el-checkbox-group>
        </div>
	</div>
</template>
<script>
	import {deepCopy} from '@c/util';
	export default {
		data() {
			return {
				checkAll: false,
				isIndeterminate: false,
				tabActive: '1'
			}
		},
		props: {
			value: {
				type: Array,
				required: true
			},
			data: {
				type: Object,
				required: true
			},
			border: {
				type: Boolean,
				default: false
			}
		},
		computed: {
			itemTitle() {
				return {
					id: this.data.id,
					name: this.data.name
				}
			},
			itemList() {
				return this.data.childrens;
			},
			itemMapList() {
				let list = [];
				this.data.childrens.forEach((v) => {
					list.push(v.id);
				});
				return list;
			},
			checkItem: {
				get() {
					return this.value;
				},
				set(v) {
					this.$emit('input', v);
				}
			}
		},
		watch: {
			checkItem: {
				handler(v) {
					this.isCheckAll();
					this.update();
				},
				deep: true
			}
		},
		mounted() {
			this.isCheckAll();
		},
		methods: {
			//是否勾选全选
			isCheckAll() {
				if (this.checkItem.length == this.itemMapList.length) {
					this.checkAll = true;
					this.isIndeterminate = false;
				} else if (this.checkItem.length != 0) {
					this.checkAll = false;
					this.isIndeterminate = true;
				} else {
					this.checkAll = false;
					this.isIndeterminate = false;
				}
			},
			//全选处理
			handleCheckTitleChange(val) {
				if (val) {
					this.checkItem = deepCopy(this.itemMapList);
				} else {
					this.checkItem = [];
				}
			},
			//子选项变更处理
			handleCheckItemChange(val) {

			},
			//抛出事件
			update() {
				this.$nextTick(() => {
					this.$emit('change', {
						checkTitelId: this.itemTitle.id,
						checkState: this.checkItem.length == this.itemMapList.length ? 2 : (this.checkItem.length == 0 ? 0 : 1),//0为未选，1为部分已选，2为全选
						checkItem: this.checkItem
					});
				});
			},
			//全选，暴露到父级的方法
			toggleAllItem(checked) {
				if (checked) {
					this.checkItem = deepCopy(this.itemMapList);
				} else {
					this.checkItem = [];
				}
			}
		}
	}
</script>
<style>
	.check-all-box.border .check-title-box i {float: right; color: #999; font-size: 18px; width: 38px; height: 38px; line-height: 38px; text-align: center; cursor: pointer;}
	.check-all-box.border .el-checkbox {width: 150px; margin-right: 30px; margin-left: 0; display: inline-block;}
	.check-all-box.border .check-title-box .el-checkbox__label,
	.check-all-box.border .check-item-box .el-checkbox__label {font-size: 12px; color: #666; height: 38px; line-height: 38px; margin-left: 20px; display: inline-block; padding-left: 0;}
	.check-all-box.border .check-title-box,
	.check-all-box.border .check-item-box {padding-left: 10px; border: 1px solid #e0e0e0;}
	.check-all-box.border .check-item-box {border-top: none; padding-left: 45px;}
</style>
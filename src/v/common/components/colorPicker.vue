<template>
	<div class="tag-color-picker-area" :class="{isEditing: !disabled}">
		<el-input v-if="!disabled" v-model="color" size="small" @blur="editColorChange"></el-input>
		<el-color-picker v-model="color" size="mini" :disabled="disabled" class="tag-color-picker" popper-class="tag-color-dropdown"></el-color-picker>
	</div>
</template>
<script>
	export default {
		data() {
			return {
				oldColor: ''
			}
		},
		props: {
			value: {
				type: [String],
				required: true
			},
			disabled: {
				type: [Boolean],
				default: false
			}
		},
		computed: {
			color: {
				get() {
					return this.value;
				},
				set(v) {
					if (/#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(v)) {
						this.oldColor = v;
					}
					this.$emit('input', v);
				}
			}
		},
		mounted() {
			if (this.value == '') {
				this.$emit('input', '#ffffff');
			}
			this.oldColor = this.value || '#ffffff';
		},
		methods: {
			editColorChange() {
				if (!/#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(this.color)) {
					this.$message({
	                    type: 'error',
	                    message: '请输入正确的颜色'
	                });
	                this.color = this.oldColor;
	                return;
				}
				this.$emit('input', this.color);
			}
		}
	}
</script>
<style>
	.tag-color-picker-area {vertical-align: middle; position: relative;}
	.tag-color-picker-area .el-color-picker--mini {height: 22px}
	.tag-color-picker-area .tag-color-picker {vertical-align: middle;}
	.tag-color-picker-area .tag-color-picker .el-color-picker__trigger {padding: 0; width: 20px !important; height: 20px !important; border-radius: 2px;}
	.tag-color-picker-area .tag-color-picker .el-color-picker__color {border: none;}
	.tag-color-picker-area .tag-color-picker .el-color-picker__icon {display: none;}
	.tag-color-picker-area .tag-color-picker .el-icon-close {display: none;}
	.tag-color-picker-area .tag-color-picker.is-disabled .el-color-picker__mask {display: none;}
	.tag-color-picker-area .el-input {width: 110px;}
	.tag-color-picker-area.isEditing .tag-color-picker {position: absolute; left: 82px; top: 6px;}
	.tag-color-dropdown .el-color-dropdown__link-btn {display: none;}
</style>
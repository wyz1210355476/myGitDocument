<template>
	<div class="radio-input-box" :class="{isSelected: val == value}">
		<div v-if="!isEditing" @click="select" class="radio-input">
			<el-input v-model="label" readonly size="small"></el-input>
			<div class="radio-input-btn-area">
				<el-button type="text" @click.stop="edit" size="mini">编辑</el-button>
    			<el-button type="text" @click.stop="del" size="mini">删除</el-button>
			</div>
		</div>
		<div v-if="isEditing" class="radio-input">
			<el-input v-model="label" size="small"></el-input>
			<div class="radio-input-btn-area">
    			<el-button type="text" @click="save" size="mini">保存</el-button>
			</div>
		</div>
	</div>
</template>
<script>
	export default {
		data() {
			return {
				label: '',
				isEditing: false  //是否编辑中
			}
		},
		props: {
			lab: {
				type: [String, Number],
				required: true
			},
			val: {
				type: [String, Number],
				required: true
			},
			value: {
				type: [String, Number],
				required: true
			}
		},
		watch: {
			'lab': {
				handler(v) {
					this.label = this.lab ? this.lab : '';
				},
				deep: true
			}
		},
		mounted() {
			this.label = this.lab ? this.lab : '';
		},
		methods: {
			select() {
				this.$emit('input', this.val);
			},
			edit() {
				this.isEditing = true;
				this.isReadonly = false;
			},
			del() {
				this.$emit("delete", this.val);
			},
			save() {
				this.isEditing = false;
				this.isReadonly = true;
				//若数据无改变，则不往外分发save事件
				if (this.label == this.lab) {
					return;
				}
				this.$emit("save", {
					label: this.label,
					value: this.val
				});
			}
		}
	}
</script>
<style>
	.radio-input-box {margin-bottom: 10px; max-width: 500px;}
	.radio-input { position: relative; border: 1px solid #ddd; line-height: 30px;}
	.radio-input-box.isSelected .radio-input {border-color: #409eff;}
	.radio-input .el-input--small .el-input__inner { width: 100%; border: none; }
	.radio-input .radio-input-btn-area { position: absolute; right: 10px; bottom: 0px; }
</style>
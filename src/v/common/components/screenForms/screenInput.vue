<template>
    <el-input v-model="currentData" clearable :placeholder="placeholder" size="small"></el-input>
</template>
<script>
	export default {
		data() {
            return {
                placeholder:"请输入",
                default:this.$route.query[this.config.key],
            }
        },
		computed:{
			currentData: {
				get:function() {
					//return this.default;
					return this.$route.query[this.config.key] || ''
				},
				set:function(val) {
					this.$emit('input', val);
				}
			}
		},
		mounted() {
            this.placeholder = this.config.placeholder ? this.config.placeholder : this.placeholder;
        },
		props: ['config'],
	}
</script>
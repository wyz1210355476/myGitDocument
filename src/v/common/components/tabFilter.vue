<template>
	<el-tabs v-model="activeName" @tab-click="handleClick">
	    <el-tab-pane v-for="item in options" :key="item.label" class="tabs-custom" :name="item.name">
	    	<span slot="label">{{item.label}}<span v-if="activeName === item.name && total && total !== 0">({{total}})</span></span>
	    </el-tab-pane>
	 </el-tabs>
</template>
<script>
	export default {
		data() {
			return {
				activeName: this.$route.query[this.param] || this.options[0].name
			}
		},
		props: ['param', 'total', 'options', 'fn', 'norouter'],
		mounted() {
			if (!this.norouter && !this.$route.query[this.param]) {
				let key = this.param ? this.param : 'tab';
				this.$router.push({
					query: {
						[key]: this.activeName
					}
				});
			}
		},
		methods: {
			handleClick(tab, event) {
				if (!this.norouter) {
					let key = this.param ? this.param : 'tab';
					this.$router.push({
						query: {
							[key]: tab.name
						}
					});
				}
				if (this.fn) {
					this.fn(tab.name);
				}
				this.$emit('click', tab.name);
			}
		}
	}
</script>
<style>
.el-tabs__header{background:#f5f5f5; padding: 0 15px}
.el-tabs__nav-wrap::after{display: none}
.el-tabs__item{height:40px; line-height: 40px;}
</style>
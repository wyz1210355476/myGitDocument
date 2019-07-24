<template>
	<div>
		<el-dialog
		  	title="消息查看"
		  	:visible.sync="visible"
		  	@close="closeDialog">
		  	<div>
		  		<message-info :type="type" :id="id"></message-info>
		  		<div class="btn-area bottom">
					<el-button @click="cancel" size="small" plain>关闭</el-button>
				</div>
		  	</div>
		</el-dialog>
	</div>
</template>
<script>
	import messageInfo from './messageInfo';
	import dialogVisibility from '@c/mixins/dialogVisibility';
	export default {
		data() {
			return {

			}
		},
		props: ['id', 'type'],
		mixins: [dialogVisibility],
		methods: {
			cancel() {
				this.visible = false;
				if (this.type == 'in') {
					this.$emit("close");
				}
			},
			closeDialog() {
				if (this.type == 'in') {
					this.$emit("close");
				}
			}
		},
		components: {
			messageInfo
		}
	}
</script>
<style>

</style>
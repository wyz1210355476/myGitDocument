<template>
	<el-dialog
	  	:title="title"
	  	:visible.sync="visibility"
	  	size="tiny"
	>
		<span>asdasdfdfas</span>
	  	<!-- <span>123231<slot name="content"></slot></span> -->
	  	<span slot="footer" class="dialog-footer">
	  		<el-button type="primary" @click="sure">确 定</el-button>
	    	<el-button @click="cancel">取 消</el-button>
	  	</span>
	</el-dialog>
</template>
<script>
	export default {
		data() {
			return {

			}
		},
		props: ['visibility', 'title', 'cancel', 'sure']
	}
</script>
<style>

</style>
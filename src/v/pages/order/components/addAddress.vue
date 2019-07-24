<template>
	<div class="order-form">
		<el-dialog
		  	:title="(address_id && address_id != '') ? '编辑收货地址' : '新增收货地址'"
		  	:visible.sync="visible">
			<add-address :client_id='client_id' :address_id="address_id" :showAsDialog="true" @save="saveDetail" @cancel="cancelDetail"></add-address>
		</el-dialog>
	</div>
</template>
<script>
	import dialogVisibility from '@c/mixins/dialogVisibility';
	import addAddress from '@v/pages/address/addAddress'
	export default {
		data() {
			return {

			}
		},
		props: {
			client_id: {
				type: [String, Number],
				required: true
			},
			address_id: {
				type: [String, Number]
			}
		},
		mixins: [dialogVisibility],
		methods: {
			saveDetail(msg) {
				this.$emit("save", msg);
			},
			cancelDetail() {
				this.visible = false;
			}
		},
		components: {
			addAddress
		}
	}
</script>
<style scoped>
.add-address-area {width: 608px;}
.input-prompt {font-size: 12px; color: #ccc;}
</style>
<template>
	<div class="order-form">
		<div class="infos" v-loading="isLoading">
			<div class="info multi-line">
				<span class="info-label">{{type == 'out' ? '收件人' : '发件人'}}：</span>
				<span class="info-value">{{type == 'out' ? messageInfo.to_uname : messageInfo.from_uname}}</span>
			</div>
			<div class="info">
				<span class="info-label">发送时间：</span>
				<span class="info-value">{{messageInfo.send_time}}</span>
			</div>
			<div class="info" v-if="type == 'in'">
				<span class="info-label">IP地址:</span>
				<span class="info-value">{{messageInfo.from_ip}}</span>
			</div>
			<div class="info multi-line">
				<span class="info-label">标题：</span>
				<span class="info-value">{{messageInfo.title}}</span>
			</div>
			<div class="info multi-line">
				<span class="info-label">内容：</span>
				<span class="info-value">{{messageInfo.content}}</span>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				messageInfo: {},
				isLoading: false
			}
		},
		props: ['id', 'type'],
		mounted() {
			this.getMessageDetail();
		},
		methods: {
			getMessageDetail() {
				this.isLoading = true;
				if (this.type == 'in') {
					this.$api("stationM.viewInMessage", {id: this.id}).then((result) => {
						this.messageInfo = result;
						if (result.is_read == 0) {
							this.setMessageRead();
						}
						this.$emit('getTitle', result);
						this.isLoading = false;
					}, (error) => {
						this.$message({
			            	type: 'error',
			            	message: '加载数据出错'
			          	});
			          	this.isLoading = false;
					});
				}
				if (this.type == 'out') {
					this.$api("stationM.viewOutMessage", {id: this.id}).then((result) => {
						this.messageInfo = result;
						this.$emit('getTitle', result);
						this.isLoading = false;
					}, (error) => {
						this.$message({
			            	type: 'error',
			            	message: '加载数据出错'
			          	});
			          	this.isLoading = false;
					});
				}
			},
			setMessageRead() {
				this.$api("stationM.seeMessage", {id: this.id}).then((result) => {

				}, (error) => {
					this.$message({
		            	type: 'error',
		            	message: '设置信息已读出错'
		          	});
				});
			}
		}
	}
</script>
<style>

</style>
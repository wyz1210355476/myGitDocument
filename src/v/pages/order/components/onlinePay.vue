<template>
	<div class="order-form">
		<el-dialog
		  	title="支付"
		  	:visible.sync="visible"
		  	width="600px">
		  	<div v-loading="isLoading">
		  		<div class="pay-box">
		  			<h2>{{amount | toFixed(2)}}</h2>
		  			<!-- <vue-q-art ref="qart" :config="config" v-if="config.value != ''"></vue-q-art> -->
		  			<img :src="qrImg" v-if="webURL == ''" style="display:block; margin: 0 auto;">
					<qrcode
						v-if="webURL != ''"
						:value="webURL"
						:options="{ size: 200 }">
					</qrcode>
		  			<p style="font-size: 12px; color: #666;">请使用支付宝或者微信扫码完成支付</p>
		  		</div>
				<div class="btn-area">
					<el-button @click="cancel" size="small" plain>取消</el-button>
					<el-button type="primary" class="btn-send" @click="alreadyPay" size="small">已完成支付</el-button>
				</div>
			</div>
		</el-dialog>
	</div>
</template>
<script>
	import dialogVisibility from '@c/mixins/dialogVisibility';
	import orderApi from '@c/mixins/orderApi';
	import qrImg from '@v/common/images/qrImg.png';
	// import VueQArt from 'vue-qart';
	import Qrcode from '@xkeshi/vue-qrcode';
	export default {
		data() {
			return {
				// onlinePaySrc: ''
				// config: {
				// 	value: '',
		  //           imagePath: qrImg,
		  //           filter: 'color',
		  //           size: 200
				// }
				webURL: '',
				qrImg: qrImg,
				isLoading: false
			}
		},
		mixins: [dialogVisibility, orderApi],
		props: {
			id: {
				type: [String, Number],
				required: true
			},
			amount: {
				type: [String, Number],
				required: true
			}
		},
		mounted() {
			this.getPaySrc();
		},
		methods: {
			getPaySrc() {
				this.isLoading = true;
				this.$api(this.orderApi[this.$version] + ".getOnceQRCode", {orderId: this.id, totalAmount: this.amount}).then((result) => {
					this.isLoading = false;
					if (result.billStatus != 'UNPAID') {
						this.$message({
	                        type: 'error',
	                        message: '订单已支付，请勿重复支付！'
	                    });
	                    this.visible = false;
						return;
					}
					this.webURL = result.billQRCode;
					// this.config.value = result.billQRCode;
					// console.log(this.$refs.qart)
				}, (error) => {
					this.isLoading = false;
					this.$message({
                        type: 'error',
                        message: '获取支付二维码失败！'
                    });
				});
			},
			alreadyPay() {
				this.$emit('paid');
				this.visible = false;
			},
			cancel() {
				this.visible = false;
			}
		},
		components: {
			// VueQArt
			Qrcode
		}
	}
</script>
<style scoped>
	.pay-box {text-align: center;}
	.pay-box img {width: 200px; height: 200px;}
</style>
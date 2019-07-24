<template>
	<div class="contents">
		<div style="width:600px">
		<img-lib @confirm="getImg" :multiple="multiple"></img-lib>
		<span class="floatR">
			<el-button size="small" @click="cancel">取 消</el-button>
			<el-button size="small" type="primary" @click="confirm">确 定</el-button>
		</span>
		</div>
	</div>
</template>
<script>
	import imgLib from '@components/imgLib'

	export default {
		data() {
			return {
				selectImg:'',
				multiple:false,
			}
		},
		mounted() {
			if(this.$route.query.multiple == 'true'){
				this.multiple = true
			}
			console.log(this.multiple)
			document.domain = 'yun300.cn'
		},
		methods: {
			getImg(val){
				this.selectImg = val
			},
			cancel(){
				console.log('取消')
				parent.M.Dialog.ChooseImage.close();
			},
			confirm(){
				if(this.selectImg == '' || this.selectImg.length == 0){
					this.$message({
			          	message: '请选择图片',
			          	type: 'error'
			        });return
				}
				console.log('确定',this.selectImg)
				parent.M.Dialog.ChooseImage.onChooseImage(this.selectImg);
			},
		},
		components: {
			imgLib,
		}
	}
</script>
<style>

</style>

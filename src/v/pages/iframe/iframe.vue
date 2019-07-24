<template>
	<div class="contents" v-loading="loading">
		<iframe :src="iframeUrl" class="iframe" @load="loading=false" frameborder="0" ></iframe>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				loading:true
			}
		},
		watch:{
			iframeUrl(v){
				if(v == '/407'){
					this.$router.push({path:'/'})
					return
				}
				var iframe = document.getElementsByClassName("iframe");
			}
		},
		computed:{
			iframeUrl(){
				return this.$route.query.iframe || '/407'
			}
		},
		mounted() {

		},
		methods: {

		},
		components: {

		}
	}
</script>
<style scoped="scoped">
.iframe{width: 100%; height:calc(100% - 20px)}
</style>


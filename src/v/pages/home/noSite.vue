<template>
	<div class="siteCon">
		<h1 class="title">您还没有自己的企业网站</h1>
		<p class="subtitle">来了解一下我们为您推荐的产品</p>
		<div class="siteInfo">
			<div class="item">
				<i class="item1"></i>
				<h2>多端交易</h2>
				<p>PC&移动多端呈现</p>
			</div>
			<div class="item">
				<i class="item2"></i>
				<h2>批零一体</h2>
				<p>可批发可零售，可阶梯定价</p>
			</div>
			<div class="item">
				<i class="item3"></i>
				<h2>在线支付</h2>
				<p>支持微信、支付宝主流支付方式</p>
			</div>
		</div>
		<div class="checkMore">
			<a target="_blank" href="http://www.300.cn/qiyejianzhan/shangcheng.html">了解产品</a>
		</div>
	</div>
</template>
<script>
	export default {
		data() {
			return {

		    }
		},
		mounted() {
			this.$emit('change',true)
		},
		methods: {

		},
		components: {

		}
	}
</script>
<style scoped>
h1,h2,p{margin:0; padding: 0; font-weight: normal;}
.siteCon{
	margin:10px;
	padding: 10px;
	background: #fff;
	height: calc(100% - 40px);
	overflow-y: auto;
	text-align: center;
	min-width: 1100px;
}
.siteCon .title{
	font-weight: normal;
	color: #79d3f9;
	font-size: 32px;
	line-height: 80px;
}
.siteCon .subtitle{
	color: #999;
	font-size: 14px;
	line-height: 30px;
}
.siteInfo{
	padding-top:60px;
	padding-bottom: 60px;
	overflow: hidden;
}
.siteInfo .item{display:inline-block; width: 280px; height: 400px; border:1px solid #d9e1e8; box-sizing:border-box; border-radius: 10px; box-shadow: #d9e1e8 0 0 10px;}
.siteInfo .item i{display: inline-block; width: 225px; height: 204px; background-size: 100%; margin:60px 0 20px }
.siteInfo .item .item1{background: url(../../common/images/item1.jpg) no-repeat center;}
.siteInfo .item .item2{background: url(../../common/images/item2.jpg) no-repeat center;}
.siteInfo .item .item3{background: url(../../common/images/item3.jpg) no-repeat center;}
.siteInfo .item+.item{margin-left: 50px}
.siteInfo .item h2{font-size: 20px; color: #333; line-height: 40px}
.siteInfo .item p{font-size: 14px; color: #666}
.checkMore a{display: inline-block; width: 245px; height: 30px; line-height: 30px; background: #2290e8; color:#fff; text-decoration: none; border-radius: 4px}
</style>

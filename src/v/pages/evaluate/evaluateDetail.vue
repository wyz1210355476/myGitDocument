<template>
	<div v-loading="loading">
		<!-- <page-title :title="'评论商品'" goback></page-title> -->
		<div class="product">
			<div class="img">
				<img :src="detail.object_img" style="max-width:100%; width:500px; ">
			</div>
			<div class="eva_con">
			<p>商品名称：{{detail.object_name}}</p>
			<p>商品链接： {{detail.object_link}}</p>
			<p>发表人： {{detail.appraiser_name}}</p>
			<p>联系方式： {{detail.appraiser_contact}}</p>
			<p>发表时间： {{detail.judgement_date}}</p>
			<!-- <p>发表人IP： {{detail.ip_address}}</p> -->
			</div>
		</div>
		<div class="eva_content">
			<h5>发表内容：
				<el-button type="text" size="small" @click="opEva(detail.display==1?'0':'1')">[{{detail.display==1?'隐藏':'显示'}}]</el-button>
				<el-button type="text" size="small" @click="delEva()">[删除]</el-button>
			</h5>
			<p>内容：{{detail.content}}</p>
		</div>
		<div class="eva_content" v-if="replyData.length != 0">
			<div class="replay" v-for="item in replyData">
				<h5>{{item.admin_name}}于[{{item.reply_date}}]回复：
					<el-button type="text" size="small" @click="opReplay(item.reply_status==1?'0':'1',item.id)">[{{item.reply_status==1?'隐藏':'显示'}}]</el-button>
					<el-button type="text" size="small" @click="delReplay(item.id)">[删除]</el-button>
				</h5>
				<p>内容：{{item.reply_content}}</p>
			</div>
		</div>
		<div class="replayForm">
			<span class="floatL">回复用户：</span>
			<el-input class="floatL" type="textarea" v-model="replay" size="small"></el-input>
			<el-button class="floatL ml10" type="text" @click="replayEva" size="small">立即回复</el-button>

		</div>
	</div>
</template>
<script>
	import pageTitle from '@components/pageTitle';
	import pages from '@components/pages';

	export default {
		data() {
			return {
				loading:true,
				id:'',
				detail:'',
				replay:'',
				replyData:[]
			}
		},
		watch:{
			detailid(){
				this.id = this.detailid;
				if(this.id != 0){
					this.loading = true
					this.product = []
					this.getDetail();
				}else{
					this.$message({ message: '查询活动数据出错', type: 'error' });
				}
			}
		},
		mounted() {
			this.id = this.detailid
			if(this.id != 0){
				this.getDetail();
			}else{
				this.$message({ message: '查询评论数据出错', type: 'error' });
			}
		},
		methods: {
			opEva(key){
				this.$api("evalute.displaying",{id:this.id}).then((result) => {
					this.detail.display = result.display
					this.$message({ message: '操作成功', type: 'success' });
				}, (error) => {
					this.$message({ message: '操作失败', type: 'error' });
				});
			},
			opReplay(key,id){
				this.$api("evalute.replyst",{id:id}).then((result) => {
					let replay = this.replyData.find((n)=>n.id == id)
					replay.reply_status = result.reply_status
					this.$message({ message: '操作成功', type: 'success' });
				}, (error) => {
					this.$message({ message: '操作失败', type: 'error' });
				});
			},
			delEva(){
				this.$confirm('是否要删除这条评论？', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
		          	let ids = [];
					ids.push(this.id)
					this.$api("evalute.deleteEvalute",{ids:ids.join(",")}).then((result) => {
						this.$emit("close",true)
						this.$message({ message: '删除成功', type: 'success' });
					}, (error) => {
						this.$message({ message: '删除失败', type: 'error' });
					});
		        }).catch(() => {

		        });
			},
			delReplay(id){
				this.$confirm('是否要删除这条评论回复？', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
					this.$api("evalute.delreply",{id:id}).then((result) => {
						this.getDetail();
						this.$message({ message: '删除成功', type: 'success' });
					}, (error) => {
						this.$message({ message: '删除失败', type: 'error' });
					});
		        }).catch(() => {

		        });
			},
			replayEva(){
				if(this.replay.trim() == ''){
					this.$message({ message: '请输入回复内容', type: 'warning' });return
				}
				this.$api("evalute.replay",{id:this.id,content:this.replay}).then((result) => {
					this.getDetail();
					this.replay='';
					this.$message({ message: '回复成功', type: 'success' });
				}, (error) => {
					this.$message({ message: '回复失败', type: 'error' });
				});
			},
			getDetail(){
				this.$api("evalute.getEvaluteDetail",{id:this.id}).then((result) => {
					this.loading=false
					this.detail = result
					this.replyData = result.replies || []
				}, (error) => {
					this.loading=false
					this.$message({ message: '查询评价详情出错', type: 'error' });
				});
			},
		},
		components: {
			pageTitle,
			pages
		},
		props: ['detailid'],
	}
</script>
<style>
.product{border-bottom: 1px solid #efefef; overflow: hidden; font-size:12px; padding-bottom: 20px; padding-left: 220px; position: relative; height: 150px;}
.product .img{float: left; width: 200px; height: 150px; margin-right: 20px; background: url('../../common/images/imgerror.jpg') #e4e4e4; background-size: 100% auto; background-position: center; background-repeat: no-repeat; position: absolute; left: 0; top: 0}
.product .img img{max-width: 100%}
.product .eva_con{float: left;}
.product p{margin: 0; line-height: 30px; height: 30px;
	overflow: hidden;
	text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;}
.eva_content{padding: 10px 0;border-bottom: 1px solid #efefef; max-height: 130px; overflow-y:auto }
.eva_content p,.eva_content h5{margin:0;}
.eva_content .replay{margin-bottom: 10px; }
.replayForm{padding: 20px 0 0; overflow: hidden; line-height: 30px;}
.replayForm .el-textarea{width: 600px;}
</style>

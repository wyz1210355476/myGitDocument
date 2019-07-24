<template>
    <div>
		<el-dialog
		  	title="推荐明细"
		  	:visible.sync="visible">
		  	<div v-loading="isLoading">   
		  		<el-table :data="dataList" style="min-width: 100%;overflow:auto" size="mini" class="table-one-line" height="400">
    				<el-table-column label="注册时间" prop="addtime" width="150">
                	</el-table-column>
                	<el-table-column label="推荐类型">
                		<template slot-scope="scope">
                        	<div class="one-line" :title="scope.row.recommend | toRecomend">{{scope.row.recommend | toRecomend}}</div>
                    	</template>
                	</el-table-column>
                	<el-table-column label="账户名称">
                		<template slot-scope="scope">
                        	<div class="one-line" :title="scope.row.loginid">{{scope.row.loginid}}</div>
                    	</template>
                	</el-table-column>
                	<el-table-column label="手机号码">
                		<template slot-scope="scope">
                        	<div class="one-line" :title="scope.row.mobile">{{scope.row.mobile}}</div>
                    	</template>
                	</el-table-column>
                	<el-table-column label="已返利次数">
                		<template slot-scope="scope">
	                		<div class="one-line" :title="scope.row.rebate_count">{{scope.row.rebate_count}}</div>
	                	</template>
                	</el-table-column>
                    <el-table-column label="返利状态">
                		<template slot-scope="scope">
	                		<div class="one-line" :title="scope.row.rebateStatus | toRebateStatus">{{scope.row.rebateStatus | toRebateStatus}}</div>
	                	</template>
                	</el-table-column>
		  		</el-table>
		  	</div>
            <pages :total="totalCount" @change="getPagesParam('page')"></pages>
		  	<div slot="footer">
			  	<el-button plain size="small" @click="cancel">关闭</el-button>
		  	</div>
		</el-dialog>
	</div>
</template>
<script>
import dialogVisibility from '@c/mixins/dialogVisibility';
import pages from '@components/pages'
export default {
    data() {
			return {
				dataList: [],
                isLoading: false,
				totalCount:0
			}
		},
		props: {
			id: {
				type: [String, Number],
				required: true
			}
		},
		mixins: [dialogVisibility],
		filters: {
			// 返利状态
			toRebateStatus(v){
				let show;
				switch(v+""){
					case "1": 
						show = "返利中";
						break;
					case "2":
						show = "已结束";
						break;
				}
				return show;
			},
			// 推荐类型
			toRecomend(v){
				let show;
				switch(v+""){
					case "1":
						show = "直接推荐"
						break;
					case "2":
						show = "间接推荐";
						break;
				}
				return show;
			}
		},
        mounted() {
			this.getRecommendRebate();
        },
        methods: {
            getRecommendRebate(obj){
				let params = {
					'uid':this.id,
					'page':1,
					'pageSize':10
				}
				if(obj){Object.assign(params, obj)}
				this.$api("rebate.recommendRebate",params).then((result) => {
					this.dataList = result.list;
					this.totalCount = result.page.total;
				},(error) => {
					if(error.data.status == 102){
						this.dataList = [];
						this.totalCount = 0;
					}else{
						this.$message({
							message: error.data.msg,
							type: 'error'
						});
					}
				})
			},
			// 分页
			getPagesParam(){
				this.getRecommendRebate({
					'pageSize':this.$route.query.pageSize ? this.$route.query.pageSize : 10,
					'page':this.$route.query.currentPage ? this.$route.query.currentPage : 1
				})
			},
            //关闭
			cancel() {
				this.visible = false;
            }
        },
		components: {
			pages
		}
}
</script>
<style scoped>
    .overviewBox{
        margin: 0 0 20px 20px;
    }
    .overview{
        display: inline-block;
        width: 20%;
        font-size: 20px;
    }
</style>

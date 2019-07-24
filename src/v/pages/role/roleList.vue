<template>
	<div class="contents">
		<page-title :title="'角色列表'"></page-title>
		<div style="overflow:hidden">
			<el-button type="primary" size='small' @click="addRole">添加角色</el-button>
		</div>
		<div class="content-table">
			<el-table :data="tableData" stripe class="table_list">
				<el-table-column type="index" label="编号"></el-table-column>
			    <el-table-column prop="date" label="角色名称"></el-table-column>
			    <el-table-column label="操作">
			      	<template slot-scope="scope">
				        <el-button size="small">修改</el-button>
				        <el-button size="small">包含用户</el-button>
			      	</template>
			    </el-table-column>
			</el-table>
		</div>
		<pages :total="totalCount" @change="getPagesParam"></pages>
	</div>
</template>
<script>
	import pageTitle from '@components/pageTitle';
	import pages from '@components/pages';

	export default {
		data() {
			return {
				totalCount: 10,
				tableData: [{
			          date: '2016-05-03',
			        }, {
			          date: '2016-05-02',
			        }, {
			          date: '2016-05-04',
			        }, {
			          date: '2016-05-01',
			    }]
			}
		},
		mounted() {
			this.getDeliverModeList();
		},
		methods: {
			addRole(){
				this.$router.push({name:"addRole"})
			},
			handleIconClick(){
				alert("点击搜索")
			},
		},
		components: {
			pageTitle,
			pages
		}
	}
</script>
<style>
.search_con{float: right;}
.search_con .el-select .el-input {width: 110px;}
.table_list{font-size: 12px;}
</style>

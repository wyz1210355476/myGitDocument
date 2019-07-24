<template>
	<div class="contents">
		<page-title title="客户标签"></page-title>
		<el-button type="primary" size="small" @click="addNewTag">新增</el-button>
		<div class="content-table">
			<el-table :data="tagList" style="width: 100%" size="mini" v-loading="isLoading" class="table-one-line">
				<el-table-column label="标签名称">
					<template slot-scope="scope">
						<span v-if="!scope.row.editable" class="one-line" :title="scope.row.name">{{scope.row.name}}</span>
						<el-input v-if="scope.row.editable" v-model="scope.row.name" size="small"></el-input>
					</template>
                </el-table-column>
                <el-table-column label="标签背景色">
                	<template slot-scope="scope">
                		<color-picker v-model="scope.row.backgroundcolor" :disabled="!scope.row.editable"></color-picker>
                	</template>
                </el-table-column>
                <el-table-column label="标签字体颜色">
                	<template slot-scope="scope">
                		<color-picker v-model="scope.row.fontcolor" :disabled="!scope.row.editable"></color-picker>
                	</template>
                </el-table-column>
                <el-table-column label="操作">
            		<template slot-scope="scope">
            			<div class="table-operation" v-if="!scope.row.editable">
            				<el-button type="text" @click="editTag(scope.row)" size="small">编辑</el-button>
            				<el-popover
					        	placement="top"
					        	width="200"
					        	trigger="click"
					        	v-model="scope.row.popover"
				        		>
								<p>确定删除该标签吗？</p>
								<div style="text-align: right; margin: 0">
								    <el-button size="mini" type="text" @click="scope.row.popover = false">取消</el-button>
								    <el-button type="primary" size="mini" @click="delTag(scope.row.id)">确定</el-button>
								</div>
								<el-button slot="reference" type="text" size="small">删除</el-button>
							</el-popover>
            			</div>
            			<div class="table-operation" v-if="scope.row.editable">
            				<el-button type="primary" size="mini" @click="saveEdit(scope.row)" :loading="isBtnLoading">保存</el-button>
            				<el-button size="mini" @click="cancelEdit(scope.row)" plain>取消</el-button>
            			</div>
            		</template>
            	</el-table-column>
			</el-table>
		</div>
	</div>
</template>
<script>
	import pageTitle from '@components/pageTitle';
	import colorPicker from '@components/colorPicker';
	export default {
		data() {
			return {
				tagList: [],
				oldTagList: {},
				isLoading: false,
				isBtnLoading: false
			}
		},
		mounted() {
			this.getTagList();
		},
		methods: {
			//标签列表
			getTagList() {
				this.isLoading = true;
				this.$api("member.getTagList").then((result) => {
					this.tagList = result;
					this.isLoading = false;
				}, (error) => {
					this.isLoading = false;
                    if (error && error.data && error.data.status == 102) {
                    	this.tagList = [];
                    } else {
                    	this.$message({
                            type: 'error',
                            message: '加载数据出错'
                        });
                    }
				});
			},
			//新增客户标签
			addNewTag() {
				if (this.tagList.length != 0 && this.tagList[this.tagList.length -1].id == '') {
					return;
				}
				this.tagList.push({
					id: '',
					name: '',
					backgroundcolor: '#ff0000',
					fontcolor: '#ffff00',
					editable: true
				});
			},
			//编辑客户标签
			editTag(row) {
				if (this.oldTagList[row.id]) {
					row.editable = true;
				} else {
					this.oldTagList[row.id] = {
						id: row.id,
						name: row.name,
						backgroundcolor: row.backgroundcolor,
						fontcolor: row.fontcolor
					};
					this.$set(row, 'editable', true);
				}
			},
			//保存客户标签
			saveEdit(row) {
				if (row.name == '' || !/^[0-9a-zA-Z\u4e00-\u9fa5]{1,20}$/.test(row.name)) {
					this.$message({
                        type: 'error',
                        message: '请输入正确的标签名称！'
                    });
                    return;
				}
				this.isBtnLoading = true;
				if (row.id == '') {
					this.saveNewTag(row);
				} else {
					this.saveEditTag(row);
				}
			},
			//保存新增的客户标签
			saveNewTag(row) {
				let data = {
					name: row.name,
					backgroundcolor: row.backgroundcolor,
					fontcolor: row.fontcolor
				};
				this.$api("member.addTag", data).then((result) => {
					this.$message({
                        type: 'success',
                        message: '保存成功!'
                    });
                    row.id = result.id;
					row.editable = false;
					this.isBtnLoading = false;
				}, (error) => {
					if (error && error.data && error.data.status == 201) {
						this.$message({
	                        type: 'error',
	                        message: error.data.msg
	                    });
					} else {
						this.$message({
	                        type: 'error',
	                        message: '保存失败！'
	                    });
					}
                    this.isBtnLoading = false;
				});
			},
			//保存编辑的客户标签
			saveEditTag(row) {
				let data = {
					'where[id]': row.id,
					'data[name]': row.name,
					'data[backgroundcolor]': row.backgroundcolor,
					'data[fontcolor]': row.fontcolor
				}
				this.$api("member.editTag", data).then((result) => {
					this.$message({
                        type: 'success',
                        message: '保存成功!'
                    });
					row.editable = false;
					this.oldTagList[row.id] = {
						id: row.id,
						name: row.name,
						backgroundcolor: row.backgroundcolor,
						fontcolor: row.fontcolor
					};
					this.isBtnLoading = false;
				}, (error) => {
					if (error && error.data && error.data.status == 201) {
						this.$message({
	                        type: 'error',
	                        message: error.data.msg
	                    });
					} else {
						this.$message({
	                        type: 'error',
	                        message: '保存失败！'
	                    });
					}
                    this.isBtnLoading = false;
				});
			},
			//取消
			cancelEdit(row) {
				if (row.id == '') {
					this.tagList.splice(this.tagList.length-1, 1);
				} else {
					row.editable = false;
					for (var i in this.oldTagList[row.id]) {
						row[i] = this.oldTagList[row.id][i];
					}
				}
			},
			//删除客户标签
			delTag(id) {
				this.$api("member.delTag", {id: id}).then((result) => {
					this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    let index = this.tagList.findIndex(n => n.id == id);
                    if (index > -1) {
                    	this.tagList.splice(index, 1);
                    }
				}, (error) => {
					if (error && error.data && error.data.status == 201) {
						this.$message({
	                        type: 'error',
	                        message: error.data.msg
	                    });
					} else {
						this.$message({
	                        type: 'error',
	                        message: '删除失败！'
	                    });
					}
				});
			}
		},
		components: {
			pageTitle,
			colorPicker
		}
	}
</script>
<style>

</style>
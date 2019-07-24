<template>
	<div class="contents">
		<page-title title="客户分组"></page-title>
		<el-button type="primary" size="small" @click="addNewLevel">新增</el-button>
		<div class="content-table">
			<el-table :data="levelList" style="width: 100%" size="mini" v-loading="isLoading">
				<el-table-column label="分组名称">
					<template slot-scope="scope">
						<span v-if="!scope.row.editable">{{scope.row.name}}</span>
						<el-input v-if="scope.row.editable" v-model="scope.row.name" size="small"></el-input>
					</template>
                </el-table-column>
                <el-table-column label="分组图标">
                	<template slot-scope="scope">
                		<img :src="scope.row.level_ico" class="member-level-coin">
                		<add-img @confirm="getIconImg($event, scope.row)" v-if="scope.row.editable">
                			<el-button size="mini" plain>选择</el-button>
                		</add-img>
                	</template>
                </el-table-column>
                <!-- <el-table-column label="默认折扣率%">
                	<template slot-scope="scope">
                		<span v-if="!scope.row.editable">{{scope.row.discount | toFixed(2)}}</span>
						<el-input v-if="scope.row.editable" v-model="scope.row.discount" size="small"></el-input>
                	</template>
                </el-table-column>
                <el-table-column label="消费额度(元)">
                	<template slot-scope="scope">
                		<span v-if="!scope.row.editable">{{scope.row.monetary | toFixed(2)}}</span>
						<el-input v-if="scope.row.editable" v-model="scope.row.monetary" size="small"></el-input>
                	</template>
                </el-table-column> -->
                <el-table-column label="操作">
            		<template slot-scope="scope">
            			<div class="table-operation" v-if="!scope.row.editable">
            				<el-button type="text" @click="editLevel(scope.row)" size="small">编辑</el-button>
            				<el-popover
					        	placement="top"
					        	width="200"
					        	trigger="click"
					        	v-model="scope.row.popover"
				        		>
								<p>确定删除该分组吗？</p>
								<div style="text-align: right; margin: 0">
								    <el-button size="mini" type="text" @click="scope.row.popover = false">取消</el-button>
								    <el-button type="primary" size="mini" @click="delLevel(scope.row.id)">确定</el-button>
								</div>
								<el-button slot="reference" type="text" size="small" v-if="!scope.row.isdefault || scope.row.isdefault == 0">删除</el-button>
							</el-popover>
            			</div>
            			<div class="table-operation" v-if="scope.row.editable">
            				<el-button size="mini" @click="cancelEdit(scope.row)" plain>取消</el-button>
            				<el-button type="primary" size="mini" @click="saveEdit(scope.row)" :loading="isBtnLoading">保存</el-button>
            			</div>
            		</template>
            	</el-table-column>
			</el-table>
		</div>
	</div>
</template>
<script>
	import pageTitle from '@components/pageTitle';
	import addImg from '@components/addImg';
	export default {
		data() {
			return {
				levelList: [],
				oldLevelList: {},
				isLoading: false,
				isBtnLoading: false
			}
		},
		mounted() {
			this.getLevelList();
		},
		methods: {
			//客户分组列表
			getLevelList() {
				this.isLoading = true;
				this.$api("member.getLevelList").then((result) => {
					this.levelList = result;
					this.isLoading = false;
				}, (error) => {
					this.isLoading = false;
					if (error && error.data && error.data.status == 102) {
                    	this.levelList = [];
                    } else {
                    	this.$message({
                            type: 'error',
                            message: '加载数据出错'
                        });
                    }
				});
			},
			//选择图片
			getIconImg(image, row) {
				row.level_ico = image.imgUrl;
			},
			//新增客户分组
			addNewLevel() {
				if (this.levelList.length != 0 && this.levelList[this.levelList.length -1].id == '') {
					return;
				}
				this.levelList.push({
					id: '',
					name: '',
					level_ico: '',
					discount: '',
					monetary: '',
					editable: true
				});
			},
			//编辑客户分组
			editLevel(row) {
				if (this.oldLevelList[row.id]) {
					row.editable = true;
				} else {
					this.oldLevelList[row.id] = {
						id: row.id,
						name: row.name,
						level_ico: row.level_ico,
						discount: row.discount,
						monetary: row.monetary
					};
					this.$set(row, 'editable', true);
				}
			},
			//保存客户分组
			saveEdit(row) {
				if (row.name == '' || !/^[0-9a-zA-Z\u4e00-\u9fa5]{1,20}$/.test(row.name)) {
					this.$message({
                        type: 'error',
                        message: '请输入正确的分组名称！'
                    });
                    return;
				}
				// if (row.discount == '' || !/^[0-9]{1,11}([.]{1}[0-9]{1,2})?$/.test(row.discount) || row.discount > 100) {
				// 	this.$message({
    //                     type: 'error',
    //                     message: '请输入正确的折扣率！'
    //                 });
    //                 return;
				// }
				// if (row.monetary == '' || !/^[0-9]{1,11}([.]{1}[0-9]{1,2})?$/.test(row.monetary)) {
				// 	this.$message({
    //                     type: 'error',
    //                     message: '请输入正确的消费额度！'
    //                 });
    //                 return;
				// }
				this.isBtnLoading = true;
				if (row.id == '') {
					this.saveNewLevel(row);
				} else {
					this.saveEditLevel(row);
				}
			},
			//保存新增的客户分组
			saveNewLevel(row) {
				let data = {
					name: row.name,
					level_ico: row.level_ico,
					// discount: row.discount,
					// monetary: row.monetary
				};
				this.$api("member.addLevel", data).then((result) => {
					this.$message({
                        type: 'success',
                        message: '保存成功!'
                    });
                    row.id = result.id;
					row.editable = false;
					this.isBtnLoading = false;
				}, (error) => {
					if (error && error.data && error.data.status == 202) {
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
			//保存编辑的客户分组
			saveEditLevel(row) {
				let data = {
					'where[id]': row.id,
					'data[name]': row.name,
					'data[level_ico]': row.level_ico ? row.level_ico : "",
					// 'data[discount]': row.discount,
					// 'data[monetary]': row.monetary
				}
				this.$api("member.editLevel", data).then((result) => {
					this.$message({
                        type: 'success',
                        message: '保存成功!'
                    });
					row.editable = false;
					this.oldLevelList[row.id] = {
						id: row.id,
						name: row.name,
						level_ico: row.level_ico,
						discount: row.discount,
						monetary: row.monetary
					};
					this.isBtnLoading = false;
				}, (error) => {
					if (error && error.data && error.data.status == 202) {
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
					this.levelList.splice(this.levelList.length-1, 1);
				} else {
					row.editable = false;
					for (var i in this.oldLevelList[row.id]) {
						row[i] = this.oldLevelList[row.id][i];
					}
				}
			},
			//删除客户分组
			delLevel(id) {
				console.log(id)
				this.$api("member.delLevel", {id: id}).then((result) => {
					this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    let index = this.levelList.findIndex(n => n.id == id);
                    if (index > -1) {
                    	this.levelList.splice(index, 1);
                    }
				}, (error) => {
					this.$message({
                        type: 'error',
                        message: '删除失败！'
                    });
				});
			}
		},
		components: {
			pageTitle,
			addImg
		}
	}
</script>
<style scoped>
	.member-level-coin { width: 22px; height: 22px; vertical-align: middle;}
</style>
<template>
	<!-- <div class="contents"> -->
		<div>
			<el-table :data="addressList" ref="addressTable" style="width: 100%" size="mini" class="table-one-line" v-loading="isLoading">
				<el-table-column label="收货人">
					<template slot-scope="scope">
                		<div class="one-line" :title="scope.row.name">
                			<span>{{scope.row.name}}</span>
            			</div>
                	</template>
                </el-table-column>
                <el-table-column label="所在地区">
                	<template slot-scope="scope">
						<div class="one-line" :title="scope.row.pid | tranToAddr(scope.row.cityid, scope.row.areaid)" v-if="$version === 'neimao'">
							<span>{{scope.row.pid | tranToAddr(scope.row.cityid, scope.row.areaid)}}</span>
						</div>
						<div class="one-line" :title="scope.row.country_name" v-if="$version === 'waimao'">
							<span>{{scope.row.country_name}}</span>
						</div>
                	</template>
                </el-table-column>
                <el-table-column label="详细地址">
                	<template slot-scope="scope">
                		<div class="one-line" :title="scope.row.detail">
                			<span>{{scope.row.detail}}</span>
            			</div>
                	</template>
                </el-table-column>
                <el-table-column label="邮箱" v-if="$version === 'waimao'">
					<template slot-scope="scope">
                		<div class="one-line" :title="scope.row.email">
                			<span>{{scope.row.email}}</span>
            			</div>
                	</template>
                </el-table-column>
                <el-table-column label="邮编">
					<template slot-scope="scope">
                		<div class="one-line" :title="scope.row.code">
                			<span>{{scope.row.code}}</span>
            			</div>
                	</template>
                </el-table-column>
                <el-table-column label="手机/电话" v-if="$version === 'neimao'">
                	<template slot-scope="scope">
						<div class="one-line" :title="(scope.row.phone && scope.row.phone != '') && (scope.row.tel && scope.row.tel != '') ? (scope.row.phone+'/'+scope.row.tel) : (scope.row.phone && scope.row.phone != '' ? scope.row.phone : scope.row.tel)">
							<span v-if="scope.row.phone && scope.row.phone != ''">{{scope.row.phone}}</span>
							<span v-if="(scope.row.phone && scope.row.phone != '') && (scope.row.tel && scope.row.tel != '')">/</span>
							<span v-if="scope.row.tel && scope.row.tel != ''">{{scope.row.tel}}</span>			
						</div>
                	</template>
                </el-table-column>
                <el-table-column label="手机号码" v-if="$version === 'waimao'">
                	<template slot-scope="scope">
						<div class="one-line" :title="scope.row.phone">
                			<span>{{scope.row.phone}}</span>
						</div>
                	</template>
                </el-table-column>
                <el-table-column label="操作" v-if="inline_operation">
            		<template slot-scope="scope">
            			<div class="table-operation">
            				<el-button type="text" @click="editAddress(scope.row.id)" size="small">编辑</el-button>
            				<el-popover
					        	placement="top"
					        	width="200"
					        	trigger="click"
					        	v-model="scope.row.popover"
				        		>
								<p>确定删除该地址吗？</p>
								<div style="text-align: right; margin: 0">
								    <el-button size="mini" type="text" @click="scope.row.popover = false">取消</el-button>
								    <el-button type="primary" size="mini" @click="delAddress(scope.row.id)">确定</el-button>
								</div>
								<el-button slot="reference" type="text" size="small">删除</el-button>
							</el-popover>

            			</div>
            		</template>
            	</el-table-column>
            	<el-table-column label="" v-if="showDefaultAddress">
            		<template slot-scope="scope">
            			<span v-if="scope.row.sets == '2'">默认地址</span>
            			<el-popover
				        	placement="top"
				        	width="200"
				        	trigger="click"
				        	v-model="scope.row.popover1"
				        	v-if="scope.row.sets == '1'"
			        		>
							<p>确定将该地址设为默认地址吗？</p>
							<div style="text-align: right; margin: 0">
							    <el-button size="mini" type="text" @click="scope.row.popover1 = false">取消</el-button>
							    <el-button type="primary" size="mini" @click="setDefaultAddress(scope.row.id)">确定</el-button>
							</div>
							<el-button slot="reference" type="text" size="small">设为默认地址</el-button>
						</el-popover>
            		</template>
            	</el-table-column>
			</el-table>
		</div>
	<!-- </div> -->
</template>
<script>
	export default {
		data() {
			return {
				addressList: [],
				isLoading: false
			}
		},
		props: {
			client_id: {
				type: [String, Number],
				required: true
			},
			inline_operation: {
				type: Boolean,
				default: false
			},
			showDefaultAddress: {
				type: Boolean,
				default: false
			}
		},
		mounted() {
			this.getShipAddress();
		},
		methods: {
			//获取地址列表
			getShipAddress() {
				this.isLoading = true;
				this.$api("address.getShipAddress", {clientId: this.client_id}).then((result) => {
					this.addressList = result;
					this.isLoading = false;
				}, (error) => {
					this.isLoading = false;
					if (error && error.data.status == 102) {
						this.addressList = [];
					} else {
						this.$message({
							type: 'error',
			            	message: '获取配送地址失败'
						});
					}
				});
			},
			//编辑地址
			editAddress(id) {
				this.$emit("operate", id);
			},
			//删除地址
			delAddress(id) {
				this.$api("address.delShipAddress", {id: id, clientId: this.client_id}).then((result) => {
					this.$message({
		            	type: 'success',
		            	message: '配送地址删除成功!'
		        	});
		        	this.getShipAddress();
				}, (error) => {
					this.$message({
		            	type: 'error',
		            	message: '配送地址删除失败！'
		          	});
				})
			},
			//设为默认地址
			setDefaultAddress(id) {
				this.$api("address.setDefaultShipAddress", {id: id, clientId: this.client_id}).then((result) => {
					this.$message({
		            	type: 'success',
		            	message: '设置默认地址成功！'
		        	});
		        	this.getShipAddress();
					this.$emit("operate", id);
				}, (error) => {
					this.$message({
		            	type: 'error',
		            	message: '设置默认地址失败！'
		          	});
				});
			}
		}
	}
</script>
<style>

</style>
<template>
	<div class="region-picker">
		 <el-select v-model="provinceM" placeholder="省份">
		    <el-option v-for="(value, key) in areaData['86']"
		      :label="value"
		      :value="key"
		      :key="key"
		      v-if="key != '710000' && key != '810000' && key != '820000'">
		    </el-option>
		  </el-select>
		  <el-select v-model="cityM" placeholder="城市" >
		    <el-option v-for="(value, key) in cityList"
		      :label="value"
		      :value="key"
		      :key="key">
		    </el-option>
		  </el-select>
		  <el-select v-model="districtM" placeholder="请选择">
		    <el-option v-for="(value, key) in districtList"
		      :label="value"
		      :value="key"
		      :key="key">
		    </el-option>
		  </el-select>
	</div>
</template>
<script>
import areaData from 'china-area-data'
export default {
	props:['province', 'city', 'district'],
	data(){
		return {
			areaData:areaData
		}
	},
	watch: {
		'province': {
            handler(v) {
            	let isCityListChange = true;
            	for (var i in this.areaData[v]) {
            		if (this.cityM === i) {
            			isCityListChange = false;
            			break;
            		}
            	}
            	if (isCityListChange) {
            		this.cityM = '';
            	}
            },
            deep: true
        },
        'city': {
            handler(v) {
            	let isDistrictChange = true;
            	for (var i in this.areaData[v]) {
            		if (this.districtM === i) {
            			isDistrictChange = false;
            			break;
            		}
            	}
            	if (isDistrictChange) {
            		this.districtM = '';
            	}
            },
            deep: true
        }
	},
	computed:{
		provinceM: {
			get() {
				return ""+this.province;
			},
			set(v) {
				this.$emit("update:province", v);
			}
		},
		cityM: {
			get() {
				return ""+this.city;
			},
			set(v) {
				this.$emit("update:city", v);
			}
		},
		districtM: {
			get() {
				return ""+this.district;
			},
			set(v) {
				this.$emit("update:district", v);
				this.$emit("change", {
					province: this.provinceM,
					city: this.cityM,
					district: v
				});
			}
		},
		cityList(){
			return this.provinceM ? (this.areaData[this.provinceM] ? this.areaData[this.provinceM] : {}) : {};
		},
		districtList(){
			return this.cityM ? (this.areaData[this.cityM] ? this.areaData[this.cityM] : {}) : {};
		}
	},
}

</script>
<style>
	.region-picker .el-select {
		display: inline-block;
		vertical-align: middle;
		width: 94px;
	}
	.region-picker .el-select .el-input__inner {
		width: 98px;
	}
</style>
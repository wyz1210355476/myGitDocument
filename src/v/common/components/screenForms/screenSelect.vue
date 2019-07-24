<template>
    <el-select v-model="currentData" :placeholder="placeholder" @change="setValue" clearable size="small">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </el-select>
</template>


<script>
    export default {
        data() {
            return {
                placeholder:"请选择",
                currentData:this.$route.query[this.config.key],
                options: [],
            }
        },
        methods: {
            init(){
                if(this.config.api && this.config.handleData && typeof(this.config.handleData) == 'function'){
                    if(sessionStorage.getItem(this.config.api)){
                        this.options = this.config.handleData(JSON.parse(sessionStorage.getItem(this.config.api)))
                    }else{
                        this.$api(this.config.api).then((response) => {
                            sessionStorage.setItem(this.config.api,JSON.stringify(response))
                            this.options = this.config.handleData(response)
                        })
                    }
                }
            },
            setValue(){
                this.$emit('input', this.currentData);
            }
        },
        mounted() {
            this.placeholder = this.config.placeholder ? this.config.placeholder : this.placeholder;
            //this.init();
        },
        props: ['config'],
    }
</script>
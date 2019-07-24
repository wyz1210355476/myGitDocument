<template>
    <maintain-imgs></maintain-imgs>
</template>
<script>
    import maintainImgs from './maintainImgs';//引入编辑图片组件
    export default {
        data(){
            return{
            }
        },
        mounted () {
            // this.$router.replace({
            //     path: this.$route.fullPath,
            //     query: {
            //         'time':new Date().getTime()/1000
            //     }
            // })
        },
        methods: {
        },
        components: {
            maintainImgs,//注册编辑图片组件
        }
    }
</script>
<style>
</style>

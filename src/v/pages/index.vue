<template>
    <div class="main">
        <div class="left" v-if="!noMenu">
            <sidebar @change="checkSecond" :data="menuData"></sidebar>
        </div>
        <div class="content" :class="{'noSecond':noSecond,'noMenu':noMenu}">
            <router-view class="" @change="checkMenu"></router-view>
        </div>
    </div>
</template>
<script>
import sidebar from './sidebar'
export default {
    data() {
        return {
            menuData: '',
            noSecond: true,
            noMenu: false,
        }
    },
    components: {
        sidebar,
    },
    mounted(){
        
    },
    methods: {
        checkSecond(val){
            this.noSecond = val
        },
        checkMenu(val){
            this.noMenu = val || false
        }
    }
}
</script>
<style scoped>
.content {
    overflow: auto;
    padding-left: 260px;
    height: 100%;
}
.noSecond{
    padding-left: 110px;
}
.noMenu{
    padding-left: 0px;
}
.clearfix:after {
    content: '';
    display: block;
    clear: both;
}
</style>

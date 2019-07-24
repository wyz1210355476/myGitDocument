<!-- 树形结构 -->
<template>
    <span class="left_menu">
        <div class="firstLevel">
            <span
                class="rel" :class="{'active':nowFirst.name == item.name}"
                v-for="item in menu"
                :key="item.id"
                @click="firstLevel(item)">
                <svg-icon class="icon1" :name="(item.icon?item.icon:'icon-app') + (nowFirst.name == item.name?'-active':'')"></svg-icon>
                {{item.name}}
            </span>
        </div>
        <div class="secondLevel" v-if="nowFirst.children && nowFirst.children.length > 0">
            <span v-for="(item,index) in nowFirst.children" :key="item.id">
                <span
                    class="rel" :class="{'active':nowSecond.name == item.name}"
                    @click="secondLevel(item,index)">{{item.name}}
                    <i v-if="item.children && item.children.length > 0" class="arrow" :class="{'el-icon-arrow-down':!item.expand,'el-icon-arrow-up':item.expand}"></i>
                </span>
                <span v-if="item.expand && item.children">
                    <span
                        class="rel thirdRel" :class="{'active':nowThird.name == item1.name}"
                        v-for="item1 in item.children"
                        :key="item1.id"
                        @click="thirdLevel(item1,index)">{{item1.name}}
                    </span>
                </span>
            </span>
        </div>
    </span>
</template>
<script>
export default {
    data() {
        return {
            nowFirst:{},
            nowSecond:{},
            nowThird:{},
            menu: []
        }
    },
    mounted(){
        this.formatMenu()
    },
    watch:{
        $route(to, from) {
            if(to.query.hash){
                this.$router.push({path:'/iframe',query:{iframe:to.query.iframe+to.query.hash}})
                this.initMenu(to.query.iframe)
            }
        }
    },
    methods: {
        //区分 门户菜单 和电商菜单
        formatMenu(){
            let menu = []
            this.$menu.forEach( (el, index) => {
                if(el.url){
                    if(el.url.indexOf('wholesale')>-1){
                        el.path = el.url.split('wholesale')[1]
                        if(el.path.indexOf('?')>-1){
                            el.path = el.path.split('?')[0]
                        }
                    }else if(el.url.indexOf('manager')>-1){
                        el.path = __ce.baseURL + "/manager" +el.url.split('manager')[1]
                    }else{
                        el.path = el.url
                    }
                }else{
                    el.path = ''
                }
            });
            this.renderMenu(menu,this.$menu,0)
        },
        //格式化菜单
        renderMenu(menu,menuData,pid){
            menuData.forEach( (el, index) => {
                if(el.parentId == pid){
                    let isIframe = (el.path&&(el.path.indexOf('http://')>-1||el.path.indexOf('https://')>-1))?true:false
                    if(isIframe){
                        if(sessionStorage.getItem('token')){
                            let key = el.path.indexOf('?') > -1 ? "&" : "?" 
                            el.path = el.path + key + "TOKEN=" + sessionStorage.getItem('token')
                        }
                    }
                    menu.push({
                        id:el.id,
                        name: el.name,
                        path: el.path,
                        expand: false,
                        iframe: isIframe,
                        children:[],
                        icon:el.icon || 'icon-app'
                    })
                }
            });
            if(menu.length > 0 ){
                menu.forEach((el, index) => {
                    this.renderMenu(el.children,menuData,el.id)
                });
            }
            this.menu = menu
            this.initMenu()
        },
        //初始化菜单
        initMenu(iframeUrl){
            if(this.menu.length==0){
                this.menu = [{
                    name: '首页',
                    path: '/',
                    expand: false,
                },{
                name: '订单管理',
                path: '',
                expand: false,
                children: [
                    {
                        name: '订单列表',
                        path: '/order/list'
                    }, {
                        name: '发货单',
                        path: '/order/delivery'
                    }, {
                        name: '退货单',
                        path: '/order/return'
                    }
                ]},{
                name: '财务管理',
                path: '',
                expand: false,
                children: [
                    {
                        name: '收款单',
                        path: '/order/pay'
                    }, {
                        name: '退款单',
                        path: '/order/refund'
                    },{
                        name: '返利商品',
                        path: '',
                        expand: false,
                        children: [
                            {
                                name: '返利商品',
                                path: '/member/goodsrebate'
                            },{
                                name: '客户返利',
                                path: '/member/cusrebate'
                            },{
                                name: '收支类型',
                                path: '/member/balanceType'
                            },{
                                name: '返利规则',
                                path: '/member/rebateRule'
                            }
                        ]
                    },
                ]},
                {
                    name: '商品管理',
                    path: '',
                    expand: false,
                    children: [{
                        name: '商品列表',
                        path: '/goods/list'
                    },{
                        name: '商品分类',
                        path: '/goods/category'
                    },{
                        name: '商品类型',
                        path: '/goods/type'
                    },{
                        name: '商品标签',
                        path: '/goods/label'
                    },{
                        name: '计量单位',
                        path: '/goods/unit'
                    },{
                        name: '商品价格',
                        path: '/goods/price'
                    }]
                },{
                    name: '客户管理',
                    path: '',
                    expand: false,
                    children: [{
                        name: '客户列表',
                        path: '/member/list'
                    },{
                        name: '客户分组',
                        path: '/member/level'
                    }]
                },{
                    name: '商城运营',
                    path: '',
                    expand: false,
                    children: [{
                        name: '支付设置',
                        path: '/paymentManagement/paymentMethod'
                    }, {
                        name: '物流配送',
                        path: '/logistics/deliverMode'
                    }, {
                        name: '注册协议',
                        path: '/memberSet/provisionSet'
                    }, {
                        name: '订单规则',
                        path: '/tradeConfigure/tradeSet'
                    }, {
                        name: '短信设置',
                        path: '/messageSet/msgSet'
                    }, {
                        name: '搜索热词',
                        path: '/goods/hotwords'
                    }, {
                        name: '商品橱窗',
                        path: '/goods/window'
                    }]
                }]
            }
            let route = this.$route.path
            let par
            if(route == '/iframe'){
                par = decodeURIComponent( this.$route.query.iframe )
                if(iframeUrl){
                    par = decodeURIComponent( iframeUrl)
                }
            }else{
                par = route
            }
            let res = this.findMenu(par)
            this.showMenuSelect(res,par);
        },
        //回显菜单
        showMenuSelect(res,route){
            // console.log(res,route)
            this.$emit('change',true)
            if(res.first !== '' ){
                this.nowFirst = this.menu[res.first]
            }
            if(res.second !== '' ){
                this.$emit('change',false)
                this.nowSecond = this.menu[res.first].children[res.second]
            }
            if(res.third !== '' ){
                this.$emit('change',false)
                this.nowSecond = {}
                this.menu[res.first].children[res.second].expand = true
                this.nowThird = this.menu[res.first].children[res.second].children[res.third]
            }
            if(res.first === '' && res.second === '' && res.third === '' && route !== undefined){
                let routeArr = route.split('/')
                let len = routeArr.length
                let path = ''
                routeArr.forEach((e,i)=>{
                    if(i!=len-1 && e!=''){
                        path+='/'
                        path+=e
                    }
                })
                let res = this.findMenu(path)
                this.showMenuSelect(res)
            }
        },
        //获取当前选中的菜单
        findMenu(route){
            let res = {
                first:'',
                second:'',
                third:'',
            }
            let first = this.menu.findIndex((n)=>n.path==route)
            if(first > -1){
                res.first = first
            }else{
                this.menu.forEach( (el, i) => {
                    if(el.children && el.children.length > 0){
                        let second = el.children.findIndex((n)=>n.path==route)
                        if(second > -1){
                            res.first = i
                            res.second = second
                        }else{
                            el.children.forEach( (ele, ind) => {
                                if(ele.children && ele.children.length > 0){
                                    let third = ele.children.findIndex((m)=>route==m.path)
                                    if(third > -1){
                                        res.first = i
                                        res.second = ind
                                        res.third = third
                                    }
                                }
                            });
                        }
                    }
                });
            }
            return res
        },
        //点击一级菜单
        firstLevel(item){
            this.nowFirst = item
            if(item.path === ''){
                this.$emit('change',false)
                if(item.children[0].path != ''){
                    this.nowSecond = item.children[0]
                    this.nowThird = []
                    item.children.forEach((e,i)=>{
                        e.expand = false
                    })
                    if(item.children[0].iframe){
                        this.$router.push({path:'/iframe',query:{iframe:item.children[0].path}})
                    }else{
                        if (item.children[0].path === this.$route.path) {
                            return;
                        }
                        this.$router.push({path:item.children[0].path})
                    }
                }else{
                    this.nowSecond = {}
                    item.children[0].expand = true
                    this.nowThird = item.children[0].children[0]
                    if(item.children[0].children[0].iframe){
                        this.$router.push({path:'/iframe',query:{iframe:item.children[0].children[0].path}})
                    }else{
                        if (item.children[0].children[0].path === this.$route.path) {
                            return;
                        }
                        this.$router.push({path:item.children[0].children[0].path})
                    }
                }
            }else{
                this.$emit('change',true)
                if(item.iframe){
                    this.$router.push({path:'/iframe',query:{iframe:item.path}})
                }else{
                    if (item.path === this.$route.path) {
                        return;
                    }
                    this.$router.push({path:item.path})
                }
            }
        },
        //点击二级菜单
        secondLevel(item,index){
            if(item.path == ''){
                this.nowFirst.children.forEach( (el, i) => {
                    if(index!=i){
                        el.expand =  false
                    }
                });
                item.expand = !item.expand
            }else{
                this.nowSecond = item
                this.nowThird = {}
                if(item.iframe){
                    this.$router.push({path:'/iframe',query:{iframe:item.path}})
                }else{
                    if (item.path === this.$route.path) {
                        return;
                    }
                    this.$router.push({path:item.path})
                }
            }
        },
        //点击三级菜单
        thirdLevel(item,index){
            this.nowSecond = {}
            this.nowThird = item
            if(item.iframe){
                this.$router.push({path:'/iframe',query:{iframe:item.path}})
            }else{
                if (item.path === this.$route.path) {
                    return;
                }
                this.$router.push({path:item.path})
            }
        }
    }

}
</script>
<style scoped>
.left_menu{font-size:14px;}
ul,li{padding:0;margin: 0;}
a:link,a:visited,a:hover,a:active {text-decoration: none;}
.rel{display: block; overflow: hidden; box-sizing:border-box; text-overflow: ellipsis;white-space: nowrap; cursor: pointer;}
.rel a{display: block;}

.firstLevel{width: 110px; background: #858b9b; height: 100%;  position: fixed; left: 0; top: 0; z-index: 99; overflow-y:auto;  padding-top: 15px}
.firstLevel .rel{line-height: 50px; height: 50px; padding: 0 5px 0 10px; margin-right: -2px;  }
.firstLevel .rel.active{background: #e8ecef;}
.firstLevel .rel {color: #dfe3ee}
.firstLevel .rel:hover {color: #fff}
.firstLevel .rel.active {color: #4b4c4c}
.firstLevel .rel .icon1{color:#fff}
.firstLevel .rel.active .icon1 {color: #333}



.secondLevel{width: 140px; background: #fff; height:calc(100% - 40px); border-right: 1px solid #d5e1e7; position: fixed; left: 120px; top: 10px; z-index: 99; padding-top: 20px;overflow-y:auto; overflow-x:hidden }
.secondLevel .rel{line-height: 40px; height: 40px; padding: 0 5px 0 20px; position: relative; }
.secondLevel .rel {color: #3e3f41}
.secondLevel .rel:hover ,.secondLevel .rel.active {color: #3197ea}
.secondLevel .rel i.arrow{position: absolute; right: 10px; top:0; line-height: 36px}
.secondLevel .thirdRel{padding-left: 35px;}
.secondLevel .thirdRel {color: #858585}
</style>

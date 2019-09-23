<template>
  <div class="container">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="手机号:" prop="account">
            <el-input v-model="ruleForm.account"></el-input>
        </el-form-item>
        <el-form-item label="密码:" prop="password">
            <el-input v-model="ruleForm.password"></el-input>
        </el-form-item>
        <el-form-item label="" prop="password">
            <el-button type="primary" @click="register">注册</el-button>
        </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Logo from '~/components/Logo.vue'

export default {
    data(){
        return{
            ruleForm:{
                account: '',
                password: ''
            }
        }
    },
    methods: {
        register(){
            this.$message({
                message: '恭喜你，这是一条成功消息',
                type: 'success'
            });
        }
    },
    components: {
        Logo
    }
}
</script>

<style>
.container {
  /* margin: 0 auto; */
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
</style>

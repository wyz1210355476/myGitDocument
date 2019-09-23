<template>
  <div class="container">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="账号:" prop="account">
            <el-input v-model="ruleForm.account"></el-input>
        </el-form-item>
        <el-form-item label="密码:" prop="password">
            <el-input v-model="ruleForm.password"></el-input>
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
  components: {
    Logo
  }
}
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
</style>

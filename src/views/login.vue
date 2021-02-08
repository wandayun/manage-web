<template>
    <div id='login' :style="conheight">
        <div style="width:20%;display:inline-block;margin-top:300px">
          <el-form :model="form"  ref="form" class="form-signin">
            <h1 class="h3 mb-3 font-weight-normal">OA</h1>
            <el-form-item  prop="server">
              <el-input v-model="form.username" placeholder="账号"></el-input>
            </el-form-item>
            <el-form-item  prop="password">
              <el-input v-model="form.password" placeholder="密码"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button  type="primary" @click="submitForm('form')">登录</el-button>
            </el-form-item>
          </el-form>
        </div>
    </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'login',
  data () {
    return {
      conheight:{
                height:''
      },
      form:{
        username:'',
        password:''
      }
    }
  },
  methods: {
      getHeight(){
          this.conheight.height=window.innerHeight+'px';
       },
      
       submitForm(){
         let data = this.form
         axios({
                method: "post",//指定请求方式
                url: "/api/user/login",
                data:data
          }).then(res =>{
                console.log(res)
                if(res.data.errno == 0){
                  this.$router.push('/')
                }
          })
      }
  },
  mounted(){
    this.getHeight()
  }
}
</script>

<style scoped>
#login{
  width: 100%;

  background: #fff url(..\assets\b.jpg) no-repeat ;
  background-size:100%;
  text-align:center
}
</style>
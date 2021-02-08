<template>
  <div>
      <el-menu
        :default-active="defaultActive"
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b">
        <el-menu-item index="1">人员管理</el-menu-item>
        <el-menu-item index="2">借支详情</el-menu-item>
        <el-menu-item index="3">系统管理</el-menu-item>
        </el-menu>
  </div>
</template>

<script>
export default {
  name: 'top',
  data () {
    return {
      defaultActive: "1"
    }
  },
  methods: {
      handleSelect(key, keyPath) {
        console.log(key, keyPath);
        this.$router.push('/page'+key) 
      },

    },
  mounted(){
    let url=window.location.href
    this.defaultActive=url.charAt(url.length-1)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>

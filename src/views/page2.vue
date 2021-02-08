<template>
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
          prop="id"
          label="序号"
      >
      </el-table-column>
        <el-table-column
          prop="menberName"
          label="姓名"
      >
      </el-table-column>
        <el-table-column
          prop="num"
          label="金额"
      >
      </el-table-column>
        <el-table-column
          prop="time"
          label="时间"
      >
      </el-table-column>
        <el-table-column
          prop="style"
          label="借还"
      >
      </el-table-column>
        <el-table-column
          prop="managerid"
          label="managerid"
      >
        </el-table-column>




 
    </el-table>
</template>

<script>
import axios from 'axios'

export default {
  name: 'page2',
  data () {
    return {
      tableData:[],
      menberList:[]
    }
  },
  methods: {
      async table(){
        let menbers = await axios({
                method: "get",//指定请求方式
                url: "/api/menbers/list",
            })
        if(menbers.data.message == "未登录"){
                  this.$router.push('/login')
                }
        this.menberList = menbers.data.data
        let data = await axios({
                method: "get",//指定请求方式
                url: "/api/menbers/borrowList",
            })
        if(data.data.message == "未登录"){
                  this.$router.push('/login')
                }
        this.tableData =data.data.data
        
        
        this.tableData.map(item =>{
          this.menberList.forEach(it =>{
            if(it.id == item.managerid){
              item.menberName = it.name
              return item
            }
          }) 
        })
      }
     
  },
  mounted(){
    this.table()
  }
}
</script>
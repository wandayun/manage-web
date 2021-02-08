<template>
    <div >
      <el-row style="margin:10px">
        <el-col :span="4">
          <el-input v-model="input"></el-input>
          
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="check">查询</el-button>
          <el-button type="primary" @click="addEdit">添加员工</el-button>
          <el-button type="primary" @click="excel">导出Exc</el-button>
        </el-col>
      </el-row>
      

      <el-table
      :data="tableData"
      style="width: 100%">


        <el-table-column
          prop="name"
          label="姓名"
      >
      </el-table-column>
        <el-table-column
          prop="work"
          label="工种"
      >
      <!-- </el-table-column>
        <el-table-column
          prop="intime"
          label="进场时间"
      >
      </el-table-column>
        <el-table-column
          prop="outtime"
          label="出场时间"
      > -->
      </el-table-column>
        <el-table-column
          prop="salary"
          label="薪资标准"
      >
      </el-table-column>
        <el-table-column
          prop="totalhours"
          label="总工时"
      >
      </el-table-column>
        <el-table-column
          prop="wagespayable"
          label="应发工资"
      >
        </el-table-column>


          <el-table-column
          prop="wagespaid"
          label="已发工资"
      >
        </el-table-column>
          <el-table-column
          prop="totalborrowing"
          label="当前总借支"
      >
        </el-table-column>
      <!-- <el-table-column
          label="借支详情"
      >
        <template slot-scope="scope">
          <p>{{managers[0].realname}}：{{scope.row.manager1}}元</p>
          <p>{{managers[1].realname}}：{{scope.row.manager2}}元</p>
          <p>{{managers[2].realname}}：{{scope.row.manager3}}元</p>
          <p>{{managers[3].realname}}：{{scope.row.manager4}}元</p>
        </template>
        </el-table-column> -->
      <el-table-column label="操作" min-width="400" >
        <template slot-scope="scope" >
          
          <el-button
            size="mini"
            
            @click="borrowEdit(scope.$index, scope.row)">借支登记</el-button>
          <el-button
            size="mini"
            v-if="power"
            @click="salaryEdit(scope.$index, scope.row)">工资标准</el-button>
            <el-button
            size="mini"
            v-if="power"
            @click="ableEdit(scope.$index, scope.row)">应发工资</el-button>
            <el-button
            size="mini"
            v-if="power"
            @click="paidEdit(scope.$index, scope.row)">已发工资</el-button>
          <el-button
            size="mini"
            v-if="power"
            type="danger"
            @click="del(scope.$index, scope.row)">移除员工</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="借支登记"
      :visible.sync="borrowVisible"
      width="30%"
      >
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="借支归还">
          <el-select v-model="form.style" placeholder="请选择借支或者归还">
            <el-option label="借支" value="1"></el-option>
            <el-option label="归还" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数目">
          <el-input v-model="form.num"></el-input>
        </el-form-item>
        
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="borrowVisible = false">取 消</el-button>
        <el-button type="primary" @click="borrow">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="工资标准"
      :visible.sync="salaryVisible"
      width="30%"
      >
      <el-form ref="form" label-width="80px">

        <el-form-item label="工资">
          <el-input v-model="salarynum"></el-input>
        </el-form-item>
        
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="salaryVisible = false">取 消</el-button>
        <el-button type="primary" @click="salary">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="已发工资"
      :visible.sync="paidVisible"
      width="30%"
      >
      <el-form ref="form" label-width="80px">

        <el-form-item label="已发工资">
          <el-input v-model="paidnum"></el-input>
        </el-form-item>
        
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="salaryVisible = false">取 消</el-button>
        <el-button type="primary" @click="paid">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="应发工资"
      :visible.sync="ableVisible"
      width="30%"
      >
      <el-form ref="form" label-width="80px">

        <el-form-item label="应发工资">
          <el-input v-model="ablenum"></el-input>
        </el-form-item>
        
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="salaryVisible = false">取 消</el-button>
        <el-button type="primary" @click="able">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="添加员工"
      :visible.sync="addVisible"
      width="30%"
      >
      <el-form ref="form" :model="addform" label-width="80px">
        
        <el-form-item label="姓名">
          <el-input v-model="addform.name"></el-input>
        </el-form-item>
        <el-form-item label="工种">
          <el-input v-model="addform.work"></el-input>
        </el-form-item>
   
        <el-form-item label="工资标准">
          <el-input v-model="addform.salary"></el-input>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="addmenber">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'page1',
  data () {
    return {
      tableData: [],
      input:'',
      menberid:'',
      form:{},
      addform:{},
      borrowVisible:false,
      salaryVisible:false,
      ableVisible:false,
      paidVisible:false,
      addVisible:false,
      salarynum:0,
      paidnum:0,
      ablenum:0,
      managers:[],
      power:'',
    }
  },
  methods: {
      addEdit(){

        this.addVisible= true
      },
      addmenber(){
        let that =this
        console.log(`/api/menbers/add?name=${that.addform.name}&work=${that.addform.work}&salary=${that.addform.salary}`)
        axios({
                method: "get",//指定请求方式
                url: `/api/menbers/add?name=${that.addform.name}&work=${that.addform.work}&salary=${that.addform.salary}`,
            }).then(res =>{
                console.log(res)
                this.check()
                this.addVisible=false
        })

      },
      borrowEdit(index, row) {
        console.log(index, row);
        this.menberid = row.id
        this.borrowVisible= true
        
      },
      borrow(){
        let that =this
        console.log(`/api/menbers/list?menberid=${that.menberid}&num=${that.form.num}&style=${that.form.style}`)
        axios({
                method: "get",//指定请求方式
                url: `/api/menbers/borrow?menberid=${that.menberid}&num=${that.form.num}&style=${that.form.style}`,
            }).then(res =>{
                console.log(res)
                this.check()
                this.borrowVisible=false
                
        })
        this.borrowVisible = false
      },
      salaryEdit(index, row){
        console.log(index, row);
        this.menberid = row.id
        this.salaryVisible= true
      },
      ableEdit(index, row){
        console.log(index, row);
        this.menberid = row.id
        this.ableVisible= true
      },
      paidEdit(index, row){
        console.log(index, row);
        this.menberid = row.id
        this.paidVisible= true
      },
      
      salary(){
        let that =this
        console.log(`/api/menbers/salary?menberid=${that.menberid}&num=${that.salarynum}`)
        axios({
                method: "get",//指定请求方式
                url: `/api/menbers/salary?menberid=${that.menberid}&num=${that.salarynum}`,
            }).then(res =>{
                console.log(res)
                this.check()
                this.salaryVisible=false
        })

      },
      able(){
        let that =this
        console.log(`/api/menbers/wagespayable?menberid=${that.menberid}&num=${that.ablenum}`)
        axios({
                method: "get",//指定请求方式
                url: `/api/menbers/wagespayable?menberid=${that.menberid}&num=${that.ablenum}`,
            }).then(res =>{
                console.log(res)
                this.check()
                this.ableVisible=false
        })

      },
      paid(){
        let that =this
        console.log(`/api/menbers/wagespaid?menberid=${that.menberid}&num=${that.paidnum}`)
        axios({
                method: "get",//指定请求方式
                url: `/api/menbers/wagespaid?menberid=${that.menberid}&num=${that.paidnum}`,
            }).then(res =>{
                console.log(res)
                this.check()
                this.paidVisible=false
        })

      },
      handleDelete(index, row) {
        console.log(index, row);
      },
      async tabledata(){

                let menbers=await axios({
                    method: "get",//指定请求方式
                    url: "/api/menbers/list",
                })
                let managers = await axios({
                    method: "get",//指定请求方式
                    url: "/api/menbers/managerList",
                })
                

                console.log(menbers,managers)
                if(menbers.data.message == "未登录"){
                  this.$router.push('/login')
                }
                this.managers = managers.data.data
                this.tableData = menbers.data.data

      },
      check(){
          axios({
                method: "get",//指定请求方式
                url: "/api/menbers/list?input="+this.input,
            }).then(res =>{
                console.log(res)
                if(res.data.message == "未登录"){
                  this.$router.push('/login')
                }
                this.tableData = res.data.data
            })
      },
      del() {
        this.$confirm('删除该员工, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },
      getpower(){
        axios({
                method: "get",//指定请求方式
                url: "/api/user/power",
            }).then(res =>{
                console.log('power:',res)
                this.power = res.data.power
            })
      },
      excel(){
        axios({
                method: "get",//指定请求方式
                url: "/api/menbers/importExcel",
            }).then(res =>{
                console.log('importExcel:',res)

            })
      }

  },
  mounted(){
    this.tabledata()
    this.getpower()
  }
}
</script>
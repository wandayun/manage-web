<template>
    <div>
      <p>管理员管理</p>
      <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column
            prop="id"
            label="序号"
        >
        </el-table-column>
          <el-table-column
            prop="username"
            label="账号"
        >
        </el-table-column>
          <el-table-column
            prop="realname"
            label="姓名"
        >
        </el-table-column>
        

        <el-table-column label="操作" min-width="200">
          <template slot-scope="scope" >
            
            <el-button
              size="mini"
              @click="Edit(scope.$index, scope.row)">编辑</el-button>

          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary" @click="AttendanceVisible=true">上传考勤</el-button>
      <el-dialog
        title="编辑"
        :visible.sync="Visible"
        width="30%"
        >
        <el-form ref="form" label-width="80px">

          <el-form-item label="账号">
            <el-input v-model="row.username"></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="row.password"></el-input>
          </el-form-item>
          <el-form-item label="姓名">
            <el-input v-model="row.realname"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="Visible = false">取 消</el-button>
          <el-button type="primary" @click="change">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog
        title="编辑"
        :visible.sync="AttendanceVisible"
        width="30%"
        >
        <el-select v-model="month" placeholder="请选择">
          <el-option
            v-for="item in mouthList"
            :key="item.val"
            :label="item.label"
            :value="item.val">
          </el-option>
        </el-select>
        <el-upload class="upload-demo" 
                        ref="upload" 
                        :action="url" 
                        :on-change="handleChange" 
                        :on-remove="handleRemove" 
                        :on-success="uploadSuccess" 
                        :on-error="uploadError" 
                        :file-list="fileList" 
                        :auto-upload="false"
                    >
                        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传.xlsx .xlsm .xls格式的文件</div>
                    </el-upload>
        <span slot="footer" class="dialog-footer">
          <el-button @click="Visible = false">取 消</el-button>
          <el-button type="primary" @click="upload">确 定</el-button>
        </span>
      </el-dialog>
    </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'page3',
  data () {
    return {
      tableData:[],
      form:{},
      row:{},
      Visible:false,
      AttendanceVisible:false,
      month:'',
      fileList:[],
      file:{},
      url:'',
      mouthList:[{
        val:'202101',
        lable:'2021年1月'
      },{
        val:'202102',
        lable:'2021年2月'
      },{
        val:'202103',
        lable:'2021年3月'
      },{
        val:'202104',
        lable:'2021年4月'
      },{
        val:'202105',
        lable:'2021年5月'
      },{
        val:'202106',
        lable:'2021年6月'
      },{
        val:'202107',
        lable:'2021年7月'
      },{
        val:'202108',
        lable:'2021年8月'
      },{
        val:'202109',
        lable:'2021年9月'
      },{
        val:'202110',
        lable:'2021年10月'
      },{
        val:'202111',
        lable:'2021年11月'
      },{
        val:'202112',
        lable:'2021年12月'
      }]
    }
  },
  computed:{
        
  },
  methods: {
    async table(){

        let data = await axios({
                method: "get",//指定请求方式
                url: "/api/menbers/managerList",
            })
        if(data.data.message == "未登录"){
                  this.$router.push('/login')
                }
        this.tableData =data.data.data
        
        
      },
    Edit(index,row){
      this.Visible =true
      this.row = row
    },
    change(){
      let that =this
        console.log(``)
        axios({
                method: "get",//指定请求方式
                url: `/api/menbers/managerChange?id=${that.row.id}&username=${that.row.username}&password=${that.row.password}&realname=${that.row.realname}`,
            }).then(res =>{
                console.log(res)
                this.table()
                this.Visible=false
        })
        this.Visible = false
    },
    Attendance(item){
      console.log(item)
      this.file = item.file
    },
    upload(){
      const that = this
      let form = new FormData()
      
      form.append('upload', this.file)
      form.append('mouth', this.month)
      console.log(form.get("upload"));
      let config = {
        //添加请求头
        headers: { "Content-Type": "multipart/form-data" },
        //添加上传进度监听事件
        onUploadProgress: e => {
          var completeProgress = ((e.loaded / e.total * 100) | 0) + "%";
          this.progress = completeProgress;
        }
      };
      axios.post('/api/menbers/importExcel', form, config).then(res =>{
        console.log(res)
      }
      
      )
      .catch(function (error) {
      console.log(error);
      });
      // axios({
      //           method: "post",//指定请求方式
      //           url: `/api/menbers/importExcel`,
      //           headers: { "Content-Type": "multipart/form-data" },
      //           form
      //       }).then(res =>{

      //   })
    }
     
  },
  mounted(){
    this.table()
    this.url=window.location.host
    console.log(222,this.url)
  }
}
</script>
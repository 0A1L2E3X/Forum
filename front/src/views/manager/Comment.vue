<template>
  <div>
    <div class="search">
      <el-input placeholder="please enter username" style="width: 200px" v-model="userName"></el-input>
      <el-button type="info" plain style="margin-left: 10px" @click="load(1)">search</el-button>
      <el-button type="warning" plain style="margin-left: 10px" @click="reset">reset</el-button>
    </div>

    <div class="operation">
      <el-button type="danger" plain @click="delBatch">delete in group</el-button>
    </div>

    <div class="table">
      <el-table :data="tableData" strip @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column prop="id" label="ID" width="70" align="center" sortable></el-table-column>
        <el-table-column prop="content" label="Content" show-overflow-tooltip></el-table-column>
<!--        <el-table-column prop="userId" label="user ID"></el-table-column>-->
        <el-table-column prop="userName" label="user"></el-table-column>
        <el-table-column prop="pid" label="Parent ID"></el-table-column>
        <el-table-column prop="rootId" label="Root ID"></el-table-column>
        <el-table-column prop="time" label="time"></el-table-column>
        <el-table-column prop="fid" label="isolate ID"></el-table-column>
        <el-table-column prop="module" label="module"></el-table-column>
        <el-table-column label="actions" align="center" width="180">
          <template v-slot="scope">
            <el-button size="mini" type="danger" plain @click="del(scope.row.id)">delete</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
            background
            @current-change="handleCurrentChange"
            :current-page="pageNum"
            :page-sizes="[5, 10, 20]"
            :page-size="pageSize"
            layout="total, prev, pager, next"
            :total="total">
        </el-pagination>
      </div>
    </div>


    <el-dialog title="Information" :visible.sync="fromVisible" width="40%" :close-on-click-modal="false" destroy-on-close>
      <el-form :model="form" label-width="100px" style="padding-right: 50px" :rules="rules" ref="formRef">
        <el-form-item label="content" prop="content">
          <el-input v-model="form.content" placeholder="content"></el-input>
        </el-form-item>
        <el-form-item label="user" prop="userId">
          <el-input v-model="form.userId" placeholder="user"></el-input>
        </el-form-item>
        <el-form-item label="Parent ID" prop="pid">
          <el-input v-model="form.pid" placeholder="parent ID"></el-input>
        </el-form-item>
        <el-form-item label="Root ID" prop="rootId">
          <el-input v-model="form.rootId" placeholder="root ID"></el-input>
        </el-form-item>
        <el-form-item label="time" prop="time">
          <el-input v-model="form.time" placeholder="time"></el-input>
        </el-form-item>
        <el-form-item label="isolate ID" prop="fid">
          <el-input v-model="form.fid" placeholder="isolate ID"></el-input>
        </el-form-item>
        <el-form-item label="module" prop="module">
          <el-input v-model="form.module" placeholder="module"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="fromVisible = false">cancel</el-button>
        <el-button type="primary" @click="save">submit</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
export default {
  name: "Comment",
  data() {
    return {
      tableData: [],  // 所有的数据
      pageNum: 1,   // 当前的页码
      pageSize: 10,  // 每页显示的个数
      total: 0,
      userName: null,
      fromVisible: false,
      form: {},
      user: JSON.parse(localStorage.getItem('xm-user') || '{}'),
      rules: {},
      ids: []
    }
  },
  created() {
    this.load(1)
  },
  methods: {
    handleAdd() {   // 新增数据
      this.form = {}  // 新增数据的时候清空数据
      this.fromVisible = true   // 打开弹窗
    },
    handleEdit(row) {   // 编辑数据
      this.form = JSON.parse(JSON.stringify(row))  // 给form对象赋值  注意要深拷贝数据
      this.fromVisible = true   // 打开弹窗
    },
    save() {   // 保存按钮触发的逻辑  它会触发新增或者更新
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          this.$request({
            url: this.form.id ? '/comment/update' : '/comment/add',
            method: this.form.id ? 'PUT' : 'POST',
            data: this.form
          }).then(res => {
            if (res.code === '200') {  // 表示成功保存
              this.$message.success('success')
              this.load(1)
              this.fromVisible = false
            } else {
              this.$message.error(res.msg)  // 弹出错误的信息
            }
          })
        }
      })
    },
    del(id) {   // 单个删除
      this.$confirm('are yous sure to delete it?', 'confirm', {type: "warning"}).then(response => {
        this.$request.delete('/comment/delete/' + id).then(res => {
          if (res.code === '200') {   // 表示操作成功
            this.$message.success('success')
            this.load(1)
          } else {
            this.$message.error(res.msg)  // 弹出错误的信息
          }
        })
      }).catch(() => {
      })
    },
    handleSelectionChange(rows) {   // 当前选中的所有的行数据
      this.ids = rows.map(v => v.id)   //  [1,2]
    },
    delBatch() {   // 批量删除
      if (!this.ids.length) {
        this.$message.warning('please select data')
        return
      }
      this.$confirm('are yous sure to delete them?', 'confirm', {type: "warning"}).then(response => {
        this.$request.delete('/comment/delete/batch', {data: this.ids}).then(res => {
          if (res.code === '200') {   // 表示操作成功
            this.$message.success('success')
            this.load(1)
          } else {
            this.$message.error(res.msg)  // 弹出错误的信息
          }
        })
      }).catch(() => {
      })
    },
    load(pageNum) {  // 分页查询
      if (pageNum) this.pageNum = pageNum
      this.$request.get('/comment/selectPage', {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          userName: this.userName,
        }
      }).then(res => {
        this.tableData = res.data?.list
        this.total = res.data?.total
      })
    },
    reset() {
      this.userName = null
      this.load(1)
    },
    handleCurrentChange(pageNum) {
      this.load(pageNum)
    },
  }
}
</script>

<style scoped>

</style>

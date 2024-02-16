<template>
  <div style="width: 70%; margin: 5px auto">
    <div class="card">
      <div style="font-weight: bold; font-size: 24px; margin-bottom: 50px; text-align: center">
        New Blog / Edit Blog
      </div>

      <el-form :model="form" label-width="100px" style="padding-right: 50px" :rules="rules" ref="formRef">
        <el-form-item label="title" prop="title">
          <el-input v-model="form.title" placeholder="title"></el-input>
        </el-form-item>
        <el-form-item label="describe" prop="descr">
          <el-input type="textarea" v-model="form.descr" placeholder="简介"></el-input>
        </el-form-item>
        <el-form-item label="cover" prop="cover">
          <el-upload
              :action="$baseUrl + '/files/upload'"
              :headers="{ token: user.token }"
              list-type="picture"
              :on-success="handleCoverSuccess"
          >
            <el-button type="primary">Upload cover</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="category" prop="categoryId">
          <el-select v-model="form.categoryId" style="width: 100%">
            <el-option v-for="item in categoryList" :key="item.id" :value="item.id" :label="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="label" prop="tags">
          <el-select v-model="tagsArr" multiple filterable allow-create default-first-option style="width: 100%">
            <el-option value="Q&A"></el-option>
            <el-option value="News"></el-option>
            <el-option value="ALevel"></el-option>
            <el-option value="IGCSE"></el-option>
            <el-option value="Algorithm"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Content" prop="content">
          <div id="editor"></div>
        </el-form-item>
      </el-form>

      <div style="text-align: center">
        <el-button type="primary" @click="save">Save</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import E from "wangeditor";
import hljs from "highlight.js";

export default {
  name: "NewBlog",

  data() {
    return {
      form: {},
      rules: {},
      user: JSON.parse(localStorage.getItem('xm-user') || '{}'),
      tagsArr: [],
      categoryList: [],
      editor: null,

      blogID: this.$route.query.blogId
    }
  },

  mounted() {
    this.$request.get('/category/selectAll').then(res => {
      this.categoryList = res.data || []
    })

    this.$request.get('/blog/selectById/' + this.blogID).then(res => {
      this.form = res.data || {}

      if (this.form.id) {
        this.tagsArr = JSON.parse(this.form.tags || '[]')

        setTimeout(() => {
          this.editor.txt.html(this.form.content)
        }, 0)
      }
    })

    this.setRichText()
  },

  methods: {
    save() {   // 保存按钮触发的逻辑  它会触发新增或者更新
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          this.form.tags = JSON.stringify(this.tagsArr)
          this.form.content = this.editor.txt.html()
          this.$request({
            url: this.form.id ? '/blog/update' : '/blog/add',
            method: this.form.id ? 'PUT' : 'POST',
            data: this.form
          }).then(res => {
            if (res.code === '200') {  // 表示成功保存
              this.$message.success('success')
            } else {
              this.$message.error(res.msg)  // 弹出错误的信息
            }
          })
        }
      })
    },

    handleCoverSuccess(res) {
      this.form.cover = res.data
    },

    setRichText() {
      this.$nextTick(() => {
        this.editor = new E(`#editor`)
        this.editor.highlight = hljs
        this.editor.config.uploadImgServer = this.$baseUrl + '/files/editor/upload'
        this.editor.config.uploadFileName = 'file'
        this.editor.config.uploadImgHeaders = {
          token: this.user.token
        }
        this.editor.config.uploadImgParams = {
          type: 'img',
        }
        this.editor.config.zIndex = 0
        this.editor.create()  // 创建
      })
    },
  }
}
</script>

<style scoped>

</style>
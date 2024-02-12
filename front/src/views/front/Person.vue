<template>
  <div class="main-content" style="width: 50%">
    <el-tabs v-model="activeName" @tab-click="clickTab">
      <el-tab-pane label="profile" name="profile">
        <Profile @update:user="updateUser"/>
      </el-tab-pane>

      <el-tab-pane label="my blogs" name="myBlogs">
        <div class="card" style="padding: 5px">
          <el-button @click="newBlogs">New Blog</el-button>
        </div>

        <div style="margin-top: 10px">
          <BlogList type="user" show-options="true" />
        </div>
      </el-tab-pane>

      <el-tab-pane label="my likes" name="myLikes">
        <div style="margin-top: 10px">
          <BlogList type="like" />
        </div>
      </el-tab-pane>

      <el-tab-pane label="my favorites" name="myFavorites">
        <div style="margin-top: 10px">
          <BlogList type="collect" />
        </div>
      </el-tab-pane>

      <el-tab-pane label="my comments" name="myComments">
        <div style="margin-top: 10px">
          <BlogList type="comment" />
        </div>
      </el-tab-pane>
    </el-tabs>


  </div>
</template>

<script>
import Profile from "@/components/Profile.vue";
import BlogList from "@/components/BlogList.vue";

export default {
  components: {
    BlogList,
    Profile
  },

  data() {
    const validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please check password'))
      } else if (value !== this.user.newPassword) {
        callback(new Error('Password error'))
      } else {
        callback()
      }
    }

    return {
      user: JSON.parse(localStorage.getItem('xm-user') || '{}'),
      dialogVisible: false,

      activeName: 'profile',

      rules: {
        password: [
          { required: true, message: 'Please enter original password', trigger: 'blur' },
        ],
        newPassword: [
          { required: true, message: 'Please enter password', trigger: 'blur' },
        ],
        confirmPassword: [
          { validator: validatePassword, required: true, trigger: 'blur' },
        ],
      }
    }
  },
  created() {

  },

  methods: {
    updateUser() {
      this.$emit('update:user')
    },

    newBlogs() {
      window.open('/front/newBlog')
    },

    clickTab(tab) {
      console.log(tab)
    },

    update() {
      // 保存当前的用户信息到数据库
      this.$request.put('/user/update', this.user).then(res => {
        if (res.code === '200') {
          // 成功更新
          this.$message.success('Save success')
          // 更新浏览器缓存里的用户信息
          localStorage.setItem('xm-user', JSON.stringify(this.user))

          // 触发父级的数据更新
          this.$emit('update:user')
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    handleAvatarSuccess(response, file, fileList) {
      // 把user的头像属性换成上传的图片的链接
      this.$set(this.user, 'avatar', response.data)
    },
    // 修改密码
    updatePassword() {
      this.dialogVisible = true
    },
    save() {
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          this.$request.put('/updatePassword', this.user).then(res => {
            if (res.code === '200') {
              // 成功更新
              this.$message.success('Change password success')
              this.$router.push('/login')
            } else {
              this.$message.error(res.msg)
            }
          })
        }
      })
    }
  }
}
</script>

<style scoped>
/deep/.el-form-item__label {
  font-weight: bold;
}
/deep/.el-upload {
  border-radius: 50%;
}
/deep/.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  border-radius: 50%;
}
/deep/.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
  border-radius: 50%;
}
.avatar {
  width: 120px;
  height: 120px;
  display: block;
  border-radius: 50%;
}
</style>
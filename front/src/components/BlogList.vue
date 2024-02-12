<template>
  <div>
    <div class="card">
      <div class="blog-box"
           v-for="item in tableData" :key="item.id" v-if="total > 0">
        <div style="flex: 1; width: 0">
          <a :href="'/front/blogDetail?blogID=' + item.id"><div class="blog-title">{{ item.title }}</div></a>
          <div class="line1" style="margin-bottom: 10px; color: #666; font-size: 12px">{{ item.descr }}</div>
          <div style="display: flex">
            <div style="flex: 1; font-size: 12px">
              <span style="margin-right: 20px">publisher: {{ item.userName }}</span>
              <span style="margin-right: 20px">views: {{ item.readCount }}</span>
              <span style="margin-right: 20px">likes: {{ item.likesCount }}</span>
            </div>

            <div style="width: fit-content">
              <el-tag v-for="(item, index) in JSON.parse(item.tags || '[]')" :key="index" style="margin-right: 5px">{{ item }}</el-tag>
            </div>
          </div>

          <div style="font-size: 12px" v-if="showOptions">
            <span style="margin-left: 5px; cursor: pointer; color: red" @click="del(item.id)">
              <i class="el-icon-delete" style="margin-right: 10px"></i>delete
            </span>

            <span style="margin-left: 10px; cursor: pointer; color: blue" @click="edit(item.id)">
              <i class="el-icon-edit" style="margin-right: 10px"></i>edit
            </span>
          </div>
        </div>

<!--        <div style="width: 125px">-->
<!--          <img style="width: 100%; height: 80px; border-radius: 5px" :src="item.cover" alt="">-->
<!--        </div>-->
      </div>

      <div v-if="total === 0" style="padding: 20px 0; text-align: center; font-size: 16px; color: #666">No data</div>

      <div style="margin-top: 10px">
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
  </div>
</template>

<script>
export default {
  name: "BlogList",

  props: {
    categoryName: null,
    type: null,
    showOptions: false,
  },

  data() {
    return {
      tableData: [],  // 所有的数据
      pageNum: 1,   // 当前的页码
      pageSize: 10,  // 每页显示的个数
      total: 0,
    }
  },

  watch: {
    categoryName() {
      this.loadBlogs(1)
    }
  },

  created() {
    this.loadBlogs(1)
  },

  methods: {
    loadBlogs(pageNum) {
      if (pageNum) this.pageNum = pageNum

      let url
      switch (this.type) {
        case 'user': url = '/blog/selectUser'; break;
        case 'like': url = '/blog/selectLike'; break;
        case 'collect': url = '/blog/selectCollect'; break;
        case 'comment': url = '/blog/selectComment'; break;
        default: url = '/blog/selectPage'
      }

      this.$request.get(url, {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          categoryName: this.categoryName === 'All Blogs' ? null : this.categoryName,
          title: this.$route.query.title
        }
      }).then(res => {
        this.tableData = res.data?.list
        this.total = res.data?.total
      })
    },

    handleCurrentChange(pageNum) {
      this.loadBlogs(pageNum)
    },

    del(id) {   // 单个删除
      this.$confirm('are yous sure to delete it?', 'confirm', {type: "warning"}).then(response => {
        this.$request.delete('/blog/delete/' + id).then(res => {
          if (res.code === '200') {   // 表示操作成功
            this.$message.success('success')
            this.loadBlogs(1)
          } else {
            this.$message.error(res.msg)  // 弹出错误的信息
          }
        })
      }).catch(() => {
      })
    },

    edit(id) {
      window.open('/front/newBlog?blogId=' + id)
    },
  }
}
</script>

<style scoped>
.line1 {
  white-space: nowrap;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
}

.blog-box {
  display: flex;
  grid-gap: 10px;
  padding: 15px 0;
  border-bottom: 1px solid #ddd;
  margin-bottom: 10px
}

.blog-box:first-child {
  padding-top: 0;
}

.blog-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
  cursor: pointer;
}

.blog-title:hover {
  color: blue;
}
</style>
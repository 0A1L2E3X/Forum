<template>
  <div class="main-content">
    <div style="display: flex; align-items: flex-start; grid-gap: 10px">
      <div class="card" style="width: 150px">
        <div class="category-item"
             :class="{ 'category-item-active': item.name === current }"
             v-for="item in categoryList" :key="item.id"
             @click="selectCategory(item.name)">
          {{ item.name }}
        </div>
      </div>

      <div class="card" style="flex: 1">
        <div class="blog-box"
             v-for="item in tableData" :key="item.id" v-if="total > 0">
          <div style="flex: 1; width: 0">
            <a :href="'/front/blogDetail?blogID=' + item.id" target="_blank"><div class="blog-title">{{ item.title }}</div></a>
            <div class="line1" style="margin-bottom: 10px; color: #666; font-size: 12px">{{ item.descr }}</div>
            <div style="display: flex">
              <div style="flex: 1; font-size: 12px">
                <span style="margin-right: 20px">publisher: {{ item.userName }}</span>
                <span style="margin-right: 20px">views: {{ item.readCount }}</span>
                <span style="margin-right: 20px">likes: {{ item.likesCount }}</span>
              </div>

              <div style="width: fit-content">
                <el-tag v-for="item in JSON.parse(item.tags || '[]')" :key="item" style="margin-right: 5px">{{ item }}</el-tag>
              </div>
            </div>
          </div>

          <div style="width: 125px">
            <img style="width: 100%; height: 80px; border-radius: 5px" :src="item.cover" alt=""></img>
          </div>
        </div>

        <div v-else  v-if="total === 0" style="padding: 20px 0; text-align: center; font-size: 16px; color: #666">No data</div>

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

      <div style="width: 250px">
        <div class="card" style="margin-bottom: 10px">
          <div style="font-size: 20px; font-weight: bold; margin-bottom: 8px">Hello World!</div>
          <div style="font-size: 12px; color: #666">
            this is a question and answer website created by 0A1L2E3X and this website is 100% free
          </div>
          <a href="/front/person" style="font-size: 12px; text-decoration: underline">Go to ask a question</a>
        </div>

        <div class="card">
          <div style="display: flex; padding-bottom: 10px; border-bottom: 1px solid #ddd; align-items: center">
            <div style="flex: 1; margin-right: 10px; font-weight: bold">Explore Hot Post</div>
            <div style="font-size: 12px; cursor: pointer" @click="refreshTop()"><i class="el-icon-refresh"></i>Refresh</div>
          </div>

          <div>
            <div style="margin: 15px 0" v-for="item in showList" :key="item.id">
              <span style="width: 20px; display: inline-block">
                <span style="color: red" v-if="item.index === 1">{{ item.index }}</span>
                <span style="color: goldenrod" v-else-if="item.index === 2">{{ item.index }}</span>
                <span style="color: blue" v-else-if="item.index === 3">{{ item.index }}</span>
                <span v-else>{{ item.index }}</span>
              </span>
              <span><i>{{ item.title }}</i></span>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {

  data() {
    return {
      current: 'All Blogs',
      categoryList: [],

      tableData: [],  // 所有的数据
      pageNum: 1,   // 当前的页码
      pageSize: 10,  // 每页显示的个数
      total: 0,

      topList: [],
      showList: [],
      lastIndex: 0,

      tagsArr: []
    }
  },
  mounted() {
    this.load()
    this.loadBlogs(1)
    this.refreshTop()
  },
  // methods：本页面所有的点击事件或者其他函数定义区
  methods: {
    load() {
      this.$request.get('category/selectAll').then(res => {
        this.categoryList = res.data || []
        this.categoryList.unshift({ name: 'All Blogs' })
      })
    },
    loadBlogs(pageNum) {
      if (pageNum) this.pageNum = pageNum
      this.$request.get('/blog/selectPage', {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          categoryName: this.current === 'All Blogs' ? null : this.current,
        }
      }).then(res => {
        this.tableData = res.data?.list
        this.total = res.data?.total
      })
    },
    handleCurrentChange(pageNum) {
      this.loadBlogs(pageNum)
    },
    selectCategory(categoryName) {
      this.current = categoryName
      this.loadBlogs(1)
    },
    refreshTop() {
      this.$request.get('/blog/selectTop').then(res => {
        this.topList = res.data || []
        let i = 1
        this.topList.forEach(item => item.index = i++)

        // 0  5  0
        if (this.lastIndex === 20) {
          this.lastIndex = 0
        }
        this.showList = this.topList.slice(this.lastIndex, this.lastIndex + 5)  // 0-5   5- 10  // 0-5
        this.lastIndex += 5  // 5  10  5
      })
    }
  }
}
</script>

<style scoped>
.category-item {
  text-align: center;
  padding: 10px 0;
  font-size: 16px;
  cursor: pointer;
}

.category-item-active {
  background-color: black;
  color: white;
  border-radius: 5px;
}

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

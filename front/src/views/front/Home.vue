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

      <div style="flex: 1">
        <BlogList :categoryName="current" ref="blogListRef" />
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
              <a :href="'/front/blogDetail?blogID=' + item.id">
                <span style="width: 20px; display: inline-block">
                  <span style="color: red" v-if="item.index === 1">{{ item.index }}</span>
                  <span style="color: goldenrod" v-else-if="item.index === 2">{{ item.index }}</span>
                  <span style="color: blue" v-else-if="item.index === 3">{{ item.index }}</span>
                  <span v-else>{{ item.index }}</span>
                </span>
                <span><i>{{ item.title }}</i></span>
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>

import BlogList from "@/components/BlogList.vue";

export default {
  components: { BlogList },

  data() {
    return {
      current: 'All Blogs',
      categoryList: [],

      topList: [],
      showList: [],
      lastIndex: 0,

      tagsArr: []
    }
  },
  mounted() {
    this.load()
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

    selectCategory(categoryName) {
      this.current = categoryName
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
</style>

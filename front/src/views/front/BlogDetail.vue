<template>
  <div class="main-content">
    <div style="display: flex; grid-gap: 10px">
      <div>
        <div class="card" style="font-size: 20px; text-align: center">
          <div>
            <span style="cursor: pointer"><i class="el-icon-circle-plus"></i></span>
          </div>
          <div>
            <span style="cursor: pointer"><i class="el-icon-remove"></i></span>
          </div>
          <div style="margin-top: 10px">
            <span style="cursor: pointer"><i class="el-icon-star-off"></i></span>
          </div>
        </div>
      </div>

      <div style="flex: 1">
        <div class="card" style="padding: 20px 30px; margin-bottom: 10px">
          <div style="font-weight: bold; font-size: 24px; margin-bottom: 20px">{{ blog.title }}</div>

          <div style="margin-bottom: 25px; border-bottom: 1px solid #ddd; padding-bottom: 12px">
            <span style="margin-right: 20px">
<!--              <i class="el-icon-user-solid" style="margin-right: 10px"></i>{{ blog.userName }}-->
              Publisher <span style="font-weight: bold; text-decoration: underline"><i>{{ blog.userName }}</i></span>
            </span>
            <span style="margin-right: 20px">
<!--              <i class="el-icon-date" style="margin-right: 10px"></i>{{ blog.date }}-->
              Publish Date <span style="font-weight: bold; text-decoration: underline"><i>{{ blog.date }}</i></span>
            </span>
            <span>
<!--              <i class="el-icon-view" style="margin-right: 10px"></i>{{ blog.readCount }}-->
              Viewed <span style="font-weight: bold; text-decoration: underline"><i>{{ blog.readCount }}</i></span> times
            </span>
            <span >
              <el-tag v-for="item in tagsArr" :key="item" style="margin-right: 5px">{{ item }}</el-tag>
            </span>
          </div>

          <div class="w-e-text">
            <div v-html="blog.content"></div>
          </div>
        </div>
      </div>

      <div style="width: 260px">
        <div class="card" style="margin-bottom: 10px">
          <div style="display: flex; align-items: center; grid-gap: 12px; margin-bottom: 16px">
            <img :src="blog.user?.avatar" alt="" style="width: 50px">
            <div style="flex: 1">
              <div style="font-weight: bold; font-size: 18px; color: darkblue">{{ blog.user?.name }}</div>
              <div style="margin-top: 5px">posted at {{ blog.date }}</div>
            </div>
          </div>

          <div style="display: flex">
            <div style="flex: 1; text-align: center">
              <div style="margin-bottom: 5px"><i>Articles</i></div>
              <div>0</div>
            </div>

            <div style="flex: 1; text-align: center">
              <div style="margin-bottom: 5px"><i>Likes</i></div>
              <div>0</div>
            </div>

            <div style="flex: 1; text-align: center">
              <div style="margin-bottom: 5px"><i>Favorites</i></div>
              <div>0</div>
            </div>
          </div>
        </div>

        <div class="card" style="margin-bottom: 10px">
          <div style="font-weight: bold;
          font-size: 16px;
          padding-bottom: 10px;
          border-bottom: 1px solid #ddd;
          margin-bottom: 10px">Recommend to read</div>

          <div>
            <div style="margin-bottom: 10px" v-for="item in recommendList" :key="item.id">
              <div>HI</div>
              <div>
                <span>Views</span> <span></span>
                <span style="margin-left: 10px">Likes</span> <span></span>
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          等广告商投喂
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "BlogDetail",
  data() {
    return {
      blogID: this.$route.query.blogID,
      blog: {},

      tagsArr: [],
      recommendList: []
    }
  },

  created() {
    this.load()
  },

  methods: {
    load() {
      this.$request.get('/blog/selectById/' + this.blogID).then(res => {
        this.blog = res.data || {}

        this.tagsArr = JSON.parse(this.blog.tags || '[]')
      })
    }
  }
}
</script>

<style>
/* blockquote 样式 */
blockquote {
  display: block;
  border-left: 8px solid #d0e5f2;
  padding: 20px 10px;
  margin: 10px 0;
  line-height: 1.4;
  font-size: 100%;
  background-color: #f1f1f1;
}

/* code 样式 */
code {
  display: inline-block;
  *display: inline;
  *zoom: 1;
  background-color: #f1f1f1;
  border-radius: 3px;
  padding: 3px 5px;
  margin: 0 3px;
}
pre code {
  display: block;
}
p {
  line-height: 30px
}
</style>
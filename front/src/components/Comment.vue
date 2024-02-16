<template>
  <!-- comments -->
  <div class="card">
    <h3 style="font-weight: bold; margin-bottom: 16px">Comments: {{ commentCount }}</h3>

    <div style="margin-bottom: 20px">
      <el-input type="textarea" placeholder="Please write your opinions" v-model="commentContent"></el-input>
      <div style="text-align: right; margin-top: 5px">
        <el-button size="medium" @click="addComment()">Add a comment</el-button>
      </div>
    </div>

    <div>
      <div style="display: flex; grid-gap: 20px; margin-bottom: 20px" v-for="item in commendList" :key="item.id">
        <img :src="item.avatar" alt="" style="width: 40px; height: 40px; border-radius: 50%">
        <div style="flex: 1">
          <!-- comment -->
          <div style="margin-bottom: 20px">
            <div style="margin-bottom: 5px; font-weight: bold">@{{ item.userName }}</div>
            <div style="margin-bottom: 5px">{{ item.content }}</div>
            <div style="color: #666; font-size: 12px; cursor: pointer" >
              <span style="margin-right: 20px">{{ item.time }}</span>
              <span :class="{ 'comment-active' : item.showReplyInput }" style="cursor: pointer" @click="handleShowReplyInput(item)">
                <i class="el-icon-s-comment"></i> Add comment
              </span>

              <span @click="del(item.id)" style="cursor: pointer" v-if="item.userId === user.id"><i class="el-icon-delete"></i> delete</span>
            </div>

            <div style="margin-top: 15px" v-if="item.showReplyInput">
              <el-input type="textarea" placeholder="Add a comment" v-model="item.replyContent"></el-input>
              <div style="text-align: right; margin-top: 5px">
                <el-button size="mini" @click="addReply(item)">Add a comment</el-button>
              </div>
            </div>
          </div>
          <!-- comment -->

          <!-- reply -->
          <div style="display: flex; grid-gap: 20px; margin-bottom: 20px" v-for="sub in item.child" :key="sub.id">
            <img :src="sub.avatar" alt="" style="width: 35px; height: 35px; border-radius: 50%">
            <div style="flex: 1">
              <div style="margin-bottom: 5px">
                <span style="font-weight: bold">@{{ sub.userName }}</span>
                <span v-if="sub.replyUser !== item.userName"> reply {{ sub.replyUser }}</span>
              </div>
              <div style="margin-bottom: 5px">{{ sub.content }}</div>
              <div style="color: #666; font-size: 12px; cursor: pointer">
                <span style="margin-right: 20px">{{ sub.time }}</span>
                <span :class="{ 'comment-active' : sub.showReplyInput }" style="cursor: pointer" @click="handleShowReplyInput(sub)">
                  <i class="el-icon-s-comment"></i> Add comment
                </span>

                <span @click="del(sub.id)" style="cursor: pointer" v-if="sub.userId === user.id"><i class="el-icon-delete"></i> delete</span>
              </div>

              <div style="margin-top: 15px" v-if="sub.showReplyInput">
                <el-input type="textarea" placeholder="Add a comment" v-model="sub.replyContent"></el-input>
                <div style="text-align: right; margin-top: 5px">
                  <el-button size="mini" @click="addReply(sub)">Add a comment</el-button>
                </div>
              </div>
            </div>
          </div>
          <!-- reply -->
        </div>
      </div>
    </div>
  </div>
  <!-- end comments -->
</template>

<script>
export default {
  name: "CommentComponent",
  props: {
    fid: null,
    module: null,
  },

  data() {
    return {
      commentCount: 0,
      commentContent: '',
      commendList: [],

      user: JSON.parse(localStorage.getItem('xm-user') || '{}')
    }
  },

  created() {
    this.loadComment()
  },

  methods: {
    del(id) {
      this.$confirm('are yous sure to delete it?', 'confirm', {type: "warning"}).then(response => {
        this.$request.delete('/comment/delete/' + id).then(res => {
          if (res.code === '200') {   // 表示操作成功
            this.$message.success('success')
            this.loadComment()
          } else {
            this.$message.error(res.msg)
          }
        })
      }).catch(() => {
      })
    },

    handleShowReplyInput(item) {
      this.$set(item, 'showReplyInput', !item.showReplyInput)
    },

    addReply(item) {
      this.$request.post('comment/add', {
        pid: item.id, rootId: item.rootId, content: item.replyContent, fid: this.fid, module: this.module
      }).then(res => {
        if (res.code === '200') {
          this.$message.success("success")
          item.replyContent = ''
          this.loadComment()
        }
      })
    },

    loadComment() {
      this.$request.get('/comment/selectAllForUser', {
        params: { fid: this.fid, module: this.module }
      }).then(res => {
        this.commendList = res.data || []
      })

      this.$request.get('comment/selectCount', {
        params: { fid: this.fid, module: this.module }
      }).then(res => {
        this.commentCount = res.data || 0
      })
    },

    addComment() {
      this.$request.post('comment/add', { content: this.commentContent, fid: this.fid, module: this.module }).then(res => {
        if (res.code === '200') {
          this.$message.success("success")
          this.commentContent = ''
          this.loadComment()
        }
      })
    },
  }
}
</script>
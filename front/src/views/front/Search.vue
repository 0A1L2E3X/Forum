<template>
  <div class="main-content">
    <BlogList />
  </div>
</template>

<script>
import BlogList from "@/components/BlogList.vue";

export default {
  name: "Search",
  components: {BlogList},

  data() {
    return {
      title: this.$route.query.title
    }
  },

  created() {
  },

  methods: {

  }
}
</script>

<style scoped>

</style>
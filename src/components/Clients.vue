
<template>
  <p>{{posts}}</p>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      posts: []
    }
  },
  async created () {
    axios.defaults.headers.common['Authorization'] = `Bearer ${await this.$auth.getAccessToken()}`
    try {
      const response = await axios.get(`https://api.traininblocks.com/clients`)
      this.posts = response.data
    } catch (e) {
      console.error(`${e}`)
    }
  }
}
</script>
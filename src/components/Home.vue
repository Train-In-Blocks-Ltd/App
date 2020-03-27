<template>
  <div id="home">
    <div>
      <h1>Explore</h1>
      <p>Welcome back, {{$parent.claims.name}}!</p>
      <div v-for="(messages, index) in posts"
            :key="index">
        <p>{{messages.date}}</p>
      </div>
      <p>{{posts}}</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data: function () {
    return {
      posts: 'Loading clients...'
    }
  },
  async created () {
    this.clients()
    function hexToRgb (hex) {
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null
    }
    this.$parent.claims = await this.$auth.getUser()
    this.$parent.colors.rgba.r = await hexToRgb(this.$parent.claims.color).r
    this.$parent.colors.rgba.g = await hexToRgb(this.$parent.claims.color).g
    this.$parent.colors.rgba.b = await hexToRgb(this.$parent.claims.color).b
  },
  methods: {
    async clients () {
      await this.$auth.getUser()
      if (this.$parent.authenticated) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${await this.$auth.getAccessToken()}`
        try {
          const response = await axios.get(`https://api.traininblocks.com/clients`)
          this.posts = response.data
        } catch (e) {
          console.error(`${e}`)
        }
      }
    }
  }
}
</script>
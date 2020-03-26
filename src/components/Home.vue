<style>
  #logout_message {
    text-align: center;
    font-size: 2.5rem;
  }
</style>
</style>
<template>
  <div id="home">
    <h1 v-if="!this.$parent.authenticated" id="logout_message">You have been logged out successfully</h1>

    <div v-if="this.$parent.authenticated">
      <h1>Explore</h1>
      <p>Welcome back, {{claims.name}}!</p>
      <div v-for="(messages, index) in posts"
            :key="index">
        <p>{{messages.date}}</p>
      </div>
      <p>{{posts.messages[0].date}}</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'home',
  data: function () {
    return {
      claims: '',
      posts: 'Loading clients...'
    }
  },
  created () {
    this.setup()
    this.clients()
  },
  methods: {
    async setup () {
      this.claims = await this.$auth.getUser()
    },
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
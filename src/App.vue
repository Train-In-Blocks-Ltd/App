<style>
  body {
    background-color: #ffffff;
    font-family: Raleway, sans-serif;
    margin: 0;
    min-height: 100vh;
    display: grid;
  }
  #app {
    display: grid;
    grid-template-areas: "main";
  }
  main {
    grid-area: main;
    display: grid;
    align-items: center;
  }
  #app.authenticated {
    display: grid;
    grid-template-areas: "sidebar main main main";
  }
  .sidebar.authenticated {
    grid-area: sidebar;
  }
</style>
<template>
  <div id="app" v-bind:class="{'authenticated': authenticated}">
    <div class="sidebar" v-if="authenticated">
      <router-link
        to="/"
        class="header item"
      >
        <img
          class="ui mini image"
          src="./assets/logo.png"
        >
        &nbsp;
        Train in Blocks
      </router-link>
      <router-link
        to="/login"
        class="item"
        v-if="!authenticated"
      >
      Login
      </router-link>
      <router-link
        to="/profile"
        class="item"
        id="profile-button"
        v-if="authenticated"
      >
      Account
      </router-link>
      <router-link
        to="/"
        id="logout-button"
        class="item"
        v-if="authenticated"
        v-on:click.native="logout()"
      >
      Logout
      </router-link>
    </div>
    <main>
      <router-view/>
    </main>
  </div>
</template>

<script>
export default {
  name: 'app',
  data: function () {
    return { authenticated: false }
  },
  created () { this.isAuthenticated() },
  watch: {
    // Everytime the route changes, check for auth status
    '$route': 'isAuthenticated'
  },
  methods: {
    async isAuthenticated () {
      this.authenticated = await this.$auth.isAuthenticated()
    },
    async logout () {
      await this.$auth.logout()
      await this.isAuthenticated()
    }
  }
}
</script>

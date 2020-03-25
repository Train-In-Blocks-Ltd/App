<style>
  body {
    background-color: #ffffff;
    font-family: Raleway, sans-serif;
    margin: 0;
    min-height: 100vh;
    display: grid;
    font-size: 16px;
  }
  #app {
    display: grid;
    grid-template-areas: "main";
  }
  main {
    grid-area: main;
    display: grid;
    align-items: center;
    padding: 80px 60px;
  }
  #app.authenticated {
    display: grid;
    grid-template-areas: "sidebar main";
    grid-template-columns: 260px 1fr;
  }
  .sidebar {
    grid-area: sidebar;
    display: grid;
    text-align: center;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.25);
    padding: 80px 0;
  }
</style>
<template>
  <div id="app" v-bind:class="{'authenticated': authenticated}">
    <div class="sidebar" v-if="authenticated">
      <div class="logo_container">
        <router-link to="/" class="logo_link">
          <img class="logo" src="./assets/logo.png" width="60px">
        </router-link>
      </div>
      <div class="nav_item">
        <router-link to="/account" id="account-button">Account</router-link>
      </div>
      <div class="nav_item">
        <router-link to="/" id="logout-button" v-on:click.native="logout()">Logout</router-link>
      </div>
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

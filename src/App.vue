<style>
  * {
    box-sizing: border-box;
  }
  body {
    background-color: #ffffff;
    color: #282828;
    font-family: 'Raleway', sans-serif;
    margin: 0;
    min-height: 100vh;
    display: grid;
    font-size: 16px;
  }
  h1 {
    margin-top: -1rem;
    margin-bottom: 5rem;
    font-weight: bold;
    font-size: 3.75rem;
    text-transform: uppercase;
    letter-spacing: 0.15em;
  }
  a {
    text-decoration: none;
    color: #282828;
    font-weight: bold;
  }
  a:hover {
    text-decoration: underline;
  }
  #app {
    display: grid;
    grid-template-areas: "main";
  }
  main {
    grid-area: main;
    display: grid;
    align-items: start;
    padding: 5rem 3.75rem;
  }
  #app.authenticated {
    display: grid;
    grid-template-areas: "sidebar main";
    grid-template-columns: 260px 1fr;
  }
  .sidebar {
    grid-area: sidebar;
    display: grid;
    text-align: left;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.25);
    padding: 5rem 2.5rem;
    grid-auto-rows: 3.75rem auto;
    grid-gap: 3.75rem;
  }
  .logo_container {
    text-align: center;
  }
  .account_nav_container {
    align-self: end;
    text-align: center;
  }
  .nav_item {
    padding: 1rem 0;
  }
  .nav_item:last-of-type {
    padding-bottom: 0;
  }
  pwa-update {
    display: none;
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
          <router-link to="/" id="explore-link">Explore</router-link>
        </div>
      <div class="account_nav_container">
        <div class="nav_item">
          <router-link to="/account" id="account-link">Account</router-link>
        </div>
        <div class="nav_item">
          <router-link to="/" id="logout-link" v-on:click.native="logout()">Logout</router-link>
        </div>
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

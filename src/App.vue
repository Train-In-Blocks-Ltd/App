<style>
  * {
    box-sizing: border-box;
  }
  body {
    background-color: #ffffff;
    font-family: 'Raleway', sans-serif;
    margin: 0;
    min-height: 100vh;
    display: grid;
    font-size: 16px;
    letter-spacing: 0.1em;
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
    color: rgb(
      var(--accessible-color),
      var(--accessible-color),
      var(--accessible-color)
    );
    font-weight: bold;
  }
  a:hover, .router-link-exact-active {
    text-decoration: underline;
  }
  .small {
    font-size: 0.8rem;
  }
  .button {
    text-align: center;
    border-radius: 4px;
    border: 1px solid rgb(
      var(--accessible-color),
      var(--accessible-color),
      var(--accessible-color)
    );
    padding: 0.5rem;
    font-family: 'Raleway', sans-serif;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
    color: rgb(
      var(--accessible-color),
      var(--accessible-color),
      var(--accessible-color)
    );
    background-color: rgba(
      calc(var(--red) + 30),
      calc(var(--green) + 30),
      calc(var(--blue) + 30),
      0.8
    );
    margin: 0.5rem 0;
    display: inline-block;
  }
  .button:hover {
    background-color: rgba(
      calc(var(--red) + 45),
      calc(var(--green) + 45),
      calc(var(--blue) + 45),
      1
    );
    text-decoration: none;
  }
  input[type="text"], textarea, input[type="email"], input[type="tel"], input[type="search"] {
    color: rgb(
      var(--accessible-color),
      var(--accessible-color),
      var(--accessible-color)
    );
    border-radius: 4px;
    border: 1px solid rgb(
      var(--accessible-color),
      var(--accessible-color),
      var(--accessible-color)
    );
    margin: 0.75rem 0;
    padding: 0.5rem;
    font-family: 'Raleway', sans-serif;
    display: inline-block;
    background-color: rgba(
      calc(var(--red) + 45),
      calc(var(--green) + 45),
      calc(var(--blue) + 45),
      0.8
    )!important;
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
  main div {
    max-width: 750px
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
    position: sticky;
    height: 100vh;
    top: 0;
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
  pwa-update, .vc-chrome-toggle-icon-highlight, .vc-chrome-alpha-wrap, .vc-chrome-field:nth-of-type(4) {
    display: none;
  }
  .vc-chrome-body, .vc-chrome-fields .vc-input__input  {
    background-color: rgba(
      calc(var(--red) + 30),
      calc(var(--green) + 30),
      calc(var(--blue) + 30),
      0.8
    )!important;
  }
  .vc-chrome-toggle-icon svg path {
    fill: rgb(
      var(--accessible-color),
      var(--accessible-color),
      var(--accessible-color)
    )!important;
  }
  .vc-chrome-fields .vc-input__input {
    padding: 0.75rem 0!important;
    box-shadow: none!important;
    border-radius: 4px!important;
    border: 1px solid rgb(
      var(--accessible-color),
      var(--accessible-color),
      var(--accessible-color)
    )!important;
    font-size: 0.9rem!important;
  }
  .vc-chrome-fields .vc-input__label {
    font-size: 0.8rem!important;
  }
  .vc-chrome-fields .vc-input__input, .vc-chrome-fields .vc-input__label {
    font-family: 'Raleway', sans-serif!important;
    color: rgb(
      var(--accessible-color),
      var(--accessible-color),
      var(--accessible-color)
    )!important;
  }
  .vc-chrome {
    box-shadow: none!important;
  }
  #app {
    --accessible-color: calc(
      (
        (
          (
            (var(--red) * 299) +
            (var(--green) * 587) +
            (var(--blue) * 114)
          ) / 1000
        ) - 128
      ) * -1000
    );
    color: rgb(
      var(--accessible-color),
      var(--accessible-color),
      var(--accessible-color)
    );
    background-color: rgb(
      var(--red),
      var(--green),
      var(--blue)
    )
  }
  ::placeholder {
    color: rgba(
      var(--accessible-color),
      var(--accessible-color),
      var(--accessible-color),
      0.6
    );
    opacity: 1; /* Firefox */
  }
  .nav_subitem {
    padding: 0.8rem 0;
  }
  .nav_subitem:first-of-type {
    padding-top: 0;
  }
  .nav_subitem:last-of-type {
    padding-bottom: 0;
  }
  .nav_subitem:before {
    content: '>  '
  }
  .nav_subitem a {
    font-weight: 400;
  }
</style>
<template>
  <div id="app" v-bind:class="{'authenticated': authenticated}" :style="{'--red': colors.rgba.r, '--green': colors.rgba.g, '--blue': colors.rgba.b}">
    <div class="sidebar" v-if="authenticated">
      <div class="logo_container">
        <router-link to="/" class="logo_link">
          <img class="logo" src="./assets/logo.png" width="60px">
        </router-link>
      </div>
      <div class="main_nav">
        <div class="nav_item">
            <router-link to="/" id="explore-link">Explore</router-link>
        </div>
        <div v-for="(clients, index) in posts"
            :key="index" class="nav_subitem">
          <router-link :to="'/client/'+clients.name">{{clients.name}}</router-link>
        </div>
      </div>
      <div class="account_nav_container">
        <div class="nav_item">
          <router-link to="/account" id="account-link">Account</router-link>
        </div>
        <div class="nav_item">
          <router-link to="/logout" id="logout-link" v-on:click.native="logout()">Logout</router-link>
        </div>
      </div>
    </div>
    <main>
      <router-view/>
    </main>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data: function () {
    return {
      error: '',
      posts: '',
      loading_clients: true,
      no_clients: false,
      claims: '',
      authenticated: false,
      colors: {
        rgba: {
          r: 255,
          g: 255,
          b: 255,
          a: 1
        }
      }
    }
  },
  created () {
    this.isAuthenticated()
    this.setup()
    this.clients()
  },
  watch: {
    // Everytime the route changes, check for auth status
    '$route': 'isAuthenticated'
  },
  methods: {
    setColor (value) {
      this.colors = value
    },
    async setup () {
      this.claims = await this.$auth.getUser()
      this.colors.rgba.r = this.hexToRgb(this.claims.color).r
      this.colors.rgba.g = this.hexToRgb(this.claims.color).g
      this.colors.rgba.b = this.hexToRgb(this.claims.color).b
    },
    hexToRgb (hex) {
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null
    },
    async isAuthenticated () {
      this.authenticated = await this.$auth.isAuthenticated()
    },
    async logout () {
      await this.$auth.logout()
      await this.isAuthenticated()
    },
    async clients () {
      await this.$auth.getUser()
      if (this.authenticated) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${await this.$auth.getAccessToken()}`
        try {
          const response = await axios.get(`https://api.traininblocks.com/clients/${this.claims.sub}`)
          if (response.data.length === 0) {
            this.no_clients = true
          } else {
            this.posts = response.data
          }
          this.loading_clients = false
        } catch (e) {
          this.no_clients = true
          this.loading_clients = false
          this.error = e.toString()
        }
      }
    }
  }
}
</script>

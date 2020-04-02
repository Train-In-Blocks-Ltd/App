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
  input[type="text"], textarea, input[type="email"], input[type="tel"], input[type="search"], input[type="number"], input[type="date"] {
    color: rgb(
      var(--accessible-color),
      var(--accessible-color),
      var(--accessible-color)
    );
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
    .form_grid {
    display: grid;
    grid-template-columns: max-content 1fr;
    align-items: center;
    max-width: 660px;
    grid-column-gap: 1rem;
  }
  .form_buttons {
    grid-column: span 2;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 2rem;
    max-width: 200px;
  }
  #notes {
    resize: vertical;
    min-height: 2rem;
    height: 4rem;
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
  main > div {
    max-width: calc(100% - 3.75rem - 3.75rem - 3.75rem);
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
    padding: 5rem 2.5rem 2.5rem 2.5rem;
    grid-auto-rows: 3.75rem auto min-content;
    position: sticky;
    height: 100vh;
    top: 0;
  }
  .logo_container {
    text-align: center;
  }
  .logo_container a {
    display: block;
    height: 60px;
  }
  .logo_container svg {
    margin-top: -8px;
  }
  .logo_container svg defs path {
    fill: rgb(
      var(--accessible-color),
      var(--accessible-color),
      var(--accessible-color)
    )
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
  svg path:not(.transparent) {
    fill: rgba(
      var(--accessible-color),
      var(--accessible-color),
      var(--accessible-color),
      0.6
    );
  }
  .nav_subitem {
    padding: 0.8rem 0;
  }
  .nav_subitem:before {
    content: '>  '
  }
  .nav_subitem a {
    font-weight: 400;
  }
  .main_nav {
    border-bottom: 0.5px solid rgba(
      var(--accessible-color),
      var(--accessible-color),
      var(--accessible-color),
      0.1
    );
    border-top: 0.5px solid rgba(
      var(--accessible-color),
      var(--accessible-color),
      var(--accessible-color),
      0.1
    );
    overflow-y: auto;
    margin-top: 3.75rem;
    margin-bottom: 2.5rem;
  }
  .main_nav::-webkit-scrollbar-track {
    border: 1px solid rgb(
      var(--accessible-color),
      var(--accessible-color),
      var(--accessible-color)
    );
    background-color: #FFFFFF;
  }
  .main_nav::-webkit-scrollbar {
    width: 10px;
    background-color: #FFFFFF;
  }
  .main_nav::-webkit-scrollbar-thumb {
    background-color: rgba(
      calc(var(--red) + 45),
      calc(var(--green) + 45),
      calc(var(--blue) + 45),
      0.8
    )
  }
  .account_nav_container .nav_item:first-of-type {
    padding-top: 0;
  }
  @media (min-width: 768px) {
    #hamburger, #close {
      display: none;
    }
  }
  @media (max-width: 768px) {
    #app.authenticated {
      display: block;
    }
    main > div {
      max-width: 100%;
    }
    h1 {
      font-size: 1.4rem;
      text-align: center;
      margin-top: -.9rem;
      margin-bottom: 2.5rem;
      margin-left: 1.25em;
    }
    .sidebar {
      position: fixed;
      width: 100%;
      background-color: rgb(
        var(--red),
        var(--green),
        var(--blue)
      );
      transition: opacity 0.5s, z-index 1s;
      z-index: -1;
      opacity: 0;
    }
    .sidebar.open {
      opacity: 1;
      z-index: 99;
    }
    main {
      padding: 2.5rem 1.875rem;
    }
    #hamburger, #close {
      position: absolute;
      left: 1.875rem;
      top: 1.5rem;
    }
    #hamburger svg path:not(.transparent), #close svg path:not(.transparent) {
      fill: rgb( var(--accessible-color), var(--accessible-color), var(--accessible-color));
    }
  }
</style>
<template>
  <div id="app" v-bind:class="{'authenticated': authenticated}" :style="{'--red': colors.rgba.r, '--green': colors.rgba.g, '--blue': colors.rgba.b}">
    <a href="javascript:void(0)" title="sidebar" v-on:click="sidebar()" id="hamburger"><svg xmlns="http://www.w3.org/2000/svg" height="32" viewBox="0 0 24 24" width="32"><path d="M0 0h24v24H0V0z" fill="none" class="transparent"/><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg></a>
    <div class="sidebar" v-if="authenticated" v-bind:class="{'open': open}">
      <a id="close" v-on:click="sidebar()"><svg xmlns="http://www.w3.org/2000/svg" height="32" viewBox="0 0 24 24" width="32"><path d="M0 0h24v24H0V0z" fill="none" class="transparent"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg></a>
      <div class="logo_container">
        <router-link to="/" class="logo_link" title="Home">
          <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width="74" height="74"><defs><path d="M380 580L380 380L580 380L580 580L380 580ZM260 260L260 580L60 580L60 60L580 60L580 260L260 260Z" id="go6TfJQF0"></path></defs><g><g><g><use xlink:href="#go6TfJQF0"></use></g></g></g></svg>
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
          <router-link to="/archive" id="archive-link">Archive</router-link>
        </div>
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
      open: false,
      error: '',
      posts: null,
      loading_clients: true,
      no_clients: false,
      claims: null,
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
  async created () {
    await this.isAuthenticated()
    await this.setup()
    await this.clients_to_vue()
  },
  watch: {
    // Everytime the route changes, check for auth status
    '$route' (to, from) {
      this.isAuthenticated()
      this.sidebar()
    }
  },
  methods: {
    sidebar () {
      this.open = !this.open
    },
    client_archive (id) {

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
      localStorage.clear()
    },
    async clients_to_vue () {
      if (!localStorage.getItem('posts')) {
        await this.clients()
      }
      this.posts = JSON.parse(localStorage.getItem('posts'))
      this.loading_clients = false
    },
    async clients () {
      this.error = false
      if (this.authenticated) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${await this.$auth.getAccessToken()}`
        try {
          const response = await axios.get(`https://api.traininblocks.com/clients/${this.claims.sub}`)
          if (response.data.length === 0) {
            this.no_clients = true
          } else {
            localStorage.setItem('posts', JSON.stringify(response.data))
            this.no_clients = false
            this.error = false
          }
          this.loading_clients = false
        } catch (e) {
          this.no_clients = false
          this.loading_clients = false
          this.error = e.toString()
        }
      }
    }
  }
}
</script>

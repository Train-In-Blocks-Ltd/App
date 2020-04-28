<style>
  * {
    box-sizing: border-box;
  }
  input:focus, textarea:focus {
    outline-width: 0;
  }
  #home {
    display: flex;
    flex-direction: column;
  }
  body {
    font-family: Arial, Helvetica, sans-serif;
    margin: 0;
    min-height: 100vh;
    display: grid;
    font-size: 12px;
    letter-spacing: 0.15em;
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
    padding: 0.5rem 1rem;
    height: auto;
    width: auto;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 0.9rem;
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
    transition: background-color 0.4s, color 0.2s;
  }
  .button:hover {
    background-color: rgba(
      calc(var(--red) + 45),
      calc(var(--green) + 45),
      calc(var(--blue) + 45),
      1
    );
    text-decoration: none;
    background-color: #282828;
    color: #fff;
  }
  input[type="text"], textarea, input[type="email"], input[type="tel"], input[type="search"], input[type="number"], input[type="date"] {
    color: rgb(
      var(--accessible-color),
      var(--accessible-color),
      var(--accessible-color)
    );
    border-bottom: 1px solid rgb(
      var(--accessible-color),
      var(--accessible-color),
      var(--accessible-color)
    );
    background-color: rgba(
      calc(var(--red) + 45),
      calc(var(--green) + 45),
      calc(var(--blue) + 45),
      0.8
    )!important;
    margin: 0.75rem 0;
    padding: 0.5rem;
    border: 1px solid #282828;
    display: inline-block;
    resize: none;

    font-family: Arial, Helvetica, sans-serif;
    letter-spacing: 0.10em;

  }
  .form_grid {
    display: flex;
    flex-direction: column;
    max-width: 660px;
    margin: 0;
  }
  /* Standardised Compoments */
  .add-new {
    font-size: 2em;
    margin: 2rem 0 0.2rem 0;
  }
  .input-xsmall {
    width: 10rem;
    height: 2.6em;
  }
  .input-small {
    width: 20.3rem;
  }
  .input-medium {
    width: 25rem;
  }
  .form_buttons {
    place-content: start;
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
    background: #f9f9f9;
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
    background-color: #fff;
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
    );
  }
  .account_nav_container {
    align-self: end;
    text-align: center;
  }
  .nav_item {
    padding: 0.5rem 0;
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
    font-family: Arial, Helvetica, sans-serif!important;
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
  .loading-grid {
    display: inline-grid;
    grid-template-columns: repeat(2, auto);
    place-items: end;
    justify-self: start;
    grid-gap: 1rem;
  }
  .loader, .loader svg {
    width: 4rem;
    height: 3.5rem;
  }
  .loader circle {
    fill: rgb(
      var(--accessible-color),
      var(--accessible-color),
      var(--accessible-color)
    );
  }
  svg path:not(.transparent) {
    fill: rgba(
      var(--accessible-color),
      var(--accessible-color),
      var(--accessible-color),
      0.6
    );
  }
  
  /* Nav Spacing */
  .nav_item {
    font-size: 1.2em;
  }
  .nav_subitem {
    padding: 0.4rem 0;
  }
  .nav_subitem.subitem {
    padding: 0.8rem 0 0 0.8rem;
  }
  .nav_subitem.subitem:last-of-type {
    padding-bottom: 1rem;
  }

  /* Nav--Animated Underline */
  .nav_item > a {
    color: #282828;
    text-decoration: none;
    position: relative;
  }
  .nav_item > a:hover {
    color: #282828;
  }
  .nav_item > a:before {
    content: "";
    position: absolute;
    width: 0%;
    height: 1px;
    bottom: 0;
    left: 0;
    background-color: #282828;

    visibility: hidden;
    transition: all 0.3s;
    transition-timing-function: cubic-bezier(0.075, 0.82, 0.165, 1);
  }
  .nav_item > a:hover:before {
    visibility: visible;
    width: 100%;
  }
  .nav_subitem > a {
    position: relative;

    font-weight: 400;
    color: #282828;
    text-decoration: none;
  }
  .nav_subitem > a:hover {
    color: #282828;
  }
  .nav_subitem > a:before {
    content: "";
    position: absolute;
    width: 0%;
    height: 1px;
    bottom: 0;
    left: 0;
    background-color: #282828;

    visibility: hidden;
    transition: all 0.3s;
    transition-timing-function: cubic-bezier(0.075, 0.82, 0.165, 1);
  }
  .nav_subitem > a:hover:before {
    visibility: visible;
    width: 100%;
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
    border: 1px solid white;
    background-color: #FFFFFF;
  }
  .main_nav::-webkit-scrollbar {
    width: 10px;
    background-color: #FFFFFF;
  }
  .main_nav::-webkit-scrollbar-thumb {
    background-color: rgba(0,0,0,0.2)
  }
  .account_nav_container .nav_item:first-of-type {
    padding-top: 0;
  }
  .client_container p {
    margin: 0;
    margin-right: 0.8rem;
    font-weight: 400;
  }
  .client_container {
    border-bottom: 1px solid rgb(
      var(--accessible-color),
      var(--accessible-color),
      var(--accessible-color)
    );
    margin: 0.2rem 0;
    font-size: 1rem;
    font-weight: 400;
    grid-template-columns: 1fr 0.1fr;
    width: 20rem;
    transition: width 1s;
    transition-timing-function: cubic-bezier(0.075, 0.82, 0.165, 1);
  }
  .client_container:not(.archived):hover {
    width: 30rem;
  }
  .client_link {
    padding: 0.2rem 0;
    display: flex;
    align-items: center;
  }
  .client_link:hover {
    text-decoration: none;
  }
  .search {
    width: 30rem;
    opacity: 40%;
    font-size: 1rem;

    transition: opacity 1500ms;
    transition-timing-function: cubic-bezier(0.075, 0.82, 0.165, 1);
  }
  .search:hover, :focus {
    opacity: 100%;
  }
  .add_new_client_container {
    margin-top: 2rem;
  }
  .client_update {
    transition: 0.5s;
    font-size: 0.5rem;
  }
  .client_update a {
    height: 32px;
    width: 32px;
    transition: 0.5s;
    display: grid;
    text-align: center;
    float: right;
    align-items: center;
    justify-content: center;
  }
  .client_update a:hover {
    cursor: pointer;
    border-radius: 50px;
    background-color: rgba( calc(var(--red) + 45), calc(var(--green) + 45), calc(var(--blue) + 45), 0.8 );
  }
  .client_update a:hover svg path:not(.transparent) {
    fill: rgba(
      var(--accessible-color),
      var(--accessible-color),
      var(--accessible-color),
      1
    );
  }
  #add_client-link {
    margin-top: 1.75rem;
    width: 10rem;  
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
      padding: 5rem 1.875rem;
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

  /* QUILL */
  textarea {
    overflow-y: hidden;
    resize: none;
    appearance: none;
    -webkit-appearance: none;
  }
  .quill {
    margin: 0.75rem 0;
  }
  .ql-toolbar.ql-snow {
    border:none;
  }
  .ql-snow .ql-stroke {
    stroke: rgb(
      var(--accessible-color),
      var(--accessible-color),
      var(--accessible-color)
    )
  }
  .ql-editor {
    min-height: 400px;
    max-height: 400px ;
    color:rgb(
              var(--accessible-color),
              var(--accessible-color),
              var(--accessible-color)
            );
    overflow-y: auto;
  }
  .ql-snow.ql-toolbar button:hover, .ql-snow .ql-toolbar button:hover, .ql-snow.ql-toolbar button.ql-active, .ql-snow .ql-toolbar button.ql-active, .ql-snow.ql-toolbar .ql-picker-label:hover, .ql-snow .ql-toolbar .ql-picker-label:hover, .ql-snow.ql-toolbar .ql-picker-label.ql-active, .ql-snow .ql-toolbar .ql-picker-label.ql-active, .ql-snow.ql-toolbar .ql-picker-item:hover, .ql-snow .ql-toolbar .ql-picker-item:hover, .ql-snow.ql-toolbar .ql-picker-item.ql-selected, .ql-snow .ql-toolbar .ql-picker-item.ql-selected {
    color: rgba(
          var(--accessible-color),
          var(--accessible-color),
          var(--accessible-color),
          0.6
        );
  }
  .ql-snow.ql-toolbar button:hover .ql-stroke, .ql-snow .ql-toolbar button:hover .ql-stroke, .ql-snow.ql-toolbar button.ql-active .ql-stroke, .ql-snow .ql-toolbar button.ql-active .ql-stroke, .ql-snow.ql-toolbar .ql-picker-label:hover .ql-stroke, .ql-snow .ql-toolbar .ql-picker-label:hover .ql-stroke, .ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-stroke, .ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-stroke, .ql-snow.ql-toolbar .ql-picker-item:hover .ql-stroke, .ql-snow .ql-toolbar .ql-picker-item:hover .ql-stroke, .ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-stroke, .ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-stroke, .ql-snow.ql-toolbar button:hover .ql-stroke-miter, .ql-snow .ql-toolbar button:hover .ql-stroke-miter, .ql-snow.ql-toolbar button.ql-active .ql-stroke-miter, .ql-snow .ql-toolbar button.ql-active .ql-stroke-miter, .ql-snow.ql-toolbar .ql-picker-label:hover .ql-stroke-miter, .ql-snow .ql-toolbar .ql-picker-label:hover .ql-stroke-miter, .ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-stroke-miter, .ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-stroke-miter, .ql-snow.ql-toolbar .ql-picker-item:hover .ql-stroke-miter, .ql-snow .ql-toolbar .ql-picker-item:hover .ql-stroke-miter, .ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-stroke-miter, .ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-stroke-miter {
    stroke: rgba(
              var(--accessible-color),
              var(--accessible-color),
              var(--accessible-color),
              0.6
            )
  }
  .ql-snow.ql-toolbar button:hover .ql-fill, .ql-snow .ql-toolbar button:hover .ql-fill, .ql-snow.ql-toolbar button.ql-active .ql-fill, .ql-snow .ql-toolbar button.ql-active .ql-fill, .ql-snow.ql-toolbar .ql-picker-label:hover .ql-fill, .ql-snow .ql-toolbar .ql-picker-label:hover .ql-fill, .ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-fill, .ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-fill, .ql-snow.ql-toolbar .ql-picker-item:hover .ql-fill, .ql-snow .ql-toolbar .ql-picker-item:hover .ql-fill, .ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-fill, .ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-fill, .ql-snow.ql-toolbar button:hover .ql-stroke.ql-fill, .ql-snow .ql-toolbar button:hover .ql-stroke.ql-fill, .ql-snow.ql-toolbar button.ql-active .ql-stroke.ql-fill, .ql-snow .ql-toolbar button.ql-active .ql-stroke.ql-fill, .ql-snow.ql-toolbar .ql-picker-label:hover .ql-stroke.ql-fill, .ql-snow .ql-toolbar .ql-picker-label:hover .ql-stroke.ql-fill, .ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-stroke.ql-fill, .ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-stroke.ql-fill, .ql-snow.ql-toolbar .ql-picker-item:hover .ql-stroke.ql-fill, .ql-snow .ql-toolbar .ql-picker-item:hover .ql-stroke.ql-fill, .ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-stroke.ql-fill, .ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-stroke.ql-fill {
    fill: rgba(
              var(--accessible-color),
              var(--accessible-color),
              var(--accessible-color),
              0.6
            )
  }
  
  /* Scrollbar */
  ::-webkit-scrollbar {
      width: 6px;
  }

  ::-webkit-scrollbar-track {
      background: transparent; 
  }
    
  ::-webkit-scrollbar-thumb {
      background: #00000020; 
  }
    
  ::-webkit-scrollbar-thumb:hover {
      background: #00000030;
  }
</style>
<template>
  <!-- Container with class authenticated and setting color css variables -->
  <div id="app" v-bind:class="{'authenticated': authenticated}" :style="{'--red': colors.rgba.r, '--green': colors.rgba.g, '--blue': colors.rgba.b}">
    <a v-if="authenticated" title="sidebar" v-on:click="sidebar()" id="hamburger"><svg xmlns="http://www.w3.org/2000/svg" height="32" viewBox="0 0 24 24" width="32"><path d="M0 0h24v24H0V0z" fill="none" class="transparent"/><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg></a>
    <div class="sidebar" v-if="authenticated" v-bind:class="{'open': open}">
       <!-- Mobile open/close sidebar icon -->
      <a id="close" v-on:click="sidebar()">
        <svg xmlns="http://www.w3.org/2000/svg" height="32" viewBox="0 0 24 24" width="32">
          <path d="M0 0h24v24H0V0z" fill="none" class="transparent"/>
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
        </svg>
      </a>
      <div class="logo_container">
        <router-link to="/" class="logo_link" title="Home">
          <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width="74" height="74"><defs><path d="M380 580L380 380L580 380L580 580L380 580ZM260 260L260 580L60 580L60 60L580 60L580 260L260 260Z" id="go6TfJQF0"></path></defs><g><g><g><use xlink:href="#go6TfJQF0"></use></g></g></g></svg>
        </router-link>
      </div> <!-- .logo_container -->
      <div class="main_nav">
        <div class="nav_item">
            <router-link to="/" id="explore-link">Explore</router-link>
        </div>
         <!-- Loop through clients and render a link to each one -->
        <div v-for="(clients, index) in posts"
          :key="index" class="nav_subitem">
          <router-link :to="'/client/'+clients.name+'/'">{{clients.name}}</router-link>
           <!-- If on client page and the client has programmes display the programmes-->
          <div v-if="$route.path.includes('client') && clients.programmes && $route.params.name == clients.name">
            <div v-for="(programme, index) in posts[index].programmes"
              :key="index" class="nav_subitem subitem">
              <router-link :to="'/client/'+clients.name+'/programme/'+programme.id">{{programme.name}}</router-link>
            </div>
          </div>
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
    </div> <!-- .sidebar -->
    <main>
      <router-view :key="$route.fullPath"/>
    </main>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data: function () {
    return {
      archive_error: '',
      archive_posts: {},
      no_archive: false,
      open: false,
      error: '',
      posts: null,
      loading_clients: true,
      no_clients: false,
      claims: null,
      authenticated: false,
      client_details: null,
      loading: false,
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
  },
  watch: {
    // Everytime the route changes, check for auth status
    '$route' (to, from) {
      this.isAuthenticated()
      this.open = false
    }
  },
  methods: {
    sidebar () {
      this.open = !this.open
    },
    async setup () {
      this.claims = await this.$auth.getUser()
      this.colors.rgba.r = await this.hexToRgb(this.claims.color).r
      this.colors.rgba.g = await this.hexToRgb(this.claims.color).g
      this.colors.rgba.b = await this.hexToRgb(this.claims.color).b

      var d = new Date()
      var n = d.getTime()
      if ((!localStorage.getItem('firstLoaded')) || (n > (parseFloat(localStorage.getItem('loadTime')) + 1800000))) {
        await this.clients()
        localStorage.setItem('firstLoaded', true)
        localStorage.setItem('loadTime', n)
      }
      await this.clients_to_vue()
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
      this.posts = JSON.parse(localStorage.getItem('posts')).sort(function (a, b) {
        var textA = a.name.toUpperCase()
        var textB = b.name.toUpperCase()
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0
      })
      this.loading_clients = false
    },
    async clients () {
      this.error = false
      axios.defaults.headers.common['Authorization'] = `Bearer ${await this.$auth.getAccessToken()}`
      try {
        const response = await axios.get(`https://api.traininblocks.com/clients/${this.claims.sub}`)
        if (response.data.length === 0) {
          this.no_clients = true
        } else {
          this.no_clients = false
          this.error = false
        }
        localStorage.setItem('posts', JSON.stringify(response.data))
        this.loading_clients = false
      } catch (e) {
        this.no_clients = false
        this.loading_clients = false
        this.error = e.toString()
      }
    },

    async archive_to_vue () {
      if (!localStorage.getItem('archive')) {
        await this.archive()
      }
      if (JSON.parse(localStorage.getItem('archive')).length === 0) {
        this.no_archive = true
      } else {
        this.archive_posts = JSON.parse(localStorage.getItem('archive')).sort(function (a, b) {
          var textA = a.name.toUpperCase()
          var textB = b.name.toUpperCase()
          return (textA < textB) ? -1 : (textA > textB) ? 1 : 0
        })
      }
    },
    async archive () {
      this.archive_error = false
      axios.defaults.headers.common['Authorization'] = `Bearer ${await this.$auth.getAccessToken()}`
      try {
        const response = await axios.get(`https://api.traininblocks.com/clients/${this.claims.sub}/archive`)
        if (response.data.length === 0) {
          this.no_archive = true
        } else {
          this.no_archive = false
          this.archive_error = false
        }
        localStorage.setItem('archive', JSON.stringify(response.data))
      } catch (e) {
        this.no_archive = false
        this.archive_error = e.toString()
      }
    },
    async client_archive (id, index) {
      if (confirm('Are you sure you want to archive this client?')) {
        for (var i = 0; i < this.posts.length; i++) {
          if (this.posts[i].client_id == id) {
            this.posts.splice(index, 1)
            if (this.posts.length === 0) {
              this.no_clients = true
            }
          }
        }
        axios.defaults.headers.common['Authorization'] = `Bearer ${await this.$auth.getAccessToken()}`
        try {
          // eslint-disable-next-line
          const response = await axios.post(`https://api.traininblocks.com/clients/archive/${id}`)
          // eslint-disable-next-line
          this.response = response.data

          await this.clients()
          this.clients_to_vue()

          await this.archive()
          this.archive_to_vue()
        } catch (e) {
          console.error(`${e}`)
        }
      }
    },
    async client_unarchive (id, index) {
      if (confirm('Are you sure you want to unarchive this client?')) {
        for (var i = 0; i < this.archive_posts.length; i++) {
          if (this.archive_posts[i].client_id == id) {
            var arr = JSON.parse(localStorage.getItem('posts'))
            arr.push(this.archive_posts[i])

            localStorage.setItem('posts', JSON.stringify(arr))
            this.posts = JSON.parse(localStorage.getItem('posts')).sort(function (a, b) {
              var textA = a.name.toUpperCase()
              var textB = b.name.toUpperCase()
              return (textA < textB) ? -1 : (textA > textB) ? 1 : 0
            })

            this.archive_posts.splice(index, 1)
            if (this.archive_posts.length === 0) {
              this.no_archive = true
            }
          }
        }
        axios.defaults.headers.common['Authorization'] = `Bearer ${await this.$auth.getAccessToken()}`
        try {
          // eslint-disable-next-line
          const response = await axios.post(`https://api.traininblocks.com/clients/unarchive/${id}`)
          // eslint-disable-next-line
          this.response = response.data

          await this.archive()
          this.archive_to_vue()

          await this.clients()
          this.clients_to_vue()
        } catch (e) {
          console.error(`${e}`)
        }
      }
    },
    async client_delete (id, index) {
      if (confirm('Are you sure you want to delete this client?')) {
         for (var i = 0; i < this.archive_posts.length; i++) {
          if (this.archive_posts[i].client_id == id) {
            this.archive_posts.splice(index, 1)
            if (this.archive_posts.length === 0) {
              this.no_archive = true
            }
          }
        }
        axios.defaults.headers.common['Authorization'] = `Bearer ${await this.$auth.getAccessToken()}`
        try {
          // eslint-disable-next-line
          const response = await axios.delete(`https://api.traininblocks.com/clients/${id}`)
          // eslint-disable-next-line
          this.response = response.data

          await this.archive()
          this.archive_to_vue()

          await this.clients()
          this.clients_to_vue()
        } catch (e) {
          console.error(`${e}`)
        }
      }
    }
  }
}
</script>

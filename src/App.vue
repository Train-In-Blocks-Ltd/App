<style>
  @import '../node_modules/animate.css';

  /* Global */
  * {
    box-sizing: border-box
  }
  :root {
    --animate-delay: .5s
  }
  body {
    font-family: Arial, Helvetica, sans-serif;
    margin: 0;
    min-height: 100vh;
    display: grid;
    font-size: 16px;
    letter-spacing: .15rem;
    overflow: hidden
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

    color: #282828;
    background-color: white;
    display: grid;
    grid-template-areas: 'main'
  }
  #app.authenticated {
    display: grid;
    grid-template-areas: 'sidebar main';
    grid-template-columns: 260px 1fr
  }
  main {
    grid-area: main;
    display: grid;
    align-items: start;
    overflow: auto;
    height: 100vh
  }
  .spacer {
    height: 5rem
  }
  #hamburger path#lines {
    fill: #282828
  }

  /* Fonts */
  h1 {
    margin-top: 0;
    margin-bottom: 3rem;
    font-weight: bold;
    font-size: 3.75rem;
    text-transform: capitalize;
    letter-spacing: .15rem
  }
  h2 {
    font-size: 2.5rem;
    letter-spacing: .15rem;
    margin: 1.75rem 0
  }
  h3 {
    font-size: 2rem
  }
  a {
    text-decoration: none;
    color: #282828;
    font-weight: bold
  }
  svg path:not(.transparent) {
    fill: #282828
  }

  /* Buttons */
  .button {
    text-align: center;
    border: 1px solid #282828;
    padding: .5rem 1rem;
    height: auto;
    width: auto;
    font-family: Arial, Helvetica, sans-serif;
    font-size: .8rem;
    letter-spacing: .1rem;
    font-weight: bold;
    cursor: pointer;
    color: #282828;
    background-color: transparent;
    margin: 1rem 0 .5rem 0;
    display: inline-block;
    transition: opacity .4s, background-color .4s, color .2s, transform .1s cubic-bezier(.165, .84, .44, 1);
    will-change: transform
  }
  .button:hover {
    background-color: #282828;
    color: white;
    text-decoration: none
  }
  .button:active {
    transform: scale(.9)
  }

  /* Inputs */
  input:not([type=checkbox]):not([type=radio]):not([type=color]) {
    border: 1px solid #282828;
    padding: .4rem;
    display: inline-block;
    resize: none;
    font-family: Arial, Helvetica, sans-serif;
    letter-spacing: .1rem
  }
  input.title {
    margin-top: 0;
    margin-bottom: 3rem;
    font-weight: bold;
    font-size: 3.75rem;
    text-transform: capitalize;
    letter-spacing: .15rem;
    white-space: nowrap;
    text-overflow: ellipsis
  }
  ::placeholder {
    color: #28282899;
    opacity: 1; /* Firefox */
  }

  /* Forms */
  .form_grid {
    display: grid;
    grid-template-columns: 1fr;
    max-width: 660px;
    margin: 0
  }
  .form_buttons {
    display: grid;
    grid-gap: 1rem;
    place-content: start;
    grid-auto-flow: column
  }

  /* Loading */
  .loading-grid {
    display: inline-grid;
    grid-template-columns: repeat(2, auto);
    place-items: end;
    justify-self: start;
    grid-gap: 1rem
  }
  .loader, .loader svg {
    width: 4rem;
    height: 3.5rem
  }
  .loader circle {
    fill: #282828
  }

  /* Logo */
  .logo {
    text-align: center
  }
  .logo--link {
    display: block;
    height: 60px
  }
  .logo--svg {
    margin-top: -8px
  }
  svg.logo--svg path {
    fill: rgb(
      var(--accessible-color),
      var(--accessible-color),
      var(--accessible-color)
    )
  }

  /* Navigation */
  .sidebar {
    grid-area: sidebar;
    display: grid;
    text-align: left;
    box-shadow: 0 4px 10px rgba(0, 0, 0, .25);
    padding: 5rem 2.5rem 2.5rem 2.5rem;
    grid-auto-rows: 3.75rem auto min-content;
    position: sticky;
    height: 100vh;
    top: 0;
    background-color: rgb(var(--red), var(--green), var(--blue))
  }
  .nav a, .account_nav a {
    color:rgb(
      var(--accessible-color),
      var(--accessible-color),
      var(--accessible-color)
    )
  }
  .nav {
    border-bottom: .5px solid rgba(
      var(--accessible-color),
      var(--accessible-color),
      var(--accessible-color),
      .1
    );
    border-top: .5px solid rgba(
      var(--accessible-color),
      var(--accessible-color),
      var(--accessible-color),
      .1
    );
    overflow-y: auto;
    margin-top: 3.75rem;
    margin-bottom: 2.5rem
  }
  .sidebar ::-webkit-scrollbar {
    width: 10px;
    height: 10px
  }
  .sidebar ::-webkit-scrollbar-track {
    background: rgba(
      var(--accessible-color),
      var(--accessible-color),
      var(--accessible-color),
      .1
    )
  }
  .sidebar ::-webkit-scrollbar-thumb {
    background: rgba(
      var(--accessible-color),
      var(--accessible-color),
      var(--accessible-color),
      .4
    )
  }
  .sidebar ::-webkit-scrollbar-thumb:hover {
    background: rgba(
      var(--accessible-color),
      var(--accessible-color),
      var(--accessible-color),
      .6
    )
  }

  /* Client Navigation Items */
  .nav--item {
    padding: .8rem 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis
  }
  .nav--item:first-of-type {
    font-size: 1.2rem
  }
  .nav--item:first-of-type a {
    font-weight: bold
  }
  .nav--item--item {
    padding: 0 0 .8rem .8rem;
    font-size: .8rem
  }
  .nav--item--item:first-of-type {
    padding-top: .8rem
  }
  .nav--item--item:last-of-type {
    padding-bottom: 0;
    margin-bottom: -.8rem
  }
  .nav--item a {
    font-weight: normal;
    position: relative
  }
  .nav--item a:before {
    content: '';
    position: absolute;
    width: 0%;
    height: 1px;
    bottom: -4px;
    left: 0;
    background-color: rgb(
      var(--accessible-color),
      var(--accessible-color),
      var(--accessible-color)
    );
    opacity: 0;
    transition: all .6s cubic-bezier(.075, .82, .165, 1)
  }
  .nav--item a:hover:before {
    opacity: 1;
    width: 100%
  }
  .nav--item a:hover:active {
    opacity: .6
  }
  .nav--item a.router-link-exact-active {
    font-weight: bold
  }
  .nav a.router-link-exact-active:before {
    opacity: 1;
    width: 100%;
    height: 2px
  }

  /* Account Navigation Items */
  .account_nav {
    align-self: end;
    text-align: center;
    font-size: .8rem
  }
  .account_nav--item {
    font-size: 1rem;
    padding: .8rem 0
  }
  .account_nav--item:first-of-type {
    padding-top: 0
  }
  .account_nav--item:last-of-type {
    padding-bottom: 0
  }
  .account_nav--item a {
    position: relative;
    border: 0
  }
  .account_nav--item a:before {
    content: '';
    position: absolute;
    width: 0%;
    height: 2px;
    bottom: -8px;
    left: 0;
    background-color: rgb(
      var(--accessible-color),
      var(--accessible-color),
      var(--accessible-color)
    );
    opacity: 0;
    transition: all .6s cubic-bezier(.075, .82, .165, 1)
  }
  .account_nav--item a:hover:before {
    opacity: 1;
    width: 100%
  }
  .account_nav--item a:active {
    opacity: .6
  }
  .account_nav--item a.router-link-exact-active:before {
    opacity: 1;
    width: 100%;
    height: 2px
  }
  .account_nav--item--icon {
    margin: 0 .4rem 0 0;
    height: 1.4rem;
    vertical-align: bottom
  }
  .account_nav--item--icon path:not(.transparent) {
    fill: rgb(
      var(--accessible-color),
      var(--accessible-color),
      var(--accessible-color)
    )
  }

  /* QUILL */
  .quill {
    margin: .75rem 0
  }
  .ql-toolbar.ql-snow {
    border: none
  }
  .ql-container.ql-snow {
    border: none
  }
  .ql-snow .ql-stroke {
    stroke: #282828
  }
  .ql-editor {
    height: 400px;
    color: #282828;
    overflow-y: auto
  }
  .ql-snow.ql-toolbar button:hover, .ql-snow .ql-toolbar button:hover, .ql-snow.ql-toolbar button.ql-active, .ql-snow .ql-toolbar button.ql-active, .ql-snow.ql-toolbar .ql-picker-label:hover, .ql-snow .ql-toolbar .ql-picker-label:hover, .ql-snow.ql-toolbar .ql-picker-label.ql-active, .ql-snow .ql-toolbar .ql-picker-label.ql-active, .ql-snow.ql-toolbar .ql-picker-item:hover, .ql-snow .ql-toolbar .ql-picker-item:hover, .ql-snow.ql-toolbar .ql-picker-item.ql-selected, .ql-snow .ql-toolbar .ql-picker-item.ql-selected {
    color: #28282899
  }
  .ql-snow.ql-toolbar button:hover .ql-stroke, .ql-snow .ql-toolbar button:hover .ql-stroke, .ql-snow.ql-toolbar button.ql-active .ql-stroke, .ql-snow .ql-toolbar button.ql-active .ql-stroke, .ql-snow.ql-toolbar .ql-picker-label:hover .ql-stroke, .ql-snow .ql-toolbar .ql-picker-label:hover .ql-stroke, .ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-stroke, .ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-stroke, .ql-snow.ql-toolbar .ql-picker-item:hover .ql-stroke, .ql-snow .ql-toolbar .ql-picker-item:hover .ql-stroke, .ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-stroke, .ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-stroke, .ql-snow.ql-toolbar button:hover .ql-stroke-miter, .ql-snow .ql-toolbar button:hover .ql-stroke-miter, .ql-snow.ql-toolbar button.ql-active .ql-stroke-miter, .ql-snow .ql-toolbar button.ql-active .ql-stroke-miter, .ql-snow.ql-toolbar .ql-picker-label:hover .ql-stroke-miter, .ql-snow .ql-toolbar .ql-picker-label:hover .ql-stroke-miter, .ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-stroke-miter, .ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-stroke-miter, .ql-snow.ql-toolbar .ql-picker-item:hover .ql-stroke-miter, .ql-snow .ql-toolbar .ql-picker-item:hover .ql-stroke-miter, .ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-stroke-miter, .ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-stroke-miter {
    stroke: #28282899
  }
  .ql-snow.ql-toolbar button:hover .ql-fill, .ql-snow .ql-toolbar button:hover .ql-fill, .ql-snow.ql-toolbar button.ql-active .ql-fill, .ql-snow .ql-toolbar button.ql-active .ql-fill, .ql-snow.ql-toolbar .ql-picker-label:hover .ql-fill, .ql-snow .ql-toolbar .ql-picker-label:hover .ql-fill, .ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-fill, .ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-fill, .ql-snow.ql-toolbar .ql-picker-item:hover .ql-fill, .ql-snow .ql-toolbar .ql-picker-item:hover .ql-fill, .ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-fill, .ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-fill, .ql-snow.ql-toolbar button:hover .ql-stroke.ql-fill, .ql-snow .ql-toolbar button:hover .ql-stroke.ql-fill, .ql-snow.ql-toolbar button.ql-active .ql-stroke.ql-fill, .ql-snow .ql-toolbar button.ql-active .ql-stroke.ql-fill, .ql-snow.ql-toolbar .ql-picker-label:hover .ql-stroke.ql-fill, .ql-snow .ql-toolbar .ql-picker-label:hover .ql-stroke.ql-fill, .ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-stroke.ql-fill, .ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-stroke.ql-fill, .ql-snow.ql-toolbar .ql-picker-item:hover .ql-stroke.ql-fill, .ql-snow .ql-toolbar .ql-picker-item:hover .ql-stroke.ql-fill, .ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-stroke.ql-fill, .ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-stroke.ql-fill {
    fill: #28282899
  }

  /* Scrollbar */
  ::-webkit-scrollbar {
    width: 10px;
    height: 10px
  }
  ::-webkit-scrollbar-track {
    background: #28282815
  }
  ::-webkit-scrollbar-thumb {
    background: #28282850
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #28282860
  }

  /* Archive and Home page styles */
  .client_container p {
    margin: 0;
    font-weight: 400;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden
  }
  .client_container {
    margin: 1rem 0;
    font-size: 1rem;
    display: block
  }

  /* Client Container Animation */
  .client_container > a {
    display: block;
    position: relative;
    font-weight: 400;
    color: #282828;
    text-decoration: none
  }
  .client_container > a:not(.archived):hover {
    color: #282828
  }
  .client_container > a:before {
    content: '';
    position: absolute;
    opacity: .4;
    width: 95%;
    height: 1px;
    bottom: 0;
    left: 0;
    background-color: #282828;
    transition: all .6s cubic-bezier(.075, .82, .165, 1)
  }
  .client_container > a:not(.archived):hover:before {
    width: 100%;
    opacity: 1
  }
  .client_link {
    padding: 1rem 0;
    width: 95%;
    overflow-x: auto;
    transition: all .1s cubic-bezier(.165, .84, .44, 1)
  }
  .client_link:active {
    transform: scale(.98)
  }
  .search {
    width: 95%;
    margin: .6rem 0 1rem 0;
    font-size: 1rem
  }

  /* Responsive Design */
  @media (max-width: 992px) {
    .button:hover {
      background-color: transparent;
      color: #282828
    }
  }
  @media (max-width: 768px) {
    .client_container > a:before {
      width: 100%;
      opacity: 1
    }
  }
  @media (min-width: 768px) {
    #hamburger, #close {
      display: none
    }
  }
  @media (max-width: 768px) {
    #app.authenticated {
      display: block
    }
    main > div {
      max-width: 100%
    }
    h1 {
      font-size: 2rem;
      margin-top: -.9rem;
      margin-bottom: 2.5rem;
      margin-left: 1.25rem
    }
    .sidebar {
      position: fixed;
      width: 100%;
      background-color: rgb(
        var(--red),
        var(--green),
        var(--blue)
      );
      transition: opacity .5s, z-index 1s;
      z-index: -1;
      opacity: 0
    }
    .sidebar.open {
      opacity: 1;
      z-index: 99
    }
    main {
      padding: 0;
      width: 100vw
    }
    #hamburger, #close {
      position: absolute;
      left: 1.875rem;
      top: 1.5rem
    }
    #hamburger svg path:not(.transparent), #close svg path:not(.transparent) {
      fill: rgb(
        var(--accessible-color),
        var(--accessible-color),
        var(--accessible-color)
      )
    }
  }
</style>
<template>
  <!-- Container with class authenticated and setting color css variables -->
  <div id="app" v-bind:class="{'authenticated': authenticated}" v-bind:style="{'--red': colors.rgba.r, '--green': colors.rgba.g, '--blue': colors.rgba.b}">
    <a v-if="authenticated" title="sidebar" v-on:click="sidebar()" id="hamburger">
      <inline-svg :src="require('./assets/svg/Hamburger.svg')"/>
    </a>
    <nav class="sidebar" v-if="authenticated" v-bind:class="{'open': open}">
       <!-- Mobile open/close sidebar icon -->
      <a id="close" v-on:click="sidebar()">
        <inline-svg :src="require('./assets/svg/SidebarClose.svg')"/>
      </a>
      <div class="logo animate__animated animate__bounceInDown animate__delay-1s">
        <router-link to="/" class="logo--link" title="Home">
          <inline-svg :src="require('./assets/svg/SidebarLogo.svg')" class="logo--svg"/>
        </router-link>
      </div> <!-- .logo -->
      <div class="nav animate__animated animate__fadeInLeft animate__faster">
        <div class="nav--item">
            <router-link to="/">Clients</router-link>
        </div>
         <!-- Loop through clients and render a link to each one -->
        <div v-for="(clients, index) in posts"
          :key="index" class="nav--item animate__animated animate__fadeIn">
          <router-link :to="'/client/'+clients.client_id+'/'">{{clients.name}}</router-link>
          <!-- If on client page and the client has programmes display the programmes-->
          <div v-if="$route.path.includes('client') && clients.programmes && $route.params.client_id == clients.client_id">
            <div v-for="(programme, index) in posts[index].programmes"
              :key="index" class="nav--item--item">
              <router-link :to="'/client/'+clients.client_id+'/block/'+programme.id">{{programme.name}}</router-link>
            </div>
          </div>
        </div>
      </div>
      <div class="account_nav animate__animated animate__fadeInLeft animate__faster animate__delay-1s">
        <div class="account_nav--item">
          <router-link to="/archive">
            <inline-svg :src="require('./assets/svg/ArchiveIconClose.svg')" class="account_nav--item--icon"/>
            Archive
          </router-link>
        </div>
        <div class="account_nav--item">
          <router-link to="/account">
            <inline-svg :src="require('./assets/svg/AccountIcon.svg')" class="account_nav--item--icon"/>
            Account
          </router-link>
        </div>
        <div class="account_nav--item">
          <router-link to="/logout" v-on:click.native="logout()">
            <inline-svg :src="require('./assets/svg/LogoutIcon.svg')" class="account_nav--item--icon"/>
            Logout
          </router-link>
        </div>
      </div>
    </nav> <!-- .sidebar -->
    <main v-dragscroll:nochilddrag>
      <transition enter-active-class="animate__animated animate__fadeIn animate__delay-1s animate__faster" leave-active-class="animate__animated animate__fadeOut animate__faster">
        <router-view :key="$route.fullPath" :quillSettings="config"/>
      </transition>
    </main>
  </div>
</template>

<script>
import axios from 'axios'
import InlineSvg from 'vue-inline-svg'

export default {
  components: {
    InlineSvg
  },
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
          r: null,
          g: null,
          b: null,
          a: 1
        }
      },
      config: {
        placeholder: 'Type away...',
        modules: {
          toolbar: [
              [{'header': 1}, {'header': 2}],
              ['bold', 'italic', 'underline', 'strike'],
              [{'script': 'sub'}, {'script': 'super'}]
          ]
        }
      }
    }
  },
  created () {
    this.isAuthenticated()
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
      this.colors.hex = this.claims.color
      this.colors.rgba.r = await this.hexToRgb(this.claims.color).r
      this.colors.rgba.g = await this.hexToRgb(this.claims.color).g
      this.colors.rgba.b = await this.hexToRgb(this.claims.color).b
      if (!localStorage.getItem('colors')) {
        document.getElementsByTagName('BODY')[0].style.setProperty('--red', this.colors.rgba.r)
        document.getElementsByTagName('BODY')[0].style.setProperty('--green', this.colors.rgba.g)
        document.getElementsByTagName('BODY')[0].style.setProperty('--blue', this.colors.rgba.b)
      }
      localStorage.setItem('colors', JSON.stringify(this.colors.rgba))
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
        this.$router.push('/')
        for (var i = 0; i < this.posts.length; i++) {
          //eslint-disable-next-line
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
          //eslint-disable-next-line
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
          //eslint-disable-next-line
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

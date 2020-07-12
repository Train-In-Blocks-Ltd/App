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
    line-height: 1.42;
    letter-spacing: .1rem;
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
    background-color: white
  }
  main {
    margin-left: calc(38px + 2rem);
    display: grid;
    align-items: start;
    overflow: auto;
    height: 100vh
  }
  .spacer {
    height: 5rem
  }

  /* Global Container */
  #home, #block, #account, #archive, .wrapper--client, #learn, .modal--first-time-home {
    min-height: 100vh;
    padding: 4rem 20vw 10rem 20vw
  }

  /* Fonts */
  .main-title {
    margin-top: 0;
    margin-bottom: 3rem;
    font-weight: bold;
    font-size: 3.75rem;
    text-transform: capitalize;
    letter-spacing: .15rem
  }
  .sub-title {
    font-size: 2.5rem;
    letter-spacing: .15rem;
    margin: 1.75rem 0
  }
  h3 {
    font-size: 2rem
  }
  ul, ol {
    padding-left: 1rem
  }
  p {
    margin: 0
  }
  svg path:not(.transparent) {
    fill: #282828
  }
  .allow-text-overflow {
    text-overflow: ellipsis
  }

  /* Buttons */
  .button, .fc-today-button.fc-button.fc-button-primary, .fc-prev-button.fc-button.fc-button-primary, .fc-next-button.fc-button.fc-button-primary, .fc-dayGridWeek-button.fc-button.fc-button-primary, .fc-dayGridMonth-button.fc-button.fc-button-primary {
    user-select: none;
    text-transform: capitalize;
    text-align: center;
    outline-width: 0;
    border: 1px solid #E1E1E1;
    padding: .5rem 1rem;
    height: auto;
    width: auto;
    font-family: Arial, Helvetica, sans-serif;
    font-size: .8rem;
    letter-spacing: .1rem;
    font-weight: bold;
    color: #282828;
    background-color: white;
    margin: 1rem 0 .5rem 0;
    display: inline-block;
    transition: color .4s, background-color .4s, transform .1s cubic-bezier(.165, .84, .44, 1)
  }
  .button:hover, .fc-today-button.fc-button.fc-button-primary:not(:disabled):hover, .fc-prev-button.fc-button.fc-button-primary:hover, .fc-next-button.fc-button.fc-button-primary:hover, .fc-dayGridWeek-button.fc-button.fc-button-primary:hover, .fc-dayGridMonth-button.fc-button.fc-button-primary:hover {
    cursor: pointer;
    color: white;
    background-color: #282828;
    text-decoration: none
  }
  .button:active, .fc-today-button.fc-button.fc-button-primary:not(:disabled):active, .fc-prev-button.fc-button.fc-button-primary:active, .fc-next-button.fc-button.fc-button-primary:active, .fc-dayGridWeek-button.fc-button.fc-button-primary:active, .fc-dayGridMonth-button.fc-button.fc-button-primary:active {
    transform: scale(.96)
  }
  .delete:hover, .cancel:hover {
    color: white;
    background-color: #B80000
  }

  /* GLOBAL: Calendar */
  .fc-button {
    border-radius: 0
  }
  .fc-view.fc-dayGridMonth-view.fc-dayGrid-view * {
    border-color: transparent
  }
  .fc-view-container span {
    font-size: .8rem
  }
  .fc-prev-button.fc-button.fc-button-primary, .fc-next-button.fc-button.fc-button-primary, .fc-dayGridWeek-button.fc-button.fc-button-primary, .fc-dayGridMonth-button.fc-button.fc-button-primary {
    margin-left: .4rem
  }

  /* Remove IOS Corners */
  input:not([type=checkbox]), button {
    border-radius: 0;
    -webkit-appearance: none
  }

  /* Inputs */
  .input--modal {
    width: 4rem
  }
  .input--forms, .input--toolkit, .input--modal {
    padding: .4rem;
    font-size: 1rem;
    border: none;
    border-bottom: 1px solid #282828
  }
  input:not([type=checkbox]):not([type=radio]):not([type=color]):not([type=search]):not([type=submit]) {
    resize: none;
    font-family: Arial, Helvetica, sans-serif;
    letter-spacing: .1rem
  }
  input[type=color] {
    margin: 0 .4rem;
    background-color: transparent;
    padding: 0 .14rem;
    outline-width: 0;
    cursor: pointer;
    transition: all .4s cubic-bezier(.165, .84, .44, 1)
  }
  input[type=color]:hover, input[type=color]:focus {
    transform: scale(1.1)
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
    max-width: 300px;
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
    margin-bottom: auto
  }
  .logo--link {
    display: block;
    width: 38px;
    transition: 1s all cubic-bezier(.165, .84, .44, 1)
  }
  svg.logo--svg path {
    fill: rgb(
      var(--accessible-color),
      var(--accessible-color),
      var(--accessible-color)
    )
  }

  /* Logo Animation */
  .logo--link:hover {
    opacity: .6
  }
  .logo--link:active {
    transform: scale(.9)
  }

  /* Navigation */
  .sidebar {
    border-right: 1px solid #E1E1E1;
    z-index: 10;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 2rem 1rem;
    position: fixed;
    background-color: rgb(var(--red), var(--green), var(--blue));
    transition: width .6s cubic-bezier(.165, .84, .44, 1)
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

  /* Account Navigation Items */
  .account_nav--item {
    display: flex;
    opacity: .6;
    cursor: pointer;
    font-size: 1rem;
    padding: .8rem 0;
    transition: all 1s cubic-bezier(.165, .84, .44, 1)
  }
  .account_nav--item:hover {
    opacity: 1
  }
  .account_nav--item:first-of-type {
    padding-top: 0
  }
  .account_nav--item:last-of-type {
    padding-bottom: 0
  }
  .account_nav--item--text {
    color: rgb(
      var(--accessible-color),
      var(--accessible-color),
      var(--accessible-color)
    );
    text-decoration: none;
    position: relative;
    border: 0;
    transition: all 1s cubic-bezier(.165, .84, .44, 1)
  }
  .account_nav--item a.router-link-exact-active {
    font-weight: bold
  }
  .account_nav--item--icon {
    margin: 0 .4rem 0 0;
    height: 1.4rem;
    vertical-align: bottom;
    transition: all 1s cubic-bezier(.165, .84, .44, 1)
  }
  .account_nav--item--icon path:not(.transparent) {
    fill: rgb(
      var(--accessible-color),
      var(--accessible-color),
      var(--accessible-color)
    )
  }

  /* QUILL */
  div.ql-toolbar.ql-snow {
    border: none
  }
  div.ql-container.ql-snow {
    border: none
  }
  .ql-snow .ql-stroke {
    stroke: #282828
  }
  .ql-editor {
    max-height: 250px;
    color: #282828;
    overflow-y: auto
  }
  .ql-editor ul li:not(.ql-direction-rtl), .ql-editor ol {
    padding: 0
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
  .container--clients {
    display: grid;
    grid-gap: 2rem
  }
  .client_container p {
    margin: 0
  }

  /* Client Container Animation */
  .client_container > a {
    display: grid;
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
    overflow-x: auto
  }
  .client_link svg {
    width: 20px
  }
  .client_link__name {
    font-size: 1.4rem
  }
  .client_link__details {
    display: grid;
    grid-template-columns: 20px 1fr;
    grid-gap: 1rem
  }
  .client_link__details p {
    margin: auto 0
  }
  .client_link__notes {
    margin-top: 1rem
  }
  .client_link__notes__content {
    font-size: .8rem;
    margin-top: .4rem
  }
  .search {
    border: none;
    outline-width: 0;
    width: 95%;
    font-size: 1.6rem;
    letter-spacing: .1rem;
    font-weight: bold;
    border-bottom: 2px solid #282828;
    padding: .6rem 0;
    margin: 1rem 0;
    transition: all .4s cubic-bezier(.165, .84, .44, 1)
  }
  .search:hover {
    border-bottom: 2px solid #28282880;
    width: 100%
  }
  .search:focus {
    border-bottom: 2px solid #282828;
    width: 100%
  }

  /* Splash */
  .splash {
    display: flex;
    position: fixed;
    left: 0;
    top: 0;
    height: 100vh;
    width: 100vw;
    background-color: white;
    z-index: 20
  }
  .splash__logo {
    margin: auto;
    opacity: 0;
    animation: splashFade 2 1.2s alternate
  }
  @keyframes splashFade {
    from {
      opacity: 0
    }
    to {
      opacity: 1
    }
  }

  /* Responsive Design */
  @media (max-width: 992px) {
    #home, #account, #archive, .wrapper--client {
      padding: 4rem 10vw
    }
    .button:hover, .fc-today-button.fc-button.fc-button-primary:not(:disabled):hover, .fc-prev-button.fc-button.fc-button-primary:hover, .fc-next-button.fc-button.fc-button-primary:hover, .fc-dayGridWeek-button.fc-button.fc-button-primary:hover, .fc-dayGridMonth-button.fc-button.fc-button-primary:hover {
      background-color: transparent;
      color: #282828
    }
  }
  @media (min-width: 768px) {
    .sidebar {
      top: 0;
      height: 100vh;
      width: calc(38px + 2rem)
    }
    .sidebar:hover {
      width: 12rem
    }
  }
  @media (max-width: 768px) {
    /* Sidebar */
    .logo {
      display: none
    }
    .sidebar {
      bottom: 0;
      width: 100%;
      flex-direction: row;
      padding: 1rem;
      justify-content: space-between
    }
    .account_nav--item--text {
      display: none
    }
    main {
      margin: 0
    }
    .account_nav--item {
      margin: auto;
      padding: 0
    }

    /* Other */
    h1 {
      font-size: 2rem;
      margin-top: -.9rem;
      margin-bottom: 2.5rem;
      margin-left: 1.25rem
    }
    .main-title {
      margin: 0
    }
  }

  /* For Mobile */
  @media (max-width: 576px) {
    #home, #account, #archive, .wrapper--client {
      padding: 2rem 5vw
    }
    p {
      font-size: .8rem
    }
    .main-title {
      font-size: 2.4rem
    }
    .button, .fc-today-button.fc-button.fc-button-primary, .fc-prev-button.fc-button.fc-button-primary, .fc-next-button.fc-button.fc-button-primary, .fc-dayGridWeek-button.fc-button.fc-button-primary, .fc-dayGridMonth-button.fc-button.fc-button-primary {
      padding: .4rem .5rem
    }

    /* Blocks Page */
    .fc-view-container {
      width: 90vw;
      overflow-x: auto
    }
    .fc-view-container span {
      font-size: .7rem
    }
    .fc-view.fc-dayGridMonth-view.fc-dayGrid-view, div.fc-view.fc-dayGridWeek-view.fc-dayGrid-view {
      width: 120vw
    }
  }
</style>
<template>
  <!-- Container with class authenticated and setting color css variables -->
  <div id="app" v-bind:class="{'authenticated': authenticated}" v-bind:style="{'--red': colors.rgba.r, '--green': colors.rgba.g, '--blue': colors.rgba.b}">
    <transition leave-active-class="animate__animated animate__fadeOut">
      <div v-show="splashing" class="splash">
        <inline-svg class="splash__logo" :src="require('./assets/svg/full-logo.svg')"/>
      </div>
    </transition>
    <nav @mouseover="showNav = true" class="sidebar" v-if="authenticated">
      <div class="logo animate__animated animate__bounceInDown animate__delay-5s">
        <router-link to="/" class="logo--link" title="Home">
          <inline-svg :src="require('./assets/svg/logo-icon.svg')" class="logo--svg"/>
        </router-link>
      </div> <!-- .logo -->
      <div class="account_nav--item">
        <router-link to="/">
          <inline-svg :src="require('./assets/svg/home.svg')" class="account_nav--item--icon"/>
        </router-link>
        <transition enter-active-class="animate__animated animate__fadeIn animate__faster" leave-active-class="animate__animated animate__fadeOut animate__faster">
          <router-link to="/" v-show="showNav" class="account_nav--item--text">
            Home
          </router-link>
        </transition>
      </div>
      <div class="account_nav--item">
        <router-link to="/learn">
          <inline-svg :src="require('./assets/svg/learn.svg')"  class="account_nav--item--icon"/>
        </router-link>
        <transition enter-active-class="animate__animated animate__fadeIn animate__faster" leave-active-class="animate__animated animate__fadeOut animate__faster">
          <router-link to="/learn" v-show="showNav" class="account_nav--item--text">
            Learn
          </router-link>
        </transition>
      </div>
      <div class="account_nav--item">
        <router-link to="/archive">
          <inline-svg :src="require('./assets/svg/archive-large.svg')" class="account_nav--item--icon"/>
        </router-link>
        <transition enter-active-class="animate__animated animate__fadeIn animate__faster" leave-active-class="animate__animated animate__fadeOut animate__faster">
          <router-link to="/archive" v-show="showNav" class="account_nav--item--text">
            Archive
          </router-link>
        </transition>
      </div>
      <div class="account_nav--item">
        <router-link to="/account">
          <inline-svg :src="require('./assets/svg/account.svg')" class="account_nav--item--icon"/>
        </router-link>
        <transition enter-active-class="animate__animated animate__fadeIn animate__faster" leave-active-class="animate__animated animate__fadeOut animate__faster">
          <router-link to="/account" v-show="showNav" class="account_nav--item--text">
            Account
          </router-link>
        </transition>
      </div>
      <div class="account_nav--item">
        <router-link to="/logout" v-on:click.native="logout()">
          <inline-svg :src="require('./assets/svg/logout.svg')" class="account_nav--item--icon"/>
        </router-link>
        <transition enter-active-class="animate__animated animate__fadeIn animate__faster" leave-active-class="animate__animated animate__fadeOut animate__faster">
          <router-link to="/logout" v-show="showNav" v-on:click.native="logout()" class="account_nav--item--text">
            Logout
          </router-link>
        </transition>
      </div>
    </nav> <!-- .sidebar -->
    <main @mouseover="showNav = false">
      <transition enter-active-class="animate__animated animate__fadeIn animate__delay-1s animate__faster" leave-active-class="animate__animated animate__fadeOut animate__faster">
        <router-view :key="$route.fullPath"/>
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
      showNav: false,
      splashing: true,
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
              ['bold', 'italic', 'underline', {'script': 'sub'}, {'script': 'super'}],
              [{'list': 'ordered'}, {'list': 'bullet'}],
              [{'indent': '-1'}, {'indent': '+1'}],
              ['link'],
              ['clean']
          ]
        }
      }
    }
  },
  created () {
    this.isAuthenticated()
  },
  mounted () {
    setTimeout(() => { this.splashing = false }, 2200)
  },
  watch: {
    // Everytime the route changes, check for auth status
    '$route' (to, from) {
      this.isAuthenticated()
      this.open = false
    }
  },
  methods: {
    async setup () {
      this.claims = await this.$auth.getUser()
      if (this.claims.ga === undefined || this.claims === undefined || this.claims === null) {
        this.claims.ga = true
      }
      if (this.claims.ga !== false) {
        this.$ga.enable()
      } else {
        this.$ga.disable()
      }
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
      this.$ga.event('Auth', 'logout')
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
          this.$ga.event('Client', 'archive')
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
          this.$ga.event('Client', 'unarchive')
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
          this.$ga.event('Client', 'delete')
        } catch (e) {
          console.error(`${e}`)
        }
      }
    }
  }
}
</script>

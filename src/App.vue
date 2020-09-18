<style>
  /* Global */
  * {
    box-sizing: border-box
  }
  :root {
    --animate-delay: .5s;
    --animate-duration: 1s;
    --animate-repeat: 1
  }

  /* GLOBAL: ANIMATIONS */
  .animate {
    animation-duration: 1s;
    animation-duration: var(--animate-duration);
    animation-fill-mode: both
  }
  .animate.animate__delay-1s {
    animation-delay: 1s;
    animation-delay: var(--animate-delay)
  }
  .animate.animate__delay-2s {
    animation-delay: calc(1s * 2);
    animation-delay: calc(var(--animate-delay) * 2)
  }
  .animate.animate__faster {
    animation-duration: calc(1s / 2);
    animation-duration: calc(var(--animate-duration) / 2)
  }
  .animate__fadeIn {
    animation-name: fadeIn
  }
  .animate__fadeOut {
    animation-name: fadeOut
  }
  @keyframes fadeIn {
    from {
      opacity: 0
    }
    to {
      opacity: 1
    }
  }
  @keyframes fadeOut {
    from {
      opacity: 1
    }
    to {
      opacity: 0
    }
  }

  /* GLOBAL: ELEMENTS */
  body {
    font-family: Arial, Helvetica, sans-serif;
    margin: 0;
    min-height: 100%;
    display: grid;
    font-size: 16px;
    line-height: 1.42;
    letter-spacing: 1px
  }
  #app {
    color: #282828;
    background-color: white
  }
  main {
    margin-left: calc(38px + 2rem);
    display: grid;
    align-items: start
  }
  .notAuth {
    margin: 0
  }

  /* GLOBAL: CONTAINERS */
  #home, #block, #account, #archive, .wrapper--client, #help, #logout, #templates {
    padding: 4rem 20vw 10rem 20vw
  }
  .modal--error {
    padding: 2rem
  }
  .flex {
    display: flex
  }
  .container--title {
    display: flex;
    margin: 2rem 0
  }
  .home-top {
    display: flex;
    justify-content: space-between;
    margin-bottom: 4rem;
    align-items: center
  }
  .wrapper--calendar {
    user-select: none
  }

  /* GLOBAL: TOOLTIP */
  .tooltip {
    cursor: pointer;
    transition: all .6s cubic-bezier(.165, .84, .44, 1)
  }
  .tooltip:hover {
    opacity: .6
  }
  .sub-title.tooltip {
    margin-left: .6rem
  }

  /* GLOBAL: MODALS */
  .modal--info, .modal--move, .modal--copy, .modal--shift, .modal--reset, .modal--help-block {
    padding: 2rem
  }
  .modal--copy h3, .modal--reset h2 {
    margin: 0 0 1.5rem 0
  }

  /* GLOBAL: SVG */
  .title-icon {
    margin: auto .6rem auto 0
  }

  /* GLOBAL: FONTS */
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
  .no-margin {
    margin: 0
  }
  h3 {
    font-size: 2rem
  }
  p {
    margin: 0
  }
  svg path:not(.account_nav--item--icon.transparent) {
    fill: #282828
  }
  .allow-text-overflow {
    text-overflow: ellipsis
  }
  .text--error {
    font-size: .8rem;
    color: #B80000
  }

  /* GLOBAL: BUTTONS */
  button {
    height: fit-content;
    width: fit-content;
    user-select: none;
    cursor: pointer;
    border-radius: 3px;
    opacity: 1;
    text-transform: capitalize;
    outline-width: 0;
    border: none;
    padding: .6rem 1.6rem;
    font-size: .8rem;
    letter-spacing: .1rem;
    font-weight: bold;
    color: white;
    background-color: #282828;
    margin: .6rem 0;
    transition: opacity .2s, transform .1s cubic-bezier(.165, .84, .44, 1)
  }
  button:hover {
    opacity: .6
  }
  button:active {
    transform: scale(.96)
  }
  button:focus {
    box-shadow: 0 0 0 4px rgba(76, 91, 106, .5)
  }
  button:disabled, button[disabled] {
    opacity: .6;
    cursor: default
  }
  .delete:hover, .cancel:hover {
    color: white;
    background-color: #B80000
  }

  /* GLOBAL: CALENDAR */
  button.fc-button {
    border-radius: 3px;
    text-transform: capitalize;
    font-size: .8rem;
    font-weight: bold;
    background-color: #282828;
    color: white
  }
  button.fc-button-primary:disabled {
    background-color: #282828
  }
  .fc-view.fc-dayGridMonth-view.fc-dayGrid-view * {
    border-color: transparent
  }
  .fc-view-container span {
    font-size: .8rem
  }
  button.fc-prev-button.fc-button.fc-button-primary, button.fc-next-button.fc-button.fc-button-primary, button.fc-dayGridWeek-button.fc-button.fc-button-primary, button.fc-dayGridMonth-button.fc-button.fc-button-primary {
    margin-left: .4rem
  }

  /* GLOBAL: WORKOUTS AND NOTES */
  .wrapper--workout__header {
    height: 6.4rem
  }
  .text--name {
    text-overflow: ellipsis;
    white-space: nowrap
  }
  .text--date, .text--checked {
    font-size: .8rem
  }
  .bottom-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: .6rem 0
  }
  #button-done {
    background-color: green
  }
  #button-to-do {
    background-color: #B80000
  }
  #button-done, #button-to-do {
    color: white;
    height: 2rem;
    margin: auto 0
  }
  #button-done:hover, #button-to-do:hover {
    opacity: .6
  }

  /* GLOBAL: SHOW WORKOUT AND NOTES */
  .show-workout, .show-block-notes, .show-client-notes {
    outline-width: 0;
    overflow-wrap: break-word;
    color: #282828;
    line-height: 1.42;
    overflow-y: auto;
    font-size: .8rem;
    transition: all 1s
  }
  .show-workout a {
    color: blue
  }
  .show-workout ul, .show-workout ol, .show-block-notes ul, .show-block-notes ol {
    text-decoration: none;
    margin: 0
  }
  .show-workout p, .show-client-notes p, .show-block-notes p {
    margin: 1rem 0
  }
  .wrapper--workout__header.client-side {
    height: 3.2rem
  }

  /* GLOBAL: RM IOS CORNERS */
  input:not([type=checkbox]) {
    border-radius: 0;
    -webkit-appearance: none
  }

  /* GLOBAL: INPUTS */
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

  /* GLOBAL: FORMS */
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
    grid-auto-flow: column;
    margin-bottom: 1rem
  }

  /* GLOBAL: LOGO */
  .logo {
    margin-bottom: auto
  }
  .logo--link {
    display: block;
    width: 38px;
    transition: 1s all cubic-bezier(.165, .84, .44, 1)
  }
  svg.logo--svg path {
    fill: white
  }
  .logo--link:hover {
    opacity: .6
  }
  .logo--link:active {
    transform: scale(.9)
  }

  /* GLOBAL: NAV */
  .skip-to-content-link {
    height: 30px;
    left: 50%;
    padding: 8px;
    position: absolute;
    transform: translateY(-1000%);
    transition: transform .3s;
    z-index: 99999999999
  }
  .skip-to-content-link:focus {
    transform: translateY(0%)
  }
  .sidebar {
    z-index: 10;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 2rem 1rem;
    position: fixed;
    background-color: #282828;
    transition: width .6s cubic-bezier(.165, .84, .44, 1)
  }
  .account_nav--item {
    display: flex;
    opacity: .6;
    cursor: pointer;
    font-size: 1rem;
    margin: .8rem 0;
    transition: all 1s cubic-bezier(.165, .84, .44, 1)
  }
  .account_nav--item:hover {
    opacity: 1
  }
  .account_nav--item:last-of-type {
    padding-bottom: 0
  }
  .account_nav--item a {
    display: flex;
    text-decoration: none
  }
  .account_nav--item--text {
    user-select: none;
    color: white;
    text-decoration: none;
    position: relative;
    border: 0;
    opacity: 0;
    transition: all .6s cubic-bezier(.165, .84, .44, 1)
  }
  .sidebar:hover .account_nav--item--text {
    opacity: 1
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
  .account_nav--item--icon:not(.transparent) path {
    fill: white
  }

  /* GLOBAL: QUILL */
  .ql-editor {
    grid-area: body;
    color: #282828;
    overflow-y: auto;
    padding: 0;
    transition: all 1s
  }
  div.ql-editor h1 {
    margin: 1.072rem 0
  }
  div.ql-editor h2 {
    margin: 1.245rem 0
  }
  div.ql-editor p {
    margin: 1rem 0
  }
  .ql-editor.ql-blank:before {
    margin: 1rem 0;
    left: 0
  }

  /* GLOBAL: SCROLLBAR */
  ::-webkit-scrollbar {
    width: 10px;
    height: 10px
  }
  ::-webkit-scrollbar-track {
    background-color: #28282821
  }
  ::-webkit-scrollbar-thumb {
    background-color: #28282890
  }
  ::-webkit-scrollbar-thumb:hover {
    background-color: #28282860
  }

  /* ARCHIVE AND HOME STYLES */
  .container--clients {
    display: grid;
    grid-gap: 2rem
  }
  .client_container p {
    margin: 0
  }

  /* HOME: Client Container Animation */
  .client_container > a {
    display: grid;
    grid-gap: 1rem;
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

  /* GLOBAL: CLIENT-SIDE */
  .container--session-control {
    display: flex;
    justify-content: space-between
  }
  .session-counter {
    align-self: center;
    font-size: 1rem;
    font-weight: bold
  }

  /* GLOBAL: SPLASH */
  .splash {
    height: 100%;
    width: 100%;
    background-color: white;
    display: flex;
    justify-content: space-around;
    z-index: 9999;
    position: fixed;
    top: 0;
    left: 0
  }
  .box {
    position: relative;
    top: calc(50% - 8rem);
    border: .25rem solid #282828;
    border-radius: 3px;
    height: 8rem;
    width: 8rem;
    outline: 0;
    overflow: hidden;
    background-color: #282828;
    display: flex;
    justify-content: center;
    align-items: center;
    animation: flashing 1s ease-in-out alternate-reverse infinite
  }
  .box:after {
    content: '';
    position: absolute;
    background: white;
    height: 16rem;
    width: 16rem;
    bottom: -50%;
    left: -50%;
    border-radius: 35%;
    animation: spin 6s ease-in-out forwards
  }
  .box .logo--svg {
    height: 50%;
    width: auto
  }
  @keyframes spin {
    0% {
      transform: translateY(0) rotate(0deg)
    }
    100% {
      transform: translateY(-100%) rotate(500deg)
    }
  }
  @keyframes flashing {
    0% {
      opacity: .7
    }
    100% {
      opacity: 1
    }
  }

  /* Responsive Design */
  @media (max-width: 992px) {
    #home, #block, #account, #archive, .wrapper--client, #help, #logout, #templates {
      padding: 4rem 10vw;
      overflow-x: hidden
    }
    button:hover, .button:hover, button.fc-today-button.fc-button.fc-button-primary:not(:disabled):hover, button.fc-prev-button.fc-button.fc-button-primary:hover, button.fc-next-button.fc-button.fc-button-primary:hover, button.fc-dayGridWeek-button.fc-button.fc-button-primary:hover, button.fc-dayGridMonth-button.fc-button.fc-button-primary:hover {
      opacity: 1
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
  @media (min-width: 768px) {
    .title-icon {
      height: 48px;
      width: 48px
    }
  }
  @media (max-width: 768px) {
    /* Sidebar */
    .logo {
      display: none
    }
    .sidebar {
      bottom: 0;
      width: 100vw;
      flex-direction: row;
      padding: 1rem 1rem 1.4rem 1rem;
      justify-content: space-between;
      border-right: none
    }
    .sidebar:hover .account_nav--item--text {
      display: none
    }
    main {
      margin: 0
    }
    #home, #block, #account, #archive, .wrapper--client, #help, #logout, #templates {
      padding: 2rem 5vw 4rem 5vw
    }
    .account_nav--item {
      margin: auto;
      padding: 0
    }
    .account_nav--item--text {
      display: none
    }
    .account_nav--item--icon {
      margin: 0
    }
  }

  /* For Mobile */
  @media (max-width: 576px) {
    ::-webkit-scrollbar {
      width: 0;
      background-color: transparent
    }
    p {
      font-size: .8rem
    }
    .main-title {
      font-size: 2.4rem
    }
    .sub-title {
      font-size: 1.6rem
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
      width: 200vw
    }
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    button:active, .button:active {
      transform: scale(1)
    }
    .search, .client_container > a:before, .ql-editor, .show-client-notes, .show-block-notes,.show-workout, div.wrapper--client, .icon--expand, .icon--open-options, .icon--open-stats {
      transition: none
    }
    .sidebar {
      width: 12rem
    }
    .account_nav--item--text {
      opacity: 1
    }
    .animate, .animate.animate__faster {
      animation: none
    }
  }
</style>
<template>
  <!-- Container with class authenticated and setting color css variables -->
  <div id="app" v-bind:class="{'authenticated': authenticated}">
    <transition enter-active-class="animate animate__fadeIn animate__faster" leave-active-class="animate animate__fadeOut animate__faster">
      <div v-show="splashing" class="splash">
        <div class="box">
          <inline-svg :src="require('./assets/svg/logo-icon.svg')" class="logo--svg" />
        </div>
      </div>
    </transition>
    <modal name="error" height="auto" :adaptive="true">
      <div class="modal--error">
        <p><b>Something went wrong. Please try again...</b></p><br>
        <p>{{errorMsg}}</p><br>
        <form action="https://traininblocks.atlassian.net/servicedesk/customer/portal/3/group/4/create/22">
          <button type="submit" formtarget="_blank">Let us know</button>
        </form>
      </div>
    </modal>
    <loading :active.sync="loading" :is-full-page="true" :loader="'bars'" :color="'#282828'"/>
    <a class="skip-to-content-link" href="#main">
      Skip to content
    </a>
    <nav class="sidebar" v-if="authenticated && claims">
      <div class="logo">
        <router-link to="/" class="logo--link" title="Home" v-if="claims.user_type === 'Trainer' || claims.user_type == 'Admin'">
          <inline-svg :src="require('./assets/svg/logo-icon.svg')" class="logo--svg" aria-label="Home"/>
        </router-link>
        <router-link to="/clientUser" class="logo--link" title="Home" v-if="claims.user_type === 'Client'">
          <inline-svg :src="require('./assets/svg/logo-icon.svg')" class="logo--svg" aria-label="Home"/>
        </router-link>
      </div> <!-- .logo -->
      <div class="account_nav--item">
        <router-link to="/" title="Home" v-if="claims.user_type === 'Trainer' || claims.user_type == 'Admin'">
          <inline-svg :src="require('./assets/svg/home.svg')" class="account_nav--item--icon" aria-label="Home"/>
          <p class="account_nav--item--text">
            Home
          </p>
        </router-link>
        <router-link to="/clientUser" title="Home" v-if="claims.user_type === 'Client'">
          <inline-svg :src="require('./assets/svg/home.svg')" class="account_nav--item--icon" aria-label="Home"/>
          <p class="account_nav--item--text">
            Home
          </p>
        </router-link>
      </div>
      <div class="account_nav--item" v-if="claims.user_type === 'Trainer' || claims.user_type == 'Admin'">
        <router-link to="/help" title="Help" >
          <inline-svg :src="require('./assets/svg/help.svg')"  class="account_nav--item--icon" aria-label="Help"/>
          <p class="account_nav--item--text">
            Help
          </p>
        </router-link>
      </div>
      <div class="account_nav--item">
        <router-link to="/templates" title="Templates">
          <inline-svg :src="require('./assets/svg/template.svg')" class="account_nav--item--icon transparent" aria-label="Templates"/>
          <p class="account_nav--item--text">
            Templates
          </p>
        </router-link>
      </div>
      <div class="account_nav--item" v-if="claims.user_type === 'Trainer' || claims.user_type == 'Admin'">
        <router-link to="/archive" title="Archive">
          <inline-svg :src="require('./assets/svg/archive-large.svg')" class="account_nav--item--icon" aria-label="Archive"/>
          <p class="account_nav--item--text">
            Archive
          </p>
        </router-link>
      </div>
      <div class="account_nav--item">
        <router-link to="/account" title="Account">
          <inline-svg :src="require('./assets/svg/account.svg')" class="account_nav--item--icon" aria-label="Account"/>
          <p class="account_nav--item--text">
            Account
          </p>
        </router-link>
      </div>
    </nav> <!-- .sidebar -->
    <main :class="{notAuth: !authenticated}" id="main">
      <transition enter-active-class="animate animate__fadeIn animate__delay-1s animate__faster" leave-active-class="animate animate__fadeOut animate__faster">
        <router-view :key="$route.fullPath"/>
      </transition>
    </main>
  </div>
</template>

<script>
import axios from 'axios'
import InlineSvg from 'vue-inline-svg'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'
import {deleteEmail, deleteEmailText} from './components/components/email'

export default {
  components: {
    InlineSvg,
    Loading
  },
  data: function () {
    return {

      // BACKGROUND DATA //

      splashing: true,
      programmes: null,
      error: '',
      archive_error: '',
      archive_posts: {},
      no_archive: false,
      posts: null,
      claims: {
        user_type: 0
      },
      client_details: null,
      loading_clients: true,
      loading: false,
      dontLeave: false,
      no_clients: false,
      errorMsg: null,

      // USER DATA //

      authenticated: false,

      // QUILL DATA //

      config: {
        theme: 'bubble',
        placeholder: 'Type away...',
        modules: {
          clipboard: {
            matchVisual: false
          },
          toolbar: [
            [{'header': 1}, {'header': 2}, 'bold', 'italic', 'underline', {'script': 'sub'}, {'script': 'super'}, {'list': 'ordered'}, {'list': 'bullet'}, 'link']
          ]
        }
      },

      // PWA //

      deferredPrompt: null,
      displayMode: 'browser tab',
      canInstall: false
    }
  },
  created () {
    this.isAuthenticated()
    window.addEventListener('beforeunload', this.confirmLeave)
  },
  mounted () {
    const self = this
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault()
      // Stash the event so it can be triggered later.
      self.deferredPrompt = e
      // Update UI notify the user they can install the PWA
      this.canInstall = true
    })
    if (navigator.standalone) {
      this.displayMode = 'standalone-ios'
    }
    if (window.matchMedia('(display-mode: standalone)').matches) {
      this.displayMode = 'standalone'
    }
    setTimeout(() => {
      this.splashing = false
    }, 6000)
  },
  watch: {
    // Everytime the route changes, check for auth status
    '$route' (to, from) {
      this.isAuthenticated()
    }
  },
  methods: {
    // PWA //--------------------------------------------------------------------------------------------------------
    installPWA () {
      // Hide the app provided install promotion
      this.canInstall = false
      // Show the install prompt
      this.deferredPrompt.prompt()
      // Wait for the user to respond to the prompt
      this.deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt')
        } else {
          console.log('User dismissed the install prompt')
        }
      })
    },

    // BACKGROUND AND MISC. METHODS //-------------------------------------------------------------------------------

    confirmLeave (e) {
      if (this.dontLeave === true) {
        const msg = 'Your changes might not be saved, are you sure you want to leave?'
        e.returnValue = msg
        return msg
      }
    },
    responseDelay () {
      setTimeout(() => { this.response = '' }, 5000)
    },
    sortWorkoutsBlock () {
      this.programmes.forEach((block) => {
        //eslint-disable-next-line
        if (block.id == this.$route.params.id) {
          block.workouts.sort((a, b) => {
            return new Date(a.date) - new Date(b.date)
          })
        }
      })
    },
    day (date) {
      var weekday = new Array(7)
      weekday[0] = 'Sun'
      weekday[1] = 'Mon'
      weekday[2] = 'Tue'
      weekday[3] = 'Wed'
      weekday[4] = 'Thu'
      weekday[5] = 'Fri'
      weekday[6] = 'Sat'
      var d = new Date(date)
      return weekday[d.getDay()]
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
    async setup () {
      this.claims = JSON.parse(localStorage.getItem('claims'))
      if (this.claims.ga === undefined || this.claims === undefined || this.claims === null) {
        this.claims.ga = true
      }
      if (this.claims.ga !== false) {
        this.$ga.enable()
      } else {
        this.$ga.disable()
      }
      var d = new Date()
      var n = d.getTime()
      if ((!localStorage.getItem('firstLoaded')) || (n > (parseFloat(localStorage.getItem('loadTime')) + 1800000))) {
        await this.clients()
        localStorage.setItem('firstLoaded', true)
        localStorage.setItem('loadTime', n)
      }
      await this.clients_to_vue()
    },

    // CLIENT METHODS //-------------------------------------------------------------------------------

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
    async client_delete (id, index) {
      if (confirm('Are you sure you want to delete this client?')) {
        this.loading = true
        this.dontLeave = true
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
          await axios.delete(`https://api.traininblocks.com/clients/${id}`)

          await this.archive()
          this.archive_to_vue()

          await this.clients()
          this.clients_to_vue()
          this.$ga.event('Client', 'delete')
          this.loading = false
          this.dontLeave = false
        } catch (e) {
          this.loading = false
          this.dontLeave = false
          this.errorMsg = e
          this.$modal.show('error')
          console.error(e)
        }
      }
    },

    // CLIENT ARCHIVE METHODS //-------------------------------------------------------------------------------

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
        let email
        this.loading = true
        this.dontLeave = true
        for (var i = 0; i < this.posts.length; i++) {
          //eslint-disable-next-line
          if (this.posts[i].client_id == id) {
            email = this.posts[i].email
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

          const result = await axios.get(`https://cors-anywhere.herokuapp.com/${process.env.ISSUER}/api/v1/users?filter=profile.email+eq+"${email}"&limit=1`,
            {
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': process.env.AUTH_HEADER
              }
            }
          )
          if (result.data.length >= 1) {
            await axios.post(`https://cors-anywhere.herokuapp.com/${process.env.ISSUER}/api/v1/users/${result.data[0].id}/lifecycle/suspend`,
              {},
              {
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                  'Authorization': process.env.AUTH_HEADER
                }
              }
            )
            await axios.post('https://cors-anywhere.herokuapp.com/https://api.sendgrid.com/v3/mail/send',
              {
                'personalizations': [
                  {
                    'to': [
                      {
                        'email': email
                      }
                    ],
                    'subject': 'Account Deactivated'
                  }
                ],
                'from': {
                  'email': 'Train In Blocks <no-reply@traininblocks.com>'
                },
                'content': [
                  {
                    'type': 'text/plain',
                    'value': deleteEmailText()
                  },
                  {
                    'type': 'text/html',
                    'value': deleteEmail()
                  }
                ]
              },
              {
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': process.env.SENDGRID
                }
              }
            )
          }
          this.loading = false
          this.dontLeave = false
          this.$router.push('/')
        } catch (e) {
          this.loading = false
          this.dontLeave = false
          this.errorMsg = e
          this.$modal.show('error')
          console.error(e)
        }
      }
    },
    async client_unarchive (id, index) {
      if (confirm('Are you sure you want to unarchive this client?')) {
        this.loading = true
        this.dontLeave = true
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
          this.loading = false
          this.dontLeave = false
        } catch (e) {
          this.loading = false
          this.dontLeave = false
          this.errorMsg = e
          this.$modal.show('error')
          console.error(e)
        }
      }
    },

    // DATABSE METHODS //-------------------------------------------------------------------------------

    async get_programmes () {
      try {
        axios.defaults.headers.common['Authorization'] = `Bearer ${await this.$auth.getAccessToken()}`
        const programmes = await axios.get(`https://api.traininblocks.com/programmes/${this.claims.client_id_db}`)
        this.programmes = programmes.data
        var f
        for (f in this.programmes) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${await this.$auth.getAccessToken()}`
          // eslint-disable-next-line
          const response_programmes = await axios.get(`https://api.traininblocks.com/workouts/${this.programmes[f].id}`)

          this.programmes[f].workouts = response_programmes.data
        }
      } catch (e) {
        this.loading = false
        this.errorMsg = e
        this.$modal.show('error')
        console.error(e)
      }
    },
    async get_workouts () {
      try {
        var f
        for (f in this.programmes) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${await this.$auth.getAccessToken()}`
          const response = await axios.get(`https://api.traininblocks.com/workouts/${this.programmes[f].id}`)
          this.programmes[f].workouts = response.data
        }
      } catch (e) {
        this.loading = false
        this.errorMsg = e
        this.$modal.show('error')
        console.error(e)
      }
    },
    async update_workout (pid, wid) {
      this.loading = true
      // Set auth header
      axios.defaults.headers.common['Authorization'] = `Bearer ${await this.$auth.getAccessToken()}`

      let x
      // Set the programme variable to the current programme
      for (x in this.programmes) {
        //eslint-disable-next-line
        if (this.programmes[x].id == pid) {
          var programme = this.programmes[x]
          var y
          for (y in programme.workouts) {
            if (programme.workouts[y].id === wid) {
              var workoutsId = programme.workouts[y].id
              var workoutsChecked = programme.workouts[y].checked
              var workoutsFeedback = programme.workouts[y].feedback
            }
          }
        }
      }
      try {
        await axios.post(`https://api.traininblocks.com/client-workouts`,
          {
            'id': workoutsId,
            'checked': workoutsChecked,
            'feedback': workoutsFeedback
          }
        )
        this.$ga.event('Workout', 'update')
      } catch (e) {
        this.loading = false
        this.errorMsg = e
        this.$modal.show('error')
        console.error(e)
      }
      await this.get_workouts()
      this.sortWorkoutsBlock()
      this.loading = false
    }
  }
}
</script>

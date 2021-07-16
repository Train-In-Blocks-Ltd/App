<style lang="scss">
@import './assets/styles/variables.scss';

/* Global */
* {
  box-sizing: border-box
}

/* Animation */
.fadeIn {
  animation: .6s fadeIn
}
.fadeOut {
  animation: .6s fadeOut
}
.fill_mode_both {
  animation-fill-mode: both
}
.delay {
  animation-delay: .6s
}
.delay_long {
  animation-delay: 1.2s
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

/* Tab overlay */
.section_overlay {
  z-index: 10;
  height: 100%;
  width: 100%;
  transform: translateX(100%);
  position: fixed;
  top: 0;
  right: 0;
  background-color: $overlay_glass;
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  transition: $transition_standard;
  &.opened_sections {
    transform: none
  }
}
@supports not (backdrop-filter: blur(10px)) {
  .section_overlay {
    background-color: $fore
  }
}

/* Document elements */
body {
  font-family: Arial, Helvetica, sans-serif;
  margin: 0;
  min-height: 100%;
  display: grid;
  font-size: 16px;
  line-height: 1.42;
  background-color: $back
}
#app {
  color: $base;
  background-color: $back
}
main {
  margin-left: calc(38px + 2rem);
  display: grid;
  align-items: start
}

/* System state */
.top_banner {
  z-index: 14;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  text-align: center;
  padding: .1rem;
  background-color: $base;
  :is(a, p) {
    display: block;
    color: $fore
  }
}
.notAuth {
  margin: 0
}

/* SVG colors */
svg {
  path {
    fill: $base
  }
  &.no_fill path {
    fill: none;
    stroke: $base
  }
}

/* Other elements */
hr {
  margin: 1rem 0;
  border-color: $base_light
}

/* Containers */
.view_container {
  background-color: $back;
  padding: 2rem 10vw
}
.wrapper--calendar {
  margin: 6rem 0;
  user-select: none
}
.tab_overlay_content {
  position: fixed;
  padding: 4rem 10vw 10rem calc(2rem + 38px + 10vw);
  top: 0;
  left: 0;
  z-index: 11;
  height: 100%;
  width: 100%;
  overflow-x: auto
}
.spacer {
  height: 2rem
}

/* Versioning */
.version {
  display: flex;
  p {
    margin-left: .2rem;
    line-height: 1.65
  }
}

/* Fonts */
h1, h2, h3, p {
  margin: 0
}
h1, .text--large {
  /* stylelint-disable-next-line */
  font-size: 2.6rem !important
}
h2 {
  /* stylelint-disable-next-line */
  font-size: 2.6rem !important
}
h3, .text--small {
  /* stylelint-disable-next-line */
  font-size: 1.6rem !important
}
i {
  /* stylelint-disable-next-line */
  color: $base !important
}
.text--red {
  /* stylelint-disable-next-line */
  color: $base_red !important
}
.text--holder {
  margin: 2rem 0 8rem 0
}
.text--name {
  text-overflow: ellipsis;
  overflow-wrap: anywhere
}
.text--tiny {
  font-size: .8rem
}

/* Tailwinds */
.cursor {
  cursor: pointer;
  transition: $transition_standard;
  &:hover {
    opacity: $light_opacity
  }
}
.allow_y_overflow {
  overflow-y: auto
}
.flex {
  display: flex
}
.recently_added {
  border: 1px solid $base
}
.no_margin {
  margin: 0
}
.top_margin {
  margin-top: 1rem
}
.bottom_margin {
  margin-bottom: 1rem
}
.right_margin {
  margin-right: 1rem
}
.grey {
  color: $base_light
}
.allow_text_overflow {
  text-overflow: ellipsis
}
.disabled, .disabled:hover {
  opacity: $light_opacity;
  cursor: default
}

/* Text buttons */
.a_link {
  display: flex;
  color: $base;
  text-decoration: none;
  transition: 1s all cubic-bezier(.165, .84, .44, 1);
  &:hover {
    opacity: $light_opacity
  }
  svg {
    height: 22px;
    width: 22px
  }
}

/* Box buttons */
button {
  height: fit-content;
  width: auto;
  user-select: none;
  cursor: pointer;
  border-radius: 5px;
  text-transform: capitalize;
  outline-width: 0;
  border: none;
  padding: .6rem 1.6rem;
  font-size: .8rem;
  font-weight: bold;
  color: $back;
  background-color: $base;
  transition: color .4s, background-color .4s, opacity .2s, transform .1s cubic-bezier(.165, .84, .44, 1);
  &:hover:not(:disabled) {
    opacity: $light_opacity
  }
  &:active:not(:disabled) {
    transform: $active_state
  }
  &:focus {
    box-shadow: 0 0 0 4px $base_light
  }
  &:disabled,
  &[disabled] {
    cursor: not-allowed;
    opacity: $light_opacity
  }
  &.green_button {
    color: white;
    background-color: green
  }
  &.red_button {
    color: white;
    background-color: #B80000
  }
}

/* Editor wrapper */
.session_header {
  height: fit-content;
  &.client-side {
    height: 3.2rem
  }
}

/* Inputs */
input:not([type=checkbox]):not([type=radio]):not([type=color]):not([type=button]):not([type=submit]),
select,
textarea {
  outline: none;
  -moz-appearance: none;
  -webkit-appearance: none;
  width: 100%;
  padding: .6rem;
  resize: none;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 1rem;
  color: $base;
  border: 2px solid $base_faint;
  border-radius: 8px;
  background-color: transparent;
  box-shadow: none;
  transition: $transition_standard;
  &:not(:focus):hover {
    opacity: $light_opacity
  }
  &:focus {
    border: 2px solid $base
  }
  &.small_border_radius {
    border-radius: 5px
  }
}
input:not([type=checkbox]):not([type=radio]):not([type=color]):not([type=button]):not([type=submit]):disabled {
  cursor: not-allowed;
  opacity: $light_opacity
}
input:not([type=checkbox]):not([type=radio]):not([type=color]):not([type=button]):not([type=submit]).width_300,
select.width_300 {
  width: 300px
}
input[type=color] {
  margin: 0 .4rem;
  background-color: transparent;
  padding: 0 .14rem;
  outline-width: 0;
  cursor: pointer;
  transition: $transition_standard
}
option {
  background-color: $fore
}
.search {
  width: 100%;
  margin-bottom: 2rem
}
.input_section {
  display: grid;
  grid-gap: 1rem;
  margin: 2rem 0
}
::placeholder {
  color: $base_light;
  opacity: 1; /* Firefox */
}

/* Forms */
.form_grid {
  display: grid;
  grid-auto-rows: max-content;
  grid-gap: 2rem;
  button {
    margin-right: .6rem
  }
}

/* Tab options */
.tab_option {
  user-select: none;
  z-index: 2;
  display: flex;
  cursor: pointer;
  position: fixed;
  right: 0;
  top: 3rem;
  width: 8rem;
  transform: translateX(5rem);
  padding: .4rem 1rem .4rem .6rem;
  border-radius: 3px 0 0 3px;
  background-color: $fore;
  box-shadow: $low_shadow;
  transition: $transition_standard;
  &:hover :is(svg, .notify_badge) {
    display: none
  }
  &:hover .text {
    display: block
  }
  &.icon_open_middle {
    top: 5.4rem
  }
  &.icon_open_bottom {
    top: 7.8rem
  }
  &.tab_option_small:hover {
    padding-left: 1.6rem;
    transform: translateX(2rem)
  }
  &.tab_option_large:hover {
    padding-left: 1.8rem;
    transform: none
  }
  svg {
    height: 20px;
    width: 20px;
    &:hover {
      display: none
    }
  }
  .notify_badge {
    position: absolute;
    top: -5px;
    left: -10px;
    padding: 2px 5px;
    border-radius: 3px;
    background: $base;
    color: $fore;
    font-size: .6rem
  }
  .text {
    font-size: .8rem;
    display: none;
    white-space: nowrap;
    transition: $transition_standard
  }
}

/* Loading bar */
#nprogress {
  .bar {
    /* stylelint-disable-next-line */
    background-color: $base !important
  }
  .peg {
    /* stylelint-disable-next-line */
    box-shadow: 0 0 10px $base, 0 0 5px $base !important
  }
  .spinner-icon {
    /* stylelint-disable-next-line */
    border-top-color: $base !important;
    /* stylelint-disable-next-line */
    border-left-color: $base !important
  }
}

/* Scrollbar */
::-webkit-scrollbar {
  width: 10px;
  height: 10px
}
::-webkit-scrollbar-track {
  background-color: $base_faint
}
::-webkit-scrollbar-thumb {
  background-color: $base;
  &:hover {
    background-color: $base_faint
  }
}

/* Archive and Home */
.clients_container {
  display: grid;
  grid-gap: 2rem;
  margin-bottom: 2rem
}
.client_link_wrapper {
  text-decoration: none
}

@media (min-width: 1440px) {
  .view_container {
    padding: 2rem 15vw
  }
}
@media (max-width: 992px) {
  /* States */
  input:not([type=checkbox]):not([type=radio]):not([type=color]):not([type=button]):not([type=submit]):not(:focus):hover,
  select:not(:focus):hover,
  textarea:not(:focus):hover,
  button:hover:not(:disabled) {
    opacity: 1
  }

  /* Tab options */
  .tab_option {
    &:hover :is(svg, .notify_badge) {
      display: block
    }
    &:hover .text {
      display: none
    }
    &.tab_option_small:hover {
      width: 3rem
    }
    &.tab_option_large:hover {
      width: 3rem
    }
  }
}
@media (max-width: 768px) {
  main {
    margin: 0
  }
  .view_container {
    padding: 2rem 5vw 5rem 5vw
  }
  .tab_overlay_content {
    padding: 4rem 10vw 10rem 10vw
  }
}
@media (max-width: 576px) {
  /* Elements */
  ::-webkit-scrollbar {
    width: 0;
    background-color: transparent
  }
  h1, .text--large {
    font-size: 2rem
  }
  h2, .text--small {
    font-size: 1.2rem
  }
  .wrapper--calendar {
    margin: 2rem 0
  }
  .form_grid {
    .form_button_bar {
      display: grid;
      grid-gap: 1rem;
      margin-top: 2rem;
      button {
        width: 100%
      }
    }
  }

  /* Inputs */
  input:not([type=checkbox]):not([type=radio]):not([type=color]):not([type=button]):not([type=submit]).width_300,
  select.width_300 {
    width: 100%
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  * {
    transition: none
  }
  .fadeIn, .fadeOut {
    animation: none
  }
}
</style>

<template>
  <div id="app" :class="{'authenticated': authenticated}">
    <div v-if="claims.email === 'demo@traininblocks.com' && authenticated" class="top_banner fadeIn">
      <a href="https://traininblocks.com/#pricing" target="_blank" class="a_link text--tiny">
        Demo account: click here to sign up
      </a>
    </div>
    <div v-else-if="!connected" class="top_banner fadeIn">
      <p class="text--tiny">
        Offline mode: we will sync your data when you reconnect
      </p>
    </div>
    <transition enter-active-class="fadeIn" leave-active-class="fadeOut">
      <response-pop-up ref="response_pop_up" />
    </transition>
    <transition enter-active-class="fadeIn" leave-active-class="fadeOut">
      <confirm-pop-up ref="confirm_pop_up" />
    </transition>
    <transition enter-active-class="fadeIn" leave-active-class="fadeOut ">
      <global-overlay ref="overlay" />
    </transition>
    <div v-if="showEULA" class="tab_overlay_content fadeIn delay fill_mode_both">
      <policy :type="claims.user_type" />
    </div>
    <nav-bar v-if="authenticated" :authenticated="authenticated" :claims="claims" />
    <div :class="{ opened_sections: showEULA }" class="section_overlay" />
    <main id="main" :class="{notAuth: !authenticated}">
      <transition enter-active-class="fadeIn fill_mode_both delay" leave-active-class="fadeOut fill_mode_both">
        <router-view :key="$route.fullPath" />
      </transition>
    </main>
  </div>
</template>

<script>
import { mapState } from 'vuex'
const NavBar = () => import(/* webpackChunkName: "components.navbar", webpackPrefetch: true  */ './components/NavBar')
const Policy = () => import(/* webpackChunkName: "components.policy", webpackPrefetch: true  */ './components/Policy')

export default {
  components: {
    NavBar,
    Policy
  },
  computed: mapState([
    'authenticated',
    'claims',
    'showEULA',
    'clients',
    'connected',
    'instanceReady'
  ]),
  watch: {
    $route (to, from) {
      this.isAuthenticated()
    },
    async connected () {
      if (this.connected === true) {
        await this.setup()
      }
    }
  },
  async created () {
    this.$store.commit('setData', {
      attr: 'loading',
      data: true
    })
    this.isAuthenticated()
    this.willBodyScroll(true)
    this.$axios.defaults.headers.common.Authorization = `Bearer ${await this.$auth.getAccessToken()}`
  },
  async mounted () {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(
        function (registrations) {
          if (registrations.length !== 0) {
            for (const REGISTRATION of registrations) {
              REGISTRATION.unregister().then(function () {
                navigator.serviceWorker.register('/traininblocks-sw.js')
              })
            }
          } else {
            navigator.serviceWorker.register('/traininblocks-sw.js')
          }
        }
      )
    }
    window.addEventListener('beforeunload', (e) => {
      if (this.dontLeave) {
        e.preventDefault()
        e.returnValue = 'Your changes might not be saved, are you sure you want to leave?'
      }
    })
    const SELF = this
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault()

      // Stash the event so it can be triggered later.
      SELF.$store.commit('setDataDeep', {
        attrParent: 'pwa',
        attrChild: 'deferredPrompt',
        data: e
      })

      // Update UI notify the user they can install the PWA
      SELF.$store.commit('setDataDeep', {
        attrParent: 'pwa',
        attrChild: 'canInstall',
        data: true
      })
    })
    if ('getInstalledRelatedApps' in navigator) {
      const RELATED_APPS = await navigator.getInstalledRelatedApps()
      if (RELATED_APPS.length > 0) {
        this.$store.commit('setDataDeep', {
          attrParent: 'pwa',
          attrChild: 'installed',
          data: true
        })
      }
    }
    if (navigator.standalone) {
      this.$store.commit('setDataDeep', {
        attrParent: 'pwa',
        attrChild: 'displayMode',
        data: 'standalone-ios'
      })
    }
    if (window.matchMedia('(display-mode: standalone)').matches) {
      this.$store.commit('setDataDeep', {
        attrParent: 'pwa',
        attrChild: 'displayMode',
        data: 'standalone'
      })
    }
    this.$axios.interceptors.request.use((config) => {
      if (SELF.claims.email === 'demo@traininblocks.com' && config.method !== 'get') {
        SELF.$refs.response_pop_up.show('', 'You are using the demo account. Your changes cannot be saved.', true, true)
        SELF.willBodyScroll(false)
        SELF.$store.dispatch('endLoading')
        throw new self.$axios.Cancel('You are using the demo account. Your changes won\'t be saved')
      }
      return config
    }, (error) => {
      return Promise.reject(error)
    })
    this.$store.dispatch('endLoading')
  },
  methods: {

    // -----------------------------
    // System
    // -----------------------------

    /**
     * Gives darkmode theme to the app.
     * @param {string} mode - The mode to switch to.
     */
    darkmode (mode) {
      const MATCHED_MEDIA = window.matchMedia('(prefers-color-scheme)') || false
      if (mode === 'dark') {
        document.documentElement.style.setProperty('--inset_shadow', '#FFFFFF20')
        document.documentElement.style.setProperty('--low_shadow', '0 0 2px 0 #FFFFFF60')
        document.documentElement.style.setProperty('--high_shadow', '0 0 2px 0 white')
        document.documentElement.style.setProperty('--back', '#282828')
        document.documentElement.style.setProperty('--fore', '#383838')
        document.documentElement.style.setProperty('--base', 'white')
        document.documentElement.style.setProperty('--base_light', '#FFFFFF94')
        document.documentElement.style.setProperty('--base_faint', '#FFFFFF40')
        document.documentElement.style.setProperty('--overlay_glass', '#282828B3')
        document.documentElement.style.setProperty('--calendar_highlight', '#686868')
        document.documentElement.style.setProperty('--skeleton_1', '#686868')
        document.documentElement.style.setProperty('--skeleton_2', '#484848')
        document.documentElement.style.setProperty('--link', 'white')
        document.documentElement.style.setProperty('--base_red', 'white')
      } else if (mode === 'system' && (MATCHED_MEDIA === false ? false : MATCHED_MEDIA.media !== 'not all')) {
        this.darkmode(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
        window.matchMedia('(prefers-color-scheme: dark)').addListener((e) => {
          this.darkmode(e.matches ? 'dark' : 'light')
        })
      } else {
        document.documentElement.style.setProperty('--inset_shadow', '#28282810')
        document.documentElement.style.setProperty('--low_shadow', '0 0 20px 10px #28282808')
        document.documentElement.style.setProperty('--high_shadow', '0 0 20px 10px #28282816')
        document.documentElement.style.setProperty('--back', '#F9F9F9')
        document.documentElement.style.setProperty('--fore', 'white')
        document.documentElement.style.setProperty('--base', '#282828')
        document.documentElement.style.setProperty('--base_light', '#585858')
        document.documentElement.style.setProperty('--base_faint', '#28282840')
        document.documentElement.style.setProperty('--overlay_glass', '#FFFFFFB3')
        document.documentElement.style.setProperty('--calendar_highlight', '#FFFFEE')
        document.documentElement.style.setProperty('--skeleton_1', '#F4F4F4')
        document.documentElement.style.setProperty('--skeleton_2', '#E4E4E4')
        document.documentElement.style.setProperty('--link', 'blue')
        document.documentElement.style.setProperty('--base_red', 'rgb(184, 0, 0)')
      }
    },

    /**
     * Processes captured error and sends to Jira.
     * @param {string} msg - The error text.
     */
    async resolveError (msg) {
      if (this.claims.user_type !== 'Admin') {
        await this.$axios.post('/.netlify/functions/error', {
          msg,
          claims: this.claims
        })
      }
      this.$store.dispatch('endLoading')
      this.$refs.response_pop_up.show('ERROR: this problem has been reported to our developers', msg.toString() !== 'Error: Network Error' ? msg.toString() : 'You may be offline. We\'ll try that request again once you\'ve reconnected', true, true)
      this.willBodyScroll(false)
    },

    // -----------------------------
    // Auth
    // -----------------------------

    /**
     * Checks if the user is authenticated and sets the Vuex state accordingly.
     */
    async isAuthenticated () {
      this.$store.commit('setData', {
        attr: 'authenticated',
        data: await this.$auth.isAuthenticated()
      })
    },

    /**
     * Initiates all the crucial setup for the app.
     * @param {boolean} - Whether this process is forced.
     */
    async setup (force) {
      force = force || false
      if (!this.instanceReady || force) {
        // Set claims
        this.$store.commit('setData', {
          attr: 'claims',
          data: localStorage.getItem('claims') ? JSON.parse(localStorage.getItem('claims')) : this.$auth.getUser()
        })
        const CLAIMS = this.$store.state.claims
        if (CLAIMS.user_type === 'Trainer' || CLAIMS.user_type === 'Admin') {
          this.$store.commit('setData', {
            attr: 'isTrainer',
            data: true
          })
        }
        if (CLAIMS) {
          if (!CLAIMS.ga || !CLAIMS) {
            this.$store.commit('setData', {
              attr: 'ga',
              data: true
            })
          }
          if (!CLAIMS.theme || !CLAIMS) {
            this.$store.commit('setData', {
              attr: 'theme',
              data: 'system'
            })
          }

          // Set analytics and theme
          CLAIMS.ga !== false ? this.$ga.enable() : this.$ga.disable()
          this.darkmode(CLAIMS.theme)

          // Set EULA
          if ((!CLAIMS.policy || this.$store.state.policyVersion !== CLAIMS.policy[2]) && CLAIMS.email !== 'demo@traininblocks.com' && this.authenticated) {
            this.willBodyScroll(false)
            this.$store.commit('setData', {
              attr: 'showEULA',
              data: true
            })
          }
        }

        // Set auth header
        this.$axios.defaults.headers.common.Authorization = `Bearer ${await this.$auth.getAccessToken()}`

        // Set connection
        this.$store.commit('setData', {
          attr: 'connected',
          data: navigator.onLine
        })
        const SELF = this
        window.addEventListener('offline', function (event) {
          SELF.$store.commit('setData', {
            attr: 'connected',
            data: false
          })
        })
        window.addEventListener('online', function (event) {
          SELF.$store.commit('setData', {
            attr: 'connected',
            data: true
          })
        })

        // Check build
        if (localStorage.getItem('versionBuild') !== this.$store.state.versionBuild) {
          this.$store.commit('setData', {
            attr: 'newBuild',
            data: true
          })
        }

        // Get data if not client
        if (this.claims.user_type === 'Admin' || this.claims.user_type === 'Trainer') {
          try {
            await this.$store.dispatch('getHighLevelData')
            this.$store.dispatch('endLoading')
          } catch (e) {
            this.resolveError(e)
          }
        }

        // Stops setup from running more than once
        this.$store.commit('setData', {
          attr: 'instanceReady',
          data: true
        })
      }
    },

    /**
     * Saves the user's claims to Okta.
     */
    async saveClaims () {
      try {
        this.$store.commit('setData', {
          attr: 'dontLeave',
          data: true
        })
        await this.$store.dispatch('saveClaims')
        this.$store.dispatch('endLoading')
      } catch (e) {
        this.resolveError(e)
      }
    },

    // -----------------------------
    // Client-side
    // -----------------------------

    /**
     * Gets all the data for setup on the client-side
     */
    async getClientSideData () {
      try {
        await this.$store.dispatch('getClientSideInfo')
        await this.$store.dispatch('getClientSidePlans')
        this.$store.dispatch('endLoading')
      } catch (e) {
        this.resolveError(e)
      }
    },

    /**
     * Updates a client-side session.
     * @param {integer} planId - The id of the plan.
     * @param {integer} sessionId - The id of the session to update.
     */
    async updateClientSideSession (planId, sessionId) {
      try {
        await this.$store.dispatch('updateClientSideSession', {
          planId,
          sessionId
        })
        this.$ga.event('Session', 'update')
        this.$refs.response_pop_up.show('Session updated', 'Your changes have been saved')
        this.$store.dispatch('endLoading')
      } catch (e) {
        this.resolveError(e)
      }
    }
  }
}
</script>

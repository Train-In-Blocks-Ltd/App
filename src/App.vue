<style>
/* Global */
* {
  box-sizing: border-box
}
:root {
  --transition_smooth: .4s all;
  --transition_standard: .6s all cubic-bezier(.165, .84, .44, 1);
  --low_shadow: 0 0 20px 10px #28282808;
  --high_shadow: 0 0 20px 10px #28282816;
  --back: #F9F9F9;
  --fore: white;
  --base: #282828;
  --base_light: #585858;
  --base_faint: #28282840;
  --base_red: rgb(184, 0, 0);
  --overlay_glass: #FFFFFFB3;
  --calendar_highlight: #FFFFEE;
  --skeleton_1: #F4F4F4;
  --skeleton_2: #E4E4E4;
  --link: blue;
  --light_opacity: .6;
  --active_state: scale(.95)
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
  background-color: var(--overlay_glass);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  transition: var(--transition_standard)
}
.section_overlay.opened_sections {
  transform: none
}
@supports not (backdrop-filter: blur(10px)) {
  .section_overlay {
    background-color: var(--fore)
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
  background-color: var(--back)
}
#app {
  color: var(--base);
  background-color: var(--back)
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
  background-color: var(--base)
}
.top_banner :is(a, p) {
  display: block;
  color: var(--fore)
}
.notAuth {
  margin: 0
}

/* SVG colors */
svg path {
  fill: var(--base)
}
svg.no_fill path {
  fill: none;
  stroke: var(--base)
}

/* Other elements */
hr {
  margin: 1rem 0;
  border-color: var(--base_light)
}

/* Containers */
.view_container {
  background-color: var(--back);
  padding: 2rem 10vw
}
.container--title {
  display: flex;
  margin: 2rem 0
}
.wrapper--calendar {
  margin: 6rem 0;
  user-select: none
}
.full_width_bar {
  width: 100%
}
.tab_overlay_content {
  position: fixed;
  padding: 4rem 20vw 10rem calc(2rem + 38px + 20vw);
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
  display: flex
}
.version p {
  margin-left: .2rem;
  line-height: 1.65
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
  color: var(--base) !important
}
.text--red {
  /* stylelint-disable-next-line */
  color: var(--base_red) !important
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
  transition: var(--transition_standard)
}
.cursor:hover {
  opacity: var(--light_opacity)
}
.allow_y_overflow {
  overflow-y: auto
}
.flex {
  display: flex
}
.recently_added {
  border: 1px solid var(--base)
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
  color: var(--base_light)
}
.allow_text_overflow {
  text-overflow: ellipsis
}
.disabled, .disabled:hover {
  opacity: var(--light_opacity);
  cursor: default
}

/* Text buttons */
.a_link {
  display: flex;
  color: var(--base);
  text-decoration: none;
  transition: 1s all cubic-bezier(.165, .84, .44, 1)
}
.a_link svg {
  height: 22px;
  width: 22px
}
.a_link:hover {
  opacity: var(--light_opacity)
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
  color: var(--back);
  background-color: var(--base);
  transition: color .4s, background-color .4s, opacity .2s, transform .1s cubic-bezier(.165, .84, .44, 1)
}
button:hover:not(:disabled) {
  opacity: var(--light_opacity)
}
button:active:not(:disabled) {
  transform: var(--active_state)
}
button:focus {
  box-shadow: 0 0 0 4px var(--base_light)
}
button:disabled,
button[disabled] {
  cursor: not-allowed;
  opacity: var(--light_opacity)
}
.green_button {
  color: white;
  background-color: green
}
.red_button {
  color: white;
  background-color: #B80000
}

/* Editor wrapper */
.session_header {
  height: fit-content
}
.session_header.client-side {
  height: 3.2rem
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
  color: var(--base);
  border: 2px solid var(--base_faint);
  border-radius: 8px;
  background-color: transparent;
  box-shadow: none;
  transition: var(--transition_standard)
}
input:not([type=checkbox]):not([type=radio]):not([type=color]):not([type=button]):not([type=submit]):not(:focus):hover,
select:not(:focus):hover,
textarea:not(:focus):hover {
  opacity: var(--light_opacity)
}
input:not([type=checkbox]):not([type=radio]):not([type=color]):not([type=button]):not([type=submit]):disabled {
  cursor: not-allowed;
  opacity: var(--light_opacity)
}
input:not([type=checkbox]):not([type=radio]):not([type=color]):not([type=button]):not([type=submit]):focus,
select:focus,
textarea:focus {
  border: 2px solid var(--base)
}
input:not([type=checkbox]):not([type=radio]):not([type=color]):not([type=button]):not([type=submit]).small_border_radius,
select.small_border_radius {
  border-radius: 5px
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
  transition: var(--transition_standard)
}
option {
  background-color: var(--fore)
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
  color: var(--base_light);
  opacity: 1; /* Firefox */
}

/* Forms */
.form_grid {
  display: grid;
  grid-auto-rows: max-content;
  grid-gap: 2rem
}
.form_grid button {
  margin-right: .6rem
}

/* Logo */
.logo {
  margin-bottom: auto
}
.logo_link {
  display: block;
  width: 38px;
  transition: 1s all cubic-bezier(.165, .84, .44, 1)
}
.logo_link:hover {
  opacity: var(--light_opacity)
}
.logo_link:active {
  transform: var(--active_state)
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
  background-color: var(--fore);
  box-shadow: var(--low_shadow);
  transition: var(--transition_standard)
}
.icon_open_middle {
  top: 5.4rem
}
.icon_open_bottom {
  top: 7.8rem
}
.tab_option_small:hover {
  padding-left: 1.6rem;
  transform: translateX(2rem)
}
.tab_option_large:hover {
  padding-left: 1.8rem;
  transform: none
}
.tab_option svg {
  height: 20px;
  width: 20px
}
.tab_option:hover svg,
.tab_option:hover .notify_badge {
  display: none
}
.tab_option .text {
  font-size: .8rem;
  display: none;
  white-space: nowrap;
  transition: var(--transition_standard)
}
.tab_option:hover .text {
  display: block
}
.notify_badge {
  position: absolute;
  top: -5px;
  left: -10px;
  padding: 2px 5px;
  border-radius: 3px;
  background: var(--base);
  color: var(--fore);
  font-size: .6rem
}

/* Loading bar */
#nprogress .bar {
  /* stylelint-disable-next-line */
  background-color: var(--base) !important
}
#nprogress .peg {
  /* stylelint-disable-next-line */
  box-shadow: 0 0 10px var(--base), 0 0 5px var(--base) !important
}
#nprogress .spinner-icon {
  /* stylelint-disable-next-line */
  border-top-color: var(--base) !important;
  /* stylelint-disable-next-line */
  border-left-color: var(--base) !important
}

/* Scrollbar */
::-webkit-scrollbar {
  width: 10px;
  height: 10px
}
::-webkit-scrollbar-track {
  background-color: var(--base_faint)
}
::-webkit-scrollbar-thumb {
  background-color: var(--base)
}
::-webkit-scrollbar-thumb:hover {
  background-color: var(--base_faint)
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

/* 992 touchscreens */
@media (max-width: 992px) {
  /* States */
  input:not([type=checkbox]):not([type=radio]):not([type=color]):not([type=button]):not([type=submit]):not(:focus):hover,
  select:not(:focus):hover,
  textarea:not(:focus):hover,
  button:hover:not(:disabled) {
    opacity: 1
  }

  /* Tab options */
  .tab_option_small:hover {
    width: 3rem
  }
  .tab_option_large:hover {
    width: 3rem
  }
  .tab_option:hover svg,
  .tab_option:hover .notify_badge {
    display: block
  }
  .tab_option:hover .text {
    display: none
  }
}
@media (max-width: 768px) {
  /* Containers */
  .center_wrapped {
    width: 300px
  }
  .tab_overlay_content {
    padding: 4rem 10vw 10rem 10vw
  }

  /* Container */
  main {
    margin: 0
  }
  .view_container {
    padding: 2rem 5vw 5rem 5vw
  }
}

/* 576 Mobiles */
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
  .button--state {
    width: 100%
  }
  .center_wrapped {
    max-width: 300px
  }
  .wrapper--calendar {
    margin: 2rem 0
  }
  .form_button_bar {
    display: grid;
    grid-gap: 1rem;
    margin-top: 2rem
  }
  .form_grid button {
    width: 100%
  }

  /* Inputs */
  input:not([type=checkbox]):not([type=radio]):not([type=color]):not([type=button]):not([type=submit]).width_300,
  select.width_300 {
    width: 100%
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  :root {
    --transition_standard: none
  }
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
    'connected'
  ]),
  watch: {
    $route (to, from) {
      this.isAuthenticated()
    },
    async connected () {
      if (this.connected === true) {
        await this.$store.dispatch('clientsForceGet')
        await this.$store.dispatch('archiveForceGet')
        this.setup()
      }
    },
    clients () {
      try {
        if (this.clients) {
          for (const CLIENT of this.clients) {
            if (!CLIENT.plans) {
              CLIENT.plans = this.$store.dispatch('getPlans', {
                clientId: CLIENT.client_id,
                force: true
              })
            }
          }
        }
        this.$store.dispatch('endLoading')
      } catch (e) {
        this.resolve_error(e)
      }
    }
  },
  async created () {
    this.isAuthenticated()
    this.willBodyScroll(false)
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
    if (this.claims.user_type === ('Trainer' || 'Admin')) {
      this.$store.commit('setData', {
        attr: 'isTrainer',
        data: true
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
    await this.setup()
  },
  methods: {
    darkmode (mode) {
      const MATCHED_MEDIA = window.matchMedia('(prefers-color-scheme)') || false
      if (mode === 'dark') {
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

    // AUTH

    async isAuthenticated () {
      this.$store.commit('setData', {
        attr: 'authenticated',
        data: await this.$auth.isAuthenticated()
      })
    },
    async setup () {
      // Set claims
      this.$store.commit('setData', {
        attr: 'claims',
        data: localStorage.getItem('claims') ? JSON.parse(localStorage.getItem('claims')) : this.$auth.getUser()
      })
      const CLAIMS = this.$store.state.claims
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

      // Get all data
      try {
        await this.$store.dispatch('clientsToVue')
        if (this.$store.state.clients) {
          for (const CLIENT of this.$store.state.clients) {
            CLIENT.plans = this.$store.dispatch('getPlans', {
              clientId: CLIENT.client_id,
              force: true
            })
          }
        }
        await this.$store.dispatch('getTemplates', false)
        await this.$store.dispatch('getPortfolio')
        this.$store.dispatch('endLoading')
      } catch (e) {
        this.resolve_error(e)
      }
    },
    async saveClaims () {
      try {
        await this.$store.dispatch('saveClaims')
        this.$store.dispatch('endLoading')
      } catch (e) {
        this.resolve_error(e)
      }
    },

    // SYSTEM STATE

    async resolve_error (msg) {
      if (this.claims.user_type !== 'Admin') {
        await this.$axios.post('/.netlify/functions/error',
          {
            msg,
            claims: this.claims
          }
        )
      }
      this.$store.dispatch('endLoading')
      this.$refs.response_pop_up.show('ERROR: this problem has been reported to our developers', msg.toString() !== 'Error: Network Error' ? msg.toString() : 'You may be offline. We\'ll try that request again once you\'ve reconnected', true, true)
      this.willBodyScroll(false)
    },

    // Client-side

    async getClientSidePlans () {
      try {
        await this.$store.dispatch('getClientSidePlans')
        this.$store.dispatch('endLoading')
      } catch (e) {
        this.resolve_error(e)
      }
    },
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
        this.resolve_error(e)
      }
    }
  }
}
</script>

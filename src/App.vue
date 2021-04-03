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
    --overlay_glass: #FFFFFFB3;
    --calendar_highlight: #FFFFEE;
    --skeleton_1: #F4F4F4;
    --skeleton_2: #E4E4E4;
    --link: blue
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
    height: 100%;
    position: fixed;
    top: 0;
    right: 0;
    width: 0;
    background-color: var(--overlay_glass);
    -webkit-backdrop-filter: blur(10px);
    backdrop-filter: blur(10px);
    transition: var(--transition_standard)
  }
  .section_overlay.opened_sections {
    width: 100%;
    z-index: 4
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
  h1, h2 {
    margin: 0
  }
  h1, .text--large {
    /* stylelint-disable-next-line */
    font-size: 2.6rem !important
  }
  h2, .text--small {
    /* stylelint-disable-next-line */
    font-size: 1.6rem !important
  }
  em {
    /* stylelint-disable-next-line */
    color: var(--base) !important
  }
  .notAuth {
    margin: 0
  }
  svg path {
    fill: var(--base)
  }
  svg.no_fill path {
    fill: none;
    stroke: var(--base)
  }

  /* Show HTML */
  .show_html > div,
  .show_html > p {
    margin: .6rem 0
  }
  .show_html img {
    border-radius: 10px;
    max-width: 80%;
    margin: 1rem 0
  }
  .show_html input[type='checkbox'] {
    margin: .4rem
  }
  .show_html a {
    color: var(--link)
  }

  /* Containers */
  #home,
  #client,
  #account,
  #archive,
  #logout,
  #templates,
  #client-plan,
  #portfolio {
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
    z-index: 5;
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

  /* Modals */
  div.vm--modal {
    /* stylelint-disable-next-line */
    left: 0!important;
    min-width: 100%;
    overflow-y: auto;
    background-color: var(--back)
  }
  div.vm--modal > div:not(#policy_agreement),
  div.vm--modal > form {
    padding: 2rem;
    display: flex;
    height: 100%
  }
  .center_wrapped {
    margin: auto;
    width: 500px
  }

  /* Fonts */
  h3 {
    font-size: 2rem;
    line-height: 1.2
  }
  p {
    margin: 0
  }
  .text--error, a.text--red {
    color: rgb(184, 0, 0)
  }
  .text--holder {
    margin: 2rem 0 8rem 0
  }
  .text--name {
    text-overflow: ellipsis;
    white-space: nowrap
  }
  .text--date,
  .text--checked,
  .text--tiny {
    font-size: .8rem
  }

  /* Tailwinds */
  .cursor {
    cursor: pointer;
    transition: var(--transition_standard)
  }
  .cursor:hover {
    opacity: .6
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
    opacity: .6;
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
    width: 22px;
    margin-right: .2rem
  }
  .a_link:hover {
    opacity: .6
  }

  /* Box buttons */
  button {
    height: auto;
    width: auto;
    max-height: 35px;
    user-select: none;
    cursor: pointer;
    border-radius: 5px;
    opacity: 1;
    text-transform: capitalize;
    outline-width: 0;
    border: none;
    padding: .6rem 1.6rem;
    font-size: .8rem;
    color: var(--back);
    background-color: var(--base);
    transition: color .6s, background-color .6s, opacity .2s, transform .1s cubic-bezier(.165, .84, .44, 1)
  }
  button:hover:not(:disabled) {
    opacity: .6
  }
  button:active:not(:disabled) {
    transform: scale(.96)
  }
  button:focus {
    box-shadow: 0 0 0 4px var(--base_light)
  }
  button:disabled,
  button[disabled] {
    cursor: not-allowed;
    opacity: .6
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
    border: 1px solid var(--base_faint);
    border-radius: 8px;
    background-color: transparent;
    box-shadow: none;
    transition: var(--transition_standard)
  }
  input:not([type=checkbox]):not([type=radio]):not([type=color]):not([type=button]):not([type=submit]):not(:focus):hover,
  select:not(:focus):hover,
  textarea:not(:focus):hover {
    opacity: .6
  }
  input:not([type=checkbox]):not([type=radio]):not([type=color]):not([type=button]):not([type=submit]):disabled {
    cursor: not-allowed;
    opacity: .6
  }
  input:not([type=checkbox]):not([type=radio]):not([type=color]):not([type=button]):not([type=submit]):focus,
  select:focus,
  textarea:focus {
    border: 1px solid var(--base)
  }
  input:not([type=checkbox]):not([type=radio]):not([type=color]):not([type=button]):not([type=submit]).small_border_radius,
  select.small_border_radius {
    border-radius: 5px
  }
  input:not([type=checkbox]):not([type=radio]):not([type=color]):not([type=button]):not([type=submit]).width_300,
  select.width_300 {
    width: 300px
  }
  .search {
    width: 100%;
    margin-bottom: 2rem
  }
  input[type=color] {
    margin: 0 .4rem;
    background-color: transparent;
    padding: 0 .14rem;
    outline-width: 0;
    cursor: pointer;
    transition: var(--transition_standard)
  }
  ::placeholder {
    color: var(--base_light);
    opacity: 1; /* Firefox */
  }
  option {
    background-color: var(--fore)
  }

  /* Forms */
  .form_grid {
    display: grid;
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
    opacity: .6
  }
  .logo_link:active {
    transform: scale(.9)
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
    width: 3rem;
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
    width: 6rem
  }
  .tab_option_large:hover {
    width: 8rem
  }
  .tab_option:hover {
    justify-content: center;
    text-align: center
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
    background: red;
    color: white;
    font-size: .6rem
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
    border-radius: 3px;
    background-color: var(--base)
  }
  ::-webkit-scrollbar-thumb:hover {
    background-color: var(--base_faint)
  }

  /* Archive and Home */
  .container--clients {
    display: grid;
    grid-gap: 2rem;
    margin-bottom: 2rem
  }
  .client_container p {
    margin: 0
  }

  /* Plan links container */
  .client_link_wrapper {
    text-decoration: none
  }

  /* Client-side */
  .container--session-control {
    display: flex;
    justify-content: space-between
  }
  .session-counter {
    align-self: center;
    font-size: 1rem
  }

  /* Responsiveness */
  @media (max-width: 992px) {
    input:not([type=checkbox]):not([type=radio]):not([type=color]):not([type=button]):not([type=submit]):hover,
    button:not(:disabled):hover,
    .button:hover,
    select:hover,
    textarea:hover {
      opacity: 1
    }
    #home,
    #client,
    #account,
    #archive,
    #logout,
    #templates,
    #client-plan,
    #portfolio {
      padding: 4rem 10vw
    }
    .cursor:hover {
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
    #home,
    #client,
    #account,
    #archive,
    #logout,
    #templates,
    #client-plan,
    #portfolio {
      padding: 2rem 5vw 5rem 5vw
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
  }

  /* REDUCED MOTION */
  @media (prefers-reduced-motion: reduce) {
    button:active,
    .button:active {
      transform: scale(1)
    }
    .search,
    .client_container > a:before,
    .icon--expand,
    .tab_option,
    .icon_open--stats,
    .icon_open--new_client,
    .icon_open--install_PWA,
    .icon_open--new_plan {
      transition: none
    }
    #sidebar {
      width: 12rem
    }
    .nav_item__text {
      opacity: 1
    }
    .fadeIn, .fadeOut {
      animation: none
    }
  }

  /* Progress */
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
</style>

<template>
  <!-- Container with class authenticated and setting color css variables -->
  <div id="app" :class="{'authenticated': authenticated}">
    <transition enter-active-class="fadeIn" leave-active-class="fadeOut">
      <response-pop-up ref="response_pop_up" />
    </transition>
    <transition enter-active-class="fadeIn" leave-active-class="fadeOut">
      <confirm-pop-up ref="confirm_pop_up" />
    </transition>
    <transition enter-active-class="fadeIn" leave-active-class="fadeOut">
      <global-overlay ref="overlay" />
    </transition>
    <modal name="error" height="100%" width="100%" :adaptive="true" :click-to-close="false">
      <div class="modal--error">
        <div class="center_wrapped">
          <p>Something went wrong, please try that again</p>
          <p class="grey">
            This problem has been reported to our developers
          </p>
          <br>
          <p>{{ errorMsg }}</p><br>
          <button class="red_button" @click="$modal.hide('error'), will_body_scroll(true)">
            Close
          </button>
        </div>
      </div>
    </modal>
    <modal name="agreement" height="100%" width="100%" :adaptive="true" :click-to-close="false">
      <policy :type="claims.user_type" />
    </modal>
    <nav-bar :authenticated="authenticated" :claims="claims" />
    <main id="main" :class="{notAuth: !authenticated}">
      <transition enter-active-class="fadeIn fill_mode_both delay" leave-active-class="fadeOut fill_mode_both">
        <router-view :key="$route.fullPath" />
      </transition>
    </main>
  </div>
</template>

<script>
import { deleteEmail, deleteEmailText, feedbackEmail, feedbackEmailText } from './components/email'
import(/* webpackChunkName: "traininblocks-sw", webpackPreload: true  */ './traininblocks-sw.js')
const NavBar = () => import(/* webpackChunkName: "components.navbar", webpackPrefetch: true  */ './components/NavBar')
const Policy = () => import(/* webpackChunkName: "components.policy", webpackPrefetch: true  */ './components/Policy')

export default {
  components: {
    NavBar,
    Policy
  },
  data () {
    return {

      // USER

      isTrainer: false,
      claims: {
        user_type: 0
      },
      clientUser: {
        plans: null
      },

      // CLIENT

      clients: null,
      noClients: false,
      client_details: null,

      // ARCHIVE

      archive: {
        clients: {},
        no_archive: false
      },

      // PORTFOLIO

      portfolio: {
        business_name: '',
        trainer_name: '',
        notes: ''
      },

      // TEMPLATE

      templates: null,

      // SYSTEM

      policyVersion: '1.1',
      versionName: 'Pegasus',
      versionBuild: '3.2',
      newBuild: false,
      errorMsg: null,
      loading: false,
      dontLeave: false,
      silent_loading: false,
      authenticated: false,
      pwa: {
        deferredPrompt: null,
        displayMode: 'browser tab',
        canInstall: false,
        installed: null
      }
    }
  },
  watch: {
    $route (to, from) {
      this.is_authenticated()
    }
  },
  async created () {
    this.is_authenticated()
    this.will_body_scroll(false)
    this.$axios.defaults.headers.common.Authorization = `Bearer ${await this.$auth.getAccessToken()}`
  },
  async mounted () {
    if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/js/traininblocks-sw.js')
    }
    window.addEventListener('beforeunload', (e) => {
      if (this.dontLeave) {
        e.preventDefault()
        e.returnValue = 'Your changes might not be saved, are you sure you want to leave?'
      }
    })
    const self = this
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault()
      // Stash the event so it can be triggered later.
      self.pwa.deferredPrompt = e
      // Update UI notify the user they can install the PWA
      this.pwa.canInstall = true
    })
    if ('getInstalledRelatedApps' in navigator) {
      const self = this
      const relatedApps = await navigator.getInstalledRelatedApps()
      if (relatedApps.length > 0) {
        self.pwa.installed = true
      }
    }
    if (navigator.standalone) {
      this.pwa.displayMode = 'standalone-ios'
    }
    if (window.matchMedia('(display-mode: standalone)').matches) {
      this.pwa.displayMode = 'standalone'
    }
    if (this.claims.user_type === ('Trainer' || 'Admin')) {
      this.isTrainer = true
    }
  },
  methods: {
    async helper (mode, gaItem, gaAction) {
      switch (mode) {
        case 'client_store':
          await this.archive_f()
          this.archive_to_vue()
          await this.clients_f()
          this.clients_to_vue()
          this.$ga.event(gaItem, gaAction)
          this.end_loading()
          break
      }
    },
    darkmode (mode) {
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
      } else if (mode === 'system' && window.matchMedia('(prefers-color-scheme)').media !== 'not all') {
        this.darkmode(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
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
      }
    },

    // AUTH

    async is_authenticated () {
      this.authenticated = await this.$auth.isAuthenticated()
    },
    async setup () {
      if (localStorage.getItem('claims')) {
        this.claims = JSON.parse(localStorage.getItem('claims'))
      } else {
        this.claims = this.$auth.getUser()
      }
      if (this.claims) {
        if (this.claims.ga === undefined || this.claims === undefined || this.claims === null) {
          this.claims.ga = true
        }
        this.claims.ga !== false ? this.$ga.enable() : this.$ga.disable()

        if (this.claims.theme === undefined || this.claims === undefined || this.claims === null) {
          this.claims.theme = 'system'
        }
        this.darkmode(this.claims.theme)
        if (this.claims.policy === undefined || this.claims.policy === []) {
          this.will_body_scroll(false)
          this.$modal.show('agreement')
        } else if (this.policyVersion !== this.claims.policy[2]) {
          this.will_body_scroll(false)
          this.$modal.show('agreement')
        }
      }
      this.$axios.defaults.headers.common.Authorization = `Bearer ${await this.$auth.getAccessToken()}`
      await this.clients_to_vue()
    },
    async save_claims () {
      this.dontLeave = true
      try {
        await this.$axios.post('/.netlify/functions/okta',
          {
            type: 'POST',
            body: {
              profile: {
                ga: this.claims.ga,
                theme: this.claims.theme,
                policy: this.claims.policy
              }
            },
            url: `${this.claims.sub}`
          }
        )
        localStorage.removeItem('claims')
        this.dontLeave = false
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
      this.end_loading()
      this.errorMsg = msg.toString()
      this.$modal.show('error')
      this.will_body_scroll(false)
      console.error(msg)
    },
    end_loading () {
      this.loading = false
      this.dontLeave = false
      this.silent_loading = false
    },

    // CLIENT

    async clients_to_vue () {
      if (!localStorage.getItem('clients')) {
        await this.clients_f()
      }
      this.clients = JSON.parse(localStorage.getItem('clients')).sort((a, b) => {
        const textA = a.name.toUpperCase()
        const textB = b.name.toUpperCase()
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0
      })
      /*
      if (!this.noClients && this.isTrainer) {
        for (const client of this.clients) {
          const planResponse = await this.$axios.get(`https://api.traininblocks.com/programmes/${client.client_id}`)
          client.plans = planResponse.data.length === 0 ? false : planResponse.data
          if (client.plans !== false) {
            for (const plan of client.plans) {
              const sessionsResponse = await this.$axios.get(`https://api.traininblocks.com/workouts/${plan.id}`)
              plan.sessions = sessionsResponse.data.length === 0 ? false : sessionsResponse.data
            }
          }
        }
      }
      localStorage.setItem('clients', JSON.stringify(this.clients))
      */
    },
    async clients_f () {
      try {
        const response = await this.$axios.get(`https://api.traininblocks.com/clients/${this.claims.sub}`)
        this.noClients = response.data.length === 0
        localStorage.setItem('clients', JSON.stringify(response.data))
      } catch (e) {
        this.noClients = false
        this.resolve_error(e)
      }
    },
    async client_delete (id) {
      this.dontLeave = true
      try {
        await this.$axios.delete(`https://api.traininblocks.com/clients/${id}`)
        this.helper('client_store', 'Client', 'delete')
        this.archive.no_archive = this.archive.clients.length === 0
      } catch (e) {
        this.resolve_error(e)
      }
    },

    // CLIENT ARCHIVE

    async update_client (clientNotesUpdate) {
      this.silent_loading = true
      this.dontLeave = true
      try {
        await this.$axios.post('https://api.traininblocks.com/clients',
          {
            id: this.client_details.client_id,
            name: this.client_details.name,
            email: this.client_details.email,
            number: this.client_details.number,
            notes: clientNotesUpdate === undefined ? this.client_details.notes : clientNotesUpdate
          }
        )
        // Get the client information again as we have just updated the client
        await this.clients_f()
        await this.clients_to_vue()
        this.$refs.response_pop_up.show('Client updated', 'All your changes have been saved')
        this.end_loading()
      } catch (e) {
        this.resolve_error(e)
      }
    },
    async archive_to_vue () {
      if (!localStorage.getItem('archive')) {
        await this.archive_f()
      }
      if (JSON.parse(localStorage.getItem('archive')).length === 0) {
        this.archive.no_archive = true
      } else {
        this.archive.clients = JSON.parse(localStorage.getItem('archive')).sort((a, b) => {
          const textA = a.name.toUpperCase()
          const textB = b.name.toUpperCase()
          return (textA < textB) ? -1 : (textA > textB) ? 1 : 0
        })
      }
    },
    async archive_f () {
      try {
        const response = await this.$axios.get(`https://api.traininblocks.com/clients/${this.claims.sub}/archive`)
        this.archive.no_archive = response.data.length === 0
        localStorage.setItem('archive', JSON.stringify(response.data))
      } catch (e) {
        this.archive.no_archive = false
        this.error = e.toString()
      }
    },
    async client_archive (id, index) {
      if (await this.$refs.confirm_pop_up.show('Are you sure that you want to archive/hide this client?', 'Their data will be stored, but it will be removed if deleted from the Archive.')) {
        this.dontLeave = true
        const client = this.clients.find(client => client.client_id === id)
        const email = client.email
        this.clients.splice(index, 1)
        this.noClients = this.clients.length === 0
        try {
          this.response = await this.$axios.post(`https://api.traininblocks.com/clients/archive/${id}`).data
          const result = await this.$axios.post('/.netlify/functions/okta',
            {
              type: 'GET',
              url: `?filter=profile.email+eq+"${email}"&limit=1`
            }
          )
          if (result.data.length >= 1) {
            await this.$axios.post('/.netlify/functions/okta',
              {
                type: 'POST',
                body: {},
                url: `${result.data[0].id}/lifecycle/suspend`
              }
            )
            await this.$axios.post('/.netlify/functions/send-email',
              {
                to: email,
                subject: 'Account Deactivated',
                text: deleteEmailText(),
                html: deleteEmail()
              }
            )
          }
          this.helper('client_store', 'Client', 'archive')
          this.$refs.response_pop_up.show('Client archived', 'Their data will be kept safe on the archive page')
          this.$router.push('/')
        } catch (e) {
          this.resolve_error(e)
        }
      }
    },
    async client_unarchive (id) {
      this.dontLeave = true
      const client = this.archive.clients.find(client => client.client_id === id)
      const arr = JSON.parse(localStorage.getItem('clients'))
      arr.push(client)

      localStorage.setItem('clients', JSON.stringify(arr))
      this.clients = JSON.parse(localStorage.getItem('clients')).sort((a, b) => {
        const textA = a.name.toUpperCase()
        const textB = b.name.toUpperCase()
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0
      })
      this.archive.no_archive = this.archive.clients.length === 0
      try {
        const response = await this.$axios.post(`https://api.traininblocks.com/clients/unarchive/${id}`)
        this.response = response.data
        this.helper('client_store', 'Client', 'unarchive')
      } catch (e) {
        this.resolve_error(e)
      }
    },

    // GET METHODS

    async get_templates (force) {
      try {
        if (!localStorage.getItem('templates') || force || this.claims.user_type === 'Admin') {
          const response = await this.$axios.get(`https://api.traininblocks.com/templates/${this.claims.sub}`)
          localStorage.setItem('templates', JSON.stringify(response.data))
        }
        this.templates = JSON.parse(localStorage.getItem('templates'))
      } catch (e) {
        this.resolve_error(e)
      }
    },
    async get_portfolio (force) {
      try {
        if (!localStorage.getItem('portfolio') || force || this.claims.user_type === 'Admin') {
          let response
          if (this.claims.user_type === 'Trainer' || this.claims.user_type === 'Admin') {
            response = await this.$axios.get(`https://api.traininblocks.com/portfolio/${this.claims.sub}`)
            if (response.data.length === 0) {
              this.create_portfolio()
            } else {
              localStorage.setItem('portfolio', JSON.stringify(response.data[0]))
            }
          } else {
            const client = await this.$axios.get(`https://api.traininblocks.com/ptId/${this.claims.client_id_db}`)
            if (client.data[0].pt_id) {
              response = await this.$axios.get(`https://api.traininblocks.com/portfolio/${client.data[0].pt_id}`)
              if (response.data.length !== 0) {
                localStorage.setItem('portfolio', JSON.stringify(response.data[0]))
              }
            }
          }
        }
        this.portfolio = JSON.parse(localStorage.getItem('portfolio'))
        this.end_loading()
      } catch (e) {
        this.resolve_error(e)
      }
    },
    async create_portfolio () {
      this.dontLeave = true
      try {
        await this.$axios.put('https://api.traininblocks.com/portfolio',
          {
            pt_id: this.claims.sub,
            trainer_name: '',
            business_name: '',
            notes: ''
          }
        )
        await this.get_portfolio(true)
        this.end_loading()
      } catch (e) {
        this.resolve_error(e)
      }
    },
    async get_plans () {
      try {
        const plans = await this.$axios.get(`https://api.traininblocks.com/programmes/${this.claims.client_id_db}`)
        this.clientUser.plans = plans.data
        for (const i in this.clientUser.plans) {
          const response = await this.$axios.get(`https://api.traininblocks.com/workouts/${this.clientUser.plans[i].id}`)
          this.clientUser.plans[i].sessions = response.data
        }
      } catch (e) {
        this.resolve_error(e)
      }
    },
    async update_session (pid, sid, feedbackNotesUpdate) {
      const plan = this.clientUser.plans.find(plan => plan.id === pid)
      const session = plan.sessions.find(session => session.id === sid)
      const sessionId = session.id
      const sessionName = session.name
      const sessionChecked = session.checked
      const sessionFeedback = session.feedback
      try {
        await this.$axios.post('https://api.traininblocks.com/client-workouts',
          {
            id: sessionId,
            name: sessionName,
            checked: sessionChecked,
            feedback: feedbackNotesUpdate === undefined ? sessionFeedback : feedbackNotesUpdate
          }
        )
        this.$ga.event('Session', 'update')
        const client = await this.$axios.get(`https://api.traininblocks.com/ptId/${this.claims.client_id_db}`)
        if (client.data[0].notifications === 1) {
          if (sessionFeedback !== null) {
            const ptEmail = await this.$axios.post('/.netlify/functions/okta',
              {
                type: 'GET',
                url: `?filter=id+eq+"${client.data[0].pt_id}"&limit=1`
              }
            )
            await this.$axios.post('/.netlify/functions/send-email',
              {
                to: ptEmail.data[0].credentials.emails[0].value,
                subject: this.claims.email + ' has submitted feedback for ' + sessionName,
                text: feedbackEmailText(this.claims.client_id_db, pid),
                html: feedbackEmail(this.claims.client_id_db, pid)
              }
            )
          }
        }
        this.$refs.response_pop_up.show('Session updated', 'Your changes have been saved')
      } catch (e) {
        this.resolve_error(e)
      }
      this.end_loading()
    }
  }
}
</script>

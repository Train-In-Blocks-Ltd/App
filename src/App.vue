<style>
  @import './assets/styles/icon-anim';

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
  .section_a,
  .section_b {
    position: fixed;
    top: 0;
    right: 0;
    width: 0;
    background-color: rgba(255, 255, 255, .7);
    -webkit-backdrop-filter: blur(10px);
    backdrop-filter: blur(10px);
    transition: all .6s cubic-bezier(.165, .84, .44, 1)
  }
  .section_a {
    height: 50%
  }
  .section_b {
    height: 50%;
    top: 50%;
    transition-delay: .2s
  }
  .section_a.opened_sections,
  .section_b.opened_sections {
    width: 100%;
    z-index: 4
  }
  @supports not (backdrop-filter: blur(10px)) {
    .section_a, .section_b {
      background-color: white
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
    background-color: #F9F9F9
  }
  #app {
    color: #282828;
    background-color: #F9F9F9
  }
  main {
    margin-left: calc(38px + 2rem);
    display: grid;
    align-items: start
  }
  .notAuth {
    margin: 0
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
    background-color: #F9F9F9;
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
    overflow-y: auto
  }
  div.vm--modal > div,
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
  .text--large {
    margin-top: 0;
    /* stylelint-disable-next-line */
    font-size: 2.6rem!important;
    line-height: 1.2
  }
  .text--small {
    /* stylelint-disable-next-line */
    font-size: 1.6rem!important;
    line-height: 1.2
  }
  .text--error {
    font-size: .8rem;
    color: #B80000
  }
  .text--loading,
  .text--no_clients {
    margin: 2rem 0 4rem 0
  }
  .text--no-plans,
  .text--no_sessions {
    margin: 2rem 0 8rem 0
  }
  .text--new_msg {
    margin: 2rem 0
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
    transition: .6s all cubic-bezier(.165, .84, .44, 1)
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
    border: 1px solid #282828
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
    color: #28282894
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
    color: #282828;
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
    color: white;
    background-color: #282828;
    transition: color .6s, background-color .6s, opacity .2s, transform .1s cubic-bezier(.165, .84, .44, 1)
  }
  button:hover:not(:disabled) {
    opacity: .6
  }
  button:active:not(:disabled) {
    transform: scale(.96)
  }
  button:focus {
    box-shadow: 0 0 0 4px rgba(76, 91, 106, .5)
  }
  button:disabled,
  button[disabled] {
    cursor: default;
    opacity: .6
  }
  .delete:hover,
  .cancel:hover {
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
  .bottom_bar {
    display: flex;
    padding: .6rem 0;
    margin-top: 1rem;
    z-index: 1
  }
  .bottom_bar button {
    margin-right: .4rem
  }
  .done {
    background-color: green
  }
  .to_do {
    background-color: #B80000
  }
  .done,
  .to_do {
    color: white;
    margin: auto 0
  }
  .done:hover,
  .to_do:hover {
    opacity: .6
  }

  /* Inputs */
  input:not([type=checkbox]):not([type=radio]):not([type=color]):not([type=button]):not([type=submit]), select {
    outline: none;
    -moz-appearance: none;
    -webkit-appearance: none;
    width: 100%;
    padding: .6rem;
    resize: none;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 1rem;
    border: 1px solid #28282840;
    border-radius: 8px;
    background-color: transparent;
    box-shadow: none;
    transition: all .6s cubic-bezier(.165, .84, .44, 1)
  }
  input:not([type=checkbox]):not([type=radio]):not([type=color]):not([type=button]):not([type=submit]):not(:focus):hover,
  select:hover {
    opacity: .6
  }
  input:not([type=checkbox]):not([type=radio]):not([type=color]):not([type=button]):not([type=submit]):disabled {
    cursor: not-allowed;
    opacity: .6
  }
  input:not([type=checkbox]):not([type=radio]):not([type=color]):not([type=button]):not([type=submit]):focus {
    border: 1px solid #282828
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
    transition: all .4s cubic-bezier(.165, .84, .44, 1)
  }
  ::placeholder {
    color: #28282899;
    opacity: 1; /* Firefox */
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
  svg.logo_svg path {
    fill: #28282890;
    transition: all .6s cubic-bezier(.165, .84, .44, 1)
  }
  .sidebar:hover svg.logo_svg path {
    fill: #282828
  }

  /* Navigation */
  .sidebar {
    z-index: 10;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 2rem 1rem;
    position: fixed;
    background-color: white;
    box-shadow: 0 0 20px 10px #28282808;
    transition: width .6s cubic-bezier(.165, .84, .44, 1)
  }
  .account_nav_item {
    display: flex;
    opacity: .6;
    cursor: pointer;
    font-size: 1rem;
    margin: .8rem 0;
    transition: all 1s cubic-bezier(.165, .84, .44, 1)
  }
  .account_nav_item:hover,
  .sidebar:hover .account_nav_item--text,
  .account_nav_item a.router-link-exact-active {
    opacity: 1
  }
  .account_nav_item:last-of-type {
    padding-bottom: 0
  }
  .account_nav_item a {
    display: flex;
    text-decoration: none
  }
  .account_nav_item--text {
    user-select: none;
    color: #282828;
    text-decoration: none;
    position: relative;
    border: 0;
    opacity: 0;
    transition: all .6s cubic-bezier(.165, .84, .44, 1)
  }
  .account_nav_item--icon {
    margin: 0 .4rem 0 0;
    height: 1.4rem;
    vertical-align: bottom;
    transition: all 1s cubic-bezier(.165, .84, .44, 1)
  }
  .account_nav_item--icon:not(.transparent) path {
    fill: #282828
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
    background-color: white;
    box-shadow: 0 0 20px 10px #28282808;
    transition: all 1s cubic-bezier(.165, .84, .44, 1)
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
    transition: all 1s cubic-bezier(.165, .84, .44, 1)
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
    background-color: #28282821
  }
  ::-webkit-scrollbar-thumb {
    border-radius: 3px;
    background-color: #28282890
  }
  ::-webkit-scrollbar-thumb:hover {
    background-color: #28282860
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

  /* Multi-select */
  .multi-select {
    display: grid;
    grid-gap: .4rem;
    position: fixed;
    top: 0;
    right: 0;
    text-align: right;
    background-color: white;
    box-shadow: 0 0 20px 10px #28282808;
    width: 100%;
    z-index: 9;
    padding: 2rem;
    justify-items: end
  }

  /* Links */
  .client_link_wrapper {
    text-decoration: none
  }
  .client_link,
  .plan_link {
    display: grid;
    padding: 2rem;
    grid-gap: 1rem;
    font-weight: 400;
    color: #282828;
    text-decoration: none;
    box-shadow: 0 0 20px 10px #28282808;
    background-color: white;
    border-radius: 10px;
    transition: all .6s cubic-bezier(.165, .84, .44, 1)
  }
  .client_link:hover,
  .plan_link:hover {
    box-shadow: 0 0 20px 10px #28282816
  }
  .client_link__notes__content,
  .plan_link__notes__content {
    font-size: .8rem;
    margin-top: .4rem
  }
  .client_link__notes__content *,
  .plan_link__notes__content *,
  .plan-name {
    color: #282828;
    transition: all .6s cubic-bezier(.165, .84, .44, 1)
  }
  .client_link__notes__content p,
  .plan_link__notes__content p {
    margin: .4rem 0
  }
  .client_name,
  .plan-name {
    margin: 0
  }
  .client_link__notes__content h1,
  .client_link__notes__content h2,
  .plan_link__notes__content h1,
  .plan_link__notes__content h2 {
    font-size: 1rem
  }
  .client_link__notes__content img,
  .client_link__notes__content iframe,
  .plan_link img,
  .plan_link iframe {
    margin: 1rem 0;
    max-width: 500px;
    border-radius: 3px;
    opacity: .6;
    transition: all .6s cubic-bezier(.165, .84, .44, 1)
  }
  .client_link .client_link__notes__content img,
  .client_link .client_link__notes__content iframe,
  .client_link .client_link__notes__content a,
  .plan_link img,
  .plan_link iframe,
  .plan_link a {
    display: none
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
    .button:hover {
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
  }
  @media (min-width: 769px) {
    .sidebar {
      top: 0;
      height: 100vh;
      width: calc(38px + 2rem)
    }
    .sidebar:hover {
      width: 12rem
    }
    .client_link.archived {
      display: flex;
      justify-content: space-between
    }
  }
  @media (max-width: 768px) {

    /* Containers */
    .center_wrapped {
      width: 300px
    }
    .client_link:hover,
    .plan_link:hover {
      box-shadow: 0 0 20px 10px #28282808
    }
    .client_link:active,
    .plan_link:active {
      transform: scale(.99)
    }
    .tab_overlay_content {
      padding: 4rem 10vw 10rem 10vw
    }

    /* Sidebar */
    .logo {
      display: none
    }
    .sidebar {
      bottom: 0;
      width: 100vw;
      flex-direction: row;
      padding: 0;
      justify-content: space-between;
      border-right: none
    }
    .sidebar:hover .account_nav_item--text {
      display: none
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
    .account_nav_item {
      width: 100%;
      margin: 0;
      padding: 0
    }
    .account_nav_item a {
      width: 100%;
      height: 4rem
    }
    .account_nav_item--text {
      display: none
    }
    .account_nav_item--icon {
      margin: .8rem auto
    }
  }

  @media (max-width: 576px) {

    /* Elements */
    ::-webkit-scrollbar {
      width: 0;
      background-color: transparent
    }
    p, li {
      font-size: .8rem
    }
    .text--large {
      font-size: 2rem
    }
    .text--small {
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
    .sidebar {
      width: 12rem
    }
    .account_nav_item--text {
      opacity: 1
    }
    .fadeIn, .fadeOut {
      animation: none
    }
  }

  /* Print */
  @media print {
    a,
    button,
    svg,
    video,
    iframe,
    .sidebar,
    .wrapper--floating_nav,
    .tab_option,
    .wrapper--progress-bar,
    .expand-all,
    .plan_table,
    .change_week_color {
      display: none
    }
    #client .client_info input:not([type='submit']) {
      border: none;
      padding: 0
    }
  }

  /* Progress */
  #nprogress .bar {
    background: #282828 !important
  }
  #nprogress .peg {
    box-shadow: 0 0 10px #282828, 0 0 5px #282828 !important
  }
  #nprogress .spinner-icon {
    border-top-color: #282828 !important;
    border-left-color: #282828 !important
  }
</style>

<template>
  <!-- Container with class authenticated and setting color css variables -->
  <div id="app" :class="{'authenticated': authenticated}">
    <modal name="error" height="100%" width="100%" :adaptive="true" :click-to-close="false">
      <div class="modal--error">
        <div class="center_wrapped">
          <p>Something went wrong, please try that again</p>
          <p class="grey">
            This problem has been reported to our developers
          </p>
          <br>
          <p>{{ errorMsg }}</p><br>
          <button class="cancel" @click="$modal.hide('error'), will_body_scroll(true)">
            Close
          </button>
        </div>
      </div>
    </modal>
    <nav v-if="authenticated && claims" class="sidebar">
      <div class="logo">
        <router-link v-if="claims.user_type === 'Trainer' || claims.user_type == 'Admin'" to="/" class="logo_link" title="Home">
          <inline-svg :src="require('./assets/svg/logo-icon.svg')" class="logo_svg fadeIn" aria-label="Home" />
        </router-link>
        <router-link v-if="claims.user_type === 'Client'" to="/clientUser" class="logo_link" title="Home">
          <inline-svg :src="require('./assets/svg/logo-icon.svg')" class="logo_svg fadeIn" aria-label="Home" />
        </router-link>
      </div> <!-- .logo -->
      <div class="account_nav_item">
        <router-link
          v-if="claims.user_type === 'Trainer' || claims.user_type == 'Admin'"
          to="/"
          title="Home"
        >
          <inline-svg :src="require('./assets/svg/home.svg')" class="account_nav_item--icon fadeIn" aria-label="Home" />
          <p class="account_nav_item--text">
            Home
          </p>
        </router-link>
        <router-link
          v-else-if="claims.user_type === 'Client'"
          to="/clientUser"
          title="Home"
        >
          <inline-svg :src="require('./assets/svg/home.svg')" class="account_nav_item--icon fadeIn" aria-label="Home" />
          <p class="account_nav_item--text">
            Home
          </p>
        </router-link>
      </div>
      <div
        v-if="claims.user_type === 'Admin'"
        class="account_nav_item"
      >
        <router-link
          to="/clientUser"
          title="Client Home"
        >
          <inline-svg :src="require('./assets/svg/home.svg')" class="account_nav_item--icon fadeIn" aria-label="Client Home" />
          <p class="account_nav_item--text">
            Client
          </p>
        </router-link>
      </div>
      <div
        v-if="claims.user_type === 'Trainer' || claims.user_type == 'Admin'"
        class="account_nav_item"
      >
        <a href="https://traininblocks.com/help" target="_blank" rel="noopener" title="Help">
          <inline-svg :src="require('./assets/svg/help-desk.svg')" class="account_nav_item--icon fadeIn" aria-label="Help" />
          <p class="account_nav_item--text">
            Help
          </p>
        </a>
      </div>
      <div
        v-if="claims.user_type === 'Trainer' || claims.user_type == 'Admin'"
        class="account_nav_item"
      >
        <router-link to="/templates" title="Templates">
          <inline-svg :src="require('./assets/svg/template.svg')" class="account_nav_item--icon fadeIn" aria-label="Templates" />
          <p class="account_nav_item--text">
            Templates
          </p>
        </router-link>
      </div>
      <div
        v-if="claims.user_type === 'Trainer' || claims.user_type == 'Admin'"
        class="account_nav_item"
      >
        <router-link to="/portfolio" title="Portfolio">
          <inline-svg :src="require('./assets/svg/portfolio.svg')" class="account_nav_item--icon fadeIn" aria-label="Portfolio" />
          <p class="account_nav_item--text">
            Portfolio
          </p>
        </router-link>
      </div>
      <div
        v-if="claims.user_type === 'Trainer' || claims.user_type == 'Admin'"
        class="account_nav_item"
      >
        <router-link to="/archive" title="Archive">
          <inline-svg :src="require('./assets/svg/archive.svg')" class="account_nav_item--icon fadeIn" aria-label="Archive" />
          <p class="account_nav_item--text">
            Archive
          </p>
        </router-link>
      </div>
      <div
        v-if="claims.user_type === 'Trainer' || claims.user_type == 'Admin'"
        class="account_nav_item"
      >
        <router-link to="/account" title="Account">
          <inline-svg :src="require('./assets/svg/account.svg')" class="account_nav_item--icon fadeIn" aria-label="Account" />
          <p class="account_nav_item--text">
            Account
          </p>
        </router-link>
      </div>
      <div class="account_nav_item">
        <router-link to="/logout" title="Logout" @click.native="logout()">
          <inline-svg :src="require('./assets/svg/logout.svg')" class="account_nav_item--icon fadeIn" aria-label="Logout" />
          <p class="account_nav_item--text">
            Logout
          </p>
        </router-link>
      </div>
    </nav> <!-- .sidebar -->
    <main id="main" :class="{notAuth: !authenticated}">
      <transition enter-active-class="fadeIn fill_mode_both delay" leave-active-class="fadeOut fill_mode_both">
        <router-view :key="$route.fullPath" />
      </transition>
    </main>
  </div>
</template>

<script>
import { deleteEmail, deleteEmailText, feedbackEmail, feedbackEmailText } from './components/email'

export default {
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
      no_clients: false,
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

      versionName: 'Pegasus',
      versionBuild: '3.0',
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
    '$route' (to, from) {
      this.is_authenticated()
    }
  },
  async created () {
    this.is_authenticated()
    this.will_body_scroll(false)
    this.$axios.defaults.headers.common.Authorization = `Bearer ${await this.$auth.getAccessToken()}`
  },
  async mounted () {
    window.addEventListener('beforeunload', this.confirmLeave)
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

    // AUTH

    async is_authenticated () {
      this.authenticated = await this.$auth.isAuthenticated()
    },
    async logout () {
      await this.$auth.logout()
      await this.is_authenticated()
      localStorage.clear()
      localStorage.setItem('versionBuild', this.versionBuild)
      const cookies = document.cookie.split(';')
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i]
        const eqPos = cookie.indexOf('=')
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie
        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT'
      }
      this.$ga.event('Auth', 'logout')
    },
    async setup () {
      this.claims = JSON.parse(localStorage.getItem('claims'))
      if (this.claims) {
        if (this.claims.ga === undefined || this.claims === undefined || this.claims === null) {
          this.claims.ga = true
        }
        this.claims.ga !== false ? this.$ga.enable() : this.$ga.disable()
      }
      this.$axios.defaults.headers.common.Authorization = `Bearer ${await this.$auth.getAccessToken()}`
      await this.clients_to_vue()
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
      this.loading = false
      this.dontLeave = false
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

    // OTHER SHARED METHODS

    will_body_scroll (state) {
      const body = document.getElementsByTagName('body')[0]
      state ? body.style.overflow = 'auto' : body.style.overflow = 'hidden'
    },
    confirmLeave (e) {
      if (this.dontLeave) {
        const msg = 'Your changes might not be saved, are you sure you want to leave?'
        e.returnValue = msg
        return msg
      }
    },
    sort_sessions_plan () {
      const plan = this.clientUser.plans.find(plan => plan.id === parseInt(this.$route.params.id))
      plan.sessions.sort((a, b) => {
        return new Date(a.date) - new Date(b.date)
      })
    },
    day (date) {
      const weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      return weekday[new Date(date).getDay()]
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
    },
    async clients_f () {
      try {
        const response = await this.$axios.get(`https://api.traininblocks.com/clients/${this.claims.sub}`)
        this.no_clients = response.data.length === 0
        localStorage.setItem('clients', JSON.stringify(response.data))
      } catch (e) {
        this.no_clients = false
        this.resolve_error(e)
      }
    },
    async client_delete (id) {
      this.dontLeave = true
      try {
        await this.$axios.delete(`https://api.traininblocks.com/clients/${id}`)
        this.helper('client_end', 'Client', 'delete')
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
      if (confirm('Are you sure you want to archive this client?')) {
        this.dontLeave = true
        const client = this.clients.find(client => client.client_id === id)
        const email = client.email
        this.clients.splice(index, 1)
        this.no_clients = this.clients.length === 0
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
          this.$router.push('/')
        } catch (e) {
          this.resolve_error(e)
        }
      }
    },
    async client_unarchive (id) {
      if (confirm('Are you sure you want to unarchive this client?')) {
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
          this.dontLeave = true
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
      this.dontLeave = true
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
      } catch (e) {
        this.resolve_error(e)
      }
      this.end_loading()
    }
  }
}
</script>

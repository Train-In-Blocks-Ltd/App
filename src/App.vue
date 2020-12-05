<style>
  @import './assets/styles/icon-anim';

  /* Global */
  * {
    box-sizing: border-box
  }
  :root {
    --animate-delay: .5s;
    --animate-duration: 1s;
    --animate-repeat: 1
  }

  /* ANIMATIONS */
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
  .section--a, .section--b {
    position: fixed;
    top: 0;
    right: 0;
    width: 0;
    background-color: #F4F4F4;
    transition: all .6s cubic-bezier(.165, .84, .44, 1)
  }
  .section--a {
    height: 50%
  }
  .section--b {
    height: 50%;
    top: 50%;
    transition-delay: .2s
  }
  .section--a.openedSections,  .section--b.openedSections {
    width: 100%;
    z-index: 4
  }

  /* SPLASH */
  #splash {
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
    border-radius: 40%;
    animation: spin 5s forwards
  }
  .box .logo--svg {
    height: 50%;
    width: auto
  }
  .box svg.logo--svg path {
    fill: white
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

  /* ELEMENTS */
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

  /* CONTAINERS */
  #home, #client, #account, #archive, .wrapper--client, #logout, #templates, #client-plan, #portfolio {
    padding: 2rem 10vw
  }
  .flex {
    display: flex
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
  #chart {
    height: 80vh;
    position: relative;
    margin: 4rem 0
  }
  .wrapper--new_client, .wrapper--install_PWA, .wrapper--whats_new, .wrapper--new_plan, .wrapper--portfolio {
    position: fixed;
    padding: 4rem 20vw 10rem calc(2rem + 38px + 20vw);
    top: 0;
    left: 0;
    z-index: 5;
    height: 100%;
    width: 100%
  }
  .wrapper--client_link {
    text-decoration: none
  }
  .allow_y_overflow {
    overflow-y: auto
  }

  /* MODALS */
  .modal--info, .modal--move, .modal--copy, .modal--shift, .modal--reset, .modal--error, .modal--new_client, .modal--new_plan, .modal--toolkit, .modal--alert, .modal--preview_template {
    padding: 2rem;
    display: flex;
    height: 100%
  }
  div.vm--modal {
    /* stylelint-disable-next-line */
    left: 0!important;
    min-width: 100%
  }
  .modal--bottom_bar {
    display: flex
  }
  .modal--bottom_bar button {
    margin-right: .6rem
  }

  /* SVG */
  .title_icon {
    margin: auto .6rem auto 0
  }

  /* FONTS */
  .text--large {
    margin-top: 0;
    font-size: 2.6rem;
    line-height: 1.2
  }
  .text--small {
    font-size: 1.6rem;
    line-height: 1.2
  }
  .grey {
    color: #28282894
  }
  .no_margin {
    margin: 0
  }
  h3 {
    font-size: 2rem;
    line-height: 1.2
  }
  p {
    margin: 0
  }
  .allow_text_overflow {
    text-overflow: ellipsis
  }
  .text--error {
    font-size: .8rem;
    color: #B80000
  }
  .text--no_client_notes, .text--no_plan_notes {
    margin: 2rem 0
  }
  .text--loading, .text--no_clients {
    margin: 2rem 0 4rem 0
  }
  .text--no-plans, .text--no_sessions {
    margin: 2rem 0 8rem 0
  }
  .text--no_content {
    margin: 1rem 0
  }

  /* BUTTONS */
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
    color: white;
    background-color: #282828;
    margin: .6rem 0;
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
  button:disabled, button[disabled] {
    opacity: .6
  }
  .delete:hover, .cancel:hover {
    color: white;
    background-color: #B80000
  }
  button.opposite {
    border: 2px solid #282828;
    color: #282828;
    background-color: transparent
  }
  button.opposite:not(:disabled):hover {
    color: white;
    background-color: #282828
  }

  /* SEARCH */
  .search {
    border: none;
    outline-width: 0;
    width: 80%;
    border-bottom: 2px solid #282828;
    padding: .6rem 0;
    opacity: .6;
    margin: .5rem auto 4rem 0;
    transition: all .4s cubic-bezier(.165, .84, .44, 1)
  }
  .search:hover {
    width: 100%;
    opacity: 1
  }
  .search:focus {
    width: 100%;
    opacity: 1
  }

  /* CALENDAR */
  div.fc-toolbar h2 {
    font-weight: lighter;
    font-size: 1.6rem
  }
  button.fc-button {
    border-radius: 3px;
    text-transform: capitalize;
    font-size: .8rem;
    background-color: #282828;
    color: white
  }
  button.fc-button-primary:disabled {
    background-color: #282828
  }
  .fc-view.fc-dayGridMonth-view.fc-dayGrid-view * {
    border-color: transparent
  }
  .fc-scroller.fc-day-grid-container {
    /* stylelint-disable-next-line */
    height: auto!important;
    /* stylelint-disable-next-line */
    overflow: hidden!important
  }
  .fc-row.fc-week.fc-widget-content {
    /* stylelint-disable-next-line */
    height: auto!important
  }
  .fc-view-container span {
    font-size: .8rem
  }

  /* QUILL WRAPPERS */
  .wrapper--session__header {
    height: 6.4rem
  }
  .text--name {
    text-overflow: ellipsis;
    white-space: nowrap
  }
  .text--date, .text--checked {
    font-size: .8rem
  }
  .bottom_bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: .6rem 0;
    margin-top: 1rem;
    z-index: 1
  }
  #button_done {
    background-color: green
  }
  #button_to_do {
    background-color: #B80000
  }
  #button_done, #button_to_do {
    color: white;
    margin: auto 0
  }
  #button_done:hover, #button_to_do:hover {
    opacity: .6
  }

  /* SHOW AND NOTES */
  .show_session, .show_plan_notes, .show_client_notes, .show_template {
    outline-width: 0;
    overflow-wrap: break-word;
    line-height: 1.42;
    overflow-y: auto;
    transition: all 1s
  }
  .show_session img, .show_plan_notes img, .show_client_notes img, .show_template img,.show_session iframe, .show_plan_notes iframe, .show_client_notes iframe, .show_template iframe {
    border-radius: 3px;
    max-width: 80%;
    margin: 1rem 0
  }
  .show_session a, .show_plan_notes a, .show_client_notes a, .show_template a {
    color: blue
  }
  .show_session ul, .show_session ol, .show_plan_notes ul, .show_plan_notes ol, .show_client_notes ul, .show_client_notes ol, .show_template ul, .show_template ol {
    text-decoration: none;
    margin: 0
  }
  .show_session p, .show_client_notes p, .show_plan_notes p, .show_template p {
    margin: 1rem 0
  }
  .wrapper--session__header.client-side {
    height: 3.2rem
  }

  /* RM IOS CORNERS */
  input:not([type=checkbox]) {
    border-radius: 0;
    -webkit-appearance: none
  }

  /* INPUTS */
  .input--modal {
    width: 4rem
  }
  .input--forms, .input--toolkit, .input--modal {
    padding: .4rem;
    font-size: 1rem;
    background-color: transparent;
    border: none;
    border-bottom: 1px solid #282828
  }
  input:not([type=checkbox]):not([type=radio]):not([type=color]):not([type=search]):not([type=submit]) {
    resize: none;
    font-family: Arial, Helvetica, sans-serif
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

  /* FORMS */
  .form_grid {
    display: grid;
    grid-template-columns: 1fr;
    margin: auto;
    max-width: 300px
  }
  .form_buttons {
    display: grid;
    grid-gap: 1rem;
    place-content: start;
    grid-auto-flow: column;
    margin-bottom: 1rem
  }
  .wrapper--centered-item {
    margin: auto;
    max-width: 500px
  }

  /* LOGO */
  .logo {
    margin-bottom: auto
  }
  .logo--link {
    display: block;
    width: 38px;
    transition: 1s all cubic-bezier(.165, .84, .44, 1)
  }
  svg.logo--svg path {
    fill: #28282890;
    transition: all .6s cubic-bezier(.165, .84, .44, 1)
  }
  .sidebar:hover svg.logo--svg path {
    fill: #282828
  }
  .logo--link:hover {
    opacity: .6
  }
  .logo--link:active {
    transform: scale(.9)
  }

  /* NAV */
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
    background-color: white;
    box-shadow: 0 0 20px 10px #28282808;
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
    color: #282828;
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
    opacity: 1
  }
  .account_nav--item--icon {
    margin: 0 .4rem 0 0;
    height: 1.4rem;
    vertical-align: bottom;
    transition: all 1s cubic-bezier(.165, .84, .44, 1)
  }
  .account_nav--item--icon:not(.transparent) path {
    fill: #282828
  }

  /* EXTRA OPTIONS */
  .icon_open--options, .icon_open--stats, .icon_open--new_client, .icon_open--install_PWA, .icon_open--whats_new, .icon_open--new_plan, .icon_open--print, .icon_open--portfolio {
    user-select: none;
    z-index: 2;
    display: flex;
    cursor: pointer;
    position: fixed;
    right: 0;
    top: 2rem;
    width: calc(3rem);
    padding: .4rem 1rem .4rem .6rem;
    border-radius: 3px 0 0 3px;
    background-color: #F4F4F4;
    transition: all 1s cubic-bezier(.165, .84, .44, 1)
  }
  div.icon_open--stats, div.icon_open--whats_new, .icon_open--new_plan {
    top: 4.4rem
  }
  div.icon_open--install_PWA, div.icon_open--print {
    top: 6.8rem
  }
  .icon_open--options:hover, .icon_open--stats:hover, .icon_open--install_PWA:hover, div.icon_open--print:hover, div.icon_open--portfolio:hover {
    width: 6rem;
    justify-content: center;
    text-align: center
  }
  .icon_open--new_client:hover, .icon_open--whats_new:hover, .icon_open--new_plan:hover {
    width: 8rem;
    justify-content: center;
    text-align: center
  }
  .icon_open--options:hover svg, .icon_open--stats:hover svg, .icon_open--new_client:hover svg, .icon_open--install_PWA:hover svg, .icon_open--whats_new:hover svg, .icon_open--new_plan:hover svg, .icon_open--print:hover svg, .icon_open--portfolio:hover svg {
    display: none
  }
  .icon_open--options .text, .icon_open--stats .text, .icon_open--new_client .text, .icon_open--install_PWA .text, .icon_open--whats_new .text, .icon_open--new_plan .text, .icon_open--print .text, .icon_open--portfolio .text {
    font-size: .8rem;
    display: none;
    white-space: nowrap;
    transition: all 1s cubic-bezier(.165, .84, .44, 1)
  }
  .icon_open--options:hover .text, .icon_open--stats:hover .text, .icon_open--new_client:hover .text, .icon_open--install_PWA:hover .text, .icon_open--whats_new:hover .text, .icon_open--new_plan:hover .text, .icon_open--print:hover .text, .icon_open--portfolio:hover .text {
    display: block
  }

  /* SCROLLBAR */
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

  /* ARCHIVE AND HOME STYLES */
  .container--clients {
    display: grid;
    grid-gap: 2rem
  }
  .client_container p {
    margin: 0
  }

  /* SELECT */
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
    padding: 2rem
  }
  .multi-select a, .a--preview_template {
    color: #282828;
    text-decoration: none;
    transition: all .6s cubic-bezier(.165, .84, .44, 1)
  }
  .multi-select a:hover, .a--preview_template {
    opacity: .6
  }
  .text--selected {
    font-size: .8rem
  }

  /* LINK CONTAINERS */
  .client_link, .plan_link {
    content-visibility: auto;
    display: grid;
    padding: 2rem;
    grid-gap: 1rem;
    font-weight: 400;
    color: #282828;
    text-decoration: none;
    box-shadow: 0 0 20px 10px #28282808;
    border-radius: 3px;
    transition: all .6s cubic-bezier(.165, .84, .44, 1)
  }
  .client_link:hover, .plan_link:hover {
    box-shadow: 0 0 20px 10px #28282816
  }
  .client_link__notes__content, .plan_link__notes__content {
    font-size: .8rem;
    margin-top: .4rem
  }
  .client_link__notes__content *, .plan_link__notes__content *, .plan-name {
    color: #282828;
    transition: all .6s cubic-bezier(.165, .84, .44, 1)
  }
  .client_link__notes__content p, .plan_link__notes__content p {
    margin: .4rem 0
  }
  .client_name, .plan-name {
    margin: 0
  }
  .client_link__notes__content h1, .plan_link__notes__content h1, .client_link__notes__content h2, .plan_link__notes__content h2 {
    font-size: 1rem
  }
  .client_link__notes__content img, .plan_link img, .client_link__notes__content iframe, .plan_link iframe {
    margin: 1rem 0;
    max-width: 500px;
    border-radius: 3px;
    opacity: .6;
    transition: all .6s cubic-bezier(.165, .84, .44, 1)
  }
  .client_link:hover .client_link__notes__content img, .plan_link:hover img, .client_link:hover .client_link__notes__content iframe, .plan_link:hover iframe {
    opacity: 1
  }

  /* CLIENT-SIDE */
  .container--session-control {
    display: flex;
    justify-content: space-between
  }
  .session-counter {
    align-self: center;
    font-size: 1rem
  }

  /* Responsive Design */
  @media (max-width: 992px) {
    #home, #client, #account, #archive, .wrapper--client, #logout, #templates, #client-plan, #portfolio {
      padding: 4rem 10vw
    }
    button:not(:disabled):hover, .button:hover, button.fc-today-button.fc-button.fc-button-primary:not(:disabled):hover, button.fc-prev-button.fc-button.fc-button-primary:hover, button.fc-next-button.fc-button.fc-button-primary:hover, button.fc-dayGridWeek-button.fc-button.fc-button-primary:hover, button.fc-dayGridMonth-button.fc-button.fc-button-primary:hover {
      opacity: 1
    }
    #line-chart {
      padding: 0
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
    .title_icon {
      height: 48px;
      width: 48px
    }
    .client_link.archived {
      display: flex;
      justify-content: space-between
    }
  }
  @media (max-width: 768px) {
    /* Containers */
    .show_session img, .show_plan_notes img, .show_client_notes img, .show_template img {
      max-width: 100%
    }
    .client_link:hover, .plan_link:hover {
      box-shadow: 0 0 20px 10px #28282808
    }
    .client_link:active, .plan_link:active {
      transform: scale(.99)
    }
    .client_link__notes__content img, .plan_link img {
      max-width: 100%
    }
    .wrapper--new_client, .wrapper--install_PWA, .wrapper--whats_new, .wrapper--new_plan, .wrapper--portfolio {
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
      padding: 1rem 1rem 2.4rem 1rem;
      justify-content: space-between;
      border-right: none
    }
    .sidebar:hover .account_nav--item--text {
      display: none
    }
    main {
      margin: 0
    }
    #home, #client, #account, #archive, .wrapper--client, #logout, #templates, #client-plan, #portfolio {
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
    p, li {
      font-size: .8rem
    }
    .text--large {
      font-size: 2rem
    }
    .text--small {
      font-size: 1.2rem
    }
    .button--state, .button--feedback {
      width: 100%
    }
    .wrapper--centered-item {
      max-width: 300px
    }
    .wrapper--calendar {
      margin: 2rem 0
    }

    /* Plans Page */
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
    div.fc-toolbar h2 {
      font-size: 1rem
    }
  }

  /* REDUCED MOTION */
  @media (prefers-reduced-motion: reduce) {
    button:active, .button:active {
      transform: scale(1)
    }
    .search, .client_container > a:before, .ql-editor, .show_client_notes, .show_plan_notes,.show_session, div.wrapper--client, .icon--expand, .icon_open--options, .icon_open--stats, .icon_open--new_client, .icon_open--install_PWA, .icon_open--new_plan {
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

  /* PRINT MEDIA */
  @media print {
    .sidebar, .wrapper--floating_nav, .icon_open--stats, .icon_open--print, .wrapper--progress-bar, a, button, input[type='checkbox'], input[type='color'], svg, .expand-all, .plan_table, video, iframe {
      display: none
    }
    #client .client_info input:not([type='submit']) {
      border: none;
      padding: 0
    }
    .fc-view-container {
      width: 100vw
    }
    .fc-view.fc-dayGridMonth-view.fc-dayGrid-view, div.fc-view.fc-dayGridWeek-view.fc-dayGrid-view {
      width: 100vw
    }
  }
</style>
<template>
  <!-- Container with class authenticated and setting color css variables -->
  <div id="app" v-bind:class="{'authenticated': authenticated}">
    <modal name="error" height="100%" width='100%' :adaptive="true" :clickToClose="false">
      <div class="modal--error">
        <div class="wrapper--centered-item">
          <p><b>Something went wrong. Please try again...</b></p><br>
          <p>{{errorMsg}}</p><br>
          <div class="modal--bottom_bar">
            <form action="https://traininblocks.atlassian.net/servicedesk/customer/portal/3/group/4/create/22">
              <button type="submit" formtarget="_blank">Let us know</button>
            </form>
            <button class="cancel" @click="$modal.hide('error'), willBodyScroll(true)">Close</button> 
          </div>
        </div>
      </div>
    </modal>
    <loading :active.sync="pause_loading" :is-full-page="true" :loader="'bars'" :color="'#282828'"/>
    <a class="skip-to-content-link" href="#main">
      Skip to content
    </a>
    <nav class="sidebar" v-if="authenticated && claims && splashed">
      <div class="logo">
        <router-link to="/" class="logo--link" title="Home" v-if="claims.user_type === 'Trainer' || claims.user_type == 'Admin'">
          <inline-svg :src="require('./assets/svg/logo-icon.svg')" class="logo--svg" aria-label="Home"/>
        </router-link>
        <router-link to="/clientUser" class="logo--link" title="Home" v-if="claims.user_type === 'Client'">
          <inline-svg :src="require('./assets/svg/logo-icon.svg')" class="logo--svg" aria-label="Home"/>
        </router-link>
      </div> <!-- .logo -->
      <div class="account_nav--item">
        <router-link
          v-if="claims.user_type === 'Trainer' || claims.user_type == 'Admin'"
          to="/"
          title="Home"
        >
          <inline-svg :src="require('./assets/svg/home.svg')" class="account_nav--item--icon" aria-label="Home"/>
          <p class="account_nav--item--text">
            Home
          </p>
        </router-link>
        <router-link
          v-if="claims.user_type === 'Client'"
          to="/clientUser"
          title="Home"
        >
          <inline-svg :src="require('./assets/svg/home.svg')" class="account_nav--item--icon" aria-label="Home"/>
          <p class="account_nav--item--text">
            Home
          </p>
        </router-link>
      </div>
      <div
        v-if="claims.user_type === 'Trainer' || claims.user_type == 'Admin'"
        class="account_nav--item"
      >
        <a href="https://traininblocks.atlassian.net/servicedesk/customer/portal/3" target="_blank" rel="noopener" title="Help" >
          <inline-svg :src="require('./assets/svg/help-desk.svg')"  class="account_nav--item--icon" aria-label="Help"/>
          <p class="account_nav--item--text">
            Help
          </p>
        </a>
      </div>
      <div
        v-if="claims.user_type === 'Trainer' || claims.user_type == 'Admin'"
        class="account_nav--item"
      >
        <router-link to="/templates" title="Templates">
          <inline-svg :src="require('./assets/svg/template.svg')" class="account_nav--item--icon" aria-label="Templates"/>
          <p class="account_nav--item--text">
            Templates
          </p>
        </router-link>
      </div>
      <div
        v-if="claims.user_type === 'Trainer' || claims.user_type == 'Admin'"
        class="account_nav--item"
      >
        <router-link to="/portfolio" title="Portfolio">
          <inline-svg :src="require('./assets/svg/portfolio.svg')" class="account_nav--item--icon" aria-label="Portfolio"/>
          <p class="account_nav--item--text">
            Portfolio
          </p>
        </router-link>
      </div>
      <div
        v-if="claims.user_type === 'Trainer' || claims.user_type == 'Admin'"
        class="account_nav--item"
      >
        <router-link to="/archive" title="Archive">
          <inline-svg :src="require('./assets/svg/archive.svg')" class="account_nav--item--icon" aria-label="Archive"/>
          <p class="account_nav--item--text">
            Archive
          </p>
        </router-link>
      </div>
      <div
        v-if="claims.user_type === 'Trainer' || claims.user_type == 'Admin'"
        class="account_nav--item"
      >
        <router-link to="/account" title="Account">
          <inline-svg :src="require('./assets/svg/account.svg')" class="account_nav--item--icon" aria-label="Account"/>
          <p class="account_nav--item--text">
            Account
          </p>
        </router-link>
      </div>
      <div class="account_nav--item">
        <router-link to="/logout" @click.native="logout()" title="Logout">
          <inline-svg :src="require('./assets/svg/logout.svg')" class="account_nav--item--icon" aria-label="Logout"/>
          <p class="account_nav--item--text">
            Logout
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
import {deleteEmail, deleteEmailText, feedbackEmail, feedbackEmailText} from './components/email'

export default {
  components: {
    InlineSvg,
    Loading
  },
  data () {
    return {

      // USER

      is_trainer: false,

      // CLIENT AND ARCHIVE

      archive: {
        clients: {},
        no_archive: false
      },
      clients: null,
      no_clients: false,
      claims: {
        user_type: 0
      },
      client_details: null,
      clientUser: {
        plans: null
      },

      // PORTFOLIO

      portfolio: {
        business_name: '',
        trainer_name: '',
        notes: ''
      },

      // BACKGROUND

      splashed: false,
      templates: null,
      errorMsg: null,
      loading: false,
      pause_loading: false,
      dontLeave: false,
      authenticated: false,
      pwa: {
        deferredPrompt: null,
        displayMode: 'browser tab',
        canInstall: false,
        installed: false
      }
    }
  },
  async created () {
    this.isAuthenticated()
    window.addEventListener('beforeunload', this.confirmLeave)
    axios.defaults.headers.common['Authorization'] = `Bearer ${await this.$auth.getAccessToken()}`
  },
  mounted () {
    const self = this
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault()
      // Stash the event so it can be triggered later.
      self.pwa.deferredPrompt = e
      // Update UI notify the user they can install the PWA
      this.pwa.canInstall = true
    })
    if (this.claims.user_type === ('Trainer' || 'Admin')) {
      this.is_trainer = true
    }
  },
  watch: {
    '$route' (to, from) {
      this.isAuthenticated()
    }
  },
  methods: {

    // BACKGROUND AND MISC.

    willBodyScroll (state) {
      const body = document.getElementsByTagName('body')[0]
      if (state) {
        body.style.overflow = 'auto'
      } else {
        body.style.overflow = 'hidden'
      }
    },
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
    sortSessionsPlan () {
      this.clientUser.plans.forEach((plan) => {
        if (plan.id === parseInt(this.$route.params.id)) {
          plan.sessions.sort((a, b) => {
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
      axios.defaults.headers.common['Authorization'] = `Bearer ${await this.$auth.getAccessToken()}`
      await this.clients_to_vue()
    },

    // CLIENT

    async clients_to_vue () {
      if (!localStorage.getItem('clients')) {
        await this.clients_f()
      }
      this.clients = JSON.parse(localStorage.getItem('clients')).sort(function (a, b) {
        var textA = a.name.toUpperCase()
        var textB = b.name.toUpperCase()
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0
      })
    },
    async clients_f () {
      try {
        const response = await axios.get(`https://api.traininblocks.com/clients/${this.claims.sub}`)
        if (response.data.length === 0) {
          this.no_clients = true
        } else {
          this.no_clients = false
        }
        localStorage.setItem('clients', JSON.stringify(response.data))
      } catch (e) {
        this.no_clients = false
        this.loading = false
        this.errorMsg = e.toString()
        this.$modal.show('error')
        this.willBodyScroll(false)
        console.error(e)
      }
    },
    async client_delete (id, index) {
      this.pause_loading = true
      this.dontLeave = true
      for (var i = 0; i < this.archive.clients.length; i++) {
        if (this.archive.clients[i].client_id === id) {
          this.archive.clients.splice(index, 1)
          if (this.archive.clients.length === 0) {
            this.archive.no_archive = true
          }
        }
      }
      try {
        await axios.delete(`https://api.traininblocks.com/clients/${id}`)

        await this.archive_f()
        this.archive_to_vue()

        await this.clients_f()
        this.clients_to_vue()
        this.$ga.event('Client', 'delete')
        this.pause_loading = false
        this.dontLeave = false
      } catch (e) {
        this.pause_loading = false
        this.dontLeave = false
        this.errorMsg = e.toString()
        this.$modal.show('error')
        this.willBodyScroll(false)
        console.error(e)
      }
    },

    // CLIENT ARCHIVE

    async archive_to_vue () {
      if (!localStorage.getItem('archive')) {
        await this.archive_f()
      }
      if (JSON.parse(localStorage.getItem('archive')).length === 0) {
        this.archive.no_archive = true
      } else {
        this.archive.clients = JSON.parse(localStorage.getItem('archive')).sort(function (a, b) {
          var textA = a.name.toUpperCase()
          var textB = b.name.toUpperCase()
          return (textA < textB) ? -1 : (textA > textB) ? 1 : 0
        })
      }
    },
    async archive_f () {
      try {
        const response = await axios.get(`https://api.traininblocks.com/clients/${this.claims.sub}/archive`)
        if (response.data.length === 0) {
          this.archive.no_archive = true
        } else {
          this.archive.no_archive = false
        }
        localStorage.setItem('archive', JSON.stringify(response.data))
      } catch (e) {
        this.archive.no_archive = false
        this.error = e.toString()
      }
    },
    async client_archive (id, index) {
      if (confirm('Are you sure you want to archive this client?')) {
        let email
        this.pause_loading = true
        this.dontLeave = true
        for (var i = 0; i < this.clients.length; i++) {
          if (this.clients[i].client_id === id) {
            email = this.clients[i].email
            this.clients.splice(index, 1)
            if (this.clients.length === 0) {
              this.no_clients = true
            }
          }
        }
        try {
          const response = await axios.post(`https://api.traininblocks.com/clients/archive/${id}`)
          this.response = response.data

          await this.clients_f()
          this.clients_to_vue()

          await this.archive_f()
          this.archive_to_vue()
          this.$ga.event('Client', 'archive')

          const result = await axios.post('/.netlify/functions/okta',
            {
              type: 'GET',
              url: `?filter=profile.email+eq+"${email}"&limit=1`
            }
          )
          if (result.data.length >= 1) {
            await axios.post('/.netlify/functions/okta',
              {
                type: 'POST',
                body: {},
                url: `${result.data[0].id}/lifecycle/suspend`
              }
            )
            await axios.post('/.netlify/functions/send-email',
              {
                'to': email,
                'subject': 'Account Deactivated',
                'text': deleteEmailText(),
                'html': deleteEmail()
              }
            )
          }
          this.pause_loading = false
          this.dontLeave = false
          this.$router.push('/')
        } catch (e) {
          this.pause_loading = false
          this.dontLeave = false
          this.errorMsg = e.toString()
          this.$modal.show('error')
          this.willBodyScroll(false)
          console.error(e)
        }
      }
    },
    async client_unarchive (id, index) {
      if (confirm('Are you sure you want to unarchive this client?')) {
        this.pause_loading = true
        this.dontLeave = true
        for (var i = 0; i < this.archive.clients.length; i++) {
          if (this.archive.clients[i].client_id === id) {
            var arr = JSON.parse(localStorage.getItem('clients'))
            arr.push(this.archive.clients[i])

            localStorage.setItem('clients', JSON.stringify(arr))
            this.clients = JSON.parse(localStorage.getItem('clients')).sort(function (a, b) {
              var textA = a.name.toUpperCase()
              var textB = b.name.toUpperCase()
              return (textA < textB) ? -1 : (textA > textB) ? 1 : 0
            })

            this.archive.clients.splice(index, 1)
            if (this.archive.clients.length === 0) {
              this.archive.no_archive = true
            }
          }
        }
        try {
          const response = await axios.post(`https://api.traininblocks.com/clients/unarchive/${id}`)
          this.response = response.data

          await this.archive_f()
          this.archive_to_vue()

          await this.clients_f()
          this.clients_to_vue()
          this.$ga.event('Client', 'unarchive')
          this.pause_loading = false
          this.dontLeave = false
        } catch (e) {
          this.pause_loading = false
          this.dontLeave = false
          this.errorMsg = e.toString()
          this.$modal.show('error')
          this.willBodyScroll(false)
          console.error(e)
        }
      }
    },

    // GET METHODS

    async get_templates (force) {
      try {
        if (!localStorage.getItem('templates') || force) {
          const response = await axios.get(`https://api.traininblocks.com/templates/${this.claims.sub}`)
          localStorage.setItem('templates', JSON.stringify(response.data))
        }
        this.templates = JSON.parse(localStorage.getItem('templates'))
      } catch (e) {
        this.loading = false
        this.dontLeave = false
        this.errorMsg = e
        this.$modal.show('error')
        this.willBodyScroll(false)
        console.error(e)
      }
    },
    async get_portfolio (force) {
      try {
        if (!localStorage.getItem('portfolio') || force) {
          this.dontLeave = true
          const response = await axios.get(`https://api.traininblocks.com/portfolio/${this.is_trainer ? this.claims.sub : this.clients[0].pt_id}`)
          if (response.data.length === 0) {
            this.create()
          } else {
            localStorage.setItem('portfolio', JSON.stringify(response.data[0]))
          }
        }
        this.portfolio = JSON.parse(localStorage.getItem('portfolio'))
        this.loading = false
        this.dontLeave = false
      } catch (e) {
        this.loading = false
        this.dontLeave = false
        this.errorMsg = e
        this.$modal.show('error')
        this.willBodyScroll(false)
        console.error(e)
      }
    },
    async get_plans () {
      try {
        const plans = await axios.get(`https://api.traininblocks.com/programmes/${this.claims.client_id_db}`)
        this.clientUser.plans = plans.data
        var f
        for (f in this.clientUser.plans) {
          const response = await axios.get(`https://api.traininblocks.com/workouts/${this.clientUser.plans[f].id}`)
          this.clientUser.plans[f].sessions = response.data
        }
      } catch (e) {
        this.loading = false
        this.dontLeave = false
        this.errorMsg = e.toString()
        this.$modal.show('error')
        this.willBodyScroll(false)
        console.error(e)
      }
    },
    async get_sessions () {
      try {
        var f
        for (f in this.clientUser.plans) {
          const response = await axios.get(`https://api.traininblocks.com/workouts/${this.clientUser.plans[f].id}`)
          this.clientUser.plans[f].sessions = response.data
        }
      } catch (e) {
        this.loading = false
        this.dontLeave = false
        this.errorMsg = e.toString()
        this.$modal.show('error')
        this.willBodyScroll(false)
        console.error(e)
      }
    },
    async update_session (pid, sid) {
      this.loading = true
      // Set the plan variable to the current plan
      let x
      for (x in this.clientUser.plans) {
        if (this.clientUser.plans[x].id === pid) {
          var plan = this.clientUser.plans[x]
          var y
          for (y in plan.sessions) {
            if (plan.sessions[y].id === sid) {
              var sessionId = plan.sessions[y].id
              var sessionName = plan.sessions[y].name
              var sessionChecked = plan.sessions[y].checked
              var sessionFeedback = plan.sessions[y].feedback
            }
          }
        }
      }
      try {
        await axios.post(`https://api.traininblocks.com/client-workouts`,
          {
            'id': sessionId,
            'name': sessionName,
            'checked': sessionChecked,
            'feedback': sessionFeedback
          }
        )
        this.$ga.event('Session', 'update')
        var client = await axios.get(`https://api.traininblocks.com/ptId/${this.claims.client_id_db}`)
        if (client.data[0].notifications === 1) {
          if (sessionFeedback !== null) {
            const ptEmail = await axios.post('/.netlify/functions/okta',
              {
                type: 'GET',
                url: `?filter=id+eq+"${client.data[0].pt_id}"&limit=1`
              }
            )
            await axios.post('/.netlify/functions/send-email',
              {
                'to': ptEmail.data[0].credentials.emails[0].value,
                'subject': this.claims.email + ' has submitted feedback for ' + sessionName,
                'text': feedbackEmailText(this.claims.client_id_db, pid),
                'html': feedbackEmail(this.claims.client_id_db, pid)
              }
            )
          }
        }
      } catch (e) {
        this.loading = false
        this.dontLeave = false
        this.errorMsg = e.toString()
        this.$modal.show('error')
        this.willBodyScroll(false)
        console.error(e)
      }
      this.loading = false
      this.dontLeave = false
    }
  }
}
</script>

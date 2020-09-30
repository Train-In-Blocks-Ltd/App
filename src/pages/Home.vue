<style>
  /* GLOBAL: LINK CONTAINERS */
  .client_link, .plan_link {
    display: grid;
    padding: 2rem;
    grid-gap: 1rem;
    font-weight: 400;
    color: #282828;
    text-decoration: none;
    box-shadow: 0 0 20px 10px #28282810;
    border-radius: 3px;
    transition: all .6s cubic-bezier(.165, .84, .44, 1)
  }
  .client_link:not(.archived):hover, .plan_link:hover {
    transform: scale(1.02)
  }
  .client_link:not(.archived):active, .plan_link:active {
    transform: scale(1)
  }
  .client_link__notes__content, .plan_link__notes__content {
    font-size: .8rem;
    margin-top: .4rem
  }
  .client_link__notes__content *, .plan_link__notes__content * {
    color: #28282890;
    transition: all .6s cubic-bezier(.165, .84, .44, 1)
  }
  .client_link:hover .client_link__notes__content *, .plan_link:hover .plan_link__notes__content * {
    color: #282828
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
  .client_link__notes__content img, .plan_link img {
    margin: 1rem 0;
    max-width: 100%;
    border-radius: 3px;
    opacity: .6;
    transition: all .6s cubic-bezier(.165, .84, .44, 1)
  }
  .client_link:hover .client_link__notes__content img, .plan_link:hover .plan_link:hover img {
    opacity: 1
  }

  /* Containers */
  #home {
    border-right: 6px solid #F4F4F4
  }
  .home--container {
    display: grid;
    margin-bottom: 2rem
  }
  .wrapper--new-client, .wrapper--install-PWA, .wrapper--whats-new, .wrapper--new-plan {
    position: fixed;
    padding: 4rem 20vw 10rem calc(2rem + 38px + 20vw);
    top: 0;
    left: 0;
    z-index: 3;
    height: 100%;
    width: 100%
  }

  /* Search */
  .search {
    border: none;
    outline-width: 0;
    width: 80%;
    border-bottom: 2px solid #282828;
    padding: .6rem 0;
    opacity: .6;
    margin: 0 auto 4rem 0;
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
  .wrapper--client-link {
    text-decoration: none
  }

  /* Add New Client */
  .add_client {
    grid-gap: 1rem
  }
  .add_client label {
    display: grid;
    grid-gap: .5rem
  }
  .new-msg {
    margin: 2rem 0
  }

  @media (max-width: 768px) {
    .home--container {
      width: 100%
    }
  }
</style>

<template>
  <div id="home">
    <transition enter-active-class="animate animate__fadeIn animate__faster animate__delay-1s">
      <div class="wrapper--new-client" v-if="isNewClientOpen">
        <new-client />
      </div>
    </transition>
    <transition enter-active-class="animate animate__fadeIn animate__faster animate__delay-1s">
      <div class="wrapper--whats-new" v-if="isWhatsNewOpen">
        <whats-new />
      </div>
    </transition>
    <transition enter-active-class="animate animate__fadeIn animate__faster animate__delay-1s">
      <div class="wrapper--install-PWA" v-if="isInstallOpen">
        <install-app />
      </div>
    </transition>
    <div class="icon--open-new-client" v-if="!isNewClientOpen" @click="isNewClientOpen = true, $parent.willBodyScroll(false)" aria-label="New Client">
      <inline-svg :src="require('../assets/svg/new-client.svg')" aria-label="New Client"/>
      <p class="text">New Client</p>
    </div>
    <div class="icon--open-whats-new" v-if="!isWhatsNewOpen" @click="isWhatsNewOpen = true, $parent.willBodyScroll(false)" aria-label="What's New">
      <inline-svg :src="require('../assets/svg/whats-new.svg')" aria-label="What's New"/>
      <p class="text">What's New</p>
    </div>
    <div class="icon--open-install-pwa" v-if="!isInstallOpen && $parent.pwa.displayMode === 'browser tab'" @click="isInstallOpen = true, $parent.willBodyScroll(false)" aria-label="Install App">
      <inline-svg :src="require('../assets/svg/install-pwa.svg')" aria-label="Install App"/>
      <p class="text">Install</p>
    </div>
    <div>
      <div :class="{openedSections: isNewClientOpen || isInstallOpen || isWhatsNewOpen}" class="section--a" />
      <div :class="{openedSections: isNewClientOpen || isInstallOpen || isWhatsNewOpen}" class="section--b"/>
    </div>
    <p class="text--small grey text--no-clients" v-if="this.$parent.no_clients">No clients added yet :(</p>
    <p class="text--small grey text--loading" v-if="this.$parent.error"><b>{{this.$parent.error}}</b></p>
    <!-- Loop through clients -->
    <div class="home--container" v-if="!this.$parent.no_clients && !this.$parent.error && this.$parent.clients">
      <input type="search" rel="search" placeholder="Find a client" class="text--small search" autocomplete="name" aria-label="Find a client" v-model="search"/>
      <p v-if="response !== ''" class="new-msg">{{response}}</p>
      <div class="container--clients">
        <!-- Perform case insensitive search -->
        <router-link
          class="wrapper--client-link"
          :to="'/client/'+clients.client_id+'/'"
          v-show="(!search) || ((clients.name).toLowerCase()).startsWith(search.toLowerCase())"
          :id="'a' + clients.client_id"
          v-for="(clients, index) in $parent.clients" :key="index"
        >
          <client-link class="client_link" :name="clients.name" :email="clients.email" :number="clients.number" :notes="clients.notes"/>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import InlineSvg from 'vue-inline-svg'
  import ClientLink from '../components/clientLink'
  import NewClient from '../components/newClient'
  import WhatsNew from  '../components/whatsNew'
  import InstallApp from '../components/installPWA'

  export default {
    components: {
      InlineSvg,
      ClientLink,
      NewClient,
      WhatsNew,
      InstallApp
    },
    data () {
      return {
        response: '',
        search: '',
        isNewClientOpen: false,
        isInstallOpen: false,
        isWhatsNewOpen: false
      }
    },
    created () {
      this.$parent.setup()
      this.$parent.client_details = null
    }
  }
</script>

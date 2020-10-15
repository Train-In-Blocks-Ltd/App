<style>
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
    z-index: 5;
    height: 100%;
    width: 100%
  }
  .wrapper--client-link {
    text-decoration: none
  }

  @media (max-width: 768px) {
    .home--container {
      width: 100%
    }
    .wrapper--new-client, .wrapper--install-PWA, .wrapper--whats-new, .wrapper--new-plan {
      padding: 4rem 10vw 10rem 10vw
    }
  }
</style>

<template>
  <div id="home">
    <div v-if="!$parent.splashed" id="splash">
      <div class="box">
        <svg class="logo--svg" width="38" height="38" viewBox="0 0 38 38" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg">
          <g id="Icon">
            <path d="M0 0L38 0L38 15L15 15L15 38L0 38L0 0Z" id="Rectangle" fill="#282828" stroke="none" />
            <path d="M0 0L14 0L14 14L0 14L0 0Z" transform="translate(24 24)" id="Rectangle-2" fill="#282828" stroke="none" />
          </g>
        </svg>
      </div>
    </div>
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
  import InlineSvg from 'vue-inline-svg'
  import ClientLink from '../components/clientLink'
  import NewClient from '../components/newClient'
  import WhatsNew from '../components/whatsNew'
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
      setTimeout(() => {
        this.$parent.splashed = true
      }, 4000)
    },
    mounted () {
      this.$parent.setup()
      this.$parent.client_details = null
    }
  }
</script>

<style>
  /* Containers */
  #home {
    border-right: 6px solid #F4F4F4
  }
  .home--container {
    display: grid;
    margin-bottom: 2rem
  }

  @media (max-width: 768px) {
    .home--container {
      width: 100%
    }
  }
</style>

<template>
  <div id="home">
    <splash v-if="!$parent.splashed" />
    <transition enter-active-class="animate animate__fadeIn animate__faster animate__delay-1s">
      <div class="wrapper--new_client" v-if="isNewClientOpen">
        <new-client />
      </div>
    </transition>
    <transition enter-active-class="animate animate__fadeIn animate__faster animate__delay-1s">
      <div class="wrapper--whats_new allow_y_overflow" v-if="isWhatsNewOpen">
        <whats-new />
      </div>
    </transition>
    <transition enter-active-class="animate animate__fadeIn animate__faster animate__delay-1s">
      <div class="wrapper--install_PWA icon_open_middle" v-if="isInstallOpen">
        <install-app />
      </div>
    </transition>
    <div class="icon_open--new_client" v-if="!isNewClientOpen" @click="isNewClientOpen = true, $parent.willBodyScroll(false)" aria-label="New Client">
      <inline-svg :src="require('../assets/svg/new-client.svg')" aria-label="New Client"/>
      <p class="text">New Client</p>
    </div>
    <div class="icon_open--whats_new icon_open_middle" v-if="!isWhatsNewOpen" @click="isWhatsNewOpen = true, $parent.willBodyScroll(false)" aria-label="What's New">
      <inline-svg :src="require('../assets/svg/whats-new.svg')" aria-label="What's New"/>
      <p class="text">What's New</p>
    </div>
    <div class="icon_open--install_PWA icon_open_bottom" v-if="!isInstallOpen && $parent.pwa.displayMode === 'browser tab'" @click="isInstallOpen = true, $parent.willBodyScroll(false)" aria-label="Install App">
      <inline-svg :src="require('../assets/svg/install-pwa.svg')" aria-label="Install App"/>
      <p class="text">Install</p>
    </div>
    <div>
      <div :class="{openedSections: isNewClientOpen || isInstallOpen || isWhatsNewOpen}" class="section--a" />
      <div :class="{openedSections: isNewClientOpen || isInstallOpen || isWhatsNewOpen}" class="section--b" />
    </div>
    <p class="text--small grey text--no_clients" v-if="this.$parent.no_clients">No clients added yet, use the button on the top-right of your screen.</p>
    <p class="text--small grey text--loading" v-if="this.$parent.error"><b>{{this.$parent.error}}</b></p>
    <!-- Loop through clients -->
    <div class="home--container" v-if="!this.$parent.no_clients && !this.$parent.error && this.$parent.clients">
      <input type="search" rel="search" placeholder="Find a client" class="text--small search" aria-label="Find a client" v-model="search"/>
      <p v-if="response !== ''" class="new-msg">{{response}}</p>
      <div class="container--clients">
        <!-- Perform case insensitive search -->
        <skeleton v-if="$parent.loading" :type="'client'" />
        <router-link
          :to="'/client/'+clients.client_id+'/'"
          v-show="((!search) || ((clients.name).toLowerCase()).startsWith(search.toLowerCase())) && !$parent.loading"
          :id="'a' + clients.client_id"
          v-for="(clients, index) in $parent.clients"
          :key="index"
          class="wrapper--client_link"
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
  import Skeleton from '../components/Skeleton'
  import Splash from '../components/Splash'

  export default {
    components: {
      InlineSvg,
      ClientLink,
      NewClient,
      WhatsNew,
      InstallApp,
      Skeleton,
      Splash
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
      this.$parent.willBodyScroll(true)
    },
    mounted () {
      this.$parent.loading = true
      this.$parent.setup()
      this.$parent.client_details = null
      this.$parent.loading = false
    }
  }
</script>

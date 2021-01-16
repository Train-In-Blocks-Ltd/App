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
      <div v-if="isNewClientOpen" class="wrapper--new_client">
        <new-client />
      </div>
    </transition>
    <transition enter-active-class="animate animate__fadeIn animate__faster animate__delay-1s">
      <div v-if="isWhatsNewOpen" class="wrapper--whats_new allow_y_overflow">
        <whats-new />
      </div>
    </transition>
    <transition enter-active-class="animate animate__fadeIn animate__faster animate__delay-1s">
      <div v-if="isInstallOpen" class="wrapper--install_PWA icon_open_middle">
        <install-app />
      </div>
    </transition>
    <div v-if="!isNewClientOpen" class="icon_open--new_client" aria-label="New Client" @click="isNewClientOpen = true, $parent.willBodyScroll(false)">
      <inline-svg :src="require('../assets/svg/new-client.svg')" aria-label="New Client" />
      <p class="text">
        New Client
      </p>
    </div>
    <div v-if="!isWhatsNewOpen" class="icon_open--whats_new icon_open_middle" aria-label="What's New" @click="isWhatsNewOpen = true, $parent.willBodyScroll(false)">
      <inline-svg :src="require('../assets/svg/whats-new.svg')" aria-label="What's New" />
      <p class="text">
        What's New
      </p>
    </div>
    <div v-if="!isInstallOpen && $parent.pwa.displayMode === 'browser tab'" class="icon_open--install_PWA icon_open_bottom" aria-label="Install App" @click="isInstallOpen = true, $parent.willBodyScroll(false)">
      <inline-svg :src="require('../assets/svg/install-pwa.svg')" aria-label="Install App" />
      <p class="text">
        Install
      </p>
    </div>
    <div>
      <div :class="{openedSections: isNewClientOpen || isInstallOpen || isWhatsNewOpen}" class="section--a" />
      <div :class="{openedSections: isNewClientOpen || isInstallOpen || isWhatsNewOpen}" class="section--b" />
    </div>
    <p v-if="this.$parent.no_clients" class="text--small grey text--no_clients">
      No clients added yet, use the button on the top-right of your screen.
    </p>
    <p v-if="this.$parent.error" class="text--small grey text--loading">
      <b>{{ this.$parent.error }}</b>
    </p>
    <!-- Loop through clients -->
    <div v-if="!this.$parent.no_clients && !this.$parent.error && this.$parent.clients" class="home--container">
      <input
        v-model="search"
        type="search"
        rel="search"
        placeholder="Find a client"
        class="text--small search"
        aria-label="Find a client"
      >
      <p v-if="response !== ''" class="new-msg">
        {{ response }}
      </p>
      <div class="container--clients">
        <!-- Perform case insensitive search -->
        <skeleton v-if="$parent.loading" :type="'client'" />
        <router-link
          v-for="(clients, index) in $parent.clients"
          v-show="((!search) || ((clients.name).toLowerCase()).startsWith(search.toLowerCase())) && !$parent.loading"
          :id="'a' + clients.client_id"
          :key="index"
          :to="'/client/'+clients.client_id+'/'"
          class="wrapper--client_link"
        >
          <client-link class="client_link" :name="clients.name" :email="clients.email" :number="clients.number" :notes="clients.notes" />
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
      this.$parent.willBodyScroll(true)
    }, 4000)
  },
  mounted () {
    this.$parent.loading = true
    this.$parent.setup()
    this.$parent.client_details = null
    this.$parent.loading = false
  }
}
</script>

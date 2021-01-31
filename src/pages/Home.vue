<style>
  /* Containers */
  #home {
    border-right: 6px solid #F4F4F4
  }
  .home--container {
    display: grid;
    margin-bottom: 2rem
  }
  .search_skeleton {
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
    <div v-if="!isNewClientOpen" class="icon_open--new_client" aria-label="New Client" @click="isNewClientOpen = true, $parent.will_body_scroll(false)">
      <inline-svg :src="require('../assets/svg/new-client.svg')" aria-label="New Client" />
      <p class="text">
        New Client
      </p>
    </div>
    <div v-if="!isWhatsNewOpen" class="icon_open--whats_new icon_open_middle" aria-label="What's New" @click="isWhatsNewOpen = true, $parent.will_body_scroll(false)">
      <inline-svg :src="require('../assets/svg/whats-new.svg')" aria-label="What's New" />
      <p class="text">
        What's New
      </p>
      <span v-if="$parent.newBuild" class="notify_badge">New</span>
    </div>
    <div v-if="!isInstallOpen && $parent.pwa.displayMode === 'browser tab'" class="icon_open--install_PWA icon_open_bottom" aria-label="Install App" @click="isInstallOpen = true, $parent.will_body_scroll(false)">
      <inline-svg :src="require('../assets/svg/install-pwa.svg')" aria-label="Install App" />
      <p class="text">
        Install
      </p>
    </div>
    <div>
      <div :class="{openedSections: isNewClientOpen || isInstallOpen || isWhatsNewOpen}" class="section--a" />
      <div :class="{openedSections: isNewClientOpen || isInstallOpen || isWhatsNewOpen}" class="section--b" />
    </div>
    <p v-if="$parent.no_clients" class="text--small grey text--no_clients">
      No clients added yet, use the button on the top-right of your screen.
    </p>
    <p v-if="$parent.error" class="text--small grey text--loading">
      <b>{{ $parent.error }}</b>
    </p>
    <!-- Loop through clients -->
    <div v-if="!$parent.no_clients && !$parent.error && $parent.clients && !$parent.loading" class="home--container">
      <input
        v-model="search"
        type="search"
        rel="search"
        placeholder="Find a client"
        class="text--small search"
        aria-label="Find a client"
      >
      <div v-if="response !== ''" class="text--new_msg">
        <p class="text--small">
          {{ response }}
        </p>
        <p class="text--small grey">
          Well done on getting a new client
        </p>
      </div>
      <div class="container--clients">
        <!-- Perform case insensitive search -->
        <router-link
          v-for="(client, index) in $parent.clients"
          v-show="((!search) || ((client.name).toLowerCase()).startsWith(search.toLowerCase())) && !$parent.loading"
          :id="'a' + client.client_id"
          :key="index"
          :to="'/client/'+client.client_id+'/'"
          class="wrapper--client_link"
        >
          <client-link
            :name="client.name"
            :email="client.email"
            :number="client.number"
            :notes="client.notes"
            :class="{ recentlyAdded: persistResponse === client.name }"
            class="client_link"
          />
        </router-link>
      </div>
    </div>
    <div v-else>
      <skeleton :type="'input_large'" class="search_skeleton" />
      <skeleton :type="'client'" />
    </div>
  </div>
</template>

<script>
const ClientLink = () => import(/* webpackChunkName: "components.clientlink", webpackPreload: true  */ '../components/ClientLink')
const NewClient = () => import(/* webpackChunkName: "components.newclient", webpackPrefetch: true  */ '../components/NewClient')
const WhatsNew = () => import(/* webpackChunkName: "components.whatsnew", webpackPrefetch: true  */ '../components/WhatsNew')
const InstallApp = () => import(/* webpackChunkName: "components.installpwa", webpackPrefetch: true  */ '../components/InstallPWA')

export default {
  components: {
    ClientLink,
    NewClient,
    WhatsNew,
    InstallApp
  },
  data () {
    return {

      // CLIENT CREATION

      response: '',
      persistResponse: '',

      // TAB STATES

      isNewClientOpen: false,
      isInstallOpen: false,
      isWhatsNewOpen: false,

      // OTHER

      search: ''
    }
  },
  mounted () {
    this.$parent.loading = true
    this.$parent.setup()
    this.$parent.client_details = null
    this.version()
    this.$parent.will_body_scroll(true)
    this.$parent.end_loading()
  },
  methods: {

    // BACKGROUND AND MISC.

    response_delay () {
      setTimeout(() => { this.response = '' }, 5000)
    },
    version () {
      if (localStorage.getItem('versionBuild') !== this.$parent.versionBuild) {
        this.$parent.newBuild = true
      }
    }
  }
}
</script>

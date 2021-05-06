<style>
  /* Containers */
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
  <div id="home" class="view_container">
    <div v-if="isNewClientOpen" class="tab_overlay_content fadeIn delay fill_mode_both">
      <new-client />
    </div>
    <div v-if="isWhatsNewOpen" class="tab_overlay_content allow_y_overflow fadeIn delay fill_mode_both">
      <whats-new />
    </div>
    <div v-if="isInstallOpen" class="tab_overlay_content fadeIn delay fill_mode_both">
      <install-app />
    </div>
    <div v-if="!isNewClientOpen" class="tab_option tab_option_large" aria-label="New Client" @click="isNewClientOpen = true, willBodyScroll(false)">
      <inline-svg :src="require('../assets/svg/new-client.svg')" aria-label="New Client" />
      <p class="text">
        New Client
      </p>
    </div>
    <div v-if="!isWhatsNewOpen" class="tab_option icon_open_middle tab_option_large" aria-label="What's New" @click="isWhatsNewOpen = true, willBodyScroll(false)">
      <inline-svg :src="require('../assets/svg/whats-new.svg')" aria-label="What's New" />
      <p class="text">
        What's New
      </p>
      <span v-if="newBuild" class="notify_badge">New</span>
    </div>
    <div v-if="!isInstallOpen && pwa.displayMode === 'browser tab'" class="tab_option icon_open_bottom tab_option_small" aria-label="Install App" @click="isInstallOpen = true, willBodyScroll(false)">
      <inline-svg :src="require('../assets/svg/install-pwa.svg')" aria-label="Install App" />
      <p class="text">
        Install
      </p>
    </div>
    <div :class="{opened_sections: isNewClientOpen || isInstallOpen || isWhatsNewOpen}" class="section_overlay" />
    <p v-if="noClients" class="text--holder text--small grey">
      No clients added yet, use the button on the top-right of your screen.
    </p>
    <div v-else-if="!noClients && !loading" class="home--container">
      <input
        v-model="search"
        type="search"
        rel="search"
        placeholder="Find a client"
        class="text--small search"
        aria-label="Find a client"
      >
      <div class="clients_container">
        <!-- Perform case insensitive search -->
        <router-link
          v-for="(client, index) in clients"
          v-show="((!search) || ((client.name).toLowerCase()).startsWith(search.toLowerCase())) && !loading"
          :id="'a' + client.client_id"
          :key="index"
          :to="'/client/'+client.client_id+'/'"
          class="client_link_wrapper fadeIn fill_mode_both delay"
        >
          <client-link
            :name="client.name"
            :email="client.email"
            :number="client.number"
            :notes="client.notes"
            :archive="false"
            :class="{ recently_added: persistResponse === client.name }"
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
import { mapState } from 'vuex'
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
      persistResponse: '',
      isNewClientOpen: false,
      isInstallOpen: false,
      isWhatsNewOpen: false,
      search: ''
    }
  },
  computed: mapState([
    'newBuild',
    'clients',
    'noClients',
    'loading',
    'pwa'
  ]),
  async created () {
    this.$store.commit('setData', {
      attr: 'loading',
      data: true
    })
    await this.$parent.setup()
    this.$store.dispatch('endLoading')
  }
}
</script>

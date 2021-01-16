<style scoped>
  .client_update {
    padding: 1rem 0;
    justify-self: end
  }
  .client_update a {
    float: left
  }
  .client_update a:first-of-type {
    margin-right: 1rem
  }
</style>

<style>
  .archive_icon, .archive_icon path {
    transition: transform .1s, opacity .6s cubic-bezier(.165, .84, .44, 1)
  }
  .archive_icon:hover {
    opacity: .6
  }
  .archive_icon:active {
    transform: scale(.9)
  }
</style>

<template>
  <div id="archive">
    <transition enter-active-class="animate animate__fadeIn animate__faster" leave-active-class="animate animate__fadeOut animate__faster">
      <div v-if="selectedClients.length !== 0" class="multi-select">
        <p class="text--selected">
          <b>Selected {{ selectedClients.length }} <span v-if="selectedClients.length === 1">Client</span><span v-if="selectedClients.length !== 1">Clients</span> to ...</b>
        </p>
        <a href="javascript:void(0)" class="text--selected selected-options" @click="deleteMultiClients()">Delete</a>
      </div>
    </transition>
    <p class="text--large">
      Archive
    </p><br>
    <p v-if="this.$parent.archive.no_archive" class="text--small grey">
      No clients are archived :)
    </p>
    <p v-if="this.$parent.error">
      <b>{{ this.$parent.error }}</b>
    </p>
    <input
      v-if="!this.$parent.archive.no_archive && !this.$parent.error && this.$parent.archive.clients"
      v-model="search"
      type="search"
      aria-label="search by name"
      rel="search"
      placeholder="Name"
      class="search text--small"
      autocomplete="name"
    >
    <div class="container--clients">
      <skeleton v-if="$parent.loading" :type="'archived'" />
      <div
        v-for="(clients, index) in $parent.archive.clients"
        v-show="((!search) || ((clients.name).toLowerCase()).startsWith(search.toLowerCase())) && !$parent.loading"
        :id="'a' + clients.client_id"
        :key="index"
        class="wrapper--client_link"
        :to="'/client/'+clients.client_id+'/'"
      >
        <client-link
          class="client_link archived"
          :name="clients.name"
          :email="clients.email"
          :number="clients.number"
          :notes="clients.notes"
          :client-id="clients.client_id"
          :client-index="index"
          :archive="true"
        />
      </div>
    </div>
  </div>
</template>

<script>
import ClientLink from '../components/clientLink'
import Skeleton from '../components/Skeleton'

export default {
  components: {
    ClientLink,
    Skeleton
  },
  data () {
    return {
      search: '',
      selectedClients: [],
      selectedClientsIndex: []
    }
  },
  async created () {
    this.$parent.loading = true
    await this.$parent.setup()
    await this.$parent.archive_to_vue()
    this.$parent.splashed = true
    this.$parent.willBodyScroll(true)
    this.$parent.loading = false
  },
  methods: {
    changeSelectCheckbox (id, index) {
      if (this.selectedClients.includes(id) === false) {
        this.selectedClients.push(id)
        this.selectedClientsIndex.push(index)
      } else {
        const idx1 = this.selectedClients.indexOf(id)
        this.selectedClients.splice(idx1, 1)
        const idx2 = this.selectedClientsIndex.indexOf(index)
        this.selectedClientsIndex.splice(idx2, 1)
      }
    },
    deleteMultiClients () {
      if (this.selectedClients.length !== 0) {
        if (confirm('Are you sure you want to delete all the selected clients?')) {
          this.selectedClients.forEach((clientId) => {
            const idx = this.selectedClients.indexOf(clientId)
            this.$parent.client_delete(clientId, idx)
          })
          this.selectedClients.length = 0
          this.selectedClientsIndex.length = 0
        }
      }
    }
  }
}
</script>

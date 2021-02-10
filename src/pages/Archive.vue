<style scoped>
  .top_bar {
    display: flex;
    justify-content: space-between
  }
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
        <a href="javascript:void(0)" class="text--selected a_link" @click="delete_multi_clients()">Delete</a>
        <a href="javascript:void(0)" class="text--selected a_link" @click="deselect_all()">Deselect all</a>
      </div>
    </transition>
    <div class="top_bar">
      <p class="text--large">
        Archive
      </p>
      <a v-if="!$parent.archive.no_archive" href="javascript:void(0)" class="a_link" @click="select_all()">Select all</a>
    </div>
    <br>
    <p v-if="$parent.archive.no_archive" class="text--small grey">
      No clients are archived :)
    </p>
    <p v-if="$parent.error">
      <b>{{ $parent.error }}</b>
    </p>
    <input
      v-if="!$parent.archive.no_archive && !$parent.error && $parent.archive.clients"
      v-model="search"
      type="search"
      aria-label="search by name"
      rel="search"
      placeholder="Name"
      class="search text--small"
      autocomplete="name"
    >
    <div v-if="!$parent.archive.no_archive" class="container--clients">
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
const ClientLink = () => import(/* webpackChunkName: "components.clientlink", webpackPreload: true  */ '../components/ClientLink')

export default {
  components: {
    ClientLink
  },
  data () {
    return {
      search: '',
      selectedClients: []
    }
  },
  async created () {
    this.$parent.loading = true
    await this.$parent.setup()
    await this.$parent.archive_to_vue()
    this.$parent.will_body_scroll(true)
    this.$parent.end_loading()
  },
  methods: {

    // CHECKBOX

    change_select_checkbox (id) {
      if (this.selectedClients.includes(id) === false) {
        this.selectedClients.push(id)
      } else {
        const idx = this.selectedClients.indexOf(id)
        this.selectedClients.splice(idx, 1)
      }
    },
    select_all () {
      this.$parent.archive.clients.forEach((client) => {
        this.selectedClients.push(client.client_id)
        document.getElementById(`sc-${client.client_id}`).checked = true
      })
    },
    deselect_all () {
      this.$parent.archive.clients.forEach((client) => {
        document.getElementById(`sc-${client.client_id}`).checked = false
      })
      this.selectedClients = []
    },
    delete_multi_clients () {
      if (this.selectedClients.length !== 0) {
        if (confirm('Are you sure that you want to delete all the selected clients?')) {
          this.selectedClients.forEach((clientId) => {
            this.$parent.client_delete(clientId)
          })
          this.selectedClients = []
        }
      }
    }
  }
}
</script>

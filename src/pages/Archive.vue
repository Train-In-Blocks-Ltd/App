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
    opacity: var(--light_opacity)
  }
  .archive_icon:active {
    transform: var(--active_state)
  }
</style>

<template>
  <div id="archive" class="view_container">
    <multiselect
      :type="'client'"
      :options="multiselectOptions"
      :selected="selectedClients"
      @response="resolveArchiveMultiselect"
    />
    <div class="top_bar">
      <h1>
        Archive
      </h1>
      <a
        v-if="!archive.noArchive && selectedClients.length < archive.clients.length"
        href="javascript:void(0)"
        class="a_link"
        @click="selectAll()"
      >
        Select all
      </a>
    </div>
    <br>
    <p v-if="archive.noArchive" class="text--small grey">
      No clients are archived
    </p>
    <input
      v-if="!archive.noArchive && archive.clients"
      v-model="search"
      type="search"
      aria-label="search by name"
      rel="search"
      placeholder="Name"
      class="search text--small"
      autocomplete="name"
    >
    <div v-if="!archive.noArchive" class="clients_container">
      <skeleton v-if="loading" :type="'archived'" />
      <div
        v-for="(clients, index) in archive.clients"
        v-show="((!search) || ((clients.name).toLowerCase()).startsWith(search.toLowerCase())) && !loading"
        :id="'a' + clients.client_id"
        :key="index"
        class="client_link_wrapper fadeIn"
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
import { mapState } from 'vuex'
const ClientLink = () => import(/* webpackChunkName: "components.clientlink", webpackPreload: true  */ '../components/ClientLink')
const Multiselect = () => import(/* webpackChunkName: "components.multiselect", webpackPreload: true  */ '../components/Multiselect')

export default {
  components: {
    ClientLink,
    Multiselect
  },
  data () {
    return {
      search: '',
      selectedClients: [],
      multiselectOptions: [
        { name: 'Unarchive', svg: 'svg/archive.svg' },
        { name: 'Delete', svg: 'svg/bin.svg' },
        { name: 'Deselect', svg: null }
      ]
    }
  },
  computed: mapState([
    'loading',
    'archive'
  ]),
  async created () {
    this.$store.commit('setData', {
      attr: 'loading',
      data: true
    })
    this.willBodyScroll(true)
    await this.$parent.setup()
    this.$store.dispatch('endLoading')
  },
  methods: {
    resolveArchiveMultiselect (res) {
      switch (res) {
        case 'Unarchive':
          this.unarchiveClients()
          break
        case 'Delete':
          this.deleteClients()
          break
        case 'Deselect':
          this.deselectAll()
          break
      }
    },
    changeSelectCheckbox (id) {
      if (!this.selectedClients.includes(id)) {
        this.selectedClients.push(id)
      } else {
        const CLIENT_INDEX = this.selectedClients.indexOf(id)
        this.selectedClients.splice(CLIENT_INDEX, 1)
      }
    },
    selectAll () {
      this.archive.clients.forEach((client) => {
        if (!this.selectedClients.includes(client.client_id)) {
          this.selectedClients.push(client.client_id)
          document.getElementById(`sc-${client.client_id}`).checked = true
        }
      })
    },
    deselectAll () {
      this.archive.clients.forEach((client) => {
        document.getElementById(`sc-${client.client_id}`).checked = false
      })
      this.selectedClients = []
    },
    async deleteClients () {
      try {
        this.$store.commit('setData', {
          attr: 'dontLeave',
          data: true
        })
        if (this.selectedClients.length !== 0) {
          if (await this.$parent.$refs.confirm_pop_up.show('Are you sure that you want to delete all the selected clients?', 'We will remove their data(s) from our database and it won\'t be recoverable.')) {
            for (const CLIENT_ID of this.selectedClients) {
              await this.$store.dispatch('clientDelete', CLIENT_ID)
            }
            this.$parent.$refs.response_pop_up.show(this.selectedClients.length > 1 ? 'Clients deleted' : 'Client Delete', 'All their data have been removed')
            this.deselectAll()
          }
        }
        this.$$store.dispatch('endLoading')
      } catch (e) {
        this.$parent.resolveError(e)
      }
    },
    async unarchiveClients () {
      try {
        this.$store.commit('setData', {
          attr: 'dontLeave',
          data: true
        })
        if (this.selectedClients.length !== 0) {
          if (await this.$parent.$refs.confirm_pop_up.show('Are you sure that you want to unarchive all the selected clients?', 'Their datas will be recovered and available on the Home page.')) {
            for (const CLIENT_ID of this.selectedClients) {
              await this.$store.dispatch('clientUnarchive', CLIENT_ID)
            }
            this.$parent.$refs.response_pop_up.show(this.selectedClients.length > 1 ? 'Unarchived clients' : 'Unarchived client', 'All their data have been recovered')
            this.deselectAll()
          }
        }
        this.$store.dispatch('endLoading')
      } catch (e) {
        this.$parent.resolveError(e)
      }
    }
  }
}
</script>

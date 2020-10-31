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
  .archive__icon, .archive__icon path {
    transition: transform .1s, opacity .4s cubic-bezier(.165, .84, .44, 1)
  }
  .archive__icon:hover {
    opacity: .6
  }
  .archive__icon:active {
    transform: scale(.9)
  }
</style>

<template>
  <div id="archive">
    <p class="text--large">Archive</p>
    <p class="text--small grey" v-if="this.$parent.archive.no_archive">No clients are archived :)</p>
    <p v-if="this.$parent.error"><b>{{this.$parent.error}}</b></p>
    <input v-if="!this.$parent.archive.no_archive && !this.$parent.error && this.$parent.archive.clients" type="search" aria-label="search by name" rel="search" placeholder="Name" class="search text--small" autocomplete="name" v-model="search"/>
    <div class="container--clients">
      <div
        class="wrapper--client-link"
        :to="'/client/'+clients.client_id+'/'"
        v-show="(!search) || ((clients.name).toLowerCase()).startsWith(search.toLowerCase())"
        :id="'a' + clients.client_id"
        v-for="(clients, index) in $parent.archive.clients" :key="index"
      >
        <client-link
          class="client_link archived"
          :name="clients.name"
          :email="clients.email"
          :number="clients.number"
          :notes="clients.notes"
          :clientId="clients.client_id"
          :clientIndex="index"
          :archive="true"/>
      </div>
    </div>
  </div>
</template>

<script>
  import ClientLink from '../components/clientLink'
  import InlineSvg from 'vue-inline-svg'

  export default {
    components: {
      InlineSvg,
      ClientLink
    },
    data () {
      return {
        search: ''
      }
    },
    async created () {
      this.$parent.loading = true
      await this.$parent.setup()
      await this.$parent.archive_to_vue()
      this.$parent.splashed = true
      this.$parent.willBodyScroll(true)
      this.$parent.loading = false
    }
  }
</script>
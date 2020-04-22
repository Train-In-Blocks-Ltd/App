<style scoped>
  .client_update span:first-of-type {
    margin-left: 1rem;
  }
</style>
<template>
  <div id="home">
    <h1>Archive</h1>
    <p v-if="this.$parent.no_archive">No clients are archived</p>
    <p v-if="this.$parent.archive_error"><b>{{this.$parent.archive_error}}</b></p>
    <div v-if="!this.$parent.no_archive && !this.$parent.archive_error && this.$parent.archive_posts">
      <input type="search" rel="search" placeholder="Search..." class="search" autocomplete="name" v-model="search"/>
      <div v-for="(clients, index) in $parent.archive_posts"
        :key="index" class="client_container archived">
        <div class="client_link" v-if="(!search) || ((clients.name).toLowerCase()).includes(search.toLowerCase())">
          <p><b>{{clients.name}}</b> - {{clients.email}} - {{clients.number}}</p>
        </div>
        <div class="client_update">
          <span v-on:click="$parent.client_delete(clients.client_id)" title="Delete"><svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none" class="transparent"/><path d="M6 21h12V7H6v14zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg></span>
          <span v-on:click="$parent.client_unarchive(clients.client_id)" title="Unarchive"><svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none" class="transparent"/><path d="M18.71 3H5.29L3 5.79V21h18V5.79L18.71 3zM14 15v2h-4v-2H6.5L12 9.5l5.5 5.5H14zM5.12 5l.81-1h12l.94 1H5.12z"/></svg></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data: function () {
      return {
        search: ''
      }
    },
    async created () {
      await this.$parent.archive_to_vue()
    }
  }
</script>
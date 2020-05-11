<style scoped>
  .client_container.archived {
    display: grid;
    grid-template-columns: 1fr .2fr;
    width: 95%
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
  .archive__icon path {
    fill: rgb(
      var(--accessible-color),
      var(--accessible-color),
      var(--accessible-color)
    )
  }
  .archive__icon, .archive__icon path {
    transition: all .4s cubic-bezier(.165, .84, .44, 1)
  }
  .archive__icon:hover {
    opacity: .6
  }
  .archive__icon:hover path.lid--side {
    transform: translate(-10px, 0)
  }
  .archive__icon:hover path.lid--up {
    transform: translate(0, -2px)
  }
  .archive--container {
    width: 50vw
  }

  @media (max-width: 768px) {
    .archive--container {
      width: 100%
    }
  }
</style>

<template>
  <div id="home">
    <h1>Archive</h1>
    <p v-if="this.$parent.no_archive">No clients are archived</p>
    <p v-if="this.$parent.archive_error"><b>{{this.$parent.archive_error}}</b></p>
    <div class="archive--container" v-if="!this.$parent.no_archive && !this.$parent.archive_error && this.$parent.archive_posts">
      <input type="search" rel="search" placeholder="Search..." class="search" autocomplete="name" v-model="search"/>
      <div v-for="(clients, index) in $parent.archive_posts"
        :key="index" class="client_container archived">
        <div class="client_link" v-if="(!search) || ((clients.name).toLowerCase()).includes(search.toLowerCase())">
          <p><b>{{clients.name}}</b> - {{clients.email}} - {{clients.number}}</p>
        </div>
        <div class="client_update">
          <a href="javascript:void(0)" v-on:click="$parent.client_unarchive(clients.client_id, index)" title="Unarchive">
            <inline-svg :src="require('../../assets/svg/ArchiveIconClose.svg')" class="archive__icon"/>
          </a>
          <a href="javascript:void(0)" v-on:click="$parent.client_delete(clients.client_id, index)" title="Delete">
            <inline-svg :src="require('../../assets/svg/Trash.svg')" class="archive__icon"/>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import InlineSvg from 'vue-inline-svg'

  export default {
    components: {
      InlineSvg
    },
    data: function () {
      return {
        search: ''
      }
    },
    async created () {
      await this.$parent.setup()
      await this.$parent.archive_to_vue()
    }
  }
</script>
<style scoped>
  .client_container.archived {
    display: grid;
    grid-template-columns: 1fr 100px;
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
  .archive--container {
    display: grid;
    grid-template-rows: 8rem 1fr
  }

  @media (max-width: 768px) {
    .archive--container {
      max-width: 100%
    }
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
    <h1 class="main-title">Archive</h1>
    <p v-if="this.$parent.no_archive">No clients are archived</p>
    <p v-if="this.$parent.archive_error"><b>{{this.$parent.archive_error}}</b></p>
    <div class="archive--container" v-if="!this.$parent.no_archive && !this.$parent.archive_error && this.$parent.archive_posts">
      <label>
        <b>Find a client:</b>
        <input type="search" rel="search" placeholder="Name" class="search" autocomplete="name" v-model="search"/>
      </label>
      </div>
      <div class="container--clients">
        <div v-for="(clients, index) in $parent.archive_posts"
          :key="index" v-show="(!search) || ((clients.name).toLowerCase()).includes(search.toLowerCase())" class="client_container archived">
          <div class="client_link archived">
            <p class="client_link__name"><b>{{clients.name}}</b></p>
            <div class="client_link__details"><inline-svg :src="require('../../assets/svg/email.svg')" /><p>{{clients.email}}</p></div>
            <div class="client_link__details"><inline-svg :src="require('../../assets/svg/mobile.svg')" /><p>{{clients.number}}</p></div>
          </div>
          <div class="client_update">
            <a href="javascript:void(0)" @click="$parent.client_unarchive(clients.client_id, index)" title="Unarchive">
              <inline-svg :src="require('../../assets/svg/archive-small.svg')" class="archive__icon"/>
            </a>
            <a href="javascript:void(0)" @click="$parent.client_delete(clients.client_id, index)" title="Delete">
              <inline-svg :src="require('../../assets/svg/bin.svg')" class="archive__icon"/>
            </a>
          </div>
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
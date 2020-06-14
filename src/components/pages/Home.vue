<style>
  #home {
    display: grid;
    max-width: 800px;
    padding: 5rem 3.75rem;
    grid-gap: 2rem
  }
  #intro {
    font-size: 2rem;
    margin-top: 0
  }
  .home--container {
    display: grid;
    grid-template-rows: 8rem 1fr
  }

  /* Add Client Form */
  .add_client {
    grid-gap: 1rem
  }
  .add_client label {
    display: grid;
    grid-gap: .5rem
  }

  @media (max-width: 768px) {
    .home--container {
      width: 100%
    }
  }
</style>

<template>
  <div id="home">
    <h1 class="main-title">Your Clients</h1>
    <p v-if="this.$parent.no_clients">No clients yet. You can add one below.</p>
    <p v-if="this.$parent.loading_clients">Loading clients...</p>
    <p v-if="this.$parent.error"><b>{{this.$parent.error}}</b></p>
    <!-- Loop through clients -->
    <div class="home--container" v-if="!this.$parent.no_clients && !this.$parent.error && this.$parent.posts">
      <div>
        <label for="client-search"><b>Find a client:</b></label>
        <input name="client-search" type="search" rel="search" placeholder="Name" class="search" autocomplete="name" v-model="search"/>
      </div>
      <div class="container--clients">
        <div v-for="(clients, index) in $parent.posts"
          :key="index">
          <!-- Perform case insensitive search -->
          <div v-if="(!search) || ((clients.name).toLowerCase()).startsWith(search.toLowerCase())" class="client_container" :id="'a' + clients.client_id">
            <router-link class="client_link" :to="'/client/'+clients.client_id+'/'">
              <p class="client_link__name"><b>{{clients.name}}</b>
              <div class="client_link__details"><inline-svg :src="require('../../assets/svg/Email.svg')" /><p>{{clients.email}}</p></div>
              <div class="client_link__details"><inline-svg :src="require('../../assets/svg/Mobile.svg')" /><p>{{clients.number}}</p></div>
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <div><button v-if="!creating" class="button button--new-client" v-on:click="creation()">New Client</button></div>
    <p v-if="!creating">{{response}}</p>
    <div v-if="creating">
      <h3>New Client</h3>
      <form name="add_client" class="form_grid add_client" spellcheck="false" v-on:submit.prevent="save()">
        <label><b>Name: </b><input type="text" autocomplete="name" v-model="new_client.name" required/></label>
        <label><b>Email: </b><input type="email" autocomplete="email" v-model="new_client.email" required/></label>
        <label><b>Mobile: </b><input type="tel" inputmode="tel" autocomplete="tel" v-model="new_client.number" minlength="9" maxlength="14" pattern="\d+" /></label>
        <div class="form_buttons">
          <input type="submit" class="button button--save" value="Save" />
          <button class="button button--close" v-on:click="close()">Close</button>
          <Loader></Loader>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import qs from 'qs'
  import Loader from '../components/Loader'
  import InlineSvg from 'vue-inline-svg'

  export default {
    components: {
      Loader,
      InlineSvg
    },
    data: function () {
      return {
        response: '',
        creating: false,
        new_client: {
          name: '',
          email: '',
          number: '',
          notes: ''
        },
        search: '',
        msg: ''
      }
    },
    created () {
      this.$parent.setup()
    },
    methods: {
      creation () {
        this.creating = true
      },
      close () {
        this.creating = false
      },
      async save () {
        this.response = ''
        try {
          this.$parent.loading = true
          // eslint-disable-next-line
          const response_save_clients = await axios.put(`https://api.traininblocks.com/clients/${this.new_client.name}`,
            qs.stringify({
              pt_id: this.$parent.claims.sub,
              email: this.new_client.email,
              number: this.new_client.number,
              notes: this.new_client.notes
            }),
            {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${await this.$auth.getAccessToken()}`
              }
            }
          )
          // eslint-disable-next-line
          this.response = (response_save_clients.data).toString()

          await this.$parent.clients()
          this.$parent.clients_to_vue()

          this.$parent.loading = false

          this.close()

          this.new_client = {
            name: '',
            email: '',
            number: '',
            notes: ''
          }
        } catch (e) {
          console.error(`${e}`)
        }
      }
    }
  }
</script>
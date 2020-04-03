<template>
  <div id="home">
    <h1>Explore</h1>
    <p :style="'font-size: 1.5rem'" v-if="this.$parent.claims">Welcome back, {{this.$parent.claims.name}}!</p>
    <p v-if="this.$parent.no_clients">No clients yet. You can add one below.</p>
    <p v-if="this.$parent.loading_clients">Loading clients...</p>
    <p v-if="this.$parent.error"><b>{{this.$parent.error}}</b></p>
    <div v-if="!this.$parent.no_clients && !this.$parent.error && this.$parent.posts">
      <input type="search" rel="search" placeholder="Search..." class="search" v-model="search"/>
      <div v-for="(clients, index) in $parent.posts"
        :key="index" class="client_container">
        <router-link class="client_link" :to="'/client/'+clients.name" v-if="(!search) || ((clients.name).toLowerCase()).includes(search.toLowerCase())">
          <p><b>{{clients.name}}</b> - {{clients.email}} - {{clients.number}}</p>
        </router-link>
        <div class="client_update">
          <span v-on:click="$parent.client_archive(clients.client_id)" title="Archive"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24px" height="24px"><path d="M0 0h24v24H0V0z" fill="none" class="transparent"/><path d="M18.71 3H5.29L3 5.79V21h18V5.79L18.71 3zM12 17.5L6.5 12H10v-2h4v2h3.5L12 17.5zM5.12 5l.81-1h12l.94 1H5.12z"/></svg></span>
        </div>
      </div>
    </div>
    <button v-if="!creating" id="add_client-link" class="button" v-on:click="creation()">New client</button>
    <p class="response" v-if="!creating">{{response}}</p>
    <div class="add_new_client_container" v-if="creating">
      <h3>Add new client</h3>
      <form name="add_client" class="form_grid" v-on:submit.prevent="save()">
        <label for="name"><b>Name: </b></label><input type="text" id="name" name="name" v-model="new_client.name" required/>
        <label for="email"><b>Email: </b></label><input type="email" id="email" name="email" v-model="new_client.email" required/>
        <label for="number"><b>Number: </b></label><input type="tel" id="number" name="number" v-model="new_client.number" required pattern="[0-9]{11}"/>
        <label for="notes"><b>Notes: </b></label><textarea id="notes" name="notes" v-model="new_client.notes"></textarea>
        <div class="form_buttons">
          <input type="submit" id="save_client-link" class="button" value="Save" />
          <button class="button" v-on:click="close()">Close</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import qs from 'qs'
  export default {
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
        search: ''
      }
    },
    async created () {
      if (!localStorage.getItem('firstLoaded')) {
        await this.$parent.setup()
        await this.$parent.clients()
        await this.$parent.clients_to_vue()
        localStorage.setItem('firstLoaded', true)
      }
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
        axios.defaults.headers.common['Authorization'] = `Bearer ${await this.$auth.getAccessToken()}`
        try {
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
          this.response = response_save_clients.data

          await this.$parent.clients()
          this.$parent.clients_to_vue()

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
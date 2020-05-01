<template>
  <div id="home">
    <h1>Explore</h1>
    <p :style="'font-size: 1.5rem'" v-if="this.$parent.claims"> Hi {{this.$parent.claims.name}}</p>
    <p v-if="this.$parent.no_clients">No clients yet. You can add one below.</p>
    <p v-if="this.$parent.loading_clients">Loading clients...</p>
    <p v-if="this.$parent.error"><b>{{this.$parent.error}}</b></p>
    <!-- Loop through clients -->
    <div v-if="!this.$parent.no_clients && !this.$parent.error && this.$parent.posts">
      <input type="search" rel="search" placeholder="Search..." class="search" autocomplete="name" v-model="search"/>
      <div v-for="(clients, index) in $parent.posts"
        :key="index">
        <!-- Perform case insensitive search -->
        <div v-if="(!search) || ((clients.name).toLowerCase()).startsWith(search.toLowerCase())" class="client_container" :id="'a' + clients.client_id">
          <router-link class="client_link" :to="'/client/'+clients.name+'/'">
            <p><b>{{clients.name}}</b> - {{clients.email}} - {{clients.number}}</p>
              <div class="client_update">
                <a href="javascript:void(0)" v-on:click="$parent.client_archive(clients.client_id, index)" title="Archive"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24px" height="24px"><path d="M0 0h24v24H0V0z" fill="none" class="transparent"/><path d="M18.71 3H5.29L3 5.79V21h18V5.79L18.71 3zM12 17.5L6.5 12H10v-2h4v2h3.5L12 17.5zM5.12 5l.81-1h12l.94 1H5.12z"/></svg></a>
              </div>
          </router-link>
        </div>
      </div>
    </div>
    <button v-if="!creating" id="add_client-link" class="button" v-on:click="creation()">New Client</button>
    <p class="response" v-if="!creating">{{response}}</p>
    <div class="add_new_client_container" v-if="creating">
      <h3 class="add-new">New Client</h3>
      <form name="add_client" class="form_grid" spellcheck="false" v-on:submit.prevent="save()">
        <label for="name"><b>Name: </b></label><input type="text" id="name" name="name" autocomplete="name" v-model="new_client.name" required/>
        <label for="email"><b>Email: </b></label><input type="email" id="email" name="email" autocomplete="email" v-model="new_client.email" required/>
        <label for="number"><b>Number: </b></label><input type="tel" id="number" name="number" inputmode="tel" autocomplete="tel" v-model="new_client.number" minlength="9" maxlength="14" pattern="\d+" />
        <div class="form_buttons">
          <input type="submit" id="save_client-link" class="button" value="Save" />
          <button class="button" v-on:click="close()">Close</button>
          <Loader></Loader>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import qs from 'qs'
  import Loader from './Loader'

  export default {
    components: {
      Loader
    },
    data: function () {
      return {
        response: '',
        creating: false,
        new_client: {
          name: '',
          email: '',
          number: '',
          notes: '<p><strong>Age:</strong></p><p><strong>Blood pressure:</strong></p><p><strong>Height:</strong></p><p><strong>BMI:</strong></p><p><strong>Body fat:</strong></p><p><strong>Muscle Mass</strong></p><p><strong>Hydration:</strong></p><p><br></p><p><strong>Goals:</strong></p><p><br></p><p><strong>Lifestyle:</strong></p><p><br></p><p><strong>Barriers to exercise:</strong></p><p><br></p><p><strong>Motivation:</strong></p><p><br></p><p><strong>Preferences:</strong></p><p><br></p>'
        },
        search: ''
      }
    },
    async created () {
      await this.$parent.setup()
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
          this.response = response_save_clients.data

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
      },
      rdmWelcome() {
      var msg = [
      "let's get programming!",
      "stay motivated!",
      "quick one today?"
      ];
      var sel = Math.floor(Math.random() * 3);

      return msg[sel];
      },
    }
  }
</script>
<template>
  <div id="home">
    <h1>Explore</h1>
    <p class="intro" v-if="this.$parent.claims"> Hi {{this.$parent.claims.name}}, {{this.msg}}</p>
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
          </router-link>
        </div>
      </div>
    </div>
    <div class="add_client-link_container"><button v-if="!creating" id="add_client-link" class="button" v-on:click="creation()">New Client</button></div>
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
  import Loader from '../components/Loader'

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
        search: '',
        msg: ''
      }
    },
    created () {
      this.$parent.setup()
      this.welcomeMsg()
    },
    methods: {
      welcomeMsg () {
        var arr = [
          'let\'s get programming!',
          'stay motivated!',
          'quick one today?'
        ]
        this.msg = arr[Math.floor(Math.random() * 3)]
      },
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
      }
    }
  }
</script>
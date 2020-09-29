<style>
  .home--container {
    display: grid;
    grid-template-rows: 8rem 1fr;
    margin-bottom: 2rem
  }
  .client_link svg {
    width: 20px;
    fill: #28282890;
    transition: all .6s cubic-bezier(.165, .84, .44, 1)
  }
  .client_link:hover svg {
    fill: #282828
  }
  .client_link__details {
    display: grid;
    grid-template-columns: 20px 1fr;
    grid-gap: 1rem
  }
  .client_link__details p {
    margin: auto 0;
    color: #28282890;
    transition: all .6s cubic-bezier(.165, .84, .44, 1)
  }
  .client_link:hover .client_link__details p {
    color: #282828
  }
  .search {
    border: none;
    outline-width: 0;
    width: 95%;
    font-size: 1.6rem;
    letter-spacing: .1rem;
    border-bottom: 2px solid #282828;
    padding: .6rem 0;
    margin: 1rem 0;
    transition: all .4s cubic-bezier(.165, .84, .44, 1)
  }
  .search:hover {
    border-bottom: 2px solid #28282880;
    width: 100%
  }
  .search:focus {
    border-bottom: 2px solid #282828;
    width: 100%
  }

  /* Add Client Form */
  .add_client {
    grid-gap: 1rem
  }
  .add_client label {
    display: grid;
    grid-gap: .5rem
  }
  .new-msg {
    margin: 2rem 0
  }

  @media (max-width: 768px) {
    .home--container {
      width: 100%
    }
  }
</style>

<template>
  <div id="home">
    <button @click="$parent.installPWA()" v-if="$parent.displayMode === 'browser tab' && $parent.canInstall === true">
      Install App
    </button>
    <p v-if="this.$parent.no_clients">No clients yet. You can add one below.</p>
    <p v-if="this.$parent.error"><b>{{this.$parent.error}}</b></p>
    <!-- Loop through clients -->
    <div class="home--container" v-if="!this.$parent.no_clients && !this.$parent.error && this.$parent.clients">
      <label>
        <b>Find a client:</b>
        <input type="search" rel="search" placeholder="Name" class="search" autocomplete="name" v-model="search"/>
      </label>
      <div class="container--clients">
        <!-- Perform case insensitive search -->
        <router-link 
          class="client_link" :to="'/client/'+clients.client_id+'/'"
          v-show="(!search) || ((clients.name).toLowerCase()).startsWith(search.toLowerCase())"
          :id="'a' + clients.client_id"
          v-for="(clients, index) in $parent.clients" :key="index"
        >
          <div>
            <p class="text--small client-name">{{clients.name}}</p>
            <div v-if="clients.email !== ''" class="client_link__details"><inline-svg :src="require('../../assets/svg/email.svg')" />
              <p>{{clients.email}}</p>
            </div>
            <div v-if="clients.number !== ''" class="client_link__details"><inline-svg :src="require('../../assets/svg/mobile.svg')" />
              <p>{{clients.number}}</p>
            </div>
          </div>
          <div v-if="clients.notes !== ''" v-html="clients.notes" class="client_link__notes__content" />
        </router-link>
      </div>
    </div>
    <button v-if="!creating" class="button--new-client" @click="creation()">New Client</button>
    <p v-if="!creating" class="new-msg">{{response}}</p>
    <div v-if="creating">
      <h3>New Client</h3>
      <form name="add_client" class="form_grid add_client" spellcheck="false" @submit.prevent="save()">
        <label><b>Name: </b><input class="input--forms" type="text" autocomplete="name" v-model="new_client.name" required/></label>
        <label><b>Email: </b><input class="input--forms" type="email" autocomplete="email" v-model="new_client.email" required/></label>
        <label><b>Mobile: </b><input class="input--forms" type="tel" inputmode="tel" autocomplete="tel" v-model="new_client.number" minlength="9" maxlength="14" pattern="\d+" /></label>
        <div class="form_buttons">
          <button type="submit">Save</button>
          <button class="cancel" @click="close()">Close</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import InlineSvg from 'vue-inline-svg'

  export default {
    components: {
      InlineSvg
    },
    data () {
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
    created () {
      this.$parent.setup()
      this.$parent.client_details = null
    },
    methods: {
      creation () {
        this.creating = true
      },
      close () {
        this.creating = false
      },
      async save () {
        if (this.new_client.email === this.$parent.claims.email) {
          this.$parent.errorMsg = 'You cannot create a client with your own email address!'
          this.$parent.$modal.show('error')
          console.error('You cannot create a client with your own email address!')
        } else {
          this.response = ''
          try {
            this.$parent.loading = true
            this.$parent.dontLeave = true
            await axios.put('https://api.traininblocks.com/clients',
              {
                'name': this.new_client.name,
                'pt_id': this.$parent.claims.sub,
                'email': this.new_client.email,
                'number': this.new_client.number,
                'notes': this.new_client.notes
              },
              {
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${await this.$auth.getAccessToken()}`
                }
              }
            )
            // eslint-disable-next-line
            this.response = 'Added New Client'
            this.$parent.responseDelay()

            await this.$parent.clients_f()
            this.$parent.clients_to_vue()

            this.$parent.loading = false
            this.$parent.dontLeave = false

            this.close()

            this.new_client = {
              name: '',
              email: '',
              number: '',
              notes: ''
            }
            this.$ga.event('Client', 'new')
          } catch (e) {
            this.$parent.loading = false
            this.$parent.dontLeave = false
            this.$parent.errorMsg = e
            this.$parent.$modal.show('error')
            console.error(e)
          }
        }
      }
    }
  }
</script>

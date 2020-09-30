<style>
  /* GLOBAL: LINK CONTAINERS */
  .client_link, .plan_link {
    display: grid;
    padding: 2rem;
    grid-gap: 1rem;
    font-weight: 400;
    color: #282828;
    text-decoration: none;
    box-shadow: 0 0 20px 10px #28282810;
    border-radius: 3px;
    transition: all .6s cubic-bezier(.165, .84, .44, 1)
  }
  .client_link:not(.archived):hover, .plan_link:hover {
    transform: scale(1.02)
  }
  .client_link:not(.archived):active, .plan_link:active {
    transform: scale(1)
  }
  .client_link__notes__content, .plan_link__notes__content {
    font-size: .8rem;
    margin-top: .4rem
  }
  .client_link__notes__content *, .plan_link__notes__content * {
    color: #28282890;
    transition: all .6s cubic-bezier(.165, .84, .44, 1)
  }
  .client_link:hover .client_link__notes__content *, .plan_link:hover .plan_link__notes__content * {
    color: #282828
  }
  .client_link__notes__content p, .plan_link__notes__content p {
    margin: .4rem 0
  }
  .client_name, .plan-name {
    margin: 0
  }
  .client_link__notes__content h1, .plan_link__notes__content h1, .client_link__notes__content h2, .plan_link__notes__content h2 {
    font-size: 1rem
  }
  .client_link__notes__content img, .plan_container--link__plan-notes img {
    margin: 1rem 0;
    max-width: 100%;
    border-radius: 3px;
    opacity: .6;
    transition: all .6s cubic-bezier(.165, .84, .44, 1)
  }
  .client_link:hover .client_link__notes__content img, .plan_link:hover .plan_container--link__plan-notes img {
    opacity: 1
  }

  /* Containers */
  .home--container {
    display: grid;
    margin-bottom: 2rem
  }
  .home-top-bar {
    display: flex;
    justify-content: flex-end
  }

  /* Search */
  .search {
    border: none;
    outline-width: 0;
    width: 80%;
    border-bottom: 2px solid #282828;
    padding: .6rem 0;
    margin: 2rem auto 4rem auto;
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
  .wrapper--client-link {
    text-decoration: none
  }

  /* Add New Client */
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
    <modal name="new-client" height="100%" width="100%" :adaptive="true" :clickToClose="false">
      <div class="modal--new-client">
        <div class="wrapper--centered-item">
          <h3>New Client</h3>
          <form name="add_client" class="form_grid add_client" spellcheck="false" @submit.prevent="save(), $modal.hide('new-client'), $parent.willBodyScroll(true)">
            <label><b>Name: </b><input class="input--forms" type="text" autocomplete="name" v-model="new_client.name" required/></label>
            <label><b>Email: </b><input class="input--forms" type="email" autocomplete="email" v-model="new_client.email" required/></label>
            <label><b>Mobile: </b><input class="input--forms" type="tel" inputmode="tel" autocomplete="tel" v-model="new_client.number" minlength="9" maxlength="14" pattern="\d+" /></label>
            <div class="form_buttons">
              <button type="submit">Save</button>
              <button class="cancel" @click.prevent="$modal.hide('new-client'), $parent.willBodyScroll(true)">Close</button>
            </div>
          </form>
        </div>
      </div>
    </modal>
    <p class="text--small grey text--no-clients" v-if="this.$parent.no_clients">No clients added yet :(</p>
    <p class="text--small grey text--loading" v-if="this.$parent.error"><b>{{this.$parent.error}}</b></p>
    <!-- Loop through clients -->
    <div class="home--container" v-if="!this.$parent.no_clients && !this.$parent.error && this.$parent.clients">
      <div class="home-top-bar">
        <button @click="$parent.installPWA()" v-if="$parent.displayMode === 'browser tab' && $parent.canInstall === true">
          Install App
        </button>
        <button @click="$modal.show('new-client'), $parent.willBodyScroll(false)">New Client</button>
      </div>
      <input type="search" rel="search" placeholder="Find a client" class="text--small search" autocomplete="name" aria-label="Find a client" v-model="search"/>
      <p v-if="response !== ''" class="new-msg">{{response}}</p>
      <div class="container--clients">
        <!-- Perform case insensitive search -->
        <router-link
          class="wrapper--client-link"
          :to="'/client/'+clients.client_id+'/'"
          v-show="(!search) || ((clients.name).toLowerCase()).startsWith(search.toLowerCase())"
          :id="'a' + clients.client_id"
          v-for="(clients, index) in $parent.clients" :key="index"
        >
          <client-link class="client_link" :name="clients.name" :email="clients.email" :number="clients.number" :notes="clients.notes"/>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import InlineSvg from 'vue-inline-svg'
  import ClientLink from '../components/clientLink'

  export default {
    components: {
      InlineSvg,
      ClientLink
    },
    data () {
      return {
        response: '',
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

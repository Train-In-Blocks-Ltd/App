<style>
  .client_container p {
    display: inline;
  }
  .client_link {
    border-bottom: 1px solid rgb(
      var(--accessible-color),
      var(--accessible-color),
      var(--accessible-color)
    );
    padding: 1rem 0;
    margin: 0.5rem 0;
    font-size: 1.25rem;
    font-weight: 400;
    display: block
  }
  .client_link:hover {
    text-decoration: none;
    border-bottom: 2px solid rgb(
      var(--accessible-color),
      var(--accessible-color),
      var(--accessible-color)
    );
    margin-bottom: -1px
  }
  .client_container:last-of-type .client_link:hover {
    margin-bottom: calc(0.5rem - 1px)
  }
  .search {
    width: 100%;
    font-size: 1rem;
  }
  .add_new_client_container {
    margin-top: 2rem;
  }
  .add_new_client_container form {
    display: grid;
    grid-template-columns: max-content 1fr;
    align-items: center;
    width: 75%;
    grid-column-gap: 1rem;
  }
  .form_buttons {
    grid-column: span 2;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 2rem;
    max-width: 200px;
  }
  #notes {
    resize: vertical;
    min-height: 2rem;
    height: 4rem;
  }
</style>
<template>
  <div id="home">
    <h1>Explore</h1>
    <p :style="'font-size: 1.5rem'">Welcome back, {{$parent.claims.name}}!</p>
    <p v-if="this.$parent.no_clients">No clients yet. You can add one below.</p>
    <p v-if="this.$parent.loading_clients">Loading clients...</p>
    <div v-if="!this.$parent.no_clients">
      <input type="search" rel="search" placeholder="Search..." class="search" v-model="search"/>
      <div v-for="(clients, index) in $parent.posts"
            :key="index" class="client_container">
        <div v-if="(!search) || clients.name.includes(search)">
          <router-link class="client_link" :to="'/client/'+clients.name">
            <p><b>{{clients.name}}</b></p>
            <p> - </p>
            <p>{{clients.email}}</p>
            <p> - </p>
            <p>{{clients.number}}</p>
          </router-link>
        </div>
      </div>
    </div>
    <button v-if="!creating" id="add_client-link" class="button" v-on:click="creation()">New client</button>
    <p class="response" v-if="!creating">{{response}}</p>
    <div class="add_new_client_container" v-if="creating">
      <h3>Add new client</h3>
      <form name="add_client" v-on:submit="save()" v-on:submit.prevent="onSubmit">
        <label for="name"><b>Name: </b></label><input type="text" id="name" name="name" v-model="new_client.name" required/>
        <label for="email"><b>Email: </b></label><input type="email" id="email" name="email" v-model="new_client.email" required/>
        <label for="number"><b>Number: </b></label><input type="tel" id="number" name="number" v-model="new_client.number" required pattern="[0-9]{11}"/>
        <label for="notes"><b>Notes: </b></label><textarea id="notes" name="notes" v-model="new_client.notes"></textarea>
        <div class="form_buttons">
          <input type="submit" id="save_client-link" class="button" value="Save" />
          <button id="close" class="button" v-on:click="close()">Close</button>
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
    created () {
      this.$parent.setup()
      this.$parent.clients()
    },
    methods: {
      creation () {
        this.creating = true
      },
      close () {
        this.creating = false
        this.response = ''
      },
      async save () {
        await this.$parent.$auth.getUser()
        if (this.$parent.authenticated) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${await this.$auth.getAccessToken()}`
          try {
            const response = await axios.put(`https://api.traininblocks.com/clients/${this.new_client.name}`,
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

            this.response = response.data

            this.$parent.clients()

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
  }
</script>
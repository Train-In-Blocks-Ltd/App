<style>
  #title {
    text-transform: capitalize!important;
    margin-top: -1rem;
    font-weight: bold;
    font-size: 3.75rem;
    text-transform: uppercase;
    letter-spacing: 0.15em;
  }
  h2 {
      font-size: 2.5rem;
      letter-spacing: 0.15em;
      margin: 1.75rem 0;
      margin-top: 4rem;
  }
  .client_info input:not([type="submit"]) {
    background-color: initial!important;
    border: none;
    color: rgb(
      var(--accessible-color),
      var(--accessible-color),
      var(--accessible-color)
    );
    padding: 0;
    font-size: 1rem;
  }
  .client_info textarea {
    background-color: initial!important;
    border: none;
    color: rgb( var(--accessible-color), var(--accessible-color), var(--accessible-color) );
    padding: 0;
    font-size: 1rem;
    margin: 0;
  }
  .client_info {
    display: grid;
    grid-template-columns: max-content;
    grid-gap: 1rem;
  }
  .client_info label {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: min-content minmax(200px, 300px);
    grid-gap: 1rem;
  }
  .client_info input {
    margin: 0;
  }
  .top_grid {
    display: grid;
    grid-template-columns: 1fr 0.25fr;
  }
  .floating_nav {
    text-align: right;
    border-right: 2px solid rgb(
          var(--accessible-color),
          var(--accessible-color),
          var(--accessible-color)
        );
    padding-right: 0.5rem;
  }
  .floating_nav a:first-of-type {
    margin-top: 0;
  }
  .floating_nav a {
    display: block;
    margin: 0.5rem 0;
  }
  #client {
    position: relative;
  }
  #client_notes {
    color: #282828;
    position: absolute;
    right: 0;
    z-index: 9;
    text-align: left;
    max-width: 400px;
    width: 100%;
    box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.15);
    background-color: rgb( var(--red), var(--green), var(--blue) );
    display: grid;
    grid-template-rows: 1fr auto 1fr;
    align-items: center;
  }
  #client_notes_header p {
    font-weight: bold;
  }
  .quill, #client_notes_header p {
    margin: 0;
  }
  #client_notes_header {
    cursor: grab;
    z-index: 10;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    color: rgb(var(--accessible-color), var(--accessible-color), var(--accessible-color));
    padding: 0 0.5rem;
  }
  #client_notes_footer button {
    margin-bottom: 0;
  }
  #client_notes_footer, #client_notes_header {
    height: 100%;
    display: grid;
    align-items: center;
  }
  .loader {
    height: 37px;
    display: grid;
    align-content: center;
  }
  @media (max-width: 768px) {
    h2 {
      font-size: 1.35rem;
    }
    .top_grid {
      grid-template-rows: 1fr 0.25fr;
      grid-template-columns: auto
    }
    .floating_nav {
      text-align: left;
      padding-right: 0;
      padding-top: 0.5rem;
      border: none;
      border-top: 2px solid rgb(
          var(--accessible-color),
          var(--accessible-color),
          var(--accessible-color)
        );
    }
  }
</style>

<template>
    <div id="client" v-if="$parent.client_details">
      <div class="top_grid" v-if="!workout">
        <form class="client_info" v-on:submit.prevent="update_client()">
          <input type="text" id="title" name="name" v-model="$parent.client_details.name" v-on:click="editing()"/>
          <label><b>Email: </b><input type="email" id="email" name="email" v-model="$parent.client_details.email" v-on:click="editing()"/></label>
          <label><b>Number: </b><input type="tel" id="number" name="number" inputmode="tel" v-model="$parent.client_details.number" v-on:click="editing()" minlength="9" maxlength="14"/></label>
          <div class="loading-grid">
            <input v-if="edit" type="submit" class="button" value="Save" />
            <Loader></Loader>
          </div>
          <p v-if="this.clients_update_response"><b>{{clients_update_response}}</b></p>
          <p v-if="this.clients_update_error"><b>{{clients_update_error}}</b></p>
        </form>
        <div>
          <div class="floating_nav">
            <a v-on:click="client_notes_function()" href="javascript:void(0);">Client Notes</a>
            <router-link :to="{name: 'programmes'}">Programmes</router-link>
            <router-link :to="{name: 'results'}">Results</router-link>
          </div>
        </div>
      </div>
      <div v-show="client_notes" id="client_notes">
        <div id="client_notes_header">
          <p>Client Information</p>
        </div>
        <quill v-model="$parent.client_details.notes" output="html" class="quill"></quill>
        <div id="client_notes_footer">
          <div class="loading-grid">
            <button class="button" v-on:click="update_client()">Save</button>
            <Loader></Loader>
          </div>
        </div>
      </div>
      <router-view :key="$route.fullPath"></router-view>
    </div>
</template>

<script>
  import axios from 'axios'
  import Loader from './Loader'

  export default {
    components: {
      Loader
    },
    data: function () {
      return {
        edit: false,
        clients_update_response: '',
        clients_update_error: '',
        no_programmes: false,
        loading_programmes: true,
        client_notes: false,
        workout: false
      }
    },
    async created () {
      var d = new Date()
      var n = d.getTime()
      if ((!localStorage.getItem('firstLoaded')) || (n > (parseFloat(localStorage.getItem('loadTime')) + 1800000))) {
        await this.$parent.setup()
        await this.$parent.clients()
        localStorage.setItem('firstLoaded', true)
        localStorage.setItem('loadTime', n)
      }
      await this.$parent.clients_to_vue()
      await this.get_client_details()
    },
    methods: {
      client_notes_function () {
        this.client_notes = !this.client_notes
        this.dragElement(document.getElementById('client_notes'))
      },
      dragElement (elmnt) {
        let pos1 = 0
        let pos2 = 0
        let pos3 = 0
        let pos4 = 0
        if (document.getElementById(elmnt.id + '_header')) {
          /* if present, the header is where you move the DIV from: */
          document.getElementById(elmnt.id + '_header').onmousedown = dragMouseDown
        } else {
          /* otherwise, move the DIV from anywhere inside the DIV: */
          elmnt.onmousedown = dragMouseDown
        }

        function dragMouseDown (e) {
          e = e || window.event
          e.preventDefault()
          // get the mouse cursor position at startup:
          pos3 = e.clientX
          pos4 = e.clientY
          document.onmouseup = closeDragElement
          // call a function whenever the cursor moves:
          document.onmousemove = elementDrag
        }

        function elementDrag (e) {
          e = e || window.event
          e.preventDefault()
          // calculate the new cursor position:
          pos1 = pos3 - e.clientX
          pos2 = pos4 - e.clientY
          pos3 = e.clientX
          pos4 = e.clientY
          // set the element's new position:
          elmnt.style.top = (elmnt.offsetTop - pos2) + 'px'
          elmnt.style.left = (elmnt.offsetLeft - pos1) + 'px'
        }

        function closeDragElement () {
          /* stop moving when mouse button is released: */
          document.onmouseup = null
          document.onmousemove = null
        }
      },
      async get_client_details () {
        // Loop through clients
        var x
        for (x in this.$parent.posts) {
          // If client matches client in route
          if (this.$parent.posts[x].name === this.$route.params.name) {
            // Set client_details variable with client details
            this.$parent.client_details = this.$parent.posts[x]
            // If client_details.programmes is set to false
            if (this.$parent.posts[x].programmes === false) {
              this.no_programmes = true
            // If client_details.programmes is not set then query the API
            } else if (!this.$parent.posts[x].programmes) {
              axios.defaults.headers.common['Authorization'] = `Bearer ${await this.$auth.getAccessToken()}`
              // eslint-disable-next-line
              const response_programmes = await axios.get(`https://api.traininblocks.com/programmes/${this.$parent.posts[x].client_id}`)
              // If there are no programmes
              if (response_programmes.data.length === 0) {
                this.no_programmes = true
                this.$parent.posts[x].programmes = false
                // If there are programmes set the posts to include programmes
              } else {
                this.$parent.posts[x].programmes = response_programmes.data
              }
              // Update the localstorage with the programmes
              localStorage.setItem('posts', JSON.stringify(this.$parent.posts))
            }
            this.$parent.client_details = this.$parent.posts[x]
            this.loading_programmes = false
          }
        }
      },
      async update_client () {
        this.$parent.loading = true
        axios.defaults.headers.common['Authorization'] = `Bearer ${await this.$auth.getAccessToken()}`
        try {
          // eslint-disable-next-line
          const response_update_clients = await axios.post(`https://api.traininblocks.com/clients`,
            {
              'id': this.$parent.client_details.client_id,
              'name': this.$parent.client_details.name,
              'email': this.$parent.client_details.email,
              'number': this.$parent.client_details.number,
              'notes': this.$parent.client_details.notes
            }
          )
          await this.$parent.clients()
          await this.get_client_details()
          this.clients_update_response = response_update_clients.data
          this.$parent.loading = false
          this.edit = false
          await this.$parent.clients_to_vue()
        } catch (e) {
          this.clients_update_error = e.toString()
        }
      },
      editing () {
        this.edit = true
      }
    }
  }
</script>
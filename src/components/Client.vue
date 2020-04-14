<style scoped>
  #title {
    text-transform: capitalize!important;
    margin-top: -1rem;
    margin-bottom: 5rem;
    font-weight: bold;
    font-size: 3.75rem;
    text-transform: uppercase;
    letter-spacing: 0.15em;
  }
  h2 {
      font-size: 2.5rem;
      letter-spacing: 0.15em;
      margin: 1.75rem 0;
  }
  .client_info {
    display: grid;
    grid-template-columns: max-content;
  }
  .client_info label {
    display: block;
  }
  .program_wrapper {
    display: grid;
    grid-template-columns: repeat(auto-fill, 300px);
    grid-gap: 40px;
  }
  .program_container:first-of-type {
    margin-left: 0;
  }
  .program_container:last-of-type {
    margin-right: 0;
  }
  .program_link {
    padding: 1.5rem;
    border: 1px solid rgb(
      var(--accessible-color),
      var(--accessible-color),
      var(--accessible-color));
    display: block;
  }
  .program_link:hover { 
    text-decoration: none;
    border: 2px solid rgb(
      var(--accessible-color),
      var(--accessible-color),
      var(--accessible-color));
    padding: calc(1.5rem - 1px);
  }
  .program_container h3 {
    margin-top: 0;
    font-size: 1.25rem;
    margin-bottom: 0;
  }
  .desc {
    margin-bottom: 1.25rem!important;
  }
  .program_container p {
    font-size: 0.625rem;
    font-weight: 500;
    margin: 0.375rem 0;
  }
  .program_container p:last-of-type {
    margin-bottom: 0;
  }
  #add_programme_link {
    margin-top: 1.75rem;
  }
  #duration, #date {
    width: auto
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
  @media (max-width: 768px) {
    h2 {
      font-size: 1.35rem;
    }
  }
</style>

<template>
    <div id="client" v-if="this.$parent.client_details">
      <form class="client_info" v-on:submit.prevent="update_client()">
        <input type="text" id="title" name="name" v-model="this.$parent.client_details.name" v-on:click="editing()"/>
        <label><b>Email: </b><input type="email" id="email" name="email" v-model="this.$parent.client_details.email" v-on:click="editing()"/></label>
        <label><b>Number: </b><input type="tel" id="number" name="number" v-model="this.$parent.client_details.number" required pattern="[0-9]{11}" v-on:click="editing()"/></label>
        <label><b>Notes: </b><input type="text" name="notes" v-model="this.$parent.client_details.notes" required v-on:click="editing()"/></label>
        <div><input v-if="edit" type="submit" class="button" value="Save" /></div>
      </form>
      <p v-if="this.clients_update_response"><b>{{clients_update_response}}</b></p>
      <p v-if="this.clients_update_error"><b>{{clients_update_error}}</b></p>
      <h2>Programmes</h2>
      <p v-if="this.no_programmes">No programmes yet. You can add one below.</p>
      <p v-if="this.loading_programmes">Loading programmes...</p>
      <p v-if="this.error"><b>{{error}}</b></p>
      <div v-if="!this.no_programmes && !this.error" class="program_wrapper">
        <div v-for="(programme, index) in this.$parent.client_details.programmes"
          :key="index" class="program_container">
          <router-link class="program_link" :to="$route.params.name+'/programme/'+programme.id">
            <h3>{{programme.name}}</h3>
            <p class="desc">"{{programme.description}}"</p>
            <p><b>Duration: </b>{{programme.duration}}</p>
            <p><b>Start: </b>{{programme.start}}</p>
          </router-link>
        </div>
      </div>
      <button v-if="!creating" id="add_programme_link" class="button" v-on:click="creation()">New programme</button>
      <p class="response" v-if="!creating">{{response}}</p>
      <div class="add_new_programme_container" v-if="creating">
          <h3>Add new programme</h3>
          <form name="add_program" class="form_grid" v-on:submit.prevent="save()">
              <label for="name"><b>Name: </b></label><input type="text" id="name" name="name" v-model="new_programme.name" required/>
              <label for="description"><b>Description: </b></label><input type="text" id="description" name="description" v-model="new_programme.desc" required/>
              <label for="duration"><b>Duration (in weeks): </b></label><input type="number" id="duration" name="duration" v-model="new_programme.duration" required/>
              <label for="start"><b>Start: </b></label><input type="date" id="start" name="start" v-model="new_programme.start" required />
              <label for="notes">
                <b>Notes: </b>
              </label>
              <ResizeAuto>
                <template v-slot:default="{resize}">
                  <textarea id="notes" name="notes" v-model="new_programme.notes"></textarea>
                </template>
              </ResizeAuto>
              <div class="form_buttons">
                  <input type="submit" class="button" value="Save" />
                  <button class="button" v-on:click="close()">Close</button>
              </div>
          </form>
      </div>
    </div>
</template>

<script>
  import axios from 'axios'
  import qs from 'qs'
  import ResizeAuto from "./ResizeAuto"
  export default {
    components: {
      ResizeAuto
    },
    data: function () {
      return {
        edit: false,
        error: '',
        no_programmes: false,
        loading_programmes: true,
        response: '',
        creating: false,
        clients_update_response: '',
        clients_update_error: '',
        new_programme: {
          name: '',
          desc: '',
          duration: '',
          start: '',
          notes: ''
        }
      }
    },
    async created () {
      await this.get_programmes()
    },
    methods: {
      async update_client () {
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
          await this.$parent.clients_to_vue()
          await this.get_client_details()
          this.clients_update_response = response_update_clients.data
        } catch (e) {
          this.clients_update_error = e.toString()
        }
      },
      editing () {
        this.edit = true
      },
      async get_programmes () {
        axios.defaults.headers.common['Authorization'] = `Bearer ${await this.$auth.getAccessToken()}`
        try {
          if (!(typeof this.$parent.posts === 'object' && this.$parent.posts !== null) || this.$parent.posts == null) {
            await this.$parent.clients_to_vue()
          }
          var x
          for (x in this.$parent.posts) {
            if (this.$parent.posts[x].name === this.$route.params.name) {
              if (!this.$parent.posts[x].programmes) {
                // eslint-disable-next-line
                const response_programmes = await axios.get(`https://api.traininblocks.com/programmes/${this.$parent.posts[x].client_id}`)
                if (response_programmes.data.length === 0) {
                  this.no_programmes = true
                }
                this.$parent.posts[x].programmes = response_programmes.data
                localStorage.setItem('posts', JSON.stringify(this.$parent.posts))
              }
              this.$parent.client_details = this.$parent.posts[x]
            }
          }
          this.loading_programmes = false
        } catch (e) {
          this.no_programmes = false
          this.loading_programmes = false
          this.error = e.toString()
        }
      },
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
            // eslint-disable-next-line
            const response_save_programmes = await axios.put(`https://api.traininblocks.com/programmes/${this.new_programme.name}`,
              qs.stringify({
                client_id: this.$parent.client_details.client_id,
                desc: this.new_programme.desc,
                duration: this.new_programme.duration,
                start: this.new_programme.start,
                notes: this.new_programme.notes
              }),
              {
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                  'Authorization': `Bearer ${await this.$auth.getAccessToken()}`
                }
              }
            )
            // eslint-disable-next-line
            this.response = response_save_programmes.data

            var x
            for (x in this.$parent.posts) {
              if (this.$parent.posts[x].name === this.$route.params.name) {
                this.$parent.posts[x].programmes = null
              }
            }
            this.get_programmes()

            this.close()

            this.new_programme = {
              name: '',
              desc: '',
              duration: '',
              start: '',
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
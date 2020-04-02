<style scoped>
  h1 {
      text-transform: capitalize
  }
  h2 {
      font-size: 2.5rem;
      letter-spacing: 0.15em;
      margin: 1.75rem 0;
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
  @media (max-width: 768px) {
    h2 {
      font-size: 1.35rem;
    }
  }
</style>

<template>
    <div id="client">
        <h1>{{ $route.params.name }}</h1>
        <div v-for="(clients, index) in this.$parent.posts"
            :key="index">
            <div v-if="clients.name == $route.params.name" class="client_info">
                <label><b>Email: </b><input type="email" id="email" name="email" v-model="clients.email"/></label>
                <label><b>Number: </b><input type="tel" id="number" name="number" v-model="clients.number" required pattern="[0-9]{11}"/></label>
                <label><b>Notes: </b><input type="text" id="notes" name="notes" v-model="clients.notes" required/></label>
            </div>
      </div>
      <h2>Programmes</h2>
      <p v-if="this.no_programmes">No programmes yet. You can add one below.</p>
      <p v-if="this.loading_programmes">Loading programmes...</p>
      <p v-if="this.error"><b>{{error}}</b></p>
      <div v-if="!this.no_programmes && !this.error" class="program_wrapper">
        <div v-for="(programme, index) in this.programmes"
          :key="index" class="program_container">
          <router-link class="program_link" :to="'/programmes/'+programmes.id">
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
                <label for="duration"><b>Duration (in weeks): </b></label><input type="number" id="duration" name="duration" v-model="new_programme.duration" required />
                <label for="start"><b>Start: </b></label><input type="date" id="start" name="start" v-model="new_programme.start" required />
                <label for="notes"><b>Notes: </b></label><textarea id="notes" name="notes" v-model="new_programme.notes"></textarea>
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
  export default {
    data: function () {
      return {
        programmes: {},
        error: '',
        no_programmes: false,
        loading_programmes: true,
        response: '',
        creating: false,
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
    watch: {
    // call again the method if the route changes
      '$route': 'get_programmes'
    },
    methods: {
      async client_id () {
        if (!(typeof this.$parent.posts === 'object' && this.$parent.posts !== null) || this.$parent.posts == null) {
          await this.$parent.clients_to_vue()
        }
        var x
        for (x in this.$parent.posts) {
          if (this.$parent.posts[x].name === this.$route.params.name) {
            return this.$parent.posts[x].client_id
          }
        }
      },
      async get_programmes () {        
        if (this.$parent.authenticated) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${await this.$auth.getAccessToken()}`
          try {
            // eslint-disable-next-line
            const response_programmes = await axios.get(`https://api.traininblocks.com/programmes/${await this.client_id()}`)
            if (response_programmes.data.length === 0) {
              this.no_programmes = true
            } else {
              this.programmes = response_programmes.data
            }
            this.loading_programmes = false
          } catch (e) {
            this.no_programmes = false
            this.loading_programmes = false
            this.error = e.toString()
          }
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
                client_id: await this.client_id(),
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
<style scoped>
    h1 {
        text-transform: capitalize
    }
    h2 {
        font-size: 2.5rem;
        letter-spacing: 0.15em;
    }
</style>

<template>
    <div id="client">
        <h1>{{ $route.params.name }}</h1>
        <div v-for="(clients, index) in this.$parent.posts"
            :key="index">
            <div v-if="clients.name == $route.params.name">
                <p><b>Email: </b>{{clients.email}}</p>
                <p><b>Number: </b>{{clients.number}}</p>
                <p><b>Notes: </b>{{clients.notes}}</p>
            </div>
      </div>
      <h2>Programmes</h2>
      <p v-if="this.no_programmes">No programmes yet. You can add one below.</p>
      <p v-if="this.loading_programmes">Loading programmes...</p>
      <p v-if="this.error"><b>{{error}}</b></p>
      <div v-if="!this.no_programmes && !this.error">
        <div v-for="(programme, index) in this.programmes"
              :key="index">
              <div class="program_container">
                  <h3>{{programme.name}}</h3>
                  <p class="desc">{{programme.desc}}</p>
                  <p><b>Duration: </b>{{programme.duration}}</p>
                  <p><b>Start: </b>{{programme.start}}</p>
              </div>
        </div>
      </div>
      <button v-if="!creating" id="add_programme-link" class="button" v-on:click="creation()">New programme</button>
        <p class="response" v-if="!creating">{{response}}</p>
        <div class="add_new_programme_container" v-if="creating">
            <h3>Add new programme</h3>
            <form name="add_programme" v-on:submit.prevent="save()">
                <label for="name"><b>Name: </b></label><input type="text" id="name" name="name" v-model="new_programme.name" required/>
                <label for="description"><b>Description: </b></label><input type="text" id="description" name="description" v-model="new_programme.desc" required/>
                <p><label for="duration"><b>Duration: </b></label><input type="number" id="duration" name="duration" v-model="new_programme.duration" required />weeks</p>
                <label for="start"><b>Start: </b></label><input type="date" id="start" name="start" v-model="new_programme.start" required />
                <label for="notes"><b>Notes: </b></label><textarea id="notes" name="notes" v-model="new_programme.notes"></textarea>
                <div class="form_buttons">
                    <input type="submit" id="save_programme-link" class="button" value="Save" />
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
    created () {
      this.get_programmes()
    },
    methods: {
      async client_id () {
        await this.$parent.clients()
        var x
        for (x in this.$parent.posts) {
          if (this.$parent.posts[x].name === this.$route.params.name) {
            return this.$parent.posts[x].client_id
          } else {
            break
          }
        }
      },
      async get_programmes () {
        await this.$parent.$auth.getUser()
        if (this.$parent.authenticated) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${await this.$auth.getAccessToken()}`
          try {
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
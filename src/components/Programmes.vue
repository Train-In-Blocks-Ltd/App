<style scoped>

</style>

<template>
    <div id="client">
      <form class="client_info" v-on:submit.prevent="update_client()">
        <input type="text" id="title" name="name" v-model="client_details.name" v-on:click="editing()"/>
        <label><b>Email: </b><input type="email" id="email" name="email" v-model="client_details.email" v-on:click="editing()"/></label>
        <label><b>Number: </b><input type="tel" id="number" name="number" v-model="client_details.number" required pattern="[0-9]{11}" v-on:click="editing()"/></label>
        <label><b>Notes: </b><input type="text" name="notes" v-model="client_details.notes" required v-on:click="editing()"/></label>
        <input v-if="edit" type="submit" class="button" value="Save" />
      </form>
      <p v-if="this.clients_update_response"><b>{{clients_update_response}}</b></p>
      <p v-if="this.clients_update_error"><b>{{clients_update_error}}</b></p>
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
        edit: false,
        programmes: {},
        error: '',
        no_programmes: false,
        loading_programmes: true,
        response: '',
        creating: false,
        clients_update_response: '',
        clients_update_error: '',
        client_details: {},
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
      this.get_client_details()
      await this.get_programmes()
    },
    methods: {
      async update_client () {
        axios.defaults.headers.common['Authorization'] = `Bearer ${await this.$auth.getAccessToken()}`
        try {
          // eslint-disable-next-line
          const response_update_clients = await axios.post(`https://api.traininblocks.com/clients`,
            {
              'id': this.client_details.client_id,
              'name': this.client_details.name,
              'email': this.client_details.email,
              'number': this.client_details.number,
              'notes': this.client_details.notes
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
      async get_client_details () {
        if (!(typeof this.$parent.posts === 'object' && this.$parent.posts !== null) || this.$parent.posts == null) {
          await this.$parent.clients_to_vue()
        }
        var x
        for (x in this.$parent.posts) {
          if (this.$parent.posts[x].name === this.$route.params.name) {
            this.client_details = this.$parent.posts[x]
          }
        }
      },
      async get_programmes () {
        axios.defaults.headers.common['Authorization'] = `Bearer ${await this.$auth.getAccessToken()}`
        try {
          // eslint-disable-next-line
          const response_programmes = await axios.get(`https://api.traininblocks.com/programmes/${this.client_details.client_id}`)
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
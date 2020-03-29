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
      <div v-for="(programme, index) in this.programmes"
            :key="index">
            <div class="program_container">
                <h3>{{programme.name}}</h3>
                <p class="desc">{{programme.desc}}</p>
                <p><b>Duration: </b>{{programme.duration}}</p>
                <p><b>Start: </b>{{programme.start}}</p>
            </div>
      </div>
      <button v-if="!creating" id="add_programme-link" class="button" v-on:click="creation()">New programme</button>
        <p class="response" v-if="!creating">{{response}}</p>
        <div class="add_new_programme_container" v-if="creating">
            <h3>Add new programme</h3>
            <form name="add_programme" v-on:submit="save()" v-on:submit.prevent="onSubmit">
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
            const response = await axios.put(`https://api.traininblocks.com/programmes/${this.programmes.name}`,
              qs.stringify({
                pt_id: this.$parent.claims.sub,
                // client_id: this.$parent.posts.filter(function (e) { return e.name === this.this.$route.params.name }),
                name: this.new_programme.name,
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

            this.response = response.data

            this.$parent.clients()

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
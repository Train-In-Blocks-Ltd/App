<style scoped>
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
  .add_new_programme_container {
    margin: 0.75rem 0;
  }
</style>
<template>
    <div>
      <h2>Blocks</h2>
      <p v-if="this.$parent.no_programmes">No programmes yet. You can add one below.</p>
      <p v-if="this.$parent.loading_programmes">Loading programmes...</p>
      <p v-if="this.error"><b>{{error}}</b></p>
      <div v-if="!this.$parent.no_programmes && !this.error" class="program_wrapper">
        <div v-for="(programme, index) in this.$parent.$parent.client_details.programmes"
            :key="index" class="program_container">
            <router-link class="program_link" :to="'programme/'+programme.id">
            <h3>{{programme.name}}</h3>
            <p><b>Duration: </b>{{programme.duration}}</p>
            <p><b>Start: </b>{{programme.start}}</p>
            </router-link>
        </div>
      </div>
      <button v-if="!creating" id="add_programme_link" class="button" v-on:click="creation()">New Block</button>
      <p class="response" v-if="!creating">{{response}}</p>
      <div class="add_new_programme_container" v-if="creating">
        <h3 class="add-new">New Block Incoming...</h3>
        <form name="add_program" v-on:submit.prevent="save()">
            <input type="text" id="name" class="input-small" name="name" autocomplete="off" placeholder="Name" spellcheck="false" v-model="new_programme.name" required/><br>
            <input type="number" id="duration" class="input-xsmall" name="duration" autocomplete="off" placeholder="Weeks" spellcheck="false" inputmode="decimal" v-model="new_programme.duration" required/>
            <input type="date" id="start" class="input-xsmall" name="start" autocomplete="off" spellcheck="false" v-model="new_programme.start" required /><br>
            <div class="form_buttons">
                <input type="submit" class="button" value="Save" />
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
  import ResizeAuto from './ResizeAuto'
  import Loader from './Loader'

  export default {
    components: {
      ResizeAuto,
      Loader
    },
    data: function () {
      return {
        error: '',
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
        try {
          this.$parent.$parent.loading = true
          // eslint-disable-next-line
          const response_save_programmes = await axios.put(`https://api.traininblocks.com/programmes/${this.new_programme.name}`,
            qs.stringify({
              client_id: this.$parent.$parent.client_details.client_id,
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
          
          // Set old programmes to null so that they can be repopulated
          var x
          for (x in this.$parent.$parent.posts) {
            if (this.$parent.$parent.posts[x].name === this.$route.params.name) {
              this.$parent.$parent.posts[x].programmes = null
            }
          }
          // Get the new programmes
          await this.$parent.get_client_details()

          this.$parent.$parent.loading = false

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
</script>
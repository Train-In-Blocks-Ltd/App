<style scoped>
  h1 {
    margin-bottom: 0;
    text-transform: capitalize;
  }
  .programme_info {
    display: grid;
    grid-template-columns: max-content;
  }
  .programme_info input:not([type="submit"]), #notes {
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
  #title, h3 {
    font-size: 1.25rem;
    font-weight: bold;
  }
  #duration {
    width: 4ch;
  }
  .programme_grid {
    display: grid;
    grid-template-areas: "table notes";
    grid-template-columns: 1fr 0.33fr;
    grid-gap: 2rem;
  }
  .notes {
    grid-area: notes;
    padding-left: 1rem;
    border-left: 3px solid rgb(
      var(--accessible-color),
      var(--accessible-color),
      var(--accessible-color)
    )
  }
  .notes form label b {
    display: block;
    font-size: 1.25rem;
  }
  .notes form textarea {
    display: block;
    width: 100%;
    resize: vertical;
  }
  #title, #description {
    background-color: initial!important;
    border: none;
    color: rgb( var(--accessible-color), var(--accessible-color), var(--accessible-color) );
    padding: 0;
  }
  .client_info label {
    grid-auto-columns: min-content;
    grid-gap: 0;
  }
  .add_new_workout_container .quill {
    margin: 0.75rem 0;
    background-color: rgba( calc(var(--red) + 45), calc(var(--green) + 45), calc(var(--blue) + 45), 0.8 );
  }
  .programme_info {
    grid-gap: 0.5rem;
  }
  #title {
    margin-top: 0;
  }
  #duration, #start {
    margin-left: 0.25rem;
  }
  .programme_grid {
    margin-top: 2.5rem;
  }
  .programme_table > *, .programme_duration_container > * {
    border: 1px solid rgb(
          var(--accessible-color),
          var(--accessible-color),
          var(--accessible-color)
        );
    padding: 1rem;
    display: grid;
    place-items: center;
    font-weight: bold;
    width: 100%;
  }
  .programme_duration_container {
    display: grid;
    grid-auto-flow: column;
    border: none;
    padding: 0;
  }
</style>

<template>
    <div id="programme">
        <div v-for="(programme, index) in this.$parent.$parent.client_details.programmes"
          :key="index">
          <div v-if="programme.id == $route.params.id">
            <div class="top_grid">
              <div class="client_info">
                <h1>{{$route.params.name}}</h1>
                <form class="programme_info" v-on:submit.prevent="update_programme()">
                  <ResizeAuto>
                    <template v-slot:default="{resize}">
                      <textarea type="text" id="title" name="name" v-model="programme.name" v-on:click="editing()" @input="resize" rows="1"></textarea>
                    </template>
                  </ResizeAuto>
                  <ResizeAuto>
                    <template v-slot:default="{resize}">
                    <textarea type="text" id="description" name="description" v-model="programme.description" v-on:click="editing()" @input="resize" rows="1"></textarea>
                    </template>
                  </ResizeAuto>
                  <label style="margin-top: 1rem"><b>Duration: </b><input type="number" id="duration" name="duration" v-model="programme.duration" required v-on:click="editing()"/> weeks</label>
                  <label style="align-items: end"><b>Start: </b><input type="date" id="start" name="start" v-model="programme.start" required v-on:click="editing()"/></label>
                  <div class="loading-grid" v-if="edit">
                    <input type="submit" class="button" value="Save" />
                    <Loader></Loader>
                  </div>
                  <p v-if="programme_update_response"><b>{{programme_update_response}}</b></p>
                  <p v-if="programme_update_error"><b>{{programme_update_error}}</b></p>
                </form>
              </div>  <!-- client_info -->
              <div class="floating_nav_container">
                <div class="floating_nav">
                  <a v-on:click="$parent.client_notes_function()" href="javascript:void(0);">Client Notes</a>
                  <router-link :to="{name: 'programmes'}">Programme</router-link>
                  <router-link :to="{name: 'results'}">Results</router-link>
                </div>
              </div>  <!-- floating_nav_container -->
            </div> <!-- top_grid -->
            <div class="programme_grid">
              <div class="programme_table">
                <div class="programme_name">
                  <p>{{programme.name}}</p>
                </div>
                <div class="programme_duration_container">
                  <div v-for="item in programme_duration(programme.duration)" :key="item">
                    {{item}}
                  </div>
                </div>
              </div> <!-- programme_table -->
              <div class="notes" v-on:click="editing1()">
                <div id="workout_notes_header">
                  <p>Programme Notes</p>
                  <h3>Data & Statistics</h3>
                </div>
                <quill v-model="programme.notes" output="html" class="quill"></quill>
                <div id="workout_notes_footer">
                  <div class="loading-grid" v-if="edit1">
                    <button class="button" v-on:click="update_programme()">Save</button>
                    <Loader></Loader>
                  </div>
                </div>
                <p v-if="programme1_update_response"><b>{{programme1_update_response}}</b></p>
                <p v-if="programme1_update_error"><b>{{programme1_update_error}}</b></p>
              </div>  <!-- notes -->
            </div> <!-- programme_grid -->
            <div class="workouts">
              <h3>Workouts</h3>
              <button v-if="!creating" id="add_workout_link" class="button" v-on:click="creation()">New workout</button>
              <p class="response" v-if="!creating">{{response}}</p>
              <div class="add_new_workout_container" v-if="creating">
                <h3>Add new workout</h3>
                <form name="add_program" class="form_grid" v-on:submit.prevent="save()">
                    <label for="name"><b>Name: </b></label><input type="text" id="name" name="name" v-model="new_workout.name" required />
                    <label for="date"><b>Date: </b></label><input type="date" id="date" name="date" v-model="new_workout.date" required />
                    <label style="margin: 1.5rem 0; align-self:start"><b>Content: </b></label>
                    <quill v-model="new_workout.notes" output="html" class="quill"></quill>
                    <div class="form_buttons">
                        <input type="submit" class="button" value="Save" />
                        <button class="button" v-on:click="close()">Close</button>
                        <Loader></Loader>
                    </div>
                </form>
              </div>
            </div> <!-- workouts -->
          </div>
        </div>
    </div>
</template>

<script>
  import ResizeAuto from './ResizeAuto'
  import Loader from './Loader'
  import axios from 'axios'
  import qs from 'qs'

  export default {
    components: {
      ResizeAuto,
      Loader
    },
    data: function () {
      return {
        creating: false,
        response: '',
        edit: false,
        edit1: false,
        programme_update_response: '',
        programme_update_error: '',
        programme1_update_response: '',
        programme1_update_error: '',
        new_workout: {
          name: '',
          date: '',
          notes: ''
        }
      }
    },
    async created () {
      this.get_workouts()
      this.$parent.workout = true
    },
    methods: {
      programme_duration (duration) {
        const arr = []
        let i
        for (i = 1; i < parseInt(duration, 10)+1; i++) {
          arr.push(i)
        }
        return arr
      },
      async update_programme () {

      },
      editing () {
        this.edit1 = false
        this.edit = true
      },
      editing1 () {
        this.edit = false
        this.edit1 = true
      },
      creation () {
        this.creating = true
      },
      close () {
        this.creating = false
        this.response = ''
      },
      async get_workouts () {

      },
      async update_workout () {

      },
      async save () {
        await this.$parent.$parent.$auth.getUser()
        if (this.$parent.$parent.authenticated) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${await this.$auth.getAccessToken()}`
          try {
            this.$parent.$parent.loading = true
            // eslint-disable-next-line
            const response_save_workouts = await axios.put(`https://api.traininblocks.com/workouts/${this.new_workout.name}`,
              qs.stringify({
                programme_id: $route.params.id,
                date: this.new_workout.date,
                notes: this.new_workout.notes
              }),
              {
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                  'Authorization': `Bearer ${await this.$auth.getAccessToken()}`
                }
              }
            )
            // eslint-disable-next-line
            this.response = response_save_workouts.data
            /*

            var x
            for (x in this.$parent.$parent.posts) {
              if (this.$parent.$parent.posts[x].name === this.$route.params.name) {
                this.$parent.$parent.posts[x].programmes = null
              }
            }
            await this.get_programmes()

            */

            this.$parent.$parent.loading = false

            this.close()

            this.new_workout = {
              name: '',
              date: '',
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
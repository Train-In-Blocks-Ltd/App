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
    grid-template-areas: 
    "table notes"
    "workouts notes";
    grid-template-columns: 1fr 1fr;
    grid-gap: 2rem;
  }
  .notes {
    grid-area: notes;
    padding-left: 2rem;
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
  .programme_table {
    overflow-x: auto ;
  }
  .programme_container {
    margin-bottom: 5px;
  }
  .programme_table > *, .programme_duration_container > * {
    border: 1px solid rgb(
          var(--accessible-color),
          var(--accessible-color),
          var(--accessible-color)
        );
    display: inline-block;
    font-weight: bold;
    text-align: center  ;
  }
  .programme_duration_container > * {
    border-left: none;
    border-bottom: none;
    padding: 30px 0px;
    width: 40px;
  }
  .programme_duration_container > *:last-of-type {
    border-right: none;
  }
  .programme_duration_container > *:hover {    
    box-shadow: inset 0px 20px 30px -30px rgba(
          var(--accessible-color),
          var(--accessible-color),
          var(--accessible-color),
          0.5);
    cursor: pointer;
  }
  .programme_duration_container {
    display: grid;
    grid-auto-flow: column;
    border: none;
    padding: 0;
  }
  #workout_notes {
    position: absolute;
    right: 0;
    top: 0;
    z-index: 9;
    text-align: left;
    max-width: 400px;
    width: 100%;
    box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.15);
    background-color: rgb( var(--red), var(--green), var(--blue) );
    display: grid;
    grid-template-rows: 40px auto;
    align-items: center;
  }
  #workout_notes_header p {
    margin: 0;
  }
  #workout_notes_header {
    cursor: grab;
    z-index: 10;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    color: rgb(var(--accessible-color), var(--accessible-color), var(--accessible-color));
    padding: 0 0.5rem;
  }
  #workout_notes_footer button {
    margin-bottom: 0;
  }
  #workout_notes_footer, #workout_notes_header {
    height: 100%;
    display: grid;
    align-items: center;
  }
  .workouts {
    grid-area: workouts
  }
  .workout {
    display: block;
    border-bottom: 1px solid rgb(var(--accessible-color), var(--accessible-color), var(--accessible-color));
    padding: 0.5rem 0;
    cursor: pointer;
    width: 20vw;

    transition: width 1500ms;
    transition-timing-function: cubic-bezier(0.075, 0.82, 0.165, 1);
  }
  .workout:hover {
    width: 25vw;
  }
  .client-info--workout {
    height: auto; 
    margin: 0; 
    font-size: 1em;
  }
  .label--workout {
    align-items: end;
    display: inline-block;
  }
  .label--workout > select {
    background: transparent;
    border: none;
    border-bottom: 1px solid rgb(
      var(--accessible-color),
      var(--accessible-color),
      var(--accessible-color));
    width: 50%;

  }
  .label--workout > select:hover {
    cursor: pointer;
  }
  .label--workout input, .label--workout select {
    font-size: 1em;
  }

  #programme_notes_header > p {
    display: block;
    margin: 0.5rem 0;
    position: relative;
    width: fit-content;

    color: rgb(
      var(--accessible-color),
      var(--accessible-color),
      var(--accessible-color));;
    text-decoration: none;
  }
  #programme_notes_header > p:hover {
    color: rgb(
      var(--accessible-color),
      var(--accessible-color),
      var(--accessible-color));;
    cursor: pointer;
  }
  #programme_notes_header > p:before {
    content: "";
    position: absolute;
    width: 0%;
    height: 1px;
    bottom: 0;
    left: 0;
    background-color: rgb(
      var(--accessible-color),
      var(--accessible-color),
      var(--accessible-color));

    visibility: hidden;
    transition: all 0.3s;
    transition-timing-function: cubic-bezier(0.075, 0.82, 0.165, 1);
  }
  #programme_notes_header > p:hover:before {
    visibility: visible;
    width: 100%;
  }
</style>

<template>
    <div id="programme">
       <!-- Loop through programmes and v-if programme matches route so that programme data object is available throughout -->
      <div v-for="(programme, index) in this.$parent.$parent.client_details.programmes"
        :key="index">
        <div v-if="programme.id == $route.params.id">
          <div class="top_grid">
            <div class="client_info">
              <h1>{{$route.params.name}}</h1>
               <!-- Update the programme info -->
              <form class="programme_info" v-on:submit.prevent="update_programme()">
                <ResizeAuto>
                  <template v-slot:default="{resize}">
                    <textarea type="text" id="title" name="name" v-model="programme.name" v-on:click="editing()" @input="resize" rows="1"></textarea>
                  </template>
                </ResizeAuto>
                <label class="label--workout">Duration: <input type="number" id="duration" class="client-info--workout" name="duration" inputmode="decimal" v-model="programme.duration" required v-on:click="editing()"/></label>
                <label class="label--workout">Start: <input type="date" id="start" class="client-info--workout" name="start" v-model="programme.start" required v-on:click="editing()"/></label>
                <label class="label--workout">Follow to: 
                  <select>
                    <option>Select a Block</option>
                  </select>
                </label>
                <div class="loading-grid" v-if="edit">
                  <input style="margin: 1rem 0 0.5rem 0" type="submit" class="button" value="Save" />
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
              <div class="programme_container">
                <p style="margin: 30px 0px">{{programme.name}}</p>
                <div class="programme_duration_container">
                  <div v-for="item in programme_duration(programme.duration)" :key="item">
                    {{item}}
                  </div>
                </div>
              </div>
            </div> <!-- programme_table -->
            <div class="workouts">
              <h3>Workouts</h3>
              <p v-if="no_workouts">No workouts yet. You can add one below.</p>
              <p v-if="loading_workouts">Loading workouts...</p>
              <p v-if="error"><b>{{error}}</b></p>
              <div class="workout_wrapper">
                <div v-if="!no_workouts && !error">
                  <!-- Loop through workouts -->
                  <div v-for="(workout, index) in programme.workouts"
                    :key="index">
                    <!-- Open the notes in a popup when clicked -->
                    <p v-on:click="workout_notes_function(workout.id)" class="workout">
                      <span><b>{{workout.name}}</b></span>
                      -
                      <span>{{day(workout.date)}}</span>
                      -
                      <span>{{workout.date}}</span>
                    </p>
                    <div v-show="workout_notes" id="workout_notes">
                      <div id="workout_notes_header">
                        <p>
                          <span><b>{{workout.name}}</b></span>
                          -
                          <span>{{day(workout.date)}}</span>
                          -
                          <span>{{workout.date}}</span>
                        </p>
                      </div>
                      <quill v-model="workout.notes" output="html" class="quill"></quill>
                    </div>
                  </div>
                </div>
                 <!-- Add a new workout -->
                <button v-if="!creating" id="add_workout_link" class="button" v-on:click="creation()">New workout</button>
                <p class="response" v-if="!creating">{{response}}</p>
                <div class="add_new_workout_container" v-if="creating">
                  <h3>Add new workout</h3>
                  <form name="add_program" class="form_grid" v-on:submit.prevent="save()">
                    <label for="name"><b>Name: </b></label><input type="text" id="name" name="name" v-model="new_workout.name" required />
                    <label for="date"><b>Date: </b></label><input type="date" id="date" name="date" v-model="new_workout.date" required />
                    <div class="form_buttons">
                        <input type="submit" class="button" value="Save" />
                        <button class="button" v-on:click="close()">Close</button>
                        <Loader></Loader>
                    </div>
                  </form>
                </div>
              </div>
            </div><!-- workouts -->
            <div class="notes" v-on:click="editing1()">
              <div id="programme_notes_header">
                <p>Block Notes</p>
                <h3>Statistics</h3>
              </div>
              <div style="background-color: #c4c4c4; height: 50vh; text-align: center; line-height: 50vh;">Graph and data goes here!!</div>
              
              <!--Reverted but need to turn this into a pop-up. 
              It's now called block notes and the button to open it is above.

              <quill v-model="programme.notes" output="html" class="quill border"></quill>
              <div id="programme_notes_footer">
                <div class="loading-grid" v-if="edit1">
                  <button class="button" v-on:click="update_programme()">Save</button>
                  <Loader></Loader>
                </div>
              </div>  -->

              <p v-if="programme1_update_response"><b>{{programme1_update_response}}</b></p>
              <p v-if="programme1_update_error"><b>{{programme1_update_error}}</b></p>
            </div>  <!-- notes -->
          </div> <!-- programme_grid -->
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
        no_workouts: false,
        loading_workouts: true,
        error: '',
        workout_notes: false,
        new_workout: {
          name: '',
          date: '',
          notes: ''
        }
      }
    },
    async created () {
      await this.get_workouts()
      this.$parent.workout = true
    },
    methods: {
      day (date) {
        var weekday = new Array(7)
        weekday[0] = 'Sun'
        weekday[1] = 'Mon'
        weekday[2] = 'Tue'
        weekday[3] = 'Wed'
        weekday[4] = 'Thu'
        weekday[5] = 'Fri'
        weekday[6] = 'Sat'
        var d = new Date(date)
        return weekday[d.getDay()]
      },
      workout_notes_function (id) {
        // Toggle workout_notes
        this.workout_notes = !this.workout_notes
        // Make notes draggable
        this.$parent.dragElement(document.getElementById('workout_notes'))

        // Set vue self
        var self = this

        function click (e) {
          // If box is open
          if (self.workout_notes) {
            if (!document.getElementById('workout_notes').contains(e.target)) {
              // Update the workout
              self.update_workout(id)
              window.removeEventListener('click', click)
            }
          }
        }
        // Wait 1 second before applying the event listener to avoid registering the click to open the box
        setTimeout(
          function () {
            // Add event listener for clicking outside box
            window.addEventListener('click', click)
          }
        , 1000)
      },
      programme_duration (duration) {
        // Turn the duration of the programme into an array to render the boxes in the table
        const arr = []
        let i
        for (i = 1; i < parseInt(duration, 10) + 1; i++) {
          arr.push(i)
        }
        return arr
      },
      async update_programme () {
        // Set loading status to true
        this.$parent.loading = true
        // Set auth header
        axios.defaults.headers.common['Authorization'] = `Bearer ${await this.$auth.getAccessToken()}`
        let x
        var programme
        // Set the programme variable to the current programme
        for (x in this.$parent.$parent.client_details.programmes) {
          if (this.$parent.$parent.client_details.programmes[x].id === this.$route.params.id) {
            programme = this.$parent.$parent.client_details.programmes[x]
          }
        }
        try {
          // eslint-disable-next-line
          const response_update_programme = await axios.post(`https://api.traininblocks.com/programmes`,
            {
              'id': programme.id,
              'name': programme.name,
              'description': programme.description,
              'duration': programme.duration,
              'start': programme.start,
              'notes': programme.notes
            }
          )
          this.programme_update_response = 'Details updated successfully'
          this.$parent.loading = false
          this.edit = false
          this.programme_update_error = false

          // Set vue client_details data to new data
          let x
          // Loop through client_details programmes
          for (x in this.$parent.$parent.client_details.programmes) {
            if (this.$parent.$parent.client_details.programmes[x].id === this.$route.params.id) {
              console.log()
              this.$parent.$parent.client_details.programmes[x] = JSON.parse(JSON.stringify(Object.assign({}, response_update_programme.data)).replace('{"0":', '').replace('}}', '}'))
            }
          }
          // Set vue client programmes data to new data
          x = 0
          let y
          for (x in this.$parent.$parent.posts) {
            if (this.$parent.$parent.posts[x].name === this.$route.params.name) {
              for (y in this.$parent.$parent.posts[x].programmes[y]) {
                if (this.$parent.$parent.posts[x].programmes[y].id === this.$route.params.id) {
                  this.$parent.$parent.posts[x].programmes[y] = JSON.parse(JSON.stringify(Object.assign({}, response_update_programme.data)).replace('{"0":', '').replace('}}', '}'))
                }
              }
            }
          }
          // Update the localstorage with the programmes
          localStorage.setItem('posts', JSON.stringify(this.$parent.$parent.posts))
        } catch (e) {
          this.programme_update_error = e.toString()
        }
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
        try {
          // Loop through programmes
          var x
          for (x in this.$parent.$parent.client_details.programmes) {
            // If programme matches programme in route
            // eslint-disable-next-line
            if (this.$parent.$parent.client_details.programmes[x].id == this.$route.params.id) {
              // If client_details.programmes.workouts is set to false
              if (this.$parent.$parent.client_details.programmes[x].workouts === false) {
                this.no_workouts = true
              // If client_details.programmes.workouts is not set then query the API
              } else if (!this.$parent.$parent.client_details.programmes[x].workouts) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${await this.$auth.getAccessToken()}`
                // eslint-disable-next-line
                const response_programmes = await axios.get(`https://api.traininblocks.com/workouts/${this.$parent.$parent.client_details.programmes[x].id}`)
                // If there are no workouts
                if (response_programmes.data.length === 0) {
                  this.no_workouts = true
                  this.$parent.$parent.client_details.programmes[x].workouts = false
                  // If there are workouts set the client_details to include workouts
                } else {
                  this.$parent.$parent.client_details.programmes[x].workouts = response_programmes.data
                }
                // Sync client_details with posts
                // Loop through clients
                //eslint-disable-next-line
                var y
                for (y in this.$parent.$parent.posts) {
                  // If client matches client in route
                  //eslint-disable-next-line
                  if (this.$parent.$parent.posts[x].name == this.$route.params.name) {
                    this.$parent.$parent.posts[x] = this.$parent.$parent.client_details
                  }
                }
                // Update the localstorage with the workouts
                localStorage.setItem('posts', JSON.stringify(this.$parent.$parent.posts))
              }
            }
          }
          this.loading_workouts = false
        } catch (e) {
          this.error = e.toString()
        }
      },
      async update_workout (id) {
        // Close the box
        this.workout_notes = !this.workout_notes

        // Set auth header
        axios.defaults.headers.common['Authorization'] = `Bearer ${await this.$auth.getAccessToken()}`

        let x
        // Set the programme variable to the current programme
        for (x in this.$parent.$parent.client_details.programmes) {
          //eslint-disable-next-line
          if (this.$parent.$parent.client_details.programmes[x].id == this.$route.params.id) {
            var programme = this.$parent.$parent.client_details.programmes[x]
            var y
            for (y in programme.workouts) {
              if (programme.workouts[y].id === id) {
                var workoutsId = programme.workouts[y].id
                var workoutsNotes = programme.workouts[y].notes
              }
            }
          }
        }
        try {
          // eslint-disable-next-line
          await axios.post(`https://api.traininblocks.com/workouts`,
            {
              'id': workoutsId,
              'notes': workoutsNotes
            }
          )
        } catch (e) {
          this.programme_update_error = e.toString()
        }
      },
      async save () {
        try {
          this.$parent.$parent.loading = true
          // eslint-disable-next-line
          const response_save_workouts = await axios.put(`https://api.traininblocks.com/workouts/${this.new_workout.name}`,
            qs.stringify({
              programme_id: this.$route.params.id,
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

          // Get the workouts from the API because we've just created a new one
          await this.get_workouts()

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
</script>
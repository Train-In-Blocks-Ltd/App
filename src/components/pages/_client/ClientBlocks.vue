<style scoped>
  h1 {
    margin-bottom: 0;
    text-transform: capitalize
  }
  #title, h3 {
    font-size: 2rem;
    font-weight: bold;
    margin: 1rem 0
  }
  #title {
    margin-top: 0
  }
  .programme_info {
    display: grid;
    grid-template-columns: max-content;
    grid-gap: .5rem
  }
  .programme_info input:not([type='submit']) {
    background-color: initial!important;
    border: none;
    color: rgb(
      var(--accessible-color),
      var(--accessible-color),
      var(--accessible-color)
    );
    padding: 0
  }
  .programme_grid {
    display: grid;
    grid-template-areas:
      'table notes'
      'workouts notes';
    grid-template-columns: 1fr 1fr;
    grid-gap: 2rem;
    margin-top: 2.5rem
  }
  #title, #description {
    background-color: initial!important;
    border: none;
    color: rgb(
      var(--accessible-color),
      var(--accessible-color),
      var(--accessible-color)
    );
    padding: 0;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden
  }
  .client_info label {
    grid-auto-columns: min-content;
    grid-gap: 0
  }
  .add_new_workout_container .quill {
    margin: .75rem 0;
    background-color: rgba(
      calc(var(--red) + 45),
      calc(var(--green) + 45),
      calc(var(--blue) + 45),
      .8
    )
  }
  #duration, #start {
    margin-left: .25rem
  }
  #duration {
    width: 4ch
  }
  .programme_table {
    overflow-x: auto
  }
  .programme_container {
    margin-bottom: 5px
  }
  .programme_table > *, .programme_duration_container > * {
    border: 1px solid rgb(
      var(--accessible-color),
      var(--accessible-color),
      var(--accessible-color)
    );
    display: inline-block;
    font-weight: bold;
    text-align: center
  }
  .programme_duration_container > * {
    border-left: none;
    border-bottom: none;
    padding: 30px 0;
    min-width: 40px;
    width: 100%;
    transition: all .3s cubic-bezier(.165, .84, .44, 1)
  }
  .programme_duration_container > *:last-of-type {
    border-right: none
  }
  .programme_duration_container > *:hover {
    box-shadow: inset 0 20px 30px -30px rgba(
      var(--accessible-color),
      var(--accessible-color),
      var(--accessible-color),
      .5
    );
    cursor: pointer
  }
  .programme_duration_container {
    display: grid;
    grid-auto-flow: column;
    border: none;
    padding: 0
  }
  .notes_wrapper {
    grid-area: notes;
    border-left: 2px solid rgb(
      var(--accessible-color),
      var(--accessible-color),
      var(--accessible-color)
    );
    padding-left: 1rem
  }
  .workout_notes, #block_notes {
    position: absolute;
    right: 0;
    top: 0;
    z-index: 9;
    text-align: left;
    max-width: 400px;
    width: 100%;
    box-shadow: 0 4px 20px rgba(0, 0, 0, .15);
    background-color: rgb(
      var(--red),
      var(--green),
      var(--blue)
    );
    display: grid;
    grid-template-rows: 40px auto;
    align-items: center
  }
  .workout_notes_header, #block_notes_header {
    cursor: grab;
    z-index: 10;
    box-shadow: 0 4px 10px rgba(0, 0, 0, .1);
    color: rgb(var(--accessible-color), var(--accessible-color), var(--accessible-color));
    padding: 0 .5rem;
    height: 100%;
    display: grid;
    align-items: center
  }
  .workout_notes_header p, #workout_notes_header p {
    margin: 0
  }
  .workouts {
    grid-area: workouts
  }
  .workout {
    display: block;
    border-bottom: 1px solid rgb(var(--accessible-color), var(--accessible-color), var(--accessible-color));
    padding: .5rem 0;
    cursor: pointer;
    width: 70%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    transition: width 1500ms;
    transition-timing-function: cubic-bezier(.075, .82, .165, 1)
  }
  .workout:hover {
    width: 80%
  }
  .client-info--workout {
    height: auto;
    margin: 0;
    font-size: 1rem
  }
  .label--workout {
    align-items: end;
    display: inline-block
  }
  .label--workout select {
    background: transparent;
    border: none;
    border-bottom: 1px solid rgb(
      var(--accessible-color),
      var(--accessible-color),
      var(--accessible-color)
    );
    width: 50%
  }
  .label--workout select:hover {
    cursor: pointer
  }
  .label--workout input, .label--workout select {
    font-size: 1rem
  }
  #block_notes_header > p {
    margin: auto 0;
    font-weight: 700
  }
  #block-notes {
    display: block;
    margin: .5rem 0;
    position: relative;
    width: fit-content;
    color: rgb(
      var(--accessible-color),
      var(--accessible-color),
      var(--accessible-color)
    );
    text-decoration: none
  }
  #block-notes:hover {
    color: rgb(
      var(--accessible-color),
      var(--accessible-color),
      var(--accessible-color)
    );
    cursor: pointer
  }
  #block-notes:before {
    content: '';
    position: absolute;
    width: 0%;
    height: 2px;
    bottom: -4px;
    left: 0;
    background-color: rgb(
      var(--accessible-color),
      var(--accessible-color),
      var(--accessible-color)
    );
    opacity: 0;
    transition: all .3s cubic-bezier(.165, .84, .44, 1)
  }
  #block-notes:hover:before {
    opacity: 1;
    width: 100%
  }
  #block-notes:active:before {
    width: 0
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
                <input type="text" id="title" name="name" v-model="programme.name" v-on:click="editing()">
                <label class="label--workout">Duration: <input type="number" id="duration" class="client-info--workout" name="duration" inputmode="decimal" v-model="programme.duration" required v-on:click="editing()"/></label>
                <label class="label--workout">Start: <input type="date" id="start" class="client-info--workout" name="start" v-model="programme.start" required v-on:click="editing()"/></label>
                <label class="label--workout">Follow to: 
                  <select>
                    <option>Select a Block</option>
                  </select>
                </label>
                <div class="loading-grid" v-if="edit">
                  <input style="margin: 1rem 0 .5rem 0" type="submit" class="button" value="Save" />
                  <Loader></Loader>
                </div>
                <p v-if="programme_update_response"><b>{{programme_update_response}}</b></p>
                <p v-if="programme_update_error"><b>{{programme_update_error}}</b></p>
              </form>
            </div>  <!-- client_info -->
            <div class="floating_nav_container">
              <div class="floating_nav">
                <router-link :to="{name: 'programmes'}">Programmes</router-link>
                <router-link :to="{name: 'results'}">Results</router-link>
              </div>
            </div>  <!-- floating_nav_container -->
          </div> <!-- top_grid -->
          <div class="programme_grid">
            <div class="programme_table">
              <div class="programme_container">
                <p style="margin: 1.5rem 1rem">{{programme.name}}</p>
                <div class="programme_duration_container">
                  <div v-for="item in programme_duration(programme.duration)" :key="item">
                    {{item}}
                  </div>
                </div>
              </div>
            </div> <!-- programme_table -->
            <div class="workouts">
              <h3>Workouts</h3>
              <p v-if="$parent.no_workouts">No workouts yet. You can add one below.</p>
              <p v-if="$parent.loading_workouts">Loading workouts...</p>
              <p v-if="$parent.workout_error"><b>{{$parent.workout_error}}</b></p>
              <div class="workout_wrapper">
                <div v-if="!$parent.no_workouts && !$parent.workout_error">
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
                    <div v-show="workout_notes == workout.id" class="workout_notes" :id="'workout_notes_' + workout.id">
                      <div :id="'workout_notes_' + workout.id + '_header'" class="workout_notes_header">
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
            <div class="notes_wrapper">
              <div>
                <a id="block-notes" href="javascript:void(0)" v-on:click="block_notes_function()">Block Notes</a>
                <h3>Statistics</h3>
              </div>
              <div v-show="block_notes" id="block_notes">
                <div id="block_notes_header">
                  <p>Block Notes</p>
                </div>
                <quill v-model="programme.notes" output="html" class="quill"></quill>
              </div>
              <line-chart :chart-data="dataCollection" :options="chartOptions"></line-chart>
              <select id="exercise" v-on:change="fillData()">
                <option>Select a Measure</option>
              </select>
              <select id="dataCat" v-on:change="fillData()">
                <option id="sets">Sets</option>
                <option id="reps">Reps</option>
                <option id="load">Load</option>
                <option id="volume">Volume</option>
              </select>
            </div>  <!-- notes -->
          </div> <!-- programme_grid -->
        </div>
      </div>
    </div>
</template>

<script>
  import Loader from '../../components/Loader'
  import axios from 'axios'
  import qs from 'qs'
  import LineChart from '../../components/LineChart.js'

  export default {
    components: {
      Loader,
      LineChart
    },
    data: function () {
      return {
        creating: false,
        response: '',
        edit: false,
        edit1: false,
        programme_update_response: '',
        programme_update_error: '',
        error: '',
        workout_notes: false,
        block_notes: false,
        new_workout: {
          name: '',
          date: ''
        },
        xVal: [],
        yVal: [],
        dataCollection: {
          labels: this.xVal,
          datasets: [
            {
              label: 'none',
              backgroundColor: 'transparent',
              borderColor: '#282828',
              data: this.yVal
            }
          ]
        },
        chartOptions: {
          responsive: true,
          maintainAspectRatio: false,
          legend: {
            display: false
          },
          scales: {
            yAxes: [{
              ticks: {
                suggestedMin: 1,
                stepSize: 1
              }
            }]
          }
        }
      }
    },
    created () {
      this.$parent.blocks = true
    },
    mounted () {
      this.fillData()
    },
    methods: {
      fillData () {
        // Regex
        const regexPull = /(^\w*\))\s*(.[^:]*):\s*(.+)/gmi
        // eslint-disable-next-line
        const regexSetRep = /(\d*)\s*x\s*((\d*[,|\/]*)*)/gmi
        const regexBreakReps = /\d+/gmi
        const regexIntCapt = /(at|@)(.+)/gmi
        const regexIntBreak = /(\d*[.]?\d*)/gmi

        // Regex functions

        // Scans all the workouts and pulls the protocols from the text.
        function pullProtocols (workout) {
          var matchGroup = []
          let a
          while ((a = regexPull.exec(workout.replace(/(<br>)/ig, '\n').replace(/(<\/p>)/ig, '\n').replace(/(<([^>]+)>)/ig, ''))) !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (a.index === regexPull.lastIndex) {
              regexPull.lastIndex++
            }
            // The result can be accessed through the `a`-variable.
            a.forEach((match) => {
              matchGroup.push(match)
            })
          }
          return matchGroup
        }

        // Selects either the sets or reps. E.g. '3' as sets and '6' as reps from '3x6'
        function setsReps (protocol, type) {
          var store = 0
          var sets = 0

          // Removes all spaces
          protocol = protocol.replace(/\s/g, '')

          let c1
          while ((c1 = regexSetRep.exec(protocol)) !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (c1.index === regexSetRep.lastIndex) {
              regexSetRep.lastIndex++
            }
            // The result can be accessed through the `c1`-variable.
            c1.forEach((match, groupIndex) => {
              if (groupIndex === 1 && type === 'Sets') {
                store = parseInt(match)
              }
              if (groupIndex === 1) {
                sets = match
              }
              if (groupIndex === 2 && type === 'Reps') {
                store = sumReps(match, sets)
              }
            })
          }
          return store
        }

        // This connects to the previous function above and sums up the reps to show on the graph
        function sumReps (repsProtocol, sets) {
          var sum = 0
          let c2

          while ((c2 = regexBreakReps.exec(repsProtocol)) !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (c2.index === regexBreakReps.lastIndex) {
              regexBreakReps.lastIndex++
            }
            // The result can be accessed through the `c2`-variable.
            c2.forEach((match) => {
              if (repsProtocol.includes('/') === true) {
                sum += parseInt(match)
              }
              if (repsProtocol.includes('/') === false) {
                sum = sets * parseInt(match)
              }
            })
          }
          return sum
        }

        // Calculates the load
        function load (protocol) {
          var sum = 0
          // Removes all spaces
          protocol = protocol.replace(/\s/g, '')
          let b1
          while ((b1 = regexIntCapt.exec(protocol)) !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (b1.index === regexIntCapt.lastIndex) {
              regexIntCapt.lastIndex++
            }
            // The result can be accessed through the `b1`-variable.
            b1.forEach((match, groupIndex) => {
              if (groupIndex === 2) {
                protocol = match
              }
            })
          }
          let b2

          while ((b2 = regexIntBreak.exec(protocol)) !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (b2.index === regexIntBreak.lastIndex) {
              regexIntBreak.lastIndex++
            }

            // The result can be accessed through the `b2`-variable.
            b2.forEach((match, groupIndex) => {
              if (match !== '' && groupIndex === 1) {
                sum += parseFloat(match)
              }
            })
          }
          return sum
        }

        // Tidies the protocols
        function tidyProtocols (matchGroup) {
          var e = 1
          // Removes all but exercise name and protocols store in alternating pattern.
          for (;e < matchGroup.length; e++) {
            delete matchGroup[4 * e - 4]
            delete matchGroup[4 * e - 3]
          }
          // Removes all undefined
          matchGroup = matchGroup.filter(() => true)
          return matchGroup
        }

        // Resets xVal and yVal
        this.xVal = []
        this.yVal = []

        // Gets values of graph dropdown selects
        var exercise = document.getElementById('exercise').value
        var type = document.getElementById('dataCat').value

        // Set the options
        this.$parent.$parent.client_details.programmes.forEach((programme) => {
          // eslint-disable-next-line
          if (programme.id == this.$route.params.id) {
            programme.workouts.forEach((workout, id) => {
              var currentWorkout = tidyProtocols(pullProtocols(workout.notes))
              var options = document.getElementById('exercise').innerText
              var i = 0

              for (;i < currentWorkout.length; i++) {
                var conditionOne = options.includes(currentWorkout[i - 1])
                var conditionTwo = currentWorkout[i].includes('/')
                var conditionThree = currentWorkout[i].includes('at')
                var conditionFour = currentWorkout[i].includes('@')

                if (i % 2 !== 0 && conditionOne !== true && conditionTwo && (conditionThree !== true || conditionFour !== true)) {
                  document.getElementById('exercise').innerHTML += '<option>' + currentWorkout[i - 1] + '</option>'
                }

                // Set the yVal to the type requested
                if (currentWorkout[i] === exercise && type === 'Sets') {
                  this.yVal.push(setsReps(currentWorkout[i + 1], type))
                }
                if (currentWorkout[i] === exercise && type === 'Reps') {
                  this.yVal.push(setsReps(currentWorkout[i + 1], type))
                }
                if (currentWorkout[i] === exercise && type === 'Load') {
                  this.yVal.push(load(currentWorkout[i + 1]))
                }
                if (currentWorkout[i] === exercise && type === 'Volume') {
                  this.yVal.push(setsReps(currentWorkout[i + 1], 'Reps') * load(currentWorkout[i + 1]))
                }
              }

              // Set xVal to Workout number
              this.xVal.push('Workout ' + (id + 1))
            })
          }
        })

        // Sets the dataCollection value which the graph uses to display data. This has to be reset each time to update the graph
        this.dataCollection = {
          labels: this.xVal,
          datasets: [
            {
              label: 'none',
              backgroundColor: 'transparent',
              borderColor: '#282828',
              data: this.yVal
            }
          ]
        }
      },
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
      block_notes_function () {
        // Set block_notes to true
        this.block_notes = true

        // Make notes draggable
        this.$parent.dragElement(document.getElementById('block_notes'))

        // Set vue self
        var self = this

        function click (e) {
          // If box is open
          if (self.block_notes) {
            if (!document.getElementById('block_notes').contains(e.target)) {
              // Update the workout
              self.update_programme()
              window.removeEventListener('click', click)
              self.block_notes = false
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
      workout_notes_function (id) {
        // Set workout_notes to id of workout
        this.workout_notes = id

        // Make notes draggable
        this.$parent.dragElement(document.getElementById('workout_notes_' + id))

        // Set vue self
        var self = this

        function click (e) {
          // If box is open
          if (self.workout_notes) {
            if (!document.getElementById('workout_notes_' + id).contains(e.target)) {
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
          // eslint-disable-next-line
          if (this.$parent.$parent.client_details.programmes[x].id == this.$route.params.id) {
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
        this.$parent.force_get_workouts()
      },
      async save () {
        try {
          this.$parent.$parent.loading = true
          // eslint-disable-next-line
          const response_save_workouts = await axios.put(`https://api.traininblocks.com/workouts/${this.new_workout.name}`,
            qs.stringify({
              programme_id: this.$route.params.id,
              date: this.new_workout.date
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
          await this.$parent.force_get_workouts()

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
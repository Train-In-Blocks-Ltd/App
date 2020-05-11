<style scoped>
  /* Block Info */
  .block_info {
    display: grid;
    grid-template-columns: max-content;
    grid-gap: 1rem
  }
  #blocks .block_info label {
    grid-auto-columns: min-content;
    display: inline-block
  }
  .block_info select {
    background: initial;
    border: none;
    border-bottom: 1px solid rgb(
      var(--accessible-color),
      var(--accessible-color),
      var(--accessible-color)
    );
    width: 50%;
    font-size: 1rem
  }
  .block_info select:hover {
    cursor: pointer
  }
  .block_info input#duration, .block_info input#start {
    margin-left: .25rem
  }
  .block_info input#duration {
    width: 4ch
  }
  #blocks .block_info input.block_info--name.title {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 1rem;
    letter-spacing: .15rem
  }

  /* Block Grid */
  .block_grid {
    display: grid;
    grid-template-areas:
      'table notes'
      'workouts notes';
    grid-template-columns: 1fr 1fr;
    grid-gap: 2rem;
    margin-top: 2.5rem
  }

  /* Block Table */
  .block_table {
    overflow-x: auto
  }
  .block_table--container {
    border: 1px solid rgb(
      var(--accessible-color),
      var(--accessible-color),
      var(--accessible-color)
    );
    display: inline-block;
    font-weight: bold;
    text-align: center
  }
  .block_table--container p {
    margin: 1.5rem 1rem
  }
  .block_table--container--block_duration_container {
    display: grid;
    grid-auto-flow: column;
    border: none;
    padding: 0
  }
  .block_table--container--block_duration_container * {
    border: 1px solid rgb(
      var(--accessible-color),
      var(--accessible-color),
      var(--accessible-color)
    );
    display: inline-block;
    border-left: none;
    border-bottom: none;
    padding: 30px 0;
    min-width: 40px;
    width: 100%;
    transition: all .3s cubic-bezier(.165, .84, .44, 1)
  }
  .block_table--container--block_duration_container *:last-of-type {
    border-right: none
  }
  .block_table--container--block_duration_container *:hover {
    box-shadow: inset 0 20px 30px -30px rgba(
      var(--accessible-color),
      var(--accessible-color),
      var(--accessible-color),
      .5
    );
    cursor: pointer
  }

  /* Workouts */
  .workouts {
    grid-area: workouts
  }
  .workouts--workout {
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
  .workouts--workout:hover {
    width: 80%
  }

  /* Notes Grid Section */
  .notes {
    grid-area: notes;
    border-left: 2px solid rgb(
      var(--accessible-color),
      var(--accessible-color),
      var(--accessible-color)
    );
    padding-left: 1rem
  }
  .notes a {
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
  .notes a:hover {
    color: rgb(
      var(--accessible-color),
      var(--accessible-color),
      var(--accessible-color)
    );
    cursor: pointer
  }
  .notes a:before {
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
  .notes a:hover:before {
    opacity: 1;
    width: 100%
  }
  .notes a:active:before {
    width: 0
  }

  /* Quill Notes */
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
  .workout_notes_header p, #block_notes_header p {
    margin: auto 0;
    font-weight: 700
  }
</style>

<template>
    <div id="blocks">
       <!-- Loop through programmes and v-if programme matches route so that programme data object is available throughout -->
      <div v-for="(programme, index) in this.$parent.$parent.client_details.programmes"
        :key="index">
        <div v-if="programme.id == $route.params.id">
          <div class="top_grid">
            <div class="client_info">
              <h1 class="client_info--name title">{{$route.params.name}}</h1>
               <!-- Update the programme info -->
              <form class="block_info">
                <input class="block_info--name title" type="text" name="name" v-model="programme.name" v-on:click="editing()">
                <label>Duration: <input id="duration" type="number" name="duration" inputmode="decimal" v-model="programme.duration" required v-on:click="editing()"/></label>
                <label>Start: <input id="start" type="date" name="start" v-model="programme.start" required v-on:click="editing()"/></label>
                <label>Follow to: 
                  <select>
                    <option>Select a Block</option>
                  </select>
                </label>
              </form>
            </div>  <!-- client_info -->
            <div>
              <div class="floating_nav">
                <a href="javascript:void(0)" v-on:click="$parent.client_notes_function()">Client Notes</a>
                <router-link :to="{name: 'programmes'}">Programmes</router-link>
                <div v-for="(clients, index) in $parent.$parent.posts" :key="index">
                  <div v-if="clients.name == $route.params.name">
                    <a href="javascript:void(0)" v-on:click="$parent.$parent.client_archive(clients.client_id, index)">Archive Client</a>
                  </div>
                </div>
              </div> <!-- floating_nav -->
            </div>
          </div> <!-- top_grid -->
          <div class="block_grid">
            <div class="block_table">
              <div class="block_table--container">
                <p>{{programme.name}}</p>
                <div class="block_table--container--block_duration_container">
                  <div v-for="item in programme_duration(programme.duration)" :key="item">
                    {{item}}
                  </div>
                </div>
              </div>
            </div> <!-- block_table -->
            <div class="workouts">
              <h3>Workouts</h3>
              <p v-if="$parent.no_workouts">No workouts yet. You can add one below.</p>
              <p v-if="$parent.loading_workouts">Loading workouts...</p>
              <p v-if="$parent.workout_error"><b>{{$parent.workout_error}}</b></p>
              <div>
                <div v-if="!$parent.no_workouts && !$parent.workout_error">
                  <!-- Loop through workouts -->
                  <div v-for="(workout, index) in programme.workouts"
                    :key="index">
                    <!-- Open the notes in a popup when clicked -->
                    <p v-on:click="workout_notes_function(workout.id)" class="workouts--workout">
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
            <div class="notes">
              <div>
                <a href="javascript:void(0)" v-on:click="block_notes_function()">Block Notes</a>
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
                <option>Sets</option>
                <option>Reps</option>
                <option>Load</option>
                <option>Volume</option>
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
        edit1: false,
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
          this.$parent.loading = false

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
          console.log(e.toString())
        }
      },
      editing () {
        this.edit1 = false

        // Set vue self
        var self = this

        function click (e) {
          if (!document.querySelector('.programme_info').contains(e.target)) {
            // Update the workout
            self.update_programme()
            window.removeEventListener('click', click)
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
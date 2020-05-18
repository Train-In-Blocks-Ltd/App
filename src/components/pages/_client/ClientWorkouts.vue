<style scoped>
  #blocks {
    cursor: grab
  }

  /* Block Info */
  .client_info--name.title {
    margin: 0
  }
  .block_info {
    display: grid;
    grid-template-columns: max-content;
    grid-gap: 1rem
  }
  #blocks .block_info label {
    grid-auto-columns: min-content;
    display: inline-block;
    font-weight: bold
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
    grid-template-columns: 1fr 1000px;
    grid-gap: 5rem;
    margin: 5rem 5rem 5rem 0
  }

  /* Block Table */
  .block_table {
    height: fit-content;
    max-width: 482px;
    overflow-x: auto
  }
  .block_table--container {
    border: 1px solid #282828;
    display: inline-block;
    font-weight: bold;
    text-align: center;
    cursor: default
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
    border: 1px solid #282828;
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
    box-shadow: inset 0 20px 30px -30px #28282850;
    cursor: pointer
  }

  /* Workouts */
  .workouts--workout {
    display: block;
    border-bottom: 1px solid #28282840;
    padding: .5rem 0;
    cursor: pointer;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    transition: all .6s cubic-bezier(.075, .82, .165, 1)
  }
  .workouts--workout:hover {
    border-bottom: 1px solid #282828
  }
  .workouts--workout:active {
    transform: scale(.9)
  }

  /* Notes Grid Section */
  .notes {
    border-left: 2px solid #282828;
    padding-left: 5rem
  }

  /* Quill Notes */
  .workout_notes, #block_notes {
    position: fixed;
    right: 20rem;
    top: 5rem;
    z-index: 9;
    text-align: left;
    max-width: 400px;
    width: 100%;
    box-shadow: 0 4px 20px rgba(0, 0, 0, .15);
    background-color: white;
    display: grid;
    grid-template-rows: 40px auto;
    align-items: center
  }
  .workout_notes_header, #block_notes_header {
    cursor: grab;
    z-index: 10;
    box-shadow: 0 4px 10px rgba(0, 0, 0, .1);
    color: #282828;
    padding: 0 .5rem;
    height: 100%;
    display: grid;
    align-items: center
  }
  .workout_notes_header {
    grid-template-columns: 1fr .1fr .1fr .1fr /* For the 3 icons in this order, toolkit, info and delete */
  }
  .workout_notes_header p, #block_notes_header p {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow-x: hidden;
    margin: 0
  }
  .workout_notes_header svg {
    cursor: pointer
  }

  /* Add Workout Form */
  .add_workout_container {
    padding-top: 1rem
  }
  .add_workout_container h3 {
    margin-top: 0
  }
  .add_workout {
    grid-gap: 1rem
  }
  .add_workout label {
    display: grid;
    grid-gap: .5rem
  }

  @media (max-width: 992px) {
    .workout_notes, #block_notes {
      right: 10rem
    }
  }
  @media (max-width: 768px) {
    #blocks .block_info input.block_info--name.title {
      font-size: 1.2rem
    }
    .workouts--workout:hover {
      border-bottom: 1px solid #28282840
    }
    .workouts--workout:active {
      transform: scale(.9);
      border-bottom: 1px solid #282828
    }
  }
  @media (max-width: 576px) {
    .workout_notes, #block_notes {
      right: 6rem;
      max-width: 250px;
      height: 400px
    }
  }
  @media (max-width: 360px) {
    .workout_notes, #block_notes {
      right: 5rem;
      max-width: 230px;
      height: 350px
    }
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
              </form>
            </div>  <!-- client_info -->
            <div class="floating_nav--container">
              <div class="floating_nav">
                <a href="javascript:void(0)" v-on:click="$parent.client_notes_function()"><p>Client Notes</p><inline-svg class="floating_nav__icon" :src="require('../../../assets/svg/User.svg')"/></a>
                <a href="javascript:void(0)" v-on:click="block_notes_function()"><p>Block Notes</p><inline-svg class="floating_nav__icon" :src="require('../../../assets/svg/BlockNotes.svg')"/></a>
                <a href="javascript:void(0)" v-on:click="delete_block()"><p>Delete Block</p><inline-svg class="floating_nav__icon" :src="require('../../../assets/svg/Trash.svg')"/></a>
              </div> <!-- floating_nav -->
            </div>
          </div> <!-- top_grid -->
          <div class="block_grid">
            <div>
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
                <div>
                  <div v-if="!$parent.no_workouts">
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
                          <inline-svg :src="require('../../../assets/svg/Toolkit.svg')"/>
                          <inline-svg :src="require('../../../assets/svg/Info.svg')"/>
                          <inline-svg :src="require('../../../assets/svg/Trash.svg')" v-on:click="delete_workout(workout.id)"/>
                        </div>
                        <quill v-model="workout.notes" output="html" class="quill"></quill>
                      </div>
                    </div>
                  </div>
                  <!-- Add a new workout -->
                  <button v-if="!creating" class="button" v-on:click="creation()">New workout</button>
                  <p class="response" v-if="!creating">{{response}}</p>
                  <div v-if="creating" class="add_workout_container">
                    <h3>Add new workout</h3>
                    <form name="add_workout" class="form_grid add_workout" v-on:submit.prevent="add_workout()">
                      <label><b>Name: </b><input type="text" v-model="new_workout.name" required /></label>
                      <label><b>Date: </b><input type="date" v-model="new_workout.date" required /></label>
                      <div class="form_buttons">
                          <input type="submit" class="button" value="Save" />
                          <button class="button" v-on:click="close()">Close</button>
                          <Loader></Loader>
                      </div>
                    </form>
                  </div>
                </div>
              </div><!-- workouts -->
            </div>
            <div class="notes">
              <div id="stats">
                <h2 no>Block Statistics</h2>
                <p id="p1"></p>
                <p id="p2"></p>
                <p id="p3"></p>
                <p id="p4"></p>
                <p id="p5"></p>
              </div>
              <div>
                <h3>Statistics</h3>
              </div>
              <div v-show="block_notes" id="block_notes">
                <div id="block_notes_header">
                  <p><b>Block Notes</b></p>
                </div>
                <quill v-model="programme.notes" output="html" class="quill"></quill>
              </div>
              <line-chart :chart-data="dataCollection" :options="chartOptions"></line-chart>
              <select id="exercise" v-on:change="fillData()"></select>
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
  import InlineSvg from 'vue-inline-svg'

  export default {
    components: {
      Loader,
      LineChart,
      InlineSvg
    },
    data: function () {
      return {
        creating: false,
        response: '',
        edit1: false,
        workout_notes: false,
        block_notes: false,
        new_workout: {
          name: '',
          date: ''
        },
        delete: false,
        str: null,
        regexPull: /(^\w*\))\s*(.[^:]*):\s*(.+)/gmi,
        regexSetRep: /(\d*)\s*x\s*((\d*[,|]*)*)/gmi,
        regexBreakReps: /\d+/gmi,
        regexIntCapt: /(at|@)(.+)/gmi,
        regexIntBreak: /(\d*[.]?\d*)/gmi,
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
    async mounted () {
      await this.initializeForm()
      this.fillData()
    },
    methods: {
      initializeForm () {
        this.$parent.$parent.client_details.programmes.forEach((programme) => {
          // eslint-disable-next-line
          if (programme.id == this.$route.params.id) {
            this.str = programme.workouts
          }
        })
        // Empties and sets default options.
        document.getElementById('exercise').innerHTML = ''
        document.getElementById('exercise').innerHTML += '<option>Block Overview</option>'
        // Scans through all workouts stored and picks out every valid exercise protocols from it.
        if (this.str) {
          this.str.forEach((workout, id) => {
            var currentWorkout = this.tidyProtocols(this.pullProtocols(workout.notes))
            var exist = document.getElementById('exercise').innerText
            var i = 0

            // Detects for valid exercise protocols and appending it to the dropdown.
            // If i is EVEN then it's the exercise name, if i is ODD then its the protocol.
            // @ / at are key identifiers of protocols.
            if (currentWorkout) {
              for (;i < currentWorkout.length; i++) {
                var conditionOne = exist.includes(currentWorkout[i - 1])
                var conditionTwo = currentWorkout[i].includes('/')
                var conditionThree = currentWorkout[i].includes('at')
                var conditionFour = currentWorkout[i].includes('@')

                // Every exercise name will be propercase to allow for easy validation.
                if ((i - 1) % 2 === 0 && (i - 1) !== 0) {
                  conditionOne = exist.includes(this.properCase(currentWorkout[i - 1]))
                }
                // Tests if it's an exercise or protocol. It will only append exercises.
                if (i % 2 !== 0 && conditionOne !== true && conditionTwo && (conditionThree !== true || conditionFour !== true)) {
                  document.getElementById('exercise').innerHTML += '<option value="' + this.properCase(currentWorkout[i - 1]) + '">' + this.properCase(currentWorkout[i - 1]) + '</option>'
                }
              }
            }
          })
        }
      },
      pullProtocols (workout) {
        // Regex functions
        // Scans all the workouts and pulls the protocols from the text.
        // Returns values to tidyProtocols().
        if (workout) {
          var matchGroup = []
          let a
          while ((a = this.regexPull.exec(workout.replace(/(<br>)/ig, '\n').replace(/(<\/p>)/ig, '\n').replace(/(<([^>]+)>)/ig, ''))) !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (a.index === this.regexPull.lastIndex) {
              this.regexPull.lastIndex++
            }
            // The result can be accessed through the `a`-variable.
            a.forEach((match) => {
              matchGroup.push(match)
            })
          }
          return matchGroup
        }
      },
      setsReps (protocol, type) {
        // Function to select either the sets or reps. E.g. '3' as sets and '6' as reps from '3x6'.
        // Returns values to be appended to yVal.
        var store = 0
        var sets = 0
        // Removes all spaces
        protocol = protocol.replace(/\s/g, '')
        let c1
        while ((c1 = this.regexSetRep.exec(protocol)) !== null) {
          // This is necessary to avoid infinite loops with zero-width matches
          if (c1.index === this.regexSetRep.lastIndex) {
            this.regexSetRep.lastIndex++
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
              store = this.sumReps(match, sets)
            }
          })
        }
        return store
      },
      sumReps (repsProtocol, sets) {
        // This connects to the previous function above and sums up the reps to show on the graph
        // Returns values to be appended to yVal.
        var sum = 0
        let c2
        while ((c2 = this.regexBreakReps.exec(repsProtocol)) !== null) {
          // This is necessary to avoid infinite loops with zero-width matches
          if (c2.index === this.regexBreakReps.lastIndex) {
            this.regexBreakReps.lastIndex++
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
      },
      load (protocol) {
        // This function adds up all the loads for visualisation and for aggregate to create volume.
        // Returns values to be appended to yVal.
        var sum = 0
        // Removes all spaces
        protocol = protocol.replace(/\s/g, '')
        let b1
        while ((b1 = this.regexIntCapt.exec(protocol)) !== null) {
          // This is necessary to avoid infinite loops with zero-width matches
          if (b1.index === this.regexIntCapt.lastIndex) {
            this.regexIntCapt.lastIndex++
          }

          // The result can be accessed through the `b1`-variable.
          b1.forEach((match, groupIndex) => {
            if (groupIndex === 2) {
              protocol = match
            }
          })
        }
        let b2
        while ((b2 = this.regexIntBreak.exec(protocol)) !== null) {
          // This is necessary to avoid infinite loops with zero-width matches
          if (b2.index === this.regexIntBreak.lastIndex) {
            this.regexIntBreak.lastIndex++
          }
          // The result can be accessed through the `b2`-variable.
          b2.forEach((match, groupIndex) => {
            if (match !== '' && groupIndex === 1) {
              sum += parseFloat(match)
            }
          })
        }
        return sum
      },
      tidyProtocols (matchGroup) {
        // Cleans up the protocol, used in conjuction with pullProcedures().
        if (matchGroup) {
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
      },
      lineGraph (id, exercise, type) {
        // Visualises the data on the graph. Appends data to an array and works in conjuction with the onChange event for the dropdown.
        var matchGroup = this.tidyProtocols(this.pullProtocols(this.str[id].notes))
        var self = this
        if (matchGroup) {
          // Runs the correct corresponding regex function to extract the information. I then pushes it to an array.
          var i = 0
          for (;i < matchGroup.length; i++) {
            if (i % 2 === 0) {
              if (this.properCase(matchGroup[i]) === exercise && type === 'Sets') {
                self.yVal.push(this.setsReps(matchGroup[i + 1], type))
              }
              if (this.properCase(matchGroup[i]) === exercise && type === 'Reps') {
                console.log(matchGroup[i + 1])
                self.yVal.push(this.setsReps(matchGroup[i + 1], type))
              }
              if (this.properCase(matchGroup[i]) === exercise && type === 'Load') {
                self.yVal.push(this.load(matchGroup[i + 1]))
              }
              if (this.properCase(matchGroup[i]) === exercise && type === 'Volume') {
                self.yVal.push(this.setsReps(matchGroup[i + 1], 'Reps') * this.load(matchGroup[i + 1]))
              }
            }
          }
        }
      },
      workoutStats (id, dataCat) {
        // Visualises the data for a whole block/programme. lineGraph() only does it for exercises.
        var workout = this.tidyProtocols(this.pullProtocols(this.str[id].notes))
        var sumLoad = 0
        if (workout) {
          // Runs the correct corresponding regex function to extract the information. Then it aggregates it all-together.
          workout.forEach((protocol) => {
            if (protocol.includes('/') === true) {
              if (dataCat === 'Sets') {
                sumLoad += this.setsReps(protocol, dataCat)
              }
              if (dataCat === 'Reps') {
                sumLoad += this.setsReps(protocol, dataCat)
              }
              if (dataCat === 'Load') {
                sumLoad += this.load(protocol)
              }
              if (dataCat === 'Volume') {
                sumLoad += this.setsReps(protocol, 'Reps') * this.load(protocol)
              }
            }
          })
          // Appends to graph x and y axis
          this.xVal.push('Workout ' + (id + 1))
          this.yVal.push(sumLoad)
        }
      },
      descStats (dataForType) {
        // Visualises the descriptive data below the h2 statsictics tag.
        var storeMax = 0
        var store = 0
        var sum = this.yVal.reduce((a, b) => a + b)

        // Sets descriptive data with its corresponding info.
        document.getElementById('p1').innerHTML = '<b>Total' + ' ' + dataForType + ':</b> ' + sum
        document.getElementById('p2').innerHTML = '<b>Average' + ' ' + dataForType + ':</b> ' + sum / this.yVal.length

        this.yVal.forEach((value) => {
          storeMax = Math.max(storeMax, value)
        })
        document.getElementById('p3').innerHTML = '<b>Maximum' + ' ' + dataForType + ':</b> ' + storeMax
        store = storeMax
        this.yVal.forEach((value) => {
          store = Math.min(store, value)
        })
        document.getElementById('p4').innerHTML = '<b>Minimum' + ' ' + dataForType + ':</b> ' + store
        document.getElementById('p5').innerHTML = '- Percentage Change: ' + ((storeMax / store) * 100).toFixed(1) + '%'
      },
      properCase (string) {
        // Creates proper casing, works in conjuction with dropdownAppend to validate if exercise is already in the list.
        if (string.includes('at') !== true) {
          var sentence = string.toLowerCase().split(' ')
          for (var i = 0; i < sentence.length; i++) {
            sentence[i] = sentence[i][0].toUpperCase() + sentence[i].slice(1)
          }
          return sentence.join(' ')
        }
      },
      fillData () {
        // Resets xVal and yVal
        this.xVal = []
        this.yVal = []

        // Gets values of graph dropdown selects
        var dataForExercise = document.getElementById('exercise').value
        var dataForType = document.getElementById('dataCat').value
        var e = 1

        if (dataForExercise !== 'Block Overview') {
          this.str.forEach((workout, id) => {
            this.lineGraph(id, dataForExercise, dataForType)
          })
          for (;e <= this.yVal.length; e++) {
            this.xVal.push(e)
          }
        } else {
          if (this.str) {
            this.str.forEach((workout, id) => {
              this.workoutStats(id, dataForType)
            })

            this.descStats(dataForType)
          }
        }
        // Removes duplicates of exercises.
        var optionValues = []
        document.querySelectorAll('#exercise option').forEach(function (e) {
          if (optionValues.indexOf(e.value) > -1) {
            document.querySelector(e).remove()
          } else {
            optionValues.push(e.value)
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

        // Set vue self
        var self = this

        function click (e) {
          if (self.delete === false) {
            if (!document.getElementById('workout_notes_' + id).contains(e.target)) {
              // Update the workout
              self.update_workout(id)
            }
          } else {
            self.delete = false
          }
          window.removeEventListener('click', click)
          self.block_notes = false
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
          console.log(e.toString())
        }
        this.$parent.force_get_workouts()
      },
      async add_workout () {
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
      },
      async delete_block () {
        if (confirm('Are you sure you want to delete this block?')) {
          var programme
          var id
          for (programme of this.$parent.$parent.client_details.programmes) {
            //eslint-disable-next-line
            if (programme.id == this.$route.params.id) {
              id = programme.id
            }
          }
          axios.defaults.headers.common['Authorization'] = `Bearer ${await this.$auth.getAccessToken()}`
          try {
            await axios.delete(`https://api.traininblocks.com/programmes/${id}`)

            await this.$parent.$parent.clients()
            this.$parent.$parent.clients_to_vue()

            this.$router.push({path: '/'})
          } catch (e) {
            console.error(`${e}`)
          }
        }
      },
      async delete_workout (id) {
        if (confirm('Are you sure you want to delete this workout?')) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${await this.$auth.getAccessToken()}`
          try {
            await axios.delete(`https://api.traininblocks.com/workouts/${id}`)

            this.$parent.force_get_workouts()
            this.delete = true
            this.workout_notes_function(id)
          } catch (e) {
            console.error(`${e}`)
          }
        }
      }
    }
  }
</script>
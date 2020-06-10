<style scoped>
  /* Block Info */
  .client_info--name.title {
    margin: 0
  }
  .block_info {
    display: grid;
    grid-template-columns: max-content
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
  .message {
    display: grid;
    grid-template-columns: 24px 1fr;
    grid-gap: .4rem;
    margin: 2rem 0;
    font-size: .8rem
  }
  .message > p, .message svg {
    margin: auto
  }
  .message--failed {
    display: grid;
    grid-gap: .4rem;
    margin: 2rem 0;
    font-size: .8rem
  }
  .button--failed {
    margin: 0;
    padding: .2rem
  }
  .toggleFloatingNav {
    display: grid;
    grid-template-columns: 10px 1fr 10px;
    grid-gap: 1rem;
    justify-self: center;
    position: relative;
    right: -2rem;
    user-select: none;
    margin-bottom: 1rem;
    text-align: center;
    font-size: .8rem;
    font-weight: bold;
    cursor: pointer;
    transition: grid-gap .4s, transform .1s cubic-bezier(.165, .84, .44, 1)
  }
  .toggleFloatingNav:hover {
    grid-gap: .2rem
  }
  .toggleFloatingNav:active {
    transform: scale(.8)
  }
  .section-title {
    margin: 0 0 2rem 0
  }

  /* Block Grid */
  .block_grid {
    display: grid;
    grid-gap: 5rem;
    margin-top: 5rem
  }

  /* Calendar */
  .calendar {
    display: grid;
    padding: 5rem;
    box-shadow: 0 0 20px 10px #28282810
  }
  .fc.fc-ltr.fc-unthemed {
    width: 70%
  }
  .fc-event {
    font-size: .8rem
  }

  /* Block Table */
  .block-plan {
    padding: 5rem;
    box-shadow: 0 0 20px 10px #28282810
  }
  .block_table {
    height: fit-content;
    max-width: 482px
  }
  .block_table--container {
    border: 1px solid #282828;
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

  /* Copy */
  #copy, #info {
    margin: auto 0 auto 1rem;
    cursor: pointer;
    transition: opacity 1s, transform .1s cubic-bezier(.075, .82, .165, 1)
  }
  #copy:hover, #info:hover {
    opacity: .6
  }
  #copy:active, #info:active {
    transform: scale(.9)
  }

  /* Workouts */
  .container--workouts {
    display: grid;
    grid-template-columns: repeat(3, 300px);
    grid-gap: 2rem
  }
  .wrapper--workout {
    height: fit-content;
    background-color: #F4F4F4;
    transition: all 1s cubic-bezier(.165, .84, .44, 1)
  }
  .workouts--workout {
    margin: 0;
    padding: 1rem
  }
  .workout--header {
    display: flex
  }
  .text--date {
    font-size: .8rem
  }
  .bottom-bar {
    padding: .6rem 1rem
  }
  .bottom-bar .button {
    margin: 0
  }
  .show-workout {
    padding: 12px 15px;
    max-height: 314px;
    color: #282828;
    line-height: 1.42;
    overflow-y: auto;
    font-size: .8rem
  }
  .show-workout h2 {
    font-size: 1.5rem
  }
  .show-workout p, .show-workout ul, .show-workout ol {
    text-decoration: none;
    margin: 0;
    padding: 0
  }
  .activeWorkout {
    background-color: white;
    box-shadow: 0 0 20px 10px #28282810
  }

  /* Graph */
  .graph {
    padding: 5rem;
    box-shadow: 0 0 20px 10px #28282810
  }
  .container--content {
    display: grid;
    grid-template-columns: 1fr 1fr
  }
  .data-select {
    display: grid;
    grid-gap: 4rem;
    width: fit-content;
    grid-template-columns: 1fr 1fr
  }
  .data-select__options {
    display: grid;
    grid-gap: 1rem;
    width: fit-content
  }
  #chart {
    width: 500px
  }
  .data-desc__p {
    margin: 1rem 0
  }

  /* Add Workout Form */
  #button--new-workout {
    margin: 0;
    width: 100%
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

  /* Toolkit */
  .modal--toolkit {
    padding: 1rem
  }
  .workout_toolkit--content > div {
    display: grid;
    grid-gap: 1rem
  }
  .workout_toolkit label {
    font-weight: bold
  }
  .workout_toolkit--select {
    padding: .4rem
  }

  /* Copy Modal */
  .modal--copy {
    padding: 2rem
  }
  .modal--copy h3 {
    margin: 0 0 1.5rem 0
  }
  .form--copy {
    display: grid;
    grid-template-columns: .4fr 1fr;
    grid-gap: .4rem
  }
  .form--copy label {
    font-weight: bold
  }
  .form--copy input {
    width: 100%;
    margin: .4rem 0
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
    .form--copy {
      grid-template-columns: 1fr
    }
    #copy:hover {
      opacity: 1
    }
  }
</style>

<template>
    <div id="blocks">
      <modal name="copy" height="auto" :draggable="true" :adaptive="true">
        <div class="modal--copy">
          <h3>Let's progress the workouts!</h3>
          <form class="form--copy">
            <div>
              <label for="range">From 1 to: </label>
              <input name="range" type="number"/>
            </div>
            <div>
              <label for="exclude">Exclude cycles: </label>
              <input name="exclude" type="text" pattern="/\d+/gmi"/>
            </div>
            <button class="button" type="submit">Copy</button>
          </form>
        </div>
      </modal>
      <modal name="toolkit" height="auto" :draggable="true" :adaptive="true">
        <div class="modal--toolkit" >
          <select class="workout_toolkit--select" v-on:change="get_toolkit()">
            <option>Maximal Heart Rate (Tanaka)</option>
            <option>Maximal Heart Rate (Gellish)</option>
            <option>Heart Rate Training Zone (Karvonen)</option>
            <option>Heart Rate Reserve</option>
            <option>Body Mass Index</option>
          </select>
          <div class="workout_toolkit--content">
            <div v-if="toolkit_calcs.mhr_tanaka.view">
              <label for="tanaka_age">Age: </label><input type="number" v-on:input="mhr_tanaka_calc()" id="tanaka_age" name="tanaka_age"/>
              <p><b>MHR: </b>{{toolkit_calcs.mhr_tanaka.value}} BPM</p>
            </div>
            <div v-if="toolkit_calcs.mhr_gellish.view">
              <label for="gellish_age">Age: </label><input type="number" v-on:input="mhr_gellish_calc()" id="gellish_age" name="gellish_age"/>
              <p><b>MHR: </b>{{toolkit_calcs.mhr_gellish.value}} BPM</p>
            </div>
            <div v-if="toolkit_calcs.hrtz.view">
              <label for="intensity">Intensity: </label><input type="number" v-on:input="hrtz_calc()" id="intensity" name="intensity"/>
              <label for="mhr">Maximal Heart Rate: </label><input type="number" v-on:input="hrtz_calc()" id="mhr" name="mhr"/>
              <label for="rhr">Resting Heart Rate: </label><input type="number" v-on:input="hrtz_calc()" id="rhr" name="rhr"/>
              <p><b>HR: </b>{{toolkit_calcs.hrtz.value}} BPM</p>
            </div>
            <div v-if="toolkit_calcs.hrr.view">
              <label for="hrr_mhr">Maximal Heart Rate: </label><input type="number" v-on:input="hrr_calc()" id="hrr_mhr" name="hrr_mhr"/>
              <label for="hrr_rhr">Resting Heart Rate: </label><input type="number" v-on:input="hrr_calc()" id="hrr_rhr" name="hrr_rhr"/>
              <p><b>HRR: </b>{{toolkit_calcs.hrr.value}} BPM</p>
            </div>
            <div v-if="toolkit_calcs.bmi.view">
              <label for="height">Height: </label><input type="number" v-on:input="bmi_calc()" id="height" name="height"/>
              <label for="weight">Weight: </label><input type="number" v-on:input="bmi_calc()" id="weight" name="weight"/>
              <p><b>BMI: </b>{{toolkit_calcs.bmi.value}} kg/m<sup>2</sup></p>
            </div>
          </div>
        </div>
      </modal>
      <!-- Loop through programmes and v-if programme matches route so that programme data object is available throughout -->
      <div v-for="(programme, index) in this.$parent.$parent.client_details.programmes"
        :key="index">
        <modal name="blockNotes" height="auto" :draggable="true" :adaptive="true" :before-close="updateBlockNotes()">
          <div>
            <p><b>Block Notes</b></p>
          </div>
          <quill v-model="programme.notes" output="html" class="quill" :config="quillSettings"/>
        </modal>
        <div v-if="programme.id == $route.params.id">
          <div class="top_grid">
            <div class="client_info">
              <input class="client_info--name title" type="text" name="name" autocomplete="name" v-model="$parent.$parent.client_details.name" v-on:click="$parent.editing()"/>
               <!-- Update the programme info -->
              <form class="block_info">
                <input class="block_info--name title" type="text" name="name" v-model="programme.name" v-on:click="editing()">
                <label>Duration: <input id="duration" type="number" name="duration" inputmode="decimal" v-model="programme.duration" required v-on:click="editing()"/></label>
                <label>Start: <input id="start" type="date" name="start" v-model="programme.start" required v-on:click="editing()"/></label>
              </form>
            </div>  <!-- client_info -->
            <div class="floating_nav--container">
              <div class="floating_nav">
                <div class="toggleFloatingNav" @click="toggleFloatingNav()"><p>[</p><p>{{msgFloatingNav}}</p><p>]</p></div>
                <a v-show="showFloatingNav" href="javascript:void(0)" @click="$parent.showClientNotes()"><p class="text--hideable">Client Notes</p><inline-svg class="floating_nav__icon" :src="require('../../../assets/svg/User.svg')"/></a>
                <a v-show="showFloatingNav" href="javascript:void(0)" @click="showBlockNotes()"><p class="text--hideable">Block Notes</p><inline-svg class="floating_nav__icon" :src="require('../../../assets/svg/BlockNotes.svg')"/></a>
                <a v-show="showFloatingNav" href="javascript:void(0)" @click="showToolkit()"><p class="text--hideable">Toolkit</p><inline-svg :src="require('../../../assets/svg/Toolkit.svg')"/></a>
                <a v-show="showFloatingNav" href="javascript:void(0)" @click="delete_block()"><p class="text--hideable">Delete Block</p><inline-svg class="floating_nav__icon" :src="require('../../../assets/svg/Trash.svg')"/></a>
                <div v-if="str != 0" class="message">
                  <inline-svg class="floating_nav__icon" :src="require('../../../assets/svg/status/'+ msgIcon)" v-if="msg !== 'Idle'"/>
                  <p>{{msg}}</p>
                </div>
                <div v-if="str === undefined || str === null || str == 0 || str === []" class="message--failed">
                  <p>Failed to scan</p>
                  <button @click="scan()" class="button button--failed">Retry</button>
                </div>
              </div> <!-- floating_nav -->
            </div>
          </div> <!-- top_grid -->
          <div class="block_grid">
            <div class="calendar">
              <FullCalendar defaultView="dayGridMonth" :plugins="calendarPlugins" :weekNumbers="true" :events="workoutDates" :eventColor="'#282828'"/>
            </div>
            <div class="block-plan">
              <div class="block_table">
                <h3 class="section-title">Microcycles</h3>
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
                <div class="workout--header">
                  <h3>Workouts</h3>
                  <inline-svg id="info" :src="require('../../../assets/svg/Info.svg')" title="Info"/>
                  <inline-svg id="copy" :src="require('../../../assets/svg/Copy.svg')" @click="showCopy()"/>
                </div>
                <p v-if="$parent.no_workouts">No workouts yet. You can add one below.</p>
                <p v-if="$parent.loading_workouts">Loading workouts...</p>
                <div>
                  <div class="container--workouts" v-if="!$parent.no_workouts">
                    <!-- Loop through workouts -->
                    <div class="wrapper--workout" :class="{activeWorkout: workout.id === editWorkout}" v-for="(workout, index) in programme.workouts"
                      :key="index">
                      <p class="workouts--workout">
                        <span><b>{{workout.name}}</b></span><br>
                        <span class="text--date">{{day(workout.date)}}</span>
                        <span class="text--date">{{workout.date}}</span>
                      </p>
                      <quill v-if="workout.id === editWorkout" v-model="workout.notes" output="html" class="quill animate__animated animate__fadeIn" :config="quillSettings"/>
                      <div v-if="workout.id !== editWorkout" v-html="workout.notes" class="show-workout animate__animated animate__fadeIn"/>
                      <div class="bottom-bar">
                        <button id="button-edit" class="button" v-show="!isEditingWorkout" v-if="workout.id !== editWorkout" @click="editingWorkoutNotes(workout.id)">Edit</button>
                        <button id="button-save" class="button" v-if="workout.id === editWorkout" @click="updateWorkoutNotes(workout.id)">Save</button>
                        <button id="button-move" class="button">Move</button>
                        <button id="button-delete" class="button delete" @click="delete_workout(workout.id)">Delete</button>
                      </div>
                    </div>
                    <div>
                      <button v-if="!creating" id="button--new-workout" class="button" v-on:click="creation()">New workout</button>
                      <p class="response" v-if="!creating">{{response}}</p>
                      <div v-if="creating" class="add_workout_container">
                        <h3>New Workout</h3>
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
                    </div><!-- Add a new workout -->
                  </div>
                </div>
              </div><!-- workouts -->
            </div>
            <div class="graph">
              <div>
                <h3 class="section-title">Statistics</h3>
              </div>
              <div class="container--content">
                <div>
                  <div class="data-select">
                    <div class="data-select__options">
                      <label for="measure"><b>Data: </b></label>
                      <select @change="selection()" id="dataName" name="measure">
                      </select>
                    </div>
                    <div class="data-select__options" v-show="showType">
                      <label for="measure-type"><b>Data type: </b></label>
                      <select @change="selection()" id="dataType" name="measure-type">
                        <option>Sets</option>
                        <option>Reps</option>
                        <option>Load</option>
                        <option>Volume</option>
                      </select>
                    </div>
                  </div>
                  <div class="spacer"/>
                  <div v-show="showType" class="data-desc">
                    <p v-html="p1" class="data-desc__p" />
                    <p v-html="p2" class="data-desc__p" /><br>
                    <p v-html="p3" class="data-desc__p" />
                    <p v-html="p4" class="data-desc__p" />
                    <p v-html="p5" class="data-desc__p" />
                  </div>
                  <p v-show="!showType">[ Only data that follows the format will show descriptive statistics here ]</p>
                </div>
                <line-chart id="chart" :chart-data="dataCollection" :options="options"/>
              </div>
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

  import FullCalendar from '@fullcalendar/vue'
  import dayGridPlugin from '@fullcalendar/daygrid'
  import '@fullcalendar/core/main.css'
  import '@fullcalendar/daygrid/main.css'

  export default {
    components: {
      Loader,
      LineChart,
      InlineSvg,
      FullCalendar
    },
    props: ['quillSettings', 'childData'],
    data: function () {
      return {
        showFloatingNav: true,
        msgFloatingNav: 'Hide',
        creating: false,
        response: '',
        edit1: false,
        toolkit: false,
        toolkit_calcs: {
          mhr_tanaka: {
            view: false,
            value: null
          },
          mhr_gellish: {
            view: false,
            value: null
          },
          hrtz: {
            view: false,
            value: null
          },
          hrr: {
            view: false,
            value: null
          },
          bmi: {
            view: false,
            value: null
          }
        },
        new_workout: {
          name: '',
          date: ''
        },
        delete: false,
        showType: true,
        dataPacketStore: [],
        regexExtract: /\[\s*(.*?)\s*:\s*(.*?)\]/gi,
        regexSetsReps: /(\d*)x((\d*\/*)*)/gi,
        regexLoadCapture: /(at|@)(.+)/gi,
        regexNumberBreakdown: /[0-9.]+/gi,
        dataCollection: null,
        options: null,
        str: [],
        yData: [],
        xLabel: [],
        calendarPlugins: [ dayGridPlugin ],
        workoutDates: [],
        msg: 'Idle',
        msgIcon: 'Cog.svg',
        isEditingWorkout: false,
        editWorkout: null,
        p1: null,
        p2: null,
        p3: null,
        p4: null,
        p5: null
      }
    },
    created () {
      this.$parent.blocks = true
    },
    async mounted () {
      await this.$parent.get_client_details()
      await this.initPreScan()
      await this.scan()
    },
    methods: {
      toggleFloatingNav () {
        this.showFloatingNav = !this.showFloatingNav
        if (this.msgFloatingNav === 'Hide') {
          this.msgFloatingNav = 'Options'
        } else {
          this.msgFloatingNav = 'Hide'
        }
      },
      showCopy () {
        this.$modal.show('copy')
      },
      showBlockNotes () {
        this.$modal.show('blockNotes')
      },
      showToolkit () {
        this.$modal.show('toolkit')
      },
      updateBlockNotes () {
        this.update_programme()
      },
      editingWorkoutNotes (id) {
        this.isEditingWorkout = true
        this.editWorkout = id
        this.msg = 'Editing...'
      },
      updateWorkoutNotes (id) {
        this.update_workout(id)
        this.isEditingWorkout = false
        this.editWorkout = null
        this.scan()
      },
      handleScroll () {
        this.scrollpx = window.scrollY
      },

      // CHART METHODS //

      fillData () {
        this.dataCollection = {
          labels: this.xLabel,
          datasets: [
            {
              label: 'Data Point',
              borderColor: '#282828',
              backgroundColor: 'transparent',
              data: this.yData
            }
          ]
        }
        this.options = {
          legend: {
            display: false
          },
          chartOptions: {
            responsive: true,
            maintainAspectRatio: false
          },
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: false
              }
            }]
          }
        }
      },
      // This is called at the start and after @change. It scans the current values selected and fills the chart.
      selection () {
        this.showType = true
        this.yData.length = 0
        this.xLabel.length = 0
        var dataForName = document.getElementById('dataName').value
        var dataForType = document.getElementById('dataType').value
        var dataForSum = 0
        var overviewStore = []
        this.dataPacketStore.forEach((item) => {
          overviewStore.length = 0
          item.forEach((exerciseDataPacket) => {
            const tidyA = dataForName.replace(/\(/g, '\\(')
            const tidyB = tidyA.replace(/\)/g, '\\)')
            const regex = RegExp(tidyB, 'gi')
            var protocol = exerciseDataPacket[2].replace(/\s/g, '')
            if (regex.test(exerciseDataPacket[1]) === true) {
              this.xLabel.push(exerciseDataPacket[0])
              if ((dataForType === 'Sets' || dataForType === 'Reps') && exerciseDataPacket[2].includes('at') === true) {
                this.yData.push(this.setsReps(protocol, dataForType))
              }
              if (dataForType === 'Load' && exerciseDataPacket[2].includes('at') === true) {
                this.yData.push(this.load(protocol))
              }
              if (dataForType === 'Volume' && exerciseDataPacket[2].includes('at') === true) {
                var agg = this.setsReps(protocol, 'Reps') * this.load(protocol)
                this.yData.push(agg)
              }
              if (exerciseDataPacket[2].includes('at') !== true) {
                this.showType = false
                this.yData.push(this.otherMeasures(protocol))
              }
            }
            if (dataForName === 'Block Overview' && exerciseDataPacket[2].includes('at') === true) {
              if (dataForType === 'Sets' || dataForType === 'Reps') {
                dataForSum = this.setsReps(protocol, dataForType)
              }
              if (dataForType === 'Load') {
                dataForSum = this.load(protocol)
              }
              if (dataForType === 'Volume') {
                dataForSum = this.setsReps(protocol, 'Reps') * this.load(protocol)
              }
              overviewStore.push(dataForSum)
            }
          })
          if (dataForName === 'Block Overview' && overviewStore.length !== 0) {
            this.yData.push(overviewStore.reduce((a, b) => a + b))
          }
        })
        if (dataForName === 'Block Overview') {
          let x = 1
          for (; x <= this.yData.length; x++) {
            this.xLabel.push('Workout ' + x)
          }
        }
        this.descStats(dataForType)
        this.fillData()
      },

      // INIT METHODS //

      initPreScan () {
        this.childData.programmes.forEach((programme) => {
            // eslint-disable-next-line
            if (programme.id == this.$route.params.id) {
              this.str = programme.workouts
            }
        })
      },
      scan () {
        this.initPreScan()
        this.workoutDates.length = 0
        this.dataPacketStore.length = 0
        // Pulls and creates nested arrays. dataPacketStore > workoutDataPackets > exerciseDataPackets
        if (this.str !== undefined) {
          this.str.forEach((object) => {
            this.workoutDates.push({title: object.name, date: object.date})
            if (object.notes !== null) {
              var pulledProtocols = this.pullProtocols(object.name, object.notes)
              this.dataPacketStore.push(this.chunkArray(pulledProtocols))
            }
          })
          // Appends the options to the select
          this.dropdownInit()
          this.selection()
        }
      },
      // Extracts the protocols and measures and stores it all into a temporary array
      pullProtocols (workoutName, text) {
        var textNoHTML = text.replace(/<[^>]*>?/gm, '')
        var tempStore = []
        let m
        while ((m = this.regexExtract.exec(textNoHTML)) !== null) {
          if (m.index === this.regexExtract.lastIndex) {
            this.regexExtract.lastIndex++
          }
          m.forEach((match, groupIndex) => {
            if (groupIndex === 0) {
              tempStore.push(workoutName)
            }
            if (groupIndex === 1 || groupIndex === 2) {
              tempStore.push(match)
            }
          })
        }
        return tempStore
      },
      // Breaks down the temporary array into data packets of length 2
      // Data Packet format: ['NAME', 'PROTOCOL/MEASURE/NUMBERS']
      chunkArray (myArray) {
        var index = 0
        var tempArray = []
        for (index = 0; index < myArray.length; index += 3) {
          var dataPacket = myArray.slice(index, index + 3)
          tempArray.push(dataPacket)
        }
        return tempArray
      },
      // Init the dropdown selection with validation
      dropdownInit () {
        var dropdownEl = document.getElementById('dataName')
        var ddLength = dropdownEl.options.length
        let i
        for (i = ddLength - 1; i >= 0; i--) {
          dropdownEl.remove(i)
        }
        var option = document.createElement('option')
        option.text = 'Block Overview'
        dropdownEl.add(option)
        var tempItemStore = []
        var tempItemStoreLate = []
        this.dataPacketStore.forEach((item) => {
          item.forEach((exerciseDataPacket) => {
            const tidyA = exerciseDataPacket[1].replace(/\(/g, '\\(')
            const tidyB = tidyA.replace(/\)/g, '\\)')
            const regexA = RegExp(tidyB, 'gi')
            const regexB = RegExp(/[|\\/)(~^:,;?!&%$@*+]/, 'g')
            var itemCased = this.properCase(exerciseDataPacket[1])
            if (regexA.test(tempItemStore) !== true && exerciseDataPacket[2].includes('at') === true) {
              tempItemStore.push(itemCased)
            }
            if (regexA.test(tempItemStoreLate) !== true && exerciseDataPacket[2].includes('at') !== true) {
              if (regexB.test(exerciseDataPacket[1]) === true) {
                tempItemStoreLate.push(exerciseDataPacket[1])
              } else {
                tempItemStoreLate.push(itemCased)
              }
            }
          })
        })
        tempItemStore.forEach((item) => {
          var option = document.createElement('option')
          option.text = item
          dropdownEl.add(option)
        })
        tempItemStoreLate.forEach((item) => {
          var option = document.createElement('option')
          option.text = item
          dropdownEl.add(option)
        })
      },
      // Creates proper casing, works in conjuction with dropdownAppend to validate if exercise is already in the list.
      properCase (string) {
        var sentence = string.toLowerCase().split(' ')
        for (var i = 0; i < sentence.length; i++) {
          sentence[i] = sentence[i][0].toUpperCase() + sentence[i].slice(1)
        }
        return sentence.join(' ')
      },

      // REGEX METHODS //

      // Extracts anything for Sets and Reps
      setsReps (protocol, dataForType) {
        var setStore = null
        var extractedSetsReps = null
        var tempSetsRepsStore = []
        let m
        while ((m = this.regexSetsReps.exec(protocol)) !== null) {
          if (m.index === this.regexSetsReps.lastIndex) {
            this.regexSetsReps.lastIndex++
          }
          m.forEach((match, groupIndex) => {
            if (groupIndex === 1) {
              setStore = parseInt(match)
            }
            if (dataForType === 'Sets' && groupIndex === 1) {
              extractedSetsReps = parseInt(match)
            }
            if (dataForType === 'Reps' && groupIndex === 2) {
              if (match.includes('/') === true) {
                let n
                while ((n = this.regexNumberBreakdown.exec(match)) !== null) {
                  if (n.index === this.regexNumberBreakdown.lastIndex) {
                    this.regexNumberBreakdown.lastIndex++
                  }
                  n.forEach((repsMatchExact) => {
                    tempSetsRepsStore.push(parseInt(repsMatchExact))
                  })
                }
                extractedSetsReps = tempSetsRepsStore.reduce((a, b) => a + b)
              } else {
                extractedSetsReps = parseInt(match) * parseInt(setStore)
              }
            }
          })
        }
        return extractedSetsReps
      },
      // Extracts anything for Loads
      load (protocol) {
        var tempLoadStore = []
        let m
        while ((m = this.regexLoadCapture.exec(protocol)) !== null) {
          if (m.index === this.regexLoadCapture.lastIndex) {
            this.regexLoadCapture.lastIndex++
          }
          m.forEach((loadMatch, groupIndex) => {
            if (groupIndex === 2) {
              let n
              while ((n = this.regexNumberBreakdown.exec(loadMatch)) !== null) {
                if (n.index === this.regexNumberBreakdown.lastIndex) {
                  this.regexNumberBreakdown.lastIndex++
                }
                n.forEach((loadMatchExact) => {
                  tempLoadStore.push(parseFloat(loadMatchExact))
                })
              }
            }
          })
        }
        var sum = tempLoadStore.reduce((a, b) => a + b)
        return sum
      },
      // Extracts any other measures
      otherMeasures (protocol) {
        var data = 0
        let m
        while ((m = this.regexNumberBreakdown.exec(protocol)) !== null) {
          if (m.index === this.regexNumberBreakdown.lastIndex) {
            this.regexNumberBreakdown.lastIndex++
          }
          m.forEach((match) => {
            data = parseFloat(match)
          })
        }
        return data
      },
      descStats (dataForType) {
        var storeMax = 0
        var store = 0
        var sum = this.yData.reduce((a, b) => a + b)

        // Sets descriptive data with its corresponding info.
        this.p1 = '<b>Total' + ' ' + dataForType + ':</b> ' + sum
        this.p2 = '<b>Average' + ' ' + dataForType + ':</b> ' + (sum / this.yData.length).toFixed(1)

        this.yData.forEach((value) => {
          storeMax = Math.max(storeMax, value)
        })
        this.p3 = '<b>Maximum' + ' ' + dataForType + ':</b> ' + storeMax
        store = storeMax
        this.yData.forEach((value) => {
          store = Math.min(store, value)
        })
        this.p4 = '<b>Minimum' + ' ' + dataForType + ':</b> ' + store
        this.p5 = 'Percentage Change: ' + ((storeMax / store) * 100).toFixed(1) + '%'
      },

      // OTHER METHODS //

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
      /* Opens the toolkit */
      open_toolkit (id) {
        // Set toolkit to true
        this.toolkit = id

        this.get_toolkit()

        // Set vue self
        var self = this

        function click (e) {
          if (!document.getElementById('workout_toolkit_' + id).contains(e.target)) {
            window.removeEventListener('click', click)
            self.toolkit = false
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
      /* Various workout calculators */
      mhr_tanaka_calc () {
        this.toolkit_calcs.mhr_tanaka.value = 220 - Number(document.querySelector('#tanaka_age').value)
      },
      mhr_gellish_calc () {
        this.toolkit_calcs.mhr_gellish.value = 220 - 0.7 * Number(document.querySelector('#gellish_age').value)
      },
      hrtz_calc () {
        this.toolkit_calcs.hrtz.value = (Number(document.querySelector('#intensity').value / 100)) * (Number(document.querySelector('#mhr').value) - Number(document.querySelector('#rhr').value)) + Number(document.querySelector('#rhr').value)
      },
      hrr_calc () {
        this.toolkit_calcs.hrr.value = Number(document.querySelector('#hrr_mhr').value) - Number(document.querySelector('#hrr_rhr').value)
      },
      bmi_calc () {
        this.toolkit_calcs.bmi.value = (Number(document.querySelector('#weight').value) / (Number(document.querySelector('#height').value) * Number(document.querySelector('#height').value))).toFixed(2)
      },
      /* Closes the toolkit */
      close_toolkit () {
        this.toolkit_calcs.mhr_tanaka.view = false
        this.toolkit_calcs.mhr_gellish.view = false
        this.toolkit_calcs.hrtz.view = false
        this.toolkit_calcs.hrr.view = false
        this.toolkit_calcs.bmi.view = false
        document.querySelectorAll('.workout_toolkit--content input').forEach(e => {
          e.value = null
        })
      },
      /* Selects the correct calculator depending on the select */
      get_toolkit () {
        const select = document.querySelector('.workout_toolkit--select').value
        if (select === 'Maximal Heart Rate (Tanaka)') {
          this.close_toolkit()
          this.toolkit_calcs.mhr_tanaka.view = true
        } else if (select === 'Maximal Heart Rate (Gellish)') {
          this.close_toolkit()
          this.toolkit_calcs.mhr_gellish.view = true
        } else if (select === 'Heart Rate Training Zone (Karvonen)') {
          this.close_toolkit()
          this.toolkit_calcs.hrtz.view = true
        } else if (select === 'Heart Rate Reserve') {
          this.close_toolkit()
          this.toolkit_calcs.hrr.view = true
        } else if (select === 'Body Mass Index') {
          this.close_toolkit()
          this.toolkit_calcs.bmi.view = true
        }
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
            if (this.$parent.$parent.posts[x].client_id === this.$route.params.client_id) {
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
          if (!document.querySelector('.block_info').contains(e.target)) {
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
          this.msg = 'Saving...'
          await axios.post(`https://api.traininblocks.com/workouts`,
            {
              'id': workoutsId,
              'notes': workoutsNotes
            }
          )
          this.msg = 'Idle'
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
          this.scan()
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
            this.scan()
          } catch (e) {
            console.error(`${e}`)
          }
        }
      }
    }
  }
</script>
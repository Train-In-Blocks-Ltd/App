<style scoped>
  /* Block Info */
  .client_info--name.title {
    margin: 0
  }
  .block_info {
    display: flex;
    flex-direction: column
  }
  #blocks .block_info label {
    display: flex;
    align-items: center;
    grid-auto-columns: min-content;
    font-weight: bold
  }
  .wrapper-start-date {
    display: flex;
    align-self: baseline;
    align-items: center
  }
  #duration, .block_info input#start {
    font-size: 1rem;
    margin-left: 1rem
  }
  #blocks .block_info input.block_info--name {
    margin-left: 0;
    max-width: 100%;
    font-weight: 700;
    padding: .6rem 0;
    letter-spacing: .15rem;
    font-size: 1.6rem
  }
  #blocks .block_info input.block_info--name:focus {
    padding: .6rem 1rem
  }
  .multi-select {
    display: grid;
    grid-gap: .4rem;
    position: fixed;
    top: 6rem;
    right: 2rem;
    margin-top: 1.5rem;
    text-align: right;
    background-color: #FFFFFF99;
    z-index: 99;
    padding: 1rem 0 1rem 1rem
  }
  .multi-select a {
    color: #282828;
    text-decoration: none;
    transition: all .6s cubic-bezier(.165, .84, .44, 1)
  }
  .multi-select a:hover {
    opacity: .6
  }
  .floating_nav__icon {
    cursor: pointer
  }
  .section-title {
    margin: 0 0 2rem 0
  }
  .text--selected {
    font-size: .8rem
  }

  /* Block Grid */
  .block_grid {
    display: grid;
    grid-gap: 6rem;
    margin-top: 4rem
  }
  .block-notes {
    grid-area: b;
    margin: 0 0 4rem 0
  }

  /* Block Table */
  .block_table__header h3 {
    margin: 0
  }
  .block_table__header {
    display: grid;
    margin: 0 0 4rem 0;
    grid-gap: 1rem
  }
  #duration {
    width: 4rem
  }
  .block_table {
    height: fit-content
  }
  .block_table--container {
    display: inline-block;
    width: 100%;
    font-weight: bold;
    text-align: center
  }
  .block_table--container--block_duration_container {
    display: grid;
    grid-gap: 1rem .4rem;
    grid-template-columns: repeat(auto-fill, 50px);
    border: none;
    padding: 0
  }

  /* Week */
  .week-color-picker {
    margin: auto 0 auto 1rem;
    height: 28px;
    border: #282828
  }
  .container--week {
    height: 100px;
    user-select: none
  }
  .week__color {
    width: 50px;
    height: 6px
  }
  .week__number {
    padding: 1rem 0
  }
  .week {
    display: grid;
    grid-template-rows: 6px 90px;
    cursor: pointer;
    box-shadow: 0 0 14px 08px #28282808;
    background-color: #F2F2F2;
    min-width: 50px;
    height: 74px;
    width: 100%;
    border-radius: 6px;
    transition: all 1s cubic-bezier(.165, .84, .44, 1)
  }
  .week:hover {
    box-shadow: inset 0 20px 30px -30px #28282840
  }
  .weekActive {
    border-bottom: 2px solid #EEEEEE;
    box-shadow: 0 0 20px 10px #28282815;
    background-color: white;
    height: 94px
  }
  .week.weekActive:hover {
    box-shadow: 0 0 20px 10px #28282808
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
  .workout--header {
    display: flex
  }
  .wrapper--workout {
    display: grid;
    grid-template-areas:
      'header'
      'body'
      'bar'
  }
  .wrapper--workout__header {
    grid-area: header;
    display: flex;
    justify-content: space-between
  }
  .select-checkbox {
    vertical-align: middle;
    height: 1.4rem;
    width: 1.4rem;
    cursor: pointer
  }
  .container--workouts {
    display: grid;
    grid-gap: 6rem;
    margin-top: 4rem
  }
  input.workout-name, input.workout-date {
    text-overflow: ellipsis;
    border: 0;
    border-bottom: 1px solid #282828;
    outline-width: 0;
    padding: 0
  }
  input.workout-name {
    width: 40%;
    font-size: 1rem;
    font-weight: bold
  }
  input.workout-date {
    cursor: pointer;
    width: fit-content;
    font-size: .8rem
  }
  .show-workout {
    grid-area: body
  }
  .show-feedback {
    padding: 12px 15px;
    grid-area: feedback
  }
  .bottom-bar {
    grid-area: bar
  }
  .bottom-bar .button {
    margin: 0
  }
  .newWorkout {
    background-color: #F6F6F6;
    padding: 1rem
  }
  .incomplete {
    color: #B80000
  }
  .completed {
    color: green
  }
  .editingChecked {
    cursor: pointer;
    text-decoration: underline
  }
  .showingFeedback {
    grid-template-areas:
      'header header'
      'body feedback'
      'bar bar'
  }

  /* Graph */
  .container--content {
    display: flex;
    flex-direction: column
  }
  .data-select {
    display: grid;
    grid-gap: 2rem;
    width: fit-content
  }
  .data-select__options {
    display: grid;
    grid-gap: 1rem;
    width: fit-content
  }
  .data-select__options select {
    background-color: transparent;
    border: 0;
    font-size: 1.6rem;
    width: fit-content;
    padding: .2rem 1rem .2rem 0;
    font-weight: bold;
    margin: .4rem 0
  }
  #chart {
    margin-top: 4rem;
    position: relative
  }
  .data-desc {
    display: grid;
    grid-template-columns: 1fr 1fr;
    margin-top: 4rem
  }
  .data-desc__value {
    margin: .4rem 0 2rem 0;
    font-size: 2.4rem;
    font-weight: bold
  }

  /* Add Workout Form */
  #button--new-workout {
    margin: 2rem 0;
    width: 100%
  }

  @media (max-width: 992px) {
    .showingFeedback {
      grid-template-areas:
        'header'
        'body'
        'feedback'
        'bar'
    }
  }
  @media (max-width: 768px) {
    .multi-select {
      top: -2rem;
      right: 0;
      padding: 2rem;
      width: 100%;
      background-color: white;
      box-shadow: 0 0 20px 10px #28282812
    }
    .multi-select a {
      grid-template-columns: 1fr
    }
    .multi-select svg {
      margin-left: auto
    }
    #copy:hover {
      opacity: 1
    }
    #blocks .block_info input.block_info--name {
      font-size: 1.4rem;
      max-width: 90%
    }
    input.workout-name {
      width: 60%
    }
  }

  @media (max-width: 576px) {
    /* Container */
    .block_grid {
      display: block
    }
    .calendar, .block-plan, .graph {
      margin: 4rem 0
    }
    #blocks .block_info input.block_info--name {
      font-size: 1.2rem
    }
    #client .client_info input.client_info--name {
      font-size: 1.6rem
    }

    /* Workout */
    input.workout-name {
      width: 100%
    }

    /* Full screen editor */
    .activeWorkout {
      border: none;
      height: 100vh;
      width: 100vw;
      position: fixed;
      background-color: white;
      z-index: 11;
      top: 0;
      left: 0;
      padding: 2rem 2rem 6rem 2rem
    }
  }
</style>

<template>
    <div id="blocks">
      <modal name="info" height="auto" :adaptive="true">
        <div class="modal--info">
          <p><b>The format for tracking data</b></p><br>
          <p><b>[ </b><em>Exercise Name</em><b>:</b> <em>Sets</em> <b>x</b> <em>Reps</em> <b>at</b> <em>Load</em> <b>]</b></p><br>
          <p><b>Examples</b></p><br>
          <p><i>[Back Squat: 3x6 at 50kg]</i></p>
          <p><i>[Back Squat: 3x6/4/3 at 50kg]</i></p>
          <p><i>[Back Squat: 3x6 at 50/55/60kg]</i></p>
          <p><i>[Back Squat: 3x6/4/3 at 50/55/60kg]</i></p><br>
          <p><b>[ </b><em>Measurement</em><b>:</b> <em>Value</em> <b>]</b></p><br>
          <p><b>Examples</b></p><br>
          <p><i>[Weight: 5okg]</i></p>
          <p><i>[Vertical Jump: 43.3cm]</i></p>
          <p><i>[Body Fat (%): 12]</i></p>
          <p><i>[sRPE (CR10): 8]</i></p>
          <p><i>[sRPE (Borg): 16]</i></p><br>
          <p>See <i>Help</i> for more information</p>
        </div>
      </modal>
      <modal name="move" height="auto" :adaptive="true">
        <form @submit.prevent="initMove(), $modal.hide('move')" class="modal--move">
          <label for="range">Move to:</label>
          <input class="input--modal" name="range" type="number" v-model="moveTarget" min="1" :max="maxWeek" required/>
          <button type="submit">Move</button>
        </form>
      </modal>
      <modal name="shift" height="auto" :adaptive="true">
        <form @submit.prevent="shiftAcross()" class="modal--shift">
            <label for="range">Shift workout dates by: </label>
            <input class="input--modal" v-model="shiftDays" name="range" type="number" min="1" required/><br>
            <button>Shift</button>
        </form>
      </modal>
      <modal name="copy" height="auto" :adaptive="true">
        <form @submit.prevent="copyAcross()" class="modal--copy">
            <label for="range">From {{currentWeek}} to: </label>
            <input class="input--modal" v-model="copyTarget" name="range" type="number" :min="currentWeek + 1" :max="maxWeek" required/><br>
            <label for="range">Days until next workouts: </label>
            <input class="input--modal" v-model="daysDiff" name="range" type="number" min="1" required/><br>
            <button>Copy</button>
        </form>
      </modal>
      <transition enter-active-class="animate animate__fadeIn animate__faster" leave-active-class="animate animate__fadeOut animate__faster">
        <div class="multi-select" v-if="selectedSessions.length !== 0">
          <p class="text--selected">
            <b>Selected {{selectedSessions.length}} <span v-if="selectedSessions.length === 1">Session</span><span v-if="selectedSessions.length !== 1">Sessions</span> to ...</b>
          </p>
          <a href="javascript:void(0)" class="text--selected selected-options" @click="$modal.show('copy')">Copy Across</a>
          <a href="javascript:void(0)" class="text--selected selected-options" @click="$modal.show('move')">Move</a>
          <a href="javascript:void(0)" class="text--selected selected-options" @click="$modal.show('shift')">Shift</a>
          <a href="javascript:void(0)" class="text--selected selected-options" @click="bulkDelete()">Delete</a>
          <a href="javascript:void(0)" class="text--selected selected-options" @click="deselectAll()">Deselect</a>
        </div>
      </transition>
      <!-- Loop through programmes and v-if programme matches route so that programme data object is available throughout -->
      <div v-for="(programme, index) in this.$parent.$parent.client_details.programmes"
        :key="index">
        <div v-if="programme.id == $route.params.id">
          <div class="top_grid">
            <div class="client_info">
              <input @blur="$parent.update_client()" class="client_info--name title allow-text-overflow" type="text" aria-label="Client Name" autocomplete="name" v-model="$parent.$parent.client_details.name" />
               <!-- Update the programme info -->
              <form class="block_info">
                <input class="block_info--name allow-text-overflow" aria-label="Block name" type="text" name="name" v-model="programme.name" @blur="update_programme()">
                <div class="wrapper-start-date">
                  <label>
                    Start:
                    <input id="start" type="date" name="start" v-model="programme.start" required @blur="update_programme()"/>
                  </label>
                </div>
              </form>
            </div>  <!-- client_info -->
          </div> <!-- top_grid -->
          <div class="block_grid">
            <div class="calendar">
              <div :class="{activeWorkout: editBlockNotes}" class="block-notes">
                <div class="block-notes__header">
                  <p class="block-notes__header__text"><b>Block Notes</b></p>
                </div>
                <quill v-show="editBlockNotes" v-model="programme.notes" output="html" class="quill animate animate__fadeIn" :config="$parent.$parent.config"/>
                <div v-if="!editBlockNotes  && programme.notes !== '' && programme.notes !== null" v-html="programme.notes" class="show-block-notes animate animate__fadeIn no-max-height"/>
                <p v-if="!editBlockNotes && (programme.notes === '' || programme.notes === null)" class="show-block-notes">No block notes added...</p>
                <div class="bottom-bar">
                  <div>
                    <button v-show="!editBlockNotes" @click="editingBlockNotes(true)" class="button button--edit">Edit</button>
                    <button v-show="editBlockNotes" @click="editingBlockNotes(false)" class="button button--save">Save</button>
                    <button v-show="editBlockNotes" @click="cancelBlockNotes()" class="button cancel">Cancel</button>
                  </div>
                </div>
              </div>
              <div class="wrapper--calendar">
                <FullCalendar defaultView="dayGridMonth" :firstDay="1" :plugins="calendarPlugins" :header="calendarToolbarHeader" :footer="calendarToolbarFooter" :events="workoutDates" />
              </div>
            </div>
            <div class="block-plan">
              <div class="block_table">
                <div class="block_table__header">
                  <h3>Microcycles</h3>
                  <div class="wrapper-duration">
                    <label for="duration"><b>Duration: </b></label>
                    <input id="duration" type="number" name="duration" inputmode="decimal" v-model="programme.duration" min="1" required @blur="update_programme()" @change="weekConfirm(programme.duration), maxWeek = programme.duration"/>
                  </div>
                </div>
                <div class="block_table--container">
                  <div class="block_table--container--block_duration_container">
                    <div @click="changeWeek(item), sortWorkouts()" v-for="item in programme_duration(programme.duration)" :key="item" class="container--week">
                      <div :class="{ weekActive: item === currentWeek }" class="week">
                        <div :style="{ backgroundColor: weekColor.backgroundColor[item - 1] }" class="week__color"/>
                        <div class="week__number">{{item}}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div> <!-- block_table -->
              <div class="workouts">
                <div class="workout--header">
                  <h3>Sessions</h3>
                  <input @blur="updateBlockColor()" class="week-color-picker" v-model="weekColor.backgroundColor[currentWeek - 1]" type="color" aria-label="Week Color" />
                  <inline-svg id="info" :src="require('../../../assets/svg/info.svg')" title="Info" @click="$modal.show('info')"/>
                </div>
                <p v-if="$parent.no_workouts">No sessions yet. You can add one below.</p>
                <p v-if="$parent.loading_workouts">Loading sessions...</p>
                <div>
                  <!-- New Workout -->
                  <button id="button--new-workout" @click="createWorkout()">New session</button>
                  <div class="container--workouts" v-if="!$parent.no_workouts">
                    <!-- Loop through workouts -->
                    <div class="wrapper--workout" :class="{activeWorkout: workout.id === editWorkout, newWorkout: workout.name == 'Untitled' && !isEditingWorkout, showingFeedback: workout.id === showFeedback}" v-show="workout.week_id === currentWeek" v-for="(workout, index) in programme.workouts"
                      :key="index">
                      <div class="wrapper--workout__header">
                        <div>
                          <span v-if="workout.id !== editWorkout" class="text--name"><b>{{workout.name}}</b></span><br v-if="workout.id !== editWorkout">
                          <span v-if="workout.id !== editWorkout" class="text--date">{{day(workout.date)}}</span>
                          <span v-if="workout.id !== editWorkout" class="text--date">{{workout.date}}</span><br v-if="workout.id !== editWorkout">
                          <span v-if="workout.id !== editWorkout" :class="{incomplete: workout.checked === 0, completed: workout.checked === 1}" class="text--checked">{{isCompleted(workout.checked)}}</span>
                          <input @blur="scan()" v-if="workout.id === editWorkout" class="workout-name" type="text" name="workout-name" pattern="[^\/]" v-model="workout.name" /><br>
                          <input @blur="scan()" v-if="workout.id === editWorkout" class="workout-date" type="date" name="workout-date" v-model="workout.date" /><br>
                          <span @click="workout.checked = toggleComplete(workout.checked)" v-if="workout.id === editWorkout" :class="{incomplete: workout.checked === 0, completed: workout.checked === 1, editingChecked: workout.id === editWorkout}" class="text--checked">{{isCompleted(workout.checked)}}</span>
                        </div>
                        <input name="select-checkbox" :id="'sc-' + workout.id" class="select-checkbox" type="checkbox" @change="changeSelectCheckbox(workout.id)">
                      </div>
                      <quill v-if="workout.id === editWorkout" v-model="workout.notes" output="html" class="quill animate animate__fadeIn" :class="{expanded: workout.id === isSessionNotesExpanded}" :config="$parent.$parent.config"/>
                      <div v-if="workout.id !== editWorkout" v-html="removeBracketsAndBreaks(workout.notes)" class="show-workout animate animate__fadeIn" :class="{expanded: workout.id === isSessionNotesExpanded}"/>
                      <div v-if="workout.id === showFeedback" class="show-feedback animate animate__fadeIn">
                        <p><b>Feedback</b></p><br>
                        <div v-html="workout.feedback" />
                      </div>
                      <div class="bottom-bar">
                        <div>
                          <button v-show="!isEditingWorkout" v-if="workout.id !== editWorkout" @click="editingWorkoutNotes(workout.id, true)">Edit</button>
                          <button v-if="workout.id === editWorkout" @click="editingWorkoutNotes(workout.id, false)">Save</button>
                          <button class="cancel" v-if="workout.id === editWorkout" @click="cancelWorkout()">Cancel</button>
                          <button v-show="!isEditingWorkout" @click="selectedSessions.length = 0, selectedSessions.push(workout.id), $modal.show('move')">Move</button>
                          <button class="delete" v-show="!isEditingWorkout" @click="soloDelete(workout.id)">Delete</button>
                          <button v-if="workout.feedback !== '' && workout.feedback !== null && workout.id !== showFeedback" @click="showFeedback = workout.id">Feedback</button>
                          <button v-if="workout.feedback !== '' && workout.feedback !== null && workout.id === showFeedback" @click="showFeedback = null">Close Feedback</button>
                        </div>
                        <inline-svg v-show="isSessionNotesExpanded === null || workout.id === isSessionNotesExpanded" @click="toggleSessionExpand(workout.id)" class="icon--expand" :class="{expandRotate: workout.id === isSessionNotesExpanded}" :src="require('../../../assets/svg/expand.svg')"/>
                      </div>
                    </div>
                  </div>
                </div>
              </div><!-- workouts -->
            </div>
            <div class="graph">
              <div>
                <h3 class="section-title">Statistics</h3>
                <p v-if="protocolError.length !== 0" class="text--error">There are some problems with your tracked exercises. Please check that the following measurements/exercises are using the correct format.</p><br>
                <p v-show="protocolError.length !== 0" class="text--error" v-for="(error, index) in protocolError" :key="index"><b>{{error.prot}} for {{error.exercise}} from {{error.sessionName}}</b></p>
              </div><br>
              <div class="container--content">
                <div class="data-options">
                  <div class="data-select">
                    <div class="data-select__options">
                      <label for="measure">
                        <b>Measurement: </b><br>
                        <select v-model="selectedDataName" @change="sortWorkouts(), scan(), selection()" name="measure">
                          <option v-for="optionName in optionsForDataName" :value="optionName.value" :key="'M' + optionName.id">
                            {{optionName.text}}
                          </option>
                        </select>
                      </label>
                    </div>
                    <div class="data-select__options" v-show="showType">
                      <label for="measure-type">
                        <b>Data type: </b><br>
                        <select v-model="selectedDataType" @change="sortWorkouts(), scan(), selection()" name="measure-type">
                          <option value="Sets">Sets</option>
                          <option value="Reps">Reps</option>
                          <option v-for="optionData in optionsForDataType" :value="optionData.value" :key="'DT-' + optionData.id">
                            {{optionData.text}}
                          </option>
                        </select>
                      </label>
                    </div>
                  </div>
                  <div v-show="showType" class="data-desc">
                    <div class="container--data-desc">
                      <p class="data-desc__desc"><b>{{ p1.desc }}</b></p>
                      <p class="data-desc__value">{{ p1.value }}</p>
                    </div>
                    <div class="container--data-desc">
                      <p class="data-desc__desc"><b>{{ p2.desc }}</b></p>
                      <p class="data-desc__value">{{ p2.value }}</p>
                    </div>
                    <div class="container--data-desc">
                      <p class="data-desc__desc"><b>{{ p3.desc }}</b></p>
                      <p class="data-desc__value">{{ p3.value }}</p>
                    </div>
                    <div class="container--data-desc">
                      <p class="data-desc__desc"><b>{{ p4.desc }}</b></p>
                      <p class="data-desc__value">{{ p4.value }}</p>
                    </div>
                    <div class="container--data-desc">
                      <p class="data-desc__desc">{{ p5.desc }}</p>
                      <p class="data-desc__value">{{ p5.value }}</p>
                    </div>
                  </div>
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
  import axios from 'axios'
  import qs from 'qs'
  import LineChart from '../../components/LineChart.js'
  import InlineSvg from 'vue-inline-svg'

  import FullCalendar from '@fullcalendar/vue'
  import dayGridPlugin from '@fullcalendar/daygrid'
  import '@fullcalendar/core/main.min.css'
  import '@fullcalendar/daygrid/main.css'

  export default {
    components: {
      LineChart,
      InlineSvg,
      FullCalendar
    },
    data: function () {
      return {

        // BLOCK DATA //

        showFeedback: '',
        weekColor: {
          backgroundColor: ''
        },
        response: '',
        editBlockNotes: false,
        todayDate: '',

        // WORKOUT DATA //

        isEditingWorkout: false,
        editWorkout: null,
        isSessionNotesExpanded: null,
        movingWorkout: null,
        moveTarget: 1,
        copyTarget: 2,
        daysDiff: 7,
        new_workout: {
          name: 'Untitled',
          date: ''
        },
        selectedSessions: [],
        shiftDays: 1,

        // REGEX DATA //

        str: [],
        yData: [],
        xLabel: [],
        dataPacketStore: [],
        regexExtract: /\[\s*(.*?)\s*:\s*(.*?)\]/gi,
        regexSetsReps: /(\d*)x((\d*\/*)*)/gi,
        regexLoadCapture: /(at|@)(.+)/gi,
        regexNumberBreakdown: /[0-9.]+/gi,
        protocolError: [],

        // CHART METHODS //

        dataCollection: null,
        options: null,

        // CALENDAR DATA //

        calendarToolbarHeader: {
          left: 'title',
          right: ''
        },
        calendarToolbarFooter: {
          right: 'today prev, next'
        },
        calendarPlugins: [ dayGridPlugin ],
        workoutDates: [],

        // STATISTICS DATA //

        p1: '',
        p2: '',
        p3: '',
        p4: '',
        p5: '',
        selectedDataName: 'Block Overview',
        optionsForDataName: [],
        optionsForDataType: [],
        selectedDataType: 'Sets',
        showType: true,

        // MICROCYCLE DATA //

        allowMoreWeeks: false,
        currentWeek: 1,
        maxWeek: '2'
      }
    },
    created () {
      this.$parent.blocks = true
    },
    async mounted () {
      await this.$parent.get_client_details()
      this.today()
      this.scan()
      this.$parent.showDeleteBlock = true
    },
    beforeDestroy () {
      this.$parent.showDeleteBlock = false
    },
    methods: {

      // MODALS AND CHILD METHODS //-------------------------------------------------------------------------------

      shiftAcross () {
        this.$parent.$parent.client_details.programmes.forEach((block) => {
          // eslint-disable-next-line
          if (block.id == this.$route.params.id) {
            block.workouts.forEach((session) => {
              if (this.selectedSessions.includes(session.id)) {
                console.log(session.date)
                session.date = this.addDays(session.date, parseInt(this.shiftDays))
                console.log(session.date)
                this.update_workout(session.id)
              }
            })
          }
        })
        this.$modal.hide('shift')
        this.deselectAll()
      },
      copyAcross () {
        var copyWorkouts = []
        let weekCount = 2
        this.$parent.$parent.client_details.programmes.forEach((block) => {
          // eslint-disable-next-line
          if (block.id == this.$route.params.id) {
            block.workouts.forEach((session) => {
              if (this.selectedSessions.includes(session.id)) {
                copyWorkouts.push({ name: session.name, date: session.date, notes: session.notes })
              }
            })
          }
        })
        for (; weekCount <= this.copyTarget; weekCount++) {
          this.currentWeek = weekCount
          copyWorkouts.forEach((workout) => {
            this.new_workout.name = workout.name
            this.new_workout.date = this.addDays(workout.date, this.daysDiff * (weekCount - 1))
            this.currentCopyWorkoutNotes = workout.notes
            this.add_workout()
          })
        }
        this.currentCopyWorkoutNotes = ''
        this.copyTarget = 1
        this.new_workout.name = 'Untitled'
        this.today()
        this.update_programme()
        this.$parent.$parent.loading = false
        this.$modal.hide('copy')
        this.deselectAll()
      },
      initMove () {
        this.$parent.$parent.client_details.programmes.forEach((block) => {
          // eslint-disable-next-line
          if (block.id == this.$route.params.id) {
            block.workouts.forEach((workout) => {
              if (this.selectedSessions.includes(workout.id)) {
                workout.week_id = this.moveTarget
                this.updateWorkoutNotes(workout.id)
              }
            })
          }
        })
        this.deselectAll()
        this.currentWeek = parseInt(this.moveTarget)
      },

      // WORKOUT METHODS //-------------------------------------------------------------------------------
      soloDelete (id) {
        if (confirm('Are you sure you want to delete this workout?')) {
          this.delete_workout(id, true)
        }
      },
      bulkDelete () {
        if (this.selectedSessions.length !== 0) {
          var ready = confirm('Are you sure you want to delete all the selected workout?')
          this.selectedSessions.forEach((sessionId) => {
            this.delete_workout(sessionId, ready)
          })
          this.deselectAll()
        }
      },
      deselectAll () {
        this.$parent.$parent.client_details.programmes.forEach((block) => {
          // eslint-disable-next-line
          if (block.id == this.$route.params.id) {
            block.workouts.forEach((session) => {
              var selEl = document.getElementById('sc-' + session.id)
              if (selEl.checked === true) {
                selEl.checked = false
                var idx = this.selectedSessions.indexOf(session.id)
                this.selectedSessions.splice(idx, 1)
              }
            })
          }
        })
      },
      changeSelectCheckbox (id) {
        if (this.selectedSessions.includes(id) === false) {
          this.selectedSessions.push(id)
        } else {
          var idx = this.selectedSessions.indexOf(id)
          this.selectedSessions.splice(idx, 1)
        }
      },
      cancelWorkout () {
        this.editWorkout = null
        this.isEditingWorkout = false
        window.removeEventListener('keydown', this.quickSaveWorkoutNotes)
      },
      async createWorkout () {
        this.$parent.$parent.loading = true
        await this.add_workout()
        this.$parent.$parent.loading = false
      },
      toggleSessionExpand (id) {
        if (this.isSessionNotesExpanded === null) {
          this.isSessionNotesExpanded = id
        } else {
          this.isSessionNotesExpanded = null
        }
      },
      editingWorkoutNotes (id, state) {
        this.isEditingWorkout = state
        this.editWorkout = id
        if (state) {
          window.addEventListener('keydown', this.quickSaveWorkoutNotes)
        } else {
          this.updateWorkoutNotes(id)
          window.removeEventListener('keydown', this.quickSaveWorkoutNotes)
        }
      },
      quickSaveWorkoutNotes (key, state) {
        if (key.keyCode === 13 && key.ctrlKey === true) {
          this.updateWorkoutNotes(this.editWorkout)
          window.removeEventListener('keydown', this.quickSaveWorkoutNotes)
        }
      },
      updateWorkoutNotes (id) {
        this.update_workout(id)
        this.isEditingWorkout = false
        this.editWorkout = null
        this.scan()
      },
      toggleComplete (value) {
        var out
        if (value === 0) {
          out = 1
        }
        if (value === 1) {
          out = 0
        }
        return out
      },
      isCompleted (value) {
        var out
        if (value === 0) {
          out = 'Incomplete'
        }
        if (value === 1) {
          out = 'Completed'
        }
        return out
      },

      // BLOCK METHODS //-------------------------------------------------------------------------------

      cancelBlockNotes () {
        this.editBlockNotes = false
        window.removeEventListener('keydown', this.quickSaveBlockNotes)
      },
      updateBlockColor () {
        this.$parent.$parent.client_details.programmes.forEach((programme) => {
          // eslint-disable-next-line
          if (programme.id == this.$route.params.id) {
            programme.block_color = JSON.stringify(this.weekColor.backgroundColor).replace(/"/g, '').replace(/[[\]]/g, '').replace(/\//g, '')
          }
        })
        this.update_programme()
        this.scan()
      },
      editingBlockNotes (state) {
        this.editBlockNotes = state
        if (state) {
          window.addEventListener('keydown', this.quickSaveBlockNotes)
        } else {
          this.updateBlockNotes()
          window.removeEventListener('keydown', this.quickSaveBlockNotes)
        }
      },
      quickSaveBlockNotes (key, state) {
        if (key.keyCode === 13 && key.ctrlKey === true) {
          this.updateBlockNotes()
          window.removeEventListener('keydown', this.quickSaveBlockNotes)
        }
      },
      updateBlockNotes () {
        this.update_programme()
        this.editBlockNotes = false
      },
      changeWeek (weekID) {
        this.currentWeek = weekID
        this.moveTarget = weekID
      },

      // CHART METHODS //-------------------------------------------------------------------------------

      fillData () {
        this.dataCollection = {
          labels: this.xLabel,
          datasets: [
            {
              label: this.selectedDataType,
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
                suggestedMin: 0,
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
        var dataForName = this.selectedDataName
        var dataForType = this.selectedDataType
        var dataForSum = 0
        var overviewStore = []
        this.protocolError.length = 0
        this.optionsForDataType.length = 0
        if (dataForName === 'Block Overview') {
          this.optionsForDataType.push({ id: 1, text: 'Load', value: 'Load' })
          this.optionsForDataType.push({ id: 2, text: 'Volume', value: 'Volume' })
        }
        this.dataPacketStore.forEach((item) => {
          overviewStore.length = 0
          item.forEach((exerciseDataPacket) => {
            const tidyA = dataForName.replace(/\(/g, '\\(')
            const tidyB = tidyA.replace(/\)/g, '\\)')
            const regex = RegExp(tidyB, 'gi')
            var protocol = exerciseDataPacket[2].replace(/\s/g, '')
            if (regex.test(exerciseDataPacket[1]) === true) {
              this.xLabel.push(exerciseDataPacket[0])
              if (exerciseDataPacket[2].includes('at') && this.optionsForDataType.length !== 2 && this.protocolError.length === 0) {
                this.optionsForDataType.push({ id: 1, text: 'Load', value: 'Load' })
                this.optionsForDataType.push({ id: 2, text: 'Volume', value: 'Volume' })
              }
              if ((dataForType === 'Sets' || dataForType === 'Reps') && exerciseDataPacket[2].includes('x') === true) {
                this.yData.push(this.setsReps(exerciseDataPacket, protocol, dataForType))
              }
              if (dataForType === 'Load' && exerciseDataPacket[2].includes('at') === true) {
                this.yData.push(this.load(exerciseDataPacket, protocol))
              }
              if (dataForType === 'Volume' && exerciseDataPacket[2].includes('at') === true) {
                var agg = this.setsReps(exerciseDataPacket, protocol, 'Reps') * this.load(exerciseDataPacket, protocol)
                this.yData.push(agg)
              }
              if (exerciseDataPacket[2].includes('x') !== true) {
                this.showType = false
                this.yData.push(this.otherMeasures(protocol))
              }
            }
            if (dataForName === 'Block Overview' && exerciseDataPacket[2].includes('at') === true) {
              if (dataForType === 'Sets' || dataForType === 'Reps') {
                dataForSum = this.setsReps(exerciseDataPacket, protocol, dataForType)
              }
              if (dataForType === 'Load') {
                dataForSum = this.load(exerciseDataPacket, protocol)
              }
              if (dataForType === 'Volume') {
                dataForSum = this.setsReps(exerciseDataPacket, protocol, 'Reps') * this.load(exerciseDataPacket, protocol)
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
        if (this.yData.length !== 0) {
          this.descStats(dataForType)
          this.fillData()
        }
      },

      // DATE/TIME METHODS //-------------------------------------------------------------------------------

      weekConfirm (dur) {
        if (parseInt(dur) > 12 && this.allowMoreWeeks === false) {
          if (confirm('Are you sure that you want a cycle of over 3 months? Maybe it\'s best to create a new block.')) {
            this.allowMoreWeeks = true
          } else {
            this.allowMoreWeeks = false
          }
        }
      },
      today () {
        var today = new Date()
        var dd = String(today.getDate()).padStart(2, '0')
        var mm = String(today.getMonth() + 1).padStart(2, '0')
        var yyyy = today.getFullYear()
        this.new_workout.date = `${yyyy}-${mm}-${dd}`
        this.todayDate = `${yyyy}-${mm}-${dd}`
      },
      addDays (date, days) {
        var d = new Date(date)
        d.setDate(d.getDate() + days)
        var year = d.getFullYear()
        var month = d.getMonth() + 1
        var dayDate = d.getDate()
        return `${year}-${month}-${dayDate}`
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
      programme_duration (duration) {
        // Turn the duration of the programme into an array to render the boxes in the table
        const arr = []
        let i
        for (i = 1; i < parseInt(duration, 10) + 1; i++) {
          arr.push(i)
        }
        return arr
      },

      // INIT AND BACKGROUND METHODS //-------------------------------------------------------------------------------

      accessibleColors (hex) {
        if (hex !== undefined) {
          hex = hex.replace('#', '')
          var r, g, b
          r = parseInt(hex.substring(0, 2), 16)
          g = parseInt(hex.substring(2, 4), 16)
          b = parseInt(hex.substring(4, 6), 16)
          var result = ((((r * 299) + (g * 587) + (b * 114)) / 1000) - 128) * -1000
          var color = `rgb(${result}, ${result}, ${result})`
          return color
        }
      },
      removeBracketsAndBreaks (dataIn) {
        if (dataIn !== null) {
          return dataIn.replace(/[[\]]/g, '').replace(/<p><br><\/p>/gi, '')
        } else {
          return dataIn
        }
      },
      sortWorkouts () {
        this.$parent.$parent.client_details.programmes.forEach((block) => {
          // eslint-disable-next-line
          if (block.id == this.$route.params.id && this.$parent.no_workouts === false) {
            block.workouts.sort((a, b) => {
              return new Date(a.date) - new Date(b.date)
            })
          }
        })
      },
      scan () {
        this.dataPacketStore.length = 0
        this.workoutDates.length = 0
        this.$parent.$parent.client_details.programmes.forEach((programme) => {
          // eslint-disable-next-line
          if (programme.id == this.$route.params.id) {
            this.weekColor.backgroundColor = programme.block_color.replace('[', '').replace(']', '').split(',')
            this.str = programme.workouts
            this.maxWeek = programme.duration
            if (this.str !== null && this.$parent.no_workouts === false) {
              this.str.forEach((object) => {
                this.workoutDates.push({ title: object.name, date: object.date, color: this.weekColor.backgroundColor[object.week_id - 1], textColor: this.accessibleColors(this.weekColor.backgroundColor[object.week_id - 1]) })
                if (object.notes !== null) {
                  var pulledProtocols = this.pullProtocols(object.name, object.notes)
                  this.dataPacketStore.push(this.chunkArray(pulledProtocols))
                }
              })
              // Appends the options to the select
              if (this.dataPacketStore !== null) {
                this.dropdownInit()
                this.selection()
              }
            }
          }
        })
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
        if (tempStore !== null) {
          return tempStore
        }
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
        this.optionsForDataName = [{ id: 0, text: 'Block Overview', value: 'Block Overview' }]
        var tempItemStore = []
        var tempItemStoreLate = []
        var continueValue = 0
        this.dataPacketStore.forEach((item) => {
          item.forEach((exerciseDataPacket) => {
            const tidyA = exerciseDataPacket[1].replace(/\(/g, '\\(')
            const tidyB = tidyA.replace(/\)/g, '\\)')
            const regexA = RegExp(tidyB, 'gi')
            var itemCased = this.properCase(exerciseDataPacket[1])
            if (regexA.test(tempItemStore) !== true && exerciseDataPacket[2].includes('at') === true) {
              tempItemStore.push(itemCased)
            }
            if (regexA.test(tempItemStoreLate) !== true && exerciseDataPacket[2].includes('at') !== true) {
              tempItemStoreLate.push(exerciseDataPacket[1])
            }
          })
        })
        tempItemStore.forEach((item, index) => {
          continueValue = index + 1
          this.optionsForDataName.push({ id: continueValue, text: item, value: item })
        })
        tempItemStoreLate.forEach((item, index) => {
          this.optionsForDataName.push({ id: continueValue + index + 1, text: item, value: item })
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

      // REGEX METHODS //-------------------------------------------------------------------------------

      // Extracts anything for Sets and Reps
      setsReps (exerciseDataPacket, protocol, dataForType) {
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
              if (match === '') {
                this.protocolError.push({ sessionName: exerciseDataPacket[0], exercise: exerciseDataPacket[1], prot: exerciseDataPacket[2] })
              }
              extractedSetsReps = parseInt(match)
            }
            if (dataForType === 'Reps' && groupIndex === 2) {
              if (match === '') {
                this.protocolError.push({ sessionName: exerciseDataPacket[0], exercise: exerciseDataPacket[1], prot: exerciseDataPacket[2] })
              }
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
      load (exerciseDataPacket, protocol) {
        var tempLoadStore = []
        let sum = 0
        let isMultiple = false
        const sets = this.setsReps(exerciseDataPacket, protocol, 'Sets')
        let m
        while ((m = this.regexLoadCapture.exec(protocol)) !== null) {
          if (m.index === this.regexLoadCapture.lastIndex) {
            this.regexLoadCapture.lastIndex++
          }
          m.forEach((loadMatch, groupIndex) => {
            if (groupIndex === 2 && /\d/g.test(loadMatch) === false) {
              this.protocolError.push({ sessionName: exerciseDataPacket[0], exercise: exerciseDataPacket[1], prot: exerciseDataPacket[2] })
            }
            if (groupIndex === 2) {
              let n
              while ((n = this.regexNumberBreakdown.exec(loadMatch)) !== null) {
                if (n.index === this.regexNumberBreakdown.lastIndex) {
                  this.regexNumberBreakdown.lastIndex++
                }
                n.forEach((loadMatchExact) => {
                  if (loadMatch.includes('/') === true) {
                    tempLoadStore.push(parseFloat(loadMatchExact))
                    isMultiple = true
                  } else {
                    sum = parseFloat(loadMatchExact) * sets
                  }
                })
              }
            }
          })
        }
        if (isMultiple) {
          sum = tempLoadStore.reduce((a, b) => a + b)
        }
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
        this.p1 = {desc: 'Total ' + dataForType + ': ', value: sum}
        this.p2 = {desc: 'Average ' + dataForType + ': ', value: (sum / this.yData.length).toFixed(1)}

        this.yData.forEach((value) => {
          storeMax = Math.max(storeMax, value)
        })
        this.p3 = { desc: 'Maximum ' + dataForType + ': ', value: storeMax }
        store = storeMax
        this.yData.forEach((value) => {
          store = Math.min(store, value)
        })
        this.p4 = { desc: 'Minimum ' + dataForType + ': ', value: store }
        this.p5 = { desc: 'Percentage Change: ', value: (((storeMax / store) - 1) * 100).toFixed(1) + '%' }
      },

      // DATABASE METHODS //-------------------------------------------------------------------------------

      async update_programme () {
        // Set loading status to true
        this.$parent.$parent.loading = true
        this.$parent.$parent.dontLeave = true
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
          this.sortWorkouts()
          // eslint-disable-next-line
          const response_update_programme = await axios.post(`https://api.traininblocks.com/programmes`,
            {
              'id': programme.id,
              'name': programme.name,
              'description': programme.description,
              'duration': programme.duration,
              'start': programme.start,
              'notes': programme.notes,
              'block_color': programme.block_color,
              'workouts': programme.workouts
            }
          )
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
          this.$ga.event('Block', 'update')
          this.scan()
          this.$parent.$parent.loading = false
          this.$parent.$parent.dontLeave = false
        } catch (e) {
          this.$parent.$parent.loading = false
          this.$parent.$parent.dontLeave = false
          this.$parent.$parent.errorMsg = e
          this.$parent.$parent.$modal.show('error')
          console.error(e)
        }
      },
      async update_workout (id) {
        this.$parent.$parent.loading = true
        this.$parent.$parent.dontLeave = true
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
                var workoutsName = programme.workouts[y].name
                var workoutsDate = programme.workouts[y].date
                var workoutsNotes = programme.workouts[y].notes
                var workoutsWeek = programme.workouts[y].week_id
                var workoutsChecked = programme.workouts[y].checked
              }
            }
          }
        }
        try {
          await axios.post(`https://api.traininblocks.com/workouts`,
            {
              'id': workoutsId,
              'name': workoutsName,
              'date': workoutsDate,
              'notes': workoutsNotes,
              'week_id': workoutsWeek,
              'checked': workoutsChecked
            }
          )
          await this.$parent.force_get_workouts()
          await this.update_programme()
          this.$ga.event('Workout', 'update')
          this.$parent.$parent.loading = false
          this.$parent.$parent.dontLeave = false
        } catch (e) {
          this.$parent.$parent.loading = false
          this.$parent.$parent.dontLeave = false
          this.$parent.$parent.errorMsg = e
          this.$parent.$parent.$modal.show('error')
          console.error(e)
        }
      },
      async add_workout () {
        try {
          this.$parent.$parent.loading = true
          this.$parent.$parent.dontLeave = true
          // eslint-disable-next-line
          const response_save_workouts = await axios.put('https://api.traininblocks.com/workouts',
            qs.stringify({
              name: this.new_workout.name,
              programme_id: this.$route.params.id,
              date: this.new_workout.date,
              notes: this.currentCopyWorkoutNotes,
              week_id: this.currentWeek
            }),
            {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${await this.$auth.getAccessToken()}`
              }
            }
          )
          this.response = response_save_workouts.data
          // Get the workouts from the API because we've just created a new one
          await this.$parent.force_get_workouts()
          this.new_workout = {
            name: 'Untitled',
            date: this.todayDate,
            notes: '',
            week_id: '',
            block_color: ''
          }
          this.sortWorkouts()
          this.scan()
          this.$ga.event('Workout', 'new')
          this.$parent.$parent.loading = false
          this.$parent.$parent.dontLeave = false
        } catch (e) {
          this.$parent.$parent.loading = false
          this.$parent.$parent.dontLeave = false
          this.$parent.$parent.errorMsg = e
          this.$parent.$parent.$modal.show('error')
          console.error(e)
        }
      },
      async delete_workout (id, ready) {
        if (ready) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${await this.$auth.getAccessToken()}`
          try {
            this.$parent.$parent.loading = true
            this.$parent.$parent.dontLeave = true
            await axios.delete(`https://api.traininblocks.com/workouts/${id}`)

            await this.$parent.force_get_workouts()
            await this.update_programme()

            this.$ga.event('Workout', 'delete')
            this.$parent.$parent.loading = false
            this.$parent.$parent.dontLeave = false
          } catch (e) {
            this.$parent.$parent.loading = false
            this.$parent.$parent.dontLeave = false
            this.$parent.$parent.errorMsg = e
            this.$parent.$parent.$modal.show('error')
            console.error(e)
          }
        }
      }
    }
  }
</script>
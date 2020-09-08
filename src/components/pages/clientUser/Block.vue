<style scoped>
  .wrapper--calendar {
    margin: 6rem 0
  }
  .block-notes {
    margin-top: 4rem
  }
</style>

<template>
  <div id="block">
    <div v-for="(programme, index) in this.$parent.programmes"
      :key="index">
      <div v-if="programme.id == $route.params.id">
        <div class="workout--header">
          <h2 class="main-title">{{programme.name}}</h2>
        </div>
        <div class="block-notes">
          <div class="block-notes__header">
            <p class="block-notes__header__text"><b>Block Notes</b></p>
          </div>
          <div v-if="programme.notes !== ''" v-html="programme.notes" class="show-block-notes animate animate__fadeIn" />
          <p v-if="programme.notes === ''" class="show-block-notes">No block notes added...</p>
        </div>
        <div class="wrapper--calendar">
          <FullCalendar defaultView="dayGridMonth" :firstDay="1" :plugins="calendarPlugins" :header="calendarToolbarHeader" :footer="calendarToolbarFooter" :events="workoutDates" />
        </div>
        <div class="container--workouts" v-if="programme.workouts">
          <div class="wrapper--workout" v-for="(workout, index) in programme.workouts"
            :key="index" v-show="index == currentWorkoutIndexBlock">
            <div class="wrapper--workout__header client-side" :id="workout.name">
              <div>
                <span class="text--name"><b>{{workout.name}}</b></span><br>
                <span class="text--date">{{$parent.day(workout.date)}}</span>
                <span class="text--date">{{workout.date}}</span>
              </div>
            </div>
            <div v-html="removeBrackets(workout.notes)" class="show-workout animate animate__fadeIn"/>
            <div class="bottom-bar">
              <div>
                <button v-if="workout.checked === 1" @click="workout.checked = 0, $parent.update_workout(programme.id, workout.id)" id="button-done">Completed</button>
                <button v-if="workout.checked === 0" @click="workout.checked = 1, $parent.update_workout(programme.id, workout.id)" id="button-to-do">Incomplete</button>
                <button v-if="giveFeedback !== workout.id" @click="giveFeedback = workout.id">Give Feedback</button>
              </div>
            </div><br>
            <div v-if="giveFeedback === workout.id">
              <h2>Feedback</h2>
              <quill :config="$parent.config" v-model="workout.feedback" output="html" class="quill animate animate__fadeIn"/>
              <button @click="giveFeedback = null, $parent.update_workout(programme.id, workout.id)">Save</button>
              <button class="cancel" @click="giveFeedback = null">Cancel</button>
            </div>
          </div>
        </div>
        <div class="container--session-control">
          <div>
            <button v-show="currentWorkoutIndexBlock != 0" @click="currentWorkoutIndexBlock--">Back</button>
            <button v-show="currentWorkoutIndexBlock != maxWorkoutIndexBlock" @click="currentWorkoutIndexBlock++">Next</button>
          </div>
          <p class="session-counter">{{currentWorkoutIndexBlock + 1}}/{{maxWorkoutIndexBlock + 1}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import FullCalendar from '@fullcalendar/vue'
  import dayGridPlugin from '@fullcalendar/daygrid'
  import '@fullcalendar/core/main.min.css'
  import '@fullcalendar/daygrid/main.css'

  export default {
    components: {
      FullCalendar
    },
    data () {
      return {
        giveFeedback: null,
        editWorkout: null,
        maxWorkoutIndexBlock: null,
        currentWorkoutIndexBlock: 0,

        // CALENDAR DATA //

        calendarToolbarHeader: {
          left: 'title',
          right: ''
        },
        calendarToolbarFooter: {
          right: 'today prev, next'
        },
        calendarPlugins: [ dayGridPlugin ],
        workoutDates: []
      }
    },
    created () {
      this.$parent.setup()
    },
    async mounted () {
      await this.$parent.get_programmes()
      this.initCountWorkoutsBlock()
      this.$parent.sortWorkoutsBlock()
      this.scan()
    },
    methods: {

      // BACKGROUND AND MISC. METHODS //-------------------------------------------------------------------------------

      scan () {
        this.workoutDates.length = 0
        this.$parent.programmes.forEach((block) => {
          // eslint-disable-next-line
          if (block.id == this.$route.params.id) {
            var weekColor = block.block_color.replace('[', '').replace(']', '').split(',')
            if (block.workouts !== null) {
              block.workouts.forEach((session) => {
                this.workoutDates.push({ title: session.name, date: session.date, color: weekColor[session.week_id - 1], textColor: this.accessibleColors(weekColor[session.week_id - 1]) })
              })
            }
          }
        })
      },
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
      removeBrackets (dataIn) {
        if (dataIn !== null) {
          var dataOut = dataIn.replace(/[[\]]/g, '')
          return dataOut
        } else {
          return dataIn
        }
      },
      initCountWorkoutsBlock () {
        this.$parent.programmes.forEach((block) => {
          //eslint-disable-next-line
          if (block.id == this.$route.params.id) {
            this.maxWorkoutIndexBlock = block.workouts.length - 1
          }
        })
      }
    }
  }
</script>
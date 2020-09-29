<style scoped>
  .wrapper--calendar {
    margin: 6rem 0
  }
  .plan-notes {
    margin-top: 4rem
  }
</style>

<template>
  <div id="plan">
    <div v-for="(plan, index) in this.$parent.clientUser.plans"
      :key="index">
      <div v-if="plan.id == $route.params.id">
        <div class="session--header">
          <h2 class="main-title">{{plan.name}}</h2>
        </div>
        <div class="plan-notes">
          <div class="plan-notes__header">
            <p class="plan-notes__header__text"><b>Plan Notes</b></p>
          </div>
          <div v-if="plan.notes !== ''" v-html="plan.notes" class="show-plan-notes animate animate__fadeIn" />
          <p v-if="plan.notes === ''" class="show-plan-notes">No plan notes added...</p>
        </div>
        <div class="wrapper--calendar">
          <FullCalendar defaultView="dayGridMonth" :firstDay="1" :plugins="calendarPlugins" :header="calendarToolbarHeader" :footer="calendarToolbarFooter" :events="sessionDates" />
        </div>
        <div class="container--sessions" v-if="plan.sessions">
          <div class="wrapper--session" v-for="(session, index) in plan.sessions"
            :key="index" v-show="index == currentsessionIndexPlan">
            <div class="wrapper--session__header client-side" :id="session.name">
              <div>
                <span class="text--name"><b>{{session.name}}</b></span><br>
                <span class="text--date">{{$parent.day(session.date)}}</span>
                <span class="text--date">{{session.date}}</span>
              </div>
            </div>
            <div v-html="removeBrackets(session.notes)" class="show-session animate animate__fadeIn"/>
            <div class="bottom-bar">
              <div>
                <button v-if="session.checked !== 0" @click="session.checked = 0, $parent.update_session(plan.id, session.id), session.checked = session.checked" id="button-done">Completed</button>
                <button v-if="session.checked === 0" @click="session.checked = 1, $parent.update_session(plan.id, session.id), session.checked = session.checked" id="button-to-do">Incomplete</button>
                <button v-if="giveFeedback !== session.id" @click="giveFeedback = session.id">Give Feedback</button>
              </div>
            </div><br>
            <div v-if="giveFeedback === session.id">
              <h2>Feedback</h2>
              <quill :config="$parent.quill_config" v-model="session.feedback" output="html" class="quill animate animate__fadeIn"/>
              <button @click="giveFeedback = null, $parent.update_session(plan.id, session.id)">Save</button>
              <button class="cancel" @click="giveFeedback = null">Cancel</button>
            </div>
          </div>
        </div>
        <div class="container--session-control">
          <div>
            <button v-show="currentsessionIndexPlan != 0" @click="currentsessionIndexPlan--">Back</button>
            <button v-show="currentsessionIndexPlan != maxsessionIndexPlan" @click="currentsessionIndexPlan++">Next</button>
          </div>
          <p class="session-counter">{{currentsessionIndexPlan + 1}}/{{maxsessionIndexPlan + 1}}</p>
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
        editsession: null,
        maxsessionIndexPlan: null,
        currentsessionIndexPlan: 0,

        // CALENDAR DATA //

        calendarToolbarHeader: {
          left: 'title',
          right: ''
        },
        calendarToolbarFooter: {
          right: 'today prev, next'
        },
        calendarPlugins: [ dayGridPlugin ],
        sessionDates: []
      }
    },
    created () {
      this.$parent.setup()
    },
    async mounted () {
      this.$parent.loading = true
      await this.$parent.get_plans()
      await this.initCountsessionsPlan()
      await this.$parent.sortSessionsPlan()
      await this.scan()
      this.$parent.loading = false
    },
    methods: {

      // BACKGROUND AND MISC. METHODS //-------------------------------------------------------------------------------

      scan () {
        this.sessionDates.length = 0
        this.$parent.clientUser.plans.forEach((plan) => {
          // eslint-disable-next-line
          if (plan.id == this.$route.params.id) {
            var weekColor = plan.block_color.replace('[', '').replace(']', '').split(',')
            if (plan.sessions !== null) {
              plan.sessions.forEach((session) => {
                this.sessionDates.push({ title: session.name, date: session.date, color: weekColor[session.week_id - 1], textColor: this.accessibleColors(weekColor[session.week_id - 1]) })
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
      initCountsessionsPlan () {
        this.$parent.clientUser.plans.forEach((plan) => {
          //eslint-disable-next-line
          if (plan.id == this.$route.params.id) {
            this.maxsessionIndexPlan = plan.sessions.length - 1
          }
        })
      }
    }
  }
</script>
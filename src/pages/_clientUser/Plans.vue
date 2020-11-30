<style scoped>
  .wrapper--session, .plan_notes {
    padding: 2rem
  }
  .plan_notes {
    box-shadow: 0 0 20px 10px #28282808;
    border-radius: 3px;
    margin-top: 6rem;
  }
  .wrapper--session {
    min-width: calc(100vw - 38px - 2rem - 20vw);
    scroll-snap-align: start
  }
  .container--sessions {
    display: flex;
    margin-top: 2rem;
    overflow-x: auto;
    width: calc(100vw - 38px - 2rem - 20vw);
    scroll-snap-type: x mandatory
  }
  .show_session {
    max-height: 60vh;
  }

  .container--sessions::-webkit-scrollbar {
    height: 4px
  }
  .container--sessions ::-webkit-scrollbar {
    width: 4px
  }

  /* Responsive */
  @media (max-width: 768px) {
    .plan_notes {
      box-shadow: none;
      border-radius: 0;
      padding: 0
    }
    .wrapper--session {
      padding: 1rem 1rem 0 1rem
    }
    .container--sessions, .wrapper--session {
      min-width: 90vw
    }
  }
  @media (max-width: 576px) {
    .plan_notes {
      margin-top: 2rem
    }
  }
</style>

<template>
  <div id="client-plan">
    <div v-for="(plan, index) in $parent.clientUser.plans" :key="index">
      <div v-if="plan.id == $route.params.id" class="client_plan">
        <div class="session--header">
          <p class="text--large">{{plan.name}}</p>
        </div>
        <div class="plan_notes">
          <div class="plan_notes__header">
            <p class="text--small">Plan Notes</p>
          </div>
          <div v-if="plan.notes !== null && plan.notes !== '<p><br></p>' && plan.notes !== ''" v-html="plan.notes" class="show_plan_notes animate animate__fadeIn" />
          <p v-if="plan.notes === null || plan.notes === '<p><br></p>' || plan.notes === ''" class="show_plan_notes text--small grey">No plan notes added...</p>
        </div>
        <div class="wrapper--calendar">
          <FullCalendar
            defaultView="dayGridMonth"
            :firstDay="1" :plugins="calendarPlugins"
            :header="calendarToolbarHeader"
            :footer="calendarToolbarFooter"
            :events="sessionDates"
            :views="calendarViews"
          />
        </div>
        <div v-if="plan.sessions" class="container--sessions">
          <div
            v-for="(session, index) in plan.sessions"
            :key="index"
            class="wrapper--session"
          >
            <div class="wrapper--session__header client-side" :id="session.name">
              <div>
                <span class="text--name"><b>{{session.name}}</b></span><br>
                <span class="text--date">{{$parent.day(session.date)}}</span>
                <span class="text--date">{{session.date}}</span>
              </div>
            </div>
            <div v-html="removeBrackets(session.notes)" class="show_session animate animate__fadeIn"/>
            <div class="bottom_bar">
              <div class="full_width_bar" :key="check">
                <button v-if="session.checked === 1 && !giveFeedback" @click="complete(plan.id, session.id)" id="button_done" class="button--state">Completed</button>
                <button v-if="session.checked === 0 && !giveFeedback" @click="complete(plan.id, session.id)" id="button_to_do" class="button--state">Click to complete</button>
                <button v-if="giveFeedback !== session.id" @click="giveFeedback = session.id" class="button--feedback">Give Feedback</button>
              </div>
            </div><br>
            <div v-if="giveFeedback === session.id">
              <p class="text--small"><b>Feedback</b></p>
              <quill v-model="session.feedback" output="html" class="quill animate animate__fadeIn"/>
              <button @click="giveFeedback = null, $parent.update_session(plan.id, session.id)">Save</button>
              <button class="cancel" @click="giveFeedback = null">Cancel</button>
            </div>
          </div>
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
        check: null,
        giveFeedback: null,

        // CALENDAR DATA //

        calendarToolbarHeader: {
          left: 'title',
          right: ''
        },
        calendarToolbarFooter: {
          left: 'dayGridMonth, dayGridThreeDay',
          right: 'today prev, next'
        },
        calendarPlugins: [ dayGridPlugin ],
        sessionDates: [],
        calendarViews: {
          dayGridThreeDay: {
            type: 'dayGrid',
            duration: { days: 3 },
            buttonText: '3 day'
          }
        }
      }
    },
    created () {
      this.$parent.loading = true
      this.$parent.setup()
      this.$parent.splashed = true
      this.$parent.loading = false
    },
    async mounted () {
      this.$parent.loading = true
      await this.$parent.get_plans()
      await this.$parent.sortSessionsPlan()
      await this.scan()
      this.$parent.loading = false
    },
    methods: {
      complete (p, s) {
        for (const plan of this.$parent.clientUser.plans) {
          if (plan.id === parseInt(this.$route.params.id)) {
            for (let session of plan.sessions) {
              if (session.id === s) {
                if (session.checked === 0) {
                  session.checked = 1
                  this.check = 1
                } else {
                  session.checked = 0
                  this.check = 0
                }
              }
            }
          }
        }
        this.$parent.update_session(p, s)
      },

      // BACKGROUND AND MISC. METHODS //-------------------------------------------------------------------------------

      scan () {
        this.sessionDates.length = 0
        this.$parent.clientUser.plans.forEach((plan) => {
          if (plan.id === parseInt(this.$route.params.id)) {
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
      }
    }
  }
</script>
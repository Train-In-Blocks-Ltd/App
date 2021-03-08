<style scoped>
  .plan_name {
    margin-bottom: 4rem
  }
  .plan_notes, .wrapper--session {
    background-color: white;
    box-shadow: 0 0 20px 10px #28282808;
    border-radius: 10px;
    padding: 2rem
  }
  .container--sessions {
    margin: 4rem 0 2rem 0
  }

  /* Navigate */
  .show_sessions_nav {
    display: flex;
    margin: 2rem 0
  }
  .show_sessions_counter {
    margin: auto
  }
  .show_sessions_left {
    cursor: pointer;
    transform: rotate(90deg)
  }
  .show_sessions_right {
    cursor: pointer;
    transform: rotate(-90deg);
    margin-left: 1rem
  }
  .disabled, .disabled:hover {
    opacity: .6;
    cursor: default
  }
  hr {
    margin: 2rem 0
  }
  .feedback_bottom_bar {
    margin-top: 1rem
  }
  .switch_cal {
    margin-bottom: .4rem
  }

  /* Scroll */
  .container--sessions::-webkit-scrollbar {
    height: 4px
  }

  /* Responsive */

  @media (max-width: 992px) {
    .switch_cal {
      display: none
    }
  }
</style>

<template>
  <div id="client-plan">
    <div v-for="(plan, index) in $parent.clientUser.plans" :key="index">
      <div v-if="plan.id == $route.params.id" class="client_plan">
        <p class="plan_name text--large">
          {{ plan.name }}
        </p>
        <div class="plan_notes">
          <div class="plan_notes__header">
            <p class="text--small bottom_margin">
              Plan Notes
            </p>
          </div>
          <div v-if="plan.notes !== null && plan.notes !== '<p><br></p>' && plan.notes !== ''" class="show_html fadeIn" v-html="remove_brackets_and_checkbox(plan.notes)" />
          <p v-if="plan.notes === null || plan.notes === '<p><br></p>' || plan.notes === ''" class="show_html text--small grey">
            No plan notes added...
          </p>
        </div>
        <div class="wrapper--calendar">
          <a
            class="a_link switch_cal"
            href="javascript:void(0)"
            @click="showMonthlyCal = !showMonthlyCal"
          >
            <inline-svg :src="require('../../assets/svg/calendar.svg')" />
            Switch to {{ !showMonthlyCal ? 'month' : 'week' }} view
          </a>
          <week-calendar
            v-if="!showMonthlyCal"
            :events="sessionDates"
            :force-update="forceUpdate"
            :is-trainer="false"
            class="fadeIn"
          />
          <month-calendar
            v-else
            :events="sessionDates"
            :force-update="forceUpdate"
            :is-trainer="false"
            class="fadeIn"
          />
        </div>
        <skeleton v-if="$parent.loading" :type="'session'" class="container--sessions" />
        <div v-else-if="plan.sessions.length !== 0" class="container--sessions">
          <div class="show_sessions_nav">
            <inline-svg
              v-show="showing_current_session !== 0"
              :src="require('../../assets/svg/arrow.svg')"
              class="show_sessions_left"
              @click="showing_current_session--"
            />
            <inline-svg
              v-show="showing_current_session === 0"
              :src="require('../../assets/svg/arrow.svg')"
              class="show_sessions_left disabled"
            />
            <p class="show_sessions_counter">
              {{ showing_current_session + 1 }}/{{ plan.sessions.length }}
            </p>
            <inline-svg
              v-show="showing_current_session !== parseInt(plan.sessions.length) - 1"
              :src="require('../../assets/svg/arrow.svg')"
              class="show_sessions_right"
              @click="showing_current_session++"
            />
            <inline-svg
              v-show="showing_current_session === parseInt(plan.sessions.length) - 1"
              :src="require('../../assets/svg/arrow.svg')"
              class="show_sessions_right disabled"
            />
          </div>
          <div
            v-for="(session, indexed) in plan.sessions"
            v-show="showing_current_session === indexed"
            :id="`session-${session.id}`"
            :key="indexed"
            class="wrapper--session"
          >
            <div :id="session.name" class="session_header client-side">
              <div>
                <span class="text--name"><b>{{ session.name }}</b></span><br>
                <span class="text--date">{{ $parent.day(session.date) }}</span>
                <span class="text--date">{{ session.date }}</span>
              </div>
            </div>
            <div class="show_html fadeIn" v-html="remove_brackets_and_checkbox(session.notes)" />
            <div class="bottom_bar">
              <div :key="check" class="full_width_bar">
                <button
                  v-if="session.checked === 1 && !giveFeedback"
                  class="button--state done"
                  @click="complete(plan.id, session.id)"
                >
                  Completed
                </button>
                <button
                  v-if="session.checked === 0 && !giveFeedback"
                  class="button--state to_do"
                  @click="complete(plan.id, session.id)"
                >
                  Click to complete
                </button>
              </div>
            </div>
            <div v-if="session.checked === 1">
              <hr>
              <p class="text--small">
                Feedback
              </p>
              <rich-editor
                :show-edit-state="giveFeedback === session.id"
                :html-injection.sync="session.feedback"
                :empty-placeholder="'What would you like to share with your trainer?'"
              />
              <div class="feedback_bottom_bar">
                <button v-if="giveFeedback !== session.id" @click="giveFeedback = session.id, tempEditorStore = session.feedback">
                  Edit
                </button>
                <button v-if="giveFeedback === session.id" @click="giveFeedback = null, $parent.update_session(plan.id, session.id)">
                  Save
                </button>
                <button v-if="giveFeedback === session.id" class="cancel" @click="giveFeedback = null, session.feedback = tempEditorStore">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <p class="text--small">
            No sessions yet
          </p>
          <p class="text--small grey">
            Please contact your trainer or coach for more details
          </p>
          <div class="spacer" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const WeekCalendar = () => import(/* webpackChunkName: "components.calendar", webpackPreload: true  */ '../../components/WeekCalendar')
const MonthCalendar = () => import(/* webpackChunkName: "components.calendar", webpackPreload: true */ '../../components/MonthCalendar')
const RichEditor = () => import(/* webpackChunkName: "components.richeditor", webpackPreload: true  */ '../../components/Editor')

export default {
  components: {
    WeekCalendar,
    MonthCalendar,
    RichEditor
  },
  data () {
    return {

      // SYSTEM

      check: null,
      showing_current_session: 0,

      // EDIT

      giveFeedback: null,
      tempEditorStore: null,

      // CALENDAR

      showMonthlyCal: false,
      sessionDates: [],
      forceUpdate: 0
    }
  },
  async mounted () {
    this.$parent.loading = true
    this.$parent.will_body_scroll(true)
    await this.$parent.setup()
    await this.$parent.get_plans()
    await this.sort_sessions(this.$parent.clientUser.plans.find(plan => plan.id === parseInt(this.$route.params.id)))
    await this.scan()
    this.$parent.end_loading()
  },
  methods: {

    // BACKGROUND AND MISC.

    go_to_event (id, week) {
      this.showing_current_session = week - 1
      setTimeout(() => {
        document.getElementById(`session-${id}`).scrollIntoView({ behavior: 'smooth' })
      }, 100)
    },
    complete (planId, sessionId) {
      for (const plan of this.$parent.clientUser.plans) {
        if (plan.id === planId) {
          for (const session of plan.sessions) {
            if (session.id === sessionId) {
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
      this.$parent.update_session(planId, sessionId)
    },
    scan () {
      this.sessionDates.length = 0
      this.$parent.clientUser.plans.forEach((plan) => {
        if (plan.id === parseInt(this.$route.params.id)) {
          const weekColor = plan.block_color.replace('[', '').replace(']', '').split(',')
          if (plan.sessions !== null) {
            plan.sessions.forEach((session) => {
              this.sessionDates.push({
                title: session.name,
                date: session.date,
                color: weekColor[session.week_id - 1],
                textColor: this.accessible_colors(weekColor[session.week_id - 1]),
                week_id: session.week_id,
                session_id: session.id
              })
            })
          }
        }
      })
      this.forceUpdate += 1
    },
    accessible_colors (hex) {
      if (hex !== undefined) {
        hex = hex.replace('#', '')
        const r = parseInt(hex.substring(0, 2), 16)
        const g = parseInt(hex.substring(2, 4), 16)
        const b = parseInt(hex.substring(4, 6), 16)
        const result = ((((r * 299) + (g * 587) + (b * 114)) / 1000) - 128) * -1000
        const color = `rgb(${result}, ${result}, ${result})`
        return color
      }
    },
    remove_brackets_and_checkbox (dataIn) {
      if (dataIn !== null) {
        return dataIn.replace(/[[\]]/g, '').replace(/<input /gmi, '<input disabled ').replace('onclick="resize(this)"', '')
      } else {
        return dataIn
      }
    }
  }
}
</script>

<style>
/* Show HTML */
.show_html > :is(div, p) {
  margin: .6rem 0
}
.show_html img {
  border-radius: 10px;
  max-width: 80%;
  margin: 1rem 0
}
.show_html a {
  color: var(--link)
}
</style>

<style scoped>
.plan_name {
  margin-bottom: 4rem
}

/* Editor object */
.plan_notes {
  border: 3px solid var(--base);
  border-radius: 10px;
  transition: .6s border cubic-bezier(.165, .84, .44, 1)
}
.plan_notes h3 {
  position: relative;
  left: 2rem;
  padding: .6rem;
  letter-spacing: 2px;
  width: fit-content;
  background: var(--base);
  color: var(--fore);
  border-radius: 0 0 10px 10px
}
.plan_notes .show_html {
  margin: 2rem
}
.wrapper--session {
  border: 3px solid var(--base);
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
:is(.show_sessions_left, .show_sessions_right) {
  height: 36px;
  width: 36px
}
:is(.show_sessions_left, .show_sessions_right):not(.disabled):active {
  transform: scale(.8)
}
.disabled, .disabled:hover {
  opacity: var(--light_opacity);
  cursor: default
}
hr {
  margin: 2rem 0
}
.switch_cal {
  margin-bottom: .4rem
}
.switch_cal svg {
  margin-right: .4rem
}

/* Other element */
.complete_button {
  margin-top: 2rem
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
@media (max-width: 576px) {
  .plan_notes h3 {
    left: 1rem
  }
  .plan_notes #wrapper--rich_editor {
    margin: 1rem
  }
  .wrapper--session {
    padding: .8rem
  }
  .complete_button {
    width: 100%
  }
}
</style>

<template>
  <div id="client_side_plan" class="view_container">
    <div v-for="(plan, index) in $parent.clientUser.plans" :key="index">
      <div v-if="plan.id == $route.params.id" class="client_plan">
        <h2 class="plan_name">
          {{ plan.name }}
        </h2>
        <div class="plan_notes">
          <h3 class="bottom_margin">
            Plan Notes
          </h3>
          <div
            v-if="plan.notes !== null && plan.notes !== '<p><br></p>' && plan.notes !== ''"
            class="show_html fadeIn"
            v-html="update_html(plan.notes, true)"
          />
          <p
            v-else-if="plan.notes === null || plan.notes === '<p><br></p>' || plan.notes === ''"
            class="show_html grey"
          >
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
              :src="require('../../assets/svg/arrow-left.svg')"
              class="show_sessions_left cursor no_fill"
              @click="showing_current_session--"
            />
            <inline-svg
              v-show="showing_current_session === 0"
              :src="require('../../assets/svg/arrow-left.svg')"
              class="show_sessions_left disabled no_fill"
            />
            <p class="show_sessions_counter text--small">
              {{ showing_current_session + 1 }}/{{ plan.sessions.length }}
            </p>
            <inline-svg
              v-show="showing_current_session !== parseInt(plan.sessions.length) - 1"
              :src="require('../../assets/svg/arrow-right.svg')"
              class="show_sessions_right cursor no_fill"
              @click="showing_current_session++"
            />
            <inline-svg
              v-show="showing_current_session === parseInt(plan.sessions.length) - 1"
              :src="require('../../assets/svg/arrow-right.svg')"
              class="show_sessions_right disabled no_fill"
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
                <span class="text--tiny">{{ $parent.day(session.date) }}</span>
                <span class="text--tiny">{{ session.date }}</span>
              </div>
            </div>
            <div class="show_html fadeIn" v-html="update_html(session.notes, true)" />
            <div :key="check">
              <button
                v-if="session.checked === 1 && !feedbackId"
                class="complete_button green_button"
                @click="complete(plan.id, session.id)"
              >
                Completed
              </button>
              <button
                v-if="session.checked === 0 && !feedbackId"
                class="complete_button red_button"
                @click="complete(plan.id, session.id)"
              >
                Click to complete
              </button>
            </div>
            <div v-if="session.checked === 1">
              <hr>
              <h3>
                Feedback
              </h3>
              <rich-editor
                v-model="session.feedback"
                :item-id="session.id"
                :editing="feedbackId"
                :empty-placeholder="'What would you like to share with your trainer?'"
                :force-stop="forceStop"
                @on-edit-change="resolve_feedback_editor"
              />
            </div>
          </div>
        </div>
        <div v-else>
          <h3>
            No sessions yet
          </h3>
          <p class="grey">
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
  async beforeRouteLeave (to, from, next) {
    if (this.$parent.dontLeave ? await this.$parent.$refs.confirm_pop_up.show('Your changes might not be saved', 'Are you sure you want to leave?') : true) {
      this.$parent.dontLeave = false
      next()
    }
  },
  data () {
    return {

      // SYSTEM

      check: null,
      showing_current_session: 0,

      // EDIT

      forceStop: 0,
      feedbackId: null,
      tempEditorStore: null,

      // CALENDAR

      showMonthlyCal: false,
      sessionDates: [],
      forceUpdate: 0
    }
  },
  async mounted () {
    this.$parent.loading = true
    this.will_body_scroll(true)
    await this.$parent.get_plans()
    await this.sort_sessions(this.$parent.clientUser.plans.find(plan => plan.id === parseInt(this.$route.params.id)))
    await this.scan()
    this.$parent.end_loading()
  },
  methods: {

    // BACKGROUND AND MISC.

    resolve_feedback_editor (state, id) {
      let plan
      let session
      this.$parent.clientUser.plans.forEach((planItem) => {
        planItem.sessions.forEach((sessionItem) => {
          if (sessionItem.id === id) {
            plan = planItem
            session = sessionItem
          }
        })
      })
      switch (state) {
        case 'edit':
          this.$parent.dontLeave = true
          this.feedbackId = id
          this.forceStop += 1
          this.tempEditorStore = session.feedback
          break
        case 'save':
          this.feedbackId = null
          this.$parent.update_session(plan.id, session.id)
          break
        case 'cancel':
          this.$parent.dontLeave = false
          this.feedbackId = null
          session.feedback = this.tempEditorStore
          break
      }
    },
    goToEvent (id) {
      const SESSION_INDEX = this.sessionDates.findIndex(session => session.session_id === id)
      this.showing_current_session = SESSION_INDEX
      setTimeout(() => {
        document.getElementById(`session-${id}`).scrollIntoView({ behavior: 'smooth' })
      }, 100)
    },
    complete (planId, sessionId) {
      const PLAN = this.$parent.clientUser.plans.find(plan => plan.id === planId)
      const SESSION = PLAN.sessions.find(session => session.id === sessionId)
      if (SESSION.checked === 0) {
        SESSION.checked = 1
        this.check = 1
      } else {
        SESSION.checked = 0
        this.check = 0
      }
      this.$parent.update_session(planId, sessionId)
    },
    scan () {
      this.sessionDates.length = 0
      const PLAN = this.$parent.clientUser.plans.find(plan => plan.id === parseInt(this.$route.params.id))
      const WEEK_COLOR = PLAN.block_color.replace('[', '').replace(']', '').split(',')
      if (PLAN.sessions !== null) {
        PLAN.sessions.forEach((session) => {
          this.sessionDates.push({
            title: session.name,
            date: session.date,
            color: WEEK_COLOR[session.week_id - 1],
            textColor: this.accessible_colors(WEEK_COLOR[session.week_id - 1]),
            week_id: session.week_id,
            session_id: session.id
          })
        })
      }
      this.forceUpdate += 1
    }
  }
}
</script>

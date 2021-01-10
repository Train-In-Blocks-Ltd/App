<style scoped>
  .plan_name {
    margin-bottom: 4rem
  }
  .plan_notes, .wrapper--session {
    box-shadow: 0 0 20px 10px #28282808;
    border-radius: 10px;
    padding: 2rem
  }
  .container--sessions {
    margin-top: 4rem
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
  .disabled {
    opacity: .4
  }

  /* Scroll */
  .container--sessions::-webkit-scrollbar {
    height: 4px
  }

  /* Responsive */
  @media (max-width: 768px) {
    .plan_notes, .wrapper--session {
      box-shadow: none;
      border-radius: 0;
      padding: 0
    }
  }
</style>

<template>
  <div id="client-plan">
    <div v-for="(plan, index) in $parent.clientUser.plans" :key="index">
      <div v-if="plan.id == $route.params.id" class="client_plan">
        <p class="plan_name text--large">{{plan.name}}</p>
        <div class="plan_notes">
          <div class="plan_notes__header">
            <p class="text--small">Plan Notes</p>
          </div>
          <div v-if="plan.notes !== null && plan.notes !== '<p><br></p>' && plan.notes !== ''" v-html="plan.notes" class="show_plan_notes animate animate__fadeIn" />
          <p v-if="plan.notes === null || plan.notes === '<p><br></p>' || plan.notes === ''" class="show_plan_notes text--small grey">No plan notes added...</p>
        </div>
        <div class="wrapper--calendar">
          <calendar :events="sessionDates" />
        </div>
        <skeleton v-if="$parent.loading" :type="'session'" class="container--sessions" />
        <div v-else-if="plan.sessions" class="container--sessions">
          <div class="show_sessions_nav">
            <inline-svg
              v-show="showing_current_session !== 0"
              @click="showing_current_session--"
              :src="require('../../assets/svg/arrow.svg')"
              class="show_sessions_left"
            />
            <inline-svg
              v-show="showing_current_session === 0"
              :src="require('../../assets/svg/arrow.svg')"
              class="show_sessions_left disabled"
            />
            <p class="show_sessions_counter">{{ showing_current_session + 1 }}/{{ plan.sessions.length }}</p>
            <inline-svg
              v-show="showing_current_session !== parseInt(plan.sessions.length) - 1"
              @click="showing_current_session++"
              :src="require('../../assets/svg/arrow.svg')"
              class="show_sessions_right"
            />
            <inline-svg
              v-show="showing_current_session === parseInt(plan.sessions.length) - 1"
              :src="require('../../assets/svg/arrow.svg')"
              class="show_sessions_right disabled"
            />
          </div>
          <div
            v-for="(session, index) in plan.sessions"
            :key="index"
            v-show="showing_current_session === index"
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
              </div>
            </div>
            <br><hr><br>
            <div>
              <p class="text--small">Feedback</p>
              <rich-editor
                :showEditState="giveFeedback === session.id"
                :htmlInjection.sync="session.feedback"
                :emptyPlaceholder="'What would you like to share with your trainer?'"
              />
              <button v-if="giveFeedback !== session.id" @click="giveFeedback = session.id, tempEditorStore = session.feedback">Edit</button>
              <button v-if="giveFeedback === session.id" @click="giveFeedback = null, $parent.update_session(plan.id, session.id)">Save</button>
              <button v-if="giveFeedback === session.id" class="cancel" @click="giveFeedback = null, session.feedback = tempEditorStore">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import InlineSvg from 'vue-inline-svg'
  import Skeleton from '../../components/Skeleton'
  import Calendar from '../../components/Calendar'
  import RichEditor from '../../components/Editor'

  export default {
    components: {
      Calendar,
      Skeleton,
      RichEditor,
      InlineSvg
    },
    data () {
      return {
        check: null,
        giveFeedback: null,
        showing_current_session: 0,
        tempEditorStore: null,

        // CALENDAR DATA
        sessionDates: []
      }
    },
    async mounted () {
      this.$parent.loading = true
      this.$parent.splashed = true
      this.$parent.willBodyScroll(true)
      await this.$parent.setup()
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
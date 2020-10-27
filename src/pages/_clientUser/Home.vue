<style scopred>
  /* Containers */
  .plan_grid {
    display: grid;
    grid-gap: 2rem;
    margin: 2rem 0
  }
  .wrapper--session {
    display: grid;
    margin: 2rem 0;
    box-shadow: 0 0 20px 10px #28282810;
    padding: 2rem;
    border-radius: 3px
  }
</style>

<template>
  <div id="home">
    <div v-if="!$parent.splashed" id="splash">
      <div class="box">
        <svg class="logo--svg" width="38" height="38" viewBox="0 0 38 38" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg">
          <g id="Icon">
            <path d="M0 0L38 0L38 15L15 15L15 38L0 38L0 0Z" id="Rectangle" fill="#282828" stroke="none" />
            <path d="M0 0L14 0L14 14L0 14L0 0Z" transform="translate(24 24)" id="Rectangle-2" fill="#282828" stroke="none" />
          </g>
        </svg>
      </div>
    </div>
    <div class="container--client">
      <button @click="$parent.installPWA()" v-if="$parent.displayMode === 'browser tab' && $parent.canInstall === true">
        Install App
      </button>
      <p class="text--large">Today</p>
      <p class="text--small text--no-sessions grey" v-if="viewSessionsStore.length === 0 && $parent.loading === false">No sessions today...</p>
      <p class="text--small text--loading grey" v-if="$parent.loading === true">Loading sessions...</p>
      <div v-for="(plan, index) in this.$parent.clientUser.plans" :key="index">
        <div class="container--sessions" v-if="plan.sessions">
          <div class="wrapper--session" v-for="(session, index) in plan.sessions"
            :key="index" v-show="session.id == viewSessionsStore[currentSessionIndexHome] && isToday()">
            <div class="wrapper--session__header client-side" :id="session.name">
              <span class="text--name"><b>{{session.name}}</b></span><br>
              <span class="text--date">{{$parent.day(session.date)}}</span>
              <span class="text--date">{{session.date}}</span>
            </div>
            <div v-html="removeBrackets(session.notes)" class="show-session animate animate__fadeIn"/>
            <div class="bottom-bar">
              <div class="full-width-bar">
                <button v-if="session.checked === 1" @click="session.checked = 0, $parent.update_session(plan.id, session.id)" id="button-done" class="button--state no-margin">Completed</button>
                <button v-if="session.checked === 0" @click="session.checked = 1, $parent.update_session(plan.id, session.id)" id="buttons-to-do" class="button--state no-margin">Click to complete</button>
                <button v-if="giveFeedback !== session.id" @click="giveFeedback = session.id" class="button--feedback">Give Feedback</button>
              </div>
            </div><br>
            <div v-if="giveFeedback === session.id">
              <p><b>Feedback</b></p>
              <quill v-model="session.feedback" output="html" class="quill animate animate__fadeIn"/>
              <button @click="giveFeedback = null, $parent.update_session(plan.id, session.id)">Save</button>
              <button class="cancel" @click="giveFeedback = null">Cancel</button>
            </div>
          </div>
        </div>
      </div>
      <div v-if="viewSessionsStore.length !== 0" class="container--session-control">
        <div>
          <button v-if="currentSessionIndexHome != 0" @click="currentSessionIndexHome--">Back</button>
          <button v-if="currentSessionIndexHome != maxSessionIndexHome" @click="currentSessionIndexHome++">Next</button>
        </div>
        <p class="text--small session-counter">{{currentSessionIndexHome + 1}}/{{maxSessionIndexHome + 1}}</p>
      </div>
      <p class="text--large">Plans</p>
      <div class="plan_grid">
        <router-link
          v-for="(plan, index) in this.$parent.clientUser.plans"
          :key="'plan-' + index"
          class="plan_link"
          :to="'/clientUser/plan/' + plan.id"
        >
          <p class="text--small plan-name">{{plan.name}}</p>
          <p v-if="plan.notes === null || plan.notes === '<p><br></p>' || plan.notes === ''" class="grey">No plan notes added.</p>
          <div v-if="plan.notes !== null && plan.notes !== '<p><br></p>' && plan.notes !== ''" v-html="plan.notes" class="plan_link__notes__content" />
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import InlineSvg from 'vue-inline-svg'

export default {
  components: {
    InlineSvg
  },
  data () {
    return {
      giveFeedback: null,
      viewSessionsStore: [],
      maxSessionIndexHome: null,
      currentSessionIndexHome: 0
    }
  },
  created () {
    setTimeout(() => {
      this.$parent.splashed = true
    }, 4000)
    this.$parent.loading = false
  },
  mounted () {
    this.$parent.loading = true
    this.$parent.setup()
    this.$parent.get_plans()
    this.todaysSession()
    this.initCountSessionsHome()
    this.$parent.loading = false
  },
  methods: {

    // BACKGROUND AND MISC. METHODS //-------------------------------------------------------------------------------

    removeBrackets (dataIn) {
      if (dataIn !== null) {
        var dataOut = dataIn.replace(/[[\]]/g, '')
        return dataOut
      } else {
        return dataIn
      }
    },
    initCountSessionsHome () {
      var count = this.viewSessionsStore.length - 1
      this.maxSessionIndexHome = count
    },

    // DATE/TIME METHODS //-------------------------------------------------------------------------------

    todaysSession () {
      this.$parent.clientUser.plans.forEach((plan) => {
        plan.sessions.forEach((session) => {
          if (session.date === this.isToday()) {
            this.viewSessionsStore.push(session.id)
          }
        })
      })
    },
    isToday () {
      var today = new Date()
      var dd = String(today.getDate()).padStart(2, '0')
      var mm = String(today.getMonth() + 1).padStart(2, '0')
      var yyyy = today.getFullYear()
      today = `${yyyy}-${mm}-${dd}`
      return today
    }
  }
}
</script>

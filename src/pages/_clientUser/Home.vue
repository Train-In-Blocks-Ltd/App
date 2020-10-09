<style scoped>
  /* Link Container */
  .plan_link {
    display: grid;
    padding: 2rem;
    grid-gap: 1rem;
    font-weight: 400;
    color: #282828;
    text-decoration: none;
    box-shadow: 0 0 20px 10px #28282810;
    border-radius: 3px;
    transition: all .6s cubic-bezier(.165, .84, .44, 1)
  }
  .plan_link:hover {
    transform: scale(1.02)
  }
  .plan_link:active {
    transform: scale(1)
  }
  .plan_link__notes__content {
    font-size: .8rem;
    margin-top: .4rem
  }
  .plan_link__notes__content * {
    color: #28282890;
    transition: all .6s cubic-bezier(.165, .84, .44, 1)
  }
  .plan_link:hover .plan_link__notes__content * {
    color: #282828
  }
  .plan_link__notes__content p {
    margin: .4rem 0
  }
  .plan-name {
    margin: 0
  }
  .plan_link__notes__content h1, .plan_link__notes__content h2 {
    font-size: 1rem
  }
  .plan_link img {
    margin: 1rem 0;
    max-width: 100%;
    border-radius: 3px;
    opacity: .6;
    transition: all .6s cubic-bezier(.165, .84, .44, 1)
  }
  .plan_link:hover img {
    opacity: 1
  }

  /* Containers */
  .plan_grid {
    display: grid;
    grid-gap: 2rem;
    margin: 2rem 0
  }
</style>

<template>
  <div id="home">
    <div class="container--client">
      <button @click="$parent.installPWA()" v-if="$parent.displayMode === 'browser tab' && $parent.canInstall === true">
        Install App
      </button>
      <p class="text--large">Today</p>
      <p class="text--small text--no-sessions grey" v-if="viewSessionsStore.length === 0 && loading === false">No sessions today...</p>
      <p class="text--small text--loading grey" v-if="loading === true">Loading sessions...</p>
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
                <button v-if="session.checked !== 0" @click="session.checked = 0, $parent.update_session(plan.id, session.id)" class="button--state no-margin">Completed</button>
                <button v-if="session.checked === 0" @click="session.checked = 1, $parent.update_session(plan.id, session.id)" class="button--state no-margin">Click to complete</button>
                <button v-if="giveFeedback !== session.id" @click="giveFeedback = session.id" class="button--feedback">Give Feedback</button>
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
      </div>
      <div v-if="viewSessionsStore.length !== 0" class="container--session-control">
        <div>
          <button v-show="currentSessionIndexHome != 0" @click="currentSessionIndexHome--">Back</button>
          <button v-show="currentSessionIndexHome != maxSessionIndexHome" @click="currentSessionIndexHome++">Next</button>
        </div>
        <p class="session-counter">{{currentSessionIndexHome + 1}}/{{maxSessionIndexHome + 1}}</p>
      </div>
      <p class="text--large">Plans</p>
      <div class="plan_grid">
        <router-link v-for="(plan, index) in this.$parent.clientUser.plans" :key="'plan-' + index" class="plan_link" :to="'/clientUser/plan/' + plan.id">
          <p class="text--small plan-name">{{plan.name}}</p>
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
      loading: true,
      viewSessionsStore: [],
      maxSessionIndexHome: null,
      currentSessionIndexHome: 0
    }
  },
  created () {
    this.$parent.setup()
  },
  async mounted () {
    await this.$parent.get_plans()
    await this.todaysSession()
    await this.initCountSessionsHome()
    this.loading = false
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

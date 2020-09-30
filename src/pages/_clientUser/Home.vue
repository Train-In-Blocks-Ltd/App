
<style scoped>

  /* SEE PLANS.VUE */

  /* Containers */
  .plans_grid {
    margin: 4rem 0
  }

  /* Content */
  .text--no-sessions {
    margin: 2rem 0 4rem 0
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
              <div>
                <button v-if="session.checked !== 0" @click="session.checked = 0, $parent.update_session(plan.id, session.id)" id="button-done" class="button no-margin">Completed</button>
                <button v-if="session.checked === 0" @click="session.checked = 1, $parent.update_session(plan.id, session.id)" id="button-to-do" class="button no-margin">Incomplete</button>
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
      </div>
      <div v-if="viewSessionsStore.length !== 0" class="container--session-control">
        <div>
          <button v-show="currentSessionIndexHome != 0" @click="currentSessionIndexHome--">Back</button>
          <button v-show="currentSessionIndexHome != maxSessionIndexHome" @click="currentSessionIndexHome++">Next</button>
        </div>
        <p class="session-counter">{{currentSessionIndexHome + 1}}/{{maxSessionIndexHome + 1}}</p>
      </div>
      <p class="text--large">Plans</p>
      <div class="plans_grid">
        <div v-for="(plan, index) in this.$parent.clientUser.plans"
          :key="'plan-' + index" class="plan_container">
          <router-link class="plan_link" :to="'/clientUser/plan/' + plan.id">
            <p class="text--small plan-name">{{plan.name}}</p>
            <div v-html="plan.notes" class="plan_link__notes__content" />
          </router-link>
        </div>
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
    await this.todayssession()
    await this.initCountsessionsHome()
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
    initCountsessionsHome () {
      var count = this.viewSessionsStore.length - 1
      this.maxSessionIndexHome = count
    },

    // DATE/TIME METHODS //-------------------------------------------------------------------------------

    todayssession () {
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

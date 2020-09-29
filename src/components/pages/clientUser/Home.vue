
<style scoped>
  /* Plans */
  .plans_grid {
    display: grid;
    grid-gap: 2rem;
    margin-bottom: 2rem
  }
  .plan_container:first-of-type {
    margin-left: 0
  }
  .plan_container:last-of-type {
    margin-right: 0
  }
  .plan_container--link {
    display: grid;
    position: relative;
    grid-gap: 1rem;
    width: 95%;
    max-width: 600px;
    min-width: 400px;
    text-decoration: none;
    color: #282828;
    padding: 1rem 0;
    transition: all .4s cubic-bezier(.165, .84, .44, 1)
  }
  .plan_container--link:before {
    content: '';
    position: absolute;
    opacity: .4;
    width: 95%;
    height: 1px;
    bottom: 0;
    left: 0;
    background-color: #282828;
    transition: all .6s cubic-bezier(.075, .82, .165, 1)
  }
  .plan_container--link:hover:before {
    width: 100%;
    opacity: 1
  }
  .plan_container--link__plan-notes {
    font-size: .8rem
  }
  .plan_container--link h3 {
    margin-top: 0;
    font-size: 1.4rem;
    margin-bottom: 0;
    overflow: hidden;
    text-overflow: ellipsis
  }
  .more-plan-info {
    margin-top: 1rem
  }
  .plan_container--link p {
    font-size: .8rem;
    font-weight: 500
  }
  .plan_container--link p:last-of-type {
    margin-bottom: 0
  }

  @media (min-width: 1024px) {
    .plan_container--link {
      grid-template: 1fr/1fr 1fr;
      grid-gap: 2rem
    }
  }
  @media (min-width: 768px) {
    .title-icon {
      height: 48px;
      width: 48px
    }
  }
  @media (max-width: 768px) {
    .client-notes, .plan_container--link {
      margin: 0;
      min-width: 0;
      width: 100%
    }
  }

  /* For Mobile */
  @media (max-width: 576px) {
    .plans_grid {
      grid-template-columns: 1fr
    }
  }
</style>

<template>
  <div id="home">
    <div class="container--client">
      <button @click="$parent.installPWA()" v-if="$parent.displayMode === 'browser tab' && $parent.canInstall === true">
        Install App
      </button>
      <div class="container--title">
        <inline-svg :src="require('../../../assets/svg/today.svg')" class="title-icon"/>
        <h2 class="text--small no-margin">Today</h2>
      </div>
      <p v-if="viewSessionsStore.length === 0 && loading === false">No sessions today...</p>
      <p v-if="loading === true">Loading sessions...</p>
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
      <div class="container--title">
        <inline-svg :src="require('../../../assets/svg/plan.svg')" class="title-icon"/>
        <h2 class="text--small no-margin">Plans</h2>
      </div>
      <div class="plans_grid">
        <div v-for="(plan, index) in this.$parent.clientUser.plans"
          :key="'plan-' + index" class="plan_container">
          <router-link class="plan_container--link" :to="'/clientUser/plan/' + plan.id">
            <div class="plan_container--link__info">
              <h3>{{plan.name}}</h3>
              <div class="more-plan-info">
                <p><b>Duration: </b>{{plan.duration}}</p>
                <p><b>Start: </b>{{plan.start}}</p>
              </div>
            </div>
            <div v-html="plan.notes" class="plan_container--link__plan-notes" />
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

<style scoped>
  /* Containers */
  .plan_grid {
    display: grid;
    grid-gap: 2rem;
    margin: 2rem 0
  }
  .container--sessions {
    margin: 2rem 0
  }
  .wrapper--session {
    box-shadow: 0 0 20px 10px #28282808;
    border-radius: 10px;
    padding: 2rem;
    margin: 2rem 0
  }
  .client_portfolio__notes {
    margin: 2rem 0
  }
  hr {
    margin: 4rem 0;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .wrapper--session {
      box-shadow: none;
      border-radius: 0;
      padding: 0
    }
  }
</style>

<template>
  <div id="home">
    <splash v-if="!$parent.splashed" />
    <div>
      <div :class="{openedSections: is_portfolio_open}" class="section--a" />
      <div :class="{openedSections: is_portfolio_open}" class="section--b"/>
    </div>
    <transition enter-active-class="animate animate__fadeIn animate__faster animate__delay-1s">
      <div class="wrapper--portfolio" v-if="is_portfolio_open">
        <div class="client_home__portfolio">
          <p class="text--large">{{ $parent.portfolio.business_name }}</p>
          <p class="text--large grey">{{ $parent.portfolio.trainer_name }}</p>
          <div v-html="$parent.portfolio.notes" class="client_portfolio__notes"/>
          <button @click="is_portfolio_open = false, $parent.willBodyScroll(true)" class="cancel">Close</button>
        </div>
      </div>
    </transition>
    <div
      v-if="!is_portfolio_open && $parent.portfolio.notes !== '' && $parent.portfolio.notes !== '<p><br></p>'"
      @click="is_portfolio_open = true, $parent.willBodyScroll(false)"
      aria-label="Information"
      class="icon_open--portfolio"
    >
      <inline-svg :src="require('../../assets/svg/trainer.svg')" aria-label="Information"/>
      <p class="text">Trainer</p>
    </div>
    <div id="client_home">
      <div class="client_home__today">
        <div class="client_home__today__header">
          <p class="text--large">Today</p>
        </div>
        <skeleton v-if="$parent.loading" :type="'session'" />
        <p
          v-show="todays_sessions_store.length === 0 && !$parent.loading"
          class="text--small text--no_sessions grey"
        >
          No sessions today...
        </p>
        <div v-for="plan in this.$parent.clientUser.plans" :key="plan.name">
          <div v-if="plan.sessions" class="container--sessions">
            <div
              v-for="(session, index) in plan.sessions"
              :key="index"
              v-show="todays_sessions_store.includes(session.id) && !$parent.loading"
              class="wrapper--session"
            >
              <div class="wrapper--session__header client-side" :id="session.name">
                <span class="text--name"><b>{{session.name}}</b></span><br>
                <span class="text--date">{{$parent.day(session.date)}}</span>
                <span class="text--date">{{session.date}}</span>
              </div>
              <div v-html="removeBrackets(session.notes)" class="show_session animate animate__fadeIn"/>
              <div class="bottom_bar">
                <div class="full_width_bar">
                  <button
                    v-if="session.checked === 1"
                    @click="session.checked = 0, $parent.update_session(plan.id, session.id)"
                    id="button_done"
                    class="button--state no_margin"
                  >
                    Completed
                  </button>
                  <button
                    v-if="session.checked === 0"
                    @click="session.checked = 1, $parent.update_session(plan.id, session.id)"
                    id="buttons_to_do"
                    class="button--state no_margin"
                  >
                    Click to complete
                  </button>
                  <button
                    v-if="giveFeedback !== session.id"
                    @click="giveFeedback = session.id"
                    class="button--feedback"
                  >
                    Give Feedback
                  </button>
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
      <hr>
      <div class="client_home__plans">
        <p class="text--large">Plans</p>
        <skeleton v-if="$parent.loading" :type="'plan'" />
        <div v-if="!$parent.loading" class="plan_grid">
          <router-link
            v-for="(plan, index) in this.$parent.clientUser.plans"
            :key="'plan-' + index"
            class="plan_link"
            :to="'/clientUser/plan/' + plan.id"
          >
            <p class="text--small plan-name">{{plan.name}}</p>
            <p
              v-if="plan.notes === null || plan.notes === '<p><br></p>' || plan.notes === ''"
              class="grey"
            >
              No plan notes added.
            </p>
            <div
              v-if="plan.notes !== null && plan.notes !== '<p><br></p>' && plan.notes !== ''"
              v-html="plan.notes"
              class="plan_link__notes__content"
            />
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import InlineSvg from 'vue-inline-svg'
import Skeleton from '../../components/Skeleton.vue'
import Splash from '../../components/Splash'

export default {
  components: {
    InlineSvg,
    Skeleton,
    Splash
  },
  data () {
    return {
      is_portfolio_open: false,
      giveFeedback: null,
      todays_sessions_store: [],
      showing_current_session: 0
    }
  },
  async mounted () {
    this.$parent.loading = true
    setTimeout(() => {
      this.$parent.splashed = true
    }, 4000)
    await this.$parent.setup()
    await this.$parent.get_plans()
    await this.$parent.get_portfolio()
    this.todaysSession()
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

    // DATE/TIME METHODS //-------------------------------------------------------------------------------

    todaysSession () {
      this.$parent.clientUser.plans.forEach((plan) => {
        plan.sessions.forEach((session) => {
          if (session.date === this.isToday()) {
            this.todays_sessions_store.push(session.id)
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

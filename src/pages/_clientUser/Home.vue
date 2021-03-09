<style>
  .show_html > div,
  .show_html > p {
    margin: .6rem 0
  }
  .show_html img {
    border-radius: 10px;
    max-width: 80%;
    margin: 1rem 0
  }
  .show_html input[type='checkbox'] {
    margin: .4rem
  }
</style>

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
    background-color: white;
    box-shadow: 0 0 20px 10px #28282808;
    border-radius: 10px;
    padding: 2rem;
    margin: 2rem 0
  }
  .client_portfolio__notes {
    margin: 2rem 0
  }
  hr {
    margin: 2rem 0
  }
  .feedback_bottom_bar {
    margin-top: 1rem
  }
</style>

<template>
  <div id="home">
    <div v-if="$parent.portfolio">
      <div>
        <div :class="{ opened_sections: isPortfolioOpen || isInstallOpen }" class="section_a" />
        <div :class="{ opened_sections: isPortfolioOpen || isInstallOpen }" class="section_b" />
      </div>
      <div v-if="isPortfolioOpen" class="tab_overlay_content fadeIn delay fill_mode_both">
        <div class="client_home__portfolio">
          <p class="text--large">
            {{ $parent.portfolio.business_name }}
          </p>
          <p class="text--large grey">
            {{ $parent.portfolio.trainer_name }}
          </p>
          <div class="client_portfolio__notes" v-html="remove_brackets_and_checkbox($parent.portfolio.notes)" />
          <button class="cancel" @click="isPortfolioOpen = false, $parent.will_body_scroll(true)">
            Close
          </button>
        </div>
      </div>
      <div v-if="isInstallOpen" class="tab_overlay_content fadeIn delay fill_mode_both">
        <install-app />
      </div>
      <div
        v-if="!isPortfolioOpen && $parent.portfolio.notes !== '' && $parent.portfolio.notes !== '<p><br></p>'"
        aria-label="Information"
        class="tab_option tab_option_small"
        @click="isPortfolioOpen = true, $parent.will_body_scroll(false)"
      >
        <inline-svg :src="require('../../assets/svg/trainer.svg')" aria-label="Information" />
        <p class="text">
          Trainer
        </p>
      </div>
      <div
        v-if="!isInstallOpen && $parent.pwa.displayMode === 'browser tab'"
        :class="{ icon_open_middle: $parent.portfolio.notes !== '' && $parent.portfolio.notes !== '<p><br></p>' }"
        class="tab_option tab_option_small"
        aria-label="Install App"
        @click="isInstallOpen = true, $parent.will_body_scroll(false)"
      >
        <inline-svg :src="require('../../assets/svg/install-pwa.svg')" aria-label="Install App" />
        <p class="text">
          Install
        </p>
      </div>
    </div>
    <div id="client_home">
      <div class="client_home__today">
        <div class="client_home__today__header">
          <p class="text--large">
            Today
          </p>
        </div>
        <skeleton v-if="$parent.loading" :type="'session'" />
        <p
          v-if="todays_sessions_store.length === 0 && !$parent.loading"
          class="text--small text--no_sessions grey"
        >
          Nothing planned for today
        </p>
        <div v-for="(plan, index) in $parent.clientUser.plans" :key="index">
          <div v-if="todays_sessions_store.length !== 0" class="container--sessions">
            <div
              v-for="(session, sessionIndex) in plan.sessions"
              v-show="todays_sessions_store.includes(session.id)"
              :id="`session-${session.id}`"
              :key="sessionIndex"
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
        </div>
      </div>
      <div class="spacer" />
      <div class="client_home__plans">
        <p class="text--large">
          Plans
        </p>
        <skeleton v-if="$parent.loading" :type="'plan'" />
        <div v-if="!noPlans && !$parent.loading" class="plan_grid">
          <router-link
            v-for="(plan, index) in $parent.clientUser.plans"
            :key="'plan-' + index"
            class="plan_link"
            :to="'/clientUser/plan/' + plan.id"
          >
            <p class="text--small plan-name">
              {{ plan.name }}
            </p>
            <p
              v-if="plan.notes === null || plan.notes === '<p><br></p>' || plan.notes === ''"
              class="grey"
            >
              No plan notes added.
            </p>
            <div
              v-if="plan.notes !== null && plan.notes !== '<p><br></p>' && plan.notes !== ''"
              class="plan_link__notes__content"
              v-html="remove_brackets_and_checkbox(plan.notes)"
            />
          </router-link>
        </div>
        <p
          v-if="noPlans && !$parent.loading"
          class="text--small text--no_sessions grey"
        >
          No plans yet, please contact your trainer or coach for more information
        </p>
      </div>
    </div>
  </div>
</template>

<script>
const RichEditor = () => import(/* webpackChunkName: "components.richeditor", webpackPreload: true  */ '../../components/Editor')
const InstallApp = () => import(/* webpackChunkName: "components.installpwa", webpackPrefetch: true  */ '../../components/InstallPWA')

export default {
  components: {
    RichEditor,
    InstallApp
  },
  data () {
    return {

      // TAB

      isPortfolioOpen: false,
      isInstallOpen: false,

      // EDIT

      giveFeedback: null,
      tempEditorStore: null,

      // SYSTEM

      noPlans: true,
      check: null,
      todays_sessions_store: [],
      showing_current_session: 0
    }
  },
  async mounted () {
    this.$parent.loading = true
    this.$parent.will_body_scroll(true)
    await this.$parent.setup()
    await this.$parent.get_plans()
    await this.$parent.get_portfolio()
    this.todays_session()
    this.$parent.clientUser.plans.length === 0 ? this.noPlans = true : this.noPlans = false
    this.$parent.end_loading()
  },
  methods: {

    // BACKGROUND AND MISC.

    complete (planId, sessionId) {
      const plan = this.$parent.clientUser.plans.find(plan => plan.id === planId)
      const session = plan.sessions.find(session => session.id === sessionId)
      if (session.checked === 0) {
        session.checked = 1
        this.check = 1
      } else {
        session.checked = 0
        this.check = 0
      }
      this.$parent.update_session(planId, sessionId)
    },
    todays_session () {
      this.$parent.clientUser.plans.forEach((plan) => {
        plan.sessions.forEach((session) => {
          if (session.date === this.today()) {
            this.todays_sessions_store.push(session.id)
          }
        })
      })
    }
  }
}
</script>

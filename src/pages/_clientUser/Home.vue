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
  .show_html a {
    color: var(--link)
  }
</style>

<style scoped>
  /* Containers */
  .container--sessions {
    margin: 2rem 0
  }
  .wrapper--session {
    background-color: var(--fore);
    box-shadow: var(--low_shadow);
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
</style>

<template>
  <div id="home">
    <div v-if="$parent.portfolio">
      <div :class="{ opened_sections: isPortfolioOpen || isInstallOpen }" class="section_overlay" />
      <div v-if="isPortfolioOpen" class="tab_overlay_content fadeIn delay fill_mode_both">
        <div class="client_home__portfolio">
          <h1>
            {{ $parent.portfolio.business_name }}
          </h1>
          <h2 class="grey">
            {{ $parent.portfolio.trainer_name }}
          </h2>
          <div class="client_portfolio__notes" v-html="remove_brackets_and_checkbox($parent.portfolio.notes)" />
          <button class="cancel" @click="isPortfolioOpen = false, will_body_scroll(true)">
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
        @click="isPortfolioOpen = true, will_body_scroll(false)"
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
        @click="isInstallOpen = true, will_body_scroll(false)"
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
          <h1>
            Today
          </h1>
        </div>
        <skeleton v-if="$parent.loading" :type="'session'" />
        <p
          v-if="todays_sessions_store.length === 0 && !$parent.loading"
          class="text--holder text--small grey"
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
              :class="{ editorActive: feedbackId === session.id }"
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
                    v-if="session.checked === 1 && !feedbackId"
                    class="button--state done"
                    @click="complete(plan.id, session.id)"
                  >
                    Completed
                  </button>
                  <button
                    v-if="session.checked === 0 && !feedbackId"
                    class="button--state to_do"
                    @click="complete(plan.id, session.id)"
                  >
                    Click to complete
                  </button>
                </div>
              </div>
              <div v-if="session.checked === 1">
                <hr>
                <h2>
                  Feedback
                </h2>
                <rich-editor
                  :item-id="session.id"
                  :editing="feedbackId"
                  :html-injection.sync="session.feedback"
                  :empty-placeholder="'What would you like to share with your trainer?'"
                  :force-stop="forceStop"
                  @on-edit-change="resolve_feedback_editor"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="spacer" />
      <div class="client_home__plans">
        <h1>
          Plans
        </h1>
        <skeleton v-if="$parent.loading" :type="'plan'" class="fadeIn" />
        <periodise v-else :is-trainer="false" :plans="$parent.clientUser.plans" />
        <p
          v-if="noPlans && !$parent.loading"
          class="text--holder text--small grey"
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
const Periodise = () => import(/* webpackChunkName: "components.periodise", webpackPrefetch: true  */ '../../components/Periodise')

export default {
  components: {
    RichEditor,
    InstallApp,
    Periodise
  },
  data () {
    return {

      // TAB

      isPortfolioOpen: false,
      isInstallOpen: false,

      // EDIT

      forceStop: 0,
      feedbackId: null,
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
    this.will_body_scroll(true)
    await this.$parent.setup()
    await this.$parent.get_plans()
    await this.$parent.get_portfolio()
    this.todays_session()
    this.$parent.clientUser.plans.length === 0 ? this.noPlans = true : this.noPlans = false
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
          this.feedbackId = id
          this.forceStop += 1
          this.tempEditorStore = session.feedback
          break
        case 'save':
          this.feedbackId = null
          this.$parent.update_session(plan.id, session.id)
          break
        case 'cancel':
          this.feedbackId = null
          session.feedback = this.tempEditorStore
          break
      }
    },
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

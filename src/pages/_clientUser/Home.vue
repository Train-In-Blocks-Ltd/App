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
/* Containers */
.container--sessions {
  margin: 2rem 0
}
.wrapper--session {
  border: 3px solid var(--base);
  border-radius: 10px;
  padding: 2rem;
  margin: 2rem 0
}
.client_business__notes {
  margin: 2rem 0
}
hr {
  margin: 2rem 0
}
.close_icon {
  float: right
}

/* Other element */
.complete_button {
  margin-top: 2rem
}

/* Responsive */
@media (max-width: 576px) {
  .wrapper--session {
    padding: .8rem
  }
}
</style>

<template>
  <div id="home" class="view_container">
    <div v-if="business">
      <div :class="{ opened_sections: isBusinessOpen || isInstallOpen || isProfileOpen }" class="section_overlay" />
      <div v-if="isProfileOpen" class="tab_overlay_content fadeIn delay fill_mode_both">
        <client-profile />
      </div>
      <div v-if="isBusinessOpen" class="tab_overlay_content fadeIn delay fill_mode_both">
        <div class="client_home__business">
          <inline-svg
            class="close_icon cursor"
            :src="require('../../assets/svg/close.svg')"
            aria-label="Close"
            @click="isBusinessOpen = false, willBodyScroll(true)"
          />
          <h2>
            {{ business.business_name }}
          </h2>
          <h3 class="grey">
            {{ business.trainer_name }}
          </h3>
          <div class="client_business__notes" v-html="updateHTML(business.notes, true)" />
        </div>
      </div>
      <div v-if="isInstallOpen" class="tab_overlay_content fadeIn delay fill_mode_both">
        <install-app />
      </div>
      <div
        v-if="!isProfileOpen"
        aria-label="Profile"
        class="tab_option tab_option_small"
        @click="isProfileOpen = true, willBodyScroll(false)"
      >
        <inline-svg :src="require('../../assets/svg/client-profile.svg')" aria-label="Profile" />
        <p class="text">
          Profile
        </p>
      </div>
      <div
        v-if="!isBusinessOpen && business && business.notes !== '<p></p>'"
        aria-label="Information"
        class="tab_option tab_option_large icon_open_middle"
        @click="isBusinessOpen = true, willBodyScroll(false)"
      >
        <inline-svg :src="require('../../assets/svg/info.svg')" aria-label="Information" />
        <p class="text">
          Information
        </p>
      </div>
      <div
        v-if="!isInstallOpen && pwa.displayMode === 'browser tab'"
        :class="{ icon_open_bottom: business && business.notes !== '<p></p>' }"
        class="tab_option icon_open_middle tab_option_small"
        aria-label="Install App"
        @click="isInstallOpen = true, willBodyScroll(false)"
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
          <h2>
            Today
          </h2>
        </div>
        <skeleton v-if="loading" :type="'session'" />
        <div v-else-if="clientUser.sessionsToday.length !== 0" class="container--sessions">
          <div
            v-for="(session, sessionIndex) in clientUser.sessionsToday"
            :id="`session-${session.id}`"
            :key="sessionIndex"
            class="wrapper--session"
          >
            <div :id="session.name" class="session_header client-side">
              <div>
                <span class="text--name"><b>{{ session.name }}</b></span><br>
                <span class="text--tiny">{{ day(session.date) }}</span>
                <span class="text--tiny">{{ session.date }}</span>
              </div>
            </div>
            <div class="show_html fadeIn" v-html="updateHTML(session.notes, true)" />
            <div :key="check">
              <button
                v-if="session.checked === 1 && !feedbackId"
                class="complete_button green_button"
                @click="complete(session.planId, session.id, session.checked)"
              >
                Completed
              </button>
              <button
                v-if="session.checked === 0 && !feedbackId"
                class="complete_button red_button"
                @click="complete(session.planId, session.id, session.checked)"
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
                @on-edit-change="resolveFeedbackEditor"
              />
            </div>
          </div>
        </div>
        <p
          v-else
          class="text--holder text--small grey"
        >
          Nothing planned for today
        </p>
      </div>
      <div class="spacer" />
      <div class="client_home__plans">
        <h2>
          Plans
        </h2>
        <skeleton v-if="loading" :type="'plan'" class="fadeIn" />
        <periodise v-else-if="clientUser.plans" :is-trainer="false" :plans.sync="clientUser.plans" />
        <p
          v-else
          class="text--holder text--small grey"
        >
          No plans yet, please contact your trainer or coach for more information
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
const RichEditor = () => import(/* webpackChunkName: "components.richeditor", webpackPreload: true  */ '../../components/Editor')
const InstallApp = () => import(/* webpackChunkName: "components.installpwa", webpackPrefetch: true  */ '../../components/InstallPWA')
const Periodise = () => import(/* webpackChunkName: "components.periodise", webpackPrefetch: true  */ '../../components/Periodise')
const ClientProfile = () => import(/* webpackChunkName: "components.clientProfile", webpackPrefetch: true  */ '../../components/ClientProfile')

export default {
  components: {
    RichEditor,
    InstallApp,
    Periodise,
    ClientProfile
  },
  async beforeRouteLeave (to, from, next) {
    if (this.dontLeave ? await this.$parent.$refs.confirm_pop_up.show('Your changes might not be saved', 'Are you sure you want to leave?') : true) {
      this.$store.commit('setData', {
        attr: 'dontLeave',
        data: false
      })
      next()
    }
  },
  data () {
    return {

      // TAB

      isBusinessOpen: false,
      isInstallOpen: false,
      isProfileOpen: false,

      // EDIT

      forceStop: 0,
      feedbackId: null,
      tempEditorStore: null,

      // SYSTEM

      check: null,
      showing_current_session: 0
    }
  },
  computed: mapState([
    'loading',
    'dontLeave',
    'clientUser',
    'claims',
    'business',
    'pwa'
  ]),
  async created () {
    this.$store.commit('setData', {
      attr: 'loading',
      data: true
    })
    this.willBodyScroll(true)
    await this.$parent.setup()
    await this.$parent.getClientSideData()
    this.$store.dispatch('endLoading')
  },
  methods: {

    // BACKGROUND AND MISC.

    resolveFeedbackEditor (state, id) {
      let plan
      let session
      this.clientUser.plans.forEach((planItem) => {
        planItem.sessions.forEach((sessionItem) => {
          if (sessionItem.id === id) {
            plan = planItem
            session = sessionItem
          }
        })
      })
      switch (state) {
        case 'edit':
          this.$store.commit('setData', {
            attr: 'dontLeave',
            data: true
          })
          this.feedbackId = id
          this.forceStop += 1
          this.tempEditorStore = session.feedback
          break
        case 'save':
          this.feedbackId = null
          this.$parent.updateClientSideSession(plan.id, session.id)
          break
        case 'cancel':
          this.$store.commit('setData', {
            attr: 'dontLeave',
            data: false
          })
          this.feedbackId = null
          session.feedback = this.tempEditorStore
          break
      }
    },
    complete (planId, sessionId, currentChecked) {
      if (!currentChecked) {
        this.$store.commit('updateClientUserPlanSingleSession', {
          planId,
          sessionId,
          attr: 'checked',
          data: 1
        })
        this.check = 1
      } else {
        this.$store.commit('updateClientUserPlanSingleSession', {
          planId,
          sessionId,
          attr: 'checked',
          data: 0
        })
        this.check = 0
      }
      this.$parent.updateClientSideSession(planId, sessionId)
      this.$store.dispatch('endLoading')
    }
  }
}
</script>

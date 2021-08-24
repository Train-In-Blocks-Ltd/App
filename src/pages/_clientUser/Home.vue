<style lang="scss">
.show_html {
  div,
  p {
    margin: .6rem 0
  }
  img {
    border-radius: 10px;
    max-width: 80%;
    margin: 1rem 0
  }
  a {
    color: var(--link)
  }
}
</style>

<style lang="scss" scoped>
.container--sessions {
  margin: 2rem 0;
  .wrapper--session {
    border: 3px solid var(--base);
    border-radius: 10px;
    padding: 2rem;
    margin: 2rem 0
  }
}
.client_portfolio__notes {
  margin: 2rem 0
}
hr {
  margin: 2rem 0
}
.complete_button {
  margin-top: 2rem
}

/* Products */
.products_section {
  margin: 4rem 0;
  .products {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 2rem;
    margin-top: 2rem;
    .product {
      display: grid;
      grid-gap: 1rem;
      border: 3px solid var(--base);
      border-radius: 10px;
      padding: 2rem;
      .header {
        display: flex;
        justify-content: space-between
      }
      .type {
        text-transform: capitalize
      }
      > button {
        display: none
      }
    }
  }
}

@media (max-width: 992px) {
  .products_section {
    .products {
      grid-template-columns: 1fr
    }
  }
}
@media (max-width: 576px) {
  .container--sessions .wrapper--session {
    padding: .8rem
  }
  .products_section {
    .products {
      .product {
        padding: 1rem;
        .header {
          button {
            display: none
          }
        }
        > button {
          display: block;
          margin-top: 1rem
        }
      }
    }
  }
}
</style>

<template>
  <div id="home" class="view_container">
    <div v-if="portfolio">
      <div :class="{ opened_sections: isPortfolioOpen || isInstallOpen || isProfileOpen }" class="section_overlay" />
      <div v-if="isProfileOpen" class="tab_overlay_content fadeIn delay fill_mode_both">
        <client-profile />
      </div>
      <div v-if="isPortfolioOpen" class="tab_overlay_content fadeIn delay fill_mode_both">
        <div class="client_home__portfolio">
          <inline-svg
            class="close_icon cursor"
            :src="require('../../assets/svg/close.svg')"
            aria-label="Close"
            @click="isPortfolioOpen = false, willBodyScroll(true)"
          />
          <h2>
            {{ portfolio.business_name }}
          </h2>
          <h3 class="grey">
            {{ portfolio.trainer_name }}
          </h3>
          <skeleton
            v-if="loading"
            :type="'session'"
          />
          <div
            v-else
            class="client_portfolio__notes"
            v-html="updateHTML(portfolio.notes, true)"
          />
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
        v-if="!isPortfolioOpen && portfolio && portfolio.notes !== '<p></p>'"
        aria-label="Information"
        class="tab_option tab_option_large icon_open_middle"
        @click="isPortfolioOpen = true, willBodyScroll(false)"
      >
        <inline-svg :src="require('../../assets/svg/info.svg')" aria-label="Information" />
        <p class="text">
          Information
        </p>
      </div>
      <div
        v-if="!isInstallOpen && pwa.displayMode === 'browser tab'"
        :class="{ icon_open_bottom: portfolio && portfolio.notes !== '<p></p>' }"
        class="tab_option icon_open_middle tab_option_small"
        aria-label="Install Train In Blocks"
        @click="isInstallOpen = true, willBodyScroll(false)"
      >
        <inline-svg :src="require('../../assets/svg/install-pwa.svg')" aria-label="Install Train In Blocks" />
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
        <div v-else-if="clientUser.sessionsToday" class="container--sessions">
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
                @click="complete(session.programme_id, session.id, session.checked)"
              >
                Completed
              </button>
              <button
                v-if="session.checked === 0 && !feedbackId"
                class="complete_button red_button"
                @click="complete(session.programme_id, session.id, session.checked)"
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
      <div class="products_section">
        <h2>
          Services
        </h2>
        <skeleton v-if="loading" :type="'product'" />
        <div v-else class="products">
          <div
            v-for="(product, productIndex) in clientUser.products"
            :key="`product_${productIndex}`"
            class="product fadeIn"
          >
            <div class="header">
              <h3>
                {{ product.name }}
              </h3>
              <button @click.prevent="checkout(product.id)">
                Purchase
              </button>
            </div>
            <p>
              <b class="type">{{ product.type }}</b> payment of <b>{{ `${product.price} ${product.currency}` }}</b>
            </p>
            <p>
              {{ product.notes }}
            </p>
            <button @click.prevent="checkout(product.id)">
              Purchase
            </button>
          </div>
        </div>
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
const CUSTOM_ENV = process.env.NODE_ENV === 'production' ? require('../../../config/prod.env') : require('../../../config/dev.env')

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

      isPortfolioOpen: false,
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
    'clientUserLoaded',
    'loading',
    'dontLeave',
    'clientUser',
    'claims',
    'portfolio',
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

    // -----------------------------
    // General
    // -----------------------------

    /**
     * Resolves the state of the feeback editor.
     * @param {string} state - The returned state of the editor.
     * @param {integer} id - The id of the session.
     */
    resolveFeedbackEditor (state, id) {
      let plan
      let session
      this.clientUser.plans.forEach((planItem) => {
        if (planItem.sessions) {
          planItem.sessions.forEach((sessionItem) => {
            if (sessionItem.id === id) {
              plan = planItem
              session = sessionItem
            }
          })
        }
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

    /**
     * Toggles the complete state of the session.
     * @param {integer} planId - The id of the plan.
     * @param {integer} sessionId - The id of the session.
     * @param {integer} currentChecked - The new state of the session.
     */
    complete (planId, sessionId, currentChecked) {
      this.$store.commit('updateClientUserPlanSingleSession', {
        planId,
        sessionId,
        attr: 'checked',
        data: !currentChecked ? 1 : 0
      })
      this.check = !currentChecked ? 1 : 0
      this.$parent.updateClientSideSession(planId, sessionId)
      this.$store.dispatch('endLoading')
    },

    async checkout (productId) {
      try {
        this.$store.commit('setData', {
          attr: 'dontLeave',
          data: true
        })
        const RESPONSE = await this.$axios.post('/.netlify/functions/checkout', {
          productId,
          ptId: this.clientUser.pt_id,
          email: this.claims.email
        })
        // eslint-disable-next-line no-undef
        const stripe = await Stripe(CUSTOM_ENV.STRIPE_PUBLIC_KEY, {
          stripeAccount: await RESPONSE.data.connectedAccountId
        })
        stripe.redirectToCheckout({ sessionId: await RESPONSE.data.sessionId })
        this.$store.dispatch('endLoading')
      } catch (e) {
        this.$parent.resolveError(e)
      }
    }
  }
}
</script>

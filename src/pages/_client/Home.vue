<style lang="scss" scoped>
.client_home_top_grid {
  display: grid;
  grid-template-columns: .2fr 1fr;
  grid-gap: 1.6rem;
  img {
    height: 140px;
    width: 140px;
    filter: grayscale(.8);
    border-radius: 50%
  }
  .profile_image_placeholder {
    padding: 1.8rem;
    height: 140px;
    width: 140px;
    border: 4px solid var(--base);
    border-radius: 50%
  }
  .client_info {
    display: grid;
    grid-gap: 1rem;
    .client_info__options {
      display: flex;
      justify-content: space-between;
      .client_email_bar {
        display: flex;
        margin: auto 0;
        .client_email {
          margin-left: .6rem
        }
      }
    }
  }
}

/* Floating Nav */
.wrapper--floating_nav {
  background-color: var(--fore);
  width: 14rem;
  height: 100%;
  transform: translateX(100%);
  position: fixed;
  right: 0;
  top: 0;
  padding: 2rem;
  z-index: 4;
  box-shadow: var(--low_shadow);
  transition: var(--transition_standard);
  &.openFloatingNav {
    transform: none
  }
  .floating_nav {
    display: grid;
    grid-gap: 2rem;
    text-align: right;
    a {
      text-align: right
    }
    .cursor {
      margin-left: auto
    }
    .icon--options {
      cursor: pointer;
      margin-left: auto
    }
    .client--options {
      display: grid;
      grid-gap: 1rem;
      a {
        margin-left: auto;
        svg {
          margin-left: .4rem
        }
      }
    }
  }
}

@media (max-width: 992px) {
  .wrapper--floating_nav .floating_nav {
    a {
      grid-template-columns: 1fr;
      transition: var(--transition_standard);
      &:active {
        transform: var(--active_state)
      }
      &:before {
        content: none
      }
    }
    .text--hideable {
      display: none
    }
  }
}
@media (max-width: 768px) {
  .client_home_top_grid {
    grid-template-columns: 1fr;
    .profile_image_placeholder,
    img {
      width: 100px;
      height: 100px;
      margin: auto
    }
    .client_info {
      input.client_info--name {
        font-size: 2rem
      }
    }
  }
}
@media (max-width: 576px) {
  .client_home_top_grid .client_info .client_info__options {
    display: block;
    .verify_button {
      width: 100%;
      margin-top: 1rem
    }
  }
}
</style>

<template>
  <div
    v-if="clientDetails"
    id="client"
    class="view_container"
  >
    <div :class="{ opened_sections: showToolkit }" class="section_overlay" />
    <div v-if="!showOptions" class="tab_option tab_option_small" aria-label="Menu" @click="showOptions = true">
      <inline-svg :src="require('../../assets/svg/options.svg')" aria-label="Options" />
      <p class="text">
        Options
      </p>
    </div>
    <div v-if="showToolkit" class="tab_overlay_content fadeIn delay fill_mode_both">
      <toolkit />
    </div>
    <div class="wrapper--floating_nav" :class="{ openFloatingNav: showOptions }">
      <div
        v-if="showOptions"
        class="floating_nav fadeIn"
      >
        <inline-svg
          class="close_icon not_fixed cursor"
          :src="require('../../assets/svg/close.svg')"
          aria-label="Close"
          @click="showOptions = false"
        />
        <div class="client--options">
          <a
            class="a_link"
            href="javascript:void(0)"
            @click="showToolkit = true, willBodyScroll(false), showOptions = false"
          >
            Toolkit
            <inline-svg :src="require('../../assets/svg/calculate.svg')" />
          </a>
          <a
            class="a_link"
            href="javascript:void(0)"
            @click="clientArchive($route.params.client_id), showOptions = false"
          >
            Archive Client
            <inline-svg :src="require('../../assets/svg/archive.svg')" />
          </a>
        </div>
      </div>
    </div>
    <div class="client_home_top_grid">
      <img v-if="clientDetails.profile_image" :src="clientDetails.profile_image" alt="Profile img">
      <inline-svg
        v-else
        class="profile_image_placeholder"
        :src="require('../../assets/svg/profile-image.svg')"
      />
      <div class="client_info">
        <input
          v-model="clientDetails.name"
          class="client_info--name text--large"
          type="text"
          aria-label="Client name"
          autocomplete="name"
          :disabled="silentLoading"
          @blur="updateClient()"
        >
        <input
          id="phone"
          v-model="clientDetails.number"
          class="input--forms allow_text_overflow"
          placeholder="Mobile"
          aria-label="Mobile"
          type="tel"
          inputmode="tel"
          autocomplete="tel"
          minlength="9"
          maxlength="14"
          pattern="\d+"
          :disabled="silentLoading"
          @blur="updateClient()"
        >
        <div v-if="!sessions" class="client_info__options">
          <div class="client_email_bar">
            <inline-svg :src="require('../../assets/svg/email.svg')" />
            <p class="client_email">
              {{ clientDetails.email }}
            </p>
          </div>
          <button
            v-if="clientAlreadyMsg === 'Restricted'"
            class="verify_button button"
            :disabled="clientAlready"
            @click="giveAccess()"
          >
            {{ clientAlreadyMsg }}
          </button>
          <button
            v-else-if="clientAlready && clientAlreadyMsg !== 'Loading...' && clientAlreadyMsg !== 'Error'"
            class="verify_button fadeIn"
            @click="clientDetails.notifications = clientDetails.notifications === 1 ? 0 : 1, updateClient()"
          >
            {{ clientDetails.notifications === 1 ? 'Disable' : 'Enable' }} email notifications
          </button>
          <button
            v-else
            class="verify_button button"
            :disabled="clientAlready"
            @click="giveAccess()"
          >
            {{ clientAlreadyMsg }}
          </button>
        </div>
      </div>
    </div>
    <transition enter-active-class="fadeIn fill_mode_both delay" leave-active-class="fadeOut fill_mode_both">
      <router-view :key="$route.fullPath" />
    </transition>
  </div>
</template>

<script>
import { mapState } from 'vuex'
const emailBuilder = require('../../components/js/email')
const Toolkit = () => import(/* webpackChunkName: "components.toolkit", webpackPrefetch: true  */ '../../components/Toolkit')
const CUSTOM_ENV = process.env.NODE_ENV === 'production' ? require('../../../config/prod.env') : require('../../../config/dev.env')

export default {
  metaInfo  () {
    return {
      title: this.clientDetails.name
    }
  },
  components: {
    Toolkit
  },
  data () {
    return {

      // BACKGROUND

      showOptions: false,
      showToolkit: false,

      // SESSIONS

      sessions: false,

      // CLIENT STATUS

      clientAlreadyMsg: 'Loading...',
      clientAlready: true,
      clientSuspend: null
    }
  },
  computed: mapState([
    'silentLoading',
    'clients',
    'clientDetails'
  ]),
  async created () {
    this.$store.commit('setData', {
      attr: 'loading',
      data: true
    })
    this.willBodyScroll(true)
    await this.$parent.setup()
    const CLIENT = this.clients.find(client => client.client_id === parseInt(this.$route.params.client_id))
    await this.$store.dispatch('getPlans', CLIENT.client_id)
    this.$store.commit('setData', {
      attr: 'clientDetails',
      data: CLIENT
    })
    this.$store.dispatch('endLoading')
  },
  methods: {

    // -----------------------------
    // OKTA CLIENT
    // -----------------------------

    /**
     * Checks if the client already exists on Okta.
     */
    async checkClient () {
      if (this.$parent.claims.email !== 'demo@traininblocks.com') {
        this.clientAlreadyMsg = 'Loading...'
        try {
          const RESULT = await this.$axios.post('/.netlify/functions/okta',
            {
              type: 'GET',
              url: `?filter=profile.email+eq+"${this.clientDetails.email}"&limit=1`
            }
          )
          if (RESULT.data.length > 0) {
            switch (RESULT.data[0].status) {
              case 'ACTIVE':
                this.clientAlready = true
                this.clientAlreadyMsg = 'User activated'
                break
              case 'PROVISIONED':
              case 'RECOVERY':
                this.clientAlready = false
                this.clientAlreadyMsg = 'Resend activation email'
                break
              case 'SUSPENDED':
                this.clientSuspend = RESULT.data[0].id
                this.clientAlready = false
                this.clientAlreadyMsg = 'Give Access'
                break
            }
          } else {
            this.clientAlready = false
            this.clientAlreadyMsg = 'Give Access'
          }
        } catch (e) {
          this.clientAlready = true
          this.clientAlreadyMsg = 'Error'
          this.$parent.resolveError(e)
        }
      } else {
        this.clientAlreadyMsg = 'Restricted'
      }
    },
    async giveAccess () {
      this.$store.commit('setData', {
        attr: 'dontLeave',
        data: true
      })
      try {
        if (this.clientAlreadyMsg === 'Resend activation email') {
          const OKTA_ONE = await this.$axios.post('/.netlify/functions/okta',
            {
              type: 'GET',
              url: `?filter=profile.email+eq+"${this.clientDetails.email}"&limit=1`
            }
          )
          const OKTA_TWO = await this.$axios.post('/.netlify/functions/okta',
            {
              type: 'POST',
              body: {},
              url: `${OKTA_ONE.data[0].id}/lifecycle/reactivate?sendEmail=false`
            }
          )
          await this.$axios.post('/.netlify/functions/send-email',
            {
              to: this.clientDetails.email,
              ...emailBuilder('activate-account', {
                link: OKTA_TWO.data.activationUrl.replace(CUSTOM_ENV.OKTA.ISSUER, 'https://auth.traininblocks.com')
              })
            }
          )
        } else if (this.clientSuspend) {
          await this.$axios.post('/.netlify/functions/okta',
            {
              type: 'POST',
              body: {},
              url: `${this.clientSuspend}/lifecycle/unsuspend`
            }
          )
          const PASSWORD = await this.$axios.post('/.netlify/functions/okta',
            {
              type: 'POST',
              body: {},
              url: `${this.clientSuspend}/lifecycle/reset_password?sendEmail=false`
            }
          )
          await this.$axios.post('/.netlify/functions/send-email',
            {
              to: this.clientDetails.email,
              ...emailBuilder('client-account-reactivated', {
                link: PASSWORD.data.resetPasswordUrl.replace(CUSTOM_ENV.OKTA.ISSUER, 'https://auth.traininblocks.com')
              })
            }
          )
        } else {
          const OKTA_ONE = await this.$axios.post('/.netlify/functions/okta',
            {
              type: 'POST',
              body: {
                profile: {
                  firstName: this.clientDetails.email,
                  email: this.clientDetails.email,
                  login: this.clientDetails.email,
                  ga: true,
                  client_id_db: this.clientDetails.client_id,
                  user_type: 'Client'
                },
                groupIds: [
                  '00gf929legrtSjxOe4x6'
                ]
              },
              url: '?activate=false'
            }
          )
          const OKTA_TWO = await this.$axios.post('/.netlify/functions/okta',
            {
              type: 'POST',
              body: {},
              url: `${OKTA_ONE.data.id}/lifecycle/activate?sendEmail=false`
            }
          )
          await this.$axios.post('/.netlify/functions/send-email',
            {
              to: this.clientDetails.email,
              ...emailBuilder('activate-account', {
                link: OKTA_TWO.data.activationUrl.replace(CUSTOM_ENV.OKTA.ISSUER, 'https://auth.traininblocks.com')
              })
            }
          )
        }
      } catch (e) {
        this.$parent.resolveError(e)
      }
      await this.checkClient()
      this.$parent.$refs.response_pop_up.show('An activation email was sent to your client', 'Please ask them to check their inbox', true, true)
      this.$store.dispatch('endLoading')
    },

    // -----------------------------
    // Database
    // -----------------------------

    /**
     * Updates the client.
     */
    async updateClient () {
      try {
        this.$store.commit('setData', {
          attr: 'silentLoading',
          data: true
        })
        this.$store.commit('setData', {
          attr: 'dontLeave',
          data: true
        })
        await this.$store.dispatch('updateClient')
        this.$store.dispatch('endLoading')
      } catch (e) {
        this.$parent.resolveError(e)
      }
    },

    /**
     * Archives the client.
     * @param {integer} clientId - The id of the client.
     */
    async clientArchive (clientId) {
      if (await this.$parent.$refs.confirm_pop_up.show('Are you sure that you want to archive/hide this client?', 'Their data will be stored, but it will be removed if deleted from the Archive.')) {
        try {
          this.$store.commit('setData', {
            attr: 'dontLeave',
            data: true
          })
          await this.$store.dispatch('clientArchive', clientId)
          this.$ga.event('Client', 'archive')
          this.$parent.$refs.response_pop_up.show('Client archived', 'Their data will be kept safe on the archive page')
          this.$store.dispatch('endLoading')
          this.$router.push('/')
        } catch (e) {
          this.$parent.resolveError(e)
        }
      }
    }
  }
}
</script>

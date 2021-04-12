<style>
  /* Client Info */
  .client_info {
    display: grid;
    grid-gap: 1rem
  }
  .client_email_bar {
    display: flex;
    margin: auto 0
  }
  .client_email {
    margin-left: .6rem
  }
  .client_info__more_details {
    display: grid;
    grid-gap: .6rem
  }
  .client_info__options {
    display: flex;
    justify-content: space-between
  }

  /* Floating Nav */
  .wrapper--floating_nav {
    background-color: var(--fore);
    width: 0;
    height: 100%;
    position: fixed;
    right: 0;
    top: 0;
    padding: 0;
    z-index: 4;
    box-shadow: var(--low_shadow);
    transition: var(--transition_standard)
  }
  .wrapper--floating_nav.openFloatingNav {
    width: 14rem;
    padding: 2rem
  }
  .floating_nav {
    display: grid;
    grid-gap: 2rem;
    text-align: right
  }
  .floating_nav a {
    text-align: right
  }
  .icon--options {
    cursor: pointer;
    margin-left: auto
  }
  .client--options {
    display: grid;
    grid-gap: 1rem
  }
  .client--options a {
    margin-left: auto
  }
  .client--options a svg {
    margin-left: .4rem
  }

  /* Client Notes */
  .client_notes--header {
    color: var(--base);
    padding: .6rem .8rem
  }

  /* Responsiveness */
  @media (max-width: 992px) {
    .floating_nav a {
      grid-template-columns: 1fr;
      transition: var(--transition_standard)
    }
    .floating_nav a:active {
      transform: scale(.9)
    }
    div.floating_nav a:before {
      content: none
    }
    .floating_nav .text--hideable {
      display: none
    }
  }
  @media (max-width: 768px) {
    #client .client_info input.client_info--name {
      font-size: 2rem
    }
    .client_info {
      width: 90vw
    }
  }
  @media (max-width: 576px) {
    .client_info__options {
      display: grid;
      grid-gap: 1rem;
      margin-top: 1rem
    }
  }
</style>

<template>
  <div v-if="$parent.client_details" id="client">
    <div :class="{ opened_sections: showToolkit }" class="section_overlay" />
    <div v-if="showToolkit" class="tab_overlay_content fadeIn delay fill_mode_both">
      <toolkit />
    </div>
    <div class="wrapper--floating_nav" :class="{ openFloatingNav: showOptions }">
      <div v-if="keepLoaded" class="floating_nav fadeIn">
        <div v-if="!showOptions" class="tab_option tab_option_small" aria-label="Menu" @click="showOptions = true">
          <inline-svg :src="require('../../assets/svg/options.svg')" aria-label="Options" />
          <p class="text">
            Options
          </p>
        </div>
        <inline-svg
          v-if="showOptions"
          class="icon--options fadeIn delay fill_mode_both"
          :src="require('../../assets/svg/close.svg')"
          aria-label="Close"
          @click="showOptions = false"
        />
        <div
          v-for="(clients, index) in $parent.clients"
          v-show="clients.client_id == $route.params.client_id && showOptions"
          :key="clients.client_id"
          class="client--options fadeIn delay fill_mode_both"
        >
          <a
            v-if="clients.client_id == $route.params.client_id && showOptions"
            class="a_link"
            href="javascript:void(0)"
            @click="showToolkit = true, will_body_scroll(false), showOptions = false"
          >
            Toolkit
            <inline-svg :src="require('../../assets/svg/calculate.svg')" />
          </a>
          <a
            v-if="clients.client_id == $route.params.client_id && showOptions"
            class="a_link"
            href="javascript:void(0)"
            @click="showOptions = false, $parent.client_archive(clients.client_id, index)"
          >
            Archive Client
            <inline-svg :src="require('../../assets/svg/archive.svg')" />
          </a>
        </div>
      </div>
    </div>
    <div v-if="!sessions" class="top_grid">
      <!-- Update the client details -->
      <div class="client_info">
        <input
          v-model="$parent.client_details.name"
          class="client_info--name text--large"
          type="text"
          aria-label="Client name"
          autocomplete="name"
          :disabled="$parent.silent_loading"
          @blur="$parent.update_client()"
        >
        <div class="client_info__more_details">
          <input
            id="phone"
            v-model="$parent.client_details.number"
            class="input--forms allow_text_overflow"
            placeholder="Mobile"
            aria-label="Mobile"
            type="tel"
            inputmode="tel"
            autocomplete="tel"
            minlength="9"
            maxlength="14"
            pattern="\d+"
            :disabled="$parent.silent_loading"
            @blur="$parent.update_client()"
          >
          <div class="client_info__options">
            <div class="client_email_bar">
              <inline-svg :src="require('../../assets/svg/email.svg')" />
              <p class="client_email">
                {{ $parent.client_details.email }}
              </p>
            </div>
            <button
              v-if="clientAlreadyMsg === 'Restricted'"
              class="button--verify button"
              :disabled="clientAlready"
              @click="create_client()"
            >
              {{ clientAlreadyMsg }}
            </button>
            <button
              v-else-if="clientAlready && clientAlreadyMsg !== 'Loading...' && clientAlreadyMsg !== 'Error'"
              class="button--verify fadeIn"
              @click="$parent.client_details.notifications = $parent.client_details.notifications === 1 ? 0 : 1, $parent.update_client()"
            >
              {{ $parent.client_details.notifications === 1 ? 'Disable' : 'Enable' }} email notifications
            </button>
            <button
              v-else
              class="button--verify button"
              :disabled="clientAlready"
              @click="create_client()"
            >
              {{ clientAlreadyMsg }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <transition enter-active-class="fadeIn fill_mode_both delay" leave-active-class="fadeOut fill_mode_both">
      <router-view :key="$route.fullPath" :other-data="$parent.client_details.plans" />
    </transition>
  </div>
</template>

<script>
import { email, emailText, resetEmail, resetEmailText } from '../../components/email'
const Toolkit = () => import(/* webpackChunkName: "components.toolkit", webpackPrefetch: true  */ '../../components/Toolkit')

export default {
  components: {
    Toolkit
  },
  data () {
    return {

      // BACKGROUND

      keepLoaded: false,
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
  async created () {
    this.loading = true
    this.will_body_scroll(true)
    await this.$parent.setup()
    await this.get_client_details()
    this.__init__()
    this.keepLoaded = true
    this.$parent.end_loading()
  },
  beforeDestroy () {
    this.keepLoaded = false
    this.$parent.client_details = null
  },
  methods: {

    // BACKGROUND

    __init__ () {
      let x
      for (x in this.$parent.clients) {
        // If client matches client in route
        if (this.$parent.clients[x].client_id === this.$route.params.client_id) {
          // Set client_details variable with client details
          this.$parent.client_details = this.$parent.clients[x]
        }
      }
    },

    // OKTA CLIENT

    async check_client () {
      if (this.$parent.claims.email !== 'demo@traininblocks.com') {
        this.clientAlreadyMsg = 'Loading...'
        try {
          const result = await this.$axios.post('/.netlify/functions/okta',
            {
              type: 'GET',
              url: `?filter=profile.email+eq+"${this.$parent.client_details.email}"&limit=1`
            }
          )
          if (result.data.length > 0) {
            switch (result.data[0].status) {
              case 'ACTIVE' || 'RECOVERY':
                this.clientAlready = true
                this.clientAlreadyMsg = 'User activated'
                break
              case 'PROVISIONED':
                this.clientAlready = false
                this.clientAlreadyMsg = 'Resend activation email'
                break
              case 'SUSPENDED':
                this.clientSuspend = result.data[0].id
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
          this.$parent.resolve_error(e)
        }
      } else {
        this.clientAlreadyMsg = 'Restricted'
      }
    },
    async create_client () {
      this.$parent.dontLeave = true
      try {
        if (this.clientAlreadyMsg === 'Resend activation email') {
          const oktaOne = await this.$axios.post('/.netlify/functions/okta',
            {
              type: 'GET',
              url: `?filter=profile.email+eq+"${this.$parent.client_details.email}"&limit=1`
            }
          )
          const oktaTwo = await this.$axios.post('/.netlify/functions/okta',
            {
              type: 'POST',
              body: {},
              url: `${oktaOne.data[0].id}/lifecycle/reactivate?sendEmail=false`
            }
          )
          await this.$axios.post('/.netlify/functions/send-email',
            {
              to: this.$parent.client_details.email,
              subject: 'Welcome to Train In Blocks',
              text: emailText(oktaTwo.data.activationUrl.replace(process.env.ISSUER, 'https://auth.traininblocks.com')),
              html: email(oktaTwo.data.activationUrl.replace(process.env.ISSUER, 'https://auth.traininblocks.com'))
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
          const password = await this.$axios.post('/.netlify/functions/okta',
            {
              type: 'POST',
              body: {},
              url: `${this.clientSuspend}/lifecycle/reset_password?sendEmail=false`
            }
          )
          await this.$axios.post('/.netlify/functions/send-email',
            {
              to: this.$parent.client_details.email,
              subject: 'Welcome Back to Train In Blocks',
              text: resetEmailText(password.data.resetPasswordUrl.replace(process.env.ISSUER, 'https://auth.traininblocks.com')),
              html: resetEmail(password.data.resetPasswordUrl.replace(process.env.ISSUER, 'https://auth.traininblocks.com'))
            }
          )
        } else {
          const oktaOne = await this.$axios.post('/.netlify/functions/okta',
            {
              type: 'POST',
              body: {
                profile: {
                  firstName: this.$parent.client_details.email,
                  email: this.$parent.client_details.email,
                  login: this.$parent.client_details.email,
                  ga: true,
                  client_id_db: this.$parent.client_details.client_id,
                  user_type: 'Client'
                },
                groupIds: [
                  '00gf929legrtSjxOe4x6'
                ]
              },
              url: '?activate=false'
            }
          )
          const oktaTwo = await this.$axios.post('/.netlify/functions/okta',
            {
              type: 'POST',
              body: {},
              url: `${oktaOne.data.id}/lifecycle/activate?sendEmail=false`
            }
          )
          await this.$axios.post('/.netlify/functions/send-email',
            {
              to: this.$parent.client_details.email,
              subject: 'Welcome to Train In Blocks',
              text: emailText(oktaTwo.data.activationUrl.replace(process.env.ISSUER, 'https://auth.traininblocks.com')),
              html: email(oktaTwo.data.activationUrl.replace(process.env.ISSUER, 'https://auth.traininblocks.com'))
            }
          )
        }
      } catch (e) {
        this.$parent.resolve_error(e)
      }
      await this.check_client()
      this.$parent.$refs.response_pop_up.show('An activation email was sent to your client', 'Please ask them to check their inbox and spam mail', true)
      this.$parent.end_loading()
    },

    // DATABASE

    async get_client_details (force) {
      this.$parent.loading = true
      try {
        const client = this.$parent.clients.find(client => client.client_id === parseInt(this.$route.params.client_id))
        this.$parent.client_details = client
        if (client.plans === undefined || !client.plans || force) {
          const response = await this.$axios.get(`https://api.traininblocks.com/programmes/${client.client_id}`)
          client.plans = response.data.length === 0 ? false : response.data
          localStorage.setItem('clients', JSON.stringify(this.$parent.clients))
        }
        if (client.plans !== false) {
          this.$parent.client_details.plans.forEach((plan) => {
            this.get_sessions(plan.id)
          })
        }
        this.$parent.end_loading()
      } catch (e) {
        this.$parent.resolve_error(e)
      }
    },
    async get_sessions (planId, force) {
      force = force || false
      try {
        const plan = this.$parent.client_details.plans.find(plan => plan.id === planId)
        if (plan.sessions === undefined || force) {
          const response = await this.$axios.get(`https://api.traininblocks.com/workouts/${plan.id}`)
          plan.sessions = response.data.length === 0 ? false : response.data
          localStorage.setItem('clients', JSON.stringify(this.$parent.clients))
        }
        this.$parent.end_loading()
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

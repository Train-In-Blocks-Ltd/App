<style>
  /* Client Info */
  .client_info {
    display: grid;
    grid-gap: 1rem
  }
  .client_email_bar {
    display: flex;
    margin-top: 1rem
  }
  .client_email {
    margin-left: .6rem
  }
  .client_info__more-details {
    display: grid;
    grid-gap: .6rem
  }
  .button--verify {
    width: fit-content
  }

  /* Floating Nav */
  .wrapper--floating_nav {
    background-color: #F4F4F4;
    width: 0;
    height: 100%;
    position: fixed;
    right: 0;
    top: 0;
    padding: 0;
    z-index: 4;
    box-shadow: 0 0 20px 10px #28282808;
    transition: all .6s cubic-bezier(.165, .84, .44, 1)
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
  .floating_nav a, .selected-options {
    color: #282828;
    text-decoration: none;
    transition: all .4s cubic-bezier(.165, .84, .44, 1)
  }
  .floating_nav a:hover, .selected-options:hover {
    opacity: .6
  }
  .icon--options {
    cursor: pointer;
    margin-left: auto
  }
  .client--options {
    display: grid;
    grid-gap: 1rem
  }
  .client--options a:hover {
    opacity: .6
  }

  /* Client Notes */
  .client_notes--header {
    color: #282828;
    padding: .6rem .8rem
  }

  /* Responsiveness */
  @media (max-width: 992px) {
    .floating_nav a {
      grid-template-columns: 1fr;
      transition: all .1s cubic-bezier(.165, .84, .44, 1)
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
      grid-gap: 0;
      width: 90vw
    }
  }
</style>

<template>
  <div v-if="$parent.client_details" id="client">
    <modal name="toolkit" height="100%" width="100%" :adaptive="true" :click-to-close="false">
      <toolkit />
    </modal>
    <div class="wrapper--floating_nav" :class="{ openFloatingNav: showOptions }">
      <div v-if="keepLoaded" class="floating_nav">
        <div v-if="!showOptions" class="icon_open--options" aria-label="Menu" @click="showOptions = true">
          <inline-svg :src="require('../../assets/svg/options.svg')" aria-label="Options" />
          <p class="text">
            Options
          </p>
        </div>
        <transition enter-active-class="animate animate__fadeIn animate__delay-1s animate__faster">
          <inline-svg v-if="showOptions" class="icon--options" :src="require('../../assets/svg/close.svg')" aria-label="Close" @click="showOptions = false" />
        </transition>
        <transition-group enter-active-class="animate animate__fadeIn animate__delay-1s animate__faster">
          <div v-for="(clients, index) in $parent.clients" v-show="clients.client_id == $route.params.client_id && showOptions" :key="clients.client_id" class="client--options">
            <a v-if="clients.client_id == $route.params.client_id && showOptions" href="javascript:void(0)" @click="$modal.show('toolkit')">Toolkit</a>
            <a v-if="showDeletePlan" href="javascript:void(0)" @click="delete_plan()">Delete Plan</a>
            <a v-if="clients.client_id == $route.params.client_id && showOptions" href="javascript:void(0)" @click="$parent.client_archive(clients.client_id, index)">Archive Client</a>
          </div>
        </transition-group>
      </div>
    </div>
    <div v-if="!sessions" class="top_grid">
      <!-- Update the client details -->
      <form class="client_info" @submit.prevent="$parent.update_client()">
        <input
          v-model="$parent.client_details.name"
          class="client_info--name text--large"
          type="text"
          aria-label="Client name"
          autocomplete="name"
          @blur="$parent.update_client()"
        >
        <div class="client_info__more-details">
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
            @blur="$parent.update_client()"
          >
          <div class="client_email_bar">
            <inline-svg :src="require('../../assets/svg/email.svg')" />
            <p class="client_email">
              {{ $parent.client_details.email }}
            </p>
          </div>
          <div>
            <button
              class="button--verify button"
              :disabled="clientAlready"
              @click="createClient()"
            >
              {{ clientAlreadyMsg }}
            </button>
            <button
              v-if="clientAlready && clientAlreadyMsg !== 'Loading...' && clientAlreadyMsg !== 'Error' && $parent.client_details.notifications === 1"
              class="button--verify"
              @click="$parent.client_details.notifications = 0, $parent.update_client()"
            >
              Disable email notifications
            </button>
            <button
              v-if="clientAlready && clientAlreadyMsg !== 'Loading...' && clientAlreadyMsg !== 'Error' && $parent.client_details.notifications === 0"
              class="button--verify"
              @click="$parent.client_details.notifications = 1, $parent.update_client()"
            >
              Enable email notifications
            </button>
          </div>
        </div>
      </form>
    </div>
    <transition enter-active-class="animate animate__fadeIn animate__delay-1s animate__faster" leave-active-class="animate animate__fadeOut animate__faster">
      <router-view :key="$route.fullPath" />
    </transition>
  </div>
</template>

<script>
import { email, emailText, resetEmail, resetEmailText } from '../../components/email'
const Toolkit = () => import(/* webpackChunkName: "components.toolkit", webpackPrefetch: true  */ '../../components/Toolkit')
const AlertModal = () => import(/* webpackChunkName: "components.alertmodal", webpackPrefetch: true  */ '../../components/AlertModal')

export default {
  components: {
    Toolkit
  },
  data () {
    return {
      // BACKGROUD DATA //
      keepLoaded: false,
      showOptions: false,
      no_plans: false,
      loading_plans: true,
      sessions: false,
      no_sessions: false,
      showDeletePlan: false,
      // CLIENT STATUS DATA //
      clientAlreadyMsg: 'Loading...',
      clientAlready: true,
      clientSuspend: null
    }
  },
  async created () {
    this.$parent.willBodyScroll(true)
    this.loading = true
    await this.$parent.setup()
    await this.get_client_details()
    this.created()
    this.keepLoaded = true
    this.$parent.end_loading()
  },
  beforeDestroy () {
    this.keepLoaded = false
    this.$parent.client_details = null
  },
  methods: {
    // BACKGROUND METHODS //-------------------------------------------------------------------------------
    created () {
      let x
      for (x in this.$parent.clients) {
        // If client matches client in route
        if (this.$parent.clients[x].client_id === this.$route.params.client_id) {
          // Set client_details variable with client details
          this.$parent.client_details = this.$parent.clients[x]
        }
      }
    },
    // DATABSE AND API METHODS //-------------------------------------------------------------------------------
    async checkClient () {
      this.clientAlreadyMsg = 'Loading...'
      try {
        const result = await this.$axios.post('/.netlify/functions/okta',
          {
            type: 'GET',
            url: `?filter=profile.email+eq+"${this.$parent.client_details.email}"&limit=1`
          }
        )
        if (result.data.length > 0) {
          if (result.data[0].status === 'ACTIVE' || result.data[0].status === 'RECOVERY') {
            this.clientAlready = true
            this.clientAlreadyMsg = 'User activated'
          } else if (result.data[0].status === 'PROVISIONED') {
            this.clientAlready = false
            this.clientAlreadyMsg = 'Resend activation email'
          } else if (result.data[0].status === 'SUSPENDED') {
            this.clientSuspend = result.data[0].id
            this.clientAlready = false
            this.clientAlreadyMsg = 'Give Access'
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
    },
    async createClient () {
      this.$parent.pause_loading = true
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
      await this.checkClient()
      this.$modal.show(
        AlertModal,
        { msg: 'An activation email was sent to your client.' },
        { height: '100%' },
        { width: '100%' },
        { adaptive: true },
        { clickToClose: false }
      )
      this.$parent.end_loading()
    },
    async get_sessions (force) {
      try {
        // Loop through plans
        let f
        for (f in this.$parent.client_details.plans) {
          // If plan matches plan in route
          if (this.$parent.client_details.plans[f].id === parseInt(this.$route.params.id)) {
            // If client_details.plans.sessions is set to false
            if (this.$parent.client_details.plans[f].sessions === false && !force) {
              this.no_sessions = true
            // If client_details.plans.sessions is not set then query the API
            } else if (!this.$parent.client_details.plans[f].sessions || force === true || this.$parent.claims.user_type === 'Admin') {
              const response = await this.$axios.get(`https://api.traininblocks.com/workouts/${this.$parent.client_details.plans[f].id}`)
              // If there are no sessions
              if (response.data.length === 0) {
                this.no_sessions = true
                this.$parent.client_details.plans[f].sessions = false
                // If there are sessions set the client_details to include sessions
              } else {
                this.no_sessions = false
                this.$parent.client_details.plans[f].sessions = response.data
              }
              // Sync client_details with clients
              // Loop through clients
              for (const y in this.$parent.clients) {
                // If client matches client in route
                if (this.$parent.clients[y].client_id === parseInt(this.$route.params.client_id)) {
                  this.$parent.clients[y] = this.$parent.client_details
                }
              }
              // Update the localstorage with the sessions
              localStorage.setItem('clients', JSON.stringify(this.$parent.clients))
            }
          }
        }
        this.$parent.end_loading()
      } catch (e) {
        this.$parent.resolve_error(e)
      }
    },
    async get_client_details (force) {
      this.$parent.loading = true
      try {
        // Loop through clients
        let x
        for (x in this.$parent.clients) {
          // If client matches client in route
          if (this.$parent.clients[x].client_id === parseInt(this.$route.params.client_id)) {
            // Set client_details variable with client details
            this.$parent.client_details = this.$parent.clients[x]
            // If client_details.plans is set to false
            if (this.$parent.clients[x].plans === false && !force) {
              this.no_plans = true
            // If client_details.plans is not set then query the API
            } else if (!this.$parent.clients[x].plans || force === true || this.$parent.claims.user_type === 'Admin') {
              const response = await this.$axios.get(`https://api.traininblocks.com/programmes/${this.$parent.clients[x].client_id}`)
              // If there are no plans
              if (response.data.length === 0) {
                this.no_plans = true
                this.$parent.clients[x].plans = false
                // If there are plans set the clients to include plans
              } else {
                this.no_plans = false
                this.$parent.clients[x].plans = response.data
                // Update the localstorage with the plans
                localStorage.setItem('clients', JSON.stringify(this.$parent.clients))
              }
            }
            this.$parent.client_details = this.$parent.clients[x]
            this.loading_plans = false
          }
        }
      } catch (e) {
        this.$parent.resolve_error(e)
      }
      await this.get_sessions()
    },
    async delete_plan () {
      if (confirm('Are you sure you want to delete this plan?')) {
        this.$parent.pause_loading = true
        this.$parent.dontLeave = true
        let plan
        let id
        for (plan of this.$parent.client_details.plans) {
          if (plan.id === parseInt(this.$route.params.id)) {
            id = plan.id
          }
        }
        try {
          await this.$axios.delete(`https://api.traininblocks.com/programmes/${id}`)
          await this.$parent.clients_f()
          this.$parent.clients_to_vue()
          this.$router.push({ path: `/client/${this.$parent.client_details.client_id}/` })
          this.$ga.event('Session', 'delete')
          this.$parent.end_loading()
        } catch (e) {
          this.$parent.resolve_error(e)
        }
      }
    }
  }
}
</script>

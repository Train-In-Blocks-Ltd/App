<style>
  #client {
    overflow-x: hidden;
    border-right: 6px solid #F4F4F4
  }

  /* Client Info */
  #client .client_info input:not([type='submit']), #duration {
    width: 100%;
    cursor: pointer;
    background-color: initial;
    border: 1px solid #28282840;
    padding: .6rem 1rem;
    border-radius: 3px;
    transition: .4s all cubic-bezier(.165, .84, .44, 1)
  }
  #client .client_info input:not([type='submit']):hover, #duration:hover, .session-date:hover {
    opacity: .6
  }
  #client .client_info input:not([type='submit']):focus, #duration:focus, .session-date:focus {
    opacity: 1;
    border: 1px solid #282828;
    padding: .6rem 1.4rem;
    cursor: text
  }
  .client_info__more-details {
    display: grid;
    grid-gap: .6rem
  }
  #client .client_info input.client_info--name {
    max-width: 100%;
    margin: 0 0 1rem 0
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
    box-shadow: 0 0 20px 10px #28282810;
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
    #client .client_info input:not([type='submit']):hover, #duration:hover {
      border-bottom: 2px solid #28282800
    }
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
  <div id="client" v-if="$parent.client_details">
    <modal name="toolkit" height="100%" width="100%" :adaptive="true" :clickToClose="false">
      <toolkit/>
    </modal>
    <div class="wrapper--floating_nav" :class="{ openFloatingNav: showOptions }">
      <div v-show="keepLoaded" class="floating_nav">
        <div class="icon--open-options" v-show="!showOptions" @click="showOptions = true" aria-label="Menu">
          <inline-svg :src="require('../../assets/svg/options.svg')" aria-label="Options"/>
          <p class="text">Options</p>
        </div>
        <transition enter-active-class="animate animate__fadeIn animate__delay-1s animate__faster">
          <inline-svg v-show="showOptions" @click="showOptions = false" class="icon--options" :src="require('../../assets/svg/close.svg')" aria-label="Close"/>
        </transition>
        <transition-group enter-active-class="animate animate__fadeIn animate__delay-1s animate__faster">
          <div class="client--options" v-for="(clients, index) in $parent.clients" :key="index" v-show="clients.client_id == $route.params.client_id && showOptions">
            <a v-show="clients.client_id == $route.params.client_id && showOptions" href="javascript:void(0)" @click="$modal.show('toolkit')">Toolkit</a>
            <a href="javascript:void(0)" v-show="showDeletePlan" @click="delete_plan()">Delete Plan</a>
            <a v-show="clients.client_id == $route.params.client_id && showOptions" href="javascript:void(0)" @click="$parent.client_archive(clients.client_id, index)">Archive Client</a>
          </div>
        </transition-group>
      </div>
    </div>
    <div class="top_grid" v-if="!sessions">
      <!-- Update the client details -->
      <form class="client_info" @submit.prevent="update_client()">
        <input class="client_info--name text--large" type="text" aria-label="Client name" autocomplete="name" v-model="$parent.client_details.name" @blur="update_client()"/>
        <div class="client_info__more-details">
          <input class="input--forms allow-text-overflow" placeholder="Email" aria-label="Email" type="email" autocomplete="email" v-model="$parent.client_details.email" @blur="update_client()"/>
          <input class="input--forms allow-text-overflow" placeholder="Mobile" aria-label="Mobile" type="tel" inputmode="tel" autocomplete="tel" v-model="$parent.client_details.number" @blur="update_client()" minlength="9" maxlength="14" pattern="\d+" id="phone"/>
          <div>
            <button
              @click="createClient()" class="button--verify button"
              :disabled="clientAlready"
            >
              {{ clientAlreadyMsg }}
            </button>
            <button
              @click="$parent.client_details.notifications = 0, update_client()"
              v-if="clientAlready && clientAlreadyMsg !== 'Loading...'"
              class="button--verify button"
            >
              Disable email notifications
            </button>
            <button
              @click="$parent.client_details.notifications = 1, update_client()"
              v-if="!clientAlready && clientAlreadyMsg !== 'Loading...' && clientAlreadyMsg !== 'Give Access'"
              class="button--verify button"
            >
              Enable email notifications
            </button>
          </div>
        </div>
      </form>
    </div>
    <transition enter-active-class="animate animate__fadeIn animate__delay-1s animate__faster" leave-active-class="animate animate__fadeOut animate__faster">
      <router-view :key="$route.fullPath"></router-view>
    </transition>
  </div>
</template>

<script>
  import axios from 'axios'
  import InlineSvg from 'vue-inline-svg'
  import {email, emailText, resetEmail, resetEmailText} from '../../components/email'
  import Toolkit from '../../components/Toolkit'
  import AlertModal from '../../components/alertModal'

  export default {
    components: {
      InlineSvg,
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
      this.$parent.splashed = true
      this.loading = true
      this.created()
      await this.$parent.setup()
      await this.get_client_details()
      this.keepLoaded = true
      this.loading = false
    },
    beforeDestroy () {
      this.keepLoaded = false
      this.$parent.client_details = null
    },
    methods: {

      // BACKGROUND METHODS //-------------------------------------------------------------------------------

      created () {
        var x
        for (x in this.$parent.clients) {
          // If client matches client in route
          if (this.$parent.clients[x].client_id === this.$route.params.client_id) {
            // Set client_details variable with client details
            this.$parent.client_details = this.$parent.clients[x]
          }
        }
      },
      toURL () {
        var url = '/'
        if (window.location.href.includes('session') === true) {
          url = `/client/${this.$route.params.client_id}/`
        }
        return url
      },

      // DATABSE AND API METHODS //-------------------------------------------------------------------------------

      async checkClient () {
        try {
          const result = await axios.post('/.netlify/functions/okta',
            {
              type: 'GET',
              url: `?filter=profile.email+eq+"${this.$parent.client_details.email}"&limit=1`
            }
          )
          if (result.data[0].status === 'ACTIVE' || result.data[0].status === 'PROVISIONED') {
            this.clientAlready = true
            this.clientAlreadyMsg = 'Email Sent'
          } else if (result.data[0].status === 'SUSPENDED') {
            this.clientSuspend = result.data[0].id
            this.clientAlready = false
            this.clientAlreadyMsg = 'Give Access'
          }
        } catch (e) {
          this.clientAlready = false
          this.clientAlreadyMsg = 'Give Access'
        }
      },
      async createClient () {
        this.$parent.loading = true
        this.$parent.dontLeave = true
        if (this.clientSuspend) {
          await axios.post('/.netlify/functions/okta',
            {
              type: 'POST',
              body: {},
              url: `${this.clientSuspend}/lifecycle/unsuspend`
            }
          )
          const password = await axios.post('/.netlify/functions/okta',
            {
              type: 'POST',
              body: {},
              url: `${this.clientSuspend}/lifecycle/reset_password?sendEmail=false`
            }
          )
          await axios.post('/.netlify/functions/send-email',
            {
              'to': this.$parent.client_details.email,
              'subject': 'Welcome Back to Train In Blocks',
              'text': resetEmailText(password.data.resetPasswordUrl.replace(process.env.ISSUER, 'https://auth.traininblocks.com')),
              'html': resetEmail(password.data.resetPasswordUrl.replace(process.env.ISSUER, 'https://auth.traininblocks.com'))
            }
          )
          this.$modal.show(
            AlertModal,
            { msg: 'An activation email was sent to your client.' },
            { adaptive: true },
            { clickToClose: false }
          )
          this.checkClient()
          this.$parent.loading = false
          this.$parent.dontLeave = false
        } else {
          try {
            const oktaOne = await axios.post('/.netlify/functions/okta',
              {
                type: 'POST',
                body: {
                  'profile': {
                    'firstName': this.$parent.client_details.email,
                    'email': this.$parent.client_details.email,
                    'login': this.$parent.client_details.email,
                    'ga': true,
                    'client_id_db': this.$parent.client_details.client_id,
                    'user_type': 'Client'
                  },
                  'groupIds': [
                    '00gf929legrtSjxOe4x6'
                  ]
                },
                url: `?activate=false`
              }
            )
            const oktaTwo = await axios.post('/.netlify/functions/okta',
              {
                type: 'POST',
                body: {},
                url: `${oktaOne.data.id}/lifecycle/activate?sendEmail=false`
              }
            )
            await axios.post('/.netlify/functions/send-email',
              {
                'to': this.$parent.client_details.email,
                'subject': 'Welcome to Train In Blocks',
                'text': emailText(oktaTwo.data.activationUrl.replace(process.env.ISSUER, 'https://auth.traininblocks.com')),
                'html': email(oktaTwo.data.activationUrl.replace(process.env.ISSUER, 'https://auth.traininblocks.com'))
              }
            )
            this.$modal.show(
              AlertModal,
              {msg: 'An activation email was sent to your client.'},
              { height: '100%' },
              { width: '100%' },
              { adaptive: true },
              { clickToClose: false }
            )
            this.checkClient()
            this.$parent.loading = false
            this.$parent.dontLeave = false
          } catch (e) {
            this.$parent.loading = false
            this.$parent.dontLeave = false
            this.$parent.errorMsg = e
            this.$parent.$modal.show('error')
            this.$parent.willBodyScroll(false)
            console.error(e)
          }
        }
      },
      async get_sessions (force) {
        try {
          // Loop through plans
          var f
          for (f in this.$parent.client_details.plans) {
            // If plan matches plan in route
            if (this.$parent.client_details.plans[f].id === parseInt(this.$route.params.id)) {
              // If client_details.plans.sessions is set to false
              if (this.$parent.client_details.plans[f].sessions === false && !force) {
                this.no_sessions = true
              // If client_details.plans.sessions is not set then query the API
              } else if (!this.$parent.client_details.plans[f].sessions || force === true) {
                const response = await axios.get(`https://api.traininblocks.com/workouts/${this.$parent.client_details.plans[f].id}`)
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
                // eslint-disable-next-line
                for (var y in this.$parent.clients) {
                  // If client matches client in route
                  if (this.$parent.clients[f].client_id === parseInt(this.$route.params.client_id)) {
                    this.$parent.clients[f] = this.$parent.client_details
                  }
                }
                // Update the localstorage with the sessions
                localStorage.setItem('clients', JSON.stringify(this.$parent.clients))
              }
            }
          }
          this.$parent.loading = false
        } catch (e) {
          this.$parent.loading = false
          this.$parent.errorMsg = e
          this.$parent.$modal.show('error')
          this.$parent.willBodyScroll(false)
          console.error(e)
        }
      },
      async get_client_details (force) {
        try {
          // Loop through clients
          var x
          for (x in this.$parent.clients) {
            // If client matches client in route
            if (this.$parent.clients[x].client_id === parseInt(this.$route.params.client_id)) {
              // Set client_details variable with client details
              this.$parent.client_details = this.$parent.clients[x]
              // If client_details.plans is set to false
              if (this.$parent.clients[x].plans === false && !force) {
                this.no_plans = true
              // If client_details.plans is not set then query the API
              } else if (!this.$parent.clients[x].plans || force === true) {
                const response = await axios.get(`https://api.traininblocks.com/programmes/${this.$parent.clients[x].client_id}`)
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
          this.$parent.loading = false
          this.$parent.errorMsg = e
          this.$parent.$modal.show('error')
          this.$parent.willBodyScroll(false)
          console.error(e)
        }
        await this.get_sessions()
      },
      async update_client () {
        this.$parent.dontLeave = true
        try {
          await axios.post(`https://api.traininblocks.com/clients`,
            {
              'id': this.$parent.client_details.client_id,
              'name': this.$parent.client_details.name,
              'email': this.$parent.client_details.email,
              'number': this.$parent.client_details.number,
              'notes': this.$parent.client_details.notes
            }
          )
          // Get the client information again as we have just updated the client
          await this.$parent.clients_f()
          await this.$parent.clients_to_vue()
          this.$parent.dontLeave = false
        } catch (e) {
          this.$parent.loading = false
          this.$parent.dontLeave = false
          this.$parent.errorMsg = e
          this.$parent.$modal.show('error')
          this.$parent.willBodyScroll(false)
          console.error(e)
        }
      },
      async delete_plan () {
        if (confirm('Are you sure you want to delete this plan?')) {
          this.$parent.loading = true
          this.$parent.dontLeave = true
          var plan
          var id
          for (plan of this.$parent.client_details.plans) {
            if (plan.id === parseInt(this.$route.params.id)) {
              id = plan.id
            }
          }
          try {
            await axios.delete(`https://api.traininblocks.com/programmes/${id}`)

            await this.$parent.clients_f()
            this.$parent.clients_to_vue()

            this.$router.push({path: `/client/${this.$parent.client_details.client_id}/`})

            this.$ga.event('Session', 'delete')
            this.$parent.loading = false
            this.$parent.dontLeave = false
          } catch (e) {
            this.$parent.loading = false
            this.$parent.dontLeave = false
            this.$parent.errorMsg = e
            this.$parent.$modal.show('error')
            this.$parent.willBodyScroll(false)
            console.error(e)
          }
        }
      }
    }
  }
</script>
<style lang="scss">
#okta-signin-container {
  position: relative;
  #okta-sign-in {
    outline: none;
    margin-left: 0;
    #okta-signin-submit {
      outline: none;
      -moz-appearance: none;
      -webkit-appearance: none;
      position: absolute;
      user-select: none;
      cursor: pointer;
      border-radius: 5px;
      opacity: 1;
      text-transform: capitalize;
      border: none;
      padding: .6rem 1.6rem;
      font-size: .8rem;
      color: white;
      background-color: var(--base);
      margin: .6rem 0;
      transition: opacity .2s, transform .1s cubic-bezier(.165, .84, .44, 1);
      &:hover {
        opacity: var(--light_opacity)
      }
      &:active {
        transform: var(--active_state)
      }
      &:focus {
        box-shadow: 0 0 0 4px rgba(76, 91, 106, .5)
      }
    }
  }
}
.o-form-button-bar {
  margin-top: 1.25rem
}
.okta-form-title {
  display: none
}
.auth-org-logo {
  margin: 2rem 0
}
.auth-org-logo.logo > path {
  fill: var(--base)
}
.okta-form-label {
  text-align: left
}
#okta-signin-username, #okta-signin-password {
  margin: .8rem 0;
  font-size: 1rem;
  border-radius: 5px
}
.okta-form-input-error {
  width: 100%;
  color: #EB5757;
  margin-top: .4rem;
  margin-bottom: 1.4rem;
  font-size: .75rem;
  text-align: left
}
.o-form-input-name-remember {
  text-align: left;
  font-size: .9rem
}
.o-form-fieldset-container {
  display: grid;
  grid-gap: 1.5rem;
  margin: 2rem 0
}
.custom-checkbox {
  label {
    padding-left: 4px
  }
  &:after {
    content: 'Please remember to manually logout if this is a shared computer.';
    display: block;
    margin-top: .5rem;
    font-size: .75rem;
    padding-left: calc(4px + 13px + 4px + 3px)
  }
}

@media (max-width: 576px) {
  .okta-form-label {
    font-size: 1.5rem
  }
  #okta-signin-username, #okta-signin-password {
    font-size: .9rem
  }
}
.auth-footer {
  display: none
}
</style>

<style lang="scss" scoped>
a {
  font-weight: bold;
  text-decoration: none;
  color: var(--base);
  transition: var(--transition_standard);
  &:hover {
    opacity: var(--light_opacity)
  }
}
#login {
  text-align: left;
  margin: auto;
  padding: 6rem 4rem;
  width: 550px;
  .other_options {
    display: grid;
    grid-gap: 1rem;
    margin-top: 4rem;
    .error {
      color: red
    }
  }
  .cookies {
    font-size: .75rem;
    margin: 2rem 0
  }
  .recovery {
    margin-top: 4rem;
    margin-bottom: 1rem;
    .recover_password {
      margin: .8rem 0
    }
  }
}

@media (max-width: 576px) {
  a:hover {
    opacity: 1
  }
  #login {
    width: 100%;
    padding: 1.6rem;
    height: 100%;
    overflow-y: auto
  }
  .cookies {
    margin-left: 0;
    margin-right: 0
  }
}
</style>

<template>
  <div v-if="!authenticated" id="login">
    <splash v-if="!splashed" />
    <inline-svg :src="require('../assets/svg/full-logo.svg')" class="auth-org-logo" />
    <div>
      <a href="javascript:void(0)" @click="showDemo = !showDemo">
        <b>{{ showDemo ? 'Hide' : 'Show demo account details' }} </b>
      </a>
    </div>
    <div v-if="showDemo" class="demo_details">
      <div class="info">
        demo@traininblocks.com
      </div>
      <div class="info">
        testingaccount123
      </div>
    </div>
    <div id="okta-signin-container" />
    <form v-if="open" class="recovery" @submit.prevent="reset">
      <label>
        <p>Email:</p>
        <input
          v-model="email"
          type="email"
          class="recover_password small_border_radius"
          autofocus
        >
      </label>
      <button type="submit">
        Send recovery email
      </button>
    </form>
    <div class="other_options">
      <div>
        <p v-if="success">
          {{ success }}
        </p>
        <p v-if="error" class="error">
          {{ error }}
        </p>
      </div>
      <p>
        Need an account?
        <a href="https://traininblocks.com/#pricing">
          Sign up here
        </a>
      </p>
      <p v-if="!open">
        Forgot your password?
        <a href="javascript:(0)" @click="open = !open">
          Reset it here
        </a>
      </p>
    </div>
    <p class="cookies">
      By logging in and using this application you agree that essential first-party cookies will be placed on your computer. Non-essential third party cookies may also be placed but can be opted out of from your account page. For more information please read our <a href="https://traininblocks.com/legal/cookies-policy/">Cookie Policy</a>.
    </p>
    <div class="version">
      <inline-svg :src="require('../assets/svg/andromeda-icon.svg')" aria-label="Andromeda" />
      <p class="text--tiny">
        <b>{{ versionName }} {{ versionBuild }}</b>
      </p>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Splash from '../components/Splash'
const CUSTOM_ENV = process.env.NODE_ENV === 'production' ? require('../../config/prod.env') : require('../../config/dev.env')

export default {
  components: {
    Splash
  },
  data () {
    return {
      showDemo: false,
      splashed: false,
      open: false,
      email: null,
      id: null,
      error: null,
      success: null
    }
  },
  computed: mapState([
    'authenticated',
    'versionName',
    'versionBuild'
  ]),
  async mounted () {
    const scopes = ['openid', 'profile', 'email']
    let OktaSignIn
    await import(/* webpackChunkName: "okta.signin", webpackPreload: true  */ '@okta/okta-signin-widget/dist/js/okta-sign-in.no-polyfill.min.js').then((module) => {
      OktaSignIn = module.default
    })
    this.splashed = true
    this.willBodyScroll(true)
    this.$nextTick(function () {
      this.widget = new OktaSignIn({
        baseUrl: CUSTOM_ENV.OKTA.CLIENT_ID,
        issuer: CUSTOM_ENV.OKTA.ISSUER + '/oauth2/default',
        clientId: CUSTOM_ENV.OKTA.CLIENT_ID,
        redirectUri: window.location.host === 'localhost:8080' ? 'http://' + window.location.host + '/implicit/callback' : 'https://' + window.location.host + '/implicit/callback',
        i18n: {
          en: {
            'primaryauth.title': '',
            'primaryauth.username.placeholder': 'Email',
            'primaryauth.username.tooltip': 'Enter your email',
            'primaryauth.password.placeholder': 'Password',
            'primaryauth.password.tooltip': 'Enter your password',
            'error.username.required': 'Please enter your email',
            'errors.E0000004': 'That didn\'t work. Was your password correct?'
          }
        },
        authParams: {
          pkce: true,
          display: 'page',
          issuer: CUSTOM_ENV.OKTA.ISSUER + '/oauth2/default',
          scopes,
          tokenManager: {
            autoRenew: true,
            expireEarlySeconds: 120
          }
        }
      })
      const self = this
      this.widget.showSignInToGetTokens({
        el: '#okta-signin-container',
        scopes
      }).then(async (tokens) => {
        self.splashed = false
        await this.$auth.handleLoginRedirect(tokens)
      }).catch((err) => {
        throw err
      })
    })
    if (await this.$auth.isAuthenticated()) {
      this.$router.push('/')
    } else {
      const cookies = document.cookie.split(';')
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i]
        const eqPos = cookie.indexOf('=')
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie
        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT'
      }
    }
  },
  async beforeDestroy () {
    await this.$parent.isAuthenticated()
    await this.$parent.setup()
    if (this.$ga && !this.authenticated) {
      this.$ga.event('Auth', 'login')
    }
  },
  methods: {

    // -----------------------------
    // General
    // -----------------------------

    /**
     * Resets the app state.
     */
    async reset () {
      this.$store.commit('setData', {
        attr: 'dontLeave',
        data: true
      })
      this.error = null
      this.success = null
      try {
        await this.$axios.post('/.netlify/functions/reset-password',
          {
            email: this.email
          }
        )
        this.open = false
        this.email = null
        this.success = 'An email has been sent successfully.'
        this.$store.dispatch('endLoading')
      } catch (e) {
        this.$store.dispatch('endLoading')
        this.error = 'An error occurred. Are you sure your email is correct?'
        console.error(e)
      }
    }
  }
}
</script>

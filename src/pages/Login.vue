<style scoped>
  a {
    text-decoration: none;
    color: #282828
  }
  #login {
    text-align: left;
    margin: auto;
    padding: 6rem 4rem;
    width: 550px
  }
  .cookies {
    font-size: .75rem;
    margin: 2rem 0
  }
  @media (max-width: 520px) {
    #login {
      width: 100%;
      padding: 2rem;
      height: 100%;
      overflow-y: auto
    }
    .cookies {
      margin-left: 0;
      margin-right: 0
    }
  }
  .error {
    color: red
  }
  .button--container {
    margin-top: 1.25rem
  }
  .signup {
    margin-left: calc(20px + 60px + 20px);
    margin-top: .6rem;
    margin-bottom: .6rem
  }
  .recovery {
    margin-top: 1.25rem
  }
  .recover_password {
    margin: .8rem 0
  }
</style>
<style>
  #okta-signin-submit {
    position: absolute;
    user-select: none;
    cursor: pointer;
    border-radius: 5px;
    opacity: 1;
    text-transform: capitalize;
    outline-width: 0;
    border: none;
    padding: .6rem 1.6rem;
    font-size: .8rem;
    color: white;
    background-color: #282828;
    margin: .6rem 0;
    transition: opacity .2s, transform .1s cubic-bezier(.165, .84, .44, 1)
  }
  #okta-signin-submit:hover {
    opacity: .6
  }
  #okta-signin-submit:active {
    transform: scale(.96)
  }
  #okta-signin-submit:focus {
    box-shadow: 0 0 0 4px rgba(76, 91, 106, .5)
  }
  #okta-signin-container {
    position: relative
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
    fill: #282828
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
  .custom-checkbox label {
    padding-left: 4px
  }
  .custom-checkbox:after {
    content: 'Please remember to manually logout if this is a shared computer.';
    display: block;
    margin-top: .5rem;
    font-size: .75rem;
    padding-left: calc(4px + 13px + 4px + 3px)
  }
  @media (max-width: 520px) {
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

<template>
  <div v-if="!this.$parent.authenticated" id="login">
    <inline-svg :src="require('../assets/svg/full-logo.svg')" class="auth-org-logo" />
    <div id="okta-signin-container" />
    <div class="button--container">
      <form action="https://traininblocks.com">
        <button class="signup" type="submit">
          Sign Up
        </button>
      </form>
      <div>
        <button v-if="!open" @click="open = !open">
          Forgot password?
        </button>
      </div>
    </div>
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
    <p v-if="success">
      {{ success }}
    </p>
    <p v-if="error" class="error">
      {{ error }}
    </p>
    <p class="cookies">
      By logging in and using this application you agree that essential first-party cookies will be placed on your computer. Non-essential third party cookies may also be placed but can be opted out of from your account page. For more information please read our <a href="https://traininblocks.com/cookie-policy">Cookie Policy</a>.
    </p>
    <p class="text--tiny">
      <b>{{ $parent.versionName }} {{ $parent.versionBuild }}</b>
    </p>
  </div>
</template>

<script>
export default {
  data () {
    return {
      open: false,
      email: null,
      id: null,
      error: null,
      success: null
    }
  },
  async mounted () {
    this.$parent.pause_loading = true
    let OktaSignIn
    await import(/* webpackChunkName: "okta.signin", webpackPreload: true  */ '@okta/okta-signin-widget/dist/js/okta-sign-in.no-polyfill.min.js').then((module) => {
      OktaSignIn = module.default
    })
    this.$nextTick(function () {
      this.widget = new OktaSignIn({
        baseUrl: process.env.ISSUER,
        issuer: process.env.ISSUER + '/oauth2/default',
        clientId: process.env.CLIENT_ID,
        redirectUri: process.env.NODE_ENV === 'production' ? 'https://' + window.location.host + '/implicit/callback' : 'http://' + window.location.host + '/implicit/callback',
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
          issuer: process.env.ISSUER + '/oauth2/default',
          scopes: ['openid', 'profile', 'email']
        }
      })

      this.widget.renderEl(
        { el: '#okta-signin-container' },
        () => {
          /**
           * In this flow, the success handler will not be called because we redirect
           * to the Okta org for the authentication workflow.
           */
        },
        (err) => {
          throw err
        }
      )
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
    this.$parent.willBodyScroll(true)
    this.$parent.end_loading()
  },
  async beforeDestroy () {
    await this.$parent.isAuthenticated()
    await this.$parent.setup()
    await this.$parent.clients_f()
    if (this.$ga && !this.$parent.authenticated) {
      this.$ga.event('Auth', 'login')
    }
  },
  destroyed () {
    // Remove the widget from the DOM on path change
    this.widget.remove()
  },
  methods: {
    async reset () {
      this.$parent.pause_loading = true
      this.$parent.dontLeave = true
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
        this.$parent.end_loading()
      } catch (e) {
        this.$parent.end_loading()
        this.error = 'An error occurred. Are you sure your email is correct?'
        console.error(e)
      }
    }
  }
}
</script>

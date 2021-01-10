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
  .input--forms.email-recovery {
    width: 70%
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
    margin-left: calc(20px + 60px + 20px)
  }
  .recovery {
    margin-top: 1.25rem;
    margin-left: 4px
  }
  .input--forms {
    outline-width: 0;
    width: 95%;
    margin: .8rem 0;
    padding: .6rem 0;
    font-size: 1rem;
    font-family: Arial, Helvetica, sans-serif;
    border: none;
    border-bottom: 1px solid #282828;
    transition: width 1s;
    transition-timing-function: cubic-bezier(.075, .82, .165, 1)
  }
  .input--forms:focus, .input--forms:hover {
    width: 100%
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
    outline-width: 0;
    width: 95%;
    margin: .8rem 0;
    padding: .6rem 0;
    font-size: 1rem;
    font-family: Arial, Helvetica, sans-serif;
    border: none;
    border-bottom: 1px solid #282828;
    transition: width 1s;
    transition-timing-function: cubic-bezier(.075, .82, .165, 1)
  }
  #okta-signin-username:hover, #okta-signin-password:hover, #okta-signin-username:focus, #okta-signin-password:focus {
    width: 100%
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
  <div id="login" v-if="!this.$parent.authenticated">
    <inline-svg :src="require('../assets/svg/full-logo.svg')" class="auth-org-logo"/>
    <div id="okta-signin-container" />
    <div class="button--container">
      <form action="https://traininblocks.com">
        <button class="signup" type="submit">Sign Up</button>
      </form>
      <div><button v-if="!open" @click="open = !open">Forgot password?</button></div>
    </div>
    <form v-if="open" v-on:submit.prevent="reset" class="recovery">
      <label>
        <p><b>Email:</b></p>
        <input type="email" v-model="email" class="input--forms" autofocus/>
      </label>
      <button type="submit">Send recovery email</button>
    </form>
    <p v-if="success">{{success}}</p>
    <p v-if="error" class="error">{{error}}</p>
    <p class="cookies">By logging in and using this application you agree that essential first-party cookies will be placed on your computer. Non-essential third party cookies may also be placed but can be opted out of from your account page. For more information please read our <a href="https://traininblocks.com/cookie-policy">Cookie Policy</a>.</p>
    <p style="font-size: .8rem"><b>Draco 2.2</b></p>
  </div>
</template>

<script>
import OktaSignIn from '@okta/okta-signin-widget'
import InlineSvg from 'vue-inline-svg'
import axios from 'axios'

export default {
  components: {
    InlineSvg
  },
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
      localStorage.clear()
      var cookies = document.cookie.split(';')
      for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i]
        var eqPos = cookie.indexOf('=')
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie
        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT'
      }
    }
  },
  methods: {
    async reset () {
      this.$parent.pause_loading = true
      this.$parent.dontLeave = true
      this.error = null
      this.success = null
      try {
        await axios.post('/.netlify/functions/reset-password',
          {
            email: this.email
          }
        )
        this.open = false
        this.email = null
        this.success = 'An email has been sent successfully.'
        this.$parent.pause_loading = false
        this.$parent.dontLeave = false
      } catch (e) {
        this.$parent.pause_loading = false
        this.$parent.dontLeave = false
        this.error = 'An error occurred. Are you sure your email is correct?'
        console.error(e)
      }
    }
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
  }
}
</script>

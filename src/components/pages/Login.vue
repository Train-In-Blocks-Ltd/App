<style scoped>
  a {
    font-weight: bold;
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
      overflow-y: auto;
      overflow-x: hidden
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
    margin-left: calc(10px + 20px + 60px + 20px + 10px)
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
    letter-spacing: .1rem;
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
    border-radius: 3px;
    opacity: 1;
    text-transform: capitalize;
    outline-width: 0;
    border: none;
    padding: .6rem 1.6rem;
    font-size: .8rem;
    letter-spacing: .1rem;
    font-weight: bold;
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
    font-weight: bold;
    text-align: left;
    letter-spacing: .1rem
  }
  #okta-signin-username, #okta-signin-password {
    outline-width: 0;
    width: 95%;
    margin: .8rem 0;
    padding: .6rem 0;
    font-size: 1rem;
    font-family: Arial, Helvetica, sans-serif;
    letter-spacing: .1rem;
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
    grid-gap: 1.5rem
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
    <inline-svg :src="require('../../assets/svg/full-logo.svg')" class="auth-org-logo"/>
    <div id="okta-signin-container"></div>
    <div class="button--container">
      <form action="https://traininblocks.com/pricing">
        <button class="signup" type="submit">Sign Up</button>
      </form>
      <div><button v-if="!open" @click="open = !open">Forgot password?</button></div>
    </div>
    <form v-if="open" v-on:submit.prevent="reset" class="recovery">
      <label>
        <p><b>Email:</b></p>
        <input type="email" v-model="email" class="input--forms" />
      </label>
      <button type="submit">Send recovery email</button>
    </form>
    <p v-if="success">{{success}}</p>
    <p v-if="error" class="error">{{error}}</p>
    <p class="cookies">By logging in and using this application you agree that essential first-party cookies will be placed on your computer. Non-essential third party cookies may also be placed but can be opted out of from your account page. For more information please read our <a href="https://traininblocks.com/cookie-policy">Cookie Policy</a>.</p>
    <p style="font-size: .8rem"><b>Version 1.4</b></p>
  </div>
</template>

<script>
import OktaSignIn from '@okta/okta-signin-widget'
import InlineSvg from 'vue-inline-svg'
import axios from 'axios'
import {passEmail, passEmailText} from '../components/email'

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
  mounted () {
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
  },
  methods: {
    async reset () {
      this.$parent.loading = true
      this.$parent.dontLeave = true
      try {
        const oktaOne = await axios.get(`https://cors-anywhere.herokuapp.com/${process.env.ISSUER}/api/v1/users?filter=profile.email+eq+"${this.email}"&limit=1`,
          {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': process.env.AUTH_HEADER
            }
          }
        )
        this.id = oktaOne.data[0].id
        const response = await axios.post(`https://cors-anywhere.herokuapp.com/${process.env.ISSUER}/api/v1/users/${this.id}/lifecycle/reset_password?sendEmail=false`,
          {},
          {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': process.env.AUTH_HEADER
            }
          }
        )
        await axios.post('https://cors-anywhere.herokuapp.com/https://api.sendgrid.com/v3/mail/send',
          {
            'personalizations': [
              {
                'to': [
                  {
                    'email': this.email
                  }
                ],
                'subject': 'Password Reset'
              }
            ],
            'from': {
              'email': 'Train In Blocks <no-reply@traininblocks.com>'
            },
            'content': [
              {
                'type': 'text/plain',
                'value': passEmailText(response.data.resetPasswordUrl.replace(process.env.ISSUER, 'https://auth.traininblocks.com'))
              },
              {
                'type': 'text/html',
                'value': passEmail(response.data.resetPasswordUrl.replace(process.env.ISSUER, 'https://auth.traininblocks.com'))
              }
            ]
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': process.env.SENDGRID
            }
          }
        )
        this.open = false
        this.email = null
        this.success = 'An email has been sent.'
        this.$parent.loading = false
        this.$parent.dontLeave = false
      } catch (e) {
        this.$parent.loading = false
        this.$parent.dontLeave = false
        this.error = 'An error occurred. Please try again...'
        console.error(e)
      }
    }
  },
  async beforeDestroy () {
    this.$ga.event('Auth', 'login')
    await this.$parent.isAuthenticated()
    await this.$parent.setup()
    await this.$parent.clients()
  },
  destroyed () {
    // Remove the widget from the DOM on path change
    this.widget.remove()
  }
}
</script>

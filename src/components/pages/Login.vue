<style scoped>
  a {
    font-weight: bold;
    text-decoration: none;
    color: #282828
  }
  #login {
    text-align: left;
    display: inline;
    margin: auto;
    padding: 6rem 4rem;
    min-width: 500px;
    max-width: 720px
  }
  .cookies {
    font-size: .6rem;
    margin: 2rem 0
  }
  @media (max-width: 520px) {
    main {
      padding: 2rem 1.5rem
    }
    #login {
      min-width: 100%;
      padding: 4rem 2rem
    }
  }
  .error {
    color: red
  }
</style>
<style>
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
    width: 70%;
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
    width: 75%
  }
  .okta-form-input-error {
    width: 100%;
    color: #EB5757;
    margin-top: .4rem;
    margin-bottom: 1.4rem;
    font-size: .6rem;
    text-align: left
  }
  .o-form-input-name-remember {
    text-align: left;
    font-size: .9rem
  }
  .o-form-button-bar {
    margin: 1.25rem 0
  }
  .o-form-button-bar .button, .email-button {
    text-decoration: none;
    padding: .5rem 2rem;
    display: inline-block;
    height: auto;
    width: auto;
    font-family: Arial, Helvetica, sans-serif;
    font-weight: bold;
    text-align: center;
    cursor: pointer;
    transition: background-color .4s, color .2s
  }
  .o-form-button-bar #okta-signin-submit.button:hover, .email-button:hover {
    background-color: #282828;
    color: white
  }
  .o-form-fieldset-container {
    display: grid;
    grid-gap: 2rem;
    margin-top: 2rem;
    text-align: left
  }
  .link.help.js-help, #help-links-container *, .link.help.js-back {
    text-decoration: none;
    color: #282828;
    font-size: .8rem;
    font-weight: 600
  }
  .custom-checkbox:after {
    content: 'Please remember to manually logout if this is a shared computer.';
    display: block;
    margin-top: 2rem
  }
  @media (max-width: 520px) {
    .okta-form-label {
      font-size: 2rem
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
    <p class="cookies">By logging in and using this application you agree that essential first-party cookies will be placed on your computer. Non-essential third party cookies may also be placed but can be opted out of from your account page. For more information please read our <a href="https://traininblocks.com/cookie-policy">Cookie Policy</a></p>
    <button class="button" v-if="!open" @click="open = !open">Forgot password?</button>
    <button class="button" v-if="open" @click="open = !open">Close</button><br><br>
    <form v-if="open" v-on:submit.prevent="reset">
      <label>
        <p>Email:</p>
        <input type="email" v-model="email" class="input--forms" /><br><br>
        <div><input type="submit" class="button" value="Send recovery email" /></div>
      </label>
    </form>
    <p v-if="success">{{success}}</p>
    <p v-if="error" class="error">{{error}}</p>
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
  data: function () {
    return {
      open: false,
      email: null,
      id: null,
      error: null,
      success: null
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      this.widget = new OktaSignIn({
        baseUrl: process.env.ISSUER,
        issuer: process.env.ISSUER + '/oauth2/default',
        clientId: process.env.CLIENT_ID,
        redirectUri: process.env.URL + '/implicit/callback',
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
      } catch (e) {
        this.$parent.loading = false
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

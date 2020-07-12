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
  #okta-signin-username, #okta-signin-password, #account-recovery-username {
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
  #okta-signin-username:hover, #okta-signin-password:hover, #okta-signin-username:focus, #okta-signin-password:focus, #account-recovery-username:hover, #account-recovery-username:focus {
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
  .help-links {
    list-style-type: none;
    margin: 0;
    padding: 0;
    margin-top: .8rem;
    font-size: .8rem
  }
  .help-links li {
    padding: .4rem 0
  }
  .help-links li:first-of-type {
    padding-top: 0
  }
  .help-links li:last-of-type {
    padding-bottom: 0
  }
  .o-form-fieldset-container {
    display: grid;
    grid-gap: 2rem
  }
  .auth-footer, .o-form-fieldset-container {
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
</style>

<template>
  <div id="login" v-if="!this.$parent.authenticated">
    <inline-svg :src="require('../../assets/svg/full-logo.svg')" class="auth-org-logo"/>
    <div id="okta-signin-container"></div>
    <p class="cookies">By logging in and using this application you agree that essential first-party cookies will be placed on your computer. Non-essential third party cookies may also be placed but can be opted out of from your account page. For more information please read our <a href="https://traininblocks.com/cookie-policy">Cookie Policy</a></p>
  </div>
</template>

<script>
import OktaSignIn from '@okta/okta-signin-widget'
import InlineSvg from 'vue-inline-svg'

export default {
  components: {
    InlineSvg
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

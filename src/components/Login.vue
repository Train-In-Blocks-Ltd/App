<style>
  #login {
    text-align: left;
    display: inline;
    margin: auto;
    padding: 6rem 4rem;
    min-width: 500px;
  }
  .okta-form-title {
    font-size: 2rem;
    text-align: left;
    color: #282828;
  }
  .okta-form-label {
    font-size: 1.1rem;
    font-weight: bold;
    text-align: left;
    color: #282828;
    letter-spacing: 0.15em;
  }
  .okta-form-input-field input {
    width: 75%;
    margin: 0.75rem 0;
    padding: 0.5rem;

    font-family: Arial, Helvetica, sans-serif;
    font-size: 0.9rem;
    letter-spacing: 0.10em;

    border: none;
    border-bottom: 1px solid #888;

    transition: width 1s;
    transition-timing-function: cubic-bezier(0.075, 0.82, 0.165, 1);
  }
  .okta-form-input-field input:hover, .okta-form-input-field input:focus {
    width: 100%;
    outline-width: 0;
  }
  .okta-form-input-error {
    width: 100%;
    color: #EB5757;
    margin-top: 0.5rem;
    margin-bottom: 1.5rem;
    font-size: 0.6rem;
    text-align: left;
  }
  .o-form-input-name-remember {
    text-align: left;
    font-size: 0.9rem;
  }
  .o-form-button-bar {
    margin: 1.25rem 0;
  }
  .o-form-button-bar .button, .email-button{
    padding: 0.5rem 1rem;
    display: inline-block;
    border: 1px solid #282828;
    height: auto;
    width: auto;

    font-family: Arial, Helvetica, sans-serif;
    font-size: 0.9rem;
    font-weight: bold;
    text-align: center;

    cursor: pointer;
    transition: background-color 0.4s, color 0.2s;
  }
  .o-form-button-bar .button:hover, .email-button:hover {
    background-color: #282828;
    color: #fff;
  }
  .help-links {
    list-style-type: none;
    margin: 0;
    padding: 0;
    margin-top: 0.75rem;
    font-size: 0.6rem;
  }
  .help-links li {
    padding: 0.25rem 0;
  }
  .help-links li:first-of-type {
    padding-top: 0;
  }
  .help-links li:last-of-type {
    padding-bottom: 0;
  }
  .auth-footer, .o-form-fieldset-container {
    margin-top: 1.75rem;
    text-align: left;
  }
  .link.help.js-help, .link.help.js-back {
    font-size: 0.6rem;
    font-weight: 600;
  }
  @media (max-width: 520px) {
    main {
      padding: 2rem 1.5rem;
    }
    #login {
      min-width: 100%;
      padding: 4rem 2rem;
    }
    .okta-form-title {
      font-size: 1.5rem;
    }
    .okta-form-label {
      font-size: 1rem;
    }
  }
</style>

<template>
  <div id="login" v-if="!this.$parent.authenticated">
    <div id="okta-signin-container"></div>
  </div>
</template>

<script>
import OktaSignIn from '@okta/okta-signin-widget'

export default {
  mounted: function () {
    this.$nextTick(function () {
      this.widget = new OktaSignIn({
        baseUrl: process.env.ISSUER,
        issuer: process.env.ISSUER + '/oauth2/default',
        clientId: process.env.CLIENT_ID,
        redirectUri: process.env.URL + '/implicit/callback',
        i18n: {
          en: {
            'primaryauth.title': ' ',
            'primaryauth.username.placeholder': 'Email',
            'primaryauth.username.tooltip': 'Enter your email',
            'primaryauth.password.placeholder': 'Password',
            'primaryauth.password.tooltip': 'Enter your password',
            'error.username.required': 'Please enter your email',
            'errors.E0000004': 'That didn\'t work. Was password correct?'
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

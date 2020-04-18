<style>
  #login {
    text-align: center;
    display: inline;
    margin: 0 auto;
    padding: 6rem 4rem;
    min-width: 500px;
    box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.15);
  }
  .auth-org-logo {
    width: 200px;
    margin-bottom: 2 rem;
  }
  .okta-form-title {
    font-size: 2.25rem;
    line-height: 4rem;
    text-align: left;
  }
  .okta-form-title:after {
    content: '';
    border: 1px solid rgba(0, 0, 0, 0.1);
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
    display: block;
    width: 100%;
  }
  .okta-form-label {
    font-size: 1.1rem;
    font-weight: bold;
    text-align: left;
    color: rgba(40, 40, 40, 0.3);
  }
  .okta-form-input-field input {
    width: 100%;
    border: none;
    border-bottom: 2px solid rgba(0, 0, 0, 0.3);
    margin: 0.75rem 0;
    padding: 0.5rem;
    font-family: 'Raleway', sans-serif;
    font-size: 0.9rem;
  }
  .okta-form-input-error {
    width: 100%;
    color: #EB5757;
    margin-top: 0.5rem;
    margin-bottom: 1.5rem;
    font-size: 0.9rem;
    font-weight: bold;
    text-align: left;
  }
  .o-form-input-name-remember {
    text-align: left;
    font-size: 0.9rem;
  }
  .o-form-button-bar {
    margin: 1.25rem 0;
  }
  .o-form-button-bar .button, .email-button {
    padding: 0.25rem 0.5rem;
    font-family: 'Raleway', sans-serif;
    font-size: 0.9rem;
    border: 1px solid #282828;
    cursor: pointer;
    transition: 0.5s;
    font-weight: bold;
    display: block;
  }
  .email-button {
    display: inline-block;
  }
  .help-links {
    list-style-type: none;
    margin: 0;
    padding: 0;
    margin-top: 0.75rem;
    font-size: 0.9rem;
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
  .link.help.js-back {
    font-size: 0.9rem;
  }
  @media (max-width: 400px) {
    #login {
      min-width: 90%;
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
        logo: require('@/assets/logo.png'),
        i18n: {
          en: {
            'primaryauth.title': 'Account',
            'primaryauth.username.placeholder': 'Email',
            'primaryauth.username.tooltip': 'Enter your email',
            'primaryauth.password.placeholder': 'Password',
            'primaryauth.password.tooltip': 'Enter your password'
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

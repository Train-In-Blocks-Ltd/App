<style>
@media (max-width: 400px) {
    #login {
      min-width: 90%;
    }
}
  #login {
    text-align: center;
    display: inline;
    margin: 0 auto;
    border-radius: 0.5rem;
    border: 2px solid #eee;
    padding: 1.75rem 1.25rem;
    min-width: 360px;
  }
  .auth-org-logo {
    width: 100px;
  }
  .okta-form-title {
    font-size: 1.25rem;
  }
  .okta-form-label {
    font-size: 0.9rem;
    font-weight: bold;
    text-align: left;
  }
  .okta-form-input-field input {
    width: 100%;
    border-radius: 4px;
    border: 2px solid #eee;
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
    margin: 0.75rem 0;
  }
  .o-form-button-bar .button {
    width: 100%;
    border-radius: 4px;
    border: none;
    padding: 0.5rem;
    font-family: 'Raleway', sans-serif;
    font-size: 0.9rem;
    cursor: pointer;
    background-color: hsl(0, 0%, 92%);
    transition: 0.5s;
    font-weight: bold;
  }
  .o-form-button-bar .button:hover {
    background-color: hsl(0, 0%, 85%);
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
  .email-button {
    width: 100%;
    border-radius: 4px;
    border: none;
    padding: 0.5rem;
    font-family: 'Raleway', sans-serif;
    font-size: 0.9rem;
    cursor: pointer;
    background-color: hsl(0, 0%, 92%);
    transition: 0.5s;
    display: block;
    margin-bottom: 0.5rem;
  }
  .email-button:hover {
    background-color: hsl(0, 0%, 85%);
    text-decoration: none;
  }
  .auth-footer, .o-form-fieldset-container {
    margin-top: 1.75rem;
  }
  .link.help.js-back {
    font-size: 0.9rem;
  }
</style>

<template>
  <div id="login">
    <div id="okta-signin-container"></div>
  </div>
</template>

<script>

import OktaSignIn from '@okta/okta-signin-widget'

export default {
  name: 'Login',
  mounted: function () {
    this.$nextTick(function () {
      this.widget = new OktaSignIn({
        baseUrl: 'https://dev-183252.okta.com',
        clientId: '0oa3xeljtDMSTwJ3h4x6',
        redirectUri: 'https://app.traininblocks.com/implicit/callback',
        logo: require('@/assets/logo.png'),
        i18n: {
          en: {
            'primaryauth.title': 'Sign in to Train In Blocks'
          }
        },
        authParams: {
          pkce: true,
          display: 'page',
          issuer: 'https://dev-183252.okta.com/oauth2/default',
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
  destroyed () {
    // Remove the widget from the DOM on path change
    this.widget.remove()
  }
}
</script>

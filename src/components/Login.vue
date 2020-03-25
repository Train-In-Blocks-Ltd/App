<style scoped>
  .login {
    text-align: center;
  }
</style>

<template>
  <div class="login">
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
          issuer: 'https://dev-183252.okta.com/oauth2/default'
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

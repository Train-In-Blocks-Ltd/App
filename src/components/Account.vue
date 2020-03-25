<template>
  <div class="account">
    <h1>Your Account</h1>

    <h2>Your Details</h2>
    <p>First Name: <span>{{claims.map(a => a.value)}}</span></p>
    <p>Last Name: <span>{{claims.profile}}</span></p>
    <p>Email: <span>{{claims.map(a => a.value)[1]}}</span></p>
    <p><a href="">Change your password</a></p>
    <h2>Your Subscription</h2>
    <p>
      Below is the information from your ID token which was obtained during the
      <a href="https://developer.okta.com/docs/guides/implement-auth-code-pkce">PKCE Flow</a>
      and is now stored in local storage.
    </p>
    <p>
      This route is protected with the <code>onAuthRequired</code>, navigation guard which will ensure that this page cannot be accessed until you have authenticated.
    </p>
  </div>
</template>

<script>
export default {
  name: 'Profile',
  data () {
    return {
      claims: []
    }
  },
  async created () {
    this.claims = await Object.entries(await this.$auth.getUser()).map(entry => ({ claim: entry[0], value: entry[1] }))
  }
}
</script>

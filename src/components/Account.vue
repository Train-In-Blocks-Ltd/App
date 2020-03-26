<template>
  <div id="account">
    <h1>Your Account</h1>

    <h2>Your Details</h2>
    <p><b>Name: </b><span>{{claims.name}}</span></p>
    <p><b>Email: </b><span>{{claims.email}}</span></p>
    <p><a href="">Update your details</a></p>
    <h2>Your Subscription</h2>
  </div>
</template>

<script>
export default {
  name: 'Account',
  data () {
    return {
      claims: ''
    }
  },
  async created () {
    this.claims = await this.$auth.getUser()
  }
}
</script>

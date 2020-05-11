<style scoped>
  .details_container {
    display: grid;
    grid-gap: 1rem;
    align-items: center
  }
</style>

<template>
  <div id="account" v-if="this.$parent.claims">
    <h1>Your Account</h1>
    <form class="details_container" v-if="$parent.claims">
        <label for="first-name"><b>Name: </b><input type="text" id="first-name" name="first-name" autocomplete="given-name" v-model="$parent.claims.name" required v-on:click="edit()"/></label>
        <label for="email"><b>Email: </b><input type="email" id="email" name="email" autocomplete="email" v-model="$parent.claims.email" required v-on:click="edit()"/></label>
        <label for="color"><b>Colour theme: </b><input type="color" :value="$parent.colors.hex" required v-on:click="edit()" @change="rgb($event)"/></label>
        <p>To <b>reset your password</b> please logout and click on the <b>Need help signing in?</b> link on the login page.</p>
    </form>
    <h2>Your Subscription</h2>
  </div>
</template>

<script>
  import axios from 'axios'
  import qs from 'qs'
  import base64 from 'base-64'

  export default {
    created () {
      this.$parent.setup()
    },
    methods: {
      rgb (e) {
        this.$parent.colors.rgba.r = this.$parent.hexToRgb(e.target.value).r
        this.$parent.colors.rgba.g = this.$parent.hexToRgb(e.target.value).g
        this.$parent.colors.rgba.b = this.$parent.hexToRgb(e.target.value).b
      },
      edit () {
        // Set vue self
        var self = this

        function click (e) {
          if (!document.querySelector('.details_container').contains(e.target)) {
            // Update the workout
            self.save()
            window.removeEventListener('click', click)
          }
        }
        // Wait 1 second before applying the event listener to avoid registering the click to open the box
        setTimeout(
          function () {
            // Add event listener for clicking outside box
            window.addEventListener('click', click)
          }
        , 1000)
      },
      async save () {
        this.$parent.loading = true
        try {
          // Trouble with access control header so use cors-anywhere
          await axios.post(`https://cors-anywhere.herokuapp.com/${process.env.ISSUER}/api/v1/users/${this.$parent.claims.sub}`,
            {
              'profile': {
                'login': this.$parent.claims.email,
                'firstName': this.$parent.claims.name.split(' ')[0],
                'lastName': this.$parent.claims.name.split(' ')[1],
                'email': this.$parent.claims.email,
                'color': this.$parent.colors.hex
              }
            },
            {
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': process.env.AUTH_HEADER
              }
            }
          )
          // Get new user token because details have changed
          await axios.post(`${process.env.ISSUER}/oauth2/default/v1/revoke`,
            qs.stringify({
              token: await this.$auth.getAccessToken(),
              token_type_hint: 'access_token'
            }),
            {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + base64.encode(process.env.REVOKE_ID + ':' + process.env.REVOKE_SECRET)
              }
            }
          )
          this.$parent.loading = false
          this.$parent.claims = await this.$auth.getUser()
        } catch (e) {
          console.log(e)
        }
      }
    }
  }
</script>

<style scoped>
  #account {
    padding: 5rem 3.75rem
  }
  .details_container {
    display: grid;
    grid-gap: 1rem;
    align-items: center;
    width: max-content
  }
  .form__options {
    display: flex
  }
  .form__options label {
    margin: auto 0
  }
  #first-name, #email {
    width: 40%;
    text-overflow: ellipsis;
    font-size: 1rem;
    border: none;
    outline-width: 0;
    border-bottom: 2px solid #28282800;
    transition: all .6s cubic-bezier(.165, .84, .44, 1)
  }
  #first-name:hover, #email:hover, #first-name:focus, #email:focus {
    border-bottom: 2px solid #282828
  }
  .text-reset {
    font-size: .8rem
  }
</style>

<template>
  <div id="account" v-if="this.$parent.claims">
    <h1 class="main-title">Your Account</h1>
    <form class="details_container" v-if="$parent.claims">
        <div class="form__options">
          <label for="first-name"><b>Name: </b></label>
          <input type="text" id="first-name" name="first-name" autocomplete="given-name" v-model="$parent.claims.name" required v-on:click="edit()"/>
        </div>
        <div class="form__options">
          <label for="email"><b>Email: </b></label>
          <input type="email" id="email" name="email" autocomplete="email" v-model="$parent.claims.email" required v-on:click="edit()"/>
        </div>
        <div class="form__options">
          <label for="color"><b>Colour theme: </b></label>
          <input type="color" :value="$parent.colors.hex" required v-on:click="edit()" @change="rgb($event)"/>
        </div>
        <p class="text--reset">To <b>reset your password</b> please logout and click on the <b>Need help signing in?</b> link on the login page.</p>
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
        this.$parent.colors.hex = e.target.value
      },
      edit () {
        // Set vue self
        var self = this

        function click (e) {
          // Update the workout
          self.save()
          window.removeEventListener('click', click)
        }
        // Wait 1 second before applying the event listener to avoid registering the click to open the box
        setTimeout(
          function () {
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
          this.$gtag.event('update_account')
        } catch (e) {
          console.log(e)
        }
      }
    }
  }
</script>

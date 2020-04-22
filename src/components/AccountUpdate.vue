<style>
  #save_changes-link {
    margin-top: 2rem;
  }
  .details_container {
    display: grid;
    grid-template-columns: 0.75fr 1fr;
    align-items: center;
    max-width: 360px;
  }
  .response {
    color: rgb(
      var(--accessible-color),
      var(--accessible-color),
      var(--accessible-color)
    );
  }
</style>
<template>
  <div id="update-account">
    <h1>Your Account</h1>
    <div class="details_container" v-if="$parent.claims">
        <label for="first-name"><b>First name: </b></label><input type="text" id="first-name" name="first-name" autocomplete="given-name" v-model="$parent.claims.given_name" required/>
        <label for="last-name"><b>Last name: </b></label><input type="text" id="last-name" name="last-name" autocomplete="family-name" v-model="$parent.claims.family_name" required/>
        <label for="email"><b>Email: </b></label><input type="email" id="email" name="email" autocomplete="email" v-model="$parent.claims.email" required/>
    </div>

    <h3>Colour Theme</h3>
    <chrome-picker :value="$parent.colors" @input="updateColor"></chrome-picker>

    <div class="loading-grid">
      <button id="save_changes-link" class="button" v-on:click="save()">Save changes</button>
      <Loader></Loader>
    </div>

    <p class="response">{{res}}</p>

    <p class="small">To <b>reset your password</b> please logout and click on the <b>Need help signing in?</b> link on the login page.</p>
  </div>
</template>
<script>
  import { Chrome } from 'vue-color'
  import axios from 'axios'
  import qs from 'qs'
  import base64 from 'base-64'
  import Loader from './Loader'

  export default {
    components: {
      'chrome-picker': Chrome,
      Loader
    },
    data: function () {
      return {
        res: ''
      }
    },
    async created () {
      await this.$parent.setup()
    },
    async beforeRouteLeave (to, from, next) {
      // Before navigating away from the page, reset the colors because the user may have changed them but not saved them
      await this.$parent.setup()
      next()
    },
    methods: {
      updateColor (value) {
        this.$parent.colors = value
      },
      async save () {
        this.$parent.loading = true
        try {
          // Trouble with access control header so use cors-anywhere
          await axios.post(`https://cors-anywhere.herokuapp.com/${process.env.ISSUER}/api/v1/users/${this.$parent.claims.sub}`,
            {
              'profile': {
                'login': this.$parent.claims.email,
                'firstName': this.$parent.claims.given_name,
                'lastName': this.$parent.claims.family_name,
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
          this.res = 'Details updated successfully'
          this.$parent.claims = await this.$auth.getUser()
        } catch (e) {
          this.res = e
        }
      }
    }
  }
</script>
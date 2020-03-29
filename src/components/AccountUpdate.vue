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
    <div class="details_container">
        <label for="first-name"><b>First name: </b></label><input type="text" id="first-name" name="first-name" v-model="$parent.claims.given_name"/>
        <label for="last-name"><b>Last name: </b></label><input type="text" id="last-name" name="last-name" v-model="$parent.claims.family_name"/>
        <label for="email"><b>Email: </b></label><input type="text" id="email" name="email" v-model="$parent.claims.email"/>
    </div>

    <h3>Colour Theme</h3>
    <chrome-picker :value="$parent.colors" @input="updateColor"></chrome-picker>

    <button id="save_changes-link" class="button" v-on:click="save()">Save changes</button>

    <p class="response">{{res}}</p>

    <p class="small">To <b>reset your password</b> please logout and click on the <b>Need help signing in?</b> link on the login page.</p>
  </div>
</template>
<script>
import { Chrome } from 'vue-color'
import axios from 'axios'
import qs from 'qs'
import base64 from 'base-64'

export default {
  components: {
    'chrome-picker': Chrome
  },
  data: function () {
    return {
      res: ''
    }
  },
  methods: {
    updateColor (value) {
      this.$parent.colors = value
    },
    async save () {
      try {
        await axios.post(`${process.env.ISSUER}/api/v1/users/me`,
          {
            'profile': {
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
        this.res = 'Details updated successfully'

        this.$parent.claims = await this.$auth.getUser()
      } catch (e) {
        console.error(`${e}`)
      }
    }
  }
}
</script>
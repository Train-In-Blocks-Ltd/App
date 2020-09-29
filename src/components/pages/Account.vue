<style scoped>
  .details {
    display: grid;
    grid-gap: 1rem 0
  }
  .privacy {
    display: grid
  }
  .policies:first-of-type {
    margin-top: 2rem
  }
  .policies:last-of-type {
    margin-bottom: 2rem
  }
  .policies {
    width: fit-content;
    text-decoration: none;
    color: #282828;
    opacity: 1;
    margin: .4rem 0;
    transition: opacity .2s, transform .1s cubic-bezier(.165, .84, .44, 1)
  }
  .policies:hover {
    opacity: .6
  }
  .policies:active {
    transform: scale(.9)
  }
  .details_container {
    display: grid;
    grid-gap: 4rem;
    align-items: center
  }
  .form__options {
    display: flex
  }
  .form__options label {
    margin: auto 0
  }
  .text-reset {
    font-size: .8rem
  }
  .allow-cookies {
    align-self: center
  }
  .check {
    border-color: red;
    outline-color: red
  }
  .error {
    color: red
  }

  @media (max-width: 768px) {
    #account {
      width: 90vw
    }
    .policies:hover {
      opacity: 1
    }
  }
</style>

<template>
  <div id="account" v-if="this.$parent.claims">
    <modal name="reset-password" height="auto" :adaptive="true">
      <div class="modal--reset">
        <h2>Reset your password</h2>
        <form @submit.prevent="changePass(), $modal.hide('reset-password')">
          <label>
            <p><b>Current Password</b></p>
            <input type="password" class="input--forms" v-model="oldPassword"/>
          </label>
          <br>
          <br>
          <br>
          <label>
            <p><b>Requirements:</b></p>
            <p>Number (0-9)</p>
            <p>At least 8 characters</p>
            <p>Can't contain your username</p><br>
            <p><b>New Password</b></p>
            <input type="password" class="input--forms" v-model="newPassword" @input="checkPass" v-bind:class="{check: check}"/>
          </label>
          <br>
          <br>
          <button type="submit" :disabled="check">Change your password</button>
          <p v-if="this.error" class="error">{{this.error}}</p>
          <p v-if="this.msg">{{this.msg}}</p>
        </form>
      </div>
    </modal>
    <h1 class="main-title">Your Account</h1>
    <form class="details_container" v-if="$parent.claims">
      <div class="details">
        <p><b>Email: </b>{{$parent.claims.email}}</p><br>
        <div v-if="$parent.claims.user_type != 'Client' || $parent.claims.user_type == 'Admin'">
          <button @click.prevent="manageSubscription()">Manage Your Subscription</button>
        </div>
        <button @click.prevent="$modal.show('reset-password')">Change Your Password</button>
        <form action="https://traininblocks.atlassian.net/servicedesk/customer/portal/3/group/-1">
          <button type="submit" formtarget="_blank">Need more support?</button>
        </form>
      </div>
      <div class="privacy">
        <h2>Your Privacy and Data</h2>
        <p>You can find more information about our policies below:</p>
        <a class="policies" href="http://traininblocks.com/gdpr" target="_blank">GDPR Statement</a>
        <a class="policies" href="https://traininblocks.com/privacy-policy" target="_blank">Privacy Policy</a>
        <a class="policies" href="http://traininblocks.com/cookie-policy" target="_blank">Cookie Policy</a>
        <a class="policies" href="http://traininblocks.com/terms-conditions" target="_blank">Terms and Conditions</a>
        <div class="form__options">
          <label for="cookies">
            Allow Third Party Cookies: 
            <input class="allow-cookies" type="checkbox" v-model="$parent.claims.ga" @change="save()"/>
          </label>
        </div>
      </div>
    </form><br><br>
    <p style="font-size: .8rem"><b>Version 1.2</b></p>
  </div>
</template>

<script>
  import axios from 'axios'
  import {passChangeEmail, passChangeEmailText} from '../components/email'

  export default {
    data: function () {
      return {
        oldPassword: null,
        newPassword: null,
        check: null,
        error: null,
        msg: null
      }
    },
    created () {
      this.$parent.setup()
    },
    methods: {

      // BACKGROUND AND MISC. METHODS //-------------------------------------------------------------------------------

      async save () {
        this.$parent.loading = true
        this.$parent.dontLeave = true
        try {
          // Trouble with access control header so use cors-anywhere
          await axios.post(`https://cors-anywhere.herokuapp.com/${process.env.ISSUER}/api/v1/users/${this.$parent.claims.sub}`,
            {
              'profile': {
                'ga': this.$parent.claims.ga
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
          this.$parent.loading = false
          this.$parent.dontLeave = false
        } catch (e) {
          this.$parent.loading = false
          this.$parent.dontLeave = false
          this.$parent.errorMsg = e
          this.$parent.$modal.show('error')
          console.error(e)
        }
      },

      // PASSWORD METHODS //-------------------------------------------------------------------------------

      checkPass () {
        if (!this.newPassword.includes(this.$parent.claims.email) && this.newPassword.match(/[0-9]+/) && this.newPassword.length >= 8 && this.oldPassword.length >= 1) {
          this.check = false
        } else {
          this.check = true
        }
      },
      async changePass () {
        try {
          this.$parent.loading = true
          this.$parent.dontLeave = true
          this.error = ''
          await axios.post(`https://cors-anywhere.herokuapp.com/${process.env.ISSUER}/api/v1/users/${this.$parent.claims.sub}/credentials/change_password`,
            {
              'oldPassword': this.oldPassword,
              'newPassword': this.newPassword
            },
            {
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': process.env.AUTH_HEADER
              }
            }
          )
          this.oldPassword = null
          this.newPassword = null
          this.msg = 'Password Updated Successfully'
          await axios.post('/.netlify/functions/send-email',
            {
              'to': this.$parent.claims.email,
              'subject': 'Password Changed',
              'text': passChangeEmailText(),
              'html': passChangeEmail()
            }
          )
          this.$parent.loading = false
          this.$parent.dontLeave = false
        } catch (e) {
          this.$parent.loading = false
          this.error = 'Something went wrong. Please make sure that your password is correct'
          this.$parent.dontLeave = false
          console.error(e)
        }
      },
      async manageSubscription () {
        try {
          const response = await axios.post(`/.netlify/functions/create-manage-link`, { 'id': this.$parent.claims.stripeId })
          window.location.href = response.data
        } catch (e) {
          this.$parent.loading = false
          this.$parent.errorMsg = e
          this.$parent.$modal.show('error')
          console.error(e)
        }
      }
    }
  }
</script>

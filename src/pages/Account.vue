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
    <modal name="reset-password" height="100%" width="100%" :adaptive="true" :clickToClose="false" @opened="$refs.pass.focus()">
      <div class="modal--reset">
        <div class="wrapper--centered-item"> 
          <h2>Reset your password</h2>
          <form @submit.prevent="changePass(), $parent.willBodyScroll(true)">
            <label>
              <p><b>Current Password</b></p>
              <input type="password" class="input--forms" ref="pass" v-model="password.old" />
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
              <input type="password" class="input--forms" v-model="password.new" @input="checkPass" v-bind:class="{check: password.check}"/>
            </label>
            <br>
            <br>
            <button type="submit" :disabled="password.check">Change your password</button>
            <button class="cancel" @click.prevent="$modal.hide('reset-password'), $parent.willBodyScroll(true)">Close</button>
            <p v-if="this.password.error" class="error">{{this.password.error}}</p>
            <p v-if="this.password.msg">{{this.password.msg}}</p>
          </form>
        </div>
      </div>
    </modal>
    <h1 class="text--large">Your Account</h1>
    <form class="details_container" v-if="$parent.claims">
      <div class="details">
        <p><b>Email: </b>{{$parent.claims.email}}</p>
        <br>
        <div v-if="$parent.claims.user_type != 'Client' || $parent.claims.user_type == 'Admin'">
          <button @click.prevent="manageSubscription()">Manage Your Subscription</button>
        </div>
        <button @click.prevent="$modal.show('reset-password'), $parent.willBodyScroll(false)">Change Your Password</button>
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
    <p style="font-size: .8rem"><b>Draco 2.0</b></p>
  </div>
</template>

<script>
  import axios from 'axios'
  import {passChangeEmail, passChangeEmailText} from '../components/email'

  export default {
    data () {
      return {
        password: {
          old: null,
          new: null,
          check: null,
          error: null,
          msg: null
        }
      }
    },
    created () {
      this.$parent.setup()
      this.$parent.willBodyScroll(true)
    },
    methods: {

      // BACKGROUND AND MISC. METHODS //-------------------------------------------------------------------------------

      async save () {
        this.$parent.loading = true
        this.$parent.dontLeave = true
        try {
          await axios.post('/.netlify/functions/okta',
            {
              type: 'POST',
              body: {
                'profile': {
                  'ga': this.$parent.claims.ga
                }
              },
              url: `${this.$parent.claims.sub}`
            }
          )
          this.$parent.loading = false
          this.$parent.dontLeave = false
        } catch (e) {
          this.$parent.loading = false
          this.$parent.dontLeave = false
          this.$parent.errorMsg = e
          this.$parent.$modal.show('error')
          this.$parent.willBodyScroll(false)
          console.error(e)
        }
      },

      // PASSWORD METHODS //-------------------------------------------------------------------------------

      checkPass () {
        if (!this.password.new.includes(this.$parent.claims.email) && this.password.new.match(/[0-9]+/) && this.password.new.length >= 8 && this.password.old.length >= 1) {
          this.password.check = false
        } else {
          this.password.check = true
        }
      },
      async changePass () {
        try {
          this.$parent.loading = true
          this.$parent.dontLeave = true
          this.password.error = ''
          await axios.post('/.netlify/functions/okta',
            {
              type: 'POST',
              body: {
                'oldPassword': this.password.old,
                'newPassword': this.password.new
              },
              url: `${this.$parent.claims.sub}/credentials/change_password`
            }
          )
          this.password.old = null
          this.password.new = null
          this.password.msg = 'Password Updated Successfully'
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
          this.password.error = 'Something went wrong. Please make sure that your password is correct'
          this.$parent.dontLeave = false
          console.error(e)
        }
      },
      async manageSubscription () {
        try {
          const response = await axios.post('/.netlify/functions/create-manage-link',
            {
              'id': this.$parent.claims.stripeId
            }
          )
          window.location.href = response.data
        } catch (e) {
          this.$parent.loading = false
          this.$parent.dontLeave = false
          this.$parent.errorMsg = e
          this.$parent.$modal.show('error')
          this.$parent.willBodyScroll(false)
          console.error(e)
        }
      }
    }
  }
</script>

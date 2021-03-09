<style scoped>
  .details {
    display: grid;
    grid-gap: 1rem;
    margin: 2rem 0
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
  .reset_password_button_bar {
    display: flex
  }

  @media (max-width: 768px) {
    .policies:hover {
      opacity: 1
    }
  }
</style>

<template>
  <div v-if="$parent.claims" id="account">
    <modal
      name="reset-password"
      height="100%"
      width="100%"
      :adaptive="true"
      :click-to-close="false"
      @opened="$refs.pass.focus()"
    >
      <div class="modal--reset">
        <div class="center_wrapped">
          <form class="form_grid" @submit.prevent="change_password(), $parent.will_body_scroll(true)">
            <div>
              <p class="text--large">
                Stay safe
              </p>
              <p class="text--large grey">
                Reset your password
              </p>
            </div>
            <input
              ref="pass"
              v-model="password.old"
              type="password"
              placeholder="Current password"
              aria-label="Current password"
              class="input--forms small_border_radius"
              required
            >
            <div>
              <p class="text--small">
                Requirements
              </p>
              <p class="text--small grey">
                Number (0-9)
              </p>
              <p class="text--small grey">
                At least 8 characters
              </p>
              <p class="text--small grey">
                Can't contain your username
              </p>
            </div>
            <input
              v-model="password.new"
              type="password"
              placeholder="New password"
              aria-label="New password"
              class="input--forms small_border_radius"
              :class="{check: password.check}"
              required
              @input="check_password"
            >
            <div class="reset_password_button_bar">
              <button class="right_margin" type="submit" :disabled="password.check">
                Change your password
              </button>
              <button class="cancel" @click.prevent="$modal.hide('reset-password'), $parent.will_body_scroll(true)">
                Close
              </button>
            </div>
            <p v-if="password.error" class="error">
              {{ password.error }}
            </p>
            <p v-if="password.msg">
              {{ password.msg }}
            </p>
          </form>
        </div>
      </div>
    </modal>
    <p class="text--large">
      Your Account
    </p>
    <form v-if="$parent.claims" class="details_container">
      <div class="details">
        <p style="margin-bottom: 1rem">
          <b>Email: </b>{{ $parent.claims.email }}
        </p>
        <div v-if="$parent.claims.user_type != 'Client' || $parent.claims.user_type == 'Admin'">
          <button @click.prevent="manage_subscription()">
            Manage Your Subscription
          </button>
        </div>
        <div>
          <button @click.prevent="$modal.show('reset-password'), $parent.will_body_scroll(false)">
            Change Your Password
          </button>
        </div>
      </div>
      <div class="privacy">
        <p class="text--small">
          Your Privacy and Data
        </p>
        <p>You can find more information about our policies below:</p>
        <a class="policies" href="http://traininblocks.com/gdpr" target="_blank">GDPR Statement</a>
        <a class="policies" href="https://traininblocks.com/privacy-policy" target="_blank">Privacy Policy</a>
        <a class="policies" href="http://traininblocks.com/cookie-policy" target="_blank">Cookie Policy</a>
        <a class="policies" href="http://traininblocks.com/terms-conditions" target="_blank">Terms and Conditions</a>
        <div class="form__options">
          <label for="cookies">
            Allow Third Party Cookies:
            <input v-model="$parent.claims.ga" class="allow-cookies" type="checkbox" @change="save()">
          </label>
        </div>
      </div>
    </form><br><br>
    <div class="version">
      <inline-svg :src="require('../assets/svg/pegasus-icon.svg')" aria-label="Pegusus" />
      <p class="text--tiny">
        <b>{{ $parent.versionName }} {{ $parent.versionBuild }}</b>
      </p>
    </div>
  </div>
</template>

<script>
import { passChangeEmail, passChangeEmailText } from '../components/email'

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
    this.$parent.loading = true
    this.$parent.setup()
    this.$parent.will_body_scroll(true)
    this.$parent.end_loading()
  },
  methods: {

    // BACKGROUND AND MISC.

    async save () {
      this.$parent.dontLeave = true
      try {
        await this.$axios.post('/.netlify/functions/okta',
          {
            type: 'POST',
            body: {
              profile: {
                ga: this.$parent.claims.ga
              }
            },
            url: `${this.$parent.claims.sub}`
          }
        )
        this.$parent.dontLeave = false
      } catch (e) {
        this.$parent.resolve_error(e)
      }
    },
    async manage_subscription () {
      try {
        const response = await this.$axios.post('/.netlify/functions/create-manage-link',
          {
            id: this.$parent.claims.stripeId
          }
        )
        window.location.href = response.data
      } catch (e) {
        this.$parent.resolve_error(e)
      }
    },

    // PASSWORD

    check_password () {
      if (!this.password.new.includes(this.$parent.claims.email) && this.password.new.match(/[0-9]+/) && this.password.new.length >= 8 && this.password.old.length >= 1) {
        this.password.check = false
      } else {
        this.password.check = true
      }
    },
    async change_password () {
      try {
        this.$parent.dontLeave = true
        this.password.error = ''
        await this.$axios.post('/.netlify/functions/okta',
          {
            type: 'POST',
            body: {
              oldPassword: this.password.old,
              newPassword: this.password.new
            },
            url: `${this.$parent.claims.sub}/credentials/change_password`
          }
        )
        this.password.old = null
        this.password.new = null
        this.password.msg = 'Password Updated Successfully'
        await this.$axios.post('/.netlify/functions/send-email',
          {
            to: this.$parent.claims.email,
            subject: 'Password Changed',
            text: passChangeEmailText(),
            html: passChangeEmail()
          }
        )
        this.$parent.end_loading()
      } catch (e) {
        this.password.error = 'Something went wrong. Please make sure that your password is correct'
        console.error(e)
        this.$parent.end_loading()
      }
    }
  }
}
</script>

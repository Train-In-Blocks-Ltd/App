<style scoped>
.details {
  display: grid;
  grid-gap: 1rem;
  margin: 2rem 0
}
.theme {
  display: grid;
  grid-gap: 1rem
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
  color: var(--base);
  opacity: 1;
  margin: .4rem 0;
  transition: opacity .2s, transform .1s cubic-bezier(.165, .84, .44, 1)
}
.policies:hover {
  opacity: var(--light_opacity)
}
.policies:active {
  transform: var(--active_state)
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

/* Responsive */
@media (max-width: 768px) {
  .policies:hover {
    opacity: 1
  }
}
@media (max-width: 576px) {
  .reset_password_button_bar,
  .details_container button {
    width: 100%
  }
  .reset_password_button_bar {
    display: grid;
    grid-gap: 1rem
  }
}
</style>

<template>
  <div
    v-if="$parent.claims"
    id="account"
    class="view_container"
  >
    <div :class="{ opened_sections: showPasswordReset }" class="section_overlay" />
    <form
      v-if="showPasswordReset"
      class="form_grid tab_overlay_content fadeIn delay fill_mode_both"
      @submit.prevent="change_password()"
    >
      <div>
        <h1>
          Stay safe
        </h1>
        <h2 class="grey">
          Reset your password
        </h2>
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
        <h2>
          Requirements
        </h2>
        <p class="grey">
          Number (0-9)
        </p>
        <p class="grey">
          At least 8 characters
        </p>
        <p class="grey">
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
      <input
        v-model="password.match"
        type="password"
        placeholder="Confirm new password"
        aria-label="Confirm new password"
        class="input--forms small_border_radius"
        :class="{check: password.new !== password.match}"
        required
        @input="check_password"
      >
      <div class="reset_password_button_bar">
        <button class="right_margin" type="submit" :disabled="password.check || password.new !== password.match">
          Change your password
        </button>
        <button class="red_button" @click.prevent="showPasswordReset = false, will_body_scroll(true)">
          Close
        </button>
      </div>
      <p v-if="password.error" class="error">
        {{ password.error }}
      </p>
    </form>
    <h1>
      Your Account
    </h1>
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
          <button @click.prevent="showPasswordReset = true, will_body_scroll(false)">
            Change Your Password
          </button>
        </div>
      </div>
      <div class="theme">
        <label for="theme" class="text--small">
          <b>
            Theme
          </b>
        </label>
        <select
          v-model="$parent.claims.theme"
          name="theme"
          class="width_300"
          @change="$parent.darkmode($parent.claims.theme), $parent.save_claims()"
        >
          <option value="system">
            System default
          </option>
          <option value="light">
            Light
          </option>
          <option value="dark">
            Dark
          </option>
        </select>
      </div>
      <div class="privacy">
        <h2>
          Your Privacy and Data
        </h2>
        <p>You can find more information about our policies below:</p>
        <a class="policies" href="http://traininblocks.com/gdpr" target="_blank">GDPR Statement</a>
        <a class="policies" href="https://traininblocks.com/privacy-policy" target="_blank">Privacy Policy</a>
        <a class="policies" href="http://traininblocks.com/cookie-policy" target="_blank">Cookie Policy</a>
        <a class="policies" href="http://traininblocks.com/terms-conditions" target="_blank">Terms and Conditions</a>
        <div class="form__options">
          <label for="cookies">
            Allow Third Party Cookies:
            <input v-model="$parent.claims.ga" class="allow-cookies" type="checkbox" @change="$parent.save_claims()">
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
  async beforeRouteLeave (to, from, next) {
    if (this.$parent.dontLeave ? await this.$parent.$refs.confirm_pop_up.show('Your changes might not be saved', 'Are you sure you want to leave?') : true) {
      this.$parent.dontLeave = false
      next()
    }
  },
  data () {
    return {
      showPasswordReset: false,
      password: {
        old: null,
        new: null,
        match: null,
        check: null,
        error: null
      }
    }
  },
  created () {
    this.$parent.loading = true
    this.$parent.setup()
    this.will_body_scroll(true)
    this.$parent.end_loading()
  },
  methods: {

    // BACKGROUND AND MISC.

    async manage_subscription () {
      try {
        this.$parent.dontLeave = true
        const RESPONSE = await this.$axios.post('/.netlify/functions/create-manage-link',
          {
            id: this.$parent.claims.stripeId
          }
        )
        window.location.href = RESPONSE.data
      } catch (e) {
        this.$parent.resolve_error(e)
      }
    },

    // PASSWORD

    check_password () {
      const SELF = this
      function isUsername () {
        const ONE = !SELF.password.new.includes(SELF.$parent.claims.email)
        const TWO = SELF.password.new.split('').filter(function (e, i, a) {
          // eslint-disable-next-line
          return (SELF.$parent.claims.email.indexOf(e) !== -1)
        }).length <= 6
        if (ONE === true && TWO !== false) {
          return true
        } else {
          return false
        }
      }
      function requirements () {
        return isUsername() && SELF.password.new.match(/[0-9]+/) !== null && SELF.password.new.length >= 8 && SELF.password.old.length >= 1
      }
      if (requirements() === false) {
        this.password.check = true
        this.password.error = 'Please check the requirements'
      } else if (this.password.new !== this.password.match) {
        this.password.check = true
        this.password.error = 'New password does not match'
      } else {
        this.password.check = false
        this.password.error = ''
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
        await this.$axios.post('/.netlify/functions/send-email',
          {
            to: this.$parent.claims.email,
            subject: 'Password Changed',
            text: passChangeEmailText(),
            html: passChangeEmail()
          }
        )
        this.$parent.$refs.response_pop_up.show('Password changed', 'Remember to not share it and keep it safe')
        this.$parent.end_loading()
        this.showPasswordReset = false
        this.will_body_scroll(true)
      } catch (e) {
        this.password.error = 'Something went wrong. Please make sure that your password is correct and the new password fulfils the requirements'
        console.error(e)
        this.$parent.end_loading()
      }
    }
  }
}
</script>

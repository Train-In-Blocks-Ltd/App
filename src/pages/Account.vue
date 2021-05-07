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
    v-if="claims"
    id="account"
    class="view_container"
  >
    <div :class="{ opened_sections: showPasswordReset }" class="section_overlay" />
    <form
      v-if="showPasswordReset"
      class="form_grid tab_overlay_content fadeIn delay fill_mode_both"
      @submit.prevent="changePassword()"
    >
      <div>
        <h2>
          Stay safe
        </h2>
        <h3 class="grey">
          Reset your password
        </h3>
      </div>
      <input
        ref="pass"
        v-model="password.old"
        type="password"
        placeholder="Current password"
        aria-label="Current password"
        class="input--forms width_300 small_border_radius"
        required
      >
      <div>
        <h3>
          Requirements
        </h3>
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
        class="input--forms width_300 small_border_radius"
        :class="{check: password.check}"
        required
        @input="checkPassword"
      >
      <input
        v-model="password.match"
        type="password"
        placeholder="Confirm new password"
        aria-label="Confirm new password"
        class="input--forms width_300 small_border_radius"
        :class="{check: password.new !== password.match}"
        required
        @input="checkPassword"
      >
      <div class="reset_password_button_bar">
        <button class="right_margin" type="submit" :disabled="password.check || password.new !== password.match">
          Change your password
        </button>
        <button class="red_button" @click.prevent="showPasswordReset = false, willBodyScroll(true)">
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
    <form v-if="claims" class="details_container">
      <div class="details">
        <p style="margin-bottom: 1rem">
          <b>Email: </b>{{ claims.email }}
        </p>
        <div v-if="claims.user_type != 'Client' || claims.user_type == 'Admin'">
          <button @click.prevent="manageSubscription()">
            Manage Your Subscription
          </button>
        </div>
        <div>
          <button @click.prevent="showPasswordReset = true, willBodyScroll(false)">
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
          v-model="claims.theme"
          name="theme"
          class="width_300"
          @change="$parent.darkmode(claims.theme), $parent.saveClaims()"
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
        <h3>
          Your Privacy and Data
        </h3>
        <p>You can find more information about our policies below:</p>
        <a class="policies" href="http://traininblocks.com/gdpr" target="_blank">GDPR Statement</a>
        <a class="policies" href="https://traininblocks.com/privacy-policy" target="_blank">Privacy Policy</a>
        <a class="policies" href="http://traininblocks.com/cookie-policy" target="_blank">Cookie Policy</a>
        <a class="policies" href="http://traininblocks.com/terms-conditions" target="_blank">Terms and Conditions</a>
        <div class="form__options">
          <label for="cookies">
            Allow Third Party Cookies:
            <input v-model="claims.ga" class="allow-cookies" type="checkbox" @change="$parent.saveClaims()">
          </label>
        </div>
      </div>
    </form><br><br>
    <div class="version">
      <inline-svg :src="require('../assets/svg/pegasus-icon.svg')" aria-label="Pegusus" />
      <p class="text--tiny">
        <b>{{ versionName }} {{ versionBuild }}</b>
      </p>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  async beforeRouteLeave (to, from, next) {
    if (this.dontLeave ? await this.$parent.$refs.confirm_pop_up.show('Your changes might not be saved', 'Are you sure you want to leave?') : true) {
      this.$store.commit('setData', {
        attr: 'dontLeave',
        data: false
      })
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
  computed: mapState([
    'dontLeave',
    'claims',
    'versionName',
    'versionBuild'
  ]),
  async created () {
    this.$store.commit('setData', {
      attr: 'loading',
      data: true
    })
    this.willBodyScroll(true)
    await this.$parent.setup()
    this.$store.dispatch('endLoading')
  },
  methods: {

    // BACKGROUND AND MISC.

    async manageSubscription () {
      try {
        const RESPONSE = await this.$axios.post('/.netlify/functions/create-manage-link',
          {
            id: this.claims.stripeId
          }
        )
        window.location.href = RESPONSE.data
      } catch (e) {
        this.$parent.resolveError(e)
      }
    },

    // PASSWORD

    checkPassword () {
      const SELF = this
      function isUsername () {
        const ONE = !SELF.password.new.includes(SELF.claims.email)
        const TWO = SELF.password.new.split('').filter(function (e, i, a) {
          // eslint-disable-next-line
          return (SELF.claims.email.indexOf(e) !== -1)
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
    async changePassword () {
      try {
        this.$store.commit('setData', {
          attr: 'dontLeave',
          data: true
        })
        this.password.error = ''
        await this.$store.dispatch('changePassword', {
          old: this.password.old,
          new: this.password.new
        })
        this.$parent.$refs.response_pop_up.show('Password changed', 'Remember to not share it and keep it safe')
        this.showPasswordReset = false
        this.willBodyScroll(true)
        this.password = {
          old: null,
          new: null,
          match: null,
          check: null,
          error: null
        }
        this.$store.dispatch('endLoading')
      } catch (e) {
        this.password.error = 'Something went wrong. Please make sure that your password is correct and the new password fulfils the requirements'
        this.$parent.resolveError(e)
      }
    }
  }
}
</script>

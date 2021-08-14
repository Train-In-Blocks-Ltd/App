<style lang="scss" scoped>
@mixin setting-section {
  display: grid;
  grid-gap: 1rem
}
.details_container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 2rem;
  margin-top: 2rem;
  .details {
    @include setting-section;

    margin-bottom: 3rem;
    .user-settings-button-bar {
      display: flex;
      > div:first-child {
        margin-right: 1rem
      }
    }
  }
  .theme {
    @include setting-section;

    margin-bottom: 3rem
  }
  .referral {
    @include setting-section;
    button {
      width: fit-content
    }
  }
  .calendar {
    @include setting-section;

    margin-bottom: 3rem;
    button {
      width: fit-content
    }
    .guide_links {
      display: grid;
      grid-gap: .6rem;
      margin: 1rem 0;
      a {
        display: inline;
        font-weight: bold
      }
    }
  }
  .privacy {
    @include setting-section;
    .policy_links {
      display: grid;
      grid-gap: .6rem;
      margin: 1rem 0;
      a {
        display: inline;
        font-weight: bold
      }
    }
  }
}
.form__options {
  display: flex;
  label {
    margin: auto 0
  }
  .allow-cookies {
    align-self: center
  }
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
@media (max-width: 1024px) {
  .details_container {
    grid-template-columns: 1fr;
    grid-gap: 3rem
  }
}
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
@media (max-width: 425px) {
  .details_container {
    .details {
      .user-settings-button-bar {
        display: grid;
        grid-gap: 1rem;
        > div:first-child {
          margin-right: 0
        }
      }
    }
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
        :value="password.old"
        type="password"
        placeholder="Current password"
        aria-label="Current password"
        class="input--forms width_300 small_border_radius"
        required
        @input="password.old = $event.target.value, checkForm()"
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
        @input="checkPassword(), checkForm()"
      >
      <input
        v-model="password.match"
        type="password"
        placeholder="Confirm new password"
        aria-label="Confirm new password"
        class="input--forms width_300 small_border_radius"
        :class="{check: password.new !== password.match}"
        required
        @input="checkPassword(), checkForm()"
      >
      <div class="reset_password_button_bar">
        <button
          class="right_margin"
          type="submit"
          :disabled="disableChangePasswordButton || password.check || password.new !== password.match"
        >
          Change your password
        </button>
        <button
          class="red_button"
          @click.prevent="showPasswordReset = false, willBodyScroll(true)"
        >
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
    <div v-if="claims" class="details_container">
      <div>
        <div class="details">
          <h3>General settings</h3>
          <p style="margin-bottom: 1rem">
            <b>Email: </b>{{ claims.email }}
          </p>
          <div class="user-settings-button-bar">
            <div v-if="claims.user_type != 'Client' || claims.user_type == 'Admin'">
              <button @click.prevent="manageSubscription()">
                Manage Subscription
              </button>
            </div>
            <div>
              <button @click.prevent="showPasswordReset = true, willBodyScroll(false)">
                Change Password
              </button>
            </div>
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
        <div class="referral">
          <h3>
            Referral Code
          </h3>
          <p>
            <b>Earn up to 15% off!</b> You'll receive a 5% discount for each referral you make, up to a maximum of 15% off. Each person you refer will also receive 20% off their first month too. It's a win-win!
          </p>
          <button
            v-if="!coupon.generated"
            @click.prevent="generateCoupon()"
          >
            Generate Coupon
          </button>
          <button
            v-else
            @click.prevent="copyCoupon()"
            v-html="coupon.code"
          />
        </div>
      </div>
      <div>
        <div class="calendar">
          <label for="calendar" class="text--small">
            <b>
              Calendar
            </b>
          </label>
          <div>
            <div class="form__options">
              <label>
                Enable calendar link:
                <input
                  v-model="claims.calendar"
                  class="claims-calendar"
                  type="checkbox"
                  @change="$parent.saveClaims()"
                >
              </label>
            </div>
            <p class="text--tiny">
              Anyone with the link will be able to see all of your bookings
            </p>
          </div>
          <div
            v-if="claims.calendar"
            class="guide_links"
          >
            <p
              v-for="(guide, guideIndex) in calendarGuides"
              :key="`cal_${guideIndex}`"
            >
              <a
                :href="guide.link"
                target="_blank"
                rel="noreferrer"
                class="a_link"
              >
                Add to {{ guide.name }} calendar
              </a>
            </p>
          </div>
          <button
            v-if="claims.calendar"
            @click.prevent="copyCalendarLink()"
            v-html="calendarText"
          />
        </div>
        <div class="privacy">
          <h3>
            Your Privacy and Data
          </h3>
          <p>You can find more information about our policies below:</p>
          <div class="policy_links">
            <p
              v-for="(policy, policyIndex) in policies"
              :key="`policy_${policyIndex}`"
            >
              <a
                :href="policy.link"
                target="_blank"
                rel="noreferrer"
                class="a_link"
              >
                <b>
                  {{ policy.title }}
                </b>
              </a>
            </p>
          </div>
          <div class="form__options">
            <label>
              Allow Third Party Cookies:
              <input v-model="claims.ga" class="allow-cookies" type="checkbox" @change="$parent.saveClaims()">
            </label>
          </div>
        </div>
      </div>
    </div>
    <br>
    <br>
    <div class="version">
      <inline-svg :src="require('../assets/svg/andromeda-icon.svg')" aria-label="Andromeda" />
      <p class="text--tiny">
        <b>{{ versionName }} {{ versionBuild }}</b>
      </p>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  metaInfo  () {
    return {
      title: 'Account'
    }
  },
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
      },
      disableChangePasswordButton: true,
      calendarText: 'Get your calendar link',
      calendarGuides: [
        {
          name: 'Google',
          link: ''
        },
        {
          name: 'Outlook',
          link: 'https://support.microsoft.com/en-us/office/import-or-subscribe-to-a-calendar-in-outlook-com-cff1429c-5af6-41ec-a5b4-74f2c278e98c'
        },
        {
          name: 'Apple',
          link: 'https://support.apple.com/en-gb/guide/calendar/icl1022/mac'
        }
      ],
      policies: [
        {
          title: 'Privacy and Data Policy',
          link: 'http://traininblocks.com/legal/privacy-and-data-policy'
        },
        {
          title: 'Cookies Policy',
          link: 'http://traininblocks.com/legal/cookies-policy'
        },
        {
          title: 'Terms of Use',
          link: 'http://traininblocks.com/legal/terms-of-use'
        }
      ]
    }
  },
  computed: mapState([
    'dontLeave',
    'claims',
    'versionName',
    'versionBuild',
    'coupon'
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
  async mounted () {
    if (!this.coupon.checked) {
      await this.checkCoupon()
    }
    this.calendarGuides[0].link = `https://calendar.google.com/calendar/u/0/r?cid=${window.location.host === 'localhost:8080' ? 'http://' + window.location.host : 'https://' + window.location.host}/.netlify/functions/calendar?email=${this.claims.email}`
  },
  methods: {

    // -----------------------------
    // General
    // -----------------------------

    checkForm () {
      this.disableChangePasswordButton = !(this.password.old && this.password.new && this.password.match && !this.password.check && !this.password.error)
    },

    /**
     * Redirects the user to their Stripe management page.
     */
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

    // -----------------------------
    // Password
    // -----------------------------

    /**
     * Validates the password.
     */
    checkPassword () {
      const SELF = this
      function requirements () {
        return SELF.password.new.match(/[0-9]+/) !== null && SELF.password.new.length >= 8 && SELF.password.old.length >= 1
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

    /**
     * Changes the password.
     */
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
      }
    },

    /**
     * Generates the user's calendar link.
     */
    copyCalendarLink () {
      const link = `${window.location.host === 'localhost:8080' ? 'http://' + window.location.host : 'https://' + window.location.host}/.netlify/functions/calendar?email=${this.claims.email}`
      const self = this
      navigator.clipboard.writeText(link).then(function () {
        self.calendarText = 'Copied!'
        setTimeout(function () {
          self.calendarText = 'Get your calendar link'
        }, 2000)
      }, function (err) {
        self.calendarText = 'Could not copy text: ' + err
      })
    },

    /*
     * Checks if the user already has coupons activated.
     */
    async checkCoupon () {
      try {
        this.$store.commit('setData', {
          attr: 'dontLeave',
          data: true
        })
        const RESPONSE = await this.$axios.post('/.netlify/functions/check-coupon',
          {
            email: this.claims.email
          }
        )
        if (RESPONSE.data.data.find(coupon => coupon.code === this.claims.email.toUpperCase().replace(/[\W_]+/g, '')) && RESPONSE.data.data.find(coupon => coupon.code === this.claims.email.toUpperCase().replace(/[\W_]+/g, '')).active) {
          this.$store.commit('setDataDeep', {
            attrParent: 'coupon',
            attrChild: 'generated',
            data: this.claims.email.toUpperCase().replace(/[\W_]+/g, '')
          })
          this.$store.commit('setDataDeep', {
            attrParent: 'coupon',
            attrChild: 'code',
            data: this.claims.email.toUpperCase().replace(/[\W_]+/g, '')
          })
        }
        this.$store.commit('setDataDeep', {
          attrParent: 'coupon',
          attrChild: 'checked',
          data: true
        })
        this.$store.dispatch('endLoading')
      } catch (e) {
        this.$parent.resolveError(e)
      }
    },
    async generateCoupon () {
      try {
        this.$store.commit('setData', {
          attr: 'dontLeave',
          data: true
        })
        await this.$axios.post('/.netlify/functions/create-coupon',
          {
            email: this.claims.email
          }
        )
        this.$store.commit('setDataDeep', {
          attrParent: 'coupon',
          attrChild: 'generated',
          data: this.claims.email.toUpperCase().replace(/[\W_]+/g, '')
        })
        this.$store.commit('setDataDeep', {
          attrParent: 'coupon',
          attrChild: 'code',
          data: this.claims.email.toUpperCase().replace(/[\W_]+/g, '')
        })
        this.$store.dispatch('endLoading')
      } catch (e) {
        this.$parent.resolveError(e)
      }
    },
    copyCoupon () {
      const link = this.claims.email.toUpperCase().replace(/[\W_]+/g, '')
      const self = this
      navigator.clipboard.writeText(link).then(function () {
        self.$store.commit('setDataDeep', {
          attrParent: 'coupon',
          attrChild: 'code',
          data: 'Copied!'
        })
        setTimeout(function () {
          self.$store.commit('setDataDeep', {
            attrParent: 'coupon',
            attrChild: 'code',
            data: self.claims.email.toUpperCase().replace(/[\W_]+/g, '')
          })
        }, 2000)
      }, function (err) {
        self.$store.commit('setDataDeep', {
          attrParent: 'coupon',
          attrChild: 'code',
          data: 'Could not copy text: ' + err
        })
      })
    }
  }
}
</script>

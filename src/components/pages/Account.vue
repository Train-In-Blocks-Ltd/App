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

  @media (max-width: 768px) {
    #account {
      width: 90vw
    }
    .policies:hover {
      opacity: 1
    }
  }

  /* For Mobile */
  @media (max-width: 576px) {
    #account {
      padding: 4rem 1rem
    }
  }
</style>

<template>
  <div id="account" v-if="this.$parent.claims">
    <h1 class="main-title">Your Account</h1>
    <form class="details_container" v-if="$parent.claims">
        <div class="details">
          <div class="form__options">
            <label for="email"><b>Email: </b></label>
            <input type="email" id="email" class="input--forms" name="email" autocomplete="email" v-autowidth="{ maxWidth: '400px', minWidth: '20px', comfortZone: 24 }" v-model="$parent.claims.email" required @blur="save()"/>
          </div>
          <div class="form__options">
            <label for="color"><b>Sidebar Colour: </b></label>
            <input type="color" name="color" :value="$parent.colors.hex" required @blur="save()" @change="rgb($event)"/>
          </div>
          <div v-if="$parent.claims.user_type != 'Client' || $parent.claims.user_type == 'Admin'">
            <button class="button" v-on:click.prevent="manageSubscription">Manage Your Subscription</button>
          </div>
        </div>
        <div>
          <h2>Reset your password</h2>
          <p class="text--reset">To reset your password please logout and click on the <i>Need help signing in?</i> link on the login page.</p>
        </div>
        <div class="privacy">
          <h2>Your Privacy and Data</h2>
          <p>You can find more information about our policies below:</p>
          <a class="policies" href="http://traininblocks.com/gdpr" target="_blank">GDPR Statement</a>
          <a class="policies" href="https://traininblocks.com/privacy-policy" target="_blank">Privacy Policy</a>
          <a class="policies" href="http://traininblocks.com/cookie-policy" target="_blank">Cookie Policy</a>
          <a class="policies" href="http://traininblocks.com/terms-conditions" target="_blank">Terms and Conditions</a>
          <div class="form__options">
            <label for="cookies">Allow Third Party Cookies: </label>
            <input class="allow-cookies" type="checkbox" v-model="$parent.claims.ga" @change="save()"/>
          </div>
        </div>
    </form>
  </div>
</template>

<script>
  import axios from 'axios'

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
      async manageSubscription () {
        try {
          const response = await axios.post(`/.netlify/functions/create-manage-link`, { 'id': this.$parent.claims.stripeId })
          window.location.href = response.data
        } catch (e) {
          console.log(e)
        }
      },
      async save () {
        this.$parent.colors.hex = document.querySelector('input[name="color"]').value
        this.$parent.loading = true
        try {
          // Trouble with access control header so use cors-anywhere
          await axios.post(`https://cors-anywhere.herokuapp.com/${process.env.ISSUER}/api/v1/users/${this.$parent.claims.sub}`,
            {
              'profile': {
                'login': this.$parent.claims.email,
                'firstName': this.$parent.claims.email,
                'email': this.$parent.claims.email,
                'color': this.$parent.colors.hex,
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
        } catch (e) {
          console.log(e)
        }
      }
    }
  }
</script>

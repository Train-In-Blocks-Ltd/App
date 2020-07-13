<style scoped>
  .policies {
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
    grid-gap: 1rem;
    align-items: center
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
        <div class="form__options">
          <label for="first-name"><b>Name: </b></label>
          <input type="text" id="first-name" name="first-name" autocomplete="given-name" v-model="$parent.claims.given_name" required v-on:click="edit()"/>
        </div>
        <div class="form__options">
          <label for="email"><b>Email: </b></label>
          <input type="email" id="email" name="email" autocomplete="email" v-model="$parent.claims.email" required v-on:click="edit()"/>
        </div>
        <div class="form__options">
          <label for="color"><b>Colour theme: </b></label>
          <input type="color" name="color" :value="$parent.colors.hex" required v-on:click="edit()" @change="rgb($event)"/>
        </div>
        <div v-if="$parent.claims.user_type != 'Client'">
          <button class="button" v-on:click.prevent="manageSubscription">Manage Your Subscription</button>
        </div>
        <h2>Reset your password</h2>
        <p class="text--reset">To <b>reset your password</b> please logout and click on the <b>Need help signing in?</b> link on the login page.</p>
        <h2>Your Privacy and Data</h2>
        <p>You can find more information about our policies here:</p>
        <p><a class="policies" href="http://traininblocks.com/gdpr" target="_blank">GDPR Statement</a></p>
        <p><a class="policies" href="https://traininblocks.com/privacy-policy" target="_blank">Privacy Policy</a></p>
        <p><a class="policies" href="http://traininblocks.com/cookie-policy" target="_blank">Cookie Policy</a></p>
        <p><a class="policies" href="http://traininblocks.com/terms-conditions" target="_blank">Terms and Conditions</a></p>
        <div class="form__options">
          <label for="cookies"><b>Third Party Cookies: </b></label>
          <input type="checkbox" v-model="$parent.claims.ga" v-on:click="edit()"/>
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
                'firstName': this.$parent.claims.given_name,
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
        } catch (e) {
          console.log(e)
        }
      }
    }
  }
</script>

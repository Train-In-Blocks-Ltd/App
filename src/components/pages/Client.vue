<style>
  #client {
    overflow-x: hidden;
    background-color: #F4F4F4;
    position: relative
  }
  .wrapper--client {
    background-color: white;
    transition: all 1.4s cubic-bezier(.165, .84, .44, 1)
  }

  /* Client Info */
  #client .client_info input:not([type='submit']), #duration, .workout-date {
    width: 100%;
    cursor: pointer;
    background-color: initial;
    border: none;
    padding: .6rem 0;
    transition: .4s all cubic-bezier(.165, .84, .44, 1)
  }
  #client .client_info input:not([type='submit']):hover, #duration:hover, .workout-date:hover {
    opacity: .6
  }
  #client .client_info input:not([type='submit']):focus, #duration:focus, .workout-date:focus {
    opacity: 1;
    padding: .6rem 1rem
  }
  .client_info__more-details {
    display: grid
  }
  .wrapper--info {
    display: flex
  }
  .wrapper--info label {
    align-self: center;
    margin-right: 1rem
  }
  #phone {
    width: 50%
  }
  #client .client_info input.client_info--name {
    max-width: 100%;
    font-size: 3.75rem;
    letter-spacing: .1rem;
    margin: 0
  }
  .button--verify {
    width: fit-content
  }

  /* Floating Nav */
  .floating_nav {
    z-index: 2;
    display: grid;
    grid-gap: 2rem;
    position: fixed;
    right: 2rem;
    top: 4rem;
    text-align: right
  }
  .floating_nav a {
    color: #282828;
    text-decoration: none
  }
  .floating_nav a:hover {
    opacity: .6rem
  }
  .icon--options {
    cursor: pointer;
    margin-left: auto
  }
  .openFloatingNav {
    transform: translateX(-12rem)
  }
  .client--options {
    display: grid;
    grid-gap: 1rem
  }
  .client--options a:hover {
    opacity: .6
  }

  /* Client Notes */
  .client_notes--header {
    color: #282828;
    padding: .6rem .8rem
  }
  .client_notes--header p {
    margin: 0;
    font-weight: bold
  }
  .client_notes--quill {
    margin: 0
  }

  /* Responsiveness */
  @media (max-width: 992px) {
    .floating_nav a {
      grid-template-columns: 1fr;
      transition: all .1s cubic-bezier(.165, .84, .44, 1)
    }
    .floating_nav a:active {
      transform: scale(.9)
    }
    div.floating_nav a:before {
      content: none
    }
    .floating_nav .text--hideable {
      display: none
    }
  }
  @media (max-width: 768px) {
    #client .client_info input:not([type='submit']):hover, #duration:hover {
      border-bottom: 2px solid #28282800
    }
    #client .client_info input.client_info--name {
      font-size: 2rem
    }
    .client_info {
      grid-gap: 0;
      width: 90vw
    }
  }

  /* For Mobile */
  @media (max-width: 576px) {
    /* Overall */
    #client .client_info input.client_info--name:focus {
      border-bottom: 2px solid #282828
    }
    .floating_nav {
      right: 2rem;
      top: 2rem
    }
  }
</style>

<template>
  <div id="client" v-if="$parent.client_details">
    <modal name="toolkit" height="auto" :draggable="true" :adaptive="true">
      <toolkit/>
    </modal>
    <div v-show="keepLoaded" class="floating_nav">
      <transition enter-active-class="animate__animated animate__fadeIn animate__delay-1s animate__faster">
        <inline-svg v-show="!showOptions" @click="showOptions = true" class="icon--options" :src="require('../../assets/svg/hamburger.svg')" />
      </transition>
      <transition enter-active-class="animate__animated animate__fadeIn animate__delay-1s animate__faster">
        <inline-svg v-show="showOptions" @click="showOptions = false" class="icon--options" :src="require('../../assets/svg/close.svg')" />
      </transition>
      <div class="client--options" v-for="(clients, index) in $parent.posts" :key="index" v-show="clients.client_id == $route.params.client_id && showOptions">
        <transition enter-active-class="animate__animated animate__fadeInRight animate__delay-1s animate__faster" leave-active-class="animate__animated animate__fadeOutRight animate__faster">
          <a href="javascript:void(0)" @click="$parent.client_archive(clients.client_id, index)">Archive Client</a>
        </transition>
        <transition enter-active-class="animate__animated animate__fadeInRight animate__delay-1s animate__faster" leave-active-class="animate__animated animate__fadeOutRight animate__faster">
          <a href="javascript:void(0)" @click="$modal.show('toolkit')">Toolkit</a>
        </transition>
        <transition enter-active-class="animate__animated animate__fadeInRight animate__delay-1s animate__faster" leave-active-class="animate__animated animate__fadeOutRight animate__faster">
          <router-link :to="toURL()">
            Back
          </router-link>
        </transition>
      </div>
    </div>
    <div class="wrapper--client" :class="{ openFloatingNav: showOptions }">
      <div class="top_grid" v-if="!blocks">
        <!-- Update the client details -->
        <form class="client_info" v-on:submit.prevent="update_client()">
          <input class="client_info--name title" type="text" aria-label="Client name" autocomplete="name" v-model="$parent.client_details.name" @blur="update_client()"/>
          <div class="client_info__more-details">
            <div class="wrapper--info">
              <label>
                <b>Email: </b>
                <input class="input--forms allow-text-overflow" type="email" autocomplete="email" v-model="$parent.client_details.email" @blur="update_client()"/>
              </label>
            </div>
            <div class="wrapper--info">
              <label>
                <b>Phone: </b>
                <input class="input--forms allow-text-overflow" type="tel" inputmode="tel" autocomplete="tel" v-model="$parent.client_details.number" @blur="update_client()" minlength="9" maxlength="14" pattern="\d+" id="phone" />
              </label>
            </div>
            <button @click="createClient()" class="button--verify button" :disabled="clientAlready">{{ clientAlreadyMsg }}</button>
          </div>
        </form>
      </div>
      <transition enter-active-class="animate__animated animate__fadeIn animate__delay-1s animate__faster" leave-active-class="animate__animated animate__fadeOut animate__faster">
        <router-view :key="$route.fullPath"></router-view>
      </transition>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import InlineSvg from 'vue-inline-svg'
  import {email, emailText, resetEmail, resetEmailText} from '../components/email'
  import Toolkit from '../components/Toolkit.vue'

  export default {
    components: {
      InlineSvg,
      Toolkit
    },
    data: function () {
      return {
        keepLoaded: false,
        showOptions: false,
        no_programmes: false,
        loading_programmes: true,
        blocks: false,
        no_workouts: false,
        loading_workouts: true,
        editClientNotes: false,
        clientAlreadyMsg: 'Loading...',
        clientAlready: true,
        clientSuspend: null
      }
    },
    async created () {
      this.created()
      await this.$parent.setup()
      await this.get_client_details()
      this.checkClient()
      this.keepLoaded = true
    },
    beforeDestroy () {
      this.keepLoaded = false
      this.$parent.client_details = null
    },
    methods: {
      toURL () {
        var url = '/'
        if (window.location.href.includes('block') === true) {
          url = `/client/${this.$route.params.client_id}/`
        }
        return url
      },
      async checkClient () {
        try {
          const result = await axios.get(`https://cors-anywhere.herokuapp.com/${process.env.ISSUER}/api/v1/users?filter=profile.email+eq+"${this.$parent.client_details.email}"&limit=1`,
            {
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': process.env.AUTH_HEADER
              }
            }
          )
          if (result.data[0].status === 'ACTIVE' || result.data[0].status === 'PROVISIONED') {
            this.clientAlready = true
            this.clientAlreadyMsg = 'Activated'
          } else if (result.data[0].status === 'SUSPENDED') {
            this.clientSuspend = result.data[0].id
            this.clientAlready = false
            this.clientAlreadyMsg = 'Give Access'
          }
        } catch (e) {
          this.clientAlready = false
          this.clientAlreadyMsg = 'Give Access'
        }
      },
      async createClient () {
        this.$parent.loading = true
        if (this.clientSuspend) {
          await axios.post(`https://cors-anywhere.herokuapp.com/${process.env.ISSUER}/api/v1/users/${this.clientSuspend}/lifecycle/unsuspend`,
            {},
            {
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': process.env.AUTH_HEADER
              }
            }
          )
          const password = await axios.post(`https://cors-anywhere.herokuapp.com/${process.env.ISSUER}/api/v1/users/${this.clientSuspend}/lifecycle/reset_password?sendEmail=false`,
            {},
            {
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': process.env.AUTH_HEADER
              }
            }
          )
          await axios.post('https://cors-anywhere.herokuapp.com/https://api.sendgrid.com/v3/mail/send',
            {
              'personalizations': [
                {
                  'to': [
                    {
                      'email': this.$parent.client_details.email
                    }
                  ],
                  'subject': 'Welcome Back'
                }
              ],
              'from': {
                'email': 'Train In Blocks <no-reply@traininblocks.com>'
              },
              'content': [
                {
                  'type': 'text/plain',
                  'value': resetEmailText(password.data.resetPasswordUrl.replace(process.env.ISSUER, 'https://auth.traininblocks.com'))
                },
                {
                  'type': 'text/html',
                  'value': resetEmail(password.data.resetPasswordUrl.replace(process.env.ISSUER, 'https://auth.traininblocks.com'))
                }
              ]
            },
            {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': process.env.SENDGRID
              }
            }
          )
          alert('An activation email was sent to your client.')
          this.checkClient()
          this.$parent.loading = false
        } else {
          try {
            const oktaOne = await axios.post(`https://cors-anywhere.herokuapp.com/${process.env.ISSUER}/api/v1/users?activate=false`,
              {
                'profile': {
                  'firstName': this.$parent.client_details.email,
                  'email': this.$parent.client_details.email,
                  'login': this.$parent.client_details.email,
                  'color': '#ffffff',
                  'ga': true,
                  'client_id_db': this.$parent.client_details.client_id,
                  'user_type': 'Client'
                },
                'groupIds': [
                  '00gf929legrtSjxOe4x6'
                ]
              },
              {
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                  'Authorization': process.env.AUTH_HEADER
                }
              }
            )
            const oktaTwo = await axios.post(`https://cors-anywhere.herokuapp.com/${process.env.ISSUER}/api/v1/users/${oktaOne.data.id}/lifecycle/activate?sendEmail=false`,
              {},
              {
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                  'Authorization': process.env.AUTH_HEADER
                }
              }
            )
            await axios.post('https://cors-anywhere.herokuapp.com/https://api.sendgrid.com/v3/mail/send',
              {
                'personalizations': [
                  {
                    'to': [
                      {
                        'email': this.$parent.client_details.email
                      }
                    ],
                    'subject': 'Welcome to Train In Blocks'
                  }
                ],
                'from': {
                  'email': 'Train In Blocks <no-reply@traininblocks.com>'
                },
                'content': [
                  {
                    'type': 'text/plain',
                    'value': emailText(oktaTwo.data.activationUrl.replace(process.env.ISSUER, 'https://auth.traininblocks.com'))
                  },
                  {
                    'type': 'text/html',
                    'value': email(oktaTwo.data.activationUrl.replace(process.env.ISSUER, 'https://auth.traininblocks.com'))
                  }
                ]
              },
              {
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': process.env.SENDGRID
                }
              }
            )
            alert('An activation email was sent to your client.')
            this.checkClient()
            this.$parent.loading = false
          } catch (e) {
            this.$parent.loading = false
            alert('Something went wrong, please try that again.')
            console.error(e)
          }
        }
      },
      updateClientNotes () {
        this.update_client()
        this.editClientNotes = false
      },
      created () {
        var x
        for (x in this.$parent.posts) {
          // If client matches client in route
          if (this.$parent.posts[x].client_id === this.$route.params.client_id) {
            // Set client_details variable with client details
            this.$parent.client_details = this.$parent.posts[x]
          }
        }
      },
      async force_get_workouts () {
        try {
          // Loop through programmes
          var f
          for (f in this.$parent.client_details.programmes) {
            // If programme matches programme in route
            // eslint-disable-next-line
            if (this.$parent.client_details.programmes[f].id == this.$route.params.id) {
              axios.defaults.headers.common['Authorization'] = `Bearer ${await this.$auth.getAccessToken()}`
              // eslint-disable-next-line
              const response_programmes = await axios.get(`https://api.traininblocks.com/workouts/${this.$parent.client_details.programmes[f].id}`)
              // If there are no workouts
              if (response_programmes.data.length === 0) {
                this.no_workouts = true
                this.$parent.client_details.programmes[f].workouts = false
                // If there are workouts set the client_details to include workouts
              } else {
                this.no_workouts = false
                this.$parent.client_details.programmes[f].workouts = response_programmes.data
              }
              // Sync client_details with posts
              // Loop through clients
              //eslint-disable-next-line
              var y
              for (y in this.$parent.posts) {
                // If client matches client in route
                //eslint-disable-next-line
                if (this.$parent.posts[f].client_id == this.$route.params.client_id) {
                  this.$parent.posts[f] = this.$parent.client_details
                }
              }
              // Update the localstorage with the workouts
              localStorage.setItem('posts', JSON.stringify(this.$parent.posts))
            }
          }
          this.loading_workouts = false
        } catch (e) {
          this.$parent.loading = false
          alert('Something went wrong, please try that again.')
          console.error(e)
        }
      },
      async get_workouts () {
        try {
          // Loop through programmes
          var f
          for (f in this.$parent.client_details.programmes) {
            // If programme matches programme in route
            // eslint-disable-next-line
            if (this.$parent.client_details.programmes[f].id == this.$route.params.id) {
              // If client_details.programmes.workouts is set to false
              if (this.$parent.client_details.programmes[f].workouts === false) {
                this.no_workouts = true
              // If client_details.programmes.workouts is not set then query the API
              } else if (!this.$parent.client_details.programmes[f].workouts) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${await this.$auth.getAccessToken()}`
                // eslint-disable-next-line
                const response_programmes = await axios.get(`https://api.traininblocks.com/workouts/${this.$parent.client_details.programmes[f].id}`)
                // If there are no workouts
                if (response_programmes.data.length === 0) {
                  this.no_workouts = true
                  this.$parent.client_details.programmes[f].workouts = false
                  // If there are workouts set the client_details to include workouts
                } else {
                  this.$parent.client_details.programmes[f].workouts = response_programmes.data
                }
                // Sync client_details with posts
                // Loop through clients
                //eslint-disable-next-line
                var y
                for (y in this.$parent.posts) {
                  // If client matches client in route
                  //eslint-disable-next-line
                  if (this.$parent.posts[f].client_id == this.$route.params.client_id) {
                    this.$parent.posts[f] = this.$parent.client_details
                  }
                }
                // Update the localstorage with the workouts
                localStorage.setItem('posts', JSON.stringify(this.$parent.posts))
              }
            }
          }
          this.loading_workouts = false
        } catch (e) {
          this.$parent.loading = false
          alert('Something went wrong, please try that again.')
          console.error(e)
        }
      },
      async force_get_client_details () {
        try {
          // Loop through clients
          var x
          for (x in this.$parent.posts) {
            // If client matches client in route
            // eslint-disable-next-line
            if (this.$parent.posts[x].client_id == this.$route.params.client_id) {
              // Set client_details variable with client details
              this.$parent.client_details = this.$parent.posts[x]
              // Query API for programmes
              axios.defaults.headers.common['Authorization'] = `Bearer ${await this.$auth.getAccessToken()}`
              // eslint-disable-next-line
              const response_programmes = await axios.get(`https://api.traininblocks.com/programmes/${this.$parent.posts[x].client_id}`)
              // If there are no programmes
              if (response_programmes.data.length === 0) {
                this.no_programmes = true
                this.$parent.posts[x].programmes = false
                // If there are programmes set the posts to include programmes
              } else {
                this.no_programmes = false
                this.$parent.posts[x].programmes = response_programmes.data
                // Update the localstorage with the programmes
                localStorage.setItem('posts', JSON.stringify(this.$parent.posts))
              }
              this.$parent.client_details = this.$parent.posts[x]
              this.loading_programmes = false
            }
          }
        } catch (e) {
          this.$parent.loading = false
          alert('Something went wrong, please try that again.')
          console.error(e)
        }
        await this.get_workouts()
      },
      async get_client_details () {
        try {
          // Loop through clients
          var x
          for (x in this.$parent.posts) {
            // If client matches client in route
            //eslint-disable-next-line
            if (this.$parent.posts[x].client_id == this.$route.params.client_id) {
              // Set client_details variable with client details
              this.$parent.client_details = this.$parent.posts[x]
              // If client_details.programmes is set to false
              if (this.$parent.posts[x].programmes === false) {
                this.no_programmes = true
              // If client_details.programmes is not set then query the API
              } else if (!this.$parent.posts[x].programmes) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${await this.$auth.getAccessToken()}`
                // eslint-disable-next-line
                const response_programmes = await axios.get(`https://api.traininblocks.com/programmes/${this.$parent.posts[x].client_id}`)
                // If there are no programmes
                if (response_programmes.data.length === 0) {
                  this.no_programmes = true
                  this.$parent.posts[x].programmes = false
                  // If there are programmes set the posts to include programmes
                } else {
                  this.$parent.posts[x].programmes = response_programmes.data
                  // Update the localstorage with the programmes
                  localStorage.setItem('posts', JSON.stringify(this.$parent.posts))
                }
              }
              this.$parent.client_details = this.$parent.posts[x]
              this.loading_programmes = false
            }
          }
        } catch (e) {
          this.$parent.loading = false
          alert('Something went wrong, please try that again.')
          console.error(e)
        }
        await this.get_workouts()
      },
      async update_client () {
        axios.defaults.headers.common['Authorization'] = `Bearer ${await this.$auth.getAccessToken()}`
        try {
          // eslint-disable-next-line
          const response_update_clients = await axios.post(`https://api.traininblocks.com/clients`,
            {
              'id': this.$parent.client_details.client_id,
              'name': this.$parent.client_details.name,
              'email': this.$parent.client_details.email,
              'number': this.$parent.client_details.number,
              'notes': this.$parent.client_details.notes
            }
          )
          // Get the client information again as we have just updated the client
          await this.$parent.clients()
          await this.$parent.clients_to_vue()
        } catch (e) {
          this.$parent.loading = false
          alert('Something went wrong, please try that again.')
          console.error(e)
        }
      }
    }
  }
</script>
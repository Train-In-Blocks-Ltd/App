<style>
  #client {
    background-color: #F4F4F4;
    position: relative
  }
  .wrapper--client {
    background-color: white;
    transition: all 1.4s cubic-bezier(.165, .84, .44, 1)
  }
  .openFloatingNav {
    transform: translateX(-12rem)
  }

  /* Client Info */
  .client_info {
    display: grid;
    grid-gap: 1rem
  }
  #client .client_info label, .label--duration {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: min-content minmax(200px, 300px);
    grid-gap: 1rem;
    align-items: center
  }
  #duration, #start, .workout-date {
    cursor: pointer
  }
  #client .client_info input:not([type='submit']), #duration {
    background-color: initial;
    border: none;
    border-bottom: 2px solid #28282800;
    padding: .4rem 0;
    outline-width: 0;
    transition: all .6s cubic-bezier(.165, .84, .44, 1)
  }
  #client .client_info input:not([type='submit']):hover, #duration:hover {
    border-bottom: 2px solid #28282880
  }
  #client .client_info input:not([type='submit']):focus, #duration:focus {
    border-bottom: 2px solid #282828
  }
  .client_info__more-details {
    width: 400px
  }
  #phone {
    width: 50%
  }
  #client .client_info input.client_info--name {
    font-size: 3.75rem;
    letter-spacing: .1rem;
    padding: .6rem 0;
    margin: 0
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
  }

  /* For Mobile */
  @media (max-width: 576px) {
    /* Overall */
    .client_info {
      grid-gap: 0;
      width: 90vw
    }
    #client .client_info input.client_info--name {
      font-size: 2rem
    }
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
    <div v-show="keepLoaded" class="floating_nav">
      <transition enter-active-class="animate__animated animate__fadeIn animate__delay-1s animate__faster">
        <inline-svg v-show="!showOptions" @click="showOptions = true" class="icon--options" :src="require('../../assets/svg/hamburger.svg')" />
      </transition>
      <transition enter-active-class="animate__animated animate__fadeIn animate__delay-1s animate__faster">
        <inline-svg v-show="showOptions" @click="showOptions = false" class="icon--options" :src="require('../../assets/svg/close.svg')" />
      </transition>
      <div class="client--options" v-for="(clients, index) in $parent.posts" :key="index" v-show="clients.client_id == $route.params.client_id && showOptions">
        <transition enter-active-class="animate__animated animate__fadeInRight animate__delay-1s animate__faster" leave-active-class="animate__animated animate__fadeOutRight animate__faster">
          <div class="archive-client">
            <a href="javascript:void(0)" v-on:click="$parent.client_archive(clients.client_id, index)">Archive Client</a>
          </div>
        </transition>
      </div>
    </div>
    <div class="wrapper--client" :class="{ openFloatingNav: showOptions }">
      <div class="top_grid" v-if="!blocks">
        <!-- Update the client details -->
        <form class="client_info" v-on:submit.prevent="update_client()">
          <input v-autowidth="{ maxWidth: '600px', minWidth: '20px', comfortZone: 80 }" class="client_info--name title" type="text" name="name" autocomplete="name" v-model="$parent.client_details.name" v-on:click="editing()"/>
          <div class="client_info__more-details">
            <label><b>Email: </b><input class="input--forms allow-text-overflow" v-autowidth="{ maxWidth: '400px', minWidth: '20px', comfortZone: 24 }" type="email" name="email" autocomplete="email" v-model="$parent.client_details.email" v-on:click="editing()"/></label>
            <label><b>Phone: </b><input class="input--forms allow-text-overflow" v-autowidth="{ maxWidth: '300px', minWidth: '20px', comfortZone: 24 }" type="tel" name="number" inputmode="tel" autocomplete="tel" v-model="$parent.client_details.number" v-on:click="editing()" minlength="9" maxlength="14" pattern="\d+" id="phone" /></label>
            <button @click="createClient()" class="button">Give Access</button>
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
  import {email, emailText} from '../components/email'

  export default {
    components: {
      InlineSvg
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
        editClientNotes: false
      }
    },
    async created () {
      this.created()
      await this.$parent.setup()
      await this.get_client_details()
      this.keepLoaded = true
    },
    beforeDestroy () {
      this.keepLoaded = false
      this.$parent.client_details = null
    },
    methods: {
      async createClient () {
        try {
          const oktaOne = await axios.post('https://cors-anywhere.herokuapp.com/https://dev-183252.okta.com/api/v1/users?activate=false',
            {
              'profile': {
                'firstName': this.$parent.client_details.name,
                'lastName': this.$parent.client_details.name,
                'email': this.$parent.client_details.email,
                'login': this.$parent.client_details.email,
                'color': null,
                'ga': true,
                'client_id_db': this.$parent.client_details.client_id
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
          const oktaTwo = await axios.post(`https://cors-anywhere.herokuapp.com/https://dev-183252.okta.com/api/v1/users/${oktaOne.data.id}/lifecycle/activate?sendEmail=false`,
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
                      'email': this.$parent.client_details.email,
                      'name': this.$parent.client_details.name
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
                  'value': emailText(oktaTwo.data.activationUrl)
                },
                {
                  'type': 'text/html',
                  'value': email(oktaTwo.data.activationUrl)
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
        } catch (e) {
          console.log(e.toString())
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
          console.log(e.toString())
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
          console.log(e.toString())
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
          console.log(e.toString())
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
          console.log(e.toString())
        }
        await this.get_workouts()
      },
      async update_client () {
        this.$parent.loading = true
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
          this.$parent.loading = false
        } catch (e) {
          console.log(e.toString())
        }
      },
      editing () {
        // Set vue self
        var self = this

        function click (e) {
          if (!document.querySelector('.client_info').contains(e.target)) {
            // Update the workout
            self.update_client()
            window.removeEventListener('click', click)
          }
        }
        // Wait 1 second before applying the event listener to avoid registering the click to open the box
        setTimeout(
          function () {
            // Add event listener for clicking outside box
            window.addEventListener('click', click)
          }
        , 1000)
      }
    }
  }
</script>
<style>
  #client {
    position: relative;
    padding: 5rem 3.75rem
  }

  /* Client Info */
  .client_info {
    display: grid;
    grid-gap: 1rem
  }
  #client .client_info label {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: min-content minmax(200px, 300px);
    grid-gap: 1rem;
    align-items: center
  }
  #client .client_info input:not([type='submit']) {
    background-color: initial;
    border: none;
    border-bottom: 2px solid #28282800;
    padding: 0;
    font-size: 1rem;
    outline-width: 0;
    transition: all .6s cubic-bezier(.165, .84, .44, 1)
  }
  #client .client_info input:not([type='submit']):hover {
    border-bottom: 2px solid #28282880
  }
  #client .client_info input:not([type='submit']):focus {
    border-bottom: 2px solid #282828
  }
  #client .client_info input.client_info--name {
    font-size: 3.75rem;
    letter-spacing: .5rem;
    margin: 0;
    width: 70%
  }

  /* Top Grid */
  .top_grid {
    display: grid;
    grid-template-columns: 1fr .4fr
  }

  /* Floating Nav */
  .floating_nav {
    position: fixed;
    right: 5rem;
    top: 5rem;
    display: grid;
    justify-items: right;
    text-align: right;
    border-right: 2px solid #282828;
    padding: 0 .5rem;
    border-radius: 10px 0 0 10px;
    background-color: white
  }
  .floating_nav a {
    display: grid;
    grid-template-columns: 1fr 24px;
    grid-gap: .6rem;
    width: fit-content;
    position: relative;
    color: #282828;
    text-decoration: none;
    margin: .5rem 0
  }
  .floating_nav a:hover {
    color: #282828
  }
  .floating_nav a:before {
    content: '';
    position: absolute;
    width: 0%;
    height: 2px;
    bottom: -4px;
    right: 0;
    background-color: #282828;
    opacity: 0;
    transition: all .6s cubic-bezier(.165, .84, .44, 1)
  }
  .floating_nav a:hover:before {
    opacity: 1;
    width: 100%
  }
  .floating_nav .archive-client {
    margin: .5rem 0
  }
  .floating_nav p {
    margin: 0;
    align-self: end
  }
  svg.floating_nav__icon path {
    fill: #282828
  }

  /* Client Notes */
  .client_notes {
    position: fixed;
    right: 20rem;
    background-color: white;
    z-index: 9;
    text-align: left;
    max-width: 400px;
    width: 100%;
    box-shadow: 0 4px 20px rgba(0, 0, 0, .15);
    display: grid;
    grid-template-rows: 40px auto;
    align-items: center
  }
  .client_notes--header {
    z-index: 10;
    box-shadow: 0 4px 10px rgba(0, 0, 0, .1);
    color: #282828;
    padding: 0 .5rem;
    height: 100%;
    display: grid;
    align-items: center
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
    .floating_nav p {
      display: none
    }
    .client_notes {
      right: 10rem
    }
  }
  @media (max-width: 768px) {
    #client .client_info input:not([type='submit']):hover {
      border-bottom: 2px solid #28282800
    }
  }
  @media (max-width: 576px) {
    .floating_nav {
      right: 3rem
    }
    #client {
      margin: 5rem 2rem
    }
    .client_notes {
      right: 6rem;
      max-width: 250px;
      height: 400px
    }
    .ql-editor {
      height: 310px
    }
  }
  @media (max-width: 360px) {
    .floating_nav {
      right: 2rem
    }
    .client_notes {
      right: 5rem;
      max-width: 230px;
      height: 350px
    }
    .ql-editor {
      height: 260px
    }
  }
</style>

<template>
  <div id="client" v-if="$parent.client_details">
    <!-- Don't show if on blocks page because blocks page renders slightly different top ui -->
    <div class="top_grid" v-if="!blocks">
      <!-- Update the client details -->
      <form class="client_info" v-on:submit.prevent="update_client()">
        <input class="client_info--name title" type="text" name="name" autocomplete="name" v-model="$parent.client_details.name" v-on:click="editing()"/>
        <label><b>Email: </b><input type="email" name="email" autocomplete="email" v-model="$parent.client_details.email" v-on:click="editing()"/></label>
        <label><b>Number: </b><input type="tel" name="number" inputmode="tel" autocomplete="tel" v-model="$parent.client_details.number" v-on:click="editing()" minlength="9" maxlength="14" pattern="\d+" /></label>
      </form>
      <div class="floating_nav">
        <a href="javascript:void(0)" v-on:click="client_notes_function()"><p>Client Notes</p><inline-svg class="floating_nav__icon" :src="require('../../assets/svg/User.svg')"/></a>
        <div v-for="(clients, index) in $parent.posts" :key="index">
          <div class="archive-client" v-if="clients.client_id == $route.params.client_id">
            <a href="javascript:void(0)" v-on:click="$parent.client_archive(clients.client_id, index)"><p>Archive Client</p><inline-svg class="floating_nav__icon" :src="require('../../assets/svg/ArchiveIconClose.svg')"/></a>
          </div>
        </div>
      </div>
    </div>
    <div v-show="client_notes" class="client_notes">
      <div class="client_notes--header">
        <p>Client Information</p>
      </div>
      <quill v-model="$parent.client_details.notes" output="html" class="client_notes--quill quill" :config="quillSettings"/>
    </div>
    <!-- Router View for Client Pages -->
    <router-view :key="$route.fullPath" :quillSettings="quillSettings"></router-view>
  </div>
</template>

<script>
  import axios from 'axios'
  import InlineSvg from 'vue-inline-svg'

  export default {
    components: {
      InlineSvg
    },
    props: ['quillSettings'],
    data: function () {
      return {
        no_programmes: false,
        loading_programmes: true,
        client_notes: false,
        blocks: false,
        no_workouts: false,
        loading_workouts: true
      }
    },
    async created () {
      this.created()
      await this.$parent.setup()
      await this.get_client_details()
    },
    methods: {
      client_notes_function () {
        this.client_notes = !this.client_notes

        // Set vue self
        var self = this

        function click (e) {
          // If box is open
          if (self.client_notes) {
            if (!document.querySelector('.client_notes').contains(e.target)) {
              // Update the workout
              self.update_client()
              window.removeEventListener('click', click)
              self.client_notes = false
            }
          }
        }
        // Wait 1 second before applying the event listener to avoid registering the click to open the box
        setTimeout(
          function () {
            // Add event listener for clicking outside box
            window.addEventListener('click', click)
          }
        , 1000)
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
        this.get_workouts()
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
        this.get_workouts()
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
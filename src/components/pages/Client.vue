<style>
  /* Client Info */
  .client_info {
    display: grid;
    grid-gap: 1rem
  }
  #client .client_info label {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: min-content minmax(200px, 300px);
    grid-gap: 1rem
  }
  #client .client_info input:not([type='submit']) {
    background-color: initial;
    border: none;
    padding: 0;
    font-size: 1rem
  }
  #client .client_info input.client_info--name {
    font-size: 3.75rem;
    letter-spacing: .15rem;
    margin: 0;
    width: 100%
  }

  /* Top Grid */
  .top_grid {
    display: grid;
    grid-template-columns: 1fr 1fr
  }

  /* Floating Nav */
  .floating_nav {
    text-align: right;
    border-right: 2px solid #282828;
    padding-right: .5rem
  }
  .floating_nav a {
    display: inline-block;
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

  /* Client Notes */
  #client {
    position: relative
  }
  .client_notes {
    position: absolute;
    right: 0;
    z-index: 9;
    text-align: left;
    max-width: 400px;
    width: 100%;
    box-shadow: 0 4px 20px rgba(0, 0, 0, .15);
    background-color: rgb(
      var(--red),
      var(--green),
      var(--blue)
    );
    display: grid;
    grid-template-rows: 40px auto;
    align-items: center
  }
  .client_notes--header {
    cursor: grab;
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
    .top_grid {
      grid-template-columns: 1fr
    }
    .floating_nav {
      text-align: left;
      border: none;
      display: grid
    }
    .floating_nav a:before {
      left: 0
    }
    .floating_nav:before {
      content: '';
      height: 2px;
      background-color: #282828;
      width: 3rem;
      margin: 1rem 0
    }
    .floating_nav:after {
      content: '';
      height: 2px;
      background-color: #282828;
      width: 5rem;
      margin: 1rem 0
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
      <div class="floating_nav--container">
        <div class="floating_nav">
          <a href="javascript:void(0)" v-on:click="client_notes_function()">Client Notes</a>
          <div v-for="(clients, index) in $parent.posts" :key="index">
            <div v-if="clients.name == $route.params.name">
              <a href="javascript:void(0)" v-on:click="$parent.client_archive(clients.client_id, index)">Archive Client</a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-show="client_notes" class="client_notes">
      <div class="client_notes--header">
        <p>Client Information</p>
      </div>
      <quill v-model="$parent.client_details.notes" output="html" class="client_notes--quill quill"></quill>
    </div>
    <!-- Router View for Client Pages -->
    <router-view :key="$route.fullPath"></router-view>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
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
        this.dragElement(document.getElementById('client_notes'))

        // Set vue self
        var self = this

        function click (e) {
          // If box is open
          if (self.client_notes) {
            if (!document.getElementById('client_notes').contains(e.target)) {
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
      dragElement (elmnt) {
        let pos1 = 0
        let pos2 = 0
        let pos3 = 0
        let pos4 = 0

        document.getElementById(elmnt.id + '_header').onmousedown = dragMouseDown

        function dragMouseDown (e) {
          e = e || window.event
          e.preventDefault()
          // get the mouse cursor position at startup:
          pos3 = e.clientX
          pos4 = e.clientY
          document.onmouseup = closeDragElement
          // call a function whenever the cursor moves:
          document.onmousemove = elementDrag
        }

        function elementDrag (e) {
          e = e || window.event
          e.preventDefault()
          // calculate the new cursor position:
          pos1 = pos3 - e.clientX
          pos2 = pos4 - e.clientY
          pos3 = e.clientX
          pos4 = e.clientY
          // set the element's new position:
          elmnt.style.top = (elmnt.offsetTop - pos2) + 'px'
          elmnt.style.left = (elmnt.offsetLeft - pos1) + 'px'
        }

        function closeDragElement () {
          // stop moving when mouse button is released:
          document.onmouseup = null
          document.onmousemove = null
        }
      },
      created () {
        var x
        for (x in this.$parent.posts) {
          // If client matches client in route
          if (this.$parent.posts[x].name === this.$route.params.name) {
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
                if (this.$parent.posts[f].name == this.$route.params.name) {
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
                  if (this.$parent.posts[f].name == this.$route.params.name) {
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
            if (this.$parent.posts[x].name === this.$route.params.name) {
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
            if (this.$parent.posts[x].name === this.$route.params.name) {
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
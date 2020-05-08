<style scoped>
  #graph {
    display: grid;
    grid-template-columns: 2fr 1fr;
    grid-gap: 10px
  }
  .program_wrapper {
    display: grid;
    grid-template-columns: repeat(auto-fill, 300px);
    grid-gap: 40px
  }
  .program_container:first-of-type {
    margin-left: 0
  }
  .program_container:last-of-type {
    margin-right: 0
  }
  .program_link {
    padding: 1.5rem;
    border: 1px solid rgb(
      var(--accessible-color),
      var(--accessible-color),
      var(--accessible-color)
    );
    display: block
  }
  .program_link:hover {
    text-decoration: none;
    border: 2px solid rgb(
      var(--accessible-color),
      var(--accessible-color),
      var(--accessible-color)
    );
    padding: calc(1.5rem - 1px)
  }
  .program_container h3 {
    margin-top: 0;
    font-size: 1.25rem;
    margin-bottom: 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis
  }
  .program_container p {
    font-size: 0.8rem;
    font-weight: 500;
    margin: .375rem 0
  }
  .program_container p:last-of-type {
    margin-bottom: 0
  }
  #add_programme_link {
    margin-top: 1.75rem
  }
  .add_new_programme_container {
    margin: .75rem 0
  }
  .add_new_programme_container > form {
    display: grid;
    grid-template-columns: 1fr;
    width: 30vw
  }
</style>
<template>
    <div>
      <!-- This is where we stitch all the blocks all-together! -->
      <h2>Programme</h2>
      <div id="graph">
        <div style="background-color: #C4C4C4; height: 20vh; text-align: center">Visualisation Goes Here!!</div>
        <div style="background-color: #E1E1E1; height: 20vh; text-align: center">Programme Data Goes Here!!</div>
      </div>
      <div>
        <h3>Blocks</h3>
        <p v-if="this.$parent.no_programmes">No programmes yet. You can add one below.</p>
        <p v-if="this.$parent.loading_programmes">Loading programmes...</p>
        <p v-if="this.error"><b>{{error}}</b></p>
        <div v-if="!this.$parent.no_programmes && !this.error" class="program_wrapper">
          <div v-for="(block, index) in this.$parent.$parent.client_details.programmes"
              :key="index" class="program_container">
              <router-link class="program_link" :to="'blocks/'+block.id">
              <h3>{{block.name}}</h3>
              <p><b>Duration: </b>{{block.duration}}</p>
              <p><b>Start: </b>{{block.start}}</p>
              </router-link>
          </div>
        </div>
        <button v-if="!creating" id="add_programme_link" class="button" v-on:click="creation()">New Block</button>
        <p class="response" v-if="!creating">{{response}}</p>
        <div class="add_new_programme_container" v-if="creating">
          <h3>New Block Incoming...</h3>
          <form name="add_program" v-on:submit.prevent="save()">
              <label for="name"><b>Name: </b></label><input type="text" id="name" name="name" v-model="new_block.name" required/> 
              <label for="duration"><b>Duration (in weeks): </b></label><input type="number" id="duration" name="duration" inputmode="decimal" v-model="new_block.duration" required/>
              <label for="start"><b>Start: </b></label><input type="date" id="start" name="start" v-model="new_block.start" required />
              <div class="form_buttons">
                  <input type="submit" class="button" value="Save" />
                  <button class="button" v-on:click="close()">Close</button>
                  <Loader></Loader>
              </div>
          </form>
        </div>
      </div>
    </div>
</template>
<script>
  import axios from 'axios'
  import qs from 'qs'
  import Loader from '../../components/Loader'

  export default {
    components: {
      Loader
    },
    data: function () {
      return {
        error: '',
        response: '',
        creating: false,
        new_block: {
          name: '',
          duration: '',
          start: ''
        }
      }
    },
    methods: {
      creation () {
        this.creating = true
      },
      close () {
        this.creating = false
        this.response = ''
      },
      async save () {
        try {
          this.$parent.$parent.loading = true
          // eslint-disable-next-line
          const response_save_block = await axios.put(`https://api.traininblocks.com/programmes/${this.new_block.name}`,
            qs.stringify({
              client_id: this.$parent.$parent.client_details.client_id,
              duration: this.new_block.duration,
              start: this.new_block.start
            }),
            {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${await this.$auth.getAccessToken()}`
              }
            }
          )
          // eslint-disable-next-line
          this.response = response_save_block.data

          // Set old programmes to null so that they can be repopulated
          var x
          for (x in this.$parent.$parent.posts) {
            if (this.$parent.$parent.posts[x].name === this.$route.params.name) {
              this.$parent.$parent.posts[x].programmes = null
            }
          }
          // Get the new programmes
          await this.$parent.get_client_details()

          this.$parent.$parent.loading = false

          this.close()

          this.new_block = {
            name: '',
            duration: '',
            start: ''
          }
        } catch (e) {
          console.error(`${e}`)
        }
      }
    }
  }
</script>
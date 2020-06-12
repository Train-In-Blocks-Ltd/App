<style scoped>
  /* Remove */
  #graph {
    display: grid;
    grid-template-columns: 2fr 1fr;
    grid-gap: 10px
  }

  /* Overall */
  .container--block-links {
    display: grid;
    grid-gap: 4rem;
    grid-template-columns: .8fr 300px
  }

  /* Client Notes */
  .client-notes {
    margin-top: 6rem;
    height: fit-content;
    border-radius: 3px;
    background-color: #F2F2F2;
    transition: all 1s cubic-bezier(.165, .84, .44, 1)
  }
  .client-notes__header {
    margin: 0;
    padding: 1rem
  }
  .text--date {
    font-size: .8rem
  }
  .bottom-bar {
    padding: .6rem 1rem
  }
  .bottom-bar .button {
    margin: 0
  }
  .show-client-notes {
    padding: 12px 15px;
    max-height: 314px;
    color: #282828;
    line-height: 1.42;
    overflow-y: auto;
    font-size: .8rem
  }
  .show-client-notes h2 {
    font-size: 1.5rem
  }
  .show-client-notes p, .show-client-notes ul, .show-client-notes ol {
    text-decoration: none;
    margin: 0;
    padding: 0
  }
  .activeClientNotes {
    background-color: white;
    box-shadow: 0 0 20px 10px #28282810
  }

  /* Blocks */
  .blocks_grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, 300px);
    grid-gap: 40px;
    margin-bottom: 2rem
  }
  .block_container:first-of-type {
    margin-left: 0
  }
  .block_container:last-of-type {
    margin-right: 0
  }
  .block_container--link {
    padding: 1.5rem;
    border-radius: 3px;
    display: block;
    box-shadow: 0 0 20px 10px #28282810;
    transition: box-shadow .4s, background-color .4s, transform .1s cubic-bezier(.165, .84, .44, 1)
  }
  .block_container--link:hover {
    transform: scale(1.01);
    text-decoration: none;
    box-shadow: 0 0 20px 10px #28282820;
    background-color: white
  }
  .block_container--link:active {
    transform: scale(.96);
    opacity: .6
  }
  .block_container--link h3 {
    margin-top: 0;
    font-size: 1.25rem;
    margin-bottom: 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis
  }
  .block_container--link p {
    font-size: .8rem;
    font-weight: 500;
    margin: .375rem 0
  }
  .block_container--link p:last-of-type {
    margin-bottom: 0
  }

  /* Add Block Form */
  .add_block_container {
    padding-top: 1rem
  }
  .add_block_container h3 {
    margin-top: 0
  }
  .add_block {
    grid-gap: 1rem
  }
  .add_block label {
    display: grid;
    grid-gap: .5rem
  }

  @media (max-width: 768px) {
    .block_container--link:hover {
      transform: scale(1);
      box-shadow: 0 0 20px 10px #28282810
    }
  }
</style>
<template>
    <div>
      <div class="spacer"/>
      <div class="container--block-links">
        <div>
          <h2 class="sub-title">Blocks</h2>
          <p v-if="this.$parent.no_programmes">No programmes yet. You can add one below.</p>
          <p v-if="this.$parent.loading_programmes">Loading programmes...</p>
          <div v-if="!this.$parent.no_programmes" class="blocks_grid">
            <div v-for="(block, index) in this.$parent.$parent.client_details.programmes"
                :key="index" class="block_container">
                <router-link class="block_container--link" :to="'block/' + block.id">
                  <h3>{{block.name}}</h3>
                  <p><b>Duration: </b>{{block.duration}}</p>
                  <p><b>Start: </b>{{block.start}}</p>
                </router-link>
            </div>
          </div>
          <button v-if="!creating" class="button" v-on:click="creation()">New Block</button>
          <p class="response" v-if="!creating">{{response}}</p>
          <div v-if="creating" class="add_block_container">
            <h3>New Block Incoming...</h3>
            <form class="form_grid add_block" name="add_programme" v-on:submit.prevent="save()">
              <label><b>Name: </b><input type="text" v-model="new_block.name" required/></label>
              <label><b>Duration (in weeks): </b><input type="number" inputmode="decimal" v-model="new_block.duration" required/></label>
              <label><b>Start: </b><input type="date" v-model="new_block.start" required /></label>
              <div class="form_buttons">
                <input type="submit" class="button" value="Save" />
                <button class="button" v-on:click="close()">Close</button>
                <Loader></Loader>
              </div>
            </form>
          </div>
        </div>
        <div :class="{activeClientNotes: $parent.editClientNotes}" class="client-notes">
          <div class="client-notes__header">
            <p><b>Client Information</b></p>
          </div>
          <quill v-show="$parent.editClientNotes" v-model="$parent.$parent.client_details.notes" output="html" class="quill animate__animated animate__fadeIn" :config="$parent.$parent.config"/>
          <div v-show="!$parent.editClientNotes" v-html="$parent.$parent.client_details.notes" class="show-client-notes animate__animated animate__fadeIn"/>
          <div class="bottom-bar">
            <button v-show="!$parent.editClientNotes" @click="$parent.editClientNotes = true" class="button button--edit">Edit</button>
            <button v-show="$parent.editClientNotes" @click="$parent.updateClientNotes()" class="button">Save</button>
          </div>
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
        response: '',
        creating: false,
        new_block: {
          name: '',
          duration: '',
          start: ''
        },
        editClientNotes: false
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
            if (this.$parent.$parent.posts[x].client_id === this.$route.params.client_id) {
              this.$parent.$parent.posts[x].programmes = null
            }
          }
          // Get the new programmes
          await this.$parent.force_get_client_details()

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
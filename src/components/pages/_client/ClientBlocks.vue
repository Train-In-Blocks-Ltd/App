<style scoped>
  /* Overall */
  .container--block-links {
    display: flex;
    justify-content: space-between
  }

  /* Client Notes */
  .client-notes {
    margin: 4rem auto;
    height: fit-content;
    border-left: 1px solid #E1E1E1;
    border-bottom: 1px solid #E1E1E1
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
    max-height: 293px;
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
    border: 2px solid #282828
  }

  /* Blocks */
  .blocks_grid {
    display: grid;
    grid-gap: 2rem;
    margin-bottom: 2rem
  }
  .block_container:first-of-type {
    margin-left: 0
  }
  .block_container:last-of-type {
    margin-right: 0
  }
  .block_container--link {
    display: grid;
    position: relative;
    grid-gap: 1rem;
    text-decoration: none;
    color: #282828;
    padding: 1rem 0;
    transition: all .4s cubic-bezier(.165, .84, .44, 1)
  }
  .block_container--link:before {
    content: '';
    position: absolute;
    opacity: .4;
    width: 95%;
    height: 1px;
    bottom: 0;
    left: 0;
    background-color: #282828;
    transition: all .6s cubic-bezier(.075, .82, .165, 1)
  }
  .block_container--link:hover:before {
    width: 100%;
    opacity: 1
  }
  .block_container--link__block-notes {
    font-size: .8rem
  }
  .block_container--link h3 {
    margin-top: 0;
    font-size: 1.4rem;
    margin-bottom: 0;
    overflow: hidden;
    text-overflow: ellipsis
  }
  .more-block-info {
    margin-top: 1rem
  }
  .block_container--link p {
    font-size: .8rem;
    font-weight: 500
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

  @media (min-width: 1024px) {
    .block_container--link {
      grid-template: 1fr/.8fr 1fr;
      grid-gap: 2rem
    }
  }

  /* For Mobile */
  @media (max-width: 576px) {
    .container--block-links {
      grid-template: .2fr 1fr/1fr;
      grid-template-areas:
        'b'
        'a'
    }
    .blocks_grid {
      grid-template-columns: 1fr
    }
  }
</style>
<template>
    <div>
      <div :class="{activeClientNotes: editClientNotes}" class="client-notes">
        <div class="client-notes__header">
          <p><b>Client Information</b></p>
        </div>
        <quill v-show="editClientNotes" v-model="$parent.$parent.client_details.notes" output="html" class="quill animate__animated animate__fadeIn" :config="$parent.$parent.config"/>
        <div v-if="!editClientNotes && $parent.$parent.client_details.notes !== ''" v-html="$parent.$parent.client_details.notes" class="show-client-notes animate__animated animate__fadeIn"/>
        <p v-if="!editClientNotes && $parent.$parent.client_details.notes === ''" class="show-client-notes">No client notes added...</p>
        <div class="bottom-bar">
          <button v-show="!editClientNotes" @click="editingClientNotes(true)" class="button button--edit">Edit</button>
          <button v-show="editClientNotes" @click="editingClientNotes(false)" class="button button--save">Save</button>
          <button v-show="editClientNotes" @click="editClientNotes = false" class="button button--cancel">Cancel</button>
        </div>
      </div>
      <div class="container--block-links__section">
        <h2 class="sub-title">Blocks</h2>
        <p v-if="this.$parent.no_programmes">No programmes yet. You can add one below.</p>
        <p v-if="this.$parent.loading_programmes">Loading programmes...</p>
        <div v-if="!this.$parent.no_programmes" class="blocks_grid">
          <div v-for="(block, index) in this.$parent.$parent.client_details.programmes"
              :key="index" class="block_container">
              <router-link class="block_container--link" :to="'block/' + block.id">
                <div class="block_container--link__info">
                  <h3>{{block.name}}</h3>
                  <div class="more-block-info">
                    <p><b>Duration: </b>{{block.duration}}</p>
                    <p><b>Start: </b>{{block.start}}</p>
                  </div>
                </div>
                <div v-html="block.notes" class="block_container--link__block-notes" />
              </router-link>
          </div>
        </div>
        <button v-if="!creating" class="button" @click="creation()">New Block</button>
        <p class="new-msg" v-if="!creating">{{response}}</p>
        <div v-if="creating" class="add_block_container">
          <h3>New Block</h3>
          <form class="form_grid add_block" name="add_programme" @submit.prevent="save()">
            <label><b>Name: </b><input class="input--forms" type="text" v-model="new_block.name" required/></label>
            <label><b>Duration: </b><input class="input--forms" type="number" min="1" v-model="new_block.duration" required/></label>
            <label><b>Start: </b><input class="input--forms" type="date" v-model="new_block.start" required /></label>
            <div class="form_buttons">
              <input type="submit" class="button button--save" value="Save" />
              <button class="button button--close cancel" @click="close()">Close</button>
            </div>
          </form>
        </div>
      </div>
    </div>
</template>

<script>
  import axios from 'axios'
  import qs from 'qs'

  export default {
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

      // CLIENT NOTES METHODS //-------------------------------------------------------------------------------

      editingClientNotes (state) {
        this.editClientNotes = state
        if (state) {
          window.addEventListener('keydown', this.quickSaveClient)
        } else {
          this.$parent.update_client()
          window.removeEventListener('keydown', this.quickSaveClient)
        }
      },
      quickSaveClient (key) {
        if (key.keyCode === 13 && key.ctrlKey === true) {
          this.$parent.update_client()
          this.editClientNotes = false
          window.removeEventListener('keydown', this.quickSaveClient)
        }
      },

      // BACKGROUND METHODS //-------------------------------------------------------------------------------

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
          const response_save_block = await axios.put('https://api.traininblocks.com/programmes',
            qs.stringify({
              name: this.new_block.name,
              client_id: this.$parent.$parent.client_details.client_id,
              duration: this.new_block.duration,
              start: this.new_block.start,
              block_color: ''
            }),
            {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${await this.$auth.getAccessToken()}`
              }
            }
          )
          this.response = 'Added New Block'
          this.$parent.$parent.responseDelay()

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
          this.$ga.event('Block', 'new')
        } catch (e) {
          this.$parent.$parent.loading = false
          this.$parent.$parent.errorMsg = e
          this.$parent.$parent.$modal.show('error')
          console.error(e)
        }
      }
    }
  }
</script>
<style>
  /* Client Notes */
  .client-notes {
    margin-top: 4rem
  }
  .client-notes__header {
    display: flex
  }
  .a--client-notes {
    color: #282828;
    font-size: .8rem;
    margin-left: 1rem;
    align-self: center;
    transition: all .6s cubic-bezier(.165, .84, .44, 1)
  }
  .a--client-notes:hover {
    opacity: .6
  }
  .client-notes-msg {
    margin: 1rem 0
  }

  /* Plans */
  .plan-top-bar {
    display: flex;
    justify-content: flex-end
  }
  .plan_grid {
    display: grid;
    grid-gap: 4rem;
    margin: 2rem 0
  }

  /* Add plan Form */
  .button--new-plan {
    margin: 1rem 0 2rem 0
  }
  .add_plan_link {
    padding-top: 1rem
  }
  .add_plan_link h3 {
    margin-top: 0
  }
  .add_plan {
    grid-gap: 1rem
  }
  .add_plan label {
    display: grid;
    grid-gap: .5rem
  }
</style>
<template>
    <div>
      <modal name="new-plan" height="100%" width="100%" :adaptive="true" :clickToClose="false">
        <div class="modal--new-plan">
          <div class="wrapper--centered-item">
            <h3>New Plan</h3>
            <form class="form_grid add_plan" name="add_plan" @submit.prevent="save(), $parent.$parent.willBodyScroll(true)">
              <label><b>Name: </b><input class="input--forms" type="text" v-model="new_plan.name" required/></label>
              <label><b>Duration: </b><input class="input--forms" type="number" min="1" v-model="new_plan.duration" required/></label>
              <label><b>Start: </b><input class="input--forms" type="date" v-model="new_plan.start" required /></label>
              <label><b>Type: </b>
                <select class="input--forms" v-model="new_plan.type" required>
                  <option value="" disabled selected>Select a type</option>
                  <option value="nutrition">Nutrition</option>
                  <option value="exercise">Exercise</option>
                </select>
              </label>
              <div class="form_buttons">
                <button type="submit">Save</button>
                <button class="cancel" @click.prevent="response = '', $modal.hide('new-plan'), $parent.$parent.willBodyScroll(true)">Close</button>
              </div>
            </form>
          </div>
        </div>
      </modal>
      <div :class="{activeClientNotes: editClientNotes}" class="client-notes">
        <div class="client-notes__header">
          <p class="text--small">Client Information</p>
          <a
            href="javascript:void(0)"
            v-show="!editClientNotes"
            @click="editingClientNotes(true)"
            class="a--client-notes"
          >
            Edit
          </a>
        </div>
        <quill v-show="editClientNotes" v-model="$parent.$parent.client_details.notes" output="html" class="quill animate animate__fadeIn" :config="$parent.$parent.quill_config"/>
        <div v-if="!editClientNotes && $parent.$parent.client_details.notes !== ''" v-html="$parent.$parent.client_details.notes" class="show-client-notes animate animate__fadeIn"/>
        <p v-if="!editClientNotes && $parent.$parent.client_details.notes === ''" class="client-notes-msg">No client notes added...</p>
        <div class="bottom-bar">
          <div>
            <button v-show="editClientNotes" @click="editingClientNotes(false)" class="button--save">Save</button>
            <button v-show="editClientNotes" @click="cancelClientNotes()" class="cancel">Cancel</button>
          </div>
        </div>
      </div>
      <div>
        <div class="plan-top-bar">
          <button class="button--new-plan" @click="$modal.show('new-plan'), $parent.$parent.willBodyScroll(false)">New Plan</button>
        </div>
        <p class="new-msg" v-if="response !== ''">{{response}}</p>
        <p class="text--small grey .text--no-plans" v-if="this.$parent.no_plans">No plans created yet :(</p>
        <p class="text--small grey .text--loading" v-if="this.$parent.loading_plans">Loading plans...</p>
        <div v-if="!this.$parent.no_plans" class="plans_grid">
          <router-link
            class="plan_link" :to="'plan/' + plan.id"
            v-for="(plan, index) in this.$parent.$parent.client_details.plans"
            :key="index"
          >
            <h3 class="text--small plan-name">{{plan.name}}</h3>
            <div v-html="plan.notes" class="plan_link__notes__content" />
          </router-link>
        </div>
      </div>
    </div>
</template>

<script>
  import axios from 'axios'
  import InlineSvg from 'vue-inline-svg'

  export default {
    components: {
      InlineSvg
    },
    created () {
      this.loading = true
      this.$parent.checkClient()
      this.loading = false
    },
    data () {
      return {
        response: '',
        creating: false,
        new_plan: {
          name: '',
          duration: '',
          start: '',
          type: ''
        },
        editClientNotes: false
      }
    },
    methods: {

      // CLIENT NOTES METHODS //-------------------------------------------------------------------------------

      cancelClientNotes () {
        this.editClientNotes = false
        window.removeEventListener('keydown', this.quickSaveClient)
      },
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

      async save () {
        try {
          this.$parent.$parent.loading = true
          this.$parent.$parent.dontLeave = true
          await axios.put('https://api.traininblocks.com/programmes',
            {
              'name': this.new_plan.name,
              'client_id': this.$parent.$parent.client_details.client_id,
              'duration': this.new_plan.duration,
              'start': this.new_plan.start,
              'type': this.new_plan.type,
              'block_color': ''
            },
            {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${await this.$auth.getAccessToken()}`
              }
            }
          )
          this.response = 'Added New Plan'
          this.$parent.$parent.responseDelay()

          // Set old plans to null so that they can be repopulated
          var x
          for (x in this.$parent.$parent.clients) {
            if (this.$parent.$parent.clients[x].client_id === this.$route.params.client_id) {
              this.$parent.$parent.clients[x].plans = null
            }
          }
          // Get the new plans
          var force = true
          await this.$parent.get_client_details(force)

          this.$parent.$parent.loading = false
          this.$parent.$parent.dontLeave = false

          this.close()

          this.new_plan = {
            name: '',
            duration: '',
            start: '',
            type: ''
          }
          this.$ga.event('Plan', 'new')
        } catch (e) {
          this.$parent.$parent.loading = false
          this.$parent.$parent.dontLeave = false
          this.$parent.$parent.errorMsg = e
          this.$parent.$parent.$modal.show('error')
          console.error(e)
        }
      }
    }
  }
</script>
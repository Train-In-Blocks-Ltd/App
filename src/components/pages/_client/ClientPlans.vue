<style scoped>
  /* Client Notes */
  .client-notes {
    margin: 4rem auto
  }

  /* Plans */
  .plans_grid {
    display: grid;
    grid-gap: 2rem;
    margin-bottom: 2rem
  }
  .plan_container:first-of-type {
    margin-left: 0
  }
  .plan_container:last-of-type {
    margin-right: 0
  }
  .plan_container--link {
    display: grid;
    position: relative;
    grid-gap: 1rem;
    text-decoration: none;
    color: #282828;
    padding: 1rem 0;
    transition: all .4s cubic-bezier(.165, .84, .44, 1)
  }
  .plan_container--link:before {
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
  .plan_container--link:hover:before {
    width: 100%;
    opacity: 1
  }
  .plan_container--link__plan-notes {
    font-size: .8rem
  }
  .plan_container--link h3 {
    margin-top: 0;
    font-size: 1.4rem;
    margin-bottom: 0;
    overflow: hidden;
    text-overflow: ellipsis
  }
  .more-plan-info {
    margin-top: 1rem
  }
  .plan_container--link p {
    font-size: .8rem;
    font-weight: 500
  }
  .plan_container--link p:last-of-type {
    margin-bottom: 0
  }

  /* Add plan Form */
  .add_plan_container {
    padding-top: 1rem
  }
  .add_plan_container h3 {
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
      <modal name="help-plan" height="auto" :adaptive="true">
        <div class="modal--help-plan">
          <p><i>Plans</i> are the different cycles within your client's plan. It contains the different microcycles of sessions.</p><br>
          <p>You will be able to track, visualise and progress the Plan.</p>
        </div>
      </modal>
      <div :class="{activeClientNotes: editClientNotes}" class="client-notes">
        <div class="client-notes__header">
          <p><b>Client Information</b></p>
        </div>
        <quill v-show="editClientNotes" v-model="$parent.$parent.client_details.notes" output="html" class="quill animate animate__fadeIn" :config="$parent.$parent.quill_config"/>
        <div v-if="!editClientNotes && $parent.$parent.client_details.notes !== ''" v-html="$parent.$parent.client_details.notes" class="show-client-notes animate animate__fadeIn"/>
        <p v-if="!editClientNotes && $parent.$parent.client_details.notes === ''" class="show-client-notes">No client notes added...</p>
        <div class="bottom-bar">
          <div>
            <button v-show="!editClientNotes" @click="editingClientNotes(true)" class="button--edit">Edit</button>
            <button v-show="editClientNotes" @click="editingClientNotes(false)" class="button--save">Save</button>
            <button v-show="editClientNotes" @click="cancelClientNotes()" class="cancel">Cancel</button>
          </div>
        </div>
      </div>
      <div>
        <div class="flex">
          <div class="container--title">
            <inline-svg :src="require('../../../assets/svg/plan.svg')" class="title-icon"/>
            <h2 class="sub-title no-margin">Plans</h2>
          </div>
          <inline-svg class="sub-title tooltip" @click="$modal.show('help-plan')" :src="require('../../../assets/svg/help-tooltip.svg')"/>
        </div>
        <p v-if="this.$parent.no_plans">No plans yet. You can add one below.</p>
        <p v-if="this.$parent.loading_plans">Loading plans...</p>
        <div v-if="!this.$parent.no_plans" class="plans_grid">
          <div v-for="(plan, index) in this.$parent.$parent.client_details.plans"
              :key="index" class="plan_container">
              <router-link class="plan_container--link" :to="'plan/' + plan.id">
                <div class="plan_container--link__info">
                  <h3>{{plan.name}}</h3>
                  <div class="more-plan-info">
                    <p><b>Duration: </b>{{plan.duration}}</p>
                    <p><b>Start: </b>{{plan.start}}</p>
                  </div>
                </div>
                <div v-html="plan.notes" class="plan_container--link__plan-notes" />
              </router-link>
          </div>
        </div>
        <button v-if="!creating" @click="creation()">New Plan</button>
        <p class="new-msg" v-if="!creating">{{response}}</p>
        <div v-if="creating" class="add_plan_container">
          <h3>New Plan</h3>
          <form class="form_grid add_plan" name="add_plan" @submit.prevent="save()">
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
              <button class="cancel" @click="close()">Close</button>
            </div>
          </form>
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
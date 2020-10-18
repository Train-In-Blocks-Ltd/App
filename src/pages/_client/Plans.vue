<style>
  /* Client Notes */
  .activeState {
    border: 2px solid #28282860
  }
  .client-notes {
    margin: 4rem 0;
    padding: 2rem;
    border-radius: 3px;
    box-shadow: 0 0 20px 10px #28282810
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
  .plan_grid {
    display: grid;
    grid-gap: 2rem;
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
      <transition enter-active-class="animate animate__fadeIn animate__faster animate__delay-1s">
        <div class="wrapper--new-plan" v-if="isNewPlanOpen">
          <new-plan />
        </div>
      </transition>
      <div class="icon--open-new-plan" v-if="!isNewPlanOpen" @click="isNewPlanOpen = true, $parent.$parent.willBodyScroll(false)" aria-label="New Plan">
        <inline-svg :src="require('../../assets/svg/new-plan.svg')" aria-label="New Plan"/>
        <p class="text">New Plan</p>
      </div>
      <div>
        <div :class="{ openedSections: isNewPlanOpen }" class="section--a" />
        <div :class="{ openedSections: isNewPlanOpen }" class="section--b"/>
      </div>
      <div :class="{ activeState: editClientNotes }" class="client-notes">
        <div class="client-notes__header">
          <p class="text--small">Client Information</p>
          <a
            href="javascript:void(0)"
            v-show="!editClientNotes"
            @click="editClientNotes = true, tempQuillStore = $parent.$parent.client_details.notes"
            class="a--client-notes"
          >
            Edit
          </a>
        </div>
        <quill v-show="editClientNotes" v-model="$parent.$parent.client_details.notes" output="html" class="quill animate animate__fadeIn" :config="$parent.$parent.quill_config"/>
        <div
          v-if="!editClientNotes && $parent.$parent.client_details.notes !== '<p><br></p>' && $parent.$parent.client_details.notes !== null"
          v-html="$parent.$parent.client_details.notes"
          class="show-client-notes animate animate__fadeIn"
        />
        <p
          v-if="!editClientNotes && ($parent.$parent.client_details.notes === '<p><br></p>' || $parent.$parent.client_details.notes === null)"
          class="text--small grey text--no-client-notes"
        >
          What goals does your client have? What physical measures have you taken?
        </p>
        <div v-show="editClientNotes" class="bottom-bar">
          <div>
            <button @click="editClientNotes = false, $parent.update_client()" class="button--save">Save</button>
            <button @click="editClientNotes = false, $parent.$parent.client_details.notes = tempQuillStore" class="cancel">Cancel</button>
          </div>
        </div>
      </div>
      <div>
        <p class="new-msg" v-if="response !== ''">{{response}}</p>
        <p class="text--small grey .text--no-plans" v-if="this.$parent.no_plans">No plans created yet :(</p>
        <p class="text--small grey .text--loading" v-if="this.$parent.loading_plans">Loading plans...</p>
        <div v-if="!this.$parent.no_plans" class="plan_grid">
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
  import InlineSvg from 'vue-inline-svg'
  import NewPlan from '../../components/newPlan'

  export default {
    components: {
      InlineSvg,
      NewPlan
    },
    created () {
      this.loading = true
      this.$parent.checkClient()
      this.loading = false
    },
    data () {
      return {
        tempQuillStore: null,
        response: '',
        editClientNotes: false,
        isNewPlanOpen: false
      }
    }
  }
</script>
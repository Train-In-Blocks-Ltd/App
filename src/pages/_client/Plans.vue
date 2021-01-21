<style>
  /* Client Notes */
  .activeState {
    border: 2px solid #28282860
  }
  .client_notes {
    margin: 4rem 0;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 0 20px 10px #28282808
  }
  .client_notes__header {
    display: flex
  }
  .a--client_notes {
    color: #282828;
    font-size: .8rem;
    margin-left: 1rem;
    align-self: center;
    transition: all .6s cubic-bezier(.165, .84, .44, 1)
  }
  .a--client_notes:hover {
    opacity: .6
  }
  .client_notes-msg {
    margin: 1rem 0
  }

  /* Plans */
  .plan_grid {
    display: grid;
    grid-gap: 2rem;
    margin: 2rem 0
  }

  /* Add plan Form */
  .button--new_plan {
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
      <div v-if="isNewPlanOpen" class="wrapper--new_plan">
        <new-plan />
      </div>
    </transition>
    <div v-if="!isNewPlanOpen" class="icon_open--new_plan icon_open_middle" aria-label="New Plan" @click="isNewPlanOpen = true, $parent.$parent.willBodyScroll(false)">
      <inline-svg :src="require('../../assets/svg/new-plan.svg')" aria-label="New Plan" />
      <p class="text">
        New Plan
      </p>
    </div>
    <div>
      <div :class="{ openedSections: isNewPlanOpen }" class="section--a" />
      <div :class="{ openedSections: isNewPlanOpen }" class="section--b" />
    </div>
    <div :class="{ activeState: editClientNotes }" class="client_notes">
      <div class="client_notes__header">
        <p class="text--small">
          Client Information
        </p>
        <a
          v-if="!editClientNotes"
          href="javascript:void(0)"
          class="a--client_notes"
          @click="editClientNotes = true, tempEditorStore = $parent.$parent.client_details.notes"
        >
          Edit
        </a>
      </div>
      <rich-editor
        :showEditState="editClientNotes"
        :htmlInjection.sync="$parent.$parent.client_details.notes"
        :emptyPlaceholder="'What goals does your client have? What physical measures have you taken?'"
      />
      <div v-if="editClientNotes" class="bottom_bar">
        <button @click="editClientNotes = false, $parent.update_client()" class="button--save">Save</button>
        <button @click="editClientNotes = false, $parent.$parent.client_details.notes = tempEditorStore" class="cancel">Cancel</button>
      </div>
    </div>
    <div>
      <p class="text--large">Plans</p>
      <div v-if="response !== ''" class="text--new_msg">
        <p class="text--small">{{ response }}</p>
        <p class="text--small grey">You're all set, get programming</p>
      </div>
      <p class="text--small grey text--no-plans" v-if="$parent.no_plans">No plans yet, use the button on the top-right of your screen.</p>
      <div v-else>
        <skeleton v-if="$parent.$parent.loading" :type="'plan'"/>
        <div v-else class="plan_grid">
          <router-link
            :to="'plan/' + plan.id"
            v-for="(plan, index) in $parent.$parent.client_details.plans"
            :key="index"
            :class="{ recentlyAdded: persistResponse === plan.name }"
            class="plan_link"
          >
            <div>
              <p class="text--small plan-name">{{plan.name}}</p>
              <p v-if="plan.notes === null || plan.notes === '<p><br></p>' || plan.notes === ''" class="grey">What's the purpose of this plan? Head over to this page and edit it.</p>
              <div v-else v-html="plan.notes" class="plan_link__notes__content" />
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import InlineSvg from 'vue-inline-svg'
  import NewPlan from '../../components/newPlan'
  import RichEditor from '../../components/Editor'
  import Skeleton from '../../components/Skeleton'

  export default {
    components: {
      InlineSvg,
      NewPlan,
      RichEditor,
      Skeleton
    },
    data () {
      return {
        tempEditorStore: null,
        response: '',
        persistResponse: '',
        editClientNotes: false,
        isNewPlanOpen: false
      }
    },
    created () {
      this.$parent.$parent.splashed = true
      this.$parent.$parent.willBodyScroll(true)
      this.$parent.checkClient()
    },
    methods: {
      responseDelay () {
        setTimeout(() => { this.response = '' }, 5000)
      }
    }
  }
</script>

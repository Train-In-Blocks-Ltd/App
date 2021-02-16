<style>
  /* Client Notes */
  .activeState {
    border: 2px solid #28282860
  }
  #client_notes {
    margin: 4rem 0;
    padding: 2rem;
    border-radius: 10px;
    background-color: white;
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
  .show_plan_notes p {
    margin: 1rem 0
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
    <div v-if="isNewPlanOpen" class="tab_overlay_content fadeIn delay">
      <new-plan />
    </div>
    <div v-if="!isNewPlanOpen" class="tab_option icon_open_middle tab_option_large" aria-label="New Plan" @click="isNewPlanOpen = true, $parent.$parent.will_body_scroll(false)">
      <inline-svg :src="require('../../assets/svg/new-plan.svg')" aria-label="New Plan" />
      <p class="text">
        New Plan
      </p>
    </div>
    <div>
      <div :class="{ opened_sections: isNewPlanOpen }" class="section_a" />
      <div :class="{ opened_sections: isNewPlanOpen }" class="section_b" />
    </div>
    <div id="client_notes" :class="{ activeState: editClientNotes }">
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
        :show-edit-state="editClientNotes"
        :html-injection.sync="$parent.$parent.client_details.notes"
        :empty-placeholder="'What goals does your client have? What physical measures have you taken?'"
        :called-from-el="'app'"
        :called-from-item="'client_information'"
      />
      <div v-if="editClientNotes" class="bottom_bar">
        <button class="button--save" @click="editClientNotes = false, $parent.$parent.update_client()">
          Save
        </button>
        <button class="cancel" @click="editClientNotes = false, $parent.$parent.client_details.notes = tempEditorStore">
          Cancel
        </button>
      </div>
    </div>
    <div>
      <p class="text--large">
        Plans
      </p>
      <div v-if="response !== ''" class="text--new_msg">
        <p class="text--small">
          {{ response }}
        </p>
        <p class="text--small grey">
          You're all set, get programming
        </p>
      </div>
      <p v-if="$parent.no_plans" class="text--small grey text--no-plans">
        No plans yet, use the button on the top-right of your screen.
      </p>
      <div v-else>
        <skeleton v-if="$parent.$parent.loading" :type="'plan'" />
        <div v-else class="plan_grid">
          <router-link
            v-for="(plan, index) in $parent.$parent.client_details.plans"
            :key="index"
            :to="'plan/' + plan.id"
            :class="{ recently_added: persistResponse === plan.name }"
            class="plan_link"
          >
            <div>
              <p class="text--small plan-name">
                {{ plan.name }}
              </p>
              <p v-if="plan.notes === null || plan.notes === '<p><br></p>' || plan.notes === ''" class="grey">
                What's the purpose of this plan? Head over to this page and edit it.
              </p>
              <div v-else class="plan_link__notes__content" v-html="remove_brackets_and_checkbox(plan.notes)" />
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const NewPlan = () => import(/* webpackChunkName: "components.newplan", webpackPrefetch: true  */ '../../components/NewPlan')
const RichEditor = () => import(/* webpackChunkName: "components.richeditor", webpackPreload: true  */ '../../components/Editor')

export default {
  components: {
    NewPlan,
    RichEditor
  },
  data () {
    return {

      // EDIT

      tempEditorStore: null,
      editClientNotes: false,

      // PLAN CREATION

      isNewPlanOpen: false,
      response: '',
      persistResponse: ''
    }
  },
  created () {
    this.$parent.$parent.will_body_scroll(true)
    this.$parent.check_client()
  },
  methods: {

    // BACKGROUND AND MISC.

    remove_brackets_and_checkbox (dataIn) {
      if (dataIn !== null) {
        return dataIn.replace(/[[\]]/g, '').replace(/<input /gmi, '<input disabled ')
      } else {
        return dataIn
      }
    },
    response_delay () {
      setTimeout(() => { this.response = '' }, 5000)
    }
  }
}
</script>

<style>
  /* Client Notes */
  #client_notes {
    margin: 4rem 0;
    padding: 2rem;
    border-radius: 10px;
    background-color: var(--fore);
    box-shadow: var(--low_shadow)
  }
  .a--client_notes {
    color: var(--base);
    font-size: .8rem;
    margin-left: 1rem;
    align-self: center;
    transition: var(--transition_standard)
  }
  .a--client_notes:hover {
    opacity: .6
  }
  .client_notes-msg {
    margin: 1rem 0
  }

  /* Periodise Grid */
  .periodise_grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 1rem;
    margin-top: 2rem;
    margin-bottom: 4rem
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

  /* Responsive */
  @media (max-width: 992px) {
    .periodise_grid {
      grid-template-columns: 1fr 1fr
    }
  }
  @media (max-width: 567px) {
    .periodise_grid {
      grid-template-columns: 1fr
    }
  }
</style>
<template>
  <div>
    <div v-if="isNewPlanOpen" class="tab_overlay_content fadeIn delay fill_mode_both">
      <new-plan />
    </div>
    <div
      v-if="!isNewPlanOpen"
      :class="{ icon_open_middle: $parent.keepLoaded }"
      class="tab_option tab_option_small"
      aria-label="New Plan"
      @click="isNewPlanOpen = true, will_body_scroll(false)"
    >
      <inline-svg class="no_fill" :src="require('../../assets/svg/new-plan.svg')" aria-label="New Plan" />
      <p class="text">
        New Plan
      </p>
    </div>
    <div :class="{ opened_sections: isNewPlanOpen }" class="section_overlay" />
    <div id="client_notes" :class="{ editorActive: editingClientNotes }">
      <h2>
        Client Information
      </h2>
      <rich-editor
        :html-injection.sync="$parent.$parent.client_details.notes"
        :empty-placeholder="'What goals does your client have? What physical measures have you taken?'"
        @on-edit-change="resolve_client_info_editor"
      />
    </div>
    <div>
      <h1>
        Plans
      </h1>
      <skeleton v-if="$parent.$parent.loading" :type="'plan'" class="fadeIn" />
      <periodise v-else-if="!noPlans" :is-trainer="true" :plans.sync="$parent.$parent.client_details.plans" />
      <p
        v-else
        class="text--holder text--small grey"
      >
        No plans yet, use the button on the top-right of your screen
      </p>
    </div>
  </div>
</template>

<script>
const NewPlan = () => import(/* webpackChunkName: "components.newplan", webpackPrefetch: true  */ '../../components/NewPlan')
const RichEditor = () => import(/* webpackChunkName: "components.richeditor", webpackPreload: true  */ '../../components/Editor')
const Periodise = () => import(/* webpackChunkName: "components.periodise", webpackPreload: true  */ '../../components/Periodise')

export default {
  components: {
    NewPlan,
    RichEditor,
    Periodise
  },
  data () {
    return {

      // EDIT

      tempEditorStore: null,
      editingClientNotes: false,

      // PLAN CREATION

      isNewPlanOpen: false,
      response: '',
      persistResponse: ''
    }
  },
  created () {
    this.will_body_scroll(true)
    this.$parent.check_client()
    this.noPlans = this.$parent.$parent.client_details.plans === false
  },
  methods: {
    resolve_client_info_editor (state) {
      switch (state) {
        case 'edit':
          this.editingClientNotes = true
          this.tempEditorStore = this.$parent.$parent.client_details.notes
          break
        case 'save':
          this.editingClientNotes = false
          this.$parent.$parent.update_client()
          break
        case 'cancel':
          this.editingClientNotes = false
          this.$parent.$parent.client_details.notes = this.tempEditorStore
          break
      }
    }
  }
}
</script>

<template>
  <form
    class="form_grid add_plan"
    name="add_plan"
    @submit.prevent="createPlan(), $parent.isNewPlanOpen = false, willBodyScroll(true)"
  >
    <div class="bottom_margin">
      <h3>
        Create a new plan and use it for exercise, nutrition or anything else
      </h3>
      <p class="grey">
        The duration is the microcycle which can be of any length
      </p>
    </div>
    <input
      ref="name"
      v-model="newPlan.name"
      class="small_border_radius width_300"
      type="text"
      placeholder="Name*"
      aria-label="Name"
      required
      @input="checkForm()"
    >
    <input
      v-model="newPlan.duration"
      class="small_border_radius width_300"
      type="number"
      min="1"
      placeholder="Duration*"
      aria-label="Duration"
      required
      @input="checkForm()"
    >
    <div class="form_button_bar">
      <button
        :disabled="disableCreatePlanButton"
        type="submit"
      >
        Save
      </button>
      <button class="red_button" @click.prevent="$parent.isNewPlanOpen = false, willBodyScroll(true)">
        Close
      </button>
    </div>
  </form>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data () {
    return {
      newPlan: {
        name: '',
        duration: ''
      },
      disableCreatePlanButton: true
    }
  },
  computed: mapState([
    'dontLeave',
    'clientDetails',
    'clients'
  ]),
  mounted () {
    this.$refs.name.focus()
  },
  methods: {

    // -----------------------------
    // General
    // -----------------------------

    checkForm () {
      this.disableCreatePlanButton = !(this.newPlan.name && this.newPlan.duration)
    },

    /**
     * Creates a new plan.
     */
    async createPlan () {
      try {
        this.$store.commit('SET_LOADING', true)
        this.$store.commit('SET_DONT_LEAVE', true)
        await this.$store.dispatch('createPlan', {
          clientId: this.clientDetails.client_id,
          name: this.newPlan.name,
          duration: this.newPlan.duration
        })
        this.$ga.event('Plan', 'new')
        this.$parent.$parent.$parent.$refs.response_pop_up.show(`${this.newPlan.name} created`, 'You\'re all set, get programming')
        this.newPlan = {
          name: '',
          duration: ''
        }
        this.$store.dispatch('endLoading')
      } catch (e) {
        this.$parent.$parent.$parent.resolveError(e)
      }
    }
  }
}
</script>

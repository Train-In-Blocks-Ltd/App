<template>
  <form class="form_grid add_plan" name="add_plan" @submit.prevent="createPlan(), $parent.isNewPlanOpen = false, will_body_scroll(true)">
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
      v-model="new_plan.name"
      class="small_border_radius width_300"
      type="text"
      placeholder="Name*"
      aria-label="Name"
      required
    >
    <input
      v-model="new_plan.duration"
      class="small_border_radius width_300"
      type="number"
      min="1"
      placeholder="Duration*"
      aria-label="Duration"
      required
    >
    <div class="form_button_bar">
      <button type="submit">
        Save
      </button>
      <button class="red_button" @click.prevent="$parent.isNewPlanOpen = false, will_body_scroll(true)">
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
      new_plan: {
        name: '',
        duration: ''
      }
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
    async createPlan () {
      try {
        await this.$store.dispatch('createPlan', {
          clientId: this.clientDetails.client_id,
          name: this.new_plan.name,
          duration: this.new_plan.duration,
          ordered: this.clientDetails.plans === undefined || this.clientDetails.plans === false ? 0 : this.clientDetails.length
        })
        this.$parent.$parent.$parent.$refs.response_pop_up.show(`${this.new_plan.name} created`, 'You\'re all set, get programming')
        this.$parent.persistResponse = this.new_plan.name
        this.new_plan = {
          name: '',
          duration: ''
        }
        this.$ga.event('Plan', 'new')
        this.$store.dispatch('endLoading')
      } catch (e) {
        this.$parent.$parent.$parent.resolve_error(e)
      }
    }
  }
}
</script>

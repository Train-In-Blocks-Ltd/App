<template>
  <form class="form_grid add_plan" name="add_plan" @submit.prevent="create_plan(), $parent.isNewPlanOpen = false, will_body_scroll(true)">
    <div class="bottom_margin">
      <h2>
        Create a new plan and use it for exercise, nutrition or anything else
      </h2>
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
      <button class="red_button" @click.prevent="$parent.response = '', $parent.isNewPlanOpen = false, will_body_scroll(true)">
        Close
      </button>
    </div>
  </form>
</template>

<script>
export default {
  data () {
    return {
      new_plan: {
        name: '',
        duration: ''
      }
    }
  },
  mounted () {
    this.$refs.name.focus()
  },
  methods: {
    async create_plan () {
      try {
        this.$parent.$parent.$parent.dontLeave = true
        await this.$axios.put('https://api.traininblocks.com/programmes',
          {
            name: this.new_plan.name,
            client_id: this.$parent.$parent.$parent.client_details.client_id,
            duration: this.new_plan.duration,
            block_color: '',
            ordered: this.$parent.$parent.$parent.client_details.plans === undefined || this.$parent.$parent.$parent.client_details.plans === false ? 0 : this.$parent.$parent.$parent.client_details.length
          }
        )
        this.$parent.$parent.$parent.$refs.response_pop_up.show(`${this.new_plan.name} created`, 'You\'re all set, get programming')
        this.$parent.persistResponse = this.new_plan.name

        // Set old plans to null so that they can be repopulated
        let x
        for (x in this.$parent.$parent.$parent.clients) {
          if (this.$parent.$parent.$parent.clients[x].client_id === this.$route.params.client_id) {
            this.$parent.$parent.$parent.clients[x].plans = null
          }
        }
        // Get the new plans
        const force = true
        await this.$parent.$parent.get_client_details(force)

        this.new_plan = {
          name: '',
          duration: ''
        }
        this.$ga.event('Plan', 'new')
        this.$parent.$parent.$parent.end_loading()
      } catch (e) {
        this.$parent.$parent.$parent.resolve_error(e)
      }
    }
  }
}
</script>

<template>
  <form class="form_grid add_plan" name="add_plan" @submit.prevent="save(), $parent.isNewPlanOpen = false, $parent.$parent.$parent.willBodyScroll(true)">
    <p class="text--large">
      New Plan
    </p>
    <label>
      <b>Name*</b>
      <input ref="name" v-model="new_plan.name" class="input--forms" type="text" required>
    </label>
    <label>
      <b>Duration*</b>
      <input v-model="new_plan.duration" class="input--forms" type="number" min="1" required>
    </label>
    <div class="form_buttons">
      <button type="submit">
        Save
      </button>
      <button class="cancel" @click.prevent="$parent.response = '', $parent.isNewPlanOpen = false, $parent.$parent.$parent.willBodyScroll(true)">
        Close
      </button>
    </div>
  </form>
</template>

<script>
import axios from 'axios'

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
    today () {
      const today = new Date()
      const dd = String(today.getDate()).padStart(2, '0')
      const mm = String(today.getMonth() + 1).padStart(2, '0')
      const yyyy = today.getFullYear()

      return yyyy + '-' + mm + '-' + dd
    },
    async save () {
      try {
        this.$parent.$parent.$parent.pause_loading = true
        this.$parent.$parent.$parent.dontLeave = true
        await axios.put('https://api.traininblocks.com/programmes',
          {
            name: this.new_plan.name,
            client_id: this.$parent.$parent.$parent.client_details.client_id,
            duration: this.new_plan.duration,
            block_color: ''
          }
        )
        this.response = 'Added New Plan'
        this.$parent.$parent.$parent.responseDelay()

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

        this.$parent.$parent.$parent.pause_loading = false
        this.$parent.$parent.$parent.dontLeave = false

        this.new_plan = {
          name: '',
          duration: ''
        }
        this.$ga.event('Plan', 'new')
      } catch (e) {
        this.$parent.$parent.$parent.pause_loading = false
        this.$parent.$parent.$parent.dontLeave = false
        this.$parent.$parent.$parent.errorMsg = e
        this.$parent.$parent.$parent.$modal.show('error')
        this.$parent.$parent.$parent.willBodyScroll(false)
        console.error(e)
      }
    }
  }
}
</script>

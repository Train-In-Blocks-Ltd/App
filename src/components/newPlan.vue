<template>
  <form class="form_grid add_plan" name="add_plan" @submit.prevent="save(), $parent.isNewPlanOpen = false, $parent.$parent.$parent.willBodyScroll(true)">
    <p class="text--large">New Plan</p>
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
      <button class="cancel" @click.prevent="$parent.response = '', $parent.isNewPlanOpen = false, $parent.$parent.$parent.willBodyScroll(true)">Close</button>
    </div>
  </form>
</template>

<script>
  export default {
    data () {
      return {
        new_plan: {
          name: '',
          duration: '',
          start: '',
          type: ''
        }
      }
    },
    methods: {
      async save () {
        try {
          this.$parent.$parent.$parent.loading = true
          this.$parent.$parent.$parent.dontLeave = true
          await axios.put('https://api.traininblocks.com/programmes',
            {
              'name': this.new_plan.name,
              'client_id': this.$parent.$parent.$parent.client_details.client_id,
              'duration': this.new_plan.duration,
              'start': this.new_plan.start,
              'type': this.new_plan.type,
              'block_color': ''
            }
          )
          this.response = 'Added New Plan'
          this.$parent.$parent.$parent.responseDelay()

          // Set old plans to null so that they can be repopulated
          var x
          for (x in this.$parent.$parent.$parent.clients) {
            if (this.$parent.$parent.$parent.clients[x].client_id === this.$route.params.client_id) {
              this.$parent.$parent.$parent.clients[x].plans = null
            }
          }
          // Get the new plans
          var force = true
          await this.$parent.$parent.get_client_details(force)

          this.$parent.$parent.$parent.loading = false
          this.$parent.$parent.$parent.dontLeave = false

          this.close()

          this.new_plan = {
            name: '',
            duration: '',
            start: '',
            type: ''
          }
          this.$ga.event('Plan', 'new')
        } catch (e) {
          this.$parent.$parent.$parent.loading = false
          this.$parent.$parent.$parent.dontLeave = false
          this.$parent.$parent.$parent.errorMsg = e
          this.$parent.$parent.$parent.$modal.show('error')
          console.error(e)
        }
      }
    }
  }
</script>

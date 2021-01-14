<template>
  <form class="form_grid add_plan" name="add_plan" @submit.prevent="save(), $parent.isNewPlanOpen = false, $parent.$parent.$parent.willBodyScroll(true)">
    <p class="text--large">New Plan</p>
    <label>
      <b>Name*</b>
      <input class="input--forms" ref="name" type="text" v-model="new_plan.name" required/>
    </label>
    <label>
      <b>Duration*</b>
      <input class="input--forms" type="number" min="1" v-model="new_plan.duration" required/>
    </label>
    <div class="form_buttons">
      <button type="submit">Save</button>
      <button class="cancel" @click.prevent="$parent.response = '', $parent.isNewPlanOpen = false, $parent.$parent.$parent.willBodyScroll(true)">Close</button>
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
        var today = new Date()
        var dd = String(today.getDate()).padStart(2, '0')
        var mm = String(today.getMonth() + 1).padStart(2, '0')
        var yyyy = today.getFullYear()

        return yyyy + '-' + mm + '-' + dd
      },
      async save () {
        try {
          this.$parent.$parent.$parent.pause_loading = true
          this.$parent.$parent.$parent.dontLeave = true
          await axios.put('https://api.traininblocks.com/programmes',
            {
              'name': this.new_plan.name,
              'client_id': this.$parent.$parent.$parent.client_details.client_id,
              'duration': this.new_plan.duration,
              'block_color': ''
            }
          )
          this.$parent.response = `${this.new_plan.name} has been created`
          this.$parent.responseDelay()

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

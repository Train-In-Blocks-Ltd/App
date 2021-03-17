<style scoped>
  /* Add New Client */
  .add_client {
    grid-gap: 1rem
  }
  .add_client label {
    display: grid;
    grid-gap: .5rem
  }
</style>

<template>
  <form
    name="add_client"
    class="form_grid add_client"
    spellcheck="false"
    @submit.prevent="save(), $parent.isNewClientOpen = false, $parent.$parent.will_body_scroll(true)"
  >
    <div class="bottom_margin">
      <h2>
        Add a new client and email them access
      </h2>
      <p class="grey">
        Make sure that you have the correct email address, you won't be able to change it after
      </p>
    </div>
    <input
      ref="name"
      v-model="new_client.name"
      class="small_border_radius width_300"
      type="text"
      autocomplete="name"
      placeholder="Name*"
      aria-label="Name"
      required
    >
    <input
      v-model="new_client.email"
      class="small_border_radius width_300"
      type="email"
      autocomplete="email"
      placeholder="Email*"
      aria-label="Email"
      required
    >
    <input
      v-model="new_client.number"
      class="small_border_radius width_300"
      type="tel"
      inputmode="tel"
      autocomplete="tel"
      placeholder="Mobile"
      aria-label="Mobile"
      pattern="\d+"
    >
    <div class="form_buttons">
      <button type="submit">
        Save
      </button>
      <button class="cancel" @click.prevent="$parent.isNewClientOpen = false, $parent.$parent.will_body_scroll(true)">
        Close
      </button>
    </div>
  </form>
</template>

<script>
export default {
  data () {
    return {
      new_client: {
        name: '',
        email: '',
        number: '',
        notes: ''
      }
    }
  },
  mounted () {
    this.$refs.name.focus()
  },
  methods: {
    async save () {
      if (this.new_client.email === this.$parent.$parent.claims.email) {
        this.$parent.$parent.errorMsg = 'You cannot create a client with your own email address!'
        this.$parent.$parent.$modal.show('error')
        console.error('You cannot create a client with your own email address!')
      } else {
        this.$parent.response = ''
        try {
          this.$parent.$parent.dontLeave = true
          await this.$axios.put('https://api.traininblocks.com/clients',
            {
              name: this.new_client.name,
              pt_id: this.$parent.$parent.claims.sub,
              email: this.new_client.email,
              number: this.new_client.number,
              notes: this.new_client.notes
            }
          )
          this.$parent.$parent.responseHeader = `Added ${this.new_client.name}`
          this.$parent.$parent.responseDesc = 'Well done on getting a new client'
          this.$parent.persistResponse = this.new_client.name
          await this.$parent.$parent.clients_f()
          this.$parent.$parent.clients_to_vue()
          this.new_client = {
            name: '',
            email: '',
            number: '',
            notes: ''
          }
          this.$ga.event('Client', 'new')
          this.$parent.$parent.end_loading()
        } catch (e) {
          this.$parent.$parent.resolve_error(e)
        }
      }
    }
  }
}
</script>

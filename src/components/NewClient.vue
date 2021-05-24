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
    @submit.prevent="createClient(), $parent.isNewClientOpen = false, willBodyScroll(true)"
  >
    <div class="bottom_margin">
      <h3>
        Add a new client and email them access
      </h3>
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
      v-model="new_client.confirm"
      :style="{ borderColor: new_client.email !== new_client.confirm ? 'var(--base_red)' : ''}"
      class="small_border_radius width_300"
      type="email"
      autocomplete="email"
      placeholder="Confirm email*"
      aria-label="Confirm email"
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
    <div class="form_button_bar">
      <button
        :disabled="new_client.email === '' || new_client.email !== new_client.confirm"
        type="submit"
      >
        Save
      </button>
      <button class="red_button" @click.prevent="$parent.isNewClientOpen = false, willBodyScroll(true)">
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
      new_client: {
        name: '',
        email: '',
        confirm: '',
        number: '',
        notes: ''
      }
    }
  },
  computed: mapState([
    'claims'
  ]),
  mounted () {
    this.$refs.name.focus()
  },
  methods: {
    createClient () {
      if (this.new_client.email === this.claims.email) {
        this.$parent.$parent.$refs.response_pop_up.show('You cannot create a client with your own email address!', 'Please use a different one.', true, true)
        console.error('You cannot create a client with your own email address!')
      } else {
        try {
          this.$store.commit('setData', {
            attr: 'dontLeave',
            data: true
          })
          this.$store.dispatch('createClient', {
            name: this.new_client.name,
            pt_id: this.claims.sub,
            email: this.new_client.email,
            number: this.new_client.number,
            notes: this.new_client.notes
          })
          this.$parent.$parent.$refs.response_pop_up.show(`Added ${this.new_client.name}`, 'Well done on getting a new client')
          this.$parent.persistResponse = this.new_client.name
          this.new_client = {
            name: '',
            email: '',
            confirm: '',
            number: '',
            notes: ''
          }
          this.$ga.event('Client', 'new')
          this.$store.dispatch('endLoading')
        } catch (e) {
          this.$parent.$parent.resolveError(e)
        }
      }
    }
  }
}
</script>

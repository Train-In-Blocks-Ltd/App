<style>
  /* Add New Client */
  .add_client {
    grid-gap: 1rem
  }
  .add_client label {
    display: grid;
    grid-gap: .5rem
  }
  .new-msg {
    margin: 2rem 0
  }
</style>

<template>
  <form name="add_client" class="form_grid add_client" spellcheck="false" @submit.prevent="save(), $parent.isNewClientOpen = false, $parent.$parent.willBodyScroll(true)">
    <p class="text--large">New Client</p>
    <label>
      <b>Name*</b>
      <input class="input--forms" ref="name" type="text" autocomplete="name" v-model="new_client.name" required />
    </label>
    <label>
      <b>Email*</b>
      <input class="input--forms" type="email" autocomplete="email" v-model="new_client.email" required />
    </label>
    <label>
      <b>Mobile</b>
      <input class="input--forms" type="tel" inputmode="tel" autocomplete="tel" v-model="new_client.number" minlength="9" maxlength="14" pattern="\d+" />
    </label>
    <div class="form_buttons">
      <button type="submit">Save</button>
      <button class="cancel" @click.prevent="$parent.isNewClientOpen = false, $parent.$parent.willBodyScroll(true)">Close</button>
    </div>
  </form>
</template>

<script>
  import axios from 'axios'

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
            this.$parent.$parent.pause_loading = true
            this.$parent.$parent.dontLeave = true
            await axios.put('https://api.traininblocks.com/clients',
              {
                'name': this.new_client.name,
                'pt_id': this.$parent.$parent.claims.sub,
                'email': this.new_client.email,
                'number': this.new_client.number,
                'notes': this.new_client.notes
              }
            )
            this.$parent.response = 'Added New Client'
            this.$parent.$parent.responseDelay()

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

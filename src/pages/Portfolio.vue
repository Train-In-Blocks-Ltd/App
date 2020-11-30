<style scoped>
  /* Trainer Info */
  .trainer_info input {
    width: 100%;
    background-color: initial;
    border: 1px solid #28282840;
    padding: .6rem 1rem;
    border-radius: 3px;
    transition: .4s all cubic-bezier(.165, .84, .44, 1)
  }
  .trainer_info input:hover {
    opacity: .6
  }
  .trainer_info input:focus {
    opacity: 1;
    border: 1px solid #282828;
    padding: .6rem 1.4rem
  }
  .trainer_info .trainer_info__business {
    max-width: 100%;
    margin-bottom: 1rem
  }

  /* Card */
  .wrapper_card {
    display: grid;
    box-shadow: 0 0 20px 10px #28282808;
    padding: 2rem;
    border-radius: 3px;
    margin: 4rem 0
  }
</style>

<template>
  <div id="portfolio">
    <form
      @submit.prevent="update(), editing_info = false"
      class="trainer_info"
    >
      <input
        v-model="$parent.portfolio.business_name"
        @input="editing_info = true"
        class="trainer_info__business text--large"
        placeholder="Business name"
        aria-label="Business name"
        type="text"
        autocomplete="name"
      >
      <input
        v-model="$parent.portfolio.trainer_name"
        @input="editing_info = true"
        class="input--forms allow_text_overflow"
        placeholder="Trainer Name"
        aria-label="Trainer Name"
        type="text"
        autocomplete="name"
      >
      <button v-if="editing_info" type="submit">Save</button>
    </form>
    <div class="wrapper_card">
      <p
        v-if="!editing_card && ($parent.portfolio.notes === '<p><br></p>' || $parent.portfolio.notes === '')"
        class="text--small grey text--no_client_notes"
      >
        Your clients will be able to access this information. What do you want to share with them?
      </p>
      <div v-html="$parent.portfolio.notes" v-if="!editing_card" class="show_card" />
      <quill v-model="$parent.portfolio.notes" v-if="editing_card" output="html" class="quill animate animate__fadeIn" />
      <div class="bottom_bar">
        <div>
          <button v-if="!editing_card" @click="editing_card = true">Edit</button>
          <button v-if="editing_card" @click="update(), editing_card= false">Save</button>
          <button v-if="editing_card" @click="editing_card= false" class="cancel">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      editing_info: false,
      editing_card: false
    }
  },
  async created () {
    this.$parent.loading = true
    this.$parent.splashed = true
    await this.$parent.setup()
    await this.$parent.get_portfolio()
    this.$parent.loading = false
  },
  methods: {
    async create () {
      this.$parent.dontLeave = true
      this.$parent.pause_loading = true
      try {
        await axios.put(`https://api.traininblocks.com/portfolio`,
          {
            'pt_id': this.$parent.claims.sub,
            'trainer_name': '',
            'business_name': '',
            'notes': ''
          }
        )
        await this.$parent.get_portfolio()
        this.$parent.pause_loading = false
        this.$parent.dontLeave = false
      } catch (e) {
        this.$parent.pause_loading = false
        this.$parent.dontLeave = false
        this.$parent.errorMsg = e
        this.$parent.$modal.show('error')
        this.$parent.willBodyScroll(false)
        console.error(e)
      }
    },
    async update () {
      this.$parent.dontLeave = true
      this.$parent.pause_loading = true
      try {
        await axios.post(`https://api.traininblocks.com/portfolio/${this.$parent.claims.sub}`,
          {
            'trainer_name': this.$parent.portfolio.trainer_name,
            'business_name': this.$parent.portfolio.business_name,
            'notes': this.$parent.portfolio.notes
          }
        )
        await this.$parent.get_portfolio()
        this.$parent.pause_loading = false
        this.$parent.dontLeave = false
      } catch (e) {
        this.$parent.pause_loading = false
        this.$parent.dontLeave = false
        this.$parent.errorMsg = e
        this.$parent.$modal.show('error')
        this.$parent.willBodyScroll(false)
        console.error(e)
      }
    }
  }
}
</script>
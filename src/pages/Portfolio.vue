<style scoped>
  /* Trainer Info */
  .trainer_info input {
    width: 100%;
    background-color: initial;
    border: 1px solid #28282840;
    padding: .6rem 1rem;
    border-radius: 8px;
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
  .business_name_skeleton {
    margin-top: 1rem
  }

  /* Card */
  .wrapper_card {
    display: grid;
    background-color: white;
    box-shadow: 0 0 20px 10px #28282808;
    padding: 2rem;
    border-radius: 10px;
    margin: 4rem 0
  }
  .wrapper_card_skeleton {
    margin: 4rem 0
  }
</style>

<template>
  <div id="portfolio">
    <div class="trainer_info">
      <input
        v-if="!$parent.loading"
        v-model="$parent.portfolio.business_name"
        class="trainer_info__business text--large"
        placeholder="Business name"
        aria-label="Business name"
        type="text"
        autocomplete="name"
        :disabled="$parent.silent_loading"
        @click="editing_card ? update($parent.portfolio.notes): null, editing_card = false"
        @blur="update($parent.portfolio.notes)"
        @input="editing_info = true"
      >
      <skeleton v-else :type="'input_large'" />
      <input
        v-if="!$parent.loading"
        v-model="$parent.portfolio.trainer_name"
        class="input--forms allow_text_overflow"
        placeholder="Trainer Name"
        aria-label="Trainer Name"
        type="text"
        autocomplete="name"
        :disabled="$parent.silent_loading"
        @click="editing_card ? update($parent.portfolio.notes): null, editing_card = false"
        @blur="update($parent.portfolio.notes)"
        @input="editing_info = true"
      >
      <skeleton v-else :type="'input_small'" class="business_name_skeleton" />
    </div>
    <div v-if="!$parent.loading" class="wrapper_card">
      <p class="text--small">
        Portfolio
      </p>
      <rich-editor
        :show-edit-state="editing_card"
        :html-injection.sync="$parent.portfolio.notes"
        :empty-placeholder="'Your clients will be able to access this information. What do you want to share with them? You should include payment information and any important links.'"
      />
      <div class="bottom_bar">
        <button v-if="!editing_card" @click="editing_card = true, tempEditorStore = $parent.portfolio.notes">
          Edit
        </button>
        <button v-if="editing_card" @click="editing_card= false, update($parent.portfolio.notes)">
          Save
        </button>
        <button v-if="editing_card" class="cancel" @click="editing_card= false, $parent.portfolio.notes = tempEditorStore">
          Cancel
        </button>
      </div>
    </div>
    <skeleton v-else :type="'session'" class="wrapper_card_skeleton" />
  </div>
</template>

<script>
const RichEditor = () => import(/* webpackChunkName: "components.richeditor", webpackPreload: true  */ '../components/Editor')

export default {
  components: {
    RichEditor
  },
  data () {
    return {
      response: '',
      editing_card: false,
      tempEditorStore: null
    }
  },
  async created () {
    this.$parent.loading = true
    this.$parent.will_body_scroll(true)
    await this.$parent.setup()
    await this.$parent.get_portfolio()
    this.$parent.end_loading()
  },
  methods: {

    // DATABASE

    async update (notesUpdate) {
      this.$parent.silent_loading = true
      this.$parent.dontLeave = true
      try {
        await this.$axios.post(`https://api.traininblocks.com/portfolio/${this.$parent.claims.sub}`,
          {
            trainer_name: this.$parent.portfolio.trainer_name,
            business_name: this.$parent.portfolio.business_name,
            notes: notesUpdate
          }
        )
        await this.$parent.get_portfolio(true)
        this.$ga.event('Portfolio', 'update')
        this.$parent.responseHeader = 'Portfolio updated'
        this.$parent.responseDesc = 'Your clients can access this information'
        this.$parent.end_loading()
      } catch (e) {
        this.$parent.resolve_error(e)
      }
    }
  }
}
</script>

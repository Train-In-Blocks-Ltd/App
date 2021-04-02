<style scoped>
  /* Trainer Info */
  .trainer_info input {
    width: 100%;
    background-color: initial;
    border: 1px solid var(--base_faint);
    padding: .6rem 1rem;
    border-radius: 8px;
    transition: .4s all cubic-bezier(.165, .84, .44, 1)
  }
  .trainer_info input:hover {
    opacity: .6
  }
  .trainer_info input:focus {
    opacity: 1;
    border: 1px solid var(--base);
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
    background-color: var(--fore);
    box-shadow: var(--low_shadow);
    padding: 2rem;
    border-radius: 10px;
    margin: 4rem 0
  }
  .wrapper_card_skeleton {
    margin: 4rem 0
  }

  @media (max-width: 576px) {
    .wrapper_card {
      padding: .8rem
    }
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
        @blur="update($parent.portfolio.notes)"
        @input="editing_info = true"
      >
      <skeleton v-else :type="'input_small'" class="business_name_skeleton" />
    </div>
    <div
      v-if="!$parent.loading"
      :class="{ editorActive: editingPortfolio }"
      class="wrapper_card"
    >
      <h2>
        Portfolio
      </h2>
      <rich-editor
        :html-injection.sync="$parent.portfolio.notes"
        :empty-placeholder="'Your clients will be able to access this information. What do you want to share with them? You should include payment information and any important links.'"
        @on-edit-change="resolve_portfolio_editor"
      />
    </div>
    <skeleton v-else :type="'session'" class="wrapper_card_skeleton" />
    <!-- <products /> -->
  </div>
</template>

<script>
const RichEditor = () => import(/* webpackChunkName: "components.richeditor", webpackPreload: true  */ '../components/Editor')
// const Products = () => import(/* webpackChunkName: "components.products", webpackPreload: true  */ '../components/Products')

export default {
  components: {
    RichEditor
    // Products
  },
  async beforeRouteLeave (to, from, next) {
    if (this.$parent.dontLeave ? await this.$parent.$refs.confirm_pop_up.show('Your changes might not be saved', 'Are you sure you want to leave?') : true) {
      this.$parent.dontLeave = false
      next()
    }
  },
  data () {
    return {
      editingPortfolio: false,
      tempEditorStore: null
    }
  },
  async created () {
    this.$parent.loading = true
    this.will_body_scroll(true)
    await this.$parent.setup()
    await this.$parent.get_portfolio()
    this.$parent.end_loading()
  },
  methods: {

    resolve_portfolio_editor (state) {
      switch (state) {
        case 'edit':
          this.$parent.dontLeave = true
          this.editingPortfolio = true
          this.tempEditorStore = this.$parent.portfolio.notes
          break
        case 'save':
          this.editingPortfolio = false
          this.update(this.$parent.portfolio.notes)
          break
        case 'cancel':
          this.$parent.dontLeave = false
          this.editingPortfolio = false
          this.$parent.portfolio.notes = this.tempEditorStore
          break
      }
    },

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
        this.$parent.$refs.response_pop_up.show('Portfolio updated', 'Your clients can access this information')
        this.$parent.end_loading()
      } catch (e) {
        this.$parent.resolve_error(e)
      }
    }
  }
}
</script>

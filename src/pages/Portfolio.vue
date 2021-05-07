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
    opacity: var(--light_opacity)
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
  .portfolio_editor,
  .portfolio_editor_skeleton {
    margin: 4rem 0
  }
</style>

<template>
  <div id="portfolio" class="view_container">
    <div class="trainer_info">
      <input
        v-if="!loading"
        v-model="portfolio.business_name"
        class="trainer_info__business text--large"
        placeholder="Business name"
        aria-label="Business name"
        type="text"
        autocomplete="name"
        :disabled="silentLoading"
        @blur="updatePortfolio(portfolio.notes)"
        @input="editing_info = true"
      >
      <skeleton v-else :type="'input_large'" />
      <input
        v-if="!loading"
        v-model="portfolio.trainer_name"
        class="input--forms allow_text_overflow"
        placeholder="Trainer Name"
        aria-label="Trainer Name"
        type="text"
        autocomplete="name"
        :disabled="silentLoading"
        @blur="updatePortfolio(portfolio.notes)"
        @input="editing_info = true"
      >
      <skeleton v-else :type="'input_small'" class="business_name_skeleton" />
    </div>
    <div
      v-if="!loading"
      class="editor_object_standard portfolio_editor"
    >
      <h3>
        Portfolio
      </h3>
      <rich-editor
        v-model="portfolio.notes"
        :empty-placeholder="'Your clients will be able to access this information. What do you want to share with them? You should include payment information and any important links.'"
        @on-edit-change="resolve_portfolio_editor"
      />
    </div>
    <skeleton v-else :type="'session'" class="portfolio_editor_skeleton" />
    <!-- <products /> -->
  </div>
</template>

<script>
import { mapState } from 'vuex'
const RichEditor = () => import(/* webpackChunkName: "components.richeditor", webpackPreload: true  */ '../components/Editor')
// const Products = () => import(/* webpackChunkName: "components.products", webpackPreload: true  */ '../components/Products')

export default {
  components: {
    RichEditor
    // Products
  },
  async beforeRouteLeave (to, from, next) {
    if (this.dontLeave ? await this.$parent.$refs.confirm_pop_up.show('Your changes might not be saved', 'Are you sure you want to leave?') : true) {
      this.$store.commit('setData', {
        attr: 'dontLeave',
        data: false
      })
      next()
    }
  },
  data () {
    return {
      editingPortfolio: false,
      tempEditorStore: null
    }
  },
  computed: mapState([
    'loading',
    'silentLoading',
    'dontLeave',
    'portfolio'
  ]),
  async created () {
    this.$store.commit('setData', {
      attr: 'loading',
      data: true
    })
    this.willBodyScroll(true)
    await this.$parent.setup()
    await this.$store.dispatch('getPortfolio')
    this.$store.dispatch('endLoading')
  },
  methods: {
    resolve_portfolio_editor (state) {
      switch (state) {
        case 'edit':
          this.$store.commit('setData', {
            attr: 'dontLeave',
            data: true
          })
          this.editingPortfolio = true
          this.tempEditorStore = this.portfolio.notes
          break
        case 'save':
          this.editingPortfolio = false
          this.updatePortfolio(this.portfolio.notes)
          break
        case 'cancel':
          this.$store.commit('setData', {
            attr: 'dontLeave',
            data: false
          })
          this.editingPortfolio = false
          this.$store.commit('setDataDeep', {
            attrParent: 'portfolio',
            attrChild: 'notes',
            data: this.tempEditorStore
          })
          break
      }
    },

    // Database

    async updatePortfolio () {
      try {
        this.$store.commit('setData', {
          attr: 'silentLoading',
          data: true
        })
        this.$store.commit('setData', {
          attr: 'dontLeave',
          data: true
        })
        await this.$store.dispatch('updatePortfolio')
        this.$ga.event('Portfolio', 'update')
        this.$parent.$refs.response_pop_up.show('Portfolio updated', 'Your clients can access this information')
        this.$store.dispatch('endLoading')
      } catch (e) {
        this.$parent.resolveError(e)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.trainer_info {
  input {
    width: 100%;
    background-color: initial;
    border: 1px solid var(--base_faint);
    padding: 0.6rem 1rem;
    border-radius: 8px;
    transition: 0.4s all cubic-bezier(0.165, 0.84, 0.44, 1);
    &:hover {
      opacity: var(--light_opacity);
    }
    &:focus {
      opacity: 1;
      border: 1px solid var(--base);
      padding: 0.6rem 1.4rem;
    }
  }
  .trainer_info__business {
    max-width: 100%;
    margin-bottom: 1rem;
  }
  .business_name_skeleton {
    margin-top: 1rem;
  }
}
.portfolio_editor,
.portfolio_editor_skeleton {
  margin: 4rem 0;
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
        @blur="updatePortfolio()"
        @input="editing_info = true"
      />
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
        @blur="updatePortfolio()"
        @input="editing_info = true"
      />
      <skeleton v-else :type="'input_small'" class="business_name_skeleton" />
    </div>
    <div v-if="!loading" class="editor_object_standard portfolio_editor">
      <h3>Portfolio</h3>
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
import { mapState } from "vuex";
const RichEditor = () =>
  import(
    /* webpackChunkName: "components.richeditor", webpackPreload: true  */ "@/components/Editor"
  );
// const Products = () => import(/* webpackChunkName: "components.products", webpackPreload: true  */ '@/components/Products')

export default {
  metaInfo() {
    return {
      title: "Portfolio",
    };
  },
  components: {
    RichEditor,
    // Products
  },
  async beforeRouteLeave(to, from, next) {
    if (
      this.dontLeave
        ? await this.$parent.$refs.confirm_pop_up.show(
            "Your changes might not be saved",
            "Are you sure you want to leave?"
          )
        : true
    ) {
      this.$store.commit("setData", {
        attr: "dontLeave",
        data: false,
      });
      next();
    }
  },
  data() {
    return {
      editingPortfolio: false,
      tempEditorStore: null,
    };
  },
  computed: mapState([
    "claims",
    "loading",
    "silentLoading",
    "dontLeave",
    "portfolio",
    "hasCheckedStripeConnect",
  ]),
  async created() {
    this.$store.commit("setData", {
      attr: "loading",
      data: true,
    });
    this.willBodyScroll(true);
    await this.$parent.setup();
    // await this.checkStripeConnect()
    this.$store.dispatch("endLoading");
  },
  methods: {
    // -----------------------------
    // General
    // -----------------------------

    /**
     * Resolves the state of the portfolio editor.
     * @param {string} state - The returned state of the editor.
     */
    resolve_portfolio_editor(state) {
      switch (state) {
        case "edit":
          this.$store.commit("setData", {
            attr: "dontLeave",
            data: true,
          });
          this.editingPortfolio = true;
          this.tempEditorStore = this.portfolio.notes;
          break;
        case "save":
          this.editingPortfolio = false;
          this.updatePortfolio();
          break;
        case "cancel":
          this.$store.commit("setData", {
            attr: "dontLeave",
            data: false,
          });
          this.editingPortfolio = false;
          this.$store.commit("setDataDeep", {
            attrParent: "portfolio",
            attrChild: "notes",
            data: this.tempEditorStore,
          });
          break;
      }
    },

    // -----------------------------
    // Database
    // -----------------------------

    /**
     * Updates the portfolio.
     */
    async updatePortfolio() {
      try {
        this.$store.commit("setData", {
          attr: "silentLoading",
          data: true,
        });
        this.$store.commit("setData", {
          attr: "dontLeave",
          data: true,
        });
        await this.$store.dispatch("updatePortfolio");
        this.$ga.event("Portfolio", "update");
        this.$store.dispatch("openResponsePopUp", {
          title: "Portfolio updated",
          description: "Your clients can access this information",
        });
        this.$store.dispatch("endLoading");
      } catch (e) {
        this.$parent.resolveError(e);
      }
    },

    // -----------------------------
    // Stripe connect
    // -----------------------------

    async stripeConnect() {
      try {
        this.$store.commit("setData", {
          attr: "dontLeave",
          data: true,
        });
        const RESPONSE = await this.$axios.post(
          "/.netlify/functions/create-connected-account",
          {
            email: this.claims.email,
            connectedAccountId: this.claims.connectedAccountId,
          }
        );
        this.claims.connectedAccountId = RESPONSE.data.connectedAccountId;
        await this.$store.dispatch("saveClaims");
        window.location.href = RESPONSE.data.url;
        this.$store.dispatch("endLoading");
      } catch (e) {
        this.$parent.resolveError(e);
      }
    },
    async checkStripeConnect() {
      if (!this.hasCheckedStripeConnect) {
        const RESPONSE_STRIPE = await this.$axios.post(
          "/.netlify/functions/check-connected-account",
          {
            connectedAccountId: this.claims.connectedAccountId,
          }
        );
        this.$store.commit("setData", {
          attr: "isStripeConnected",
          data:
            this.claims.email === "demo@traininblocks.com" ||
            RESPONSE_STRIPE.data,
        });
        this.$store.commit("setData", {
          attr: "hasCheckedStripeConnect",
          data: true,
        });
      }
    },
  },
};
</script>

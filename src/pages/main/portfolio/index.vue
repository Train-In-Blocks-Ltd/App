<template>
    <wrapper id="portfolio">
        <!-- Business name -->
        <skeleton v-if="loading" :type="'input_large'" />
        <txt-input
            v-else
            placeholder="Business name"
            aria-label="Business name"
            type="text"
            autocomplete="name"
            class="mb-4"
            input-class="text-4xl"
            :value="portfolio.business_name"
            :disabled="silentLoading"
            :on-blur="() => updatePortfolio()"
            :on-input="() => (editing_info = true)"
            @output="(data) => (portfolio.business_name = data)"
        />

        <!-- Trainer name -->
        <skeleton v-if="loading" :type="'input_small'" />
        <txt-input
            v-else
            placeholder="Trainer Name"
            aria-label="Trainer Name"
            type="text"
            autocomplete="name"
            class="mb-16"
            :value="portfolio.trainer_name"
            :disabled="silentLoading"
            :on-blur="() => updatePortfolio()"
            :on-input="() => (editing_info = true)"
            @output="(data) => (portfolio.trainer_name = data)"
        />

        <!-- Portfolio content -->
        <skeleton v-if="loading" :type="'session'" />
        <editor-wrapper v-else title="Portfolio">
            <rich-editor
                v-model="portfolio.notes"
                :empty-placeholder="'Your clients will be able to access this information. What do you want to share with them? You should include payment information and any important links.'"
                @on-edit-change="resolve_portfolio_editor"
            />
        </editor-wrapper>

        <!-- <products /> -->
    </wrapper>
</template>

<script>
import { mapState } from "vuex";

const EditorWrapper = () =>
    import(
        /* webpackChunkName: "components.editorWrapper", webpackPreload: true  */ "@/components/generic/EditorWrapper"
    );
// const Products = () => import(/* webpackChunkName: "components.products", webpackPreload: true  */ '@/components/Products')

export default {
    metaInfo() {
        return {
            title: "Portfolio",
        };
    },
    components: {
        EditorWrapper,
        // Products
    },
    async beforeRouteLeave(to, from, next) {
        if (
            this.dontLeave
                ? await this.$store.dispatch("openConfirmPopUp", {
                      title: "Your changes might not be saved",
                      text: "Are you sure you want to leave?",
                  })
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
                this.$store.dispatch("resolveError", e);
            }
        },

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
                this.claims.connectedAccountId =
                    RESPONSE.data.connectedAccountId;
                await this.$store.dispatch("saveClaims");
                window.location.href = RESPONSE.data.url;
                this.$store.dispatch("endLoading");
            } catch (e) {
                this.$store.dispatch("resolveError", e);
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

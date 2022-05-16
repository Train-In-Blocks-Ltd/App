<template>
    <wrapper id="portfolio">
        <!-- Business name -->
        <div v-if="loading" class="skeleton-box animate-pulse p-4 mb-4">
            <div class="skeleton-item-lg" />
        </div>
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
        <div v-if="loading" class="skeleton-box animate-pulse p-4 mb-16">
            <div class="skeleton-item" />
        </div>
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
        <div v-if="loading" class="skeleton-box animate-pulse p-4 mb-8">
            <div class="skeleton-item w-1/3" />
            <div class="skeleton-item w-2/3" />
            <div class="skeleton-item w-5/12" />
            <div class="skeleton-item w-1/2" />
            <div class="skeleton-item w-1/4" />
        </div>
        <label-wrapper v-else title="Portfolio">
            <rich-editor
                v-model="portfolio.notes"
                :empty-placeholder="'Your clients will be able to access this information. What do you want to share with them? You should include payment information and any important links.'"
                @on-edit-change="resolve_portfolio_editor"
            />
        </label-wrapper>

        <!-- <products /> -->
    </wrapper>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import appState from "../../../store/modules/appState";
import portfolioStore from "../../../store/modules/portfolio";
import utilsStore from "../../../store/modules/utils";
import { NavigationGuardNext, Route } from "vue-router";
import { EditorState } from "@/src/store/modules/types";

const LabelWrapper = () =>
    import(
        /* webpackChunkName: "components.labelWrapper", webpackPreload: true  */ "../../../components/generic/LabelWrapper.vue"
    );
// const Products = () => import(/* webpackChunkName: "components.products", webpackPreload: true  */ '@/components/Products')

@Component({
    metaInfo() {
        return {
            title: "Portfolio",
        };
    },
    components: {
        LabelWrapper,
        // Products
    },
})
export default class Portfolio extends Vue {
    tempEditorStore: string | null = null;
    editingPortfolio: boolean = false;

    get dontLeave() {
        return appState.dontLeave;
    }
    get claims() {
        return appState.claims;
    }
    get loading() {
        return appState.loading;
    }
    get silentLoading() {
        return appState.silentLoading;
    }
    get portfolio() {
        const { pt_id, business_name, trainer_name, notes } = portfolioStore;
        return {
            pt_id,
            business_name,
            trainer_name,
            notes,
        };
    }

    async beforeRouteLeave(to: Route, from: Route, next: NavigationGuardNext) {
        if (
            this.dontLeave
                ? await utilsStore.confirmPopUpRef?.open({
                      title: "Your changes might not be saved",
                      text: "Are you sure you want to leave?",
                  })
                : true
        ) {
            appState.setDontLeave(false);
            next();
        }
    }

    async created() {
        appState.setLoading(true);
        // @ts-expect-error
        await this.$parent.setup();
        // await this.checkStripeConnect()
        appState.stopLoaders();
    }

    /** Resolves the state of the portfolio editor. */
    resolve_portfolio_editor(state: EditorState) {
        switch (state) {
            case "edit":
                appState.setDontLeave(true);
                this.editingPortfolio = true;
                this.tempEditorStore = this.portfolio.notes;
                break;
            case "save":
                this.editingPortfolio = false;
                this.updatePortfolio();
                break;
            case "cancel":
                appState.setDontLeave(false);
                this.editingPortfolio = false;
                const { pt_id, business_name, trainer_name } = this.portfolio;
                portfolioStore.revertPortfolio({
                    pt_id,
                    business_name,
                    trainer_name,
                    notes: this.tempEditorStore ?? "",
                });
                break;
        }
    }

    /** Updates the portfolio. */
    async updatePortfolio() {
        try {
            appState.setSilentLoading(true);
            appState.setDontLeave(true);
            await portfolioStore.updatePortfolio();
            this.$ga.event("Portfolio", "update");
            utilsStore.responsePopUpRef?.open({
                title: "Portfolio updated",
                text: "Your clients can access this information",
            });
            appState.stopLoaders();
        } catch (e) {
            utilsStore.resolveError(e as string);
        }
    }

    // TODO: Stripe integration
    // async stripeConnect() {
    //     try {
    //         this.$store.dispatch("setLoading", {
    //             dontLeave: true,
    //         });
    //         const RESPONSE = await this.$axios.post(
    //             "/.netlify/functions/create-connected-account",
    //             {
    //                 email: this.claims.email,
    //                 connectedAccountId: this.claims.connectedAccountId,
    //             }
    //         );
    //         this.claims.connectedAccountId =
    //             RESPONSE.data.connectedAccountId;
    //         await this.$store.dispatch("saveClaims");
    //         window.location.href = RESPONSE.data.url;
    //         this.$store.dispatch("setLoading", false);
    //     } catch (e) {
    //         this.$store.dispatch("resolveError", e);
    //     }
    // },

    // async checkStripeConnect() {
    //     if (!this.hasCheckedStripeConnect) {
    //         const RESPONSE_STRIPE = await this.$axios.post(
    //             "/.netlify/functions/check-connected-account",
    //             {
    //                 connectedAccountId: this.claims.connectedAccountId,
    //             }
    //         );
    //         this.$store.commit("SET_DATA", {
    //             attr: "isStripeConnected",
    //             data:
    //                 this.claims.email === "demo@traininblocks.com" ||
    //                 RESPONSE_STRIPE.data,
    //         });
    //         this.$store.commit("SET_DATA", {
    //             attr: "hasCheckedStripeConnect",
    //             data: true,
    //         });
    //     }
    // },
}
</script>

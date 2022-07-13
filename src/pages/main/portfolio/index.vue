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
            :value="business_name"
            :disabled="silentLoading"
            :on-blur="() => updatePortfolio()"
            :on-input="() => (editing_info = true)"
            @output="(data) => (business_name = data)"
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
            :value="trainer_name"
            :disabled="silentLoading"
            :on-blur="() => updatePortfolio()"
            :on-input="() => (editing_info = true)"
            @output="(data) => (trainer_name = data)"
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
                v-model="notes"
                :placeholder="'Your clients will be able to access this information. What do you want to share with them? You should include payment information and any important links.'"
                @on-edit-change="resolve_portfolio_editor"
            />
        </label-wrapper>
        <div>test</div>
        <products />
    </wrapper>
</template>

<script lang="ts">
import axios from "axios";
import { Component, Vue } from "vue-property-decorator";
import appModule from "../../../store/app.module";
import accountModule from "../../../store/account.module";
import portfolioModule from "../../../store/portfolio.module";
import utilsModule from "../../../store/utils.module";
import { NavigationGuardNext, Route } from "vue-router";
import { EditorState } from "../../../common/types";

const LabelWrapper = () =>
    import(
        /* webpackChunkName: "components.labelWrapper", webpackPreload: true  */ "../../../components/generic/LabelWrapper.vue"
    );
const Products = () =>
    import(
        /* webpackChunkName: "components.products", webpackPreload: true  */ "../../../components/generic/Products.vue"
    );

@Component({
    metaInfo() {
        return {
            title: "Portfolio",
        };
    },
    components: {
        LabelWrapper,
        Products,
    },
})
export default class Portfolio extends Vue {
    tempEditorStore: string | null = null;
    editingPortfolio: Boolean = false;
    hasCheckedStripeConnect: Boolean = false;

    get claims() {
        return accountModule.claims;
    }
    get dontLeave() {
        return appModule.dontLeave;
    }
    get loading() {
        return appModule.loading;
    }
    get silentLoading() {
        return appModule.silentLoading;
    }
    get pt_id() {
        return portfolioModule.pt_id;
    }

    async created () {
        await this.checkStripeConnect()
    }

    // Form data

    get business_name() {
        return portfolioModule.business_name;
    }
    set business_name(value) {
        portfolioModule.setBusinessName(value);
    }

    get trainer_name() {
        return portfolioModule.trainer_name;
    }
    set trainer_name(value) {
        portfolioModule.setTrainerName(value);
    }

    get notes() {
        return portfolioModule.notes;
    }
    set notes(value) {
        portfolioModule.setNotes(value);
    }

    async beforeRouteLeave(to: Route, from: Route, next: NavigationGuardNext) {
        if (
            this.dontLeave
                ? await utilsModule.confirmPopUpRef?.open({
                      title: "Your changes might not be saved",
                      text: "Are you sure you want to leave?",
                  })
                : true
        ) {
            appModule.setDontLeave(false);
            next();
        }
    }

    /** Resolves the state of the portfolio editor. */
    resolve_portfolio_editor(state: EditorState) {
        switch (state) {
            case "edit":
                appModule.setDontLeave(true);
                this.editingPortfolio = true;
                this.tempEditorStore = this.notes;
                break;
            case "save":
                this.editingPortfolio = false;
                this.updatePortfolio();
                break;
            case "cancel":
                appModule.setDontLeave(false);
                this.editingPortfolio = false;
                const { pt_id, business_name, trainer_name } = this;
                portfolioModule.setPortfolio({
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
            appModule.setSilentLoading(true);
            appModule.setDontLeave(true);

            await portfolioModule.updatePortfolio();
            this.$ga.event("Portfolio", "update");
            utilsModule.responsePopUpRef?.open({
                title: "Portfolio updated",
                text: "Your clients can access this information",
            });
            appModule.stopLoaders();
        } catch (e) {
            utilsModule.resolveError(e as string);
        }
    }

    // -----------------------------
    // Stripe connect
    // -----------------------------
    async stripeConnect () {
        if (this.claims) {
            try {
                appModule.setDontLeave(true);
                const RESPONSE = await axios.post('/.netlify/functions/create-connected-account', {
                    email: this.claims.email,
                    connectedAccountId: this.claims.connectedAccountId
                })
                this.hasCheckedStripeConnect = await RESPONSE.data.connectedAccountId;
                appModule.stopLoaders();
                window.location.href = RESPONSE.data.url;
            } catch (e) {
                utilsModule.resolveError(e as string);
            }
        }
    }

    async checkStripeConnect () {
        if (this.claims) {
            appModule.setSilentLoading(true);
            if (!this.hasCheckedStripeConnect) {
                const RESPONSE_STRIPE = await axios.post('/.netlify/functions/check-connected-account', {
                    connectedAccountId: this.claims.connectedAccountId
                },
                {
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        Authorization: process.env.TIB_API,
                    },
                })

                await portfolioModule.setIsStripeConnected(this.claims.email === 'demo@traininblocks.com' || await RESPONSE_STRIPE.data)
                await portfolioModule.setHasCheckedStripeConnect(true)
                appModule.stopLoaders();
            }
        }
    }
}
</script>

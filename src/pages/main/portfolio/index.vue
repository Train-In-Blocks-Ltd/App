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
    </wrapper>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import appModule from "../../../store/modules/app.module";
import accountModule from "../../../store/modules/account.module";
import portfolioStore from "../../../store/modules/portfolio";
import utilsStore from "../../../store/modules/utils";
import { NavigationGuardNext, Route } from "vue-router";
import { EditorState } from "@/src/store/modules/types";

const LabelWrapper = () =>
    import(
        /* webpackChunkName: "components.labelWrapper", webpackPreload: true  */ "../../../components/generic/LabelWrapper.vue"
    );

@Component({
    metaInfo() {
        return {
            title: "Portfolio",
        };
    },
    components: {
        LabelWrapper,
    },
})
export default class Portfolio extends Vue {
    tempEditorStore: string | null = null;
    editingPortfolio: boolean = false;

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
        return portfolioStore.pt_id;
    }

    // Form data

    get business_name() {
        return portfolioStore.business_name;
    }
    set business_name(value) {
        portfolioStore.setBusinessName(value);
    }

    get trainer_name() {
        return portfolioStore.trainer_name;
    }
    set trainer_name(value) {
        portfolioStore.setTrainerName(value);
    }

    get notes() {
        return portfolioStore.notes;
    }
    set notes(value) {
        portfolioStore.setNotes(value);
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
                portfolioStore.setPortfolio({
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

            await portfolioStore.updatePortfolio();
            this.$ga.event("Portfolio", "update");
            utilsStore.responsePopUpRef?.open({
                title: "Portfolio updated",
                text: "Your clients can access this information",
            });
            appModule.stopLoaders();
        } catch (e) {
            utilsStore.resolveError(e as string);
        }
    }
}
</script>

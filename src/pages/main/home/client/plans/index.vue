<template>
    <div>
        <!-- Client notes -->
        <label-wrapper title="Client Information" class="my-16">
            <rich-editor
                v-model="clientDetails.notes"
                :placeholder="'What goals does your client have? What physical measures have you taken?'"
                @on-edit-change="resolve_client_info_editor"
            />
        </label-wrapper>

        <!-- Bookings -->
        <bookings class="mb-16" />

        <!-- Plans section -->
        <div>
            <!-- Plans header -->
            <div class="flex justify-between items-center mb-8">
                <txt type="title">Plans</txt>
                <icon-button
                    svg="file-plus"
                    :on-click="handleOpenNewPlan"
                    :icon-size="28"
                    aria-label="New plan"
                    title="New plan"
                />
            </div>

            <!-- Plans grid -->
            <div v-if="loading" class="grid sm:grid-cols-2 gap-4">
                <div class="skeleton-box animate-pulse p-4">
                    <div class="skeleton-item w-1/3" />
                    <div class="skeleton-item w-3/4" />
                </div>
                <div class="skeleton-box animate-pulse p-4">
                    <div class="skeleton-item w-1/3" />
                    <div class="skeleton-item w-3/4" />
                </div>
            </div>
            <div
                v-else-if="
                    !!clientDetails.plans && clientDetails.plans.length !== 0
                "
                class="grid sm:grid-cols-2 gap-4"
            >
                <plan-card
                    v-for="(plan, index) in clientDetails.plans"
                    :key="`plan-${index}`"
                    :plan="plan"
                    :link="`plan/${plan.id}`"
                    is-trainer
                />
            </div>
            <txt v-else type="large-body" grey>
                No plans yet, use the button on the top-right of your screen
            </txt>
        </div>
    </div>
</template>

<script lang="ts">
import { EditorState } from "@/src/store/modules/types";
import { Component, Vue } from "vue-property-decorator";
import { NavigationGuardNext, Route } from "vue-router";
import appState from "../../../../../store/modules/appState";
import clientStore from "../../../../../store/modules/client";
import utilsStore from "../../../../../store/modules/utils";

const Bookings = () =>
    import(
        /* webpackChunkName: "components.bookings", webpackPreload: true  */ "./components/Bookings.vue"
    );
const PlanCard = () =>
    import(
        /* webpackChunkName: "components.planCard", webpackPreload: true  */ "../../../../../components/generic/PlanCard.vue"
    );
const LabelWrapper = () =>
    import(
        /* webpackChunkName: "components.labelWrapper", webpackPreload: true  */ "../../../../../components/generic/LabelWrapper.vue"
    );

@Component({
    components: {
        Bookings,
        PlanCard,
        LabelWrapper,
    },
})
export default class Plan extends Vue {
    tempEditorStore: string | null = "";
    editingClientNotes: boolean = false;

    get dontLeave() {
        return appState.dontLeave;
    }
    get loading() {
        return appState.loading;
    }
    get clientDetails() {
        return clientStore.clientDetails;
    }
    set clientDetails(value) {
        clientStore.setClientDetails(value);
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

    handleOpenNewPlan() {
        utilsStore.openModal({
            name: "new-plan",
            size: "xs",
        });
    }

    /** Resolves the client information editor. */
    async resolve_client_info_editor(state: EditorState) {
        switch (state) {
            case "edit":
                appState.setDontLeave(true);
                this.editingClientNotes = true;
                this.tempEditorStore = this.clientDetails?.notes ?? "";
                break;
            case "save":
                this.editingClientNotes = false;
                try {
                    appState.setDontLeave(true);
                    appState.setSilentLoading(true);
                    await clientStore.updateClient();
                    appState.stopLoaders();
                } catch (e) {
                    utilsStore.resolveError(e as string);
                }
                break;
            case "cancel":
                appState.setDontLeave(false);
                this.editingClientNotes = false;
                if (!this.clientDetails) return;
                clientStore.setClientDetails({
                    ...this.clientDetails,
                    notes: this.tempEditorStore ?? "",
                });
                break;
        }
    }
}
</script>

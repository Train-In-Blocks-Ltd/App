<template>
    <div class="flex">
        <icon-button
            class="mr-4"
            svg="arrow-left"
            :on-click="() => $router.back()"
            :size="32"
            aria-label="Back"
            title="Back"
        />
        <icon-button
            class="mr-4"
            svg="copy"
            :on-click="handleOpenDuplicate"
            :size="32"
            aria-label="Duplicate plan"
            title="Duplicate plan"
        />
        <icon-button
            class="mr-4"
            svg="pie-chart"
            :on-click="handleOpenStatistics"
            :size="32"
            aria-label="Statistics"
            title="Statistics"
        />
        <icon-button
            v-if="!isDemo"
            svg="trash"
            :on-click="deletePlan"
            :size="32"
            class="text-red-700"
            aria-label="Delete plan"
            title="Delete plan"
        />
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import appModule from "../../../../../../../store/modules/app.module";
import utilsStore from "../../../../../../../store/modules/utils";
import clientStore from "../../../../../../../store/modules/client";

@Component
export default class PlanOptions extends Vue {
    get isDemo() {
        return appModule.isDemo;
    }
    get clientDetails() {
        return clientStore.clientDetails;
    }

    handleOpenDuplicate() {
        utilsStore.openModal({
            name: "duplicate-plan",
        });
    }

    handleOpenStatistics() {
        utilsStore.openModal({
            name: "statistics",
        });
    }

    /** Deletes the plan. */
    async deletePlan() {
        if (
            await utilsStore.confirmPopUpRef?.open({
                title: "Are you sure you want to delete this plan?",
                text: "We will remove this plan from our database and it won't be recoverable.",
            })
        ) {
            try {
                appModule.setLoading(true);
                clientStore.deletePlan(parseInt(this.$route.params.id));
                this.$ga.event("Session", "delete");
                utilsStore.responsePopUpRef?.open({
                    title: "Plan deleted",
                    text: "Your changes have been saved",
                });
                appModule.stopLoaders();
                this.$router.push({
                    path: `/client/${this.clientDetails?.client_id}/`,
                });
            } catch (e) {
                utilsStore.resolveError(e as string);
            }
        }
    }
}
</script>

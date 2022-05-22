<template>
    <form class="mt-4" @submit.prevent="duplicatePlan()">
        <txt>Copy this plan to the same/different client</txt>
        <dropdown
            name="duplicate_client"
            class="my-4 w-full sm:w-1/2"
            :items="dropdownItems"
            @output="(data) => (client_id = data)"
            required
        />
        <default-button
            :is-disabled="!client_id"
            type="submit"
            aria-label="Duplicate"
        >
            Duplicate
        </default-button>
    </form>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import utilsStore from "../../../../../../../store/modules/utils";
import appModule from "../../../../../../../store/modules/app.module";
import planStore from "../../../../../../../store/modules/plan";
import clientsModule from "../../../../../../../store/modules/clients.module";

@Component
export default class DuplicatePlanModal extends Vue {
    client_id: number | null = null;

    get dropdownItems() {
        return clientsModule.clients.map((client) => {
            return {
                label: client.name,
                value: client.client_id,
            };
        });
    }
    get plan() {
        return planStore.plan;
    }

    /** Duplicates the plan to select client. */
    async duplicatePlan() {
        try {
            if (!this.plan || !this.client_id) return;
            appModule.setDontLeave(true);
            const { plan, client_id } = this;
            await clientsModule.duplicatePlan({ plan, client_id });
            this.$ga.event("Plan", "duplicate");
            utilsStore.responsePopUpRef?.open({
                title: "Plan duplicated",
                text: "Access it on your client's profile",
            });
            utilsStore.closeModal();
            appModule.stopLoaders();
            this.$router.push({ path: `/client/${this.client_id}/` });
        } catch (e) {
            utilsStore.resolveError(e as string);
        }
    }
}
</script>

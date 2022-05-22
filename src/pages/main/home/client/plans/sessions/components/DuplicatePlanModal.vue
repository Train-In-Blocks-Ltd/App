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
import utilsModule from "../../../../../../../store/utils.module";
import appModule from "../../../../../../../store/app.module";
import planModule from "../../../../../../../store/plan.module";
import clientsModule from "../../../../../../../store/clients.module";

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
        return planModule.plan;
    }

    /** Duplicates the plan to select client. */
    async duplicatePlan() {
        try {
            if (!this.plan || !this.client_id) return;
            appModule.setDontLeave(true);
            const { plan, client_id } = this;
            await clientsModule.duplicatePlan({ plan, client_id });
            this.$ga.event("Plan", "duplicate");
            utilsModule.responsePopUpRef?.open({
                title: "Plan duplicated",
                text: "Access it on your client's profile",
            });
            utilsModule.closeModal();
            appModule.stopLoaders();
            this.$router.push({ path: `/client/${this.client_id}/` });
        } catch (e) {
            utilsModule.resolveError(e as string);
        }
    }
}
</script>

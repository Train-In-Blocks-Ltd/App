<template>
    <form name="add_plan" class="grid gap-4 mt-8" @submit.prevent="createPlan">
        <txt-input
            ref="name"
            :value="name"
            type="text"
            placeholder="Name*"
            aria-label="Name"
            @output="(data) => (name = data)"
            focus-first
            required
        />
        <txt-input
            :value="duration"
            type="number"
            min="1"
            placeholder="Duration*"
            aria-label="Duration"
            @output="(data) => (duration = data)"
            required
        />
        <default-button type="submit" aria-label="Save"> Save </default-button>
    </form>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import appModule from "../../../../../../store/app.module";
import clientModule from "../../../../../../store/client.module.";
import clientsModule from "../../../../../../store/clients.module";
import utilsModule from "../../../../../../store/utils.module";

@Component
export default class NewPlanModal extends Vue {
    name: string = "";
    duration: string = "";

    get dontLeave() {
        return appModule.dontLeave;
    }
    get clientDetails() {
        return clientModule.clientDetails;
    }
    get clients() {
        return clientsModule.clients;
    }

    /** Creates a new plan. */
    async createPlan() {
        try {
            appModule.setDontLeave(true);
            await clientModule.createPlan({
                client_id: parseInt(this.$route.params.client_id),
                name: this.name,
                duration: parseInt(this.duration),
            });
            this.$ga.event("Plan", "new");
            utilsModule.responsePopUpRef?.open({
                title: `${this.name} created`,
                text: "You're all set, get programming",
            });
            this.name = "";
            this.duration = "";
            utilsModule.closeModal();
            appModule.stopLoaders();
        } catch (e) {
            utilsModule.resolveError(e as string);
        }
    }
}
</script>

<template>
    <form class="mt-4" @submit.prevent="duplicatePlan()">
        <txt>Copy this plan to the same/different client</txt>
        <dropdown
            name="duplicate_client"
            class="my-4 w-full sm:w-1/2"
            :items="dropdownItems"
            @output="(data) => (duplicateId = data)"
            required
        />
        <default-button :is-disabled="!duplicateId" type="submit">
            Duplicate
        </default-button>
    </form>
</template>

<script>
export default {
    computed: {
        dropdownItems() {
            return this.$store.state.clients.map((client) => {
                return {
                    label: client.name,
                    value: client.client_id,
                };
            });
        },
        plan() {
            return this.$store.getters.helper(
                "match_plan",
                this.$route.params.client_id,
                this.$route.params.id
            );
        },
    },
    data() {
        return {
            duplicateId: undefined,
        };
    },
    methods: {
        /**
         * Duplicates the plan to select client.
         */
        async duplicatePlan() {
            try {
                this.$store.dispatch("setLoading", {
                    dontLeave: true,
                });
                await this.$store.dispatch("duplicatePlan", {
                    clientId: this.duplicateId,
                    planId: this.plan.id,
                    planName: this.plan.name,
                    planDuration: this.plan.duration,
                    blockColor: this.plan.block_color,
                    planNotes: this.plan.notes,
                    planSessions: this.plan.sessions,
                });
                this.$ga.event("Plan", "duplicate");
                this.$store.dispatch("openResponsePopUp", {
                    title: "Plan duplicated",
                    description: "Access it on your client's profile",
                });
                this.$store.dispatch("closeModal");
                this.$store.dispatch("setLoading", false);
                this.$router.push({ path: `/client/${this.duplicateId}/` });
            } catch (e) {
                this.$store.dispatch("resolveError", e);
            }
        },
    },
};
</script>

<template>
    <div class="flex">
        <icon-button
            class="mr-4"
            svg="arrow-left"
            :on-click="() => $router.back()"
            :icon-size="32"
        />
        <icon-button
            class="mr-4"
            svg="copy"
            :on-click="
                () =>
                    $store.dispatch('openModal', {
                        name: 'duplicate-plan',
                    })
            "
            :icon-size="32"
        />
        <icon-button
            class="mr-4"
            svg="pie-chart"
            :on-click="
                () =>
                    $store.dispatch('openModal', {
                        name: 'statistics',
                    })
            "
            :icon-size="32"
        />
        <icon-button
            svg="trash"
            :on-click="() => deletePlan()"
            :icon-size="32"
        />
    </div>
</template>

<script>
export default {
    methods: {
        /**
         * Deletes the plan.
         */
        async deletePlan() {
            if (
                await this.$store.dispatch("openConfirmPopUp", {
                    title: "Are you sure you want to delete this plan?",
                    text: "We will remove this plan from our database and it won't be recoverable.",
                })
            ) {
                try {
                    this.$store.commit("setData", {
                        attr: "dontLeave",
                        data: true,
                    });
                    await this.$store.dispatch("deletePlan", {
                        clientId: this.$route.params.client_id,
                        planId: this.$route.params.id,
                    });
                    this.$ga.event("Session", "delete");
                    this.$store.dispatch("openResponsePopUp", {
                        title: "Plan deleted",
                        description: "Your changes have been saved",
                    });
                    this.$store.dispatch("endLoading");
                    this.$router.push({
                        path: `/client/${this.clientDetails.client_id}/`,
                    });
                } catch (e) {
                    this.$store.dispatch("resolveError", e);
                }
            }
        },
    },
};
</script>

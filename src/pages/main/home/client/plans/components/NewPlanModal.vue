<template>
    <form
        name="add_plan"
        class="grid gap-4 mt-8"
        @submit.prevent="
            () => {
                createPlan();
                $parent.isNewPlanOpen = false;
            }
        "
    >
        <txt-input
            ref="name"
            :value="newPlan.name"
            type="text"
            placeholder="Name*"
            aria-label="Name"
            @output="
                (data) => {
                    newPlan.name = data;
                    checkForm();
                }
            "
            focus-first
            required
        />
        <txt-input
            :value="newPlan.duration"
            type="number"
            min="1"
            placeholder="Duration*"
            aria-label="Duration"
            @output="
                (data) => {
                    newPlan.duration = data;
                    checkForm();
                }
            "
            required
        />
        <default-button :is-disabled="disableCreatePlanButton" type="submit">
            Save
        </default-button>
    </form>
</template>

<script>
import { mapState } from "vuex";

export default {
    data() {
        return {
            newPlan: {
                name: "",
                duration: "",
            },
            disableCreatePlanButton: true,
        };
    },
    computed: mapState(["dontLeave", "clientDetails", "clients"]),
    methods: {
        checkForm() {
            this.disableCreatePlanButton = !(
                this.newPlan.name && this.newPlan.duration
            );
        },

        /**
         * Creates a new plan.
         */
        async createPlan() {
            try {
                this.$store.dispatch("setLoading", {
                    loading: true,
                    dontLeave: true,
                });
                await this.$store.dispatch("createPlan", {
                    clientId: this.clientDetails.client_id,
                    name: this.newPlan.name,
                    duration: this.newPlan.duration,
                });
                this.$ga.event("Plan", "new");
                this.$store.dispatch("openResponsePopUp", {
                    title: `${this.newPlan.name} created`,
                    description: "You're all set, get programming",
                });
                this.newPlan = {
                    name: "",
                    duration: "",
                };
                this.$store.dispatch("setLoading", false);
            } catch (e) {
                this.$store.dispatch("resolveError", e);
            }
        },
    },
};
</script>

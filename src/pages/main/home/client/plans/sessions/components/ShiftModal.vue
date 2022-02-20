<template>
    <form class="grid gap-4 mt-4" @submit.prevent="shiftAcross()">
        <txt grey>
            This will move the dates ahead or behind by the specified amount
        </txt>
        <txt-input
            id="range"
            ref="range"
            name="range"
            type="number"
            label="Shift session dates by:"
            :value="shiftDays"
            @output="(data) => (shiftDays = data)"
            required
        />
        <default-button :disabled="!shiftDays" type="submit"
            >Shift</default-button
        >
    </form>
</template>

<script>
import { mapState } from "vuex";

export default {
    data() {
        return {
            shiftDays: 1,
        };
    },
    computed: {
        ...mapState(["selectedIds"]),
        plan() {
            return this.$store.getters.helper(
                "match_plan",
                this.$route.params.client_id,
                this.$route.params.id
            );
        },
    },
    methods: {
        /**
         * Shifts the selected sessions by specified days.
         */
        async shiftAcross() {
            this.$store.dispatch("setLoading", {
                dontLeave: true,
            });
            this.plan.sessions.forEach((session) => {
                if (this.selectedIds.includes(session.id)) {
                    this.$store.commit("updateSessionAttr", {
                        clientId: this.$route.params.client_id,
                        planId: this.$route.params.id,
                        sessionId: session.id,
                        attr: "date",
                        data: this.addDays(
                            session.date,
                            parseInt(this.shiftDays)
                        ),
                    });
                }
            });
            await this.$store.dispatch("batchUpdateSession", {
                clientId: this.$route.params.client_id,
                planId: this.$route.params.id,
                sessionIds: this.selectedIds,
            });
            this.$store.dispatch("closeModal");
            this.$store.dispatch("openResponsePopUp", {
                title:
                    this.selectedIds.length > 1
                        ? "Shifted sessions"
                        : "Shifted session",
                description: "Your changes have been saved",
            });
            this.shiftDays = 1;
            this.$store.commit("SET_DATA", {
                attr: "selectedIds",
                data: [],
            });
            this.$ga.event("Session", "shift");
            this.$store.dispatch("setLoading", false);
        },
    },
};
</script>

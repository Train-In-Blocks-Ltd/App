<template>
    <form class="grid gap-4 mt-4" @submit.prevent="moveToWeek()">
        <txt grey>
            This will change the colour code assigned to the sessions.
        </txt>
        <txt-input
            id="range"
            ref="range"
            name="range"
            type="number"
            min="1"
            label="Move to:"
            :value="moveTarget"
            :max="plan.duration"
            @output="(data) => (moveTarget = data)"
            required
        />
        <default-button :disabled="!moveTarget" type="submit" aria-label="Move"
            >Move</default-button
        >
    </form>
</template>

<script>
import { mapState } from "vuex";

export default {
    data() {
        return {
            moveTarget: 1,
        };
    },
    computed: {
        plan() {
            return this.$store.getters.getPlan({
                clientId: this.$route.params.client_id,
                planId: this.$route.params.id,
            });
        },
        ...mapState(["selectedIds"]),
    },
    methods: {
        /**
         * Moves the selected sessions to specified week.
         */
        async moveToWeek() {
            this.$store.dispatch("setLoading", {
                dontLeave: true,
            });
            this.plan.sessions.forEach((session) => {
                if (this.selectedIds.includes(session.id)) {
                    this.$store.commit("updateSessionAttr", {
                        clientId: this.$route.params.client_id,
                        planId: this.$route.params.id,
                        sessionId: session.id,
                        attr: "week_id",
                        data: this.moveTarget,
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
                        ? "Moved sessions"
                        : "Moved session",
                description: "Your changes have been saved",
            });
            this.moveTarget = 1;
            this.$store.commit("SET_DATA", {
                attr: "selectedIds",
                data: [],
            });
            this.$ga.event("Session", "move");
            this.$store.dispatch("setLoading", false);
        },
    },
};
</script>

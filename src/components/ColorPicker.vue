<template>
    <div class="relative">
        <div
            :style="{
                backgroundColor: weekColor[currentWeek - 1],
            }"
            class="h-8 w-16 rounded border-2 border-gray-800: dark:border-white hover:opacity-60 transition-opacity mr-4 cursor-pointer"
            @click="editingWeekColor = !editingWeekColor"
        />
        <div v-if="editingWeekColor" class="absolute top-8 left-0 z-10">
            <div
                v-for="(paint, index) in colorPalette"
                :key="'color_' + index"
                :style="{ backgroundColor: paint.color }"
                class="h-8 w-16 rounded cursor-pointer hover:opacity-60 transition-opacity mt-2"
                @click="
                    () => {
                        weekColor[currentWeek - 1] = paint.color;
                        useUpdateWeekColorMutation();
                    }
                "
            />
        </div>
    </div>
</template>

<script>
import { mapState } from "vuex";

export default {
    props: {
        currentWeek: Number,
    },
    data() {
        return {
            editingWeekColor: false,
            colorPalette: [
                { color: "#EB4034" },
                { color: "#EB9634" },
                { color: "#34EB6B" },
                { color: "#346BEB" },
                { color: "#303030" },
            ],
        };
    },
    computed: {
        plan() {
            return this.$store.getters.helper(
                "match_plan",
                this.$route.params.client_id,
                this.$route.params.id
            );
        },
        weekColor() {
            return this.plan.block_color
                .replace("[", "")
                .replace("]", "")
                .split(",");
        },
        ...mapState(["clientDetails"]),
    },
    methods: {
        /**
         * Updates the week color.
         */
        async useUpdateWeekColorMutation() {
            this.$store.commit("updatePlanAttr", {
                clientId: this.clientDetails.client_id,
                planId: this.plan.id,
                attr: "block_color",
                data: JSON.stringify(this.weekColor)
                    .replace(/"/g, "")
                    .replace(/[[\]]/g, "")
                    .replace(/\//g, ""),
            });
            this.editingWeekColor = false;
            try {
                await this.$store.dispatch("updatePlan", this.plan);
            } catch {
                this.$store.dispatch("resolveError", e);
            }
        },
    },
};
</script>

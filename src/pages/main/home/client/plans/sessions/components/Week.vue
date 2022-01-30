<template>
    <div
        class="flex flex-col cursor-pointer border-2 border-gray-800 dark:border-white rounded w-12 select-none"
        :class="weekNumber === currentWeek ? 'opacity-100' : 'opacity-60'"
        @click="$store.dispatch('changeWeek', weekNumber)"
    >
        <div
            :style="{
                backgroundColor: weekColor[weekNumber - 1]
                    ? weekColor[weekNumber - 1]
                    : '',
            }"
            :class="{
                'bg-gray-800 dark:bg-white opacity-40':
                    !weekColor[weekNumber - 1],
            }"
            class="w-full h-2 rounded-t-sm"
        />
        <div class="flex flex-col items-center justify-center h-16">
            <txt>
                {{ weekNumber }}
            </txt>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        weekNumber: Number,
        currentWeek: Number,
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
    },
};
</script>

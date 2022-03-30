<template>
    <div>
        <div class="relative z-40">
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
                    @click="handleSelect(paint.color)"
                />
            </div>
        </div>
        <backdrop
            v-if="editingWeekColor"
            :on-click="() => (editingWeekColor = false)"
        />
    </div>
</template>

<script>
const Backdrop = () =>
    import(
        /* webpackChunkName: "components.backdrop", webpackPreload: true */ "@/components/generic/Backdrop"
    );

export default {
    props: {
        plan: Object,
        weekColor: Array,
        currentWeek: Number,
    },
    components: {
        Backdrop,
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
    methods: {
        handleSelect(color) {
            this.$emit("output", color);
            this.editingWeekColor = false;
        },
    },
};
</script>

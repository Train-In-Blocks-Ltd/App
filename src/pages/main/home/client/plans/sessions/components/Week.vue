<template>
    <div
        class="flex flex-col cursor-pointer border-2 border-gray-800 dark:border-white rounded w-12 select-none"
        :class="weekNumber === currentWeek ? 'opacity-100' : 'opacity-60'"
        @click="handleChangeWeek"
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

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import planModule from "../../../../../../../store/plan.module";

@Component
export default class Week extends Vue {
    @Prop(Number) readonly weekNumber!: number;
    @Prop(Array) readonly weekColor!: string[];

    get currentWeek() {
        return planModule.currentWeek;
    }

    /** Changes the week. */
    handleChangeWeek() {
        planModule.setCurrentWeek(this.weekNumber);
    }
}
</script>

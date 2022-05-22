<template>
    <div
        class="w-full select-none border-2 border-gray-200: dark:border-white transition-all rounded-lg relative py-2 px-4"
    >
        <txt v-if="!sessions" grey>No sessions created yet</txt>
        <txt v-else grey>
            {{
                `Completed ${completedSessions} of
                ${totalSessions} sessions`
            }}
        </txt>
        <div
            class="absolute h-full top-0 left-0 rounded"
            :class="
                completedSessions === totalSessions
                    ? 'bg-green-700 opacity-30'
                    : 'bg-gray-800 opacity-10'
            "
            :style="{
                width: `${(completedSessions / totalSessions) * 100}%`,
            }"
        />
    </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Session } from "../../../../../../../store/types";

@Component
export default class PlanProgressBar extends Vue {
    @Prop(Array) readonly sessions!: Session[];

    get totalSessions() {
        return this.sessions.length ?? 1;
    }
    get completedSessions() {
        return this.sessions.filter((s) => s.checked === 1).length ?? 1;
    }
}
</script>

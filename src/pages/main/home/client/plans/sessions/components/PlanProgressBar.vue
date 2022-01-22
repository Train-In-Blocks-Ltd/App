<template>
    <div
        class="w-full select-none border-2 border-gray-400 transition-all rounded-lg relative py-2 px-4"
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

<script>
export default {
    props: {
        sessions: Array,
    },
    computed: {
        totalSessions() {
            return this.sessions.length ?? 1;
        },
        completedSessions() {
            return (
                this.sessions.filter((session) => session.checked === 1)
                    .length ?? 1
            );
        },
    },
};
</script>

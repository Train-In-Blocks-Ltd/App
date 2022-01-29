<template>
    <div
        v-if="!connected || isDemo"
        class="flex items-center justify-center py-1 bg-gray-800 fixed top-0 left-0 w-full z-20"
    >
        <txt v-if="!connected" type="tiny" class="text-white">
            Offline mode: we will sync your data when you reconnect
        </txt>
        <a
            v-else-if="isDemo"
            class="text-sm text-white"
            href="https://traininblocks.com/#pricing"
            target="_blank"
        >
            Demo account: click here to sign up
        </a>
    </div>
</template>

<script>
import { mapState } from "vuex";

export default {
    computed: {
        ...mapState(["authenticated", "connected", "claims"]),
        isDemo() {
            return (
                this.claims.email === "demo@traininblocks.com" &&
                this.authenticated
            );
        },
    },
};
</script>

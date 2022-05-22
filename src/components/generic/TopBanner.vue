<template>
    <div v-if="!connected || isDemo" class="flex justify-center mb-8">
        <txt
            v-if="!connected"
            type="tiny"
            class="text-white dark:text-gray-800 bg-gray-800 dark:bg-white px-12 pt-1 pb-2 rounded-b-2xl fixed z-50"
        >
            You are in offline mode
        </txt>
        <a
            v-else-if="isDemo"
            class="text-sm text-white dark:text-gray-800 bg-gray-800 dark:bg-white px-12 pt-1 pb-2 rounded-b-2xl fixed z-50"
            href="https://traininblocks.com/#pricing"
            target="_blank"
        >
            Demo account: click here to sign up
        </a>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import appModule from "../../store/modules/app.module";
import accountModule from "../../store/modules/account.module";

@Component
export default class TopBanner extends Vue {
    get authenticated() {
        return appModule.authenticated;
    }
    get claims() {
        return accountModule.claims;
    }
    get connected() {
        return appModule.connected;
    }
    get isDemo() {
        return appModule.isDemo;
    }
}
</script>

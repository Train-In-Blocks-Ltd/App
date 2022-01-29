<template>
    <div class="mt-8">
        <!-- Content -->
        <div v-if="pwa.canInstall">
            <txt bold>Add Train In Blocks to your home screen</txt>
            <txt grey>Access it quickly with a clearer interface</txt>
        </div>
        <div v-else-if="pwa.installed">
            <txt bold>You have Train In Blocks installed already!</txt>
            <txt grey>Launch it or keep using it in the browser</txt>
        </div>
        <div v-else-if="!pwa.canInstall">
            <txt bold>Add Train In Blocks to your home screen</txt>
            <txt grey>or continue using it in the browser</txt>
            <div class="mt-8">
                <txt bold>For Safari</txt>
                <txt
                    >1. Open the <i>Share</i> menu at the bottom of the
                    screen</txt
                >
                <txt>2. Select <i>Add to Home Screen</i></txt>
                <div class="grid gap-8 md:flex mt-8">
                    <img
                        :src="require('@/assets/install/1.jpg')"
                        alt="Open share menu"
                        loading="lazy"
                        class="rounded-lg mt-8 w-full md:w-1/2 lg:w-1/3 2xl:w-1/4 md:mr-4"
                    />
                    <img
                        :src="require('@/assets/install/2.jpg')"
                        alt="Add to home screen"
                        loading="lazy"
                        class="rounded-lg mt-8 w-full md:w-1/2 lg:w-1/3 2xl:w-1/4"
                    />
                </div>
            </div>
        </div>

        <!-- Buttons -->
        <div class="grid gap-4 mt-8">
            <default-button v-if="pwa.canInstall" :on-click="handleInstall">
                Install
            </default-button>
            <a
                v-else-if="!pwa.canInstall && pwa.installed"
                href="https://app.traininblocks.com"
                target="_blank"
            >
                <default-button>Launch</default-button>
            </a>
            <default-button
                v-if="pwa.canInstall || pwa.installed"
                theme="red"
                :on-click="handleClose"
            >
                Close
            </default-button>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState } from "vuex";

export default Vue.extend({
    computed: mapState(["pwa"]),
    methods: {
        handleInstall() {
            // Show the install prompt
            this.pwa.deferredPrompt.prompt();

            // Wait for the user to respond to the prompt
            this.pwa.deferredPrompt.userChoice.then(
                (choiceResult: { outcome: string }) => {
                    if (choiceResult.outcome === "accepted") {
                        // Hide the app provided install promotion
                        this.$store.commit("setDataDeep", {
                            attrParent: "pwa",
                            attrChild: "canInstall",
                            data: false,
                        });
                        this.$store.commit("setDataDeep", {
                            attrParent: "pwa",
                            attrChild: "displayMode",
                            data: "standalone",
                        });
                    } else {
                        this.$store.commit("setDataDeep", {
                            attrParent: "pwa",
                            attrChild: "canInstall",
                            data: true,
                        });
                    }
                }
            );
            this.$store.dispatch("closeModal");
        },
        handleClose() {
            this.$store.dispatch("closeModal");
        },
    },
});
</script>

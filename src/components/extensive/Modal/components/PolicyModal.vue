<style lang="scss">
#policy_agreement {
    #policy {
        h1 {
            @apply text-4xl mt-8;
        }
        h2 {
            @apply text-xl mt-8;
        }
        ol {
            @apply pl-4;
            li {
                @apply text-sm list-decimal;
            }
        }
        ul {
            @apply pl-4;
            li {
                @apply text-sm list-disc;
            }
        }
        p {
            @apply text-sm my-4;
        }
    }
}
</style>

<template>
    <form id="policy_agreement" @submit.prevent="agreeToTerms()">
        <div id="policy" v-html="eula.html" />
        <txt type="tiny" class="mt-4 mb-8" bold>
            By signing below, you agree to our End-User License Agreement,
            Privacy and Data Policy, Terms of Use, and Cookies Policy — all of
            of which are designed to protect your information and maintain the
            quality of our services.
        </txt>
        <div class="grid gap-4 md:flex">
            <txt-input
                type="name"
                placeholder="Your full name"
                class="md:w-1/2"
                :value="name"
                @output="(data) => (name = data)"
                required
            />
            <default-button type="submit" aria-label="Agree">
                Agree
            </default-button>
        </div>
    </form>
</template>

<script lang="ts">
import appState from "../../../../store/modules/appState";
import accountStore from "../../../../store/modules/account";
import utilsStore from "../../../../store/modules/utils";
import { Component, Mixins } from "vue-property-decorator";
import MainMixins from "../../../../main.mixins";

@Component
export default class PolicyModal extends Mixins(MainMixins) {
    name: string | null = null;
    eula: string | null = null;

    get claims() {
        return accountStore.claims;
    }
    get policyVersion() {
        return appState.policyVersion;
    }

    created() {
        if (this.claims?.user_type === "Client")
            this.eula = require("../../../../components/legal/eula-client.md");
        else this.eula = require("../../../../components/legal/eula.md");
    }

    /** Agree to EULA terms. */
    async agreeToTerms() {
        accountStore.setClaimsPolicy([
            this.name,
            this.today(),
            this.policyVersion,
        ]);
        try {
            appState.setDontLeave(true);
            await accountStore.updateClaims();
            appState.stopLoaders();
            utilsStore.closeModal();
        } catch (e) {
            utilsStore.resolveError(e as string);
        }
    }
}
</script>

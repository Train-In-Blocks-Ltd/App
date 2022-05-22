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
import appModule from "../../../../store/app.module";
import accountModule from "../../../../store/account.module";
import utilsModule from "../../../../store/utils.module";
import { Component, Mixins } from "vue-property-decorator";
import MainMixins from "../../../../main.mixins";

@Component
export default class PolicyModal extends Mixins(MainMixins) {
    name: string | null = null;
    eula: string | null = null;

    get claims() {
        return accountModule.claims;
    }
    get policyVersion() {
        return appModule.policyVersion;
    }

    created() {
        if (this.claims?.user_type === "Client")
            this.eula = require("../../../../common/legal/eula-client.md");
        else this.eula = require("../../../../common/legal/eula.md");
    }

    /** Agree to EULA terms. */
    async agreeToTerms() {
        if (!this.claims) return;
        accountModule.setClaims({
            ...this.claims,
            policy: [this.name, this.today(), this.policyVersion],
        });
        try {
            appModule.setDontLeave(true);
            await accountModule.updateClaims();
            appModule.stopLoaders();
            utilsModule.closeModal();
        } catch (e) {
            utilsModule.resolveError(e as string);
        }
    }
}
</script>

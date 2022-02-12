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
            <default-button type="submit"> Agree </default-button>
        </div>
    </form>
</template>

<script>
import { mapState } from "vuex";

export default {
    data() {
        return {
            name: undefined,
            eula: null,
        };
    },
    created() {
        if (this.claims.user_type === "Client")
            this.eula = require("@/components/legal/eula-client.md");
        else this.eula = require("@/components/legal/eula.md");
    },
    computed: mapState(["claims"]),
    methods: {
        /**
         * Agree to EULA terms.
         */
        async agreeToTerms() {
            this.$store.commit("setDataDeep", {
                attrParent: "claims",
                attrChild: "policy",
                data: [
                    this.name,
                    this.today(),
                    this.$store.state.policyVersion,
                ],
            });
            try {
                this.$store.commit("setData", {
                    attr: "dontLeave",
                    data: true,
                });
                await this.$store.dispatch("saveClaims");
                this.$store.dispatch("endLoading");
                this.$store.dispatch("closeModal");
            } catch (e) {
                this.$store.dispatch("resolveError", e);
            }
        },
    },
};
</script>

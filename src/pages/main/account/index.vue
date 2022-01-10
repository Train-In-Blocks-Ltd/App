<template>
    <wrapper v-if="claims" id="account">
        <preview-modal
            :desc="previewDesc"
            :html="previewHTML"
            :show-media="false"
            :show-brackets="true"
            @close="(previewDesc = null), (previewHTML = null)"
        />
        <txt type="title" is-main>Your Account</txt>
        <div v-if="claims" class="grid md:grid-cols-2 gap-16 mt-8">
            <div>
                <div class="grid gap-4 mb-12">
                    <txt type="large-body" bold>General settings</txt>
                    <txt class="mb-4"><b>Email: </b>{{ claims.email }}</txt>
                    <default-button
                        v-if="
                            claims.user_type != 'Client' ||
                            claims.user_type == 'Admin'
                        "
                        :on-click-prevent="() => manageSubscription()"
                    >
                        Manage Subscription
                    </default-button>
                    <default-button
                        :on-click="
                            () =>
                                $store.dispatch('openModal', {
                                    name: 'reset-password',
                                })
                        "
                    >
                        Change Password
                    </default-button>
                </div>
                <div class="grid gap-4 mb-12">
                    <label for="theme">
                        <txt type="large-body" bold>Theme</txt>
                    </label>
                    <dropdown
                        :value="claims.theme"
                        :items="dropdownItems"
                        @output="
                            (data) => {
                                $store.commit('setDataDeep', {
                                    attrParent: 'claims',
                                    attrChild: 'theme',
                                    data,
                                });
                                $parent.darkmode(data);
                                $parent.saveClaims();
                            }
                        "
                    />
                </div>
                <div class="grid gap-4">
                    <txt type="large-body" bold>Referral Code</txt>
                    <txt>
                        <b>Earn up to 15% off!</b> You'll receive a 5% discount
                        for each referral you make, up to a maximum of 15% off.
                        Each person you refer will also receive 20% off their
                        first month too. It's a win-win!
                    </txt>
                    <default-button
                        v-if="!coupon.generated"
                        :on-click-prevent="() => generateCoupon()"
                    >
                        Generate Coupon
                    </default-button>
                    <default-button
                        v-else
                        :on-click-prevent="() => copyCoupon()"
                        v-html="coupon.code"
                    />
                </div>
            </div>
            <div>
                <div class="grid gap-4 mb-12">
                    <txt type="large-body" bold>Calendar</txt>
                    <label>
                        Enable calendar link:
                        <input
                            v-model="claims.calendar"
                            class="claims-calendar"
                            type="checkbox"
                            @change="$parent.saveClaims()"
                        />
                    </label>
                    <txt type="tiny">
                        Anyone with the link will be able to see all of your
                        bookings
                    </txt>
                    <div v-if="claims.calendar" class="grid gap-2 my-4">
                        <a
                            v-for="(guide, guideIndex) in calendarGuides"
                            :key="`cal_${guideIndex}`"
                            :href="guide.link"
                            target="_blank"
                            rel="noreferrer"
                            class=""
                        >
                            <txt bold>Add to {{ guide.name }} calendar</txt>
                        </a>
                    </div>
                    <default-button
                        v-if="claims.calendar"
                        :on-click-prevent="() => copyCalendarLink()"
                        v-html="calendarText"
                    />
                </div>
                <div class="grid gap-4">
                    <txt type="large-body" bold>Your Privacy and Data</txt>
                    <txt>
                        You can find more information about our policies below:
                    </txt>
                    <div class="grid gap-2 my-4">
                        <a
                            v-for="(policy, policyIndex) in policies"
                            :key="`policy_${policyIndex}`"
                            :href="policy.link"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <txt bold>
                                {{ policy.title }}
                            </txt>
                        </a>
                        <a href="javascript:void(0)" @click="openEULA">
                            <txt bold>EULA</txt>
                        </a>
                    </div>
                    <label class="flex items-center">
                        Allow Third Party Cookies:
                        <input
                            v-model="claims.ga"
                            type="checkbox"
                            @change="$parent.saveClaims()"
                            class="ml-4"
                        />
                    </label>
                </div>
            </div>
        </div>
        <br />
        <br />
        <version-label />
    </wrapper>
</template>

<script>
import { mapState } from "vuex";
const PreviewModal = () =>
    import(
        /* webpackChunkName: "components.previewModal", webpackPrefetch: true */ "@/components/PreviewModal"
    );
const VersionLabel = () =>
    import(
        /* webpackChunkName: "components.versionLabel", webpackPreload: true  */ "@/components/generic/VersionLabel"
    );

export default {
    metaInfo() {
        return {
            title: "Account",
        };
    },
    components: {
        PreviewModal,
        VersionLabel,
    },
    async beforeRouteLeave(to, from, next) {
        if (
            this.dontLeave
                ? await this.$parent.$refs.confirm_pop_up.show(
                      "Your changes might not be saved",
                      "Are you sure you want to leave?"
                  )
                : true
        ) {
            this.$store.commit("setData", {
                attr: "dontLeave",
                data: false,
            });
            next();
        }
    },
    data() {
        return {
            dropdownItems: [
                {
                    label: "System Default",
                    value: "system",
                },
                {
                    label: "Light",
                    value: "light",
                },
                {
                    label: "Dark",
                    value: "dark",
                },
            ],
            calendarText: "Get your calendar link",
            calendarGuides: [
                {
                    name: "Google",
                    link: "",
                },
                {
                    name: "Outlook",
                    link: "https://support.microsoft.com/en-us/office/import-or-subscribe-to-a-calendar-in-outlook-com-cff1429c-5af6-41ec-a5b4-74f2c278e98c",
                },
                {
                    name: "Apple",
                    link: "https://support.apple.com/en-gb/guide/calendar/icl1022/mac",
                },
            ],
            policies: [
                {
                    title: "Privacy and Data Policy",
                    link: "http://traininblocks.com/legal/privacy-and-data-policy",
                },
                {
                    title: "Cookies Policy",
                    link: "http://traininblocks.com/legal/cookies-policy",
                },
                {
                    title: "Terms of Use",
                    link: "http://traininblocks.com/legal/terms-of-use",
                },
            ],
            previewDesc: null,
            previewHTML: null,
        };
    },
    computed: mapState([
        "dontLeave",
        "claims",
        "versionName",
        "versionBuild",
        "coupon",
    ]),
    async created() {
        this.$store.commit("setData", {
            attr: "loading",
            data: true,
        });
        this.willBodyScroll(true);
        await this.$parent.setup();
        this.$store.dispatch("endLoading");
    },
    async mounted() {
        if (!this.coupon.checked) {
            await this.checkCoupon();
        }
        this.calendarGuides[0].link = `https://calendar.google.com/calendar/u/0/r?cid=${
            window.location.host === "localhost:8080"
                ? "http://" + window.location.host
                : "https://" + window.location.host
        }/.netlify/functions/calendar?email=${this.claims.email}`;
    },
    methods: {
        openEULA() {
            if (this.claims.user_type === "Client") {
                this.previewHTML =
                    require("@/components/legal/eula-client.md").html;
            } else {
                this.previewHTML = require("@/components/legal/eula.md").html;
            }
        },

        /**
         * Redirects the user to their Stripe management page.
         */
        async manageSubscription() {
            try {
                const RESPONSE = await this.$axios.post(
                    "/.netlify/functions/create-manage-link",
                    {
                        id: this.claims.stripeId,
                    }
                );
                window.location.href = RESPONSE.data;
            } catch (e) {
                this.$parent.resolveError(e);
            }
        },

        /**
         * Generates the user's calendar link.
         */
        copyCalendarLink() {
            const link = `${
                window.location.host === "localhost:8080"
                    ? "http://" + window.location.host
                    : "https://" + window.location.host
            }/.netlify/functions/calendar?email=${this.claims.email}`;
            const self = this;
            navigator.clipboard.writeText(link).then(
                function () {
                    self.calendarText = "Copied!";
                    setTimeout(function () {
                        self.calendarText = "Get your calendar link";
                    }, 2000);
                },
                function (err) {
                    self.calendarText = "Could not copy text: " + err;
                }
            );
        },

        /*
         * Checks if the user already has coupons activated.
         */
        async checkCoupon() {
            try {
                this.$store.commit("setData", {
                    attr: "dontLeave",
                    data: true,
                });
                const RESPONSE = await this.$axios.post(
                    "/.netlify/functions/check-coupon",
                    {
                        email: this.claims.email,
                    }
                );
                if (
                    RESPONSE.data.data.find(
                        (coupon) =>
                            coupon.code ===
                            this.claims.email
                                .toUpperCase()
                                .replace(/[\W_]+/g, "")
                    ) &&
                    RESPONSE.data.data.find(
                        (coupon) =>
                            coupon.code ===
                            this.claims.email
                                .toUpperCase()
                                .replace(/[\W_]+/g, "")
                    ).active
                ) {
                    this.$store.commit("setDataDeep", {
                        attrParent: "coupon",
                        attrChild: "generated",
                        data: this.claims.email
                            .toUpperCase()
                            .replace(/[\W_]+/g, ""),
                    });
                    this.$store.commit("setDataDeep", {
                        attrParent: "coupon",
                        attrChild: "code",
                        data: this.claims.email
                            .toUpperCase()
                            .replace(/[\W_]+/g, ""),
                    });
                }
                this.$store.commit("setDataDeep", {
                    attrParent: "coupon",
                    attrChild: "checked",
                    data: true,
                });
                this.$store.dispatch("endLoading");
            } catch (e) {
                this.$parent.resolveError(e);
            }
        },
        async generateCoupon() {
            try {
                this.$store.commit("setData", {
                    attr: "dontLeave",
                    data: true,
                });
                await this.$axios.post("/.netlify/functions/create-coupon", {
                    email: this.claims.email,
                });
                this.$store.commit("setDataDeep", {
                    attrParent: "coupon",
                    attrChild: "generated",
                    data: this.claims.email
                        .toUpperCase()
                        .replace(/[\W_]+/g, ""),
                });
                this.$store.commit("setDataDeep", {
                    attrParent: "coupon",
                    attrChild: "code",
                    data: this.claims.email
                        .toUpperCase()
                        .replace(/[\W_]+/g, ""),
                });
                this.$store.dispatch("endLoading");
            } catch (e) {
                this.$parent.resolveError(e);
            }
        },
        copyCoupon() {
            const link = this.claims.email.toUpperCase().replace(/[\W_]+/g, "");
            const self = this;
            navigator.clipboard.writeText(link).then(
                function () {
                    self.$store.commit("setDataDeep", {
                        attrParent: "coupon",
                        attrChild: "code",
                        data: "Copied!",
                    });
                    setTimeout(function () {
                        self.$store.commit("setDataDeep", {
                            attrParent: "coupon",
                            attrChild: "code",
                            data: self.claims.email
                                .toUpperCase()
                                .replace(/[\W_]+/g, ""),
                        });
                    }, 2000);
                },
                function (err) {
                    self.$store.commit("setDataDeep", {
                        attrParent: "coupon",
                        attrChild: "code",
                        data: "Could not copy text: " + err,
                    });
                }
            );
        },
    },
};
</script>

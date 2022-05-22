<template>
    <wrapper v-if="claims" id="account">
        <txt type="title" main>Your Account</txt>
        <div v-if="claims" class="grid md:grid-cols-2 gap-16 my-8">
            <!-- Left-side -->
            <div>
                <!-- General -->
                <div class="grid gap-4 mb-12">
                    <txt type="large-body" bold>General settings</txt>
                    <txt class="mb-4"><b>Email: </b>{{ claims.email }}</txt>
                    <default-button
                        v-if="
                            claims.user_type != 'Client' ||
                            claims.user_type == 'Admin'
                        "
                        aria-label="Manage subscription"
                        :on-click="() => manageSubscription()"
                    >
                        Manage Subscription
                    </default-button>
                    <default-button
                        :on-click="handlePasswordReset"
                        aria-label="Change password"
                    >
                        Change Password
                    </default-button>
                </div>

                <!-- Theme -->
                <div class="grid gap-4 mb-12">
                    <label for="theme">
                        <txt type="large-body" bold>Theme</txt>
                    </label>
                    <dropdown
                        :value="darkmodeTheme"
                        :items="dropdownItems"
                        @output="(data) => handleThemeSelect(data)"
                    />
                </div>

                <!-- Referral -->
                <div v-if="isTrainer" class="grid gap-4">
                    <txt type="large-body" bold>Referral Code</txt>
                    <txt>
                        <b>Earn up to 15% off!</b> You'll receive a 5% discount
                        for each referral you make, up to a maximum of 15% off.
                        Each person you refer will also receive 20% off their
                        first month too. It's a win-win!
                    </txt>
                    <default-button
                        v-if="!coupon.generated"
                        :on-click="() => generateCoupon()"
                        aria-label="Generate coupon"
                    >
                        Generate Coupon
                    </default-button>
                    <default-button
                        v-else
                        :on-click="() => copyCoupon()"
                        v-html="coupon.code"
                        aria-label="Coupon code"
                    />
                </div>
            </div>

            <!-- Right-side -->
            <div>
                <!-- Calendar -->
                <div class="grid gap-4 mb-12">
                    <txt type="large-body" bold>Calendar</txt>
                    <label>
                        Enable calendar link:
                        <input
                            v-model="claims.calendar"
                            class="claims-calendar"
                            type="checkbox"
                            @change="handleEnableCalendar"
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
                        :on-click="() => copyCalendarLink()"
                        v-html="calendarText"
                        aria-label="Calendar link"
                    />
                </div>

                <!-- Privacy and data -->
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
                        <a
                            href="javascript:void(0)"
                            aria-label="Read EULA"
                            @click="openEULA"
                        >
                            <txt bold>EULA</txt>
                        </a>
                    </div>
                    <label class="flex items-center">
                        Allow Third Party Cookies:
                        <input
                            v-model="claims.ga"
                            type="checkbox"
                            @change="handleAllowCookies"
                            class="ml-4"
                        />
                    </label>
                </div>
            </div>
        </div>
        <version-label />
    </wrapper>
</template>

<script lang="ts">
import appModule from "../../../store/app.module";
import accountModule from "../../../store/account.module";
import utilsModule from "../../../store/utils.module";
import { Component, Vue } from "vue-property-decorator";
import { NavigationGuardNext, Route } from "vue-router";
import {
    CalendarGuide,
    Coupon,
    DarkmodeType,
    DropdownItem,
    PolicyLink,
    TIBUserClaims,
} from "../../../store/types";
import { baseAPI } from "../../../api";

const VersionLabel = () =>
    import(
        /* webpackChunkName: "components.versionLabel", webpackPreload: true  */ "../../../components/generic/VersionLabel.vue"
    );

@Component({
    metaInfo() {
        return {
            title: "Account",
        };
    },
    components: {
        VersionLabel,
    },
})
export default class Account extends Vue {
    dropdownItems: DropdownItem[] = [
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
    ];
    calendarText: string = "Get your calendar link";
    calendarGuides: CalendarGuide[] = [
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
    ];
    policies: PolicyLink[] = [
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
    ];

    get dontLeave() {
        return appModule.dontLeave;
    }
    get claims() {
        return accountModule.claims;
    }
    set claims(value: TIBUserClaims | null) {
        accountModule.setClaims(value);
    }
    get versionName() {
        return appModule.versionName;
    }
    get versionBuild() {
        return appModule.versionBuild;
    }
    get isTrainer() {
        return appModule.isTrainer;
    }
    get darkmodeTheme() {
        const theme = localStorage.getItem("darkmode");
        if (theme) return theme;
        return "system";
    }
    get coupon() {
        return accountModule.coupon;
    }

    async beforeRouteLeave(to: Route, from: Route, next: NavigationGuardNext) {
        if (
            this.dontLeave
                ? await utilsModule.confirmPopUpRef?.open({
                      title: "Your changes might not be saved",
                      text: "Are you sure you want to leave?",
                  })
                : true
        ) {
            appModule.setDontLeave(false);
            next();
        }
    }

    async mounted() {
        if (!this.coupon.checked) {
            await this.checkCoupon();
        }
        this.calendarGuides[0].link = `https://calendar.google.com/calendar/u/0/r?cid=${
            window.location.host === "localhost:8080"
                ? "http://" + window.location.host
                : "https://" + window.location.host
        }/.netlify/functions/calendar?email=${this.claims?.email}`;
    }

    /** Opens password reset modal. */
    handlePasswordReset() {
        utilsModule.openModal({
            name: "reset-password",
        });
    }

    /** Stores theme in local storage. */
    handleThemeSelect(theme: DarkmodeType) {
        localStorage.setItem("darkmode", theme);
        // @ts-expect-error
        this.$parent.darkmode(theme);
    }

    /** Toggles enabled calendar. */
    handleEnableCalendar() {
        accountModule.updateClaims();
    }

    /** Toggles tracking. */
    handleAllowCookies() {
        accountModule.updateClaims();
    }

    /** Opens EULA modal respective to user type. */
    openEULA() {
        utilsModule.openModal({
            name: "preview",
            previewTitle: "EULA",
            previewHTML: require(`@/components/legal/eula${
                this.claims?.user_type === "Client" ? "-client" : ""
            }.md`).html,
        });
    }

    /** Redirects the user to their Stripe management page. */
    async manageSubscription() {
        try {
            const RESPONSE = await baseAPI.post(
                "/.netlify/functions/create-manage-link",
                {
                    id: this.claims?.stripeId,
                }
            );
            window.location.href = RESPONSE.data;
        } catch (e) {
            utilsModule.resolveError(e as string);
        }
    }

    /** Generates the user's calendar link. */
    copyCalendarLink() {
        const link = `${
            window.location.host === "localhost:8080"
                ? "http://" + window.location.host
                : "https://" + window.location.host
        }/.netlify/functions/calendar?email=${this.claims?.email}`;
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
    }

    /** Checks if the user already has coupons activated. */
    async checkCoupon() {
        try {
            appModule.setDontLeave(true);
            const response = await baseAPI.post(
                "/.netlify/functions/check-coupon",
                {
                    email: this.claims?.email,
                }
            );
            const foundCoupon = response.data.data.find(
                (coupon: Coupon) =>
                    coupon.code ===
                    this.claims?.email?.toUpperCase().replace(/[\W_]+/g, "")
            );
            if (foundCoupon && foundCoupon.active) {
                accountModule.setCoupon({
                    checked: true,
                    code:
                        this.claims?.email
                            ?.toUpperCase()
                            .replace(/[\W_]+/g, "") ?? "",
                    generated: !!this.claims?.email
                        ?.toUpperCase()
                        .replace(/[\W_]+/g, ""),
                });
            }
            appModule.stopLoaders();
        } catch (e) {
            utilsModule.resolveError(e as string);
        }
    }

    /** Creates a new discount coupon */
    async generateCoupon() {
        try {
            appModule.setDontLeave(true);
            await baseAPI.post("/.netlify/functions/create-coupon", {
                email: this.claims?.email,
            });
            accountModule.setCoupon({
                checked: this.coupon.checked,
                code:
                    this.claims?.email?.toUpperCase().replace(/[\W_]+/g, "") ??
                    "",
                generated: !!this.claims?.email
                    ?.toUpperCase()
                    .replace(/[\W_]+/g, ""),
            });
            appModule.stopLoaders();
        } catch (e) {
            utilsModule.resolveError(e as string);
        }
    }

    /** Copies user's coupon. */
    copyCoupon() {
        const link = this.claims?.email?.toUpperCase().replace(/[\W_]+/g, "");
        const self = this;
        navigator.clipboard.writeText(link ?? "").then(
            () => {
                const { checked, generated } = self.coupon;
                accountModule.setCoupon({
                    checked,
                    generated,
                    code: "Copied!",
                });
                setTimeout(() => {
                    accountModule.setCoupon({
                        checked,
                        generated,
                        code:
                            self.claims?.email
                                ?.toUpperCase()
                                .replace(/[\W_]+/g, "") ?? "",
                    });
                }, 2000);
            },
            (e) => {
                const { checked, generated } = self.coupon;
                accountModule.setCoupon({
                    checked,
                    generated,
                    code: "Could not copy text: " + e,
                });
            }
        );
    }
}
</script>

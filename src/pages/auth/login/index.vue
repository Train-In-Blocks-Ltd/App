<style lang="scss">
#okta-signin-submit {
    @apply select-none cursor-pointer self-center rounded border-none px-6 py-3 font-bold text-white dark:text-gray-800 bg-gray-800 dark:bg-white transition-all hover:opacity-60;
}
.okta-form-title {
    @apply hidden;
}
.auth-org-logo {
    @apply my-8;
}
#okta-signin-username,
#okta-signin-password {
    @apply w-full px-2 py-3 font-sans outline-none bg-transparent text-gray-800 dark:text-white border-2 border-gray-200 dark:border-gray-400 rounded-lg hover:border-gray-800 focus:border-gray-800 dark:hover:border-white dark:focus:border-white transition-all;
}
.okta-form-input-error {
    @apply my-4 text-sm text-red-700;
}
.o-form-label {
    @apply mb-1;
}
.o-form-input-name-username {
    @apply w-full;
}
.o-form-input-name-remember {
    @apply text-sm;
}
.o-form-fieldset-container {
    @apply grid gap-6 my-8;
}
.custom-checkbox {
    label {
        @apply pl-2;
    }
    &:after {
        content: "Please remember to manually logout if this is a shared computer.";
        @apply block mt-1 text-sm;
    }
}
.auth-footer {
    @apply hidden;
}
</style>

<template>
    <div
        v-if="!authenticated"
        class="p-8 md:p-0 w-full max-w-xl pb-16 md:pr-24 m-auto"
    >
        <splash v-if="!splashed" />
        <icon svg="full-logo" :icon-size="150" />
        <a
            class="demo-details"
            href="javascript:void(0)"
            @click="showDemo = !showDemo"
        >
            <txt bold>
                {{ showDemo ? "Hide" : "Show demo account details" }}
            </txt>
        </a>
        <div v-if="showDemo" class="demo_details">
            <div class="info">demo@traininblocks.com</div>
            <div class="info">testingaccount123</div>
        </div>
        <div id="okta-signin-container" />
        <div class="grid gap-4 mt-8">
            <txt class="flex items-center">
                Need an account?
                <a href="https://traininblocks.com/#pricing" class="ml-4">
                    <txt bold>Sign up here</txt>
                </a>
            </txt>
            <reset-password v-if="open" />
            <txt v-if="!open" class="flex items-center">
                Forgot your password?
                <a href="javascript:(0)" @click="open = !open" class="ml-4">
                    <txt bold>Reset it here</txt>
                </a>
            </txt>
        </div>
        <txt type="tiny" class="my-8">
            By logging in and using this application you agree that essential
            first-party cookies will be placed on your computer. Non-essential
            third party cookies may also be placed but can be opted out of from
            your account page. For more information please read our
            <a href="https://traininblocks.com/legal/cookies-policy/"
                >Cookie Policy</a
            >.
        </txt>
        <version-label />
    </div>
</template>

<script>
import { mapState } from "vuex";

const Splash = () =>
    import(
        /* webpackChunkName: "components.splash", webpackPreload: true  */ "@/components/generic/Splash"
    );
const ResetPassword = () =>
    import(
        /* webpackChunkName: "components.resetPassword", webpackPreload: true  */ "./components/ResetPassword"
    );
const VersionLabel = () =>
    import(
        /* webpackChunkName: "components.versionLabel", webpackPreload: true  */ "@/components/generic/VersionLabel"
    );

const CUSTOM_ENV =
    process.env.NODE_ENV === "production"
        ? require("../../../../config/prod.env")
        : require("../../../../config/dev.env");

export default {
    components: {
        Splash,
        ResetPassword,
        VersionLabel,
    },
    data() {
        return {
            showDemo: false,
            splashed: false,
            open: false,
            id: null,
        };
    },
    computed: mapState(["authenticated", "versionName", "versionBuild"]),
    async mounted() {
        const scopes = ["openid", "profile", "email"];
        let OktaSignIn;
        await import(
            /* webpackChunkName: "okta.signin", webpackPreload: true  */ "@okta/okta-signin-widget/dist/js/okta-sign-in.no-polyfill.min.js"
        ).then((module) => {
            OktaSignIn = module.default;
        });
        this.splashed = true;
        this.willBodyScroll(true);
        this.$nextTick(function () {
            this.widget = new OktaSignIn({
                baseUrl: CUSTOM_ENV.OKTA.CLIENT_ID,
                issuer: CUSTOM_ENV.OKTA.ISSUER + "/oauth2/default",
                clientId: CUSTOM_ENV.OKTA.CLIENT_ID,
                redirectUri:
                    window.location.host === "localhost:8080"
                        ? "http://" +
                          window.location.host +
                          "/implicit/callback"
                        : "https://" +
                          window.location.host +
                          "/implicit/callback",
                i18n: {
                    en: {
                        "primaryauth.title": "",
                        "primaryauth.username.placeholder": "Email",
                        "primaryauth.username.tooltip": "Enter your email",
                        "primaryauth.password.placeholder": "Password",
                        "primaryauth.password.tooltip": "Enter your password",
                        "error.username.required": "Please enter your email",
                        "errors.E0000004":
                            "That didn't work. Was your password correct?",
                    },
                },
                authParams: {
                    pkce: true,
                    display: "page",
                    issuer: CUSTOM_ENV.OKTA.ISSUER + "/oauth2/default",
                    scopes,
                    tokenManager: {
                        autoRenew: true,
                        expireEarlySeconds: 120,
                    },
                },
            });
            const self = this;
            this.widget
                .showSignInToGetTokens({
                    el: "#okta-signin-container",
                    scopes,
                })
                .then(async (tokens) => {
                    self.splashed = false;
                    await this.$auth.handleLoginRedirect(tokens);
                })
                .catch((err) => {
                    throw err;
                });
        });
        if (await this.$auth.isAuthenticated()) {
            this.$router.push("/");
        } else {
            const cookies = document.cookie.split(";");
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i];
                const eqPos = cookie.indexOf("=");
                const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
                document.cookie =
                    name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
            }
        }
    },
    async beforeDestroy() {
        await this.$parent.isAuthenticated();
        await this.$parent.setup();
        if (this.$ga && !this.authenticated) {
            this.$ga.event("Auth", "login");
        }
    },
};
</script>

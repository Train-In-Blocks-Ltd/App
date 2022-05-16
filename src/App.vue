<style lang="scss">
/* Global */
* {
    box-sizing: border-box;
}
:root {
    height: stretch;
    height: calc(100vh - env(safe-area-inset-bottom));
}

ol {
    li {
        list-style: decimal;
        margin-left: 1rem;
    }
}
ul {
    li {
        list-style: disc;
        margin-left: 1rem;
    }
}

// Client user
.show_html {
    > div,
    > p {
        margin: 0.6rem 0;
    }
    img {
        border-radius: 10px;
        max-width: 80%;
        margin: 1rem 0;
    }
}

// Animation
.fadeIn {
    animation: 0.4s fadeIn;
}
.fadeOut {
    animation: 0.4s fadeOut;
}
.fill_mode_both {
    animation-fill-mode: both;
}
.delay {
    animation-delay: 0.4s;
}
.delay_long {
    animation-delay: 0.8s;
}
@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}
@keyframes fadeOut {
    from {
        opacity: 1;
    }
    to {
        opacity: 0;
    }
}

/* Document elements */
body {
    font-family: Arial, Helvetica, sans-serif;
    margin: 0;
    min-height: 100%;
    display: grid;
    font-size: 16px;
    line-height: 1.42;
}

/* Loading bar */
#nprogress {
    .bar {
        background-color: currentColor;
    }
    .peg {
        /* stylelint-disable-next-line */
        box-shadow: 0 0 10px currentColor, 0 0 5px currentColor !important;
    }
    .spinner-icon {
        /* stylelint-disable-next-line */
        border-top-color: currentColor !important;
        /* stylelint-disable-next-line */
        border-left-color: currentColor !important;
    }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
    * {
        transition: none;
    }
    .fadeIn,
    .fadeOut {
        animation: none;
    }
}
</style>

<template>
    <div id="app" :class="{ authenticated: authenticated }">
        <modal v-if="authenticated" />
        <response-pop-up v-if="authenticated" />
        <confirm-pop-up ref="confirmPopUp" />
        <nav-bar v-if="authenticated" class="fadeIn" />
        <main class="pb-16 sm:pb-0 md:ml-24" :class="{ 'm-0': !authenticated }">
            <top-banner v-if="authenticated" />
            <transition
                enter-active-class="fadeIn fill_mode_both delay"
                leave-active-class="fadeOut fill_mode_both"
            >
                <router-view :key="$route.fullPath" />
            </transition>
        </main>
    </div>
</template>

<script lang="ts">
import { Component, Ref, Vue, Watch } from "vue-property-decorator";
import { baseAPI } from "./api";
import appState from "./store/modules/appState";
import utilsStore from "./store/modules/utils";
import clientsStore from "./store/modules/clients";
import templatesStore from "./store/modules/templates";
import bookingsStore from "./store/modules/bookings";
import portfolioStore from "./store/modules/portfolio";
import { useGetHighLevelData } from "./api";
import { ConfirmRef, DarkmodeType, TIBUserClaims } from "./store/modules/types";

//* Needed to import like this to use refs
import ConfirmPopUp from "./components/extensive/ConfirmPopUp/index.vue";

const NavBar = () =>
    import(
        /* webpackChunkName: "components.navBar", webpackPreload: true  */ "./components/extensive/NavBar/index.vue"
    );
const Modal = () =>
    import(
        /* webpackChunkName: "components.modal", webpackPreload: true  */ "./components/extensive/Modal/index.vue"
    );
const ResponsePopUp = () =>
    import(
        /* webpackChunkName: "components.responsePopUp", webpackPreload: true  */ "./components/extensive/ResponsePopUp/index.vue"
    );
const TopBanner = () =>
    import(
        /* webpackChunkName: "components.topBanner", webpackPreload: true  */ "./components/generic/TopBanner.vue"
    );

@Component({
    metaInfo() {
        return {
            title: "Home",
            // all titles will be injected into this template
            titleTemplate: "%s | Train In Blocks",
        };
    },
    components: {
        NavBar,
        Modal,
        ResponsePopUp,
        ConfirmPopUp,
        TopBanner,
    },
})
export default class App extends Vue {
    get authenticated() {
        return appState.authenticated;
    }
    get clientUserLoaded() {
        return appState.clientUserLoaded;
    }
    get loading() {
        return appState.loading;
    }
    get claims() {
        return appState.claims;
    }
    get connected() {
        return appState.connected;
    }
    get instanceReady() {
        return appState.instanceReady;
    }

    @Ref() readonly confirmPopUp!: ConfirmRef;

    @Watch("connected")
    onConnectedChange() {
        if (this.connected) this.setup();
    }
    @Watch("$route")
    onRouteChange() {
        this.isAuthenticated();
    }

    created() {
        appState.setLoading(true);
        this.isAuthenticated();
    }
    async mounted() {
        utilsStore.setConfirmRef(this.confirmPopUp);
        // Sets the body to have dark mode.
        document.body.setAttribute(
            "class",
            "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white"
        );

        if (
            process.env.NODE_ENV === "production" &&
            "serviceWorker" in navigator
        ) {
            navigator.serviceWorker
                .getRegistrations()
                .then(function (registrations) {
                    if (registrations.length !== 0) {
                        for (const REGISTRATION of registrations) {
                            REGISTRATION.unregister().then(function () {
                                navigator.serviceWorker.register(
                                    "/traininblocks-sw.js"
                                );
                            });
                        }
                    } else {
                        navigator.serviceWorker.register(
                            "/traininblocks-sw.js"
                        );
                    }
                });
        }
        window.addEventListener("beforeunload", (e) => {
            if (appState.dontLeave) {
                e.preventDefault();
                e.returnValue =
                    "Your changes might not be saved, are you sure you want to leave?";
            }
        });
        window.addEventListener("beforeinstallprompt", (e) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();

            // Stash the event so it can be triggered later.
            appState.setPWADeferredPrompt(e);

            // Update UI notify the user they can install the PWA
            appState.setPWACanInstall(true);
        });
        if ("getInstalledRelatedApps" in navigator) {
            // @ts-expect-error
            const RELATED_APPS = await navigator.getInstalledRelatedApps();
            if (RELATED_APPS.length > 0) appState.PWAInstalled();
        }
        // @ts-expect-error
        if (navigator.standalone) appState.setPWADisplayMode("standalone-ios");

        if (window.matchMedia("(display-mode: standalone)").matches)
            appState.setPWADisplayMode("standalone");

        baseAPI.interceptors.request.use(
            (config) => {
                if (
                    appState.claims?.email === "demo@traininblocks.com" &&
                    config.method !== "get"
                ) {
                    this.$store.dispatch("openResponsePopUp", {
                        description:
                            "You are using the demo account. Your changes cannot be saved.",
                        persist: true,
                        backdrop: true,
                    });
                    appState.setLoading(false);
                    // @ts-expect-error
                    throw new baseAPI.Cancel(
                        "You are using the demo account. Your changes won't be saved"
                    );
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );
    }

    /* --------------------------------- Methods -------------------------------- */

    /** Gives darkmode theme to the app. */
    darkmode(mode?: DarkmodeType) {
        const MATCHED_MEDIA =
            window.matchMedia("(prefers-color-scheme)") || false;
        if (mode === "dark") document.documentElement.classList.add("dark");
        else if (mode === "system" && !!MATCHED_MEDIA) {
            this.darkmode(
                window.matchMedia("(prefers-color-scheme: dark)").matches
                    ? "dark"
                    : "light"
            );
            window
                .matchMedia("(prefers-color-scheme: dark)")
                .addListener((e) => {
                    this.darkmode(e.matches ? "dark" : "light");
                });
        } else document.documentElement.classList.remove("dark");
    }

    /** Checks if the user is authenticated and sets the Vuex state accordingly. */
    async isAuthenticated() {
        appState.setAuthenticated(await this.$auth.isAuthenticated());
    }

    /** Initiates all the crucial setup for the app. */
    async setup() {
        if (!this.instanceReady) {
            // Set claims
            appState.setClaims((await this.$auth.getUser()) as TIBUserClaims);

            // Sets demo flag
            appState.setIsDemo(
                appState.claims?.email === "demo@traininblocks.com"
            );

            // Sets trainer flag
            appState.setIsTrainer(
                appState.claims?.user_type === "Trainer" ||
                    appState.claims?.user_type === "Admin"
            );

            if (appState.claims) {
                if (!appState.claims.ga || !appState.claims)
                    appState.setClaimsAnalytics(true);

                if (!appState.claims.theme || !appState.claims)
                    appState.setClaimsTheme("system");

                // Set analytics and theme
                appState.claims.ga !== false
                    ? this.$ga.enable()
                    : this.$ga.disable();

                if (localStorage.getItem("darkmode"))
                    this.darkmode(
                        localStorage.getItem("darkmode") as DarkmodeType
                    );

                // Set EULA
                if (
                    (!appState.claims.policy ||
                        appState.policyVersion !== appState.claims.policy[2]) &&
                    appState.claims.email !== "demo@traininblocks.com" &&
                    this.authenticated
                ) {
                    this.$store.dispatch("openModal", {
                        name: "eula",
                        persist: true,
                    });
                }
            }

            // Set auth header
            baseAPI.defaults.headers.common.Authorization = `Bearer ${await this.$auth.getAccessToken()}`;

            // Set connection
            appState.setConnected(navigator.onLine);
            window.addEventListener("offline", () => {
                appState.setConnected(false);
            });
            window.addEventListener("online", () => {
                appState.setConnected(true);
            });

            // Check build
            if (localStorage.getItem("versionBuild") !== appState.versionBuild)
                appState.setNewBuild(true);

            // Get data if not client
            if (
                appState.claims?.user_type === "Admin" ||
                appState.claims?.user_type === "Trainer"
            ) {
                try {
                    const {
                        sortedClients,
                        sortedArchiveClients,
                        sortedBookings,
                        templates,
                        portfolio,
                    } = await useGetHighLevelData();
                    clientsStore.setClients(sortedClients);
                    clientsStore.setArchivedClients(sortedArchiveClients);
                    bookingsStore.setBookings(sortedBookings);
                    templatesStore.setTemplates(templates);

                    if (portfolio) portfolioStore.setPortfolio(portfolio);
                } catch (e) {
                    this.$store.dispatch("resolveError", e);
                }
            }

            // Stops setup from running more than once
            appState.setInstanceReady();
        }
    }

    /** Saves the user's claims to Okta. */
    async saveClaims() {
        try {
            appState.setLoading(true);
            await this.$store.dispatch("saveClaims");
            appState.setLoading(false);
        } catch (e) {
            this.$store.dispatch("resolveError", e);
        }
    }

    /** Gets all the data for setup on the client-side. */
    async getClientSideData() {
        if (!this.clientUserLoaded) {
            try {
                await this.$store.dispatch("getClientSideInfo");
                await this.$store.dispatch("getClientSidePlans");
                appState.setClientUserLoaded(true);
            } catch (e) {
                this.$store.dispatch("resolveError", e);
            }
        }
    }

    /** Updates a client-side session. */
    async updateClientSideSession(planId: number, sessionId: number) {
        try {
            await this.$store.dispatch("updateClientSideSession", {
                planId,
                sessionId,
            });
            this.$ga.event("Session", "update");
            this.$store.dispatch("openResponsePopUp", {
                title: "Session updated",
                description: "Your changes have been saved",
            });
            appState.setLoading(false);
        } catch (e) {
            this.$store.dispatch("resolveError", e);
        }
    }
}
</script>

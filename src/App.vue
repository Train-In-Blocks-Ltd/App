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
        <response-pop-up ref="responsePopUp" />
        <confirm-pop-up ref="confirmPopUp" />
        <upload-pop-up ref="uploadPopUp" />
        <txt-input-pop-up ref="txtInputPopUp" />
        <nav-bar v-if="authenticated" class="fadeIn" />
        <main class="pb-16 sm:pb-0 md:ml-24" :class="{ 'm-0': !authenticated }">
            <top-banner v-if="authenticated" />
            <transition
                enter-active-class="fadeIn fill_mode_both delay"
                leave-active-class="fadeOut fill_mode_both"
            >
                <router-view v-if="loaded" :key="$route.fullPath" />
            </transition>
        </main>
    </div>
</template>

<script lang="ts">
import { Component, Ref, Vue, Watch } from "vue-property-decorator";
import { baseAPI, getClientUserData } from "./api";
import appState from "./store/modules/appState";
import accountStore from "./store/modules/account";
import utilsStore from "./store/modules/utils";
import clientsStore from "./store/modules/clients";
import templatesStore from "./store/modules/templates";
import bookingsStore from "./store/modules/bookings";
import portfolioStore from "./store/modules/portfolio";
import clientUserStore from "./store/modules/clientUser";
import { getTrainerUserData } from "./api";
import {
    ConfirmPopUpRef,
    DarkmodeType,
    ResponsePopUpRef,
    TIBUserClaims,
    TxtInputPopUpRef,
    UploadPopUpRef,
} from "./store/modules/types";

//* Needed to import like this to use refs
import ConfirmPopUp from "./components/extensive/ConfirmPopUp/index.vue";
import ResponsePopUp from "./components/extensive/ResponsePopUp/index.vue";
import UploadPopUp from "./components/generic/UploadPopUp.vue";
import TxtInputPopUp from "./components/generic/TxtInputPopUp.vue";

const NavBar = () =>
    import(
        /* webpackChunkName: "components.navBar", webpackPreload: true  */ "./components/extensive/NavBar/index.vue"
    );
const Modal = () =>
    import(
        /* webpackChunkName: "components.modal", webpackPreload: true  */ "./components/extensive/Modal/index.vue"
    );
const TopBanner = () =>
    import(
        /* webpackChunkName: "components.topBanner", webpackPreload: true  */ "./components/generic/TopBanner.vue"
    );

@Component({
    metaInfo() {
        return {
            title: "Home",
            titleTemplate: "%s | Train In Blocks",
        };
    },
    components: {
        NavBar,
        Modal,
        ResponsePopUp,
        ConfirmPopUp,
        UploadPopUp,
        TxtInputPopUp,
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
        return accountStore.claims;
    }
    get connected() {
        return appState.connected;
    }

    loaded: boolean = false;

    // Pop-up refs
    @Ref("responsePopUp") readonly responsePopUpRef!: ResponsePopUpRef;
    @Ref("confirmPopUp") readonly confirmPopUpRef!: ConfirmPopUpRef;
    @Ref("uploadPopUp") readonly uploadPopUpRef!: UploadPopUpRef;
    @Ref("txtInputPopUp") readonly txtInputPopUpRef!: TxtInputPopUpRef;

    @Watch("connected")
    onConnectedChange() {
        if (this.connected) this.setup();
    }
    @Watch("$route")
    async onRouteChange() {
        appState.setAuthenticated(await this.$auth.isAuthenticated());
    }
    @Watch("authenticated")
    onAuthenticated() {
        if (this.authenticated) this.setup();
    }

    async created() {
        appState.setLoading(true);
        appState.setAuthenticated(await this.$auth.isAuthenticated());
        await this.setup();
    }

    async mounted() {
        // Sets refs after app mount
        utilsStore.setResponsePopUpRef(this.responsePopUpRef);
        utilsStore.setConfirmPopUpRef(this.confirmPopUpRef);
        utilsStore.setUploadPopUpRef(this.uploadPopUpRef);
        utilsStore.setTxtInputPopUpRef(this.txtInputPopUpRef);

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
                    this.claims?.email === "demo@traininblocks.com" &&
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

    /** Initiates all the crucial setup for the app. */
    async setup() {
        this.loaded = false;
        // Set claims
        const claims = (
            this.authenticated ? await this.$auth.getUser() : {}
        ) as TIBUserClaims;
        accountStore.setClaims(claims);

        // Sets demo flag
        appState.setIsDemo(claims.email === "demo@traininblocks.com");

        // Sets trainer flag
        appState.setIsTrainer(
            claims.user_type === "Trainer" || claims.user_type === "Admin"
        );

        if (claims) {
            if (!claims.ga || !claims) accountStore.setClaimsAnalytics(true);

            if (!claims.theme || !claims) accountStore.setClaimsTheme("system");

            // Set analytics and theme
            claims.ga !== false ? this.$ga.enable() : this.$ga.disable();

            if (localStorage.getItem("darkmode"))
                this.darkmode(localStorage.getItem("darkmode") as DarkmodeType);

            // Set EULA
            if (
                (!claims.policy ||
                    appState.policyVersion !== claims.policy[2]) &&
                claims.email !== "demo@traininblocks.com" &&
                this.authenticated
            ) {
                utilsStore.openModal({
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
        try {
            if (["Trainer", "Admin"].includes(claims.user_type)) {
                const {
                    sortedClients,
                    sortedArchiveClients,
                    sortedBookings,
                    templates,
                    portfolio,
                } = await getTrainerUserData(claims.sub);
                clientsStore.setClients(sortedClients);
                clientsStore.setArchivedClients(sortedArchiveClients);
                bookingsStore.setBookings(sortedBookings);
                templatesStore.setTemplates(templates);

                if (!!portfolio) portfolioStore.setPortfolio(portfolio);
            }
            if (["Client", "Admin"].includes(claims.user_type)) {
                const clientUserData = await getClientUserData(
                    claims.client_id_db
                );
                clientUserStore.setClientUser(clientUserData);
            }
        } catch (e) {
            utilsStore.resolveError(e as string);
        }

        this.loaded = true;
        appState.stopLoaders();
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
            utilsStore.resolveError(e as string);
        }
    }
}
</script>

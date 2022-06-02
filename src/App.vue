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
import { Component, Mixins, Ref, Watch } from "vue-property-decorator";
import { baseAPI, getClientUserData } from "./api";
import appModule from "./store/app.module";
import accountModule from "./store/account.module";
import utilsModule from "./store/utils.module";
import clientsModule from "./store/clients.module";
import templatesModule from "./store/templates.module";
import bookingsModule from "./store/bookings.module";
import portfolioModule from "./store/portfolio.module";
import clientUserModule from "./store/clientUser.module";
import { getTrainerUserData } from "./api";
import {
    ConfirmPopUpRef,
    DarkmodeType,
    ResponsePopUpRef,
    TIBUserClaims,
    TxtInputPopUpRef,
    UploadPopUpRef,
} from "./common/types";

//* Needed to import like this to use refs
import ConfirmPopUp from "./components/extensive/ConfirmPopUp/index.vue";
import ResponsePopUp from "./components/extensive/ResponsePopUp/index.vue";
import UploadPopUp from "./components/generic/UploadPopUp.vue";
import TxtInputPopUp from "./components/generic/TxtInputPopUp.vue";
import MainMixins from "./main.mixins";

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
export default class App extends Mixins(MainMixins) {
    get authenticated() {
        return appModule.authenticated;
    }
    get clientUserLoaded() {
        return appModule.clientUserLoaded;
    }
    get loading() {
        return appModule.loading;
    }
    get claims() {
        return accountModule.claims;
    }
    get connected() {
        return appModule.connected;
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
        appModule.setAuthenticated(await this.$auth.isAuthenticated());
    }
    @Watch("authenticated")
    onAuthenticated() {
        if (this.authenticated) this.setup();
    }

    async created() {
        appModule.setLoading(true);
        appModule.setAuthenticated(await this.$auth.isAuthenticated());
        const claims = await this.$auth.getUser();
        function darkmodeTheme() {
            const theme = localStorage.getItem("darkmode") ?? claims.theme;
            if (!!theme) return theme;
            return "system";
        }
        this.darkmode(darkmodeTheme() as DarkmodeType);
        await this.setup();
    }

    async mounted() {
        // Sets refs after app mount
        utilsModule.setResponsePopUpRef(this.responsePopUpRef);
        utilsModule.setConfirmPopUpRef(this.confirmPopUpRef);
        utilsModule.setUploadPopUpRef(this.uploadPopUpRef);
        utilsModule.setTxtInputPopUpRef(this.txtInputPopUpRef);

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
            if (appModule.dontLeave) {
                e.preventDefault();
                e.returnValue =
                    "Your changes might not be saved, are you sure you want to leave?";
            }
        });
        window.addEventListener("beforeinstallprompt", (e) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();

            // Stash the event so it can be triggered later.
            appModule.setPWADeferredPrompt(e);

            // Update UI notify the user they can install the PWA
            appModule.setPWACanInstall(true);
        });
        if ("getInstalledRelatedApps" in navigator) {
            // @ts-expect-error
            const RELATED_APPS = await navigator.getInstalledRelatedApps();
            if (RELATED_APPS.length > 0) appModule.PWAInstalled();
        }
        // @ts-expect-error
        if (navigator.standalone) appModule.setPWADisplayMode("standalone-ios");

        if (window.matchMedia("(display-mode: standalone)").matches)
            appModule.setPWADisplayMode("standalone");

        baseAPI.interceptors.request.use(
            (config) => {
                if (
                    this.claims?.email === "demo@traininblocks.com" &&
                    config.method !== "get"
                ) {
                    utilsModule.responsePopUpRef?.open({
                        title: "Action blocked",
                        text: "You are using the demo account. Your changes cannot be saved.",
                        persist: true,
                        backdrop: true,
                    });
                    appModule.setLoading(false);
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

    /** Initiates all the crucial setup for the app. */
    async setup() {
        this.loaded = false;
        // Set claims
        const claims = (
            this.authenticated ? await this.$auth.getUser() : {}
        ) as TIBUserClaims;
        accountModule.setClaims(claims);

        // Sets demo flag
        appModule.setIsDemo(claims.email === "demo@traininblocks.com");

        // Sets trainer flag
        appModule.setIsTrainer(
            claims.user_type === "Trainer" || claims.user_type === "Admin"
        );

        if (claims.ga === undefined || claims.ga === null)
            accountModule.setClaims({
                ...claims,
                ga: true,
            });

        if (claims.theme === undefined || claims.theme === null)
            accountModule.setClaims({
                ...claims,
                theme: "system",
            });

        // Sets theme
        this.darkmode(claims.theme);
        if (
            Object.keys(claims).length > 0 &&
            localStorage.getItem("darkmode") !== claims.theme
        )
            localStorage.setItem("darkmode", claims.theme ?? "system");

        // Set analytics and theme
        claims.ga !== false ? this.$ga.enable() : this.$ga.disable();

        if (localStorage.getItem("darkmode"))
            this.darkmode(localStorage.getItem("darkmode") as DarkmodeType);

        // Set EULA
        if (
            (!claims.policy || appModule.policyVersion !== claims.policy[2]) &&
            claims.email !== "demo@traininblocks.com" &&
            this.authenticated
        ) {
            utilsModule.openModal({
                name: "eula",
                persist: true,
            });
        }

        // Set auth header
        baseAPI.defaults.headers.common.Authorization = `Bearer ${await this.$auth.getAccessToken()}`;

        // Set connection
        appModule.setConnected(navigator.onLine);
        window.addEventListener("offline", () => {
            appModule.setConnected(false);
        });
        window.addEventListener("online", () => {
            appModule.setConnected(true);
        });

        // Check build
        if (localStorage.getItem("versionBuild") !== appModule.versionBuild)
            appModule.setNewBuild(true);

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
                clientsModule.setClients(sortedClients);
                clientsModule.setArchivedClients(sortedArchiveClients);
                bookingsModule.setBookings(sortedBookings);
                templatesModule.setTemplates(templates);

                if (!!portfolio) portfolioModule.setPortfolio(portfolio);
            }
            if (["Client", "Admin"].includes(claims.user_type)) {
                const clientUserData = await getClientUserData(
                    claims.client_id_db
                );
                clientUserModule.setClientUser(clientUserData);
            }
        } catch (e) {
            utilsModule.resolveError(e as string);
        }

        this.loaded = true;
        appModule.stopLoaders();
    }
}
</script>

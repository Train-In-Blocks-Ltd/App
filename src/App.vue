<style lang="scss">
/* Global */
* {
    box-sizing: border-box;
}
:root {
    --transition_smooth: 0.4s all;
    --transition_standard: 0.6s all cubic-bezier(0.165, 0.84, 0.44, 1);
    --low_shadow: 0 0 20px 10px #28282808;
    --high_shadow: 0 0 20px 10px #28282816;
    --back: #f9f9f9;
    --fore: white;
    --base: #282828;
    --base_light: #585858;
    --base_faint: #28282840;
    --base_red: rgb(184, 0, 0);
    --base_green: green;
    --overlay_glass: #ffffffb3;
    --calendar_highlight: #ffffee;
    --skeleton_1: #f4f4f4;
    --skeleton_2: #e4e4e4;
    --link: blue;
    --light_opacity: 0.6;
    --active_state: scale(0.95);
    --rounded: 10px;

    // Responsiveness
    --2xl: 1538px;
    --xl: 1280px;
    --lg: 1024px;
    --md: 768px;
    --sm: 640px;
    --xs: 360px;

    height: stretch;
    height: calc(100vh - env(safe-area-inset-bottom));
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
    a {
        color: var(--link);
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
    background-color: var(--back);
}
#app {
    color: var(--base);
    background-color: var(--back);
}
main {
    margin-left: calc(38px + 2rem);
    display: grid;
    align-items: start;
}

/* System state */
.top_banner {
    z-index: 14;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    text-align: center;
    padding: 0.1rem;
    background-color: var(--base);
    a,
    p {
        display: block;
        color: var(--fore);
    }
}
.notAuth {
    margin: 0;
}

/* Other elements */
hr {
    margin: 1rem 0;
    border-color: var(--base_light);
}
.close_icon {
    padding: 0.2rem;
    border: 2px solid var(--base);
    border-radius: 3px;
    background-color: var(--fore);
    &:not(.not_fixed) {
        position: fixed;
        top: 4rem;
        right: 5vw;
    }
}

/* Containers */
.view_container {
    background-color: var(--back);
    padding: 2rem 10vw;
}
.wrapper--calendar {
    margin: 6rem 0;
    user-select: none;
}
.tab_overlay_content {
    position: fixed;
    padding: 4rem 10vw;
    top: 0;
    left: 0;
    z-index: 11;
    height: 100%;
    width: 100%;
    overflow-x: auto;
}
.spacer {
    height: 2rem;
}

/* Fonts */
h1,
h2,
h3,
p {
    margin: 0;
}
h1,
.text--large {
    /* stylelint-disable-next-line */
    font-size: 2.6rem !important;
}
h2 {
    /* stylelint-disable-next-line */
    font-size: 2.6rem !important;
}
h3,
.text--small {
    /* stylelint-disable-next-line */
    font-size: 1.6rem !important;
}
i {
    /* stylelint-disable-next-line */
    color: var(--base) !important;
}
.text--red {
    /* stylelint-disable-next-line */
    color: var(--base_red) !important;
}
.text--holder {
    margin: 2rem 0 8rem 0;
}
.text--name {
    text-overflow: ellipsis;
    overflow-wrap: anywhere;
}
.text--tiny {
    font-size: 0.8rem;
}

/* Tailwinds */
.cursor {
    cursor: pointer;
    transition: var(--transition_standard);
    &:hover {
        opacity: var(--light_opacity);
    }
}
.allow_y_overflow {
    overflow-y: auto;
}
.flex {
    display: flex;
}
.recently_added {
    border: 1px solid var(--base);
}
.no_margin {
    margin: 0;
}
.top_margin {
    margin-top: 1rem;
}
.bottom_margin {
    margin-bottom: 1rem;
}
.right_margin {
    margin-right: 1rem;
}
.grey {
    color: var(--base_light);
}
.allow_text_overflow {
    text-overflow: ellipsis;
}
.disabled,
.disabled:hover {
    opacity: var(--light_opacity);
    cursor: default;
}

/* Text buttons */
.a_link {
    display: flex;
    color: var(--base);
    text-decoration: none;
    transition: 1s all cubic-bezier(0.165, 0.84, 0.44, 1);
    &:hover {
        opacity: var(--light_opacity);
    }
    svg {
        height: 22px;
        width: 22px;
    }
}

/* Box buttons */
button {
    height: fit-content;
    width: auto;
    user-select: none;
    cursor: pointer;
    border-radius: 5px;
    text-transform: capitalize;
    outline-width: 0;
    border: none;
    padding: 0.6rem 1.6rem;
    font-size: 0.8rem;
    font-weight: bold;
    color: var(--back);
    background-color: var(--base);
    transition: color 0.4s, background-color 0.4s, opacity 0.2s,
        transform 0.1s cubic-bezier(0.165, 0.84, 0.44, 1);
    &:hover:not(:disabled) {
        opacity: var(--light_opacity);
    }
    &:active:not(:disabled) {
        transform: var(--active_state);
    }
    &:focus {
        box-shadow: 0 0 0 4px var(--base_light);
    }
    &:disabled,
    &[disabled] {
        cursor: not-allowed;
        opacity: var(--light_opacity);
    }
    &.green_button {
        color: white;
        background-color: green;
    }
    &.red_button {
        color: white;
        background-color: #b80000;
    }
}

/* Loading bar */
#nprogress {
    .bar {
        /* stylelint-disable-next-line */
        background-color: var(--base) !important;
    }
    .peg {
        /* stylelint-disable-next-line */
        box-shadow: 0 0 10px var(--base), 0 0 5px var(--base) !important;
    }
    .spinner-icon {
        /* stylelint-disable-next-line */
        border-top-color: var(--base) !important;
        /* stylelint-disable-next-line */
        border-left-color: var(--base) !important;
    }
}

/* Scrollbar */
::-webkit-scrollbar {
    width: 10px;
    height: 10px;
}
::-webkit-scrollbar-track {
    background-color: var(--base_faint);
}
::-webkit-scrollbar-thumb {
    border-radius: 3px;
    background-color: var(--base);
    &:hover {
        background-color: var(--base_faint);
    }
}

@media (max-width: 768px) {
    main {
        margin: 0;
    }
}
@media (max-width: 576px) {
    /* Elements */
    ::-webkit-scrollbar {
        width: 0;
        background-color: transparent;
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
        <modal />
        <response-pop-up />
        <confirm-pop-up />
        <div
            v-if="claims.email === 'demo@traininblocks.com' && authenticated"
            class="top_banner fadeIn"
        >
            <a
                href="https://traininblocks.com/#pricing"
                target="_blank"
                class="a_link text--tiny"
            >
                Demo account: click here to sign up
            </a>
        </div>
        <div v-else-if="!connected" class="top_banner fadeIn">
            <p class="text--tiny">
                Offline mode: we will sync your data when you reconnect
            </p>
        </div>
        <div
            v-if="showEULA"
            class="tab_overlay_content fadeIn delay fill_mode_both"
        >
            <policy :type="claims.user_type" />
        </div>
        <skeleton
            v-if="
                (!authenticated || (loading && !instanceReady)) &&
                $route.path !== '/login'
            "
            :type="'nav'"
            class="fadeIn"
        />
        <nav-bar
            v-else-if="$route.path !== '/login'"
            :authenticated="authenticated"
            :claims="claims"
            class="fadeIn"
        />
        <div :class="{ opened_sections: showEULA }" class="section_overlay" />
        <main id="main" :class="{ notAuth: !authenticated }">
            <transition
                enter-active-class="fadeIn fill_mode_both delay"
                leave-active-class="fadeOut fill_mode_both"
            >
                <router-view :key="$route.fullPath" />
            </transition>
        </main>
    </div>
</template>

<script>
import { mapState } from "vuex";
import Policy from "./components/Policy";

const NavBar = () =>
    import(
        /* webpackChunkName: "components.navBar", webpackPreload: true  */ "@/components/extensive/NavBar"
    );
const Modal = () =>
    import(
        /* webpackChunkName: "components.modal", webpackPreload: true  */ "@/components/extensive/Modal"
    );
const ResponsePopUp = () =>
    import(
        /* webpackChunkName: "components.responsePopUp", webpackPreload: true  */ "@/components/extensive/ResponsePopUp"
    );
const ConfirmPopUp = () =>
    import(
        /* webpackChunkName: "components.confirmPopUp", webpackPreload: true  */ "@/components/extensive/ConfirmPopUp"
    );

export default {
    metaInfo() {
        return {
            title: "Home",
            // all titles will be injected into this template
            titleTemplate: "%s | Train In Blocks",
        };
    },
    components: {
        NavBar,
        Policy,
        Modal,
        ResponsePopUp,
        ConfirmPopUp,
    },
    computed: mapState([
        "authenticated",
        "clientUserLoaded",
        "loading",
        "claims",
        "showEULA",
        "clients",
        "connected",
        "instanceReady",
    ]),
    watch: {
        $route(to, from) {
            this.isAuthenticated();
        },
        async connected() {
            if (this.connected === true) {
                await this.setup();
            }
        },
    },
    created() {
        this.$store.commit("setData", {
            attr: "loading",
            data: true,
        });
        this.isAuthenticated();
        this.willBodyScroll(true);
    },
    async mounted() {
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
            if (this.dontLeave) {
                e.preventDefault();
                e.returnValue =
                    "Your changes might not be saved, are you sure you want to leave?";
            }
        });
        const SELF = this;
        window.addEventListener("beforeinstallprompt", (e) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();

            // Stash the event so it can be triggered later.
            SELF.$store.commit("setDataDeep", {
                attrParent: "pwa",
                attrChild: "deferredPrompt",
                data: e,
            });

            // Update UI notify the user they can install the PWA
            SELF.$store.commit("setDataDeep", {
                attrParent: "pwa",
                attrChild: "canInstall",
                data: true,
            });
        });
        if ("getInstalledRelatedApps" in navigator) {
            const RELATED_APPS = await navigator.getInstalledRelatedApps();
            if (RELATED_APPS.length > 0) {
                this.$store.commit("setDataDeep", {
                    attrParent: "pwa",
                    attrChild: "installed",
                    data: true,
                });
            }
        }
        if (navigator.standalone) {
            this.$store.commit("setDataDeep", {
                attrParent: "pwa",
                attrChild: "displayMode",
                data: "standalone-ios",
            });
        }
        if (window.matchMedia("(display-mode: standalone)").matches) {
            this.$store.commit("setDataDeep", {
                attrParent: "pwa",
                attrChild: "displayMode",
                data: "standalone",
            });
        }
        this.$axios.interceptors.request.use(
            (config) => {
                if (
                    SELF.claims.email === "demo@traininblocks.com" &&
                    config.method !== "get"
                ) {
                    this.$store.dispatch("openResponsePopUp", {
                        description:
                            "You are using the demo account. Your changes cannot be saved.",
                        persist: true,
                        backdrop: true,
                    });
                    SELF.willBodyScroll(false);
                    SELF.$store.dispatch("endLoading");
                    throw new SELF.$axios.Cancel(
                        "You are using the demo account. Your changes won't be saved"
                    );
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );
    },
    methods: {
        // -----------------------------
        // System
        // -----------------------------

        /**
         * Gives darkmode theme to the app.
         * @param {string} mode - The mode to switch to.
         */
        darkmode(mode) {
            const MATCHED_MEDIA =
                window.matchMedia("(prefers-color-scheme)") || false;
            if (mode === "dark") {
                document.documentElement.style.setProperty(
                    "--low_shadow",
                    "0 0 2px 0 #FFFFFF60"
                );
                document.documentElement.style.setProperty(
                    "--high_shadow",
                    "0 0 2px 0 white"
                );
                document.documentElement.style.setProperty("--back", "#282828");
                document.documentElement.style.setProperty("--fore", "#383838");
                document.documentElement.style.setProperty("--base", "white");
                document.documentElement.style.setProperty(
                    "--base_light",
                    "#FFFFFF94"
                );
                document.documentElement.style.setProperty(
                    "--base_faint",
                    "#FFFFFF40"
                );
                document.documentElement.style.setProperty(
                    "--overlay_glass",
                    "#282828B3"
                );
                document.documentElement.style.setProperty(
                    "--calendar_highlight",
                    "#686868"
                );
                document.documentElement.style.setProperty(
                    "--skeleton_1",
                    "#686868"
                );
                document.documentElement.style.setProperty(
                    "--skeleton_2",
                    "#484848"
                );
                document.documentElement.style.setProperty("--link", "white");
                document.documentElement.style.setProperty(
                    "--base_red",
                    "white"
                );
                document.documentElement.style.setProperty(
                    "--base_green",
                    "white"
                );
            } else if (
                mode === "system" &&
                (MATCHED_MEDIA === false
                    ? false
                    : MATCHED_MEDIA.media !== "not all")
            ) {
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
            } else {
                document.documentElement.style.setProperty(
                    "--low_shadow",
                    "0 0 20px 10px #28282808"
                );
                document.documentElement.style.setProperty(
                    "--high_shadow",
                    "0 0 20px 10px #28282816"
                );
                document.documentElement.style.setProperty("--back", "#F9F9F9");
                document.documentElement.style.setProperty("--fore", "white");
                document.documentElement.style.setProperty("--base", "#282828");
                document.documentElement.style.setProperty(
                    "--base_light",
                    "#585858"
                );
                document.documentElement.style.setProperty(
                    "--base_faint",
                    "#28282840"
                );
                document.documentElement.style.setProperty(
                    "--overlay_glass",
                    "#FFFFFFB3"
                );
                document.documentElement.style.setProperty(
                    "--calendar_highlight",
                    "#FFFFEE"
                );
                document.documentElement.style.setProperty(
                    "--skeleton_1",
                    "#F4F4F4"
                );
                document.documentElement.style.setProperty(
                    "--skeleton_2",
                    "#E4E4E4"
                );
                document.documentElement.style.setProperty("--link", "blue");
                document.documentElement.style.setProperty(
                    "--base_red",
                    "rgb(184, 0, 0)"
                );
                document.documentElement.style.setProperty(
                    "--base_green",
                    "green"
                );
            }
        },

        /**
         * Processes captured error and sends to Jira.
         * @param {string} msg - The error text.
         */
        async resolveError(msg) {
            if (this.claims.user_type !== "Admin") {
                await this.$axios.post("/.netlify/functions/error", {
                    msg,
                    claims: this.claims,
                });
            }
            this.$store.dispatch("endLoading");
            this.$store.dispatch("openResponsePopUp", {
                title: "ERROR: this problem has been reported to our developers",
                description:
                    msg.toString() !== "Error: Network Error"
                        ? msg.toString()
                        : "You may be offline. We'll try that request again once you've reconnected",
                persist: true,
                backdrop: true,
            });
            this.willBodyScroll(false);
        },

        // -----------------------------
        // Auth
        // -----------------------------

        /**
         * Checks if the user is authenticated and sets the Vuex state accordingly.
         */
        async isAuthenticated() {
            this.$store.commit("setData", {
                attr: "authenticated",
                data: await this.$auth.isAuthenticated(),
            });
        },

        /**
         * Initiates all the crucial setup for the app.
         * @param {boolean} force - Whether this process is forced.
         */
        async setup(force) {
            force = force || false;
            if (!this.instanceReady || force) {
                // Set claims
                this.$store.commit("setData", {
                    attr: "claims",
                    data: await this.$auth.getUser(),
                });
                if (
                    this.claims.user_type === "Trainer" ||
                    this.claims.user_type === "Admin"
                ) {
                    this.$store.commit("setData", {
                        attr: "isTrainer",
                        data: true,
                    });
                }
                if (this.claims) {
                    if (!this.claims.ga || !this.claims) {
                        this.$store.commit("setData", {
                            attr: "ga",
                            data: true,
                        });
                    }
                    if (!this.claims.theme || !this.claims) {
                        this.$store.commit("setData", {
                            attr: "theme",
                            data: "system",
                        });
                    }

                    // Set analytics and theme
                    this.claims.ga !== false
                        ? this.$ga.enable()
                        : this.$ga.disable();
                    this.darkmode(this.claims.theme);

                    // Set EULA
                    if (
                        (!this.claims.policy ||
                            this.$store.state.policyVersion !==
                                this.claims.policy[2]) &&
                        this.claims.email !== "demo@traininblocks.com" &&
                        this.authenticated
                    ) {
                        this.willBodyScroll(false);
                        this.$store.commit("setData", {
                            attr: "showEULA",
                            data: true,
                        });
                    }
                }

                // Set auth header
                this.$axios.defaults.headers.common.Authorization = `Bearer ${await this.$auth.getAccessToken()}`;

                // Set connection
                this.$store.commit("setData", {
                    attr: "connected",
                    data: navigator.onLine,
                });
                const SELF = this;
                window.addEventListener("offline", function (event) {
                    SELF.$store.commit("setData", {
                        attr: "connected",
                        data: false,
                    });
                });
                window.addEventListener("online", function (event) {
                    SELF.$store.commit("setData", {
                        attr: "connected",
                        data: true,
                    });
                });

                // Check build
                if (
                    localStorage.getItem("versionBuild") !==
                    this.$store.state.versionBuild
                ) {
                    this.$store.commit("setData", {
                        attr: "newBuild",
                        data: true,
                    });
                }

                // Get data if not client
                if (
                    this.claims.user_type === "Admin" ||
                    this.claims.user_type === "Trainer"
                ) {
                    try {
                        await this.$store.dispatch("getHighLevelData");
                    } catch (e) {
                        this.$store.dispatch("resolveError", e);
                    }
                }

                // Stops setup from running more than once
                this.$store.commit("setData", {
                    attr: "instanceReady",
                    data: true,
                });
            }
        },

        /**
         * Saves the user's claims to Okta.
         */
        async saveClaims() {
            try {
                this.$store.commit("setData", {
                    attr: "dontLeave",
                    data: true,
                });
                await this.$store.dispatch("saveClaims");
                this.$store.dispatch("endLoading");
            } catch (e) {
                this.$store.dispatch("resolveError", e);
            }
        },

        // -----------------------------
        // Client-side
        // -----------------------------

        /**
         * Gets all the data for setup on the client-side
         */
        async getClientSideData() {
            if (!this.clientUserLoaded) {
                try {
                    await this.$store.dispatch("getClientSideInfo");
                    await this.$store.dispatch("getClientSidePlans");
                    this.$store.commit("setData", {
                        attr: "clientUserLoaded",
                        data: true,
                    });
                } catch (e) {
                    this.$store.dispatch("resolveError", e);
                }
            }
        },

        /**
         * Updates a client-side session.
         * @param {integer} planId - The id of the plan.
         * @param {integer} sessionId - The id of the session to update.
         */
        async updateClientSideSession(planId, sessionId) {
            try {
                await this.$store.dispatch("updateClientSideSession", {
                    planId,
                    sessionId,
                });
                this.$ga.event("Session", "update");
                this.$store.dispatch("openResponsePopUp", {
                    title: "Session updated",
                    description: "Your changes haver been saved",
                });
                this.$store.dispatch("endLoading");
            } catch (e) {
                this.$store.dispatch("resolveError", e);
            }
        },
    },
};
</script>

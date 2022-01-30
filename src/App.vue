<style lang="scss">
/* Global */
* {
    box-sizing: border-box;
}
:root {
    --transition_standard: 0.6s all cubic-bezier(0.165, 0.84, 0.44, 1);
    --fore: white;
    --base: #282828;
    --base_light: #585858;
    --base_faint: #28282840;
    --skeleton_1: #f4f4f4;
    --skeleton_2: #e4e4e4;
    --light_opacity: 0.6;

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
    <div
        id="app"
        class="bg-gray-100 dark:bg-gray-800"
        :class="{ authenticated: authenticated }"
    >
        <modal />
        <response-pop-up />
        <confirm-pop-up />
        <top-banner />
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
        <nav-bar v-else-if="$route.path !== '/login'" class="fadeIn" />
        <div :class="{ opened_sections: showEULA }" class="section_overlay" />
        <main class="md:ml-24" :class="{ 'm-0': !authenticated }">
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
const TopBanner = () =>
    import(
        /* webpackChunkName: "components.topBanner", webpackPreload: true  */ "@/components/generic/TopBanner"
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
        TopBanner,
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
        /**
         * Gives darkmode theme to the app.
         */
        darkmode(mode) {
            const MATCHED_MEDIA =
                window.matchMedia("(prefers-color-scheme)") || false;
            if (mode === "dark") {
                document.documentElement.classList.add("dark");
                document.documentElement.style.setProperty("--fore", "#383838");
                document.documentElement.style.setProperty("--base", "white");
                document.documentElement.style.setProperty(
                    "--base_faint",
                    "#FFFFFF40"
                );
                document.documentElement.style.setProperty(
                    "--skeleton_1",
                    "#686868"
                );
                document.documentElement.style.setProperty(
                    "--skeleton_2",
                    "#484848"
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
                document.documentElement.classList.remove("dark");
                document.documentElement.style.setProperty("--fore", "white");
                document.documentElement.style.setProperty("--base", "#282828");
                document.documentElement.style.setProperty(
                    "--base_faint",
                    "#28282840"
                );
                document.documentElement.style.setProperty(
                    "--skeleton_1",
                    "#F4F4F4"
                );
                document.documentElement.style.setProperty(
                    "--skeleton_2",
                    "#E4E4E4"
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

                    if (localStorage.getItem("darkmode"))
                        this.darkmode(localStorage.getItem("darkmode"));

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

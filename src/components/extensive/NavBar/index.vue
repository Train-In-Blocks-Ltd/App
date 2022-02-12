<template>
    <nav
        class="fixed bottom-0 md:top-0 left-0 flex md:flex-col items-center justify-evenly md:justify-end w-full md:w-24 h-16 md:h-full py-6 rounded-r-xl z-10 shadow-lg bg-white dark:bg-gray-600"
    >
        <!-- Logo -->
        <div
            class="hidden md:block mb-auto hover:opacity-60 transition-opacity"
        >
            <router-link
                title="Home"
                class="w-24"
                :to="
                    claims.user_type === 'Trainer' ||
                    claims.user_type === 'Admin'
                        ? '/'
                        : '/clientUser'
                "
            >
                <icon svg="logo-icon" :icon-size="36" />
            </router-link>
        </div>

        <!-- Nav links -->
        <nav-link
            v-for="(nav, navIndex) in navLinks"
            :key="`nav_link_${navIndex}`"
            :internal="nav.internal"
            :name="nav.name"
            :link="nav.link"
            :svg="nav.svg"
            :forUser="nav.forUser"
            :on-click="nav.onClick"
        />
    </nav>
</template>

<script>
import { mapState } from "vuex";

const NavLink = () =>
    import(
        /* webpackChunkName: "components.navLink", webpackPreload: true  */ "./components/NavLink.vue"
    );

export default {
    components: {
        NavLink,
    },
    computed: mapState(["claims"]),
    data() {
        return {
            navLinks: [
                {
                    name: "Home",
                    link: "/",
                    svg: "home",
                    forUser: ["Admin", "Trainer"],
                    internal: true,
                },
                {
                    name: "Home",
                    link: "/clientUser",
                    svg: "home",
                    forUser: ["Admin", "Client"],
                    internal: true,
                },
                {
                    name: "Help",
                    link: "https://traininblocks.com/help/",
                    svg: "help-circle",
                    forUser: ["Admin", "Trainer"],
                    internal: false,
                },
                {
                    name: "Templates",
                    link: "/templates",
                    svg: "file-text",
                    forUser: ["Admin", "Trainer"],
                    internal: true,
                },
                {
                    name: "Portfolio",
                    link: "/portfolio",
                    svg: "briefcase",
                    forUser: ["Admin", "Trainer"],
                    internal: true,
                },
                {
                    name: "Archive",
                    link: "/archive",
                    svg: "archive",
                    forUser: ["Admin", "Trainer"],
                    internal: true,
                },
                {
                    name: "Account",
                    link: "/account",
                    svg: "settings",
                    forUser: ["Admin", "Trainer", "Client"],
                    internal: true,
                },
                {
                    name: "Refresh",
                    link: "javascript:void(0)",
                    svg: "refresh-ccw",
                    forUser: ["Admin", "Trainer", "Client"],
                    internal: false,
                    onClick: this.hardRefresh,
                },
                {
                    name: "Log out",
                    link: "javascript:void(0)",
                    svg: "log-out",
                    forUser: ["Admin", "Trainer", "Client"],
                    internal: false,
                    onClick: this.logout,
                },
            ],
        };
    },
    methods: {
        hardRefresh() {
            location.reload();
        },

        /**
         * Logs out the user.
         */
        async logout() {
            if (
                await this.$store.dispatch("openConfirmPopUp", {
                    title: "Are you sure you want to log out?",
                    text: "It's recommended to do so if you are using a public device.",
                })
            ) {
                await this.$parent.$auth.signOut();
                await this.$parent.isAuthenticated();
                localStorage.clear();
                sessionStorage.clear();
                localStorage.setItem(
                    "versionBuild",
                    this.$store.state.versionBuild
                );
                const COOKIES = document.cookie.split(";");
                for (let i = 0; i < COOKIES.length; i++) {
                    const COOKIE = COOKIES[i];
                    const EQ_POS = COOKIE.indexOf("=");
                    const NAME =
                        EQ_POS > -1 ? COOKIE.substr(0, EQ_POS) : COOKIE;
                    document.cookie =
                        NAME + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
                }
                this.$ga.event("Auth", "logout");
            }
        },
    },
};
</script>

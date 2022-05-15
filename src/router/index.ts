import Vue from "vue";
import Router, { NavigationGuardNext, Route } from "vue-router";
import OktaVue, { LoginCallback } from "@okta/okta-vue";
import { OktaAuth } from "@okta/okta-auth-js";
import appState from "../store/modules/appState";
const CUSTOM_ENV =
    process.env.NODE_ENV === "production"
        ? require("../../config/prod.env")
        : require("../../config/dev.env");

// Auth
const LoginComponent = () =>
    import(/* webpackChunkName: "login" */ "../pages/auth/login/index.vue");
const LogoutComponent = () =>
    import(/* webpackChunkName: "logout" */ "../pages/auth/logout/index.vue");

// Main
const HomeComponent = () =>
    import(/* webpackChunkName: "home" */ "../pages/main/home/index.vue");
const TemplateComponent = () =>
    import(
        /* webpackChunkName: "templates" */ "../pages/main/templates/index.vue"
    );
const PortfolioComponent = () =>
    import(
        /* webpackChunkName: "portfolio" */ "../pages/main/portfolio/index.vue"
    );
const ArchiveComponent = () =>
    import(/* webpackChunkName: "archive" */ "../pages/main/archive/index.vue");
const ProfileComponent = () =>
    import(/* webpackChunkName: "account" */ "../pages/main/account/index.vue");
const ClientComponent = () =>
    import(
        /* webpackChunkName: "clientHome" */ "../pages/main/home/client/index.vue"
    );
const ClientPlans = () =>
    import(
        /* webpackChunkName: "clientPlans" */ "../pages/main/home/client/plans/index.vue"
    );
const ClientSessions = () =>
    import(
        /* webpackChunkName: "clientSessions" */ "../pages/main/home/client/plans/sessions/index.vue"
    );

const ClientUserComponent = () =>
    import(
        /* webpackChunkName: "client-user.home" */ "../pages/_clientUser/Home.vue"
    );
const ClientUserPlans = () =>
    import(
        /* webpackChunkName: "client-user.plans" */ "../pages/_clientUser/Plans.vue"
    );
const ClientUserSuccess = () =>
    import(
        /* webpackChunkName: "client-user.success" */ "../pages/_clientUser/Success.vue"
    );
const NotFound = () =>
    import(/* webpackChunkName: "notfound" */ "../pages/NotFound.vue");

Vue.use(Router);
const oktaAuth = new OktaAuth({
    issuer: CUSTOM_ENV.OKTA.ISSUER + "/oauth2/default",
    clientId: CUSTOM_ENV.OKTA.CLIENT_ID,
    redirectUri:
        window.location.host === "localhost:8080"
            ? "http://" + window.location.host + "/implicit/callback"
            : "https://" + window.location.host + "/implicit/callback",
    scopes: ["openid", "profile", "email"],
    pkce: true,
    // autoRenew: false,
    // async onSessionExpired() {
    //     await Vue.prototype.$auth.logout({
    //         postLogoutRedirectUri:
    //             window.location.host === "localhost:8080"
    //                 ? "http://" + window.location.host
    //                 : "https://" + window.location.host,
    //     });
    // },
});
Vue.use(OktaVue, { oktaAuth });

const router = new Router({
    mode: "history",
    routes: [
        {
            path: "/",
            component: HomeComponent,
            meta: {
                requiresAuth: true,
                requiresTrainer: true,
            },
        },
        {
            path: "/login",
            component: LoginComponent,
        },
        {
            path: "/logout",
            component: LogoutComponent,
        },
        {
            path: "/implicit/callback",
            component: LoginCallback,
        },
        {
            path: "/account",
            component: ProfileComponent,
            meta: {
                requiresAuth: true,
                requiresNonDemo: true,
            },
        },
        {
            path: "/templates",
            component: TemplateComponent,
            meta: {
                requiresAuth: true,
                requiresTrainer: true,
            },
        },
        {
            path: "/portfolio",
            component: PortfolioComponent,
            meta: {
                requiresAuth: true,
                requiresTrainer: true,
            },
        },
        {
            path: "/client/:client_id",
            component: ClientComponent,
            meta: {
                requiresAuth: true,
                requiresTrainer: true,
            },
            children: [
                {
                    path: "",
                    component: ClientPlans,
                    name: "plans",
                    meta: {
                        requiresAuth: true,
                        requiresTrainer: true,
                    },
                },
                {
                    path: "plan/:id",
                    component: ClientSessions,
                    name: "sessions",
                    meta: {
                        requiresAuth: true,
                        requiresTrainer: true,
                    },
                },
            ],
        },
        {
            path: "/clientUser/success",
            component: ClientUserSuccess,
            meta: {
                requiresAuth: true,
                requiresClient: true,
            },
        },
        {
            path: "/clientUser",
            component: ClientUserComponent,
            meta: {
                requiresAuth: true,
                requiresClient: true,
            },
        },
        {
            path: "/clientUser/plan/:id",
            component: ClientUserPlans,
            meta: {
                requiresAuth: true,
                requiresClient: true,
            },
        },
        {
            path: "/archive",
            component: ArchiveComponent,
            meta: {
                requiresAuth: true,
                requiresTrainer: true,
            },
        },
        {
            path: "*",
            component: NotFound,
        },
    ],
    scrollBehavior(to, from, savedPosition) {
        return { x: 0, y: 0 };
    },
});

const onAuthRequired = async (
    to: Route,
    from: Route,
    next: NavigationGuardNext
) => {
    if (
        to.matched.some((record) => record.meta.requiresAuth) &&
        !(await Vue.prototype.$auth.isAuthenticated())
    ) {
        // Navigate to custom login page
        next({ path: "/login" });
    } else if (
        to.matched.some((record) => record.path === "/login") ||
        from.matched.some((record) => record.path === "/login") ||
        to.matched.some((record) => record.path === "/implicit/callback") ||
        from.matched.some((record) => record.path === "/implicit/callback")
    ) {
        next();
    } else {
        next();
        Vue.prototype.$auth.tokenManager.renew("accessToken");
    }
};

const userType = async (to: Route, from: Route, next: NavigationGuardNext) => {
    let result;
    if (await Vue.prototype.$auth.isAuthenticated()) {
        Vue.prototype.$axios.defaults.headers.common.Authorization = `Bearer ${await Vue.prototype.$auth.getAccessToken()}`;
        if (sessionStorage.getItem("claims")) {
            result = JSON.parse(sessionStorage.getItem("claims") ?? "");
        } else {
            const claims = await Vue.prototype.$auth.getUser();
            if (claims !== undefined && claims !== null) {
                result = claims;
            } else {
                result = false;
            }
            sessionStorage.setItem("claims", JSON.stringify(result));
        }
        appState.setClaims(result);
    }
    if (result) {
        if (to.matched.some((record) => record.meta.requiresTrainer)) {
            if (result.user_type === "Admin") {
                next();
            } else if (result.user_type === "Client") {
                // Navigate to Client Homepage
                next({ path: "/clientUser" });
            } else {
                next();
            }
        } else if (to.matched.some((record) => record.meta.requiresClient)) {
            if (result.user_type === "Admin") {
                next();
            } else if (result.user_type === "Trainer") {
                // Navigate to Trainer Homepage
                next({ path: "/" });
            } else {
                next();
            }
        } else if (to.matched.some((record) => record.meta.requiresNonDemo)) {
            if (result.email === "demo@traininblocks.com") {
                next({ path: "/" });
            } else {
                next();
            }
        } else {
            next();
        }
    } else {
        next();
    }
};

router.beforeEach(onAuthRequired);
router.beforeEach(userType);

export default router;

import { Action, Module, Mutation, VuexModule } from "vuex-module-decorators";
import {
    DarkmodeType,
    PWADisplayMode,
    PWASettings,
    TIBUserClaims,
} from "../types";

@Module
export default class AppState extends VuexModule {
    authenticated: boolean = false;
    connected: boolean = false;
    isTrainer: boolean = false;
    isDemo: boolean = false;
    loading: boolean = false;
    silentLoading: boolean = false;
    dontLeave: boolean = false;
    disableButtons: boolean = false;
    newBuild: boolean = false;
    claims: TIBUserClaims | undefined = undefined;
    pwa: PWASettings = {
        deferredPrompt: undefined,
        displayMode: "browser tab",
        canInstall: false,
        installed: false,
    };
    clientUserLoaded: boolean = false;

    //! To remove
    instanceReady: boolean = false;

    /* -------------------------------- Mutations ------------------------------- */

    @Mutation
    SET_AUTHENTICATED(authenticated: boolean) {
        this.authenticated = authenticated;
    }
    @Mutation
    SET_CONNECTED(connected: boolean) {
        this.connected = connected;
    }
    @Mutation
    SET_IS_TRAINER(isTrainer: boolean) {
        this.isTrainer = isTrainer;
    }
    @Mutation
    SET_IS_DEMO(isDemo: boolean) {
        this.isDemo = isDemo;
    }
    @Mutation
    SET_LOADING(loading: boolean) {
        this.loading = loading;
    }
    @Mutation
    SET_SILENT_LOADING(silentLoading: boolean) {
        this.silentLoading = silentLoading;
    }
    @Mutation
    SET_DONT_LEAVE(dontLeave: boolean) {
        this.dontLeave = dontLeave;
    }
    @Mutation
    SET_DISABLE_BUTTONS(disableButtons: boolean) {
        this.disableButtons = disableButtons;
    }
    @Mutation
    SET_NEW_BUILD(newBuild: boolean) {
        this.newBuild = newBuild;
    }
    @Mutation
    SET_CLAIMS(claims: TIBUserClaims) {
        this.claims = claims;
    }
    @Mutation
    SET_CLAIMS_GA(mode: boolean) {
        this.claims!.ga = mode;
    }
    @Mutation
    SET_CLAIMS_THEME(mode: DarkmodeType) {
        this.claims!.theme = mode;
    }
    @Mutation
    SET_PWA_DEFERRED_PROMPT(e: Event) {
        this.pwa.deferredPrompt = e;
    }
    @Mutation
    SET_PWA_CAN_INSTALL(canInstall: boolean) {
        this.pwa.canInstall = canInstall;
    }
    @Mutation
    SET_PWA_INSTALLED(installed: boolean) {
        this.pwa.installed = installed;
    }
    @Mutation
    SET_PWA_DISPLAY_MODE(mode: PWADisplayMode) {
        this.pwa.displayMode = mode;
    }
    @Mutation
    SET_CLIENT_USER_LOADED(clientUserLoaded: boolean) {
        this.clientUserLoaded = clientUserLoaded;
    }

    //! To remove
    @Mutation
    SET_INSTANCE_READY(instanceReady: boolean) {
        this.instanceReady = instanceReady;
    }

    /* --------------------------------- Actions -------------------------------- */

    @Action({ commit: "SET_AUTHENTICATED" })
    setAuthenticated(authenticated: boolean) {
        return authenticated;
    }
    @Action({ commit: "SET_AUTHENTICATED" })
    setConnected(connected: boolean) {
        return connected;
    }
    @Action({ commit: "SET_IS_TRAINER" })
    setIsTrainer(isTrainer: boolean) {
        return isTrainer;
    }
    @Action({ commit: "SET_IS_DEMO" })
    setIsDemo(isDemo: boolean) {
        return isDemo;
    }
    @Action({ commit: "SET_LOADING" })
    setLoading(loading: boolean) {
        return loading;
    }
    @Action({ commit: "SET_SILENT_LOADING" })
    setSilentLoading(silentLoading: boolean) {
        return silentLoading;
    }
    @Action({ commit: "SET_DONT_LEAVE" })
    setDontLeave(dontLeave: boolean) {
        return dontLeave;
    }
    @Action({ commit: "SET_DISABLE_BUTTONS" })
    setDisableButton(disableButton: boolean) {
        return disableButton;
    }
    @Action({ commit: "SET_NEW_BUILD" })
    setNewBuild(newBuild: boolean) {
        return newBuild;
    }
    @Action({ commit: "SET_CLAIMS" })
    setClaims(claims: TIBUserClaims) {
        return claims;
    }
    @Action({ commit: "SET_CLAIMS_GA" })
    setClaimsAnalytics(mode: boolean) {
        return mode;
    }
    @Action({ commit: "SET_CLAIMS_THEME" })
    setClaimsTheme(mode: DarkmodeType) {
        return mode;
    }
    @Action({ commit: "SET_PWA_DEFERRED_PROMPT" })
    setPWADeferredPrompt(e: Event) {
        return e;
    }
    @Action({ commit: "SET_PWA_CAN_INSTALL" })
    setPWACanInstall(canInstall: boolean) {
        return canInstall;
    }
    @Action({ commit: "SET_PWA_INSTALLED" })
    PWAInstalled() {
        return true;
    }
    @Action({ commit: "SET_PWA_DISPLAY_MODE" })
    setPWADisplayMode(mode: PWADisplayMode) {
        return mode;
    }
    @Action({ commit: "SET_CLIENT_USER_LOADED" })
    setClientUserLoaded(clientUserLoaded: boolean) {
        return clientUserLoaded;
    }

    //! To remove
    @Action({ commit: "SET_INSTANCE_READY" })
    setInstanceReady() {
        return true;
    }
}

import {
    getModule,
    Module,
    MutationAction,
    VuexModule,
} from "vuex-module-decorators";
import { PWADisplayMode, PWASettings } from "../types";
import store from "../..";

@Module({
    namespaced: true,
    name: "appState",
    store,
    dynamic: true,
})
class AppStateModule extends VuexModule {
    authenticated: boolean = false;
    connected: boolean = true;
    isTrainer: boolean = false;
    isDemo: boolean = false;
    loading: boolean = false;
    silentLoading: boolean = false;
    dontLeave: boolean = false;
    disableButtons: boolean = false;
    pwa: PWASettings = {
        deferredPrompt: null,
        displayMode: "browser tab",
        canInstall: false,
        installed: false,
    };
    clientUserLoaded: boolean = false;

    // Versioning
    policyVersion: string = "1.1";
    versionName: string = "Andromeda";
    versionBuild: string = "4.1";
    newBuild: boolean = false;

    //! To remove
    instanceReady: boolean = false;

    @MutationAction
    async setAuthenticated(authenticated: boolean) {
        return {
            authenticated,
        };
    }
    @MutationAction
    async setConnected(connected: boolean) {
        return {
            connected,
        };
    }
    @MutationAction
    async setIsTrainer(isTrainer: boolean) {
        return { isTrainer };
    }
    @MutationAction
    async setIsDemo(isDemo: boolean) {
        return { isDemo };
    }
    @MutationAction
    async stopLoaders() {
        return { loading: false, dontLeave: false, silentLoading: false };
    }
    @MutationAction
    async setLoading(loading: boolean) {
        return { loading };
    }
    @MutationAction
    async setSilentLoading(silentLoading: boolean) {
        return { silentLoading };
    }
    @MutationAction
    async setDontLeave(dontLeave: boolean) {
        return { dontLeave };
    }
    @MutationAction
    async setDisableButton(disableButtons: boolean) {
        return { disableButtons };
    }
    @MutationAction
    async setNewBuild(newBuild: boolean) {
        return { newBuild };
    }
    @MutationAction
    async setPWADeferredPrompt(deferredPrompt: Event | null) {
        return {
            pwa: {
                deferredPrompt,
            },
        };
    }
    @MutationAction
    async setPWACanInstall(canInstall: boolean) {
        return {
            pwa: {
                canInstall,
            },
        };
    }
    @MutationAction
    async PWAInstalled() {
        return {
            pwa: {
                installed: true,
            },
        };
    }
    @MutationAction
    async setPWADisplayMode(displayMode: PWADisplayMode) {
        return {
            pwa: {
                displayMode,
            },
        };
    }
    @MutationAction
    async setClientUserLoaded(clientUserLoaded: boolean) {
        return { clientUserLoaded };
    }

    //! To remove
    @MutationAction
    async setInstanceReady() {
        return {
            instanceReady: true,
        };
    }
}

export default getModule(AppStateModule);

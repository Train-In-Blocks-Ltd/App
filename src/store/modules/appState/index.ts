import { store } from "@/store";
import { Action, Module, Mutation, VuexModule } from "vuex-module-decorators";

@Module({ name: "app-state", store })
export default class AppState extends VuexModule {
    authenticated: boolean = false;
    isTrainer: boolean = false;
    isDemo: boolean = false;
    loading: boolean = false;
    silentLoading: boolean = false;
    dontLeave: boolean = false;
    disableButtons: boolean = false;

    @Mutation
    SET_AUTHENTICATED(authenticated: boolean) {
        this.authenticated = authenticated;
    }
    @Mutation
    SET_TRAINER(isTrainer: boolean) {
        this.isTrainer = isTrainer;
    }
    @Mutation
    SET_DEMO(isDemo: boolean) {
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

    @Action({ commit: "SET_AUTHENTICATED" })
    onAuthenticated() {
        return true;
    }
    @Action({ commit: "SET_AUTHENTICATED" })
    offAuthenticated() {
        return false;
    }
    @Action({ commit: "SET_TRAINER" })
    onTrainer() {
        return true;
    }
    @Action({ commit: "SET_TRAINER" })
    offTrainer() {
        return false;
    }
    @Action({ commit: "SET_DEMO" })
    onDemo() {
        return true;
    }
    @Action({ commit: "SET_DEMO" })
    offDemo() {
        return false;
    }
    @Action({ commit: "SET_LOADING" })
    onLoading() {
        return true;
    }
    @Action({ commit: "SET_LOADING" })
    offLoading() {
        return false;
    }
    @Action({ commit: "SET_SILENT_LOADING" })
    onSilentLoading() {
        return true;
    }
    @Action({ commit: "SET_SILENT_LOADING" })
    offSilentLoading() {
        return false;
    }
    @Action({ commit: "SET_DONT_LEAVE" })
    onDontLeave() {
        return true;
    }
    @Action({ commit: "SET_DONT_LEAVE" })
    offDontLeave() {
        return false;
    }
    @Action({ commit: "SET_DISABLE_BUTTONS" })
    onDisableButton() {
        return true;
    }
    @Action({ commit: "SET_DISABLE_BUTTONS" })
    offDisableButton() {
        return false;
    }
}

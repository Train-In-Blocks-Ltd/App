import {
    Action,
    getModule,
    Module,
    MutationAction,
    VuexModule,
} from "vuex-module-decorators";
import store from "../..";
import appState from "../appState";

type ResponsePopUpParams = {
    title: string;
    description?: string;
    persist?: boolean;
    backdrop?: boolean;
};

@Module({
    namespaced: true,
    name: "utils",
    store,
    dynamic: true,
})
class UtilsModule extends VuexModule {
    search: string = "";
    selectedIds: number[] = [];

    // Response pop-up
    responseOpen: boolean = false;
    responseTitle: string | null = "";
    responseDescription: string | null = "";
    responsePersist: boolean = false;
    responseBackdrop: boolean = false;

    @MutationAction
    async setSearch(search: string) {
        return { search };
    }
    @MutationAction
    async selectAll(selectedIds: number[]) {
        return { selectedIds };
    }
    @MutationAction
    async deselectAll() {
        return { selectedIds: [] as number[] };
    }
    @MutationAction
    async toggleCheckbox(id: number) {
        return {
            selectedIds: !this.selectedIds.includes(id)
                ? [...this.selectedIds, id]
                : this.selectedIds.filter((selectedId) => selectedId !== id),
        };
    }
    @MutationAction
    async openResponsePopUp({
        title,
        description,
        persist,
        backdrop,
    }: ResponsePopUpParams) {
        return {
            responseOpen: true,
            responseTitle: title,
            responseDescription: description,
            responsePersist: persist,
            responseBackdrop: backdrop,
        };
    }
    @MutationAction
    async closeResponsePopUp() {
        return {
            responseOpen: false,
            responseTitle: "",
            responseDescription: "",
            responsePersist: false,
            responseBackdrop: false,
        };
    }

    @Action
    async resolveError(msg: string) {
        appState.stopLoaders();
        this.openResponsePopUp({
            title: "ERROR: this problem has been reported to our developers",
            description:
                msg.toString() !== "Error: Network Error"
                    ? msg.toString()
                    : "You may be offline. We'll try that request again once you've reconnected",
            persist: true,
            backdrop: true,
        });
    }
}

export default getModule(UtilsModule);

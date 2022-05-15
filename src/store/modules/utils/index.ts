import {
    Action,
    getModule,
    Module,
    Mutation,
    MutationAction,
    VuexModule,
} from "vuex-module-decorators";
import store from "../..";
import appState from "../appState";
import { ModalSize } from "../types";

type ResponsePopUpParams = {
    title: string;
    description?: string;
    persist?: boolean;
    backdrop?: boolean;
};

type ModalParams =
    | {
          name: string;
          size?: string;
          persist?: boolean;
          previewTitle?: never;
          previewHTML?: never;
      }
    | {
          name: "preview";
          size?: string;
          persist?: boolean;
          previewTitle: string;
          previewHTML: string;
      };

type ConfirmPopUpParams = {
    title: string;
    text: string;
    onResolve: () => void;
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

    // Modal and preview
    modalOpen: boolean = false;
    modalContent: string | null = "";
    modalSize: ModalSize = "sm";
    modalPersist: boolean = false;
    previewTitle: string | null = "";
    previewHTML: string | null = "";

    // Confirm pop-up
    confirmOpen: boolean = false;
    confirmTitle: string | null = "";
    confirmText: string | null = "";
    confirmResolve: () => void = () => {};

    @MutationAction
    async setSearch(search: string) {
        return { search };
    }

    /* -------------------------------- Checkbox -------------------------------- */

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

    /* -------------------------------- Response -------------------------------- */

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

    /* ---------------------------------- Modal --------------------------------- */

    @MutationAction
    async openModal({
        name,
        size,
        persist,
        previewHTML,
        previewTitle,
    }: ModalParams) {
        return {
            modalOpen: true,
            modalContent: name,
            modalSize: size,
            modalPersist: persist,
            previewTitle,
            previewHTML,
        };
    }
    @MutationAction
    async closeModal() {
        return {
            modalOpen: false,
            modalContent: "",
            modalSize: "sm",
            modalPersist: false,
            previewTitle: "",
            previewHTML: "",
        };
    }

    /* ------------------------------ Confirmation ------------------------------ */

    @Mutation
    SET_CONFIRM_POP_UP({
        mode,
        title,
        text,
        onResolve,
    }: ConfirmPopUpParams & { mode: boolean }) {
        this.confirmOpen = mode;
        this.confirmTitle = title;
        this.confirmText = text;
        this.confirmResolve = onResolve;
    }
    @Action({ commit: "SET_CONFIRM_POP_UP" })
    async openConfirmPopUp(params: ConfirmPopUpParams) {
        return {
            mode: true,
            ...params,
        };
    }
    @MutationAction
    async closeConfirmPopUp() {
        return {
            confirmOpen: false,
            confirmTitle: "",
            confirmText: "",
            confirmResolve: () => {},
        };
    }

    /* ---------------------------------- Error --------------------------------- */

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

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
import { ConfirmRef, ModalSize } from "../types";

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

    // Refs
    confirmRef: ConfirmRef = null;

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

    /* ------------------------------ Pop-ups ------------------------------ */

    @MutationAction
    async setConfirmRef(confirmRef: ConfirmRef) {
        return {
            confirmRef,
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

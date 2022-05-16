import {
    Action,
    getModule,
    Module,
    MutationAction,
    VuexModule,
} from "vuex-module-decorators";
import store from "../..";
import appState from "../appState";
import {
    ConfirmPopUpRef,
    ModalSize,
    ResponsePopUpRef,
    UploadPopUpRef,
} from "../types";
import { Editor } from "@tiptap/core";

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

    // Modal and preview
    modalOpen: boolean = false;
    modalContent: string | null = "";
    modalSize: ModalSize = "sm";
    modalPersist: boolean = false;
    previewTitle: string | null = "";
    previewHTML: string | null = "";

    // Refs
    responsePopUpRef: ResponsePopUpRef = null;
    confirmPopUpRef: ConfirmPopUpRef = null;
    uploadPopUpRef: UploadPopUpRef = null;

    // Editor
    editor: Editor | null = null;
    newImgs = [];

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
    async setResponsePopUpRef(responsePopUpRef: ResponsePopUpRef) {
        return {
            responsePopUpRef,
        };
    }
    @MutationAction
    async setConfirmPopUpRef(confirmPopUpRef: ConfirmPopUpRef) {
        return {
            confirmPopUpRef,
        };
    }
    @MutationAction
    async setUploadPopUpRef(uploadPopUpRef: UploadPopUpRef) {
        return {
            uploadPopUpRef,
        };
    }

    /* --------------------------------- Editor --------------------------------- */

    @MutationAction
    async setEditor(editor: Editor | null) {
        return {
            editor,
        };
    }
    @MutationAction
    async setNewImgs(newImgs: string[]) {
        return {
            newImgs,
        };
    }

    /* ---------------------------------- Error --------------------------------- */

    @Action
    async resolveError(msg: string) {
        appState.stopLoaders();
        this.responsePopUpRef?.open({
            title: "ERROR: this problem has been reported to our developers",
            text:
                msg.toString() !== "Error: Network Error"
                    ? msg.toString()
                    : "You may be offline. We'll try that request again once you've reconnected",
            persist: true,
            backdrop: true,
        });
    }
}

export default getModule(UtilsModule);
